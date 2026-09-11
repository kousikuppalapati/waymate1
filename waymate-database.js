// Waymate MongoDB database definition
// Safe to commit to GitHub: no passwords, JWT secrets, or Atlas credentials.
// Run with mongosh after connecting to your Atlas cluster.

const dbName = "waymate";
const waymate = db.getSiblingDB(dbName);

const collections = [
  "profiles",
  "vehicles",
  "ride_offers",
  "ride_requests",
  "bike_requests",
  "bookings",
  "credit_transactions",
  "notifications",
  "community_events"
];

for (const name of collections) {
  if (!waymate.getCollectionNames().includes(name)) {
    waymate.createCollection(name);
  }
}

// -------------------------
// Indexes
// -------------------------

waymate.profiles.createIndex({ email: 1 }, { unique: true, sparse: true });
waymate.profiles.createIndex({ user_code: 1 }, { unique: true, sparse: true });

waymate.vehicles.createIndex({ owner_id: 1 });
waymate.vehicles.createIndex({ is_available: 1 });

waymate.ride_offers.createIndex({ driver_id: 1 });
waymate.ride_offers.createIndex({ vehicle_id: 1 });
waymate.ride_offers.createIndex({ status: 1, departure_time: 1 });
waymate.ride_offers.createIndex({
  from_location: 1,
  to_location: 1,
  departure_time: 1
});

waymate.ride_requests.createIndex({ ride_offer_id: 1 });
waymate.ride_requests.createIndex({ requester_id: 1 });
waymate.ride_requests.createIndex({ driver_id: 1 });
waymate.ride_requests.createIndex({ status: 1 });

waymate.bike_requests.createIndex({ vehicle_id: 1 });
waymate.bike_requests.createIndex({ requester_id: 1 });
waymate.bike_requests.createIndex({ owner_id: 1 });
waymate.bike_requests.createIndex({ status: 1 });

waymate.bookings.createIndex({ user_id: 1, created_at: -1 });
waymate.bookings.createIndex({ ride_offer_id: 1 });
waymate.bookings.createIndex({ vehicle_id: 1 });
waymate.bookings.createIndex({ status: 1 });

waymate.credit_transactions.createIndex({ user_id: 1, created_at: -1 });
waymate.credit_transactions.createIndex({ ride_request_id: 1 });
waymate.credit_transactions.createIndex({ bike_request_id: 1 });

waymate.notifications.createIndex({ recipient_id: 1, is_read: 1, created_at: -1 });

waymate.community_events.createIndex({ start_time: 1 });

// -------------------------
// Example Waymate document shapes
// These are intentionally examples only.
// The application creates real records.
// -------------------------

// profiles
// {
//   _id: "user-...",
//   full_name: "Student Name",
//   email: "student@example.com",
//   college: "PVPSIT",
//   avatar_url: null,
//   trust_score: 0,
//   credits: 0,
//   created_at: ISODate(),
//   updated_at: ISODate(),
//   user_code: "FR-..."
// }

// vehicles
// {
//   _id: "vehicle-...",
//   owner_id: "user-...",
//   vehicle_type: "BIKE",
//   brand: "Honda",
//   model: "Activa 6G",
//   registration_number: "AP00XX0000",
//   seats: 2,
//   is_available: true,
//   created_at: ISODate(),
//   updated_at: ISODate()
// }

// ride_offers
// {
//   _id: "ride-...",
//   driver_id: "user-...",
//   vehicle_id: "vehicle-...",
//   from_location: "PVPSIT Parking",
//   to_location: "Green Residency PG",
//   departure_time: ISODate(),
//   available_seats: 2,
//   credits_per_seat: 13,
//   notes: "Leaving right after class.",
//   status: "ACTIVE",
//   created_at: ISODate()
// }

// ride_requests
// {
//   _id: "request-...",
//   ride_offer_id: "ride-...",
//   requester_id: "user-...",
//   driver_id: "user-...",
//   seats_requested: 1,
//   message: "",
//   status: "PENDING",
//   created_at: ISODate(),
//   responded_at: null
// }

// bike_requests
// {
//   _id: "bike-request-...",
//   vehicle_id: "vehicle-...",
//   requester_id: "user-...",
//   owner_id: "user-...",
//   start_time: ISODate(),
//   end_time: ISODate(),
//   message: "",
//   status: "PENDING",
//   created_at: ISODate(),
//   responded_at: null
// }

// bookings
// {
//   _id: "booking-...",
//   user_id: "user-...",
//   ride_offer_id: "ride-...",
//   vehicle_id: "vehicle-...",
//   ride_request_id: "request-...",
//   bike_request_id: null,
//   start_time: ISODate(),
//   end_time: ISODate(),
//   credits_paid: 14,
//   status: "CONFIRMED",
//   created_at: ISODate()
// }

// credit_transactions
// {
//   _id: "credit-tx-...",
//   user_id: "user-...",
//   amount: -14,
//   transaction_type: "RIDE_PAYMENT",
//   description: "Ride contribution",
//   ride_request_id: "request-...",
//   bike_request_id: null,
//   created_at: ISODate()
// }

// notifications
// {
//   _id: "notification-...",
//   recipient_id: "user-...",
//   sender_id: "user-...",
//   type: "RIDE_REQUEST",
//   title: "New ride request",
//   message: "A student requested a seat.",
//   ride_request_id: "request-...",
//   bike_request_id: null,
//   booking_id: null,
//   is_read: false,
//   created_at: ISODate()
// }

// community_events
// {
//   _id: "event-...",
//   title: "Campus Hackathon",
//   description: "Student hackathon event.",
//   location: "PVPSIT",
//   start_time: ISODate(),
//   end_time: ISODate(),
//   expected_attendance: 100,
//   created_at: ISODate()
// }

print(`Waymate database '${dbName}' is ready.`);
printjson(waymate.getCollectionNames());
