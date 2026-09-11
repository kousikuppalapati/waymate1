import React from 'react';
import { LayoutDashboard, Search, PlusCircle, CalendarCheck, Coins, KeyRound, UserCheck, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export const Navigation = () => {
  const { activeTab, setActiveTab, bookings } = useApp();
  const upcomingCount = bookings.filter(b => b.status === 'UPCOMING' || b.status === 'OFFERED').length;
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'find', label: 'Find a Ride', short: 'Find', icon: Search },
    { id: 'offer', label: 'Offer a Ride', short: 'Offer', icon: PlusCircle },
    { id: 'wallet', label: 'Community Credits', short: 'Credits', icon: Coins },
    { id: 'lending', label: 'Lend Vehicle', short: 'Lend', icon: KeyRound },
    { id: 'demand', label: 'Demand', short: 'Demand', icon: Activity },
    { id: 'trips', label: 'My Trips', short: 'Trips', icon: CalendarCheck, badge: upcomingCount || null },
    { id: 'profile', label: 'Profile & Trust', short: 'Profile', icon: UserCheck }
  ];

  const isTabActive = id => activeTab === id || (id === 'demand' && activeTab === 'smart-demand');

  return <>
    <nav className="desktop-nav" aria-label="Main navigation"><div className="app-container nav-inner">{items.map(item => { const Icon = item.icon; return <button key={item.id} className={isTabActive(item.id) ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab(item.id)}><Icon size={16} /><span>{item.label}</span>{item.badge ? <b>{item.badge}</b> : null}</button>; })}</div></nav>
    <nav className="mobile-nav" aria-label="Mobile navigation">{items.filter(item => ['dashboard', 'find', 'offer', 'wallet', 'lending', 'demand', 'trips', 'profile'].includes(item.id)).map(item => { const Icon = item.icon; return <button key={item.id} className={isTabActive(item.id) ? 'mobile-nav-item active' : 'mobile-nav-item'} onClick={() => setActiveTab(item.id)}><span className="mobile-icon"><Icon size={19} />{item.badge ? <b>{item.badge}</b> : null}</span><span>{item.short || item.label}</span></button>; })}</nav>
  </>;
};
