import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { CAMPUS_LOCATIONS } from '../types/data.js';
import {
  ArrowLeft,
  PlusCircle,
  MapPin,
  Clock,
  Users,
  Bike,
  Coins,
  AlertCircle,
  CheckCircle,
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';

export const OfferRidePage = () => {
  const { user, offerRide, isSubmitting, globalError, setActiveTab, navigateBack } = useApp();

  const [from, setFrom] = useState('PVPSIT Parking');
  const [to, setTo] = useState('Green Residency PG');
  const [date, setDate] = useState('Today');
  const [departureTime, setDepartureTime] = useState('5:45 PM');
  const [seatsTotal, setSeatsTotal] = useState(2);
  const [vehicle, setVehicle] = useState(user?.vehicleModel || (user?.vehicle && user.vehicle !== 'No vehicle registered' ? user.vehicle : 'Two Wheeler'));
  const [note, setNote] = useState('Leaving right after class. Heading via Food Street.');
  const [distanceKm, setDistanceKm] = useState(4.2);

  const [errors, setErrors] = useState({});
  const [submittedRide, setSubmittedRide] = useState(null);

  // Dynamic distance & fair fuel contribution estimate
  const estimatedContribution = Math.max(10, Math.round(distanceKm * 3.2));

  // Inline Validation (Mandatory for Stress Test 3 & 4)
  const validateForm = () => {
    const errs = {};
    if (!from.trim()) {
      errs.from = 'Starting point is required.';
    }
    if (!to.trim()) {
      errs.to = 'Destination is required.';
    } else if (to.trim().toLowerCase() === from.trim().toLowerCase()) {
      errs.to = 'Destination cannot be identical to starting point.';
    }

    if (!departureTime.trim()) {
      errs.departureTime = 'Choose a future departure time.';
    }

    if (note && note.length > 400) {
      errs.note = 'Note cannot exceed 400 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await offerRide({
        from: from.trim(),
        to: to.trim(),
        date,
        departureTime: departureTime.trim(),
        seatsTotal: parseInt(seatsTotal, 10),
        vehicle: vehicle.trim(),
        note: note ? note.slice(0, 400).trim() : '',
        distanceKm,
        contribution: estimatedContribution
      });
      setSubmittedRide(res.ride);
    } catch (err) {
      if (err.name !== 'OfflineError') {
        setErrors({ general: err.message || 'Failed to offer ride.' });
      }
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '640px', margin: '0 auto' }}>
      {/* Top Back Navigation */}
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={() => navigateBack ? navigateBack() : setActiveTab('dashboard')}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-verified">
            Provider Mode
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            ✓ Verified Member Perk
          </span>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' }}>
          Offer Empty Seats
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          “I’m already going there. Anyone coming with me?”
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
                <RefreshCw size={12} /> Retry Submission
              </button>
            )}
          </div>
        </div>
      )}

      {/* Success View */}
      {submittedRide ? (
        <div className="card" style={{ textAlign: 'center', padding: '36px 20px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <CheckCircle size={32} />
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
            Shared Journey Published!
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 18px' }}>
            Your ride from <strong>{submittedRide.from}</strong> to <strong>{submittedRide.to}</strong> is now visible to peers. You will receive up to <strong>{submittedRide.contribution * submittedRide.seatsTotal} community credits</strong> for fuel contribution.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setSubmittedRide(null);
                setNote('');
              }}
              className="btn btn-secondary btn-sm"
            >
              + Offer Another Ride
            </button>
            <button
              onClick={() => setActiveTab('trips')}
              className="btn btn-primary btn-sm"
            >
              View in My Trips
            </button>
          </div>
        </div>
      ) : (
        /* Offer Form */
        <div className="card" style={{ padding: '24px' }}>
          <form onSubmit={handleSubmit} noValidate>
            {errors.general && (
              <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
                <AlertCircle size={16} />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Route row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label className="form-label" htmlFor="offer-from">
                  Starting Point <span className="req">*</span>
                </label>
                <input
                  id="offer-from"
                  type="text"
                  list="locations-list"
                  className={`form-input ${errors.from ? 'has-error' : ''}`}
                  placeholder="e.g. PVPSIT Parking"
                  value={from}
                  onChange={e => {
                    setFrom(e.target.value);
                    if (errors.from) setErrors(prev => ({ ...prev, from: null }));
                  }}
                />
                {errors.from && (
                  <div className="form-error">
                    <AlertCircle size={12} />
                    <span>{errors.from}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="form-label" htmlFor="offer-to">
                  Destination <span className="req">*</span>
                </label>
                <input
                  id="offer-to"
                  type="text"
                  list="locations-list"
                  className={`form-input ${errors.to ? 'has-error' : ''}`}
                  placeholder="e.g. Green Residency PG"
                  value={to}
                  onChange={e => {
                    setTo(e.target.value);
                    if (errors.to) setErrors(prev => ({ ...prev, to: null }));
                  }}
                />
                {errors.to && (
                  <div className="form-error">
                    <AlertCircle size={12} />
                    <span>{errors.to}</span>
                  </div>
                )}
              </div>

              <datalist id="locations-list">
                {CAMPUS_LOCATIONS.map(loc => (
                  <option key={loc} value={loc} />
                ))}
              </datalist>
            </div>

            {/* Date, Time, Distance row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label className="form-label" htmlFor="offer-date">Date</label>
                <select
                  id="offer-date"
                  className="form-select"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                >
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                </select>
              </div>

              <div>
                <label className="form-label" htmlFor="offer-time">
                  Departure Time <span className="req">*</span>
                </label>
                <input
                  id="offer-time"
                  type="text"
                  className={`form-input ${errors.departureTime ? 'has-error' : ''}`}
                  value={departureTime}
                  placeholder="e.g. 5:45 PM"
                  onChange={e => {
                    setDepartureTime(e.target.value);
                    if (errors.departureTime) setErrors(prev => ({ ...prev, departureTime: null }));
                  }}
                />
                {errors.departureTime && (
                  <div className="form-error">
                    <AlertCircle size={12} />
                    <span>{errors.departureTime}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="form-label" htmlFor="offer-seats">Empty Seats Available</label>
                <select
                  id="offer-seats"
                  className="form-select"
                  value={seatsTotal}
                  onChange={e => setSeatsTotal(parseInt(e.target.value, 10))}
                >
                  <option value={1}>1 Pillion Seat</option>
                  <option value={2}>2 Empty Seats</option>
                </select>
              </div>
            </div>

            {/* Vehicle details */}
            <div style={{ marginBottom: '14px' }}>
              <label className="form-label" htmlFor="offer-vehicle">Vehicle & Model</label>
              <input
                id="offer-vehicle"
                type="text"
                className="form-input"
                value={vehicle}
                onChange={e => setVehicle(e.target.value)}
                placeholder="e.g. Honda Activa 6G / Yamaha FZ"
              />
            </div>

            {/* Note field with Stress Test 4 safety: 400 chars protection */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="offer-note">Optional Note for Passengers</label>
                <span className="char-counter" style={{ color: note.length >= 390 ? 'var(--danger)' : 'var(--text-tertiary)' }}>
                  {note.length} / 400 characters
                </span>
              </div>
              <textarea
                id="offer-note"
                maxLength={400}
                className={`form-textarea ${errors.note ? 'has-error' : ''}`}
                value={note}
                onChange={e => {
                  setNote(e.target.value);
                  if (errors.note) setErrors(prev => ({ ...prev, note: null }));
                }}
                placeholder="e.g. Leaving right after lab. Have a spare helmet."
              />
              {errors.note && (
                <div className="form-error">
                  <AlertCircle size={12} />
                  <span>{errors.note}</span>
                </div>
              )}
            </div>

            {/* Realistic Fuel Contribution Computation Callout */}
            <div style={{
              backgroundColor: 'var(--primary-light)',
              border: '1px solid var(--primary-border)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Coins size={18} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>
                    ₹{estimatedContribution} Fair Fuel Contribution per Seat
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Calculated for short ~{distanceKm} km campus commute. Automatically credited to your wallet upon shared ride.
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)' }}>
                +{estimatedContribution * seatsTotal} credits total
              </div>
            </div>

            {/* Submit Button with Double-Submit Prevention (Stress Test 5) */}
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isSubmitting}
            >
              <PlusCircle size={16} />
              <span>{isSubmitting ? 'Publishing Shared Journey...' : 'Publish Shared Journey'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
