'use client';
import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface BandwidthChartProps {
  data: { timestamp: string; mbps_in: number; mbps_out: number; interface_name: string }[];
  interfaceName?: string;
}

export default function BandwidthChart({ data, interfaceName = 'ethernet1/1' }: BandwidthChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const filtered = data.filter(d => d.interface_name === interfaceName).slice(-20);
    const labels = filtered.map(d => new Date(d.timestamp).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }));
    const inData = filtered.map(d => parseFloat(d.mbps_in.toFixed(2)));
    const outData = filtered.map(d => parseFloat(d.mbps_out.toFixed(2)));

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'In (Mbps)',
            data: inData,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.05)',
            borderWidth: 1.5,
            pointRadius: 0,
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Out (Mbps)',
            data: outData,
            borderColor: '#ff4d1c',
            backgroundColor: 'rgba(255,77,28,0.05)',
            borderWidth: 1.5,
            pointRadius: 0,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#444', font: { size: 10, family: 'DM Mono' } }, grid: { color: '#13151a' } },
          y: { ticks: { color: '#444', font: { size: 10, family: 'DM Mono' }, callback: (v: number | string) => v + 'M' }, grid: { color: '#13151a' } },
        },
      },
    });

    return () => { chartRef.current?.destroy(); };
  }, [data, interfaceName]);

  return (
    <div>
      <canvas ref={canvasRef} role="img" aria-label={`Bandwidth chart for ${interfaceName}`} />
    </div>
  );
}