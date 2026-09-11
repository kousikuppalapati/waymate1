import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { CAMPUS_LOCATIONS } from '../types/data.js';
import { TrustBadge } from '../components/TrustBadge.jsx';
import { UserAvatar } from '../components/UserAvatar.jsx';
import { findNearestRides } from '../utils.js';
import {
  ArrowLeft,
  Search,
  MapPin,
  Clock,
  Users,
  Coins,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Bike,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

export const FindRidePage = () => {
  const {
    rides,
    wallet,
    bookRideSeat,
    isSubmitting,
    globalError,
    setActiveTab,
    searchParams,
    setSearchParams,
    navigateBack,
    showToast,
    viewUserProfile
  } = useApp();

  const [fromQuery, setFromQuery] = useState(searchParams.from || 'PVPSIT Parking');
  const [toQuery, setToQuery] = useState(searchParams.to || 'Green Residency PG');
  const [timeQuery, setTimeQuery] = useState(searchParams.time || '5:30 PM');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchParams.from) setFromQuery(searchParams.from);
    if (searchParams.to) setToQuery(searchParams.to);
    if (searchParams.time) setTimeQuery(searchParams.time);
  }, [searchParams.from, searchParams.to, searchParams.time]);

  // Selected ride for reservation modal
  const [selectedRide, setSelectedRide] = useState(null);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [bookingError, setBookingError] = useState('');

  // Preset location quick picks
  const handleQuickRoute = (from, to) => {
    setFromQuery(from);
    setToQuery(to);
    setSearchParams(prev => ({ ...prev, from, to }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const from = fromQuery.trim();
    const to = toQuery.trim();
    if (!from || !to) return;
    setIsSearching(true);
    setSearchParams({ from, to, time: timeQuery.trim() });
    window.requestAnimationFrame(() => setIsSearching(false));
  };

  // Filter rides based on search query
  const rideMatches = useMemo(() => findNearestRides(rides, fromQuery, toQuery, timeQuery), [rides, fromQuery, toQuery, timeQuery]);
  const filteredRides = rideMatches.exact;
  const nearbyRides = rideMatches.nearby;

  // Open reservation modal
  const handleOpenBooking = (ride) => {
    setSelectedRide(ride);
    setSeatsToBook(1);
    setBookingError('');
  };

  // Confirm booking
  const handleConfirmReservation = async () => {
    if (!selectedRide) return;
    setBookingError('');

    const totalCost = selectedRide.contribution * seatsToBook;
    if (wallet.balance < totalCost) {
      setBookingError(`Not enough community credits for this ride. Required: ${totalCost} credits, current balance: ${wallet.balance} credits.`);
      return;
    }

    try {
      await bookRideSeat({
        rideId: selectedRide.id,
        seats: seatsToBook
      });
      setSelectedRide(null);
      showToast('Seat reserved successfully! Redirecting to My Trips...', 'success');
      setActiveTab('trips');
    } catch (err) {
      if (err.name !== 'OfflineError') {
        setBookingError(err.message || 'Failed to reserve seat. Please try again.');
      }
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '820px', margin: '0 auto' }}>
      {/* Top Back Navigation */}
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={() => navigateBack ? navigateBack() : setActiveTab('dashboard')}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      </div>

      {/* Search Header Form */}
      <section className="card" style={{ marginBottom: '20px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.2px' }}>
              Where are you heading?
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Find community members with open seats already traveling your way.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('offer')}
            className="btn btn-outline-primary btn-sm"
          >
            + Offer empty seats
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div>
            <label className="form-label" htmlFor="search-from">From</label>
            <div style={{ position: 'relative' }}>
              <input
                id="search-from"
                type="text"
                list="campus-locations-from"
                className="form-input"
                placeholder="e.g. PVPSIT Parking"
                value={fromQuery}
                onChange={(e) => setFromQuery(e.target.value)}
              />
              <datalist id="campus-locations-from">
                {CAMPUS_LOCATIONS.map(loc => <option key={loc} value={loc} />)}
              </datalist>
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="search-to">To</label>
            <div style={{ position: 'relative' }}>
              <input
                id="search-to"
                type="text"
                list="campus-locations-to"
                className="form-input"
                placeholder="e.g. Green Residency PG"
                value={toQuery}
                onChange={(e) => setToQuery(e.target.value)}
              />
              <datalist id="campus-locations-to">
                {CAMPUS_LOCATIONS.map(loc => <option key={loc} value={loc} />)}
              </datalist>
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="search-when">When</label>
            <input
              id="search-when"
              type="text"
              className="form-input"
              value={timeQuery}
              onChange={(e) => setTimeQuery(e.target.value)}
              placeholder="e.g. Today · 5:30 PM"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isSearching}
            >
              <Search size={16} />
              <span>{isSearching ? 'Searching...' : 'Find a ride'}</span>
            </button>
          </div>
        </form>

        {/* Quick routes pill selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-tertiary)' }}>
            Quick Routes:
          </span>
          <button
            type="button"
            onClick={() => handleQuickRoute('PVPSIT Parking', 'Green Residency PG')}
            className="badge badge-subtle"
            style={{ cursor: 'pointer', background: '#F4F7F4' }}
          >
            PVPSIT Parking → Green Residency
          </button>
          <button
            type="button"
            onClick={() => handleQuickRoute('Central Library', 'Central PG')}
            className="badge badge-subtle"
            style={{ cursor: 'pointer', background: '#F4F7F4' }}
          >
            Library → Central PG
          </button>
          <button
            type="button"
            onClick={() => handleQuickRoute('Main Block / Admin', 'Metro Station (Purple Line)')}
            className="badge badge-subtle"
            style={{ cursor: 'pointer', background: '#F4F7F4' }}
          >
            Main Block → Metro
          </button>
        </div>
      </section>

      {/* Community Impact Snippet */}
      <section style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 18px',
        backgroundColor: 'var(--primary-light)',
        border: '1px solid var(--primary-border)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={18} color="var(--primary)" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>
              Your campus already has the journeys moving
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              18 shared trips · 42 empty seats utilized · 67 kg CO₂ avoided this month
            </div>
          </div>
        </div>
        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary)' }}>
          Community Mobility
        </div>
      </section>

      {/* Offline / Global Error Banner */}
      {globalError && (
        <div className="alert alert-danger" role="alert">
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', marginBottom: '2px' }}>Network Issue</div>
            <div>{globalError.message}</div>
            {globalError.onRetry && (
              <button
                onClick={globalError.onRetry}
                className="btn btn-sm btn-danger"
                style={{ marginTop: '8px' }}
              >
                <RefreshCw size={12} /> Retry Action
              </button>
            )}
          </div>
        </div>
      )}

      {/* Available Rides Stream */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>
            Available Shared Journeys ({filteredRides.length})
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            Sorted by seat availability
          </span>
        </div>

        {/* Loading Skeletons */}
        {isSearching && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[1, 2].map(n => (
              <div key={n} className="card skeleton" style={{ height: '140px' }} />
            ))}
          </div>
        )}

        {!isSearching && filteredRides.length === 0 && nearbyRides.length > 0 && (
          <>
            <div className="nearby-match-note"><Sparkles size={14} /> No exact route yet. Showing the closest available campus rides.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
              {nearbyRides.map(ride => (
                <div key={ride.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                    <div><strong>{ride.from} → {ride.to}</strong><div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>{ride.departureTime} · {ride.seatsAvailable} seat(s) · {ride.contribution} credits</div></div>
                    <button className="btn btn-primary btn-sm" onClick={() => handleOpenBooking(ride)}>View ride <ArrowRight size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State (Stress Test 6) */}
        {!isSearching && filteredRides.length === 0 && nearbyRides.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#FFFFFF' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Bike size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
              No rides found
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '380px', margin: '0 auto 20px' }}>
              Nothing matches this route yet. Try searching for a nearby spot or offer a ride yourself if you have vehicle seats!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setFromQuery('');
                  setToQuery('');
                }}
                className="btn btn-secondary btn-sm"
              >
                Clear Route Filter
              </button>
              <button
                onClick={() => setActiveTab('offer')}
                className="btn btn-primary btn-sm"
              >
                + Offer a ride
              </button>
            </div>
          </div>
        )}

        {/* Ride Cards List */}
        {!isSearching && filteredRides.map(ride => {
          const isFull = ride.seatsAvailable <= 0;
          return (
            <article
              key={ride.id}
              className="card"
              style={{
                marginBottom: '14px',
                borderLeft: isFull ? '4px solid #CBD5E1' : '4px solid var(--primary)',
                opacity: isFull ? 0.75 : 1
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                {/* Provider info */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <UserAvatar
                    src={ride.provider.avatar}
                    name={ride.provider.name}
                    size={48}
                    showBadge
                    isVerified={ride.provider.isVerified}
                    onClick={() => viewUserProfile(ride.provider || ride.providerId)}
                    title={`View ${ride.provider.name}'s trust profile`}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h3
                        onClick={() => viewUserProfile(ride.provider || ride.providerId)}
                        style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', cursor: 'pointer' }}
                        title={`View ${ride.provider.name}'s trust profile`}
                      >
                        {ride.provider.name}
                      </h3>
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                        is heading your way
                      </span>
                    </div>

                    <div style={{ marginTop: '2px' }}>
                      <TrustBadge
                        isVerified={ride.provider.isVerified}
                        rating={ride.provider.rating}
                        reviewsCount={ride.provider.reviewsCount}
                        reliabilityScore={ride.provider.reliabilityScore}
                        compact
                      />
                    </div>
                  </div>
                </div>

                {/* Fuel Contribution Hero */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>
                    ₹{ride.contribution}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    fuel contribution
                  </div>
                </div>
              </div>

              {/* Route & Time Representation */}
              <div style={{
                margin: '14px 0',
                padding: '10px 14px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
                  <span>{ride.from}</span>
                  <ArrowRight size={14} color="var(--text-tertiary)" />
                  <span style={{ color: 'var(--primary)' }}>{ride.to}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} />
                    {ride.date} · {ride.departureTime}
                  </span>
                  <span>~{ride.distanceKm} km</span>
                </div>
              </div>

              {/* Vehicle & Note info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                    <Bike size={14} />
                    {ride.vehicle}
                  </span>
                  {(ride.vehicleColour || ride.provider.bikeColour) && <span>{ride.vehicleColour || ride.provider.bikeColour}</span>}
                  {(ride.isEv || ride.provider.isEv) ? <span className="badge badge-verified">EV</span> : <span>{ride.fuelType || ride.provider.fuelType || 'Petrol'}</span>}

                  <span className={`badge ${isFull ? 'badge-subtle' : 'badge-seats'}`}>
                    <Users size={12} />
                    {isFull ? 'No seats open' : `${ride.seatsAvailable} seat${ride.seatsAvailable > 1 ? 's' : ''} available`}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenBooking(ride)}
                  disabled={isFull || isSubmitting}
                  className="btn btn-primary btn-sm"
                  style={{ minWidth: '120px' }}
                >
                  {isFull ? 'Full' : 'Request seat'}
                </button>
              </div>

              {/* Note (safe layout rendering for Stress Test 4) */}
              {ride.note && (
                <div className="text-break" style={{
                  marginTop: '10px',
                  paddingTop: '8px',
                  borderTop: '1px dashed var(--border-light)',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  fontStyle: 'italic'
                }}>
                  “{ride.note}”
                </div>
              )}
            </article>
          );
        })}
      </section>

      {/* Reservation Modal with Double-Submit Lock & Credit Verification */}
      {selectedRide && (
        <div className="modal-overlay" onClick={() => !isSubmitting && setSelectedRide(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span className="badge badge-verified" style={{ marginBottom: '6px' }}>
                  Shared Journey Request
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
                  Ride with {selectedRide.provider.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedRide(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text-tertiary)' }}
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>

            {/* Trip summary */}
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                {selectedRide.from} → {selectedRide.to}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {selectedRide.date} · Departure {selectedRide.departureTime}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Vehicle: {selectedRide.vehicle}
              </div>
            </div>

            {/* Seat Selector */}
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label" htmlFor="seat-count">Number of Seats to Reserve</label>
              <select
                id="seat-count"
                className="form-select"
                value={seatsToBook}
                onChange={e => setSeatsToBook(parseInt(e.target.value, 10))}
                disabled={isSubmitting}
              >
                <option value={1}>1 Seat</option>
                {selectedRide.seatsAvailable > 1 && <option value={2}>2 Seats</option>}
              </select>
            </div>

            {/* Cost & Balance Breakdown */}
            <div style={{
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span>Fuel contribution per seat:</span>
                <span>₹{selectedRide.contribution}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '700', color: 'var(--primary)' }}>
                <span>Total community credits:</span>
                <span>{selectedRide.contribution * seatsToBook} credits</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: 'var(--text-tertiary)',
                marginTop: '6px',
                paddingTop: '6px',
                borderTop: '1px dashed var(--border-light)'
              }}>
                <span>Your available balance:</span>
                <span style={{ fontWeight: '600', color: wallet.balance < (selectedRide.contribution * seatsToBook) ? 'var(--danger)' : 'var(--text-main)' }}>
                  {wallet.balance} credits
                </span>
              </div>
            </div>

            {/* Insufficient credits error alert (Section 5) */}
            {bookingError && (
              <div className="alert alert-danger" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '13px', color: '#991B1B' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>NOT ENOUGH COMMUNITY CREDITS</span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-main)', lineHeight: '1.4' }}>
                  You need <strong>{selectedRide.contribution * seatsToBook} credits</strong> for this ride.
                  <br />
                  Your balance: <strong>{wallet.balance} credits</strong>.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRide(null);
                    setActiveTab('offer');
                  }}
                  className="btn btn-sm btn-secondary"
                  style={{ marginTop: '4px', fontWeight: '700' }}
                >
                  OFFER A RIDE TO EARN CREDITS
                </button>
              </div>
            )}

            {/* Action buttons with double-submit protection */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSelectedRide(null)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReservation}
                className="btn btn-primary"
                style={{ flex: 2 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Reserving Seat...' : `Confirm & Deduct ${selectedRide.contribution * seatsToBook} Credits`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
