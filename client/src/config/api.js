const defaultApiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_BASE = import.meta.env.VITE_API_URL || defaultApiBase;

export const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && token) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    throw new Error(response.status === 401 ? 'Your session expired. Please sign in again.' : data.message || 'Request failed');
  }

  return data;
};
