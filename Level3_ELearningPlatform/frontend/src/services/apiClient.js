// Central API configuration.
//
// USE_MOCK_DATA = true  -> all services read from local mock data (src/data/*)
// USE_MOCK_DATA = false -> all services call the real Express/MongoDB backend
//
// Flip this one flag once your backend is running and every service
// function below will start hitting real endpoints instead — no component
// code needs to change, because pages only ever import from /services.

export const USE_MOCK_DATA = true;

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MOCK_LATENCY_MS = 350;

// Simulates real network latency so loading states are visible and testable
// even while wired up to mock data.
export const mockDelay = (data) =>
  new Promise((resolve) => setTimeout(() => resolve(data), MOCK_LATENCY_MS));

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('ledger_token');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}
