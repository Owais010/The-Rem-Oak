import { X, Info, Target, Leaf, Briefcase } from 'lucide-react';
import './InfoModal.css';

const infoContent = {
  about: {
    title: 'About Us',
    icon: <Info size={28} color="var(--color-primary)" />,
    text: 'THE REM OAK is dedicated to uncovering the hidden gems of Telangana. We believe that true travel lies beyond the tourist hotspots. Our platform connects passionate travelers with authentic, off-the-beaten-path experiences while supporting local communities.'
  },
  mission: {
    title: 'Our Mission',
    icon: <Target size={28} color="var(--color-cta)" />,
    text: 'Our mission is to democratize travel discovery in Telangana. We aim to distribute tourism benefits more evenly across the state by spotlighting lesser-known destinations, thereby reducing the strain on popular sites and boosting local economies.'
  },
  sustainability: {
    title: 'Sustainability',
    icon: <Leaf size={28} color="#10B981" />,
    text: 'We are committed to sustainable tourism. By promoting lesser-known destinations, we help preserve cultural heritage and natural landscapes. We encourage our community to travel responsibly, respect local ecosystems, and support local artisans and businesses.'
  },
  careers: {
    title: 'Careers',
    icon: <Briefcase size={28} color="var(--color-text)" />,
    text: 'Join our team of explorers, storytellers, and tech enthusiasts! We are always looking for passionate people to help us build the best travel discovery platform. Currently we are a small dedicated team, but feel free to send your resume to hello@theremoak.com.'
  }
};

export default function InfoModal({ type, onClose }) {
  if (!type || !infoContent[type]) return null;
  const content = infoContent[type];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content info-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="info-modal-header">
          {content.icon}
          <h2>{content.title}</h2>
        </div>
        <div className="info-modal-body">
          <p>{content.text}</p>
        </div>
        <button className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--spacing-xl)' }} onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
}
