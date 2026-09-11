import React from 'react';
import { ArrowUpRight, Bike, CalendarDays, Leaf, MapPin, Search, TrendingUp, Users, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export const DashboardPage = () => {
  const { user, wallet, rides = [], bookings = [], events = [], platformStats, setActiveTab, createEvent } = useApp();
  const [showEventForm, setShowEventForm] = React.useState(false);
  const [eventForm, setEventForm] = React.useState({ title: '', date: 'Sep 28', time: '5:00 PM', location: 'PVPSIT Campus', demand: 'Moderate', expectedDemand: 10 });

  const safeRides = rides || [];
  const safeBookings = bookings || [];
  const safeEvents = events || [];
  const safeWallet = wallet || { balance: 0, thisMonthEarned: 0, thisMonthUsed: 0, transactions: [] };

  const todayRides = safeRides.filter(r => r.date === 'Today' && r.status === 'ACTIVE').length;
  const todayBooked = safeBookings.filter(b => b.status === 'UPCOMING' && b.date === 'Today').length;
  const offeredToday = safeBookings.filter(b => b.type === 'PROVIDER' && b.date === 'Today').length;
  const activeRequests = Math.max(0, safeRides.reduce((count, ride) => count + (ride.requestsCount || 0), 0));

  const greetingName = user?.name ? user.name.split(' ')[0] : (user?.username || 'Member');
  const carbonSavedDisplay = typeof platformStats?.carbonSaved === 'number' 
    ? platformStats.carbonSaved.toFixed(1) 
    : (platformStats?.carbonSaved || '14.8');

  return (
    <div className="app-page dashboard-page">
      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">Good to see you, {greetingName}</span>
          <h1>Move through campus<br /><em>with the community.</em></h1>
          <p>Here is what is happening around Way Mate today.</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-secondary" onClick={() => setActiveTab('find')}><Search size={16} /> Find a ride</button>
          <button className="btn btn-primary" onClick={() => setActiveTab('offer')}><Bike size={16} /> Offer a ride</button>
        </div>
      </section>

      <section className="metric-grid">
        <article className="metric-card"><span><Bike size={17} /> Rides booked today</span><strong>{todayBooked || platformStats?.todayBooked || 3}</strong><small>Community demand right now</small></article>
        <article className="metric-card"><span><ArrowUpRight size={17} /> Rides offered today</span><strong>{offeredToday || platformStats?.todayOffered || 5}</strong><small>Students sharing empty seats</small></article>
        <article className="metric-card"><span><TrendingUp size={17} /> Active requests</span><strong>{activeRequests || platformStats?.activeRequests || 4}</strong><small>Requests looking for a match</small></article>
        <article className="metric-card accent"><span><Leaf size={17} /> Estimated CO₂ avoided</span><strong>{carbonSavedDisplay} t</strong><small>Demo estimate based on shared travel</small></article>
      </section>

      <div className="dashboard-grid">
        <section className="surface-card demand-card">
          <div className="card-heading"><div><span className="section-kicker">Demand</span><h2>Where the campus is moving</h2></div><button className="text-button" onClick={() => setActiveTab('demand')}>Open Demand <ArrowUpRight size={15} /></button></div>
          <div className="demand-row"><div><MapPin size={18} /><strong>PVP SIT Parking → Green Residency PG</strong><span>Most searched corridor</span></div><div className="demand-value high">High</div></div>
          <div className="demand-row"><div><CalendarDays size={18} /><strong>Upcoming events</strong><span>Demand rises around event start times</span></div><div className="demand-value">{safeEvents.length}</div></div>
          <div className="demand-row"><div><Users size={18} /><strong>Open seats</strong><span>{todayRides} active rides currently listed</span></div><div className="demand-value">{safeRides.filter(r => r.status === 'ACTIVE').reduce((sum, r) => sum + Number(r.seatsAvailable || 0), 0)}</div></div>
        </section>

        <section className="surface-card wallet-summary">
          <div className="card-heading"><div><span className="section-kicker">Community wallet</span><h2>{safeWallet.balance ?? 0} credits</h2></div><button className="text-button" onClick={() => setActiveTab('wallet')}>Open wallet <ArrowUpRight size={15} /></button></div>
          <div className="wallet-mini-grid"><div><span>Earned</span><strong>+{safeWallet.thisMonthEarned ?? 0}</strong></div><div><span>Used</span><strong>−{safeWallet.thisMonthUsed ?? 0}</strong></div></div>
          <p>Credits are shared fuel and transportation contributions — not monetary profits.</p>
        </section>
      </div>

      <section className="surface-card upcoming-card">
        <div className="card-heading"><div><span className="section-kicker">Upcoming campus events</span><h2>Plan before demand spikes.</h2></div><button className="text-button" onClick={() => setShowEventForm(value => !value)}>{showEventForm ? <><X size={15} /> Close</> : <><Plus size={15} /> Add event</>}</button></div>
        {showEventForm && <form className="event-form" onSubmit={async e => { e.preventDefault(); await createEvent(eventForm); setEventForm({ title: '', date: 'Sep 28', time: '5:00 PM', location: 'PVPSIT Campus', demand: 'Moderate', expectedDemand: 10 }); setShowEventForm(false); }}><input required placeholder="Event name" value={eventForm.title} onChange={e => setEventForm(prev => ({ ...prev, title: e.target.value }))} /><input required placeholder="Date" value={eventForm.date} onChange={e => setEventForm(prev => ({ ...prev, date: e.target.value }))} /><input required placeholder="Time" value={eventForm.time} onChange={e => setEventForm(prev => ({ ...prev, time: e.target.value }))} /><input required placeholder="Location" value={eventForm.location} onChange={e => setEventForm(prev => ({ ...prev, location: e.target.value }))} /><select value={eventForm.demand} onChange={e => setEventForm(prev => ({ ...prev, demand: e.target.value }))}><option>Low</option><option>Moderate</option><option>High</option></select><button className="btn btn-primary btn-sm" type="submit">Save event</button></form>}
        <div className="event-grid compact">
          {safeEvents.map(event => <article className="event-card" key={event.id}><div className="event-icon"><CalendarDays size={17} /></div><div><strong>{event.title}</strong><p>{event.date} · {event.time} · {event.location}</p></div><span className={`demand-chip ${(event.demand || 'moderate').toLowerCase().replace(' ', '-')}`}>{event.demand || 'Moderate'}</span></article>)}
        </div>
      </section>
    </div>
  );
};
