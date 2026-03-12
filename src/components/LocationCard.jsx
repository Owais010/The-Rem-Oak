import { useNavigate } from 'react-router-dom';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import './LocationCard.css';

export default function LocationCard({ location }) {
  const navigate = useNavigate();

  return (
    <article
      className="location-card"
      onClick={() => navigate(`/location/${location.slug}`)}
      role="button"
      tabIndex={0}
    >
      <div className="location-card-image-wrap">
        <img
          src={location.image_url}
          alt={location.name}
          className="location-card-image"
          loading="lazy"
        />
        <span className="location-card-badge">{location.category}</span>
        <span className="location-card-rating">
          <Star size={12} fill="currentColor" />
          {location.rating?.toFixed(1) || '4.0'}
        </span>
      </div>

      <div className="location-card-body">
        <h3 className="location-card-title">{location.name}</h3>
        <div className="location-card-location">
          <MapPin size={14} />
          {location.district}, Telangana
        </div>
        <p className="location-card-desc">{location.short_description}</p>
        <div className="location-card-tags">
          {location.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="location-card-tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="location-card-footer">
        <span className="location-card-reviews">
          {location.review_count || 0} reviews
        </span>
        <span className="location-card-arrow">
          <ArrowRight size={14} />
        </span>
      </div>
    </article>
  );
}
