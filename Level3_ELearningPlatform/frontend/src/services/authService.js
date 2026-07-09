import { USE_MOCK_DATA, mockDelay, apiRequest } from './apiClient';
import { currentUser as mockUser } from '../data/users';

export async function login(email, password) {
  if (USE_MOCK_DATA) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
    localStorage.setItem('ledger_token', 'mock-jwt-token');
    return mockDelay({ user: mockUser, token: 'mock-jwt-token' });
  }

  const result = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('ledger_token', result.token);
  return result;
}

export async function signup(name, email, password) {
  if (USE_MOCK_DATA) {
    localStorage.setItem('ledger_token', 'mock-jwt-token');
    return mockDelay({ user: { ...mockUser, name, email }, token: 'mock-jwt-token' });
  }

  const result = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  localStorage.setItem('ledger_token', result.token);
  return result;
}

export function logout() {
  localStorage.removeItem('ledger_token');
}

export async function fetchCurrentUser() {
  if (USE_MOCK_DATA) return mockDelay(mockUser);
  return apiRequest('/auth/me');
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('ledger_token'));
}
