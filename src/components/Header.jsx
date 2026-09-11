import React, { useState, useRef, useEffect } from 'react';
import { Coins, ShieldCheck, Wifi, WifiOff, LogOut, Bell, Check, CheckCheck, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { UserAvatar } from './UserAvatar.jsx';

export const Header = () => {
  const {
    user,
    wallet,
    activeTab,
    setActiveTab,
    setEntryMode,
    isOffline,
    toggleOffline,
    logout,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  const firstName = user?.name?.split(' ')[0] || user?.username || 'Member';

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showNotifications]);

  const handleNotificationClick = async (notif) => {
    if (!notif.is_read) {
      await markNotificationAsRead(notif.id);
    }
    setShowNotifications(false);
    if (notif.type?.includes('RIDE')) {
      setActiveTab('trips');
    } else if (notif.type?.includes('LENDING')) {
      setActiveTab('lending');
    }
  };

  const formatTime = (ts) => {
    if (!ts) return 'Just now';
    const diff = Math.floor((Date.now() - ts) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return '1d ago';
  };

  return (
    <header className="app-header">
      {isOffline && (
        <div className="offline-banner">
          <WifiOff size={14} /> Offline simulation is active <button onClick={toggleOffline}>Go online</button>
        </div>
      )}
      <div className="app-container header-inner">
        <button className="brand-lockup" onClick={() => setEntryMode('landing')} aria-label="Way Mate landing page">
          <img src="/waymate-mark.png" alt="" />
          <span>Way <span>Mate</span></span>
          <small>PVP SIT Community</small>
        </button>
        <div className="header-tools">
          <button
            className={`credit-pill ${activeTab === 'wallet' ? 'active' : ''}`}
            onClick={() => setActiveTab('wallet')}
            title="Open community wallet"
          >
            <Coins size={16} />
            <strong>{wallet?.balance ?? 0}</strong>
            <span>credits</span>
          </button>

          <button
            className="network-pill"
            onClick={toggleOffline}
            title="Toggle offline demo mode"
          >
            {isOffline ? <WifiOff size={16} /> : <Wifi size={16} />}
          </button>

          {/* Notification Bell Dropdown (Sections 25-35) */}
          <div className="notification-bell-container" ref={notifRef} style={{ position: 'relative' }}>
            <button
              className={`notification-bell-btn ${showNotifications ? 'active' : ''}`}
              onClick={() => setShowNotifications(prev => !prev)}
              title="View community notifications"
              aria-label="Notifications"
            >
              <Bell size={16} />
              {unreadNotificationCount > 0 && (
                <span className="notification-badge">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-popover" role="dialog" aria-label="Notifications popover">
                <div className="notification-popover-header">
                  <div>
                    <strong>Notifications</strong>
                    {unreadNotificationCount > 0 && (
                      <span className="badge badge-seats" style={{ marginLeft: '6px', fontSize: '10px' }}>
                        {unreadNotificationCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      className="mark-all-read-btn"
                      onClick={() => markAllNotificationsAsRead()}
                      title="Mark all as read"
                    >
                      <CheckCheck size={13} /> Mark all read
                    </button>
                  )}
                </div>

                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <div className="notification-empty">
                      <Bell size={20} color="var(--text-tertiary)" />
                      <p>No notifications yet</p>
                      <small>Trip updates and peer actions will appear here.</small>
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        className={`notification-item ${!notif.is_read ? 'unread' : ''}`}
                        onClick={() => handleNotificationClick(notif)}
                      >
                        <UserAvatar
                          src={notif.senderAvatar}
                          name={notif.senderName || 'Member'}
                          size={36}
                          showBadge
                          isVerified={notif.senderTrustLevel === 'Highly Trusted' || notif.senderTrustLevel === 'Trusted Member'}
                        />
                        <div className="notification-item-content">
                          <div className="notification-item-title">
                            <span>{notif.title}</span>
                            <small>{formatTime(notif.createdAt)}</small>
                          </div>
                          <p className="notification-item-msg">{notif.message}</p>
                        </div>
                        {!notif.is_read && <span className="unread-dot" />}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            className="profile-quick"
            onClick={() => setActiveTab('profile')}
            title={`Open ${firstName}'s profile`}
            style={{ padding: 0, border: 'none', background: 'transparent' }}
          >
            <UserAvatar src={user?.avatar} name={user?.name || firstName} size={36} showBadge isVerified={user?.isVerified} />
          </button>
          <button className="logout-button" onClick={logout} title="Sign out"><LogOut size={16} /></button>
        </div>
      </div>
    </header>
  );
};
