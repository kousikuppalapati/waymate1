import React from 'react';
import { ArrowRight, CalendarDays, Leaf, MapPin, ShieldCheck, Users, Bike } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { formatNumber } from '../utils.js';

export const LandingPage = () => {
  const { setEntryMode, platformStats, events, isAuthenticated } = useApp();

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <button className="brand-lockup" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/waymate-mark.png" alt="" />
          <span>Way <span>Mate</span></span>
        </button>
        <nav className="landing-links" aria-label="Landing navigation">
          <a href="#how-it-works" onClick={e => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}>How it works</a>
          <a href="#impact" onClick={e => { e.preventDefault(); document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' }); }}>Impact</a>
          <a href="#events" onClick={e => { e.preventDefault(); document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' }); }}>Campus events</a>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isAuthenticated && (
            <button className="btn btn-secondary btn-sm" onClick={() => setEntryMode('app')} style={{ fontSize: '13px' }}>
              Open App →
            </button>
          )}
          <button className="landing-login" onClick={() => setEntryMode('login')}>
            Log in
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setEntryMode('signup')} style={{ fontSize: '13px', padding: '7px 14px' }}>
            Sign up
          </button>
        </div>
      </header>

      <main>
        <section className="landing-hero" id="impact">
          <div className="hero-copy">
            <span className="eyebrow"><MapPin size={14} /> Built for campus travel</span>
            <h1>Share rides.<br /><em>Go further.</em></h1>
            <p>Way Mate helps students turn empty seats into trusted campus journeys — with community credits, verified profiles and smarter demand signals.</p>
            <div className="hero-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button className="btn btn-primary" onClick={() => setEntryMode('signup')}>
                Sign up / Get started <ArrowRight size={16} />
              </button>
              <button className="btn btn-secondary" onClick={() => setEntryMode('login')}>
                Log in
              </button>
              {isAuthenticated && (
                <button className="btn btn-outline-primary" onClick={() => setEntryMode('app')}>
                  Open App Dashboard →
                </button>
              )}
            </div>
            <div className="hero-note"><ShieldCheck size={15} /> Student-first community trust</div>
          </div>

          <div className="hero-visual" aria-label="Way Mate platform impact">
            <div className="route-orbit orbit-one" />
            <div className="route-orbit orbit-two" />
            <div className="landing-impact-card">
              <div className="impact-mark"><img src="/waymate-mark.png" alt="" /></div>
              <div className="impact-stat"><strong>{formatNumber(platformStats.sharedRides)}</strong><span>TOTAL RIDES</span></div>
              <div className="impact-stat"><strong>{formatNumber(platformStats.members)}</strong><span>TOTAL COMMUNITY USERS</span></div>
              <div className="impact-stat"><strong>{platformStats.carbonSaved.toFixed(1)} t</strong><span>ESTIMATED CO₂ AVOIDED</span></div>
              <small>Demo estimates become database-driven as the community grows.</small>
            </div>
          </div>
        </section>

        <section className="landing-section" id="how-it-works">
          <div className="section-heading"><span>01 — How it works</span><h2>One network for the whole journey.</h2></div>
          <div className="how-grid">
            <article><div className="step-number">01</div><Bike /><h3>Find or offer a ride</h3><p>Search campus routes or turn your spare seat into a useful trip.</p></article>
            <article><div className="step-number">02</div><ShieldCheck /><h3>Travel with context</h3><p>See profile trust, reviews, vehicle details and route information before requesting.</p></article>
            <article><div className="step-number">03</div><Leaf /><h3>Build community value</h3><p>Credits move between students while shared trips reduce unnecessary travel.</p></article>
          </div>
        </section>

        <section className="landing-section event-section" id="events">
          <div className="section-heading"><span>02 — Demand signals</span><h2>Campus events become mobility signals.</h2></div>
          <div className="event-grid">
            {events.slice(0, 3).map(event => (
              <article className="event-card" key={event.id}>
                <div className="event-icon"><CalendarDays size={18} /></div>
                <div><strong>{event.title}</strong><p>{event.date} · {event.location}</p></div>
                <span className={`demand-chip ${event.demand.toLowerCase().replace(' ', '-')}`}>{event.demand} demand</span>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-footer-card">
          <div><Users size={20} /><div><strong>Designed around the campus community.</strong><p>Start with one ride. Let the network get smarter with every trip.</p></div></div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={() => setEntryMode('login')}>Log in</button>
            <button className="btn btn-primary" onClick={() => setEntryMode('signup')}>Sign up for Way Mate <ArrowRight size={16} /></button>
          </div>
        </section>
      </main>
    </div>
  );
};
