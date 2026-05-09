'use client';
import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface SessionChartProps {
  data: { timestamp: string; active_sessions: number }[];
}

export default function SessionChart({ data }: SessionChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const sliced = data.slice(-20);
    const labels = sliced.map(d => new Date(d.timestamp).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }));
    const values = sliced.map(d => d.active_sessions);

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Sessions',
          data: values,
          borderColor: '#ff4d1c',
          backgroundColor: 'rgba(255,77,28,0.05)',
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.4,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#444', font: { size: 10, family: 'DM Mono' } }, grid: { color: '#13151a' } },
          y: { ticks: { color: '#444', font: { size: 10, family: 'DM Mono' } }, grid: { color: '#13151a' } },
        },
      },
    });

    return () => { chartRef.current?.destroy(); };
  }, [data]);

  return (
    <canvas ref={canvasRef} role="img" aria-label="Session trend chart" />
  );
}