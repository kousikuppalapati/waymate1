export const CAMPUS_ANCHOR = {
  name: 'PVPSIT Parking',
  latitude: 16.4874,
  longitude: 80.6718
};

const LOCATION_ALIASES = {
  'metro station': 'metro station (purple line)',
  'metro': 'metro station (purple line)',
  'hostel': 'student housing complex',
  'pg area': 'green residency pg',
  'pvp sit parking': 'pvpsit parking',
  'campus': 'pvpsit parking'
};

const normaliseLocation = value => {
  const text = String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
  return LOCATION_ALIASES[text] || text;
};

const locationTokens = value => new Set(normaliseLocation(value).split(/[^a-z0-9]+/).filter(Boolean));

const locationSimilarity = (a, b) => {
  const left = normaliseLocation(a);
  const right = normaliseLocation(b);
  if (!left || !right) return 0;
  if (left === right) return 1;
  if (left.includes(right) || right.includes(left)) return 0.9;
  const aTokens = locationTokens(left);
  const bTokens = locationTokens(right);
  const common = [...aTokens].filter(token => bTokens.has(token)).length;
  return common / Math.max(aTokens.size, bTokens.size, 1);
};

const timeToMinutes = value => {
  const match = String(value || '').match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === 'PM' && hour < 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;
  return hour * 60 + minute;
};

const timeDistance = (a, b) => {
  const left = timeToMinutes(a);
  const right = timeToMinutes(b);
  if (left === null || right === null) return 0;
  return Math.min(Math.abs(left - right), 180) / 60;
};

export const campusDistance = (a, b) => {
  const similarity = locationSimilarity(a, b);
  if (similarity >= 0.9) return 0;
  if (similarity >= 0.55) return 0.7;
  const text = `${a} ${b}`.toLowerCase();
  if (text.includes('pvpsit') || text.includes('campus')) return 0.8;
  if (text.includes('hostel') || text.includes('residency') || text.includes('pg')) return 1.2;
  if (text.includes('library') || text.includes('admin')) return 1.0;
  return 2.0;
};

export const findNearestRides = (rides, from, to, time = '') => {
  const wantedFrom = normaliseLocation(from);
  const wantedTo = normaliseLocation(to);

  const active = rides.filter(ride => ride.status === 'ACTIVE' && Number(ride.seatsAvailable) > 0);
  const exact = active.filter(ride => locationSimilarity(ride.from, wantedFrom) >= 0.88 && locationSimilarity(ride.to, wantedTo) >= 0.88)
    .sort((a, b) => timeDistance(a.departureTime, time) - timeDistance(b.departureTime, time));

  if (exact.length) return { exact, nearby: [] };

  const nearby = active.map(ride => {
    const fromMatch = locationSimilarity(ride.from, wantedFrom);
    const toMatch = locationSimilarity(ride.to, wantedTo);
    const geographicDistance = campusDistance(ride.from, from) + campusDistance(ride.to, to);
    const timePenalty = timeDistance(ride.departureTime, time);
    const matchScore = geographicDistance + (2 - fromMatch - toMatch) * 1.5 + timePenalty * 0.35;
    return { ...ride, matchScore, fromMatch, toMatch };
  }).sort((a, b) => a.matchScore - b.matchScore).slice(0, 5);

  return { exact: [], nearby };
};

export const calculateEstimatedCarbonSaved = (rides = []) => {
  const completedSharedKm = rides.reduce((sum, ride) => {
    if (ride.status !== 'COMPLETED' && ride.status !== 'ACTIVE') return sum;
    return sum + Number(ride.distanceKm || 0);
  }, 0);
  return Math.max(0, completedSharedKm * 0.12 / 1000);
};

export const formatNumber = value => new Intl.NumberFormat('en-IN').format(value);
