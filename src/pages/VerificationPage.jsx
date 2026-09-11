import React, { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export const VerificationPage = ({ onDone }) => {
  const { user, verifyAccount, isSubmitting, globalError, setEntryMode } = useApp();
  const [email, setEmail] = useState(user?.email || '');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('EMAIL');
  const [error, setError] = useState('');

  const send = e => {
    e.preventDefault();
    if (!email.includes('@')) return setError('Enter a valid campus email address.');
    setError('');
    setStep('OTP');
  };

  const confirm = async e => {
    e.preventDefault();
    if (otp.trim().length < 4) return setError('Enter the 4-digit demo verification code.');
    try {
      await verifyAccount({ email, otp });
      setStep('SUCCESS');
    } catch (err) {
      setError(err.message || 'Verification failed.');
    }
  };

  return <div className="verification-page"><div className="auth-shell compact-auth"><button type="button" className="brand-lockup auth-brand" onClick={() => setEntryMode('landing')} aria-label="Go to landing page" style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}><img src="/waymate-mark.png" alt="" /><span>Way <span>Mate</span></span></button><div className="auth-card">
    <span className="eyebrow"><ShieldCheck size={14} /> Community verification</span>
    <h1>Verify your campus identity.</h1>
    <p>Keep the existing demo verification flow, now presented as a full page instead of a popup.</p>
    {globalError && <div className="auth-error"><AlertCircle size={16} />{globalError.message}<button onClick={globalError.onRetry}><RefreshCw size={13} /> Retry</button></div>}
    {error && <div className="auth-error"><AlertCircle size={16} />{error}</div>}
    {step === 'EMAIL' && <form onSubmit={send} className="auth-form"><label>Email<input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="you@campus.edu" /></label><button className="btn btn-primary btn-block">Continue <ArrowRight size={16} /></button><button type="button" className="btn btn-secondary btn-block" style={{ marginTop: '8px' }} onClick={onDone}>Cancel & Return to App</button></form>}
    {step === 'OTP' && <form onSubmit={confirm} className="auth-form"><div className="verify-address">Code sent to <strong>{email}</strong></div><label>4-digit verification code<input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" maxLength={4} required placeholder="1234" /></label><small>Demo: any four digits work.</small><button className="btn btn-primary btn-block" disabled={isSubmitting}>{isSubmitting ? 'Verifying…' : 'Confirm verification'}</button><button type="button" className="btn btn-secondary btn-block" onClick={() => setStep('EMAIL')}>Back</button></form>}
    {step === 'SUCCESS' && <div className="verify-success"><CheckCircle size={38} /><h2>Community verified.</h2><p>Your trust status is now updated for ride and vehicle-sharing flows.</p><button className="btn btn-primary" onClick={onDone}>Return to Way Mate <ArrowRight size={16} /></button></div>}
  </div></div></div>;
};
