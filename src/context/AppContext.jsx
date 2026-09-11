import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  apiBookSeat,
  apiConfirmBooking,
  apiCancelTrip,
  apiCreateEvent,
  apiCreateRide,
  apiLogin,
  apiLogout,
  apiRequestVehicleLend,
  apiApproveVehicleLend,
  apiDeclineVehicleLend,
  apiHandoverVehicleLend,
  apiReturnVehicleLend,
  apiSignUp,
  apiUpdateProfile,
  apiVerifyUser,
  apiMarkNotificationAsRead,
  apiMarkAllNotificationsAsRead,
  clearSession,
  getSession,
  getSimulatedOfflineMode,
  isNetworkAvailable,
  loadDatabase,
  resetDatabase,
  saveDatabase,
  setSimulatedOfflineMode,
  hydrateAuthenticated,
  hydratePublic
} from '../services/api.js';

const AppContext = createContext(null);

const parseRouteFromHash = () => {
  const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
  if (!hash || hash === 'landing') return { mode: 'landing', tab: 'dashboard' };
  if (hash === 'login') return { mode: 'login', tab: 'dashboard' };
  if (hash === 'signup') return { mode: 'signup', tab: 'dashboard' };
  if (hash === 'verify' || hash === 'verification') return { mode: 'verification', tab: 'dashboard' };

  const validTabs = ['dashboard', 'find', 'offer', 'wallet', 'lending', 'demand', 'smart-demand', 'trips', 'profile'];
  if (validTabs.includes(hash)) {
    const tab = hash === 'smart-demand' ? 'demand' : hash;
    return { mode: 'app', tab };
  }
  return null;
};

const getHashForRoute = (mode, tab) => {
  if (mode === 'landing') return '#/landing';
  if (mode === 'login') return '#/login';
  if (mode === 'signup') return '#/signup';
  if (mode === 'verification') return '#/verify';
  if (mode === 'app') return `#/${tab || 'dashboard'}`;
  return '#/landing';
};

export const AppProvider = ({ children }) => {
  const [db, setDb] = useState(() => loadDatabase());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchParams, setSearchParams] = useState({ from: 'PVP SIT Parking', to: 'Green Residency PG', time: '5:30 PM' });
  const [entryMode, setEntryMode] = useState('loading');
  const [booting, setBooting] = useState(true);
  const [isOffline, setIsOffline] = useState(() => !isNetworkAvailable());
  const [toast, setToast] = useState(null);
  const [globalError, setGlobalError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);

  const reloadData = useCallback(async () => {
    try {
      const session = getSession();
      const fresh = session?.token ? await hydrateAuthenticated() : await hydratePublic();
      setDb(fresh);
      return fresh;
    } catch (error) {
      // Keep the last known cache when a refresh fails; mutation errors remain visible to the user.
      setDb(loadDatabase());
      throw error;
    }
  }, []);

  const handleSetActiveTab = useCallback((tabOrFn) => {
    setActiveTab(prev => {
      const next = typeof tabOrFn === 'function' ? tabOrFn(prev) : tabOrFn;
      const targetTab = next === 'smart-demand' ? 'demand' : next;
      setEntryMode('app');
      const targetHash = getHashForRoute('app', targetTab);
      if (window.location.hash !== targetHash) {
        window.history.pushState({ mode: 'app', tab: targetTab }, '', targetHash);
      }
      return targetTab;
    });
  }, []);

  const handleSetEntryMode = useCallback((modeOrFn) => {
    setEntryMode(prev => {
      const next = typeof modeOrFn === 'function' ? modeOrFn(prev) : modeOrFn;
      if (next !== 'loading') {
        const targetHash = getHashForRoute(next, activeTab);
        if (window.location.hash !== targetHash) {
          window.history.pushState({ mode: next, tab: activeTab }, '', targetHash);
        }
      }
      return next;
    });
  }, [activeTab]);

  const navigateBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      if (entryMode === 'app' && activeTab !== 'dashboard') {
        handleSetActiveTab('dashboard');
      } else {
        handleSetEntryMode('landing');
      }
    }
  }, [entryMode, activeTab, handleSetActiveTab, handleSetEntryMode]);

  const viewUserProfile = useCallback((userOrId) => {
    if (!userOrId) return;
    if (typeof userOrId === 'object') {
      setSelectedProfileUser(userOrId);
    } else {
      const found = db.users?.find(u => u.id === userOrId || u.generatedUserId === userOrId);
      if (found) setSelectedProfileUser(found);
    }
  }, [db.users]);

  const closeUserProfile = useCallback(() => {
    setSelectedProfileUser(null);
  }, []);

  useEffect(() => {
    const session = getSession();
    let initialMode = session?.userId ? 'app' : 'landing';
    let initialTab = 'dashboard';

    // Rehydrate the cached UI state from MongoDB on every app load.
    // This keeps the existing UI intact while making the server the source of truth.
    (async () => {
      try {
        const fresh = session?.token ? await hydrateAuthenticated() : await hydratePublic();
        setDb(fresh);
        if (session?.token && fresh?.user) initialMode = 'app';
      } catch (error) {
        console.warn('Waymate bootstrap refresh failed:', error);
      }
    })();

    const parsed = parseRouteFromHash();
    if (parsed) {
      if (parsed.mode === 'app' && !session?.userId) {
        initialMode = 'landing';
      } else {
        initialMode = parsed.mode;
        if (parsed.mode === 'app') initialTab = parsed.tab;
      }
    }

    const timer = window.setTimeout(() => {
      setBooting(false);
      setEntryMode(initialMode);
      setActiveTab(initialTab);
      const hash = getHashForRoute(initialMode, initialTab);
      if (window.location.hash !== hash) {
        window.history.replaceState({ mode: initialMode, tab: initialTab }, '', hash);
      }
    }, 800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onLocationChange = () => {
      const parsed = parseRouteFromHash();
      if (!parsed) return;
      const session = getSession();
      if (parsed.mode === 'app' && !session?.userId) {
        setEntryMode('landing');
        if (window.location.hash !== '#/landing') {
          window.location.hash = '#/landing';
        }
        return;
      }
      setEntryMode(parsed.mode);
      if (parsed.mode === 'app') {
        setActiveTab(parsed.tab);
      }
    };

    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('hashchange', onLocationChange);
    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('hashchange', onLocationChange);
    };
  }, []);

  useEffect(() => {
    const updateNetwork = () => setIsOffline(!isNetworkAvailable());
    window.addEventListener('online', updateNetwork);
    window.addEventListener('offline', updateNetwork);
    window.addEventListener('waymate_offline_change', updateNetwork);
    return () => {
      window.removeEventListener('online', updateNetwork);
      window.removeEventListener('offline', updateNetwork);
      window.removeEventListener('waymate_offline_change', updateNetwork);
    };
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(prev => prev?.message === message ? null : prev), 3500);
  }, []);

  const runMutation = async (action, successMessage) => {
    setIsSubmitting(true);
    setGlobalError(null);
    try {
      const result = await action();
      await reloadData();
      if (successMessage) showToast(successMessage, 'success');
      return result;
    } catch (error) {
      if (error.name === 'OfflineError') {
        setGlobalError({
          message: 'The community network is unavailable. Check your connection and try again.',
          onRetry: () => runMutation(action, successMessage)
        });
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const signUp = async (form) => {
    const result = await runMutation(
      () => apiSignUp(form),
      'Account created. Welcome to the Way Mate community.'
    );
    setDb(loadDatabase());
    return result;
  };

  const login = async (form) => {
    const result = await runMutation(
      () => apiLogin(form),
      'Welcome back. Your campus network is ready.'
    );
    setDb(loadDatabase());
    return result;
  };

  const logout = () => {
    apiLogout();
    setActiveTab('dashboard');
    setEntryMode('landing');
    window.location.hash = '#/landing';
    reloadData();
    showToast('You have been signed out.', 'info');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const verifyAccount = params => runMutation(
    () => apiVerifyUser(params),
    'Community verification updated.'
  );

  const bookRideSeat = ({ rideId, seats = 1, notes = '' }) => runMutation(
    () => apiBookSeat({ rideId, seats, notes }),
    'Seat request sent. Fuel contribution recorded.'
  );

  const confirmBooking = bookingId => runMutation(
    () => apiConfirmBooking(bookingId),
    'Passenger seat confirmed!'
  );

  const offerRide = rideData => runMutation(
    () => apiCreateRide(rideData),
    'Ride offered to the campus community.'
  );

  const cancelTrip = bookingId => runMutation(
    () => apiCancelTrip(bookingId),
    'Trip cancelled. Credits refunded and seat restored.'
  );

  const requestLend = (vehicleId, purpose) => runMutation(
    () => apiRequestVehicleLend(vehicleId, purpose),
    'Vehicle access request sent to the owner.'
  );

  const approveLend = vehicleId => runMutation(
    () => apiApproveVehicleLend(vehicleId),
    'Vehicle access request approved! Handover ready.'
  );

  const declineLend = vehicleId => runMutation(
    () => apiDeclineVehicleLend(vehicleId),
    'Vehicle access request declined.'
  );

  const handoverLend = vehicleId => runMutation(
    () => apiHandoverVehicleLend(vehicleId),
    'Vehicle handover confirmed. Trip in progress.'
  );

  const returnLend = vehicleId => runMutation(
    () => apiReturnVehicleLend(vehicleId),
    'Vehicle return completed. Lending contribution recorded in wallet.'
  );

  const updateProfile = data => runMutation(
    () => apiUpdateProfile(data),
    'Profile details updated.'
  );

  const createEvent = data => runMutation(
    () => apiCreateEvent(data),
    'Campus event added to the demand board.'
  );

  const markNotificationAsRead = notifId => runMutation(
    () => apiMarkNotificationAsRead(notifId),
    null
  );

  const markAllNotificationsAsRead = () => runMutation(
    () => apiMarkAllNotificationsAsRead(db.user?.id),
    'All notifications marked as read.'
  );

  const toggleOffline = () => {
    const next = !getSimulatedOfflineMode();
    setSimulatedOfflineMode(next);
    setIsOffline(!isNetworkAvailable());
    showToast(next ? 'Offline simulation enabled.' : 'Network restored.', next ? 'info' : 'success');
  };

  const handleResetData = async () => {
    clearSession();
    const fresh = await hydratePublic();
    setDb(fresh);
    handleSetEntryMode('landing');
    handleSetActiveTab('dashboard');
    setGlobalError(null);
    showToast('Waymate data refreshed from MongoDB.', 'info');
  };

  const platformStats = db.platformStats || { sharedRides: 0, members: db.users?.length || 0, carbonSaved: 0, todayBooked: 0, todayOffered: 0, activeRequests: 0 };

  // Current user's notifications (sorted newest first)
  const userNotifications = useMemo(() => {
    if (!db.user?.id) return [];
    return (db.notifications || [])
      .filter(n => n.recipientId === db.user.id)
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [db.notifications, db.user]);

  const unreadNotificationCount = useMemo(() => {
    return userNotifications.filter(n => !n.is_read).length;
  }, [userNotifications]);

  const value = {
    user: db.user,
    isAuthenticated: Boolean(getSession()?.userId),
    users: db.users || [],
    vehicles: db.vehicles || [],
    rides: db.rides || [],
    wallet: db.wallet || { balance: 0, thisMonthEarned: 0, thisMonthUsed: 0, transactions: [] },
    bookings: db.bookings || [],
    rideRequests: db.rideRequests || [],
    reviews: db.reviews || [],
    lending: db.lending || [],
    notifications: userNotifications,
    unreadNotificationCount,
    events: db.events || [],
    platformStats,
    activeTab,
    setActiveTab: handleSetActiveTab,
    searchParams,
    setSearchParams,
    entryMode,
    setEntryMode: handleSetEntryMode,
    navigateBack,
    booting,
    isOffline,
    toggleOffline,
    toast,
    showToast,
    globalError,
    clearGlobalError: () => setGlobalError(null),
    isSubmitting,
    selectedProfileUser,
    viewUserProfile,
    closeUserProfile,
    signUp,
    login,
    logout,
    verifyAccount,
    bookRideSeat,
    confirmBooking,
    offerRide,
    cancelTrip,
    requestLend,
    approveLend,
    declineLend,
    handoverLend,
    returnLend,
    updateProfile,
    createEvent,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    handleResetData,
    reloadData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used within AppProvider');
  return value;
};
