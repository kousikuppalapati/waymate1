import fs from 'node:fs/promises';
import { Profile, Vehicle, RideOffer, RideRequest, BikeRequest, Booking, CreditTransaction, Notification, CommunityEvent } from './models/index.js';

const raw = JSON.parse(await fs.readFile(new URL('./seed-data.json', import.meta.url), 'utf8'));
const dt = value => value ? new Date(value) : null;

export async function seedDatabase() {
  const now = new Date();
  const users = raw.users.map(u => ({
    _id:u.id, full_name:u.name, email:u.email, college:u.college, avatar_url:u.avatar, trust_score:u.rating||0,
    credits:Number(u.walletBalance||0), created_at:dt(u.createdAt)||now, updated_at:now, user_code:u.generatedUserId,
    username:u.username, phone:u.phone, registration_number:u.collegeId, pg_area:u.pgArea, community:u.community, role:u.role,
    is_verified:Boolean(u.isVerified), verification_status:u.verificationStatus, verification_step:u.verificationStep,
    rating:Number(u.rating||0), reviews_count:Number(u.reviewsCount||0), rides_completed:Number(u.ridesCompleted||0), rides_shared:Number(u.ridesShared||0),
    password_hash:u.passwordHash, bike_number:u.bikeNumber, bike_colour:u.bikeColour, fuel_type:u.fuelType, is_ev:Boolean(u.isEv),
    vehicle_label:u.vehicleModel||u.vehicle, reliability_score:u.reliabilityScore, mutual_connections:Number(u.mutualConnections||0),
    available_for_lending:Boolean(u.availableForLending), college_domain:u.collegeDomain, primary_routes:u.primaryRoutes||[]
  }));
  for (const doc of users) await Profile.updateOne({ _id: doc._id }, { $setOnInsert: doc }, { upsert: true });

  const vehicles = raw.vehicles.map(v=>({
    _id:v.id, owner_id:v.ownerId, vehicle_type:v.vehicleType, brand:v.brand, model:v.model, registration_number:v.registrationNumber,
    seats:Number(v.seats||1), is_available:v.isAvailable!==false, created_at:now, updated_at:now, vehicle_colour:v.vehicleColour,
    fuel_type:v.fuelType, is_ev:Boolean(v.isEv), available_for_lending:Boolean(v.availableForLending)
  }));
  for (const doc of vehicles) await Vehicle.updateOne({ _id: doc._id }, { $setOnInsert: doc }, { upsert: true });

  const profileById = Object.fromEntries(users.map(u=>[u._id,u]));
  const vehicleByOwner = Object.fromEntries(vehicles.map(v=>[v.owner_id,v._id]));
  const rides = raw.rides.map(r=>({
    _id:r.id, driver_id:r.providerId, vehicle_id:vehicleByOwner[r.providerId]||null, from_location:r.from, to_location:r.to,
    departure_time: (()=>{ const d=new Date(); const m=String(r.departureTime||'5:30 PM').match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i); if(m){let h=+m[1]; if((m[3]||'').toUpperCase()==='PM'&&h<12)h+=12;if((m[3]||'').toUpperCase()==='AM'&&h===12)h=0; d.setHours(h,+m[2],0,0);} return d; })(),
    available_seats:Number(r.seatsAvailable??r.seatsTotal??1), credits_per_seat:Number(r.contribution||12), notes:r.note||'', status:r.status||'ACTIVE', created_at:dt(r.createdAt)||now,
    seats_total:Number(r.seatsTotal||r.seatsAvailable||1), distance_km:Number(r.distanceKm||4.2), requests_count:Number(r.requestsCount||0)
  }));
  for (const doc of rides) await RideOffer.updateOne({ _id: doc._id }, { $setOnInsert: doc }, { upsert: true });

  // Preserve the original schema: lending state lives in bike_requests, not a separate lending collection.
  const lends = raw.lending||[];
  const br = lends.map(l=>({ _id:l.id, vehicle_id:l.vehicleId, requester_id:l.requesterId||null, owner_id:l.ownerId, start_time:null, end_time:null,
    message:l.notes||'', status:l.status==='AVAILABLE'?'AVAILABLE':(l.status||'AVAILABLE'), created_at:dt(l.updatedAt)||now, responded_at:null,
    borrow_purpose:l.borrowPurpose||null, cost_credits:Number(l.costCredits||0), location:l.location||null }));
  for (const doc of br) await BikeRequest.updateOne({ _id: doc._id }, { $setOnInsert: doc }, { upsert: true });

  const walletEntries=[];
  for(const [uid,w] of Object.entries(raw.wallets||{})) for(const t of (w.transactions||[])) walletEntries.push({
    _id:t.id, user_id:uid, amount:t.type==='USED'?-Number(t.amount||0):Number(t.amount||0), transaction_type:t.type==='USED'?'RIDE_PAYMENT':'RIDE_EARNING',
    description:t.description||'', ride_request_id:null, bike_request_id:null, ride_offer_id:t.rideId||null, created_at:dt(t.timestamp)||now
  });
  for (const doc of walletEntries) await CreditTransaction.updateOne({ _id: doc._id }, { $setOnInsert: doc }, { upsert: true });

  // Convert the frontend's seeded booking cards to database bookings.
  const rideById = Object.fromEntries(rides.map(r => [r._id, r]));
  const bookings = (raw.bookings||[]).map(b=>({
    _id:b.id, user_id:b.userId, ride_offer_id:b.rideId||null, vehicle_id:rideById[b.rideId||'']?.vehicle_id||null, ride_request_id:null, bike_request_id:null,
    start_time:null,end_time:null,credits_paid:Number(b.contribution||0),status:b.status||'UPCOMING',created_at:dt(b.createdAt)||now,
    type:b.type||'PASSENGER',seats_booked:Number(b.seatsBooked||1),provider_id:b.providerId||null,from_location:b.from,to_location:b.to,
    departure_time:null,partner_name:b.partnerName,partner_avatar:b.partnerAvatar,partner_role:b.partnerRole,contribution:Number(b.contribution||0)
  }));
  for (const doc of bookings) await Booking.updateOne({ _id: doc._id }, { $setOnInsert: doc }, { upsert: true });

  const requests=(raw.rideRequests||[]).map(r=>({ _id:r.id, ride_offer_id:r.rideId||null, requester_id:r.requesterId, driver_id:r.providerId||r.driverId||null,
    seats_requested:Number(r.seatsRequested||r.seats||1), message:r.message||'', status:r.status||'PENDING', created_at:dt(r.createdAt)||now, responded_at:dt(r.respondedAt) }));
  for (const doc of requests) await RideRequest.updateOne({ _id: doc._id }, { $setOnInsert: doc }, { upsert: true });

  const notifications=(raw.notifications||[]).map(n=>({ _id:n.id, recipient_id:n.recipientId, sender_id:n.senderId, type:n.type,title:n.title,message:n.message,
    ride_request_id:null,bike_request_id:n.bike_request_id||null,booking_id:n.bookingId||null,is_read:Boolean(n.is_read),created_at:dt(n.createdAt)||now,ride_offer_id:n.rideId||null }));
  for (const doc of notifications) await Notification.updateOne({ _id: doc._id }, { $setOnInsert: doc }, { upsert: true });

  const events=(raw.events||[]).map(e=>({ _id:e.id,title:e.title,description:e.description||'',location:e.location,start_time:now,end_time:null,
    expected_attendance:Number(e.attendees||0),expected_demand:Number(e.expectedDemand||0),demand:e.demand||'Moderate',corridor:e.corridor||'',created_at:now }));
  for (const doc of events) await CommunityEvent.updateOne({ _id: doc._id }, { $setOnInsert: doc }, { upsert: true });
  return true;
}
