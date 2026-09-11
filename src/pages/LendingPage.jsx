import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { UserAvatar } from '../components/UserAvatar.jsx';
import {
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  User,
  Star,
  ArrowRight,
  Sparkles,
  Info,
  Check,
  X
} from 'lucide-react';

export const LendingPage = () => {
  const {
    lending,
    user,
    requestLend,
    approveLend,
    declineLend,
    handoverLend,
    returnLend,
    isSubmitting,
    globalError,
    setActiveTab,
    navigateBack,
    viewUserProfile
  } = useApp();

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [borrowPurpose, setBorrowPurpose] = useState('College project supply pickup in city center');

  const handleOpenRequest = (item) => {
    setSelectedVehicle(item);
  };

  const handleConfirmRequest = async () => {
    if (!selectedVehicle) return;
    try {
      await requestLend(selectedVehicle.id, borrowPurpose);
      setSelectedVehicle(null);
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
            Community Peer Sharing
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            High-Trust Campus Lending Circle
          </span>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' }}>
          Vehicle Lending Circle
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Verified vehicle owners make their two-wheelers available for trusted peer errands and academic project runs.
        </p>
      </div>

      {/* Trust Gate Notice */}
      <div style={{
        backgroundColor: '#F0FDF4',
        border: '1px solid #BBF7D0',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <ShieldCheck size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '13px', color: '#166534' }}>
          <strong>High Trust Threshold Required:</strong> Lending a vehicle involves mutual trust verification, college ID validation, and transparent requester credentials. Click on any owner or requester to review their verified identity before handoff.
        </div>
      </div>

      {/* Vehicles Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {lending.map(item => {
          const isAvailable = item.status === 'AVAILABLE';
          const isRequested = item.status === 'REQUESTED';
          const isApproved = item.status === 'APPROVED';
          const isInUse = item.status === 'IN_USE';
          const isCompleted = item.status === 'COMPLETED' || item.status === 'RETURNED';

          const isOwner = user?.id === item.ownerId;
          const isRequester = user?.id === item.requesterId;

          return (
            <div
              key={item.id}
              className="card"
              style={{
                borderLeft: isAvailable ? '4px solid var(--primary)' :
                            isRequested ? '4px solid #F59E0B' :
                            isApproved ? '4px solid #10B981' :
                            isInUse ? '4px solid #3B82F6' : '4px solid #CBD5E1',
                padding: '20px'
              }}
            >
              {/* Owner & Vehicle Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <UserAvatar
                    src={item.ownerAvatar}
                    name={item.ownerName}
                    size={48}
                    showBadge
                    isVerified={item.isVerified}
                    onClick={() => viewUserProfile(item.ownerId)}
                    title={`View ${item.ownerName}'s profile`}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                        {item.vehicle}
                      </h3>
                      <span className={`badge ${
                        isAvailable ? 'badge-verified' :
                        isRequested ? 'badge-warning' :
                        isApproved ? 'badge-verified' :
                        isInUse ? 'badge-subtle' : 'badge-seats'
                      }`}>
                        {isAvailable ? 'Available to lend' :
                         isRequested ? 'Access Requested' :
                         isApproved ? 'Request Approved' :
                         isInUse ? 'Currently in Use' : 'Returned & Completed'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', flexWrap: 'wrap' }}>
                      <span
                        onClick={() => viewUserProfile(item.ownerId)}
                        style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: '600' }}
                        title={`View ${item.ownerName}'s profile`}
                      >
                        Owner: {item.ownerName}
                      </span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Star size={12} fill="#F59E0B" color="#F59E0B" /> {item.rating}
                      </span>
                      <span>•</span>
                      <span>{item.ridesShared} shared trips</span>
                      {item.plate && (
                        <>
                          <span>•</span>
                          <span style={{ color: 'var(--text-tertiary)' }}>{item.plate}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>
                    {item.dailyCreditCost} credits
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    maintenance deposit
                  </div>
                </div>
              </div>

              {/* Owner condition notes */}
              <div style={{
                marginTop: '12px',
                padding: '10px 12px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                fontSize: '12.5px',
                color: 'var(--text-muted)'
              }}>
                <strong>Owner note:</strong> {item.condition}
              </div>

              {/* SECTION 28 & 29: Connected Requester View for Pending / Active Requests */}
              {(isRequested || isApproved || isInUse) && item.requesterName && (
                <div style={{
                  marginTop: '14px',
                  padding: '16px',
                  backgroundColor: isApproved ? '#F0FDF4' : isRequested ? '#FFFBEB' : '#EFF6FF',
                  border: isApproved ? '1px solid #BBF7D0' : isRequested ? '1px solid #FDE68A' : '1px solid #BFDBFE',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <UserAvatar
                        src={item.requesterAvatar}
                        name={item.requesterName}
                        size={44}
                        showBadge
                        isVerified={true}
                        onClick={() => viewUserProfile(item.requesterId)}
                        title={`View ${item.requesterName}'s trust profile`}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: '800',
                            color: isApproved ? '#166534' : isRequested ? '#B45309' : '#1E40AF',
                            textTransform: 'uppercase',
                            letterSpacing: '0.4px'
                          }}>
                            {isOwner ? 'NEW VEHICLE REQUEST' : 'VEHICLE ACCESS REQUEST'}
                          </span>
                        </div>
                        <strong
                          onClick={() => viewUserProfile(item.requesterId)}
                          style={{ fontSize: '14px', color: 'var(--text-main)', cursor: 'pointer' }}
                          title={`View ${item.requesterName}'s profile`}
                        >
                          {item.requesterName}
                        </strong>

                        {/* Section 28: Exact Requester Trust State: Verified, New Member, No reviews yet, 2 completed rides */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', flexWrap: 'wrap' }}>
                          <span className="badge badge-verified" style={{ fontSize: '10px', padding: '1px 6px' }}>
                            ✓ Verified
                          </span>
                          <span style={{ fontWeight: '600' }}>{item.requesterTrustLevel || 'New Member'}</span>
                          <span>•</span>
                          <span style={{ color: 'var(--text-tertiary)' }}>
                            {item.requesterReviewsCount ? `${item.requesterRating} ★ (${item.requesterReviewsCount})` : 'No reviews yet'}
                          </span>
                          <span>•</span>
                          <span>{item.requesterRidesCompleted || 2} completed rides</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <div>
                        <Clock size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '3px' }} />
                        {item.startTime || '6:00 PM'} – {item.endTime || '9:00 PM'}
                      </div>
                    </div>
                  </div>

                  {item.borrowPurpose && (
                    <div style={{ marginTop: '10px', fontSize: '12.5px', color: isApproved ? '#14532D' : '#78350F', fontStyle: 'italic', backgroundColor: 'rgba(255,255,255,0.6)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                      Wants to borrow: <strong>{item.vehicle}</strong> ({item.vehicleColour || 'Graphite Grey'}) for: “{item.borrowPurpose}”
                    </div>
                  )}

                  {/* Section 28 & 29: Owner Actions vs Requester Status */}
                  <div style={{ marginTop: '12px', display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => viewUserProfile(item.requesterId)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '12px' }}
                    >
                      View Requester Profile
                    </button>

                    {/* OWNER VIEW: Approve or Decline buttons when REQUESTED */}
                    {isOwner && isRequested && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => declineLend(item.id)}
                          disabled={isSubmitting}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
                        >
                          <X size={14} /> Decline
                        </button>
                        <button
                          onClick={() => approveLend(item.id)}
                          disabled={isSubmitting}
                          className="btn btn-primary btn-sm"
                          style={{ backgroundColor: '#16A34A', borderColor: '#16A34A' }}
                        >
                          <Check size={14} /> APPROVE
                        </button>
                      </div>
                    )}

                    {/* OWNER VIEW: Handover Key when APPROVED */}
                    {isOwner && isApproved && (
                      <button
                        onClick={() => handoverLend(item.id)}
                        disabled={isSubmitting}
                        className="btn btn-primary btn-sm"
                      >
                        <KeyRound size={14} /> Confirm Handover & Hand Keys
                      </button>
                    )}

                    {/* OWNER VIEW: Return Vehicle when IN_USE */}
                    {isOwner && isInUse && (
                      <button
                        onClick={() => returnLend(item.id)}
                        disabled={isSubmitting}
                        className="btn btn-primary btn-sm"
                        style={{ backgroundColor: '#0284C7', borderColor: '#0284C7' }}
                      >
                        <CheckCircle2 size={14} /> Confirm Vehicle Returned
                      </button>
                    )}

                    {/* REQUESTER VIEW: Synchronized Status */}
                    {isRequester && (
                      <span className={`badge ${isApproved ? 'badge-verified' : isRequested ? 'badge-warning' : 'badge-subtle'}`} style={{ padding: '6px 12px', fontSize: '12px' }}>
                        {isApproved ? '✓ APPROVED · Key handoff at 6:00 PM' :
                         isRequested ? 'Pending Owner Approval' :
                         'Vehicle In Use · Return by 9:00 PM'}
                      </span>
                    )}

                    {!isOwner && !isRequester && (
                      <span className={`badge ${isApproved ? 'badge-verified' : 'badge-warning'}`} style={{ padding: '4px 8px' }}>
                        {isApproved ? 'Approved by Owner' : 'Pending Review'}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button for Available Vehicles */}
              {isAvailable && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
                  <button
                    onClick={() => handleOpenRequest(item)}
                    disabled={isSubmitting}
                    className="btn btn-primary btn-sm"
                  >
                    Request Temporary Access
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lending Request Modal */}
      {selectedVehicle && (
        <div className="modal-overlay" onClick={() => !isSubmitting && setSelectedVehicle(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800' }}>
                Request Vehicle Access
              </h3>
              <button
                onClick={() => setSelectedVehicle(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text-tertiary)' }}
              >
                ✕
              </button>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '14px', fontSize: '13px' }}>
              <div><strong>{selectedVehicle.vehicle}</strong> ({selectedVehicle.plate})</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                Owner: {selectedVehicle.ownerName} · {selectedVehicle.rating} ★ Rating · {selectedVehicle.dailyCreditCost} credits
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lend-purpose">Purpose of Borrowing</label>
              <textarea
                id="lend-purpose"
                className="form-textarea"
                value={borrowPurpose}
                onChange={e => setBorrowPurpose(e.target.value)}
                rows={2}
                placeholder="e.g. College lab project supply pickup in city center"
              />
            </div>

            <div style={{
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginBottom: '16px'
            }}>
              ✓ Double ISI-certified helmets included
              <br />
              ✓ Digital handover authorization issued upon owner confirmation
              <br />
              ✓ Full student insurance coverage active within campus circle
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRequest}
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Send Request to Owner'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
