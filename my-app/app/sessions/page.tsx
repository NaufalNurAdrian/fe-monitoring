'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import SessionChart from '@/components/SessionChart';
import { fetchSessions, fetchLatestSession } from '@/lib/api';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [latest, setLatest] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const [s, l] = await Promise.all([fetchSessions(3), fetchLatestSession()]);
      setSessions(s);
      setLatest(l);
    };
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  const utilPct = latest ? ((latest.active_sessions / latest.max_sessions) * 100).toFixed(3) : '0';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ padding: '28px 32px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '28px' }}>Sessions</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
          {[
            { label: 'Active Sessions', value: latest?.active_sessions?.toLocaleString() || '—' },
            { label: 'Max Sessions', value: latest?.max_sessions?.toLocaleString() || '—' },
            { label: 'Utilization', value: `${utilPct}%` },
          ].map(card => (
            <div key={card.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'var(--font-mono)' }}>{card.label}</div>
              <div style={{ fontSize: '26px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{card.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
            Session history — 3 hours
          </div>
          <div style={{ height: '280px' }}>
            <SessionChart data={sessions} />
          </div>
        </div>
      </main>
    </div>
  );
}