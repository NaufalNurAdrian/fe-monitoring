const API_BASE = 'https://api.quantexnetworks.com';
const WS_URL = 'wss://api.quantexnetworks.com';

export { API_BASE, WS_URL };

export async function fetchSessions(hours = 1) {
  const res = await fetch(`${API_BASE}/api/sessions/history?hours=${hours}`);
  return res.json();
}

export async function fetchLatestSession() {
  const res = await fetch(`${API_BASE}/api/sessions/latest`);
  return res.json();
}

export async function fetchBandwidth(hours = 1) {
  const res = await fetch(`${API_BASE}/api/bandwidth/history?hours=${hours}`);
  return res.json();
}

export async function fetchLatestBandwidth() {
  const res = await fetch(`${API_BASE}/api/bandwidth/latest`);
  return res.json();
}

export async function fetchInterfaces() {
  const res = await fetch(`${API_BASE}/api/interfaces/latest`);
  return res.json();
}

export async function fetchThreats(hours = 24) {
  const res = await fetch(`${API_BASE}/api/threats/history?hours=${hours}`);
  return res.json();
}