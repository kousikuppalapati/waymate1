import React from 'react';

export const LoadingScreen = () => (
  <main className="loading-screen" aria-label="Loading Way Mate">
    <div className="loading-inner">
      <div className="loading-logo-wrap">
        <img src="/waymate-mark.png" alt="" className="loading-logo" />
      </div>
      <div className="loading-wordmark">Way <span>Mate</span></div>
      <p>Moving campus, together.</p>
      <div className="loading-line" aria-hidden="true"><span /></div>
      <div className="loading-caption">Preparing your Way Mate experience...</div>
    </div>
  </main>
);
