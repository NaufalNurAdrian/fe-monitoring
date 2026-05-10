'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { fetchThreats } from '@/lib/api';

export default function ThreatsPage() {
  const [threats, setThreats] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchThreats(24);
      setThreats(data);
    };
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ padding: '28px 32px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '28px' }}>Threats</h1>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
            Threat log — 24 hours
          </div>
          {threats.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>No threats detected</div>
          ) : (
            threats.slice(0, 20).map((t: any) => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #13151a', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: '#ccc' }}>{t.threat_type}</span>
                <span style={{ color: t.threat_count > 0 ? 'var(--accent)' : 'var(--text-muted)' }}>{t.threat_count}</span>
                <span style={{ color: 'var(--text-muted)' }}>{new Date(t.timestamp).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}