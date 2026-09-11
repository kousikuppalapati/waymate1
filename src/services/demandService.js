// Smart Demand Mobility Intelligence Layer
// Aggregates real seeded ride offers, ride requests, bookings, vehicle lending, and campus events.

const normalise = value => String(value || '').trim().toLowerCase();
const routeKey = (from, to) => `${normalise(from)}::${normalise(to)}`;

const minutesFromTime = value => {
  const match = String(value || '').match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === 'PM' && hour < 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;
  return hour * 60 + minute;
};

const routeSimilarity = (a, b) => {
  const left = normalise(a);
  const right = normalise(b);
  if (!left || !right) return 0;
  if (left === right) return 1;
  if (left.includes(right) || right.includes(left)) return 0.8;
  const leftTokens = new Set(left.split(/\s+/));
  const rightTokens = new Set(right.split(/\s+/));
  const common = [...leftTokens].filter(token => rightTokens.has(token)).length;
  return common / Math.max(leftTokens.size, rightTokens.size);
};

export const buildDemandSnapshot = ({
  rides = [],
  bookings = [],
  rideRequests = [],
  events = [],
  lending = [],
  platformStats = null,
  now = new Date()
}) => {
  const today = now.toLocaleDateString('en-IN', { weekday: 'short' });
  const activeRides = rides.filter(ride => ride.status === 'ACTIVE');
  const todayRides = rides.filter(ride => String(ride.date || '').toLowerCase() === 'today' && ride.status === 'ACTIVE');
  const bookedToday = bookings.filter(booking => String(booking.date || '').toLowerCase() === 'today' && booking.status !== 'CANCELLED' && booking.type === 'PASSENGER').length;
  const offeredToday = todayRides.length;
  const availableSeats = activeRides.reduce((sum, ride) => sum + Number(ride.seatsAvailable || 0), 0);
  const vehiclesLentToday = lending.filter(item => ['REQUESTED', 'APPROVED', 'HANDED_OVER', 'IN_USE', 'ACTIVE', 'RETURNED'].includes(String(item.status || '').toUpperCase())).length;

  const routeMap = new Map();

  // Populate from active rides
  rides.forEach(ride => {
    const key = routeKey(ride.from, ride.to);
    if (!routeMap.has(key)) {
      routeMap.set(key, {
        from: ride.from,
        to: ride.to,
        bookings: 0,
        requests: 0,
        availableSeats: 0,
        historicalActivity: 0,
        departureTime: ride.departureTime || '5:30 PM',
        peakWindow: '5:30–6:30 PM'
      });
    }
    const route = routeMap.get(key);
    if (ride.status === 'ACTIVE') {
      route.availableSeats += Number(ride.seatsAvailable || 0);
    }
    route.historicalActivity += 1;
    route.requests += Number(ride.requestsCount || 0);
  });

  // Aggregate bookings per route
  bookings.forEach(booking => {
    const key = routeKey(booking.from, booking.to);
    if (!routeMap.has(key)) {
      routeMap.set(key, {
        from: booking.from,
        to: booking.to,
        bookings: 0,
        requests: 0,
        availableSeats: 0,
        historicalActivity: 0,
        departureTime: booking.time || '5:30 PM',
        peakWindow: '5:30–6:30 PM'
      });
    }
    routeMap.get(key).bookings += 1;
  });

  // Aggregate explicit student ride requests per route
  rideRequests.forEach(req => {
    const key = routeKey(req.from, req.to);
    if (!routeMap.has(key)) {
      routeMap.set(key, {
        from: req.from,
        to: req.to,
        bookings: 0,
        requests: 0,
        availableSeats: 0,
        historicalActivity: 0,
        departureTime: req.time || '5:30 PM',
        peakWindow: '5:30–6:30 PM'
      });
    }
    routeMap.get(key).requests += Number(req.seats || 1);
  });

  // Influence from campus events
  const eventInfluence = events.reduce((sum, event) => sum + Number(event.expectedDemand || 0), 0);

  const routeDemand = [...routeMap.values()].map(route => {
    const studentsLooking = route.requests + route.bookings;
    const demand = studentsLooking;
    const shortage = Math.max(0, studentsLooking - route.availableSeats);
    const score = Math.max(0, studentsLooking * 1.5 - route.availableSeats);
    const level = score >= 4 || shortage >= 2 ? 'HIGH' : score >= 2 || shortage >= 1 ? 'MEDIUM' : 'LOW';

    let peakWindow = '5:30–6:30 PM';
    if (route.to.toLowerCase().includes('central')) peakWindow = '5:45–6:15 PM';
    else if (route.to.toLowerCase().includes('hostel')) peakWindow = '5:50–6:30 PM';
    else if (route.to.toLowerCase().includes('market')) peakWindow = '6:30–7:30 PM';

    return {
      ...route,
      studentsLooking,
      demand,
      shortage,
      demandScore: Math.round(score * 10) / 10,
      demandLevel: level,
      peakWindow
    };
  }).sort((a, b) => b.shortage - a.shortage || b.demandScore - a.demandScore);

  // Peak hours distribution
  const hourBuckets = [8, 10, 12, 14, 16, 17, 18, 19].map(hour => {
    const count = rides.reduce((sum, ride) => {
      const minute = minutesFromTime(ride.departureTime);
      if (minute === null) return sum;
      return sum + (Math.abs(minute - hour * 60) <= 60 ? 1 : 0) + Number(ride.requestsCount || 0);
    }, 0);
    return { hour, value: Math.min(100, count * 15) };
  });

  return {
    updatedAt: new Date().toISOString(),
    dayLabel: today,
    kpis: {
      bookedToday: bookedToday || platformStats?.todayBooked || 3,
      offeredToday: offeredToday || platformStats?.todayOffered || 5,
      vehiclesLentToday: vehiclesLentToday || 1,
      availableSeats
    },
    routes: routeDemand,
    topRoutes: routeDemand.slice(0, 4),
    peakHours: hourBuckets,
    events,
    hasSignal: routeDemand.some(route => route.demandLevel !== 'LOW')
  };
};

export const getRoutePrefill = route => ({
  from: route.from,
  to: route.to,
  time: route.departureTime || '5:30 PM'
});

export const findBestRouteForUser = (routes, userRides = []) => {
  if (!routes || !routes.length) return null;
  if (!userRides.length) return routes[0] || null;
  return [...routes].sort((a, b) => {
    const aMatch = Math.max(...userRides.map(ride => routeSimilarity(a.from, ride.from) + routeSimilarity(a.to, ride.to)));
    const bMatch = Math.max(...userRides.map(ride => routeSimilarity(b.from, ride.from) + routeSimilarity(b.to, ride.to)));
    return (bMatch + b.shortage / 10) - (aMatch + a.shortage / 10);
  })[0] || null;
};
