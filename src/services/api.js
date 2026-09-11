// Waymate integration layer.
// The UI is intentionally unchanged; all persistent data operations go through the MongoDB API.
const SESSION_KEY = 'waymate_session_v2';
const CACHE_KEY = 'waymate_api_cache_v2';
const OFFLINE_KEY = 'waymate_simulated_offline';
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
const activeMutations = new Set();

const emptyDb = { user:null, users:[], vehicles:[], rides:[], bookings:[], rideRequests:[], reviews:[], lending:[], notifications:[], events:[], wallet:{balance:0,thisMonthEarned:0,thisMonthUsed:0,transactions:[]}, platformStats:{sharedRides:0,members:0,carbonSaved:0,todayBooked:0,todayOffered:0,activeRequests:0} };
const readCache=()=>{try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'null')||emptyDb;}catch{return emptyDb;}};
const writeCache=db=>{try{localStorage.setItem(CACHE_KEY,JSON.stringify(db));}catch{ /* avatar data may exceed local cache; server remains source of truth */ }};
const setBootstrap=b=>{if(b){writeCache(b);return b;}return readCache();};

export const isNetworkAvailable=()=>typeof window==='undefined'?true:(navigator.onLine && localStorage.getItem(OFFLINE_KEY)!=='true');
export const setSimulatedOfflineMode=offline=>{localStorage.setItem(OFFLINE_KEY,offline?'true':'false');window.dispatchEvent(new Event('waymate_offline_change'));};
export const getSimulatedOfflineMode=()=>localStorage.getItem(OFFLINE_KEY)==='true';
export const getSession=()=>{try{return JSON.parse(localStorage.getItem(SESSION_KEY)||'null');}catch{return null;}};
export const clearSession=()=>{localStorage.removeItem(SESSION_KEY);localStorage.removeItem(CACHE_KEY);};
export const loadDatabase=()=>readCache();
export const saveDatabase=db=>writeCache(db);
export const resetDatabase=()=>{localStorage.removeItem(CACHE_KEY);localStorage.removeItem(OFFLINE_KEY);clearSession();return emptyDb;};

async function request(path,{method='GET',body,auth=true,mutationKey}={}){
 if(!isNetworkAvailable()){const e=new Error('Network unavailable: Check your connection and try again.');e.name='OfflineError';e.status=503;throw e;}
 if(mutationKey){if(activeMutations.has(mutationKey)){const e=new Error('A request is already in progress. Please wait.');e.status=409;throw e;}activeMutations.add(mutationKey);}
 try{const headers={'Content-Type':'application/json'};const session=getSession();if(auth&&session?.token)headers.Authorization=`Bearer ${session.token}`;const res=await fetch(`${API_BASE}${path}`,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});let data={};try{data=await res.json();}catch{}if(!res.ok){const e=new Error(data.message||`Request failed (${res.status}).`);e.status=res.status;Object.assign(e,data);throw e;}if(data.bootstrap)setBootstrap(data.bootstrap);return data;}finally{if(mutationKey)activeMutations.delete(mutationKey);}}

export const hydratePublic=async()=>setBootstrap((await request('/app/public',{auth:false})).bootstrap);
export const hydrateAuthenticated=async()=>{const data=await request('/app/bootstrap');return setBootstrap(data.bootstrap);};

export const apiSignUp=async(form)=>{const data=await request('/auth/signup',{method:'POST',body:form,auth:false,mutationKey:`signup-${String(form.email).toLowerCase()}`});localStorage.setItem(SESSION_KEY,JSON.stringify({userId:data.bootstrap.user.id,token:data.token,loggedInAt:Date.now()}));setBootstrap(data.bootstrap);return {success:true,user:data.bootstrap.user,wallet:data.bootstrap.wallet,userCount:data.userCount};};
export const apiLogin=async(form)=>{const data=await request('/auth/login',{method:'POST',body:form,auth:false,mutationKey:`login-${String(form.emailOrUserId).toLowerCase()}`});localStorage.setItem(SESSION_KEY,JSON.stringify({userId:data.bootstrap.user.id,token:data.token,loggedInAt:Date.now()}));setBootstrap(data.bootstrap);return {success:true,user:data.bootstrap.user,wallet:data.bootstrap.wallet,userCount:data.userCount};};
export const apiLogout=()=>{clearSession();return {success:true};};
export const apiUpdateProfile=async(body)=>{const data=await request('/user/profile',{method:'PUT',body,mutationKey:'profile-update'});return {success:true,user:data.bootstrap.user};};
export const apiVerifyUser=async(body)=>{const data=await request('/user/verify',{method:'POST',body,mutationKey:'user-verify'});return {success:true,user:data.bootstrap.user};};
export const apiFetchRides=async(filters={})=>(await request(`/rides?${new URLSearchParams(filters)}`,{auth:false})).rides;

export const apiBookSeat=async({rideId,seats=1,notes=''})=>{const data=await request(`/rides/${encodeURIComponent(rideId)}/book`,{method:'POST',body:{seats,notes},mutationKey:`book-${rideId}`});return {success:true,booking:data.bootstrap.bookings.find(b=>b.rideId===rideId&&b.userId===data.bootstrap.user.id),ride:data.bootstrap.rides.find(r=>r.id===rideId),wallet:data.bootstrap.wallet};};
export const apiConfirmBooking=async bookingId=>{const data=await request(`/bookings/${encodeURIComponent(bookingId)}/confirm`,{method:'POST',body:{},mutationKey:`confirm-${bookingId}`});return {success:true,booking:data.bootstrap.bookings.find(b=>b.id===bookingId)};};

function departureISO(dateLabel,time){const base=new Date();if(String(dateLabel||'Today').toLowerCase()!=='today')base.setDate(base.getDate()+1);const m=String(time||'5:30 PM').match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);if(m){let h=Number(m[1]);const ap=(m[3]||'').toUpperCase();if(ap==='PM'&&h<12)h+=12;if(ap==='AM'&&h===12)h=0;base.setHours(h,Number(m[2]),0,0);}return base.toISOString();}
export const apiCreateRide=async(rideData)=>{const payload={...rideData,departureTimeISO:departureISO(rideData.date,rideData.departureTime)};const data=await request('/rides',{method:'POST',body:payload,mutationKey:`create-ride-${Date.now()}`});return {success:true,ride:data.bootstrap.rides.find(r=>r.from===rideData.from.trim()&&r.to===rideData.to.trim()&&r.status==='ACTIVE'),booking:data.bootstrap.bookings.find(b=>b.type==='PROVIDER'&&b.userId===data.bootstrap.user.id)};};
export const apiCancelTrip=async bookingId=>{const data=await request(`/trips/${encodeURIComponent(bookingId)}/cancel`,{method:'POST',body:{},mutationKey:`cancel-${bookingId}`});return {success:true,booking:data.bootstrap.bookings.find(b=>b.id===bookingId),wallet:data.bootstrap.wallet};};

export const apiRequestVehicleLend=async(vehicleId,borrowPurpose='')=>{const data=await request(`/lending/${encodeURIComponent(vehicleId)}/request`,{method:'POST',body:{purpose:borrowPurpose},mutationKey:`lend-req-${vehicleId}`});return {success:true,vehicle:data.bootstrap.lending.find(v=>v.id===vehicleId)};};
export const apiApproveVehicleLend=async(id)=>{const data=await request(`/lending/${encodeURIComponent(id)}/approve`,{method:'POST',body:{},mutationKey:`lend-approve-${id}`});return {success:true,vehicle:data.bootstrap.lending.find(v=>v.id===id)};};
export const apiDeclineVehicleLend=async(id)=>{const data=await request(`/lending/${encodeURIComponent(id)}/decline`,{method:'POST',body:{},mutationKey:`lend-decline-${id}`});return {success:true,vehicle:data.bootstrap.lending.find(v=>v.id===id)};};
export const apiHandoverVehicleLend=async(id)=>{const data=await request(`/lending/${encodeURIComponent(id)}/handover`,{method:'POST',body:{},mutationKey:`lend-handover-${id}`});return {success:true,vehicle:data.bootstrap.lending.find(v=>v.id===id)};};
export const apiReturnVehicleLend=async(id)=>{const data=await request(`/lending/${encodeURIComponent(id)}/return`,{method:'POST',body:{},mutationKey:`lend-return-${id}`});return {success:true,vehicle:data.bootstrap.lending.find(v=>v.id===id)};};
export const apiCreateEvent=async eventData=>{const data=await request('/events/create',{method:'POST',body:eventData,mutationKey:`event-${Date.now()}`});return {success:true,event:data.event};};
export const apiFetchNotifications=async()=>{const data=await request('/notifications');return data.notifications;};
export const apiMarkNotificationAsRead=async id=>{const data=await request(`/notifications/${encodeURIComponent(id)}/read`,{method:'POST',body:{},mutationKey:`read-${id}`});return {success:true,notification:data.bootstrap.notifications.find(n=>n.id===id)};};
export const apiMarkAllNotificationsAsRead=async userId=>{await request('/notifications/read-all',{method:'POST',body:{userId},mutationKey:`read-all-${userId}`});return {success:true};};
