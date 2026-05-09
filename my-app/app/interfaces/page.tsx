'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { fetchInterfaces, fetchBandwidth } from '@/lib/api';

export default function InterfacesPage() {
  const [interfaces, setInterfaces] = useState<any[]>([]);
  const [bandwidth, setBandwidth] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [iface, bw] = await Promise.all([fetchInterfaces(), fetchBandwidth(1)]);
      setInterfaces(iface);
      setBandwidth(bw);
    };
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  const uniqueInterfaces = Object.values(
    interfaces.reduce((acc: any, cur: any) => {
      if (!acc[cur.interface_name] || new Date(cur.timestamp) > new Date(acc[cur.interface_name].timestamp)) {
        acc[cur.interface_name] = cur;
      }
      return acc;
    }, {})
  ) as any[];

  const latestBw = Object.values(
    bandwidth.reduce((acc: any, cur: any) => {
      if (!acc[cur.interface_name] || new Date(cur.timestamp) > new Date(acc[cur.interface_name].timestamp)) {
        acc[cur.interface_name] = cur;
      }
      return acc;
    }, {})
  ) as any[];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ padding: '28px 32px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '28px' }}>Interfaces</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {uniqueInterfaces.map((iface: any) => {
            const bw = latestBw.find((b: any) => b.interface_name === iface.interface_name);
            const mbpsIn = bw?.mbps_in || 0;
            const mbpsOut = bw?.mbps_out || 0;

            return (
              <div key={iface.interface_index} style={{
                background: 'var(--bg-card)', border: `1px solid ${iface.status === 'up' ? 'var(--border)' : 'var(--border)'}`,
                borderRadius: '12px', padding: '20px',
                borderLeft: `3px solid ${iface.status === 'up' ? 'var(--green)' : '#333'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{iface.interface_name}</span>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: iface.status === 'up' ? 'var(--green)' : '#444' }}>
                    {iface.status?.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[{ label: 'IN', value: `${mbpsIn.toFixed(2)} Mbps`, color: '#3b82f6' },
                    { label: 'OUT', value: `${mbpsOut.toFixed(2)} Mbps`, color: '#ff4d1c' },
                    { label: 'INDEX', value: iface.interface_index, color: 'var(--text-muted)' },
                    { label: 'SPEED', value: iface.speed ? `${(iface.speed / 1e6).toFixed(0)} Mbps` : 'N/A', color: 'var(--text-muted)' },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', marginBottom: '3px' }}>{item.label}</div>
                      <div style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: item.color }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}