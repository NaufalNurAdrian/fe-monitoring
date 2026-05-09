'use client';
import { useEffect, useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import MetricCard from '@/components/MetricCard';
import SessionChart from '@/components/SessionChart';
import BandwidthChart from '@/components/BandwidthChart';
import { fetchLatestSession, fetchSessions, fetchBandwidth, fetchInterfaces } from '@/lib/api';

export default function Dashboard() {
  const [session, setSession] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [bandwidth, setBandwidth] = useState<any[]>([]);
  const [interfaces, setInterfaces] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const load = useCallback(async () => {
    try {
      const [s, sh, bw, iface] = await Promise.all([
        fetchLatestSession(),
        fetchSessions(1),
        fetchBandwidth(1),
        fetchInterfaces(),
      ]);
      setSession(s);
      setSessions(sh);
      setBandwidth(bw);
      setInterfaces(iface);
      setLastUpdate(new Date());
    } catch (e) {
      console.error('Fetch error:', e);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  // Dedupe interfaces — ambil latest per interface_name
  const uniqueInterfaces = Object.values(
    interfaces.reduce((acc: any, cur: any) => {
      if (!acc[cur.interface_name] || new Date(cur.timestamp) > new Date(acc[cur.interface_name].timestamp)) {
        acc[cur.interface_name] = cur;
      }
      return acc;
    }, {})
  ) as any[];

  // Bandwidth latest per interface
  const latestBw = Object.values(
    bandwidth.reduce((acc: any, cur: any) => {
      if (!acc[cur.interface_name] || new Date(cur.timestamp) > new Date(acc[cur.interface_name].timestamp)) {
        acc[cur.interface_name] = cur;
      }
      return acc;
    }, {})
  ) as any[];

  const upCount = uniqueInterfaces.filter((i: any) => i.status === 'up').length;
  const totalMbpsIn = latestBw.reduce((sum: number, b: any) => sum + (b.mbps_in || 0), 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: '100vh' }}>
      <Sidebar />

      <main style={{ padding: '28px 32px', overflow: 'auto' }}>
        {/* Topbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em' }}>Network Overview</h1>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#0f1f15', border: '1px solid #1a3a22',
            padding: '6px 12px', borderRadius: '20px',
            fontSize: '12px', color: 'var(--green)',
            fontFamily: 'var(--font-mono)',
          }}>
            <div style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: 'var(--green)',
              animation: 'pulse 2s infinite',
            }} />
            Live — {lastUpdate.toLocaleTimeString()}
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
          <MetricCard
            label="Active Sessions"
            value={session?.active_sessions?.toLocaleString() || '—'}
            sub={`Max: ${session?.max_sessions?.toLocaleString() || '1,100,000'}`}
          />
          <MetricCard
            label="CPU (Mgmt)"
            value={`${session?.cpu_usage || 0}%`}
            sub={`Dataplane: ${session?.memory_usage || 0}%`}
            color={session?.cpu_usage > 80 ? 'amber' : 'default'}
          />
          <MetricCard
            label="Interfaces UP"
            value={upCount}
            sub={uniqueInterfaces.filter((i: any) => i.status === 'up').map((i: any) => i.interface_name).join(', ')}
            color="green"
          />
          <MetricCard
            label="Total Bandwidth"
            value={`${totalMbpsIn.toFixed(1)} Mbps`}
            sub="Inbound combined"
          />
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
              Session trend — 60 min
            </div>
            <div style={{ height: '160px' }}>
              <SessionChart data={sessions} />
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
              Bandwidth — ethernet1/1
            </div>
            <div style={{ height: '160px' }}>
              <BandwidthChart data={bandwidth} interfaceName="ethernet1/1" />
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              {[{ color: '#3b82f6', label: 'In' }, { color: '#ff4d1c', label: 'Out' }].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interface Table */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
            Interface status
          </div>

          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 90px 90px 60px', gap: '12px', padding: '0 0 8px', borderBottom: '1px solid var(--border)', fontSize: '10px', color: '#444', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
            <span>NAME</span><span>UTILIZATION</span><span style={{ textAlign: 'right' }}>IN</span><span style={{ textAlign: 'right' }}>OUT</span><span style={{ textAlign: 'right' }}>STATUS</span>
          </div>

          {uniqueInterfaces.slice(0, 10).map((iface: any) => {
            const bw = latestBw.find((b: any) => b.interface_name === iface.interface_name);
            const mbpsIn = bw?.mbps_in || 0;
            const mbpsOut = bw?.mbps_out || 0;
            const maxMbps = 1000;
            const utilPct = Math.min(100, ((mbpsIn + mbpsOut) / maxMbps) * 100);

            return (
              <div key={iface.interface_index} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 90px 90px 60px', gap: '12px', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #13151a' }}>
                <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: '#ccc' }}>{iface.interface_name}</span>
                <div style={{ background: '#13151a', borderRadius: '3px', height: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${utilPct}%`, background: iface.status === 'up' ? '#3b82f6' : '#222', borderRadius: '3px', transition: 'width 1s ease' }} />
                </div>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#666', textAlign: 'right' }}>{mbpsIn.toFixed(1)}</span>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#666', textAlign: 'right' }}>{mbpsOut.toFixed(1)}</span>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: iface.status === 'up' ? 'var(--green)' : '#444', textAlign: 'right' }}>
                  {iface.status?.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </main>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
}