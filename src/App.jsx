import React from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { Header } from './components/Header.jsx';
import { Navigation } from './components/Navigation.jsx';
import { UserProfileModal } from './components/UserProfileModal.jsx';
import { FindRidePage } from './pages/FindRidePage.jsx';
import { OfferRidePage } from './pages/OfferRidePage.jsx';
import { WalletPage } from './pages/WalletPage.jsx';
import { TripsPage } from './pages/TripsPage.jsx';
import { LendingPage } from './pages/LendingPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { LoadingScreen } from './pages/LoadingScreen.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { VerificationPage } from './pages/VerificationPage.jsx';
import { DemandPage } from './pages/DemandPage.jsx';
import { PlayCircle, AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Waymate UI Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-subtle, #F8FAFC)',
          padding: '24px',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#FEF3C7',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <AlertTriangle size={28} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
              Something went wrong loading this view
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px', lineHeight: '1.5' }}>
              Waymate encountered an unexpected view state. Click below to return to the campus dashboard safely.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.hash = '#/dashboard';
                  window.location.reload();
                }}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <RefreshCw size={14} /> Reload Waymate
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent = () => {
  const { entryMode, setEntryMode, activeTab, toast, selectedProfileUser, closeUserProfile, reviews } = useApp();

  if (entryMode === 'loading') return <LoadingScreen />;
  if (entryMode === 'landing') return <LandingPage />;
  if (entryMode === 'signup' || entryMode === 'login') return <AuthPage />;
  if (entryMode === 'verification') return <VerificationPage onDone={() => setEntryMode('app')} />;

  return (
    <div className="app-shell">
      <Header />
      <Navigation />

      <aside className="demo-banner" aria-label="Demo flow guide">
        <div className="app-container demo-banner-inner">
          <div><PlayCircle size={14} /><strong>4-Minute Demo Script</strong><span>Search PVP SIT Parking → Hostel · request a seat · verify wallet −14 · offer a ride · check My Trips</span></div>
          <button onClick={() => setEntryMode('verification')}>Re-run verification flow</button>
        </div>
      </aside>

      <main className="main-content">
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'find' && <FindRidePage />}
        {activeTab === 'offer' && <OfferRidePage />}
        {activeTab === 'wallet' && <WalletPage />}
        {activeTab === 'lending' && <LendingPage />}
        {activeTab === 'trips' && <TripsPage />}
        {(activeTab === 'demand' || activeTab === 'smart-demand') && <DemandPage />}
        {activeTab === 'profile' && <ProfilePage />}
      </main>

      {/* Interlinked User Profile Modal */}
      {selectedProfileUser && (
        <UserProfileModal
          user={selectedProfileUser}
          reviews={reviews || []}
          onClose={closeUserProfile}
        />
      )}

      {toast && <div className="toast-container" role="status" aria-live="polite"><div className={`toast toast-${toast.type || 'info'}`}>{toast.message}</div></div>}
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
