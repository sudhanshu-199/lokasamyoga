import { Link } from 'react-router-dom';
import './App.css';

function Home() {
  const roles = [
    {
      title: "NGO",
      icon: "🏢",
      desc: "Create social campaigns, manage volunteers, and track donations to maximize your impact.",
      delay: "0.1s"
    },
    {
      title: "Volunteer",
      icon: "🤝",
      desc: "Discover local NGO campaigns, apply for volunteering opportunities, and make a difference.",
      delay: "0.2s"
    },
    {
      title: "Donor",
      icon: "💰",
      desc: "Find verified NGOs, support their active campaigns, and track your donation history securely.",
      delay: "0.3s"
    },
    {
      title: "Admin",
      icon: "🛠️",
      desc: "Approve NGOs, manage all users, and ensure platform integrity and activity.",
      delay: "0.4s"
    }
  ];

  const upcomingCampaigns = [
    {
      title: "Beach Cleanup Drive",
      ngo: "Ocean Keepers",
      date: "Oct 15, 2026 • 08:00 AM",
      location: "Marine Drive, Mumbai",
      desc: "Join us in our massive weekend effort to clear plastics from the beachfront. Gloves and bags provided.",
      status: "Upcoming",
      icon: "🌊"
    },
    {
      title: "Food Distribution Camp",
      ngo: "Anna Seva Trust",
      date: "Oct 18, 2026 • 12:00 PM",
      location: "Dharavi Community Hall",
      desc: "Help us pack and distribute over 2000 meals to daily wage workers and homeless individuals.",
      status: "Upcoming",
      icon: "🍱"
    },
    {
      title: "Tree Plantation",
      ngo: "Green Earth India",
      date: "Oct 20, 2026 • 09:30 AM",
      location: "Sanjay Gandhi National Park",
      desc: "We are planting 500 indigenous tree saplings. Bring your energy and help restore the green belt.",
      status: "Upcoming",
      icon: "🌳"
    }
  ];

  return (
    <>
      <header className="nav-header">
        <div className="logo-container">
          <img src="/favicon.ico" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)' }} />
          <span className="text-gradient">Lokasamyoga</span>
        </div>
        <nav className="nav-links">
          <a href="#" className="nav-link">Home</a>
          <a href="#campaigns" className="nav-link">Campaigns</a>
          <a href="#ngos" className="nav-link">NGOs</a>
          <a href="#about" className="nav-link">About</a>
        </nav>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/login" className="btn-secondary">Log In</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <h1 className="hero-title">
            Connecting Hearts,<br />
            <span className="text-gradient">Changing Lives</span>
          </h1>
          <p className="hero-subtitle">
            A centralized digital platform uniting NGOs, volunteers, and donors. Together, we can simplify campaign management and maximize social impact.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/register" className="btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>Explore Campaigns</Link>
            <Link to="/register" className="btn-secondary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>Register NGO</Link>
          </div>
        </section>

        <section className="roles-section">
          <h2 className="section-title">Who are you?</h2>
          <div className="roles-grid">
            {roles.map((role, idx) => (
              <div 
                key={idx} 
                className="role-card glass-panel"
                style={{ animation: `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${role.delay} forwards`, opacity: 0 }}
              >
                <div className="role-icon">{role.icon}</div>
                <h3 className="role-title">{role.title}</h3>
                <p className="role-desc">{role.desc}</p>
                <Link to="/login" className="btn-secondary" style={{ width: '100%', display: 'inline-block', boxSizing: 'border-box' }}>Portal</Link>
              </div>
            ))}
          </div>
        </section>

        <section id="campaigns" className="events-section" style={{ marginTop: '5rem' }}>
          <h2 className="section-title">Discover Campaigns</h2>
          <div className="events-carousel">
            {upcomingCampaigns.map((campaign, idx) => (
              <div key={idx} className="event-card glass-panel">
                <div className="event-image">
                  <span style={{ fontSize: '4rem' }}>{campaign.icon}</span>
                  <div className="event-badge">{campaign.status}</div>
                </div>
                <div className="event-content">
                  <h3 className="event-title">{campaign.title}</h3>
                  <div className="event-meta">
                    <span className="meta-item">🕒 {campaign.date}</span>
                    <span className="meta-item">📍 {campaign.location}</span>
                  </div>
                  <p className="event-desc">{campaign.desc}</p>
                  <div className="event-footer">
                    <span className="ngo-name">By {campaign.ngo}</span>
                    <Link to="/register" className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Apply</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* -- NGO SECTION -- */}
        <section id="ngos" className="events-section" style={{ marginTop: '6rem', textAlign: 'center' }}>
          <h2 className="section-title">Our Verified Partner NGOs</h2>
          <p className="hero-subtitle" style={{ marginBottom: '3rem' }}>We ensure every organization on our platform is strictly vetted for maximum impact and transparency.</p>
          <div className="roles-grid">
            <div className="role-card glass-panel" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌊</div>
              <h3 className="role-title">Ocean Keepers</h3>
              <p className="role-desc" style={{ fontSize: '0.9rem' }}>Dedicated to marine conservation and mass beach cleanups across coastal India.</p>
            </div>
            <div className="role-card glass-panel" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍲</div>
              <h3 className="role-title">Anna Seva Trust</h3>
              <p className="role-desc" style={{ fontSize: '0.9rem' }}>Eradicating hunger by mass distributing thousands of nutritious meals weekly.</p>
            </div>
            <div className="role-card glass-panel" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💻</div>
              <h3 className="role-title">EduRight Tech</h3>
              <p className="role-desc" style={{ fontSize: '0.9rem' }}>Providing tech-literacy and coding education to underprivileged children.</p>
            </div>
          </div>
        </section>

        {/* -- ABOUT SECTION -- */}
        <section id="about" className="events-section" style={{ padding: '4rem 2rem', marginTop: '6rem', marginBottom: '4rem', background: 'linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(124, 58, 237, 0.05) 100%)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>About Lokasamyoga</h2>
          <p className="hero-subtitle" style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8', fontSize: '1.1rem' }}>
            <strong>Lokasamyoga</strong> translates to "connecting the world" and that is exactly our mission. <br/><br/>
            We engineered an integrated digital ecosystem dedicated to connecting socially conscious individuals with rigorously verified Non-Governmental Organizations. Often, people want to help but don't know exactly where to go or who to trust. <br/><br/>
            By dynamically acting as the bridge, we simplify volunteer mass-recruitment, streamline the administration of complex social campaigns, and provide an utterly safe funnel for modern donations—ensuring every drop of effort creates a massive ripple of real-world social impact.
          </p>
        </section>

      </main>
    </>
  );
}

export default Home;
