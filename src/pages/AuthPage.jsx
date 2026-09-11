import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bike,
  Building,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Upload,
  UserCheck,
  UserRound,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { INITIAL_USERS } from '../types/data.js';
import { UserAvatar } from '../components/UserAvatar.jsx';

const initialSignup = {
  username: '',
  fullName: '',
  registrationNumber: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  college: 'PVP Siddhartha Institute of Technology',
  pgArea: 'Green Residency PG',
  hasVehicle: false,
  vehicleModel: '',
  vehicleColour: '',
  vehicleRegistration: '',
  fuelType: 'Petrol',
  isEv: false,
  avatar: ''
};

export const AuthPage = () => {
  const { entryMode, setEntryMode, signUp, login, isSubmitting, globalError, setActiveTab, reloadData } = useApp();
  const [form, setForm] = useState(initialSignup);
  const [loginForm, setLoginForm] = useState({ emailOrUserId: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [signupStep, setSignupStep] = useState(1); // 1: Identity, 2: Community, 3: Vehicle & Photo
  const [avatarError, setAvatarError] = useState('');
  const [createdUserNotice, setCreatedUserNotice] = useState(null);

  const isSignup = entryMode !== 'login';
  const passwordReady = form.password.length >= 8;

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
    setAvatarError('');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Image is too large. Please select a photo under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      update('avatar', String(reader.result));
      setAvatarError('');
    };
    reader.onerror = () => {
      setAvatarError('PROFILE PHOTO UPLOAD FAILED. Please try selecting the image again.');
    };
    reader.readAsDataURL(file);
  };

  const validateStep1 = () => {
    const phoneDigits = form.phone.replace(/\D/g, '');
    if (form.username.trim().length < 3) {
      setError('Username should be at least 3 characters.');
      return false;
    }
    if (!form.fullName.trim()) {
      setError('Full name is required.');
      return false;
    }
    if (!form.registrationNumber.trim()) {
      setError('College registration number is required.');
      return false;
    }
    if (!form.email.includes('@')) {
      setError('Enter a valid campus email address.');
      return false;
    }
    if (phoneDigits.length < 10) {
      setError('Enter a valid 10-digit mobile phone number.');
      return false;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    if (!form.college.trim()) {
      setError('College name is required.');
      return false;
    }
    if (!form.pgArea.trim()) {
      setError('PG or hostel area is required.');
      return false;
    }
    setError('');
    return true;
  };

  const handleNextStep = () => {
    if (signupStep === 1 && validateStep1()) {
      setSignupStep(2);
    } else if (signupStep === 2 && validateStep2()) {
      setSignupStep(3);
    }
  };

  const submitSignup = async (e) => {
    e.preventDefault();
    if (form.hasVehicle) {
      if (!form.vehicleModel.trim()) {
        return setError('Vehicle model is required if you have access to a vehicle.');
      }
      if (!form.vehicleRegistration.trim()) {
        return setError('Vehicle registration plate is required.');
      }
    }

    try {
      const res = await signUp(form);
      setCreatedUserNotice(res.user);
    } catch (err) {
      setError(err.message || 'COULDN\'T CREATE ACCOUNT. Please review your details and try again.');
    }
  };

  const handleFinishSignup = () => {
    setCreatedUserNotice(null);
    if (reloadData) reloadData();
    setActiveTab('dashboard');
    setEntryMode('app');
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.emailOrUserId.trim() || loginForm.password.length < 6) {
      return setError('INVALID WAYMATE ID OR PASSWORD');
    }
    try {
      await login(loginForm);
      setActiveTab('dashboard');
      setEntryMode('app');
    } catch (err) {
      setError(err.message || 'INVALID WAYMATE ID OR PASSWORD');
    }
  };

  const handleUseDemoAccount = (demoUser) => {
    const demoPassword = `Waymate@${demoUser.generatedUserId.replace('WM-', '')}`;
    setLoginForm({
      emailOrUserId: demoUser.generatedUserId,
      password: demoPassword
    });
    setError('');
    // Focus login field without auto-submitting
    const input = document.getElementById('login-email-id');
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-shell">
        {/* Left Informational Sidebar */}
        <aside className="auth-aside">
          <button className="brand-lockup" onClick={() => setEntryMode('landing')}>
            <img src="/waymate-mark.png" alt="" />
            <span>Way <span>Mate</span></span>
          </button>
          <div className="auth-aside-copy">
            <span className="eyebrow"><ShieldCheck size={14} /> PVP SIT Campus Mobility</span>
            <h1>Turn empty seats into <em>shared journeys.</em></h1>
            <p>Find nearby campus rides, share spare seats, build peer trust, and move credits through one connected network.</p>
            <div className="auth-proof-list">
              <div><strong>01</strong><span>Verified campus identity</span></div>
              <div><strong>02</strong><span>Transparent peer trust tiers</span></div>
              <div><strong>03</strong><span>Community credits for fuel sharing</span></div>
            </div>
          </div>
          <small>PVPSIT Parking · Hostel · PG network</small>
        </aside>

        {/* Main Form Panel */}
        <section className="auth-panel">
          <div className="auth-panel-head">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <button
                type="button"
                className="brand-lockup auth-mobile-brand"
                onClick={() => setEntryMode('landing')}
                aria-label="Go to landing page"
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
              >
                <img src="/waymate-mark.png" alt="" />
                <span>Way <span>Mate</span></span>
              </button>
              <button
                type="button"
                onClick={() => setEntryMode('landing')}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              >
                <ArrowLeft size={14} /> Back to Home
              </button>
            </div>

            <span className="auth-kicker">{isSignup ? 'Create your account' : 'Welcome back to Waymate'}</span>
            <h2>{isSignup ? 'Join your campus mobility network.' : 'Sign in to your account.'}</h2>
            <p>{isSignup ? 'Complete the steps below to join the PVPSIT student circle.' : 'Sign in with your campus email or Waymate ID (e.g. WM-1001).'}</p>
          </div>

          <div className="auth-switch" role="tablist" aria-label="Authentication mode">
            <button className={!isSignup ? 'active' : ''} onClick={() => { setEntryMode('login'); setError(''); }}>Log in</button>
            <button className={isSignup ? 'active' : ''} onClick={() => { setEntryMode('signup'); setError(''); }}>Sign up</button>
          </div>

          {(error || globalError) && (
            <div className="auth-error" style={{ marginBottom: '16px' }}>
              <AlertCircle size={16} />
              <span>{error || globalError?.message}</span>
            </div>
          )}

          {/* SIGNUP FORM (Section 60: Clean multi-step flow) */}
          {isSignup ? (
            createdUserNotice ? (
              /* Success Confirmation Banner (Section 60) */
              <div style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                textAlign: 'center'
              }}>
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
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                  ACCOUNT CREATED
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Welcome to Waymate, {createdUserNotice.name}! Your account has been registered in the campus database.
                </p>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  textAlign: 'left',
                  border: '1px solid var(--border-light)',
                  marginBottom: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: '600' }}>WAYMATE ID:</span>
                    <strong style={{ fontSize: '14px', color: 'var(--primary)' }}>{createdUserNotice.generatedUserId}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: '600' }}>VERIFICATION:</span>
                    <span className="badge badge-warning" style={{ fontSize: '11px', padding: '2px 8px' }}>
                      PENDING VERIFICATION
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: '600' }}>COMMUNITY TRUST:</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                      NEW MEMBER (0 reviews)
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: '600' }}>WELCOME WALLET:</span>
                    <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>100 Credits</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFinishSignup}
                  className="btn btn-primary btn-block"
                >
                  Continue to Campus Dashboard <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <form className="auth-form" onSubmit={submitSignup} noValidate>
                {/* Step Progress Indicators */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12px'
                }}>
                  <span style={{ fontWeight: signupStep === 1 ? '700' : '500', color: signupStep === 1 ? 'var(--primary)' : 'var(--text-tertiary)' }}>
                    01 Identity
                  </span>
                  <span>→</span>
                  <span style={{ fontWeight: signupStep === 2 ? '700' : '500', color: signupStep === 2 ? 'var(--primary)' : 'var(--text-tertiary)' }}>
                    02 Community
                  </span>
                  <span>→</span>
                  <span style={{ fontWeight: signupStep === 3 ? '700' : '500', color: signupStep === 3 ? 'var(--primary)' : 'var(--text-tertiary)' }}>
                    03 Vehicle & Photo
                  </span>
                </div>

                {/* STEP 1: Basic Identity */}
                {signupStep === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="auth-two-col">
                      <label>
                        Username
                        <div className="input-with-icon">
                          <UserRound size={16} />
                          <input
                            value={form.username}
                            onChange={e => update('username', e.target.value)}
                            placeholder="e.g. rohit24"
                            autoComplete="username"
                            required
                          />
                        </div>
                      </label>
                      <label>
                        Full Name
                        <div className="input-with-icon">
                          <UserCheck size={16} />
                          <input
                            value={form.fullName}
                            onChange={e => update('fullName', e.target.value)}
                            placeholder="e.g. Rohit Sharma"
                            autoComplete="name"
                            required
                          />
                        </div>
                      </label>
                    </div>

                    <label>
                      Registration Number
                      <div className="input-with-icon">
                        <ShieldCheck size={16} />
                        <input
                          value={form.registrationNumber}
                          onChange={e => update('registrationNumber', e.target.value)}
                          placeholder="e.g. 23P81A0105"
                          autoComplete="off"
                          required
                        />
                      </div>
                    </label>

                    <div className="auth-two-col">
                      <label>
                        Campus Email
                        <div className="input-with-icon">
                          <Mail size={16} />
                          <input
                            type="email"
                            value={form.email}
                            onChange={e => update('email', e.target.value)}
                            placeholder="e.g. rohit@waymate.app"
                            autoComplete="email"
                            required
                          />
                        </div>
                      </label>
                      <label>
                        Phone Number
                        <div className="input-with-icon">
                          <Phone size={16} />
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={e => update('phone', e.target.value)}
                            placeholder="10-digit mobile"
                            autoComplete="tel"
                            required
                          />
                        </div>
                      </label>
                    </div>

                    <div className="auth-two-col">
                      <label>
                        Password
                        <div className="input-with-icon password-input">
                          <LockKeyhole size={16} />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={form.password}
                            onChange={e => update('password', e.target.value)}
                            placeholder="At least 8 chars"
                            autoComplete="new-password"
                            required
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password">
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </label>
                      <label>
                        Confirm Password
                        <div className="input-with-icon password-input">
                          <LockKeyhole size={16} />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={form.confirmPassword}
                            onChange={e => update('confirmPassword', e.target.value)}
                            placeholder="Confirm password"
                            autoComplete="new-password"
                            required
                          />
                        </div>
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="btn btn-primary btn-block"
                      style={{ marginTop: '10px' }}
                    >
                      Continue to Community <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                {/* STEP 2: Community & Residence */}
                {signupStep === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <label>
                      College / Institution
                      <div className="input-with-icon">
                        <Building size={16} />
                        <input
                          value={form.college}
                          onChange={e => update('college', e.target.value)}
                          placeholder="College name"
                          required
                        />
                      </div>
                    </label>

                    <label>
                      PG / Hostel Residential Area
                      <div className="input-with-icon">
                        <MapPin size={16} />
                        <select
                          className="form-select"
                          value={form.pgArea}
                          onChange={e => update('pgArea', e.target.value)}
                          style={{ width: '100%', paddingLeft: '36px' }}
                        >
                          <option value="Green Residency PG">Green Residency PG</option>
                          <option value="Central PG">Central PG</option>
                          <option value="North Hostel Block">North Hostel Block</option>
                          <option value="Lakeview Hostel">Lakeview Hostel</option>
                          <option value="Student Housing Complex">Student Housing Complex</option>
                          <option value="Campus Food Street">Campus Food Street</option>
                          <option value="Market">Market Area</option>
                        </select>
                      </div>
                    </label>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setSignupStep(1)}
                        className="btn btn-secondary"
                        style={{ flex: 1 }}
                      >
                        <ArrowLeft size={14} /> Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="btn btn-primary"
                        style={{ flex: 2 }}
                      >
                        Continue to Vehicle & Photo <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Vehicle Access & Profile Picture (Sections 11 & 12) */}
                {signupStep === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Vehicle Access Question */}
                    <div>
                      <label className="form-label" style={{ fontWeight: '700', marginBottom: '8px' }}>
                        Do you have access to a bike or scooter?
                      </label>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                        <button
                          type="button"
                          onClick={() => update('hasVehicle', true)}
                          className={form.hasVehicle ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                          style={{ flex: 1 }}
                        >
                          ✓ YES, I have a two-wheeler
                        </button>
                        <button
                          type="button"
                          onClick={() => update('hasVehicle', false)}
                          className={!form.hasVehicle ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                          style={{ flex: 1 }}
                        >
                          ✕ NO, passenger account
                        </button>
                      </div>
                    </div>

                    {/* Vehicle fields if YES */}
                    {form.hasVehicle && (
                      <div style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}>
                        <div className="auth-two-col">
                          <label>
                            Vehicle Model
                            <input
                              className="form-input"
                              value={form.vehicleModel}
                              onChange={e => update('vehicleModel', e.target.value)}
                              placeholder="e.g. Honda Activa 6G"
                              required
                            />
                          </label>
                          <label>
                            Vehicle Colour
                            <input
                              className="form-input"
                              value={form.vehicleColour}
                              onChange={e => update('vehicleColour', e.target.value)}
                              placeholder="e.g. Matte Black"
                              required
                            />
                          </label>
                        </div>

                        <div className="auth-two-col">
                          <label>
                            Registration Plate
                            <input
                              className="form-input"
                              value={form.vehicleRegistration}
                              onChange={e => update('vehicleRegistration', e.target.value)}
                              placeholder="e.g. AP 16 XX 1234"
                              required
                            />
                          </label>
                          <label>
                            Fuel Type
                            <select
                              className="form-select"
                              value={form.fuelType}
                              onChange={e => {
                                update('fuelType', e.target.value);
                                if (e.target.value === 'Electric') update('isEv', true);
                              }}
                            >
                              <option value="Petrol">Petrol</option>
                              <option value="Electric">Electric</option>
                            </select>
                          </label>
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={form.isEv}
                            onChange={e => {
                              update('isEv', e.target.checked);
                              if (e.target.checked) update('fuelType', 'Electric');
                            }}
                          />
                          <span>This is an Electric Vehicle (EV)</span>
                        </label>
                      </div>
                    )}

                    {/* Profile Photo Upload (Section 11) */}
                    <div>
                      <label className="form-label" style={{ fontWeight: '700', marginBottom: '6px' }}>
                        Profile Photo
                      </label>
                      <div className="upload-row" style={{ alignItems: 'center' }}>
                        <div className="upload-avatar" style={{ width: '56px', height: '56px', flexShrink: 0 }}>
                          {form.avatar ? (
                            <img src={form.avatar} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                          ) : (
                            <UserRound size={26} color="var(--text-tertiary)" />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <strong style={{ fontSize: '13px', display: 'block' }}>Student Profile Photo</strong>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                            Upload your portrait so other campus commuters can recognise you.
                          </p>
                        </div>
                        <label className="upload-button" style={{ cursor: 'pointer' }}>
                          <Upload size={14} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }} />
                          {form.avatar ? 'Change' : 'Upload'}
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                        </label>
                      </div>

                      {avatarError && (
                        <div style={{ color: '#B91C1C', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <AlertCircle size={14} />
                          <span>{avatarError}</span>
                        </div>
                      )}
                    </div>

                    <div className="auth-footnote" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      <ShieldCheck size={14} color="var(--primary)" />
                      Newly created student accounts join as <strong>Pending Verification</strong> and <strong>New Member</strong>.
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setSignupStep(2)}
                        className="btn btn-secondary"
                        style={{ flex: 1 }}
                        disabled={isSubmitting}
                      >
                        <ArrowLeft size={14} /> Back
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ flex: 2 }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Creating your account…' : 'Create Account'} <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )
          ) : (
            /* LOGIN FORM (Sections 7, 8, 59) */
            <div>
              <form className="auth-form" onSubmit={submitLogin} noValidate>
                <label>
                  Email or Waymate ID
                  <div className="input-with-icon">
                    <Mail size={16} />
                    <input
                      id="login-email-id"
                      value={loginForm.emailOrUserId}
                      onChange={e => {
                        setLoginForm(prev => ({ ...prev, emailOrUserId: e.target.value }));
                        setError('');
                      }}
                      placeholder="e.g. demo01@waymate.app or WM-1001"
                      autoComplete="username"
                      required
                    />
                  </div>
                </label>

                <label>
                  Password
                  <div className="input-with-icon password-input">
                    <LockKeyhole size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={e => {
                        setLoginForm(prev => ({ ...prev, password: e.target.value }));
                        setError('');
                      }}
                      placeholder="Enter account password"
                      autoComplete="current-password"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>

                <div className="login-help" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>Login with campus email or Waymate ID (e.g. WM-1001, WM-1003, WM-1008).</span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block auth-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing you in…' : 'Log in to Waymate'} <ArrowRight size={16} />
                </button>
              </form>

              {/* HACKATHON DEMO ACCOUNTS SECTION (Sections 8 & 59) */}
              <div style={{
                marginTop: '32px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} color="var(--primary)" />
                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                      Hackathon Demo Accounts
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    9 Seeded Students
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.4 }}>
                  Select any demo character below to test their specific dashboard, wallet, vehicle, and community trips. Clicking populates the login credentials for demonstration.
                </p>

                {/* Compact grid of 9 demo accounts */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '10px'
                }}>
                  {INITIAL_USERS.map(demoUser => (
                    <div
                      key={demoUser.id}
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-light)',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '8px',
                        transition: 'border-color 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <UserAvatar
                          src={demoUser.avatar}
                          name={demoUser.name}
                          size={36}
                          showBadge
                          isVerified={demoUser.isVerified}
                        />
                        <div style={{ minWidth: 0 }}>
                          <strong style={{ fontSize: '13px', color: 'var(--text-main)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {demoUser.name}
                          </strong>
                          <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700' }}>
                            {demoUser.generatedUserId}
                          </span>
                        </div>
                      </div>

                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', lineHeight: 1.2 }}>
                        {demoUser.role}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUseDemoAccount(demoUser)}
                        className="btn btn-secondary btn-sm"
                        style={{
                          fontSize: '11px',
                          padding: '4px 8px',
                          width: '100%',
                          justifyContent: 'center'
                        }}
                      >
                        Use demo account
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="auth-bottom">
            {isSignup ? 'Already part of the network?' : 'New to Waymate?'}
            <button onClick={() => { setEntryMode(isSignup ? 'login' : 'signup'); setError(''); setCreatedUserNotice(null); }}>
              {isSignup ? 'Log in' : 'Create an account'}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};
