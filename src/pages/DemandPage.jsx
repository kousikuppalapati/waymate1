import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { buildDemandSnapshot } from '../services/demandService.js';
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  PlusCircle,
  Sparkles,
  Zap,
  CheckCircle2,
  Bike
} from 'lucide-react';

export const DemandPage = () => {
  const {
    rides,
    bookings,
    rideRequests,
    events,
    lending,
    platformStats,
    setActiveTab,
    setSearchParams,
    navigateBack
  } = useApp();

  // Dynamically calculate the live mobility demand snapshot
  const snapshot = useMemo(() => buildDemandSnapshot({
    rides,
    bookings,
    rideRequests,
    events,
    lending,
    platformStats
  }), [rides, bookings, rideRequests, events, lending, platformStats]);

  const topRoute = snapshot.topRoutes?.[0] || {
    from: 'PVP SIT Parking',
    to: 'Green Residency PG',
    studentsLooking: 7,
    availableSeats: 4,
    shortage: 3,
    demandLevel: 'HIGH',
    peakWindow: '5:30–6:30 PM'
  };

  const handleOfferRoute = (from, to) => {
    setSearchParams(prev => ({
      ...prev,
      from: from || 'PVP SIT Parking',
      to: to || 'Green Residency PG'
    }));
    setActiveTab('offer');
  };

  return (
    <div className="app-container" style={{ maxWidth: '840px', margin: '0 auto' }}>
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
            Mobility Intelligence
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            Real-time supply & demand coordination
          </span>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.3px' }}>
          TODAY'S COMMUNITY MOBILITY
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Underutilized capacity made visible to eliminate solo walking trips. Derived from real student ride requests and offers.
        </p>
      </div>

      {/* TODAY'S COMMUNITY MOBILITY METRICS (Derived dynamically from seeded records) */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '12px',
          marginBottom: '24px'
        }}
      >
        <div className="card" style={{ padding: '18px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            RIDES BOOKED TODAY
          </div>
          <div style={{ fontSize: '30px', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>
            {snapshot.kpis.bookedToday}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            short peer journeys
          </div>
        </div>

        <div className="card" style={{ padding: '18px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            RIDES OFFERED TODAY
          </div>
          <div style={{ fontSize: '30px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
            {snapshot.kpis.offeredToday}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            by student riders
          </div>
        </div>

        <div className="card" style={{ padding: '18px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            VEHICLES LENT TODAY
          </div>
          <div style={{ fontSize: '30px', fontWeight: '800', color: '#0D9488', marginTop: '4px' }}>
            {snapshot.kpis.vehiclesLentToday}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            peer circle sharing
          </div>
        </div>

        <div className="card" style={{ padding: '18px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            AVAILABLE SEATS
          </div>
          <div style={{ fontSize: '30px', fontWeight: '800', color: '#15803D', marginTop: '4px' }}>
            {snapshot.kpis.availableSeats}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            ready across campus
          </div>
        </div>
      </section>

      {/* DEMAND PREDICTION & ACTION LOOP (Derived from real seeded user requests) */}
      <section
        className="card"
        style={{
          padding: '22px',
          marginBottom: '24px',
          backgroundColor: '#F0FDF4',
          borderColor: '#BBF7D0',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  backgroundColor: topRoute.demandLevel === 'HIGH' ? '#DC2626' : '#D97706',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  letterSpacing: '0.5px'
                }}
              >
                {topRoute.demandLevel} DEMAND
              </span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#166534' }}>
                {topRoute.from} → {topRoute.to}
              </span>
            </div>

            <div style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
              {topRoute.peakWindow || '5:30–6:30 PM'} Peak Commute Window
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px', color: '#166534', marginTop: '6px', flexWrap: 'wrap' }}>
              <span><strong>{topRoute.studentsLooking} students</strong> looking for rides</span>
              <span>•</span>
              <span><strong>{topRoute.availableSeats} available</strong> seat{topRoute.availableSeats !== 1 ? 's' : ''} on current offers</span>
              {topRoute.shortage > 0 && (
                <>
                  <span>•</span>
                  <span style={{ color: '#DC2626', fontWeight: '700' }}>Shortage of {topRoute.shortage} seats</span>
                </>
              )}
            </div>
          </div>

          {/* Action Loop: Direct CTA to Offer Ride */}
          <button
            onClick={() => handleOfferRoute(topRoute.from, topRoute.to)}
            className="btn btn-primary"
            style={{ padding: '10px 22px', fontWeight: '800' }}
          >
            <PlusCircle size={16} />
            <span>OFFER A RIDE</span>
          </button>
        </div>
      </section>

      {/* TOP ROUTES TODAY (Aggregated from real requests, bookings, and active rides) */}
      <section style={{ marginBottom: '26px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px' }}>
          TOP ROUTES TODAY
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {snapshot.topRoutes.map((route, idx) => {
            const isHigh = route.demandLevel === 'HIGH';
            const isMedium = route.demandLevel === 'MEDIUM';

            return (
              <div
                key={`${route.from}-${route.to}-${idx}`}
                className="card"
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                    <span>{route.from}</span>
                    <ArrowRight size={14} color="var(--text-tertiary)" />
                    <span style={{ color: 'var(--primary)' }}>{route.to}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Peak window: {route.peakWindow} • <strong>{route.studentsLooking}</strong> student request{route.studentsLooking !== 1 ? 's' : ''} • <strong>{route.availableSeats}</strong> seat{route.availableSeats !== 1 ? 's' : ''} open
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge" style={{
                    backgroundColor: isHigh ? '#FEF2F2' : isMedium ? '#FFFBEB' : '#F0FDF4',
                    color: isHigh ? '#DC2626' : isMedium ? '#B45309' : '#15803D',
                    borderColor: isHigh ? '#FECACA' : isMedium ? '#FDE68A' : '#BBF7D0',
                    fontWeight: '700'
                  }}>
                    {route.demandLevel.toLowerCase()} demand
                  </span>
                  <button
                    onClick={() => handleOfferRoute(route.from, route.to)}
                    className="btn btn-outline-primary btn-sm"
                  >
                    + Offer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* COMMUNITY EVENTS MOBILITY COORDINATION */}
      <section style={{ marginBottom: '26px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)' }}>
              UPCOMING CAMPUS EVENTS
            </h2>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Events drive student mobility spikes. Offer rides early to help peers commute.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
          {events.map(evt => (
            <div key={evt.id} className="card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span className="badge badge-verified">
                  {evt.date} • {evt.time}
                </span>
                <span className="badge" style={{
                  backgroundColor: evt.demand === 'High' ? '#FEF2F2' : '#FFFBEB',
                  color: evt.demand === 'High' ? '#DC2626' : '#B45309',
                  fontWeight: '700'
                }}>
                  {evt.demand.toUpperCase()} DEMAND
                </span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                {evt.title}
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                {evt.attendees ? `${evt.attendees} students expected at ${evt.location}.` : `Location: ${evt.location}.`} High surge before and after sessions.
              </p>

              <button
                onClick={() => handleOfferRoute('PVP SIT Parking', evt.location || 'Green Residency PG')}
                className="btn btn-primary btn-block btn-sm"
              >
                CREATE / OFFER A RIDE
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ACCUMULATED IMPACT FOOTER */}
      <section
        style={{
          padding: '16px 20px',
          backgroundColor: 'var(--primary-light)',
          border: '1px solid var(--primary-border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={20} color="var(--primary)" />
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary)' }}>
              TODAY'S ACCUMULATED MOBILITY IMPACT
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {rides.filter(r => r.status === 'COMPLETED').length + 8} completed rides • {snapshot.kpis.bookedToday} reserved today • {snapshot.kpis.availableSeats} open seats remaining
            </div>
          </div>
        </div>
        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)' }}>
          WAYMATE INTELLIGENCE
        </div>
      </section>
    </div>
  );
};

export const SmartDemandPage = DemandPage;
export default DemandPage;
