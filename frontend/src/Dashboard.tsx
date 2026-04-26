import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Heart, ShieldCheck, Building2, TrendingUp, CheckCircle, IndianRupee, X, AlertTriangle, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useAuth } from './AuthContext';
import {
  getCampaigns, getMyCampaigns, createCampaign,
  getMyApplications, getCampaignApplications, updateApplicationStatus, applyToCampaign,
  getMyDonations, getNGODonations, makeDonation, getDonationTotals,
  getPendingNGOs, approveNGO, rejectNGO, getAllUsers, banUser, getAdminStats, getApprovedNGOs,
} from './api';
import type { CampaignItem, ApplicationItem, DonationItem, PendingNGO, PlatformUser, AdminStats } from './api';
import './Dashboard.css';
import './Modal.css';

type Role = 'NGO' | 'Volunteer' | 'Donor' | 'Admin';

// Subcomponents for Toast
const ToastContainer = ({ toasts }: { toasts: any[] }) => (
  <div className="toast-container">
    {toasts.map((t) => (
      <div key={t.id} className={`toast ${t.type}`}>
        {t.type === 'success' ? <CheckCircle size={20} /> : t.type === 'error' ? <AlertTriangle size={20} /> : <Heart size={20} />}
        <span className="toast-message">{t.message}</span>
      </div>
    ))}
  </div>
);

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role: Role = (user?.role as Role) || 'Volunteer';

  const CURRENT_USER = {
    name: user?.name || 'User',
    email: user?.email || 'user@lokasamyoga.com'
  };

  // --- DATA STATES ---
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [myCampaigns, setMyCampaigns] = useState<CampaignItem[]>([]);
  const [myApplications, setMyApplications] = useState<ApplicationItem[]>([]);
  const [campaignApps, setCampaignApps] = useState<ApplicationItem[]>([]);
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [ngoDonationData, setNgoDonationData] = useState<{ donations: DonationItem[]; total: number }>({ donations: [], total: 0 });
  const [donationTotals, setDonationTotals] = useState<{ total: number; count: number; uniqueNGOs: number }>({ total: 0, count: 0, uniqueNGOs: 0 });
  const [pendingNGOs, setPendingNGOs] = useState<PendingNGO[]>([]);
  const [allUsers, setAllUsers] = useState<PlatformUser[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [approvedNGOList, setApprovedNGOList] = useState<{ id: string; name: string; email: string }[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // --- UI STATES ---
  const [toasts, setToasts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [newCampaign, setNewCampaign] = useState({ title: '', date: '', location: '', volunteers: '', description: '', photo: '' });
  const [donationAmount, setDonationAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  // Modal Context states
  const [activeNgo, setActiveNgo] = useState<{ id: string; name: string }>({ id: '', name: '' });
  const [activeCampaign, setActiveCampaign] = useState<CampaignItem | null>(null);

  // --- TOAST HELPER ---
  const showToast = useCallback((message: string, type: string = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  // --- DATA FETCHING ---
  const loadData = useCallback(async () => {
    setDataLoading(true);
    try {
      if (role === 'NGO') {
        const [myCamps, ngoData] = await Promise.all([
          getMyCampaigns(),
          getNGODonations(),
        ]);
        setMyCampaigns(myCamps);
        setNgoDonationData(ngoData);
      } else if (role === 'Volunteer') {
        const [allCamps, myApps] = await Promise.all([
          getCampaigns(),
          getMyApplications(),
        ]);
        setCampaigns(allCamps);
        setMyApplications(myApps);
      } else if (role === 'Donor') {
        const [myDons, totals, ngos] = await Promise.all([
          getMyDonations(),
          getDonationTotals(),
          getApprovedNGOs(),
        ]);
        setDonations(myDons);
        setDonationTotals(totals);
        setApprovedNGOList(ngos);
      } else if (role === 'Admin') {
        const [pending, users, stats] = await Promise.all([
          getPendingNGOs(),
          getAllUsers(),
          getAdminStats(),
        ]);
        setPendingNGOs(pending);
        setAllUsers(users);
        setAdminStats(stats);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load data', 'error');
    } finally {
      setDataLoading(false);
    }
  }, [role, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- MODAL HANDLERS ---
  const openModal = (type: string, data?: any) => {
    setModalType(type);
    if (data?.ngo) setActiveNgo(data.ngo);
    if (data?.campaign) setActiveCampaign(data.campaign);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewCampaign({ title: '', date: '', location: '', volunteers: '', description: '', photo: '' });
    setDonationAmount('');
    setPaymentMethod('');
    setActiveCampaign(null);
    setCampaignApps([]);
  };

  // --- NGO ACTIONS ---
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const created = await createCampaign({
        title: newCampaign.title,
        date: newCampaign.date,
        location: newCampaign.location,
        volunteersRequired: newCampaign.volunteers,
        description: newCampaign.description,
        photo: newCampaign.photo,
      });
      setMyCampaigns(prev => [created, ...prev]);
      closeModal();
      showToast('Campaign successfully created!');
    } catch (err: any) {
      showToast(err.message || 'Failed to create campaign', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleManageCampaign = async (campaign: CampaignItem) => {
    openModal('manage-campaign', { campaign });
    try {
      const apps = await getCampaignApplications(campaign.id);
      setCampaignApps(apps);
    } catch (err: any) {
      showToast(err.message || 'Failed to load applications', 'error');
    }
  };

  const handleUpdateVolunteerStatus = async (appId: string, newStatus: string) => {
    setActionLoading(true);
    try {
      await updateApplicationStatus(appId, newStatus);
      setCampaignApps(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus } : app));
      showToast(`Volunteer application ${newStatus.toLowerCase()}!`, newStatus === 'Rejected' ? 'error' : 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // --- VOLUNTEER ACTIONS ---
  const handleVolunteerApply = async (campaignItem: CampaignItem) => {
    setActionLoading(true);
    try {
      const newApp = await applyToCampaign(campaignItem.id);
      setMyApplications(prev => [newApp, ...prev]);
      showToast(`Successfully applied! Awaiting approval from ${campaignItem.ngo}.`);
      closeModal();
    } catch (err: any) {
      showToast(err.message || 'Failed to apply', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // --- DONOR ACTIONS ---
  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const newDon = await makeDonation({
        ngoId: activeNgo.id,
        amount: donationAmount,
        paymentMethod: paymentMethod,
      });
      setDonations(prev => [newDon, ...prev]);
      closeModal();
      showToast(`Successfully donated ₹${donationAmount} to ${activeNgo.name}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to donate', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // --- ADMIN ACTIONS ---
  const handleApproveNGO = async (id: string, name: string) => {
    setActionLoading(true);
    try {
      await approveNGO(id);
      setPendingNGOs(prev => prev.filter(ngo => ngo.id !== id));
      if (adminStats) setAdminStats({ ...adminStats, pendingNGOs: adminStats.pendingNGOs - 1, approvedNGOs: adminStats.approvedNGOs + 1 });
      showToast(`${name} has been officially approved!`);
    } catch (err: any) {
      showToast(err.message || 'Failed to approve', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectNGO = async (id: string, name: string) => {
    setActionLoading(true);
    try {
      await rejectNGO(id);
      setPendingNGOs(prev => prev.filter(ngo => ngo.id !== id));
      if (adminStats) setAdminStats({ ...adminStats, pendingNGOs: adminStats.pendingNGOs - 1 });
      showToast(`${name} registration rejected.`, 'error');
    } catch (err: any) {
      showToast(err.message || 'Failed to reject', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBanUser = async (userId: string, userName: string) => {
    setActionLoading(true);
    try {
      await banUser(userId);
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Banned', isBanned: true } : u));
      showToast(`User ${userName} has been banned from the platform.`, 'error');
    } catch (err: any) {
      showToast(err.message || 'Failed to ban user', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLoadUsers = async () => {
    openModal('manage-users');
    try {
      const users = await getAllUsers();
      setAllUsers(users);
    } catch (err: any) {
      showToast(err.message || 'Failed to load users', 'error');
    }
  };

  // --- LOADING SPINNER ---
  if (dataLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header className="nav-header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
          <div className="logo-container">
            <img src="/favicon.ico" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)' }} />
            <span className="text-gradient">Lokasamyoga</span>
          </div>
        </header>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem' }}>
          <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-primary)' }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Loading your dashboard...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // --- COMPUTE VIEW DATA ---
  const approvedVolunteerCount = myApplications.filter(a => a.status === 'Approved').length;
  const myDonationTotal = donations.reduce((acc, d) => acc + parseInt(d.amount || '0'), 0);

  // --- VIEWS ---
  const renderDashboard = () => {
    switch (role) {
      case 'NGO': return (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"><Calendar size={24} /></div>
              <div className="stat-info"><div className="stat-value">{myCampaigns.length}</div><div className="stat-label">Total Campaigns</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Users size={24} /></div>
              <div className="stat-info"><div className="stat-value">—</div><div className="stat-label">Approved Volunteers</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><IndianRupee size={24} /></div>
              <div className="stat-info"><div className="stat-value">₹{ngoDonationData.total.toLocaleString()}</div><div className="stat-label">Total Received</div></div>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">My Campaigns & Volunteers</h2>
              <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={() => openModal('create-campaign')}>+ New Campaign</button>
            </div>
            <table className="data-table">
              <thead><tr><th>Campaign Title</th><th>Date</th><th>Location</th><th>Vol. Required</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {myCampaigns.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '1rem' }}>No campaigns found. Create one!</td></tr> : null}
                {myCampaigns.map(c => (
                  <tr key={c.id}>
                    <td>{c.title}</td><td>{c.date}</td><td>{c.location}</td>
                    <td>{c.volReq}</td>
                    <td><span className="badge badge-success">{c.status}</span></td>
                    <td>
                      <button className="action-btn" onClick={() => handleManageCampaign(c)}>
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
      case 'Volunteer': return (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"><TrendingUp size={24} /></div>
              <div className="stat-info"><div className="stat-value">{approvedVolunteerCount * 12}</div><div className="stat-label">Hours Volunteered</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Calendar size={24} /></div>
              <div className="stat-info"><div className="stat-value">{myApplications.length}</div><div className="stat-label">Campaign Applications</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Heart size={24} /></div>
              <div className="stat-info"><div className="stat-value">{approvedVolunteerCount}</div><div className="stat-label">Approved Campaigns</div></div>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">My Applied Campaigns</h2>
              <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={() => openModal('browse-campaigns')}>Browse Campaigns to Apply</button>
            </div>
            <table className="data-table">
              <thead><tr><th>Campaign Title</th><th>NGO Name</th><th>Status</th></tr></thead>
              <tbody>
                {myApplications.length === 0 ? <tr><td colSpan={3} style={{ textAlign: 'center', padding: '1rem' }}>You haven't applied to any campaigns yet. Browse and apply!</td></tr> : null}
                {myApplications.map(app => (
                  <tr key={app.id}>
                    <td>{app.campaignTitle}</td><td>{app.ngo}</td>
                    <td><span className={`badge ${app.status === 'Approved' ? 'badge-success' : app.status === 'Rejected' ? 'badge-warning' : 'badge-info'}`} style={{ color: app.status === 'Rejected' ? 'var(--danger)' : '' }}>{app.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
      case 'Donor': return (
        <>
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-icon"><IndianRupee size={24} /></div><div className="stat-info"><div className="stat-value">₹{myDonationTotal.toLocaleString()}</div><div className="stat-label">Your Total Donated</div></div></div>
            <div className="stat-card"><div className="stat-icon"><Building2 size={24} /></div><div className="stat-info"><div className="stat-value">{donationTotals.uniqueNGOs || approvedNGOList.length}</div><div className="stat-label">NGOs on Platform</div></div></div>
            <div className="stat-card"><div className="stat-icon"><CheckCircle size={24} /></div><div className="stat-info"><div className="stat-value">{donations.length}</div><div className="stat-label">Your Donations</div></div></div>
          </div>
          <div className="dashboard-section">
            <div className="section-header"><h2 className="section-title">Verified NGOs to Support</h2></div>
            <table className="data-table">
              <thead><tr><th>NGO Name</th><th>Email</th><th>Action</th></tr></thead>
              <tbody>
                {approvedNGOList.length === 0 ? <tr><td colSpan={3} style={{ textAlign: 'center', padding: '1rem' }}>No verified NGOs on the platform yet.</td></tr> : null}
                {approvedNGOList.map(ngo => (
                  <tr key={ngo.id}>
                    <td>{ngo.name}</td><td>{ngo.email}</td>
                    <td><button className="action-btn" onClick={() => openModal('donate', { ngo: { id: ngo.id, name: ngo.name } })}>Donate Now</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="dashboard-section">
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Donation History Log</h2>
            <table className="data-table">
              <thead><tr><th>NGO Name</th><th>Type</th><th>Amount Donated</th><th>Status</th></tr></thead>
              <tbody>
                {donations.length === 0 ? <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>No donations yet. Support an NGO today!</td></tr> : null}
                {donations.map(d => (<tr key={d.id}><td>{d.ngo}</td><td>{d.campaign}</td><td>₹{parseInt(d.amount).toLocaleString()}</td><td><span className="badge badge-success">Completed</span></td></tr>))}
              </tbody>
            </table>
          </div>
        </>
      );
      case 'Admin': return (
        <>
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-icon"><Building2 size={24} /></div><div className="stat-info"><div className="stat-value">{adminStats?.approvedNGOs || 0}</div><div className="stat-label">Approved NGOs</div></div></div>
            <div className="stat-card"><div className="stat-icon"><Users size={24} /></div><div className="stat-info"><div className="stat-value">{adminStats?.totalUsers || 0}</div><div className="stat-label">Total Users</div></div></div>
            <div className="stat-card"><div className="stat-icon"><ShieldCheck size={24} /></div><div className="stat-info"><div className="stat-value">{pendingNGOs.length}</div><div className="stat-label">Pending Approvals</div></div></div>
          </div>
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Pending NGO Registrations</h2>
              <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }} onClick={handleLoadUsers}>Manage Users</button>
            </div>
            <table className="data-table">
              <thead><tr><th>Organization Name</th><th>Reg ID</th><th>Date Requested</th><th>Email</th><th>Actions</th></tr></thead>
              <tbody>
                {pendingNGOs.length === 0 ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No pending approvals! You are caught up.</td></tr> : null}
                {pendingNGOs.map(ngo => (
                  <tr key={ngo.id}>
                    <td>{ngo.name}</td><td>{ngo.regId}</td><td>{ngo.date}</td><td>{ngo.email}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="badge badge-success" style={{ border: 'none', cursor: 'pointer', padding: '0.4rem 0.8rem' }} disabled={actionLoading} onClick={() => handleApproveNGO(ngo.id, ngo.name)}>Approve</button>
                        <button className="badge badge-warning" style={{ border: 'none', cursor: 'pointer', padding: '0.4rem 0.8rem', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }} disabled={actionLoading} onClick={() => handleRejectNGO(ngo.id, ngo.name)}>Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="nav-header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="logo-container">
          <img src="/favicon.ico" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)' }} />
          <span className="text-gradient">Lokasamyoga</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ color: 'var(--text-secondary)', marginRight: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', background: 'rgba(124, 58, 237, 0.2)', color: 'var(--accent-primary)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
              Logged in as {role} ({CURRENT_USER.name})
            </span>
          </div>
          <button className="btn-secondary" onClick={() => { logout(); navigate('/'); }}>Log Out</button>
        </div>
      </header>

      <main className="dashboard-container">
        <div className="dashboard-header">
          <div><h1 className="dashboard-title">Welcome back!</h1><p className="dashboard-subtitle">Here is what's happening in your {role} space today.</p></div>
        </div>
        {renderDashboard()}
      </main>

      <ToastContainer toasts={toasts} />

      {/* Global Modals */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: modalType === 'manage-campaign' || modalType === 'browse-campaigns' || modalType === 'manage-users' || modalType === 'campaign-details' ? '800px' : '650px' }}>
            <button className="modal-close" onClick={closeModal}><X size={20} /></button>

            {/* Create Campaign form */}
            {modalType === 'create-campaign' && (
              <>
                <div className="modal-header">
                  <h2 className="modal-title">Create a New Campaign</h2>
                  <p className="modal-subtitle">Launch your next impactful mission.</p>
                </div>
                <form onSubmit={handleCreateCampaign} className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Campaign Title</label>
                    <input type="text" className="form-input" required value={newCampaign.title} onChange={e => setNewCampaign({...newCampaign, title: e.target.value})} placeholder="e.g. Winter Clothes Donation" />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Event Date</label>
                      <input type="date" className="form-input" required value={newCampaign.date} onChange={e => setNewCampaign({...newCampaign, date: e.target.value})} />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Volunteers Required</label>
                      <input type="number" className="form-input" required value={newCampaign.volunteers} onChange={e => setNewCampaign({...newCampaign, volunteers: e.target.value})} placeholder="e.g. 100" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input type="text" className="form-input" required value={newCampaign.location} onChange={e => setNewCampaign({...newCampaign, location: e.target.value})} placeholder="e.g. Delhi NCR" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Detailed Description</label>
                    <textarea className="form-input" rows={3} required value={newCampaign.description} onChange={e => setNewCampaign({...newCampaign, description: e.target.value})} placeholder="Explain what the volunteers will be doing..." style={{ resize: 'none' }}></textarea>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cover Photo URL (Optional)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <ImageIcon size={20} color="var(--text-secondary)" />
                      <input type="url" className="form-input" style={{ border: 'none', background: 'transparent', padding: 0 }} value={newCampaign.photo} onChange={e => setNewCampaign({...newCampaign, photo: e.target.value})} placeholder="https://unsplash.com/your-image.jpg" />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                    <button type="submit" className="btn-primary" disabled={actionLoading}>
                      {actionLoading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating...</> : 'Launch Campaign'}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* View Campaign Details Modal */}
            {modalType === 'campaign-details' && activeCampaign && (
              <>
                {activeCampaign.photo && (
                  <div style={{ width: '100%', height: '240px', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', overflow: 'hidden', margin: '-2.5rem -2.5rem 1.5rem -2.5rem', position: 'relative' }}>
                    <img src={activeCampaign.photo} alt={activeCampaign.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(10,15,28,0.9))', padding: '2.5rem 2.5rem 1rem 2.5rem' }}>
                      <span className="badge badge-success" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Active</span>
                      <h2 className="modal-title" style={{ margin: 0 }}>{activeCampaign.title}</h2>
                    </div>
                  </div>
                )}

                <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0, marginTop: activeCampaign.photo ? 0 : '0' }}>
                  {!activeCampaign.photo && <h2 className="modal-title">{activeCampaign.title}</h2>}
                  <p className="modal-subtitle" style={{ color: 'var(--accent-secondary)', fontWeight: 500 }}>Hosted by {activeCampaign.ngo}</p>
                </div>

                <div className="modal-body" style={{ marginTop: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Date & Time</span>
                      <strong>{activeCampaign.date}</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Location</span>
                      <strong>{activeCampaign.location}</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Volunteers Req.</span>
                      <strong>{activeCampaign.volReq}</strong>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>About this Campaign</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{activeCampaign.description || 'No detailed description provided by the NGO.'}</p>
                </div>

                <div className="modal-footer" style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <button type="button" className="btn-secondary" onClick={() => openModal('browse-campaigns')}>← Back to Browse</button>
                  {myApplications.some(a => a.campaignId === activeCampaign.id) ? (
                    <button className="btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Already Applied</button>
                  ) : (
                    <button className="btn-primary" onClick={() => handleVolunteerApply(activeCampaign)} disabled={actionLoading}>
                      {actionLoading ? 'Applying...' : 'Apply Now'}
                    </button>
                  )}
                </div>
              </>
            )}

            {/* Volunteer Browse Campaigns Modal */}
            {modalType === 'browse-campaigns' && (
              <>
                <div className="modal-header">
                  <h2 className="modal-title">Available Campaigns</h2>
                  <p className="modal-subtitle">Discover active initiatives and read details to participate.</p>
                </div>
                <div className="modal-body">
                  {campaigns.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No active campaigns available right now. Check back later!</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                      {campaigns.map(c => (
                        <div key={c.id} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.2s ease', cursor: 'pointer' }} onClick={() => openModal('campaign-details', { campaign: c })} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                          {c.photo && <img src={c.photo} alt={c.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />}
                          <div style={{ padding: '1.2rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>{c.ngo}</span>
                            <h3 style={{ fontSize: '1.1rem', margin: '0.3rem 0 0.8rem 0' }}>{c.title}</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>📍 {c.location.split(',')[0]}</span>
                              <button className="action-btn" style={{ padding: '0.3rem 0.8rem' }}>View Details</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Donate Modal */}
            {modalType === 'donate' && (
              <>
                <div className="modal-header">
                  <h2 className="modal-title">Donate to {activeNgo.name}</h2>
                  <p className="modal-subtitle">Your financial support changes lives.</p>
                </div>
                <form onSubmit={handleDonate} className="modal-body">
                  <div className="form-group">
                    <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Donation Amount (₹)</label>
                    <input type="number" className="form-input" required value={donationAmount} onChange={e => setDonationAmount(e.target.value)} placeholder="e.g. 5000" min="100" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Secure Payment Method</label>
                    <select className="form-input" style={{ appearance: 'none' }} required value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                      <option value="" disabled>Select a method</option>
                      <option value="upi">UPI / GPay / PhonePe</option>
                      <option value="card">Credit / Debit Card</option>
                      <option value="netbanking">Net Banking</option>
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                    <button type="submit" className="btn-primary" style={{ background: 'var(--success)' }} disabled={actionLoading}>
                      {actionLoading ? 'Processing...' : 'Complete Donation'}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Manage Campaign Modal (NGO) */}
            {modalType === 'manage-campaign' && activeCampaign && (
              <>
                <div className="modal-header">
                  <h2 className="modal-title">Manage: {activeCampaign.title}</h2>
                  <p className="modal-subtitle">Review volunteer applications from the database.</p>
                </div>
                <div className="modal-body">
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Volunteer Applications</h3>
                  <table className="data-table" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }}>
                    <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {campaignApps.length === 0 ? <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>No applications yet.</td></tr> : null}
                      {campaignApps.map(app => (
                        <tr key={app.id}>
                          <td>{app.volunteerName}</td><td>{app.email}</td>
                          <td><span className={`badge ${app.status === 'Approved' ? 'badge-success' : app.status === 'Rejected' ? 'badge-warning' : ''}`} style={{ background: app.status === 'Pending' ? 'rgba(255, 255, 255, 0.1)' : '', color: app.status === 'Rejected' ? 'var(--danger)' : '' }}>{app.status}</span></td>
                          <td>
                            {app.status === 'Pending' ? (
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="badge badge-success" style={{ border: 'none', cursor: 'pointer', padding: '0.3rem 0.6rem' }} disabled={actionLoading} onClick={() => handleUpdateVolunteerStatus(app.id, 'Approved')}>Accept</button>
                                <button className="badge badge-warning" style={{ border: 'none', cursor: 'pointer', padding: '0.3rem 0.6rem', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }} disabled={actionLoading} onClick={() => handleUpdateVolunteerStatus(app.id, 'Rejected')}>Reject</button>
                              </div>
                            ) : (
                              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Reviewed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Manage Users Modal (Admin) */}
            {modalType === 'manage-users' && (
              <>
                <div className="modal-header">
                  <h2 className="modal-title">Manage All Users</h2>
                  <p className="modal-subtitle">View and manage all accounts on the platform.</p>
                </div>
                <div className="modal-body">
                  <table className="data-table" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }}>
                    <thead><tr><th>User / Entity</th><th>Role</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {allUsers.map(u => (
                        <tr key={u.id}>
                          <td>{u.name}</td><td>{u.role}</td><td>{u.joined}</td>
                          <td><span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-warning'}`} style={{ color: u.status === 'Banned' ? 'var(--danger)' : '' }}>{u.status}</span></td>
                          <td>
                            {u.status !== 'Banned' && u.role !== 'Admin' ? (
                               <button className="action-btn" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} disabled={actionLoading} onClick={() => handleBanUser(u.id, u.name)}>Ban Account</button>
                            ) : u.role === 'Admin' ? (
                               <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Admin</span>
                            ) : (
                               <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Restricted</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
