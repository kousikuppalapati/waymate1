import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { TrustBadge } from '../components/TrustBadge.jsx';
import { UserAvatar } from '../components/UserAvatar.jsx';
import {
  ArrowLeft,
  UserCheck,
  ShieldCheck,
  Star,
  Users,
  Bike,
  Building,
  RefreshCcw,
  CheckCircle,
  HelpCircle,
  LogOut,
  Sparkles
} from 'lucide-react';

export const ProfilePage = () => {
  const {
    user,
    users = [],
    viewUserProfile,
    handleResetData,
    showToast,
    updateProfile,
    setActiveTab,
    navigateBack,
    logout
  } = useApp();

  const safeUser = user || {
    name: 'Community Member',
    email: '',
    collegeId: '',
    generatedUserId: 'WM-1001',
    community: 'PVP Siddhartha Institute of Technology',
    avatar: '',
    isVerified: false,
    trustLevel: 'New Member',
    rating: 0,
    reviewsCount: 0,
    ridesCompleted: 0,
    ridesShared: 0,
    mutualConnections: 0,
    reliabilityScore: 'New member',
    vehicle: 'No vehicle registered',
    vehicleModel: '',
    bikeColour: '',
    fuelType: 'Petrol',
    isEv: false
  };

  const [activeCommunity, setActiveCommunity] = useState(safeUser.community || 'PVP Siddhartha Institute of Technology');
  const [bikeColour, setBikeColour] = useState(safeUser.bikeColour || 'Not specified');
  const [isEv, setIsEv] = useState(Boolean(safeUser.isEv));
  const [vehicleModel, setVehicleModel] = useState(safeUser.vehicleModel || safeUser.vehicle || '');

  const handleSaveCommunity = () => {
    showToast('Community preferences updated.', 'success');
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
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' }}>
          Community Trust Profile
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Your verified credentials visible to fellow students and PG residents.
        </p>
      </div>

      {/* Main Student Profile Card */}
      <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '18px' }}>
          <UserAvatar
            src={safeUser.avatar}
            name={safeUser.name}
            size={72}
            showBadge
            isVerified={safeUser.isVerified}
            style={{ border: '3px solid var(--primary)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                {safeUser.name}
              </h2>
              <span className={safeUser.isVerified ? 'badge badge-verified' : 'badge badge-warning'}>
                {safeUser.isVerified ? '✓ Verified' : 'PENDING VERIFICATION'}
              </span>
              <span className="badge" style={{ backgroundColor: '#E0F2FE', color: '#0369A1', fontWeight: '700', fontSize: '11px' }}>
                {safeUser.trustLevel || 'New Member'}
              </span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {safeUser.email} {safeUser.collegeId ? `· College ID: ${safeUser.collegeId}` : ''}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '3px', fontWeight: '700' }}>
              Waymate ID: {safeUser.generatedUserId || 'WM-1001'} {safeUser.phone ? `· ${safeUser.phone}` : ''}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              Member of {safeUser.community || 'PVP Siddhartha Institute of Technology'}
            </div>
          </div>
        </div>

        {/* Trust Badges & Reliability breakdown */}
        <div style={{
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '18px'
        }}>
          <TrustBadge
            isVerified={safeUser.isVerified}
            rating={safeUser.rating}
            reviewsCount={safeUser.reviewsCount}
            ridesCompleted={safeUser.ridesCompleted}
            ridesShared={safeUser.ridesShared}
            reliabilityScore={safeUser.reliabilityScore}
            showFullStats
          />
        </div>

        {/* Detailed Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '10px',
          marginBottom: '18px'
        }}>
          <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Rides Completed</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
              {safeUser.ridesCompleted || 0}
            </div>
          </div>

          <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Rides Shared</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>
              {safeUser.ridesShared || 0}
            </div>
          </div>

          <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Mutual Peers</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--teal)' }}>
              {safeUser.mutualConnections || 0}
            </div>
          </div>

          <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Reliability</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--success)' }}>
              {safeUser.reliabilityScore || 'New member'}
            </div>
          </div>
        </div>

        {/* Vehicle registered */}
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bike size={16} color="var(--text-tertiary)" />
          {safeUser.vehicleModel || (safeUser.vehicle && safeUser.vehicle !== 'No vehicle registered') ? (
            <span>Registered Vehicle: <strong>{safeUser.vehicleModel || safeUser.vehicle}</strong>{safeUser.bikeColour ? ` · ${safeUser.bikeColour}` : ''}{safeUser.isEv ? ' · EV' : ` · ${safeUser.fuelType || 'Petrol'}`}</span>
          ) : (
            <span style={{ fontStyle: 'italic', color: 'var(--text-tertiary)' }}>No vehicle registered · Passenger account</span>
          )}
        </div>
      </div>

      {/* SECTION 34: COMMUNITY MEMBERS GRID (Guarantee all 9 seeded users are visible & discoverable) */}
      <div className="card" style={{ padding: '22px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                COMMUNITY MEMBERS
              </h3>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Verified peers and commuters in the PVP Siddhartha Institute of Technology community. Click any card to view their full trust profile.
            </p>
          </div>
          <span className="badge badge-verified" style={{ fontSize: '11px' }}>
            {users.length} Active Members
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: '12px'
        }}>
          {users.map(member => {
            const hasReviews = member.reviewsCount > 0;
            return (
              <div
                key={member.id}
                onClick={() => viewUserProfile(member)}
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}
                className="member-card-hover"
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <UserAvatar
                    src={member.avatar}
                    name={member.name}
                    size={42}
                    showBadge
                    isVerified={member.isVerified}
                  />
                  <div style={{ minWidth: 0 }}>
                    <strong style={{ fontSize: '13.5px', color: 'var(--text-main)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {member.name}
                    </strong>
                    <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700' }}>
                      {member.generatedUserId}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', marginTop: '2px' }}>
                  <span className={`badge ${member.isVerified ? 'badge-verified' : 'badge-warning'}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                    {member.isVerified ? '✓ Verified' : 'Pending'}
                  </span>
                  <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>
                    {member.trustLevel || 'Member'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-light)', paddingTop: '6px' }}>
                  <span>
                    {hasReviews ? `★ ${Number(member.rating).toFixed(1)} (${member.reviewsCount})` : 'No reviews yet'}
                  </span>
                  <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '11px' }}>
                    {member.role ? member.role.split('+')[0].trim() : 'Member'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '10px' }}>Vehicle Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="form-group"><label className="form-label" htmlFor="bike-colour">Bike colour</label><input id="bike-colour" className="form-input" value={bikeColour} onChange={e => setBikeColour(e.target.value)} placeholder="e.g. Black" /></div>
          <div className="form-group"><label className="form-label" htmlFor="vehicle-model">Vehicle model</label><input id="vehicle-model" className="form-input" value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} placeholder="e.g. Activa 6G" /></div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '13px' }}><input type="checkbox" checked={isEv} onChange={e => setIsEv(e.target.checked)} /> This vehicle is electric (EV)</label>
        <button onClick={() => updateProfile({ bikeColour, isEv, vehicleModel })} className="btn btn-primary btn-sm">Save vehicle details</button>
      </div>

      {/* Community Circle Settings */}
      <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '10px' }}>
          Primary Residential Circle
        </h3>
        <div className="form-group">
          <label className="form-label" htmlFor="comm-select">Hostel / PG Community</label>
          <select
            id="comm-select"
            className="form-select"
            value={activeCommunity}
            onChange={e => setActiveCommunity(e.target.value)}
          >
            <option value="PVP Siddhartha Institute of Technology">PVP Siddhartha Institute of Technology</option>
            <option value="Green Residency & Campus Circle">Green Residency & Campus Circle</option>
            <option value="Central PG & Library Corridor">Central PG & Library Corridor</option>
            <option value="North Hostel Block">North Hostel Block</option>
            <option value="Lakeview Hostel Block">Lakeview Hostel Block</option>
            <option value="Student Housing Complex">Student Housing Complex</option>
          </select>
        </div>
        <button onClick={handleSaveCommunity} className="btn btn-secondary btn-sm">
          Update Community Circle
        </button>
      </div>

      {/* Judge & Demo Controls */}
      <div className="card" style={{ padding: '20px', backgroundColor: '#FFFFFF', border: '1px dashed var(--primary-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <RefreshCcw size={16} color="var(--primary)" />
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--primary)' }}>
            Hackathon Judging Controls
          </h3>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
          Reset the client-side database back to original authentic student seeds (All 9 demo users, connected rides, requests, vehicles, reviews, and per-user wallets).
        </p>
        <button
          onClick={handleResetData}
          className="btn btn-secondary btn-sm"
        >
          <RefreshCcw size={13} /> Reset Demo Data to 9 Seeded Users
        </button>
      </div>

      {/* Sign Out Card */}
      <div className="card" style={{ padding: '20px', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', border: '1px solid var(--border-light)' }}>
        <div>
          <strong style={{ fontSize: '15px', color: 'var(--text-main)', display: 'block' }}>Account Session</strong>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Sign out and return directly to the Waymate landing page.</span>
        </div>
        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#dc2626', borderColor: '#fca5a5' }}
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </div>
  );
};
