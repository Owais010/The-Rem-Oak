import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import InfoModal from './InfoModal';
import './Footer.css';

export default function Footer() {
  const [infoModal, setInfoModal] = useState(null);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">THE REM OAK</div>
            <p className="footer-desc">
              Discover hidden gems across Telangana. We go beyond tourist hotspots
              to bring you authentic, crowd-sourced travel experiences that promote
              sustainable tourism.
            </p>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/explore">All Locations</Link></li>
              <li><Link to="/explore?category=heritage">Heritage Sites</Link></li>
              <li><Link to="/explore?category=nature">Nature Spots</Link></li>
              <li><Link to="/explore?category=temple">Temples</Link></li>
              <li><Link to="/random">Surprise Me</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><button className="footer-btn-link" onClick={() => setInfoModal('about')}>About Us</button></li>
              <li><button className="footer-btn-link" onClick={() => setInfoModal('mission')}>Our Mission</button></li>
              <li><button className="footer-btn-link" onClick={() => setInfoModal('sustainability')}>Sustainability</button></li>
              <li><button className="footer-btn-link" onClick={() => setInfoModal('careers')}>Careers</button></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li>
                <a href="mailto:hello@theremoak.com" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={14} /> hello@theremoak.com
                </a>
              </li>
              <li>
                <a href="tel:+919876543210" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={14} /> +91 98765 43210
                </a>
              </li>
              <li>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  <MapPin size={14} /> Hyderabad, Telangana
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2026 THE REM OAK. Made with <span className="footer-heart">♥</span> for Telangana
          </p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>

      {infoModal && (
        <InfoModal type={infoModal} onClose={() => setInfoModal(null)} />
      )}
    </footer>
  );
}
