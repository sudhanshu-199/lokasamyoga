const BASE_URL = 'http://localhost:5001/api';

/**
 * Wrapper around fetch that automatically attaches the JWT token
 * from localStorage to the request headers.
 */
async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('lokasamyoga_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['x-auth-token'] = token;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return res;
}

// --- Auth API ---

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'NGO' | 'Volunteer' | 'Donor' | 'Admin';
  isApproved: boolean;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface ApiError {
  msg: string;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
  regId?: string;
}): Promise<AuthResponse> {
  const res = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.msg || 'Registration failed');
  }

  return json as AuthResponse;
}

export async function loginUser(data: {
  email: string;
  password: string;
  requestedRole: string;
}): Promise<AuthResponse> {
  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.msg || 'Login failed');
  }

  return json as AuthResponse;
}

export async function getMe(): Promise<AuthUser> {
  const res = await apiFetch('/auth/me', {
    method: 'GET',
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.msg || 'Failed to fetch user');
  }

  return json as AuthUser;
}
