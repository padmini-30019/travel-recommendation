import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plane, LogOut, User as UserIcon, Moon, Sun, Map, Compass, Search, Home } from 'lucide-react';

function Navbar({ authUser, setAuthUser, theme, toggleTheme }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => setAuthUser(null);

  const NavLink = ({ to, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} style={{ 
        textDecoration: 'none', 
        color: isActive ? 'var(--primary)' : 'var(--text-primary)',
        fontWeight: isActive ? '600' : '500',
        position: 'relative',
        transition: 'color 0.3s ease'
      }} className={`nav-link ${isActive ? 'active' : ''}`}>
        {label}
      </Link>
    );
  };

  const MobileNavLink = ({ to, icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}>
         {icon}
         <span style={{ fontSize: '0.75rem', marginTop: '4px', fontWeight: isActive ? 600 : 400 }}>{label}</span>
      </Link>
    );
  };

  return (
    <>
      <nav className="navbar" style={{
        position: 'fixed', top: 0, width: '100%', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '1.2rem 5%', zIndex: 1000,
        background: scrolled ? 'var(--glass-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
        transition: 'all 0.4s ease'
      }}>
        <Link to="/" className="logo" style={{ textDecoration: 'none', fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)', display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <Plane size={28} color="var(--primary)" />
          <span>Aero<span style={{color: 'var(--primary)'}}>Quest</span></span>
        </Link>
        
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="desktop-links">
          <NavLink to="/" label="Home" />
          <NavLink to="/explore" label="Explore" />
          <NavLink to="/plan" label="Plan Trip" />
          {authUser && <NavLink to="/dashboard" label="My Trips" />}
        </div>

        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
          <Search size={20} color="var(--text-primary)" style={{ cursor: 'pointer' }} className="desktop-links" />
          <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="desktop-links">
            {authUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                  <UserIcon size={20} />
                  <span style={{ fontWeight: 600 }}>{authUser.name}</span>
                </div>
                <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600 }}>Log In</Link>
                <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-nav">
         <MobileNavLink to="/" icon={<Home size={22}/>} label="Home" />
         <MobileNavLink to="/explore" icon={<Compass size={22}/>} label="Explore" />
         <MobileNavLink to="/plan" icon={<Map size={22}/>} label="Plan" />
         <MobileNavLink to={authUser ? "/dashboard" : "/login"} icon={<UserIcon size={22}/>} label={authUser ? "My Trips" : "Login"} />
      </div>
    </>
  );
}

export default Navbar;
