import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Compass, Shuffle, LogIn, LogOut, User, Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';
import './Navbar.css';

export default function Navbar({ onAuthClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, profile, signOut, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: <Home size={16} /> },
    { path: '/explore', label: 'Explore', icon: <Compass size={16} /> },
    { path: '/random', label: 'Surprise Me', icon: <Shuffle size={16} /> },
  ];

  const getInitial = () => {
    if (profile?.display_name) return profile.display_name[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return 'U';
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="THE REM OAK" className="navbar-logo-img" />
          </Link>

          <div className="navbar-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            {isAuthenticated ? (
              <div className="navbar-user" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="navbar-avatar">{getInitial()}</div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  {profile?.display_name || 'User'}
                </span>
                {dropdownOpen && (
                  <div className="navbar-dropdown">
                    <button className="navbar-dropdown-item" onClick={() => navigate('/profile')}>
                      <User size={16} />
                      My Profile
                    </button>
                    <button className="navbar-dropdown-item danger" onClick={handleSignOut}>
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button className="navbar-auth-btn navbar-login-btn" onClick={() => onAuthClick?.('login')}>
                  <LogIn size={16} />
                  Log In
                </button>
                <button className="navbar-auth-btn navbar-signup-btn" onClick={() => onAuthClick?.('signup')}>
                  Sign Up
                </button>
              </>
            )}

            <button
              className={`navbar-hamburger ${mobileOpen ? 'open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      <div className={`navbar-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
        <div className="navbar-mobile-actions">
          {isAuthenticated ? (
            <button className="navbar-link" onClick={handleSignOut}>
              <LogOut size={16} />
              Sign Out
            </button>
          ) : (
            <>
              <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => { onAuthClick?.('login'); setMobileOpen(false); }}>
                Log In
              </button>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { onAuthClick?.('signup'); setMobileOpen(false); }}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
