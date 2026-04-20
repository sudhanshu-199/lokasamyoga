const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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

// ============================================================
// --- Auth API ---
// ============================================================

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

// ============================================================
// --- Campaigns API ---
// ============================================================

export interface CampaignItem {
  id: string;
  title: string;
  ngo: string;
  ngoId?: string;
  date: string;
  location: string;
  volReq: string;
  description: string;
  photo: string;
  status: string;
}

export async function getCampaigns(): Promise<CampaignItem[]> {
  const res = await apiFetch('/campaigns');
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || 'Failed to fetch campaigns');
  return json;
}

export async function getMyCampaigns(): Promise<CampaignItem[]> {
  const res = await apiFetch('/campaigns/my');
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || 'Failed to fetch your campaigns');
  return json;
}

export async function createCampaign(data: {
  title: string;
  date: string;
  location: string;
  volunteersRequired: string;
  description: string;
  photo?: string;
}): Promise<CampaignItem> {
  const res = await apiFetch('/campaigns', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || 'Failed to create campaign');
  return json;
}

export async function deleteCampaign(id: string): Promise<void> {
  const res = await apiFetch(`/campaigns/${id}`, { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || 'Failed to delete campaign');
}

// ============================================================
// --- Applications API ---
// ============================================================

export interface ApplicationItem {
  id: string;
  campaignId: string;
  campaignTitle: string;
  ngo: string;
  volunteerName: string;
  email: string;
  status: string;
}

export async function applyToCampaign(campaignId: string): Promise<ApplicationItem> {
  const res = await apiFetch('/applications', {
    method: 'POST',
    body: JSON.stringify({ campaignId }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || 'Failed to apply');
  return json;
}

export async function getMyApplications(): Promise<ApplicationItem[]> {
  const res = await apiFetch('/applications/my');
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || 'Failed to fetch applications');
  return json;
}

export async function getCampaignApplications(campaignId: string): Promise<ApplicationItem[]> {
  const res = await apiFetch(`/applications/campaign/${campaignId}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || 'Failed to fetch campaign applications');
  return json;
}

export async function updateApplicationStatus(appId: string, status: string): Promise<void> {
  const res = await apiFetch(`/applications/${appId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || 'Failed to update status');
}

export async function getApplicationCount(campaignId: string): Promise<{ total: number; approved: number }> {
  const res = await apiFetch(`/applications/count/${campaignId}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || 'Failed to get count');
  return json;
}

// ============================================================
// --- Donations API ---
// ============================================================

export interface DonationItem {
  id: string;
  ngo: string;
  ngoId?: string;
  campaign: string;
  amount: string;
  paymentMethod?: string;
  status: string;
}

export async function makeDonation(data: {
  ngoId: string;
  amount: string;
  paymentMethod: string;
}): Promise<DonationItem> {
  const res = await apiFetch('/donations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || 'Failed to donate');
  return json;
}

export async function getMyDonations(): Promise<DonationItem[]> {
  const res = await apiFetch('/donations/my');
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || 'Failed to fetch donation history');
  return json;
}

export async function getNGODonations(): Promise<{ donations: DonationItem[]; total: number }> {
  const res = await apiFetch('/donations/ngo');
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || 'Failed to fetch NGO donations');
  return json;
}

export async function getDonationTotals(): Promise<{ total: number; count: number; uniqueNGOs: number }> {
  const res = await apiFetch('/donations/total');
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || 'Failed to fetch totals');
  return json;
}

// ============================================================
// --- Admin API ---
// ============================================================

export interface PendingNGO {
  id: string;
  name: string;
  email: string;
  regId: string;
  date: string;
  focus: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: string;
  joined: string;
  status: string;
  isBanned?: boolean;
}

export interface AdminStats {
  approvedNGOs: number;
  totalUsers: number;
  pendingNGOs: number;
  totalCampaigns: number;
  totalDonationAmount: number;
}

export async function getPendingNGOs(): Promise<PendingNGO[]> {
  const res = await apiFetch('/admin/pending-ngos');
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || 'Failed to fetch pending NGOs');
  return json;
}

export async function approveNGO(id: string): Promise<string> {
  const res = await apiFetch(`/admin/approve-ngo/${id}`, { method: 'PUT' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || 'Failed to approve NGO');
  return json.msg;
}

export async function rejectNGO(id: string): Promise<string> {
  const res = await apiFetch(`/admin/reject-ngo/${id}`, { method: 'PUT' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || 'Failed to reject NGO');
  return json.msg;
}

export async function getAllUsers(): Promise<PlatformUser[]> {
  const res = await apiFetch('/admin/users');
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || 'Failed to fetch users');
  return json;
}

export async function banUser(id: string): Promise<string> {
  const res = await apiFetch(`/admin/ban-user/${id}`, { method: 'PUT' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || 'Failed to ban user');
  return json.msg;
}

export async function getAdminStats(): Promise<AdminStats> {
  const res = await apiFetch('/admin/stats');
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || 'Failed to fetch stats');
  return json;
}

export async function getApprovedNGOs(): Promise<{ id: string; name: string; email: string }[]> {
  const res = await apiFetch('/admin/ngos');
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || 'Failed to fetch NGOs');
  return json;
}
