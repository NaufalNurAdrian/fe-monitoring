'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Overview', icon: '⬡' },
  { href: '/interfaces', label: 'Interfaces', icon: '⬡' },
  { href: '/sessions', label: 'Sessions', icon: '⬡' },
  { href: '/threats', label: 'Threats', icon: '⬡' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      width: '200px',
      minHeight: '100vh',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', marginBottom: '20px' }}>
        <div style={{
          width: '28px', height: '28px', background: 'var(--accent)',
          borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>
        <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em' }}>NETWATCH</span>
      </div>

      {/* Nav */}
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 12px', borderRadius: '8px',
              fontSize: '13px',
              color: active ? 'var(--text)' : 'var(--text-muted)',
              background: active ? 'var(--bg-hover)' : 'transparent',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: active ? 'var(--accent)' : '#333',
                flexShrink: 0,
              }} />
              {item.label}
            </div>
          </Link>
        );
      })}

      {/* Footer */}
      <div style={{ marginTop: 'auto', padding: '12px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '11px', color: '#333', fontFamily: 'var(--font-mono)' }}>Palo Alto</div>
        <div style={{ fontSize: '11px', color: '#444', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
          10.100.27.230
        </div>
      </div>
    </aside>
  );
}