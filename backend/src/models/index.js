import mongoose from 'mongoose';
const { Schema } = mongoose;
const base = { _id: String };

export const Profile = mongoose.model('Profile', new Schema({
  ...base, full_name:String, email:{type:String,unique:true,sparse:true}, college:String, avatar_url:String,
  trust_score:{type:Number,default:0}, credits:{type:Number,default:0}, created_at:Date, updated_at:Date,
  user_code:{type:String,unique:true,sparse:true}, username:String, phone:String, registration_number:String,
  pg_area:String, community:String, role:String, is_verified:Boolean, verification_status:String, verification_step:String,
  rating:{type:Number,default:0}, reviews_count:{type:Number,default:0}, rides_completed:{type:Number,default:0}, rides_shared:{type:Number,default:0},
  password_hash:String, bike_number:String, bike_colour:String, fuel_type:String, is_ev:Boolean, vehicle_label:String,
  reliability_score:String, mutual_connections:{type:Number,default:0}, available_for_lending:Boolean, college_domain:String, primary_routes:[String]
},{strict:false,versionKey:false,collection:'profiles'}));

export const Vehicle = mongoose.model('Vehicle', new Schema({
  ...base, owner_id:String, vehicle_type:String, brand:String, model:String, registration_number:String, seats:Number,
  is_available:Boolean, created_at:Date, updated_at:Date, vehicle_colour:String, fuel_type:String, is_ev:Boolean, available_for_lending:Boolean
},{strict:false,versionKey:false,collection:'vehicles'}));

export const RideOffer = mongoose.model('RideOffer', new Schema({
  ...base, driver_id:String, vehicle_id:String, from_location:String, to_location:String, departure_time:Date,
  available_seats:Number, credits_per_seat:Number, notes:String, status:String, created_at:Date, seats_total:Number, distance_km:Number, requests_count:Number
},{strict:false,versionKey:false,collection:'ride_offers'}));

export const RideRequest = mongoose.model('RideRequest', new Schema({
  ...base, ride_offer_id:String, requester_id:String, driver_id:String, seats_requested:Number, message:String,
  status:String, created_at:Date, responded_at:Date
},{strict:false,versionKey:false,collection:'ride_requests'}));

export const BikeRequest = mongoose.model('BikeRequest', new Schema({
  ...base, vehicle_id:String, requester_id:String, owner_id:String, start_time:Date, end_time:Date, message:String,
  status:String, created_at:Date, responded_at:Date, borrow_purpose:String, cost_credits:Number, location:String
},{strict:false,versionKey:false,collection:'bike_requests'}));

export const Booking = mongoose.model('Booking', new Schema({
  ...base, user_id:String, ride_offer_id:String, vehicle_id:String, ride_request_id:String, bike_request_id:String,
  start_time:Date, end_time:Date, credits_paid:Number, status:String, created_at:Date, type:String, seats_booked:Number,
  provider_id:String, from_location:String, to_location:String, departure_time:Date, partner_name:String, partner_avatar:String,
  partner_role:String, contribution:Number, confirmed_at:Date
},{strict:false,versionKey:false,collection:'bookings'}));

export const CreditTransaction = mongoose.model('CreditTransaction', new Schema({
  ...base, user_id:String, amount:Number, transaction_type:String, description:String, ride_request_id:String, bike_request_id:String, created_at:Date, ride_offer_id:String
},{strict:false,versionKey:false,collection:'credit_transactions'}));

export const Notification = mongoose.model('Notification', new Schema({
  ...base, recipient_id:String, sender_id:String, type:String, title:String, message:String, ride_request_id:String,
  bike_request_id:String, booking_id:String, is_read:Boolean, created_at:Date, ride_offer_id:String
},{strict:false,versionKey:false,collection:'notifications'}));

export const CommunityEvent = mongoose.model('CommunityEvent', new Schema({
  ...base, title:String, description:String, location:String, start_time:Date, end_time:Date, expected_attendance:Number,
  expected_demand:Number, demand:String, corridor:String, created_at:Date
},{strict:false,versionKey:false,collection:'community_events'}));

export const models = { Profile, Vehicle, RideOffer, RideRequest, BikeRequest, Booking, CreditTransaction, Notification, CommunityEvent };
