interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: 'default' | 'green' | 'amber' | 'accent';
}

const colorMap = {
  default: 'var(--text)',
  green: 'var(--green)',
  amber: 'var(--amber)',
  accent: 'var(--accent)',
};

export default function MetricCard({ label, value, sub, color = 'default' }: MetricCardProps) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '18px 20px',
    }}>
      <div style={{
        fontSize: '11px', color: 'var(--text-muted)',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        marginBottom: '10px', fontFamily: 'var(--font-mono)',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '26px', fontWeight: 600,
        fontFamily: 'var(--font-mono)',
        color: colorMap[color],
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: '11px', color: '#444', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
          {sub}
        </div>
      )}
    </div>
  );
}