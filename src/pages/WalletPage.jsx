import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { ArrowLeft, Coins, ArrowUpRight, ArrowDownLeft, ShieldCheck, PlusCircle, Info, Sparkles } from 'lucide-react';

export const WalletPage = () => {
  const { wallet, setActiveTab, navigateBack } = useApp();

  return (
    <div className="app-container" style={{ maxWidth: '720px', margin: '0 auto' }}>
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

      {/* Page Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-verified">
            Community Credit Wallet
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            Peer-to-Peer Cost Sharing
          </span>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' }}>
          Community Credits
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Credits represent shared fuel and transportation contributions, not monetary profits.
        </p>
      </div>

      {/* Main Balance Hero Card */}
      <div className="card" style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-light)',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Available Community Balance
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '38px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-1px' }}>
                {wallet.balance}
              </span>
              <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-muted)' }}>
                credits
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              ≈ ₹{wallet.balance} estimated campus fuel value
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('offer')}
              className="btn btn-primary btn-sm"
            >
              <PlusCircle size={15} />
              <span>Offer a ride to earn</span>
            </button>
          </div>
        </div>

        {/* Monthly Delta Breakdown */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginTop: '20px',
          paddingTop: '18px',
          borderTop: '1px solid var(--border-light)'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ArrowDownLeft size={18} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>This Month Earned</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--success)' }}>
                +{wallet.thisMonthEarned} credits
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#FEF2F2',
              color: '#B91C1C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ArrowUpRight size={18} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>This Month Used</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#B91C1C' }}>
                −{wallet.thisMonthUsed} credits
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Callout: How credits work */}
      <div style={{
        backgroundColor: 'var(--primary-light)',
        border: '1px solid var(--primary-border)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>
          <Info size={16} />
          <span>How Community Credits Flow</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <div>
            <strong style={{ color: 'var(--primary)' }}>When you share a ride:</strong>
            <div>+ credits added from passenger fuel contribution.</div>
          </div>
          <div>
            <strong style={{ color: 'var(--text-main)' }}>When you take a ride:</strong>
            <div>− credits deducted to cover shared travel cost.</div>
          </div>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>
            Recent Credit Activity
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            {wallet.transactions?.length || 0} entries
          </span>
        </div>

        {/* Empty State (Stress Test) */}
        {(!wallet.transactions || wallet.transactions.length === 0) ? (
          <div className="card" style={{ textAlign: 'center', padding: '36px 20px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <Coins size={24} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>
              Your wallet is waiting
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Share your first ride or reserve an empty seat to start earning and contributing community credits.
            </p>
            <button
              onClick={() => setActiveTab('offer')}
              className="btn btn-primary btn-sm"
            >
              Offer a ride
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {wallet.transactions.map(tx => {
              const isEarned = tx.type === 'EARNED';
              return (
                <div
                  key={tx.id}
                  className="card"
                  style={{
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: isEarned ? 'var(--success-bg)' : 'var(--bg-subtle)',
                      color: isEarned ? 'var(--success)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {isEarned ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>

                    <div>
                      <div className="text-break" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
                        {tx.description}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                        {tx.date}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    fontSize: '15px',
                    fontWeight: '800',
                    color: isEarned ? 'var(--success)' : 'var(--text-main)',
                    flexShrink: 0
                  }}>
                    {isEarned ? `+${tx.amount}` : `−${tx.amount}`}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
