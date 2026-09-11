import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { UserAvatar } from '../components/UserAvatar.jsx';
import {
  ArrowLeft,
  CalendarCheck,
  Clock,
  MapPin,
  ArrowRight,
  User,
  Bike,
  Coins,
  AlertCircle,
  XCircle,
  CheckCircle,
  ShieldCheck,
  RefreshCw,
  CheckCheck
} from 'lucide-react';

export const TripsPage = () => {
  const {
    bookings,
    user,
    cancelTrip,
    confirmBooking,
    isSubmitting,
    globalError,
    setActiveTab,
    navigateBack,
    viewUserProfile
  } = useApp();

  const [activeTab, setActiveTabFilter] = useState('UPCOMING'); // 'UPCOMING' | 'OFFERED' | 'COMPLETED'
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelError, setCancelError] = useState('');

  // Filter bookings for the authenticated user (Section 36)
  const userBookings = bookings.filter(b => b.userId === user?.id || b.providerId === user?.id);

  const filteredBookings = userBookings.filter(b => {
    if (activeTab === 'UPCOMING') {
      return (b.status === 'UPCOMING' || b.status === 'CONFIRMED') && b.type === 'PASSENGER' && b.userId === user?.id;
    }
    if (activeTab === 'OFFERED') {
      return b.type === 'PROVIDER' || b.status === 'OFFERED' || (b.providerId === user?.id && b.type === 'PASSENGER' && b.status !== 'CANCELLED');
    }
    if (activeTab === 'COMPLETED') {
      return b.status === 'COMPLETED' || b.status === 'CANCELLED';
    }
    return true;
  });

  const handleOpenCancel = (booking) => {
    setCancellingBooking(booking);
    setCancelError('');
  };

  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return;
    setCancelError('');
    try {
      await cancelTrip(cancellingBooking.id);
      setCancellingBooking(null);
    } catch (err) {
      if (err.name !== 'OfflineError') {
        setCancelError(err.message || 'Failed to cancel trip.');
      }
    }
  };

  const handleConfirmSeat = async (bookingId) => {
    try {
      await confirmBooking(bookingId);
    } catch (err) {
      // Handled in context
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '780px', margin: '0 auto' }}>
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

      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-verified">
            Trips & Activity
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            Real-time ride management
          </span>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' }}>
          My Journeys
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Track reserved seats, manage rides you’ve offered, and review past shared trips.
        </p>
      </div>

      {/* Offline Error Banner with Retry */}
      {globalError && (
        <div className="alert alert-danger" role="alert">
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', marginBottom: '2px' }}>Connection Error</div>
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

      {/* Segmented Tab Controls */}
      <div style={{
        display: 'flex',
        backgroundColor: 'var(--bg-subtle)',
        padding: '4px',
        borderRadius: 'var(--radius-md)',
        marginBottom: '20px',
        gap: '4px'
      }}>
        {[
          { id: 'UPCOMING', label: 'Upcoming Trips' },
          { id: 'OFFERED', label: 'Offered by Me' },
          { id: 'COMPLETED', label: 'Past & Cancelled' }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabFilter(tab.id)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? '700' : '500',
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Empty States */}
      {filteredBookings.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px'
          }}>
            <CalendarCheck size={26} />
          </div>

          <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '6px' }}>
            {activeTab === 'UPCOMING' && 'No upcoming trips'}
            {activeTab === 'OFFERED' && 'No rides offered yet'}
            {activeTab === 'COMPLETED' && 'No past trips recorded'}
          </h3>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '380px', margin: '0 auto 20px' }}>
            {activeTab === 'UPCOMING' && 'Find a ride when you are ready to head out, or reserve an empty seat on a shared route.'}
            {activeTab === 'OFFERED' && 'Already heading somewhere? Share your empty seats with fellow students to offset fuel costs.'}
            {activeTab === 'COMPLETED' && 'Your completed journeys and history will show up here.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {activeTab === 'UPCOMING' && (
              <button onClick={() => setActiveTab('find')} className="btn btn-primary btn-sm">
                Find a Ride
              </button>
            )}
            {activeTab === 'OFFERED' && (
              <button onClick={() => setActiveTab('offer')} className="btn btn-primary btn-sm">
                + Offer a Ride
              </button>
            )}
          </div>
        </div>
      )}

      {/* Trips List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredBookings.map(trip => {
          const isCancelled = trip.status === 'CANCELLED';
          const isOfferedLedger = trip.type === 'PROVIDER';
          const isProviderViewingPassenger = trip.providerId === user?.id && trip.type === 'PASSENGER';

          return (
            <div
              key={trip.id}
              className="card"
              style={{
                borderLeft: isCancelled
                  ? '4px solid #CBD5E1'
                  : isOfferedLedger
                    ? '4px solid var(--teal)'
                    : isProviderViewingPassenger
                      ? '4px solid #F59E0B'
                      : '4px solid var(--primary)',
                opacity: isCancelled ? 0.7 : 1
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className={`badge ${
                      trip.status === 'UPCOMING' || trip.status === 'CONFIRMED' ? 'badge-verified' :
                      trip.status === 'OFFERED' ? 'badge-seats' :
                      trip.status === 'COMPLETED' ? 'badge-subtle' :
                      'badge-warning'
                    }`}>
                      {trip.status}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      {isOfferedLedger ? 'Offered by You' : isProviderViewingPassenger ? 'Passenger Reservation Request' : 'Passenger Booking'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
                    <span>{trip.from}</span>
                    <ArrowRight size={14} color="var(--text-tertiary)" />
                    <span style={{ color: 'var(--primary)' }}>{trip.to}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: isOfferedLedger || isProviderViewingPassenger ? 'var(--teal)' : 'var(--primary)' }}>
                    {isOfferedLedger || isProviderViewingPassenger ? `+₹${trip.contribution}` : `₹${trip.contribution}`}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    {isOfferedLedger || isProviderViewingPassenger ? 'earned fuel contribution' : 'fuel credits paid'}
                  </div>
                </div>
              </div>

              {/* Meta details */}
              <div style={{
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                fontSize: '12px',
                color: 'var(--text-muted)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={13} />
                    {trip.date} · {trip.time}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Bike size={13} />
                    {trip.vehicle || 'Two Wheeler'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {trip.partnerAvatar && (
                    <UserAvatar
                      src={trip.partnerAvatar}
                      name={trip.partnerName}
                      size={26}
                      onClick={() => viewUserProfile(trip.providerId || trip.userId)}
                      title={`View ${trip.partnerName}'s profile`}
                    />
                  )}
                  <span
                    onClick={() => viewUserProfile(trip.providerId || trip.userId)}
                    style={{ fontWeight: '600', cursor: 'pointer', color: 'var(--primary)' }}
                    title={`View ${trip.partnerName}'s profile`}
                  >
                    {isProviderViewingPassenger ? `Passenger: ${trip.partnerName}` : trip.type === 'PASSENGER' ? `Ride with ${trip.partnerName}` : `${trip.partnerName}`}
                  </span>
                </div>
              </div>

              {/* Actions row */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                {isProviderViewingPassenger && trip.status === 'UPCOMING' && (
                  <button
                    onClick={() => handleConfirmSeat(trip.id)}
                    disabled={isSubmitting}
                    className="btn btn-primary btn-sm"
                  >
                    <CheckCheck size={14} /> Confirm Seat
                  </button>
                )}

                {(trip.status === 'UPCOMING' || trip.status === 'CONFIRMED') && trip.userId === user?.id && (
                  <button
                    onClick={() => handleOpenCancel(trip)}
                    disabled={isSubmitting}
                    className="btn btn-danger btn-sm"
                  >
                    Cancel Booking & Refund Credits
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancellingBooking && (
        <div className="modal-overlay" onClick={() => !isSubmitting && setCancellingBooking(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--danger-bg)',
                color: 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)' }}>
                  Confirm Trip Cancellation
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Restores seat to community & refunds fuel credits
                </div>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Are you sure you want to cancel your seat for <strong>{cancellingBooking.from} → {cancellingBooking.to}</strong>?
            </p>

            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              marginBottom: '16px',
              fontSize: '12.5px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Refund Amount:</span>
                <strong style={{ color: 'var(--primary)' }}>+{cancellingBooking.contribution} credits</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Return to Wallet:</span>
                <span>Immediate</span>
              </div>
            </div>

            {cancelError && (
              <div className="alert alert-danger" style={{ marginBottom: '14px', fontSize: '12px' }}>
                {cancelError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setCancellingBooking(null)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
                disabled={isSubmitting}
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="btn btn-danger"
                style={{ flex: 1.5 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Cancelling...' : 'Confirm & Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
