import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, Heart, ShieldCheck, Building2, TrendingUp, CheckCircle, IndianRupee, X, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { useAuth } from './AuthContext';
import './Dashboard.css';
import './Modal.css';

type Role = 'NGO' | 'Volunteer' | 'Donor' | 'Admin';

// Subcomponents for Modal and Toast
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

// --- SEED DATABASE ---
const defaultDB = {
  campaigns: [
    { 
      id: 1, 
      title: 'Beach Cleanup Drive', 
      ngo: 'Ocean Keepers', 
      date: 'Oct 15, 2026', 
      location: 'Marine Drive, Mumbai', 
      volReq: '50', 
      status: 'Active',
      description: 'Join us in our massive weekend effort to clear plastics from the beachfront. We aim to remove over 500kg of waste. Gloves, bags, and refreshments will be provided by our sponsors.',
      photo: 'https://images.unsplash.com/photo-1618477461853-cf6ed80fabe5?auto=format&fit=crop&q=80&w=1000'
    },
    { 
      id: 2, 
      title: 'Food Distribution Camp', 
      ngo: 'Anna Seva Trust', 
      date: 'Oct 18, 2026', 
      location: 'Dharavi Community Hall', 
      volReq: '150', 
      status: 'Active',
      description: 'Help us pack and distribute over 2000 nutritious meals to daily wage workers and homeless individuals. Volunteers are needed for packaging, logistics, and direct distribution.',
      photo: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1000'
    },
    { 
      id: 3, 
      title: 'Tech Literacy Camp', 
      ngo: 'EduRight Tech', 
      date: 'Nov 12, 2026', 
      location: 'Bangalore Community Center', 
      volReq: '20', 
      status: 'Active',
      description: 'Empowering underprivileged youth by teaching basic computer skills, internet browsing, and digital safety. We need volunteers fluent in local languages to assist the main instructors.',
      photo: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1000'
    }
  ],
  applications: [
    { id: 101, campaignId: 1, campaignTitle: 'Beach Cleanup Drive', ngo: 'Ocean Keepers', volunteerName: 'Rahul Sharma', email: 'rahul@example.com', status: 'Pending' },
    { id: 102, campaignId: 1, campaignTitle: 'Beach Cleanup Drive', ngo: 'Ocean Keepers', volunteerName: 'Priya Singh', email: 'priya@example.com', status: 'Approved' }
  ],
  donations: [
    { id: 1, ngo: 'Ocean Keepers', campaign: 'Beach Cleanup Drive', amount: '2000' },
    { id: 2, ngo: 'Anna Seva Trust', campaign: 'Hunger Relief 2026', amount: '5500' },
  ],
  pendingNGOs: [
    { id: 1, name: 'Green Earth India', regId: 'NGO-REG-9012', date: 'Oct 10, 2026', focus: 'Environment' },
    { id: 2, name: 'Youth Empowerment Org', regId: 'NGO-REG-9044', date: 'Oct 11, 2026', focus: 'Education' }
  ],
  allUsers: [
    { id: 1, name: 'Rahul Sharma', role: 'Volunteer', joined: 'Oct 01, 2026', status: 'Active' },
    { id: 2, name: 'Ocean Keepers', role: 'NGO', joined: 'Sep 15, 2026', status: 'Active' },
    { id: 3, name: 'Fake NGO Scam', role: 'NGO', joined: 'Oct 12, 2026', status: 'Banned' }
  ]
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role: Role = (user?.role as Role) || 'Volunteer';
  
  const CURRENT_USER = {
    name: user?.name || 'User',
    email: user?.email || 'user@lokasamyoga.com'
  };

  // --- LOCAL STORAGE DATABASE ---
  const [db, setDb] = useState(() => {
    const saved = localStorage.getItem('lokasamyoga_db');
    if (saved) {
      return JSON.parse(saved);
    }
    return defaultDB;
  });

  useEffect(() => {
    localStorage.setItem('lokasamyoga_db', JSON.stringify(db));
  }, [db]);

  // --- UI STATES ---
  const [toasts, setToasts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); 

  // Form states
  const [newCampaign, setNewCampaign] = useState({ title: '', date: '', location: '', volunteers: '', description: '', photo: '' });
  const [donationAmount, setDonationAmount] = useState('');
  
  // Modal Context states
  const [activeNgo, setActiveNgo] = useState('');
  const [activeCampaign, setActiveCampaign] = useState<any>(null);

  // --- ACTIONS & HANDLERS ---
  const showToast = (message: string, type: string = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

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
    setActiveCampaign(null);
  };

  // NGO Actions
  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const campaignList = [...db.campaigns, { 
      id: Date.now(), 
      title: newCampaign.title, 
      ngo: CURRENT_USER.name, 
      date: newCampaign.date, 
      location: newCampaign.location, 
      volReq: newCampaign.volunteers, 
      description: newCampaign.description,
      photo: newCampaign.photo || 'https://images.unsplash.com/photo-1593113563332-e14b5113d085?auto=format&fit=crop&q=80&w=1000', // Mock fallback
      status: 'Active' 
    }];
    setDb({ ...db, campaigns: campaignList });
    closeModal();
    showToast('Campaign successfully created and saved to local DB!');
  };

  const handleUpdateVolunteerStatus = (appId: number, newStatus: string) => {
    setDb({
      ...db,
      applications: db.applications.map(app => app.id === appId ? { ...app, status: newStatus } : app)
    });
    showToast(`Volunteer application ${newStatus.toLowerCase()}!`, newStatus === 'Rejected' ? 'error' : 'success');
  };

  // Volunteer Actions
  const handleVolunteerApply = (campaignItem: any) => {
    // Check if already applied
    if (db.applications.some(app => app.campaignId === campaignItem.id && app.volunteerName === CURRENT_USER.name)) {
      showToast('You have already applied to this campaign!', 'error');
      return;
    }
    
    const newApp = {
      id: Date.now(),
      campaignId: campaignItem.id,
      campaignTitle: campaignItem.title,
      ngo: campaignItem.ngo,
      volunteerName: CURRENT_USER.name,
      email: CURRENT_USER.email,
      status: 'Pending'
    };
    
    setDb({ ...db, applications: [...db.applications, newApp] });
    showToast(`Successfully applied! Awaiting approval from ${campaignItem.ngo}.`);
    closeModal();
  };

  // Donor Actions
  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    setDb({
      ...db,
      donations: [...db.donations, { id: Date.now(), ngo: activeNgo, campaign: 'Direct Donation', amount: donationAmount }]
    });
    closeModal();
    showToast(`Successfully donated ₹${donationAmount} to ${activeNgo}!`, 'success');
  };

  // Admin Actions
  const handleApproveNGO = (id: number, name: string) => {
    setDb({ ...db, pendingNGOs: db.pendingNGOs.filter(ngo => ngo.id !== id) });
    showToast(`${name} has been officially approved! Saved to DB.`);
  };

  const handleRejectNGO = (id: number, name: string) => {
    setDb({ ...db, pendingNGOs: db.pendingNGOs.filter(ngo => ngo.id !== id) });
    showToast(`${name} registration rejected.`, 'error');
  };

  const handleBanUser = (userId: number, userName: string) => {
    setDb({
      ...db,
      allUsers: db.allUsers.map(u => u.id === userId ? { ...u, status: 'Banned' } : u)
    });
    showToast(`User ${userName} has been banned from the platform.`, 'error');
  };

  // --- COMPUTE VIEW DATA ---
  const volunteerMyApps = db.applications.filter(app => app.volunteerName === CURRENT_USER.name);
  const myNGOCampaigns = db.campaigns.filter(c => c.ngo === CURRENT_USER.name);
  
  const getVolCount = (campaignId: number, getApprovedOnly = false) => {
    const apps = db.applications.filter(a => a.campaignId === campaignId);
    if (getApprovedOnly) return apps.filter(a => a.status === 'Approved').length;
    return apps.length;
  };

  const totalNGODonations = db.donations.filter(d => d.ngo === CURRENT_USER.name).reduce((acc, obj) => acc + parseInt(obj.amount), 0);

  // --- VIEWS ---
  const renderDashboard = () => {
    switch (role) {
      case 'NGO': return (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"><Calendar size={24} /></div>
              <div className="stat-info"><div className="stat-value">{myNGOCampaigns.length}</div><div className="stat-label">Total Campaigns</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Users size={24} /></div>
              <div className="stat-info"><div className="stat-value">{db.applications.filter(a => a.ngo === CURRENT_USER.name && a.status === 'Approved').length}</div><div className="stat-label">Approved Volunteers</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><IndianRupee size={24} /></div>
              <div className="stat-info"><div className="stat-value">₹{totalNGODonations.toLocaleString()}</div><div className="stat-label">Total Received</div></div>
            </div>
          </div>
          
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">My Campaigns & Volunteers</h2>
              <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={() => openModal('create-campaign')}>+ New Campaign</button>
            </div>
            <table className="data-table">
              <thead><tr><th>Campaign Title</th><th>Date</th><th>Location</th><th>Volunteers (Approved/Req)</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {myNGOCampaigns.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '1rem' }}>No campaigns found. Create one!</td></tr> : null}
                {myNGOCampaigns.map(c => (
                  <tr key={c.id}>
                    <td>{c.title}</td><td>{c.date}</td><td>{c.location}</td>
                    <td>{getVolCount(c.id, true)} / {c.volReq}</td>
                    <td><span className="badge badge-success">{c.status}</span></td>
                    <td>
                      <button className="action-btn" style={{ position: 'relative' }} onClick={() => openModal('manage-campaign', { campaign: c })}>
                        Manage
                        {db.applications.some(a => a.campaignId === c.id && a.status === 'Pending') && (
                          <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--danger)', color: 'white', fontSize: '10px', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {db.applications.filter(a => a.campaignId === c.id && a.status === 'Pending').length}
                          </span>
                        )}
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
              <div className="stat-info"><div className="stat-value">48</div><div className="stat-label">Hours Volunteered</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Calendar size={24} /></div>
              <div className="stat-info"><div className="stat-value">{volunteerMyApps.length}</div><div className="stat-label">Campaign Applications</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Heart size={24} /></div>
              <div className="stat-info"><div className="stat-value">{volunteerMyApps.filter(a => a.status === 'Approved').length}</div><div className="stat-label">Approved Campaigns</div></div>
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
                {volunteerMyApps.length === 0 ? <tr><td colSpan={3} style={{ textAlign: 'center', padding: '1rem' }}>You haven't applied to any campaigns yet. Browse and apply!</td></tr> : null}
                {volunteerMyApps.map(app => (
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
          {/* Unchanged Donor View */}
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-icon"><IndianRupee size={24} /></div><div className="stat-info"><div className="stat-value">₹{db.donations.reduce((acc, obj) => acc + parseInt(obj.amount), 0).toLocaleString()}</div><div className="stat-label">Total Donated Globally</div></div></div>
            <div className="stat-card"><div className="stat-icon"><Building2 size={24} /></div><div className="stat-info"><div className="stat-value">{db.donations.length + 6}</div><div className="stat-label">NGOs Supported</div></div></div>
            <div className="stat-card"><div className="stat-icon"><CheckCircle size={24} /></div><div className="stat-info"><div className="stat-value">High</div><div className="stat-label">Impact Level</div></div></div>
          </div>
          <div className="dashboard-section">
            <div className="section-header"><h2 className="section-title">Verified NGOs to Support</h2></div>
            <table className="data-table">
              <thead><tr><th>NGO Name</th><th>Focus Area</th><th>Action</th></tr></thead>
              <tbody>
                <tr><td>Ocean Keepers</td><td>Environment</td><td><button className="action-btn" onClick={() => openModal('donate', { ngo: 'Ocean Keepers' })}>Donate Now</button></td></tr>
                <tr><td>Anna Seva Trust</td><td>Hunger Relief</td><td><button className="action-btn" onClick={() => openModal('donate', { ngo: 'Anna Seva Trust' })}>Donate Now</button></td></tr>
                <tr><td>EduRight Tech</td><td>Education</td><td><button className="action-btn" onClick={() => openModal('donate', { ngo: 'EduRight Tech' })}>Donate Now</button></td></tr>
              </tbody>
            </table>
          </div>
          <div className="dashboard-section">
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Donation History Log</h2>
            <table className="data-table">
              <thead><tr><th>NGO Name</th><th>Campaign</th><th>Amount Donated</th><th>Status</th></tr></thead>
              <tbody>
                {db.donations.map(d => (<tr key={d.id}><td>{d.ngo}</td><td>{d.campaign}</td><td>₹{parseInt(d.amount).toLocaleString()}</td><td><span className="badge badge-success">Completed</span></td></tr>))}
              </tbody>
            </table>
          </div>
        </>
      );
      case 'Admin': return (
        <>
          {/* Unchanged Admin View */}
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-icon"><Building2 size={24} /></div><div className="stat-info"><div className="stat-value">156</div><div className="stat-label">Approved NGOs</div></div></div>
            <div className="stat-card"><div className="stat-icon"><Users size={24} /></div><div className="stat-info"><div className="stat-value">4k+</div><div className="stat-label">Total Users</div></div></div>
            <div className="stat-card"><div className="stat-icon"><ShieldCheck size={24} /></div><div className="stat-info"><div className="stat-value">{db.pendingNGOs.length}</div><div className="stat-label">Pending Approvals</div></div></div>
          </div>
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Pending NGO Registrations</h2>
              <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }} onClick={() => openModal('manage-users')}>Manage Users</button>
            </div>
            <table className="data-table">
              <thead><tr><th>Organization Name</th><th>Reg ID</th><th>Date Requested</th><th>Focus Area</th><th>Actions</th></tr></thead>
              <tbody>
                {db.pendingNGOs.length === 0 ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No pending approvals! You are caught up.</td></tr> : null}
                {db.pendingNGOs.map(ngo => (
                  <tr key={ngo.id}>
                    <td>{ngo.name}</td><td>{ngo.regId}</td><td>{ngo.date}</td><td>{ngo.focus}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="badge badge-success" style={{ border: 'none', cursor: 'pointer', padding: '0.4rem 0.8rem' }} onClick={() => handleApproveNGO(ngo.id, ngo.name)}>Approve</button>
                        <button className="badge badge-warning" style={{ border: 'none', cursor: 'pointer', padding: '0.4rem 0.8rem', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }} onClick={() => handleRejectNGO(ngo.id, ngo.name)}>Reject</button>
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
          <div className="logo-icon">🌿</div>
          <span className="text-gradient">Lokasamyoga</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ color: 'var(--text-secondary)', marginRight: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', background: 'rgba(124, 58, 237, 0.2)', color: 'var(--accent-primary)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
              Logged in as {role} ({CURRENT_USER.name})
            </span>
          </div>
          <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => { localStorage.removeItem('lokasamyoga_db'); window.location.reload(); }}>Reset DB</button>
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
                    <button type="submit" className="btn-primary">Launch Campaign</button>
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
                  {db.applications.some(a => a.campaignId === activeCampaign.id && a.volunteerName === CURRENT_USER.name) ? (
                    <button className="btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Already Applied</button>
                  ) : (
                    <button className="btn-primary" onClick={() => handleVolunteerApply(activeCampaign)}>Apply Now</button>
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
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {db.campaigns.map(c => (
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
                </div>
              </>
            )}

            {/* Donate Modal */}
            {modalType === 'donate' && (
              <>
                <div className="modal-header">
                  <h2 className="modal-title">Donate to {activeNgo}</h2>
                  <p className="modal-subtitle">Your financial support changes lives.</p>
                </div>
                <form onSubmit={handleDonate} className="modal-body">
                  <div className="form-group">
                    <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Donation Amount (₹)</label>
                    <input type="number" className="form-input" required value={donationAmount} onChange={e => setDonationAmount(e.target.value)} placeholder="e.g. 5000" min="100" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Secure Payment Method</label>
                    <select className="form-input" style={{ appearance: 'none' }} required>
                      <option value="" disabled selected>Select a method</option>
                      <option value="upi">UPI / GPay / PhonePe</option>
                      <option value="card">Credit / Debit Card</option>
                      <option value="netbanking">Net Banking</option>
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                    <button type="submit" className="btn-primary" style={{ background: 'var(--success)' }}>Complete Donation</button>
                  </div>
                </form>
              </>
            )}

            {/* Manage Campaign Modal (NGO) */}
            {modalType === 'manage-campaign' && activeCampaign && (
              <>
                <div className="modal-header">
                  <h2 className="modal-title">Manage: {activeCampaign.title}</h2>
                  <p className="modal-subtitle">Review volunteer applications securely loaded from LocalStorage.</p>
                </div>
                <div className="modal-body">
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Volunteer Applications</h3>
                  <table className="data-table" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }}>
                    <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {db.applications.filter(app => app.campaignId === activeCampaign.id).length === 0 ? <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>No applications yet.</td></tr> : null}
                      {db.applications.filter(app => app.campaignId === activeCampaign.id).map(app => (
                        <tr key={app.id}>
                          <td>{app.volunteerName}</td><td>{app.email}</td>
                          <td><span className={`badge ${app.status === 'Approved' ? 'badge-success' : app.status === 'Rejected' ? 'badge-warning' : ''}`} style={{ background: app.status === 'Pending' ? 'rgba(255, 255, 255, 0.1)' : '', color: app.status === 'Rejected' ? 'var(--danger)' : '' }}>{app.status}</span></td>
                          <td>
                            {app.status === 'Pending' ? (
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="badge badge-success" style={{ border: 'none', cursor: 'pointer', padding: '0.3rem 0.6rem' }} onClick={() => handleUpdateVolunteerStatus(app.id, 'Approved')}>Accept</button>
                                <button className="badge badge-warning" style={{ border: 'none', cursor: 'pointer', padding: '0.3rem 0.6rem', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }} onClick={() => handleUpdateVolunteerStatus(app.id, 'Rejected')}>Reject</button>
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
                  <p className="modal-subtitle">Dynamically remove accounts from the database.</p>
                </div>
                <div className="modal-body">
                  <table className="data-table" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }}>
                    <thead><tr><th>User / Entity</th><th>Role</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {db.allUsers.map(u => (
                        <tr key={u.id}>
                          <td>{u.name}</td><td>{u.role}</td><td>{u.joined}</td>
                          <td><span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-warning'}`} style={{ color: u.status === 'Banned' ? 'var(--danger)' : '' }}>{u.status}</span></td>
                          <td>
                            {u.status !== 'Banned' ? (
                               <button className="action-btn" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => handleBanUser(u.id, u.name)}>Ban Account</button>
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
    </div>
  );
}
