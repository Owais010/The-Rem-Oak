import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock, Ticket, Bus, Users, User, Home as HomeIcon, Heart, Share2, Calendar } from 'lucide-react';
import locations from '../lib/locations-seed';
import { supabase } from '../lib/supabase';
import MapView from '../components/MapView';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import LocationCard from '../components/LocationCard';
import StarRating from '../components/StarRating';
import './LocationDetail.css';

const groupIcons = { solo: User, friends: Users, family: HomeIcon, couple: Heart };

export default function LocationDetail({ onAuthClick }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const location = locations.find((l) => l.slug === slug);

  const relatedLocations = useMemo(() => {
    if (!location) return [];
    return locations
      .filter((l) => l.id !== location.id && (l.category === location.category || l.district === location.district))
      .slice(0, 6);
  }, [location]);

  // Sample reviews (fallback when Supabase not configured)
  const sampleReviews = useMemo(() => {
    if (!location) return [];
    return [
      {
        id: 'sample-1',
        user_name: 'Priya Sharma',
        rating: 5,
        comment: `Absolutely stunning place! ${location.name} is even more beautiful in person. The atmosphere was serene and we spent the entire day exploring. Highly recommend visiting during the golden hour for photography.`,
        images: [],
        created_at: '2026-02-15T10:00:00Z',
      },
      {
        id: 'sample-2',
        user_name: 'Rahul Reddy',
        rating: 4,
        comment: `Great experience at ${location.name}. The historical significance of this place is incredible. Only giving 4 stars because parking can be a challenge on weekends. Otherwise, a must-visit!`,
        images: [],
        created_at: '2026-01-28T14:30:00Z',
      },
      {
        id: 'sample-3',
        user_name: 'Meera K',
        rating: 5,
        comment: 'We visited with family and everyone loved it! The kids had a great time and there was so much to see. The locals were very friendly and helpful. Will definitely come back again.',
        images: [],
        created_at: '2026-01-10T09:15:00Z',
      },
    ];
  }, [location]);

  useEffect(() => {
    if (location) {
      loadReviews();
      window.scrollTo(0, 0);
    }
  }, [slug]);

  async function loadReviews() {
    setLoadingReviews(true);
    try {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('location_id', location.id)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setReviews(data);
      } else {
        setReviews(sampleReviews);
      }
    } catch {
      setReviews(sampleReviews);
    } finally {
      setLoadingReviews(false);
    }
  }

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${location.name} — THE REM OAK`,
          text: location.short_description,
          url,
        });
      } catch { /* user cancelled */ }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (!location) {
    return (
      <div className="detail-page" style={{ textAlign: 'center', padding: '200px 20px' }}>
        <h2>Location Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '1rem' }}>
          The place you're looking for doesn't exist.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '1.5rem' }}>
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="detail-page">
      {/* Hero Banner */}
      <div className="detail-hero">
        <img src={location.image_url} alt={location.name} className="detail-hero-image" />
        <div className="detail-hero-overlay" />
        <div className="detail-hero-content container">
          <span className="detail-hero-badge">{location.category}</span>
          <h1 className="detail-hero-title">{location.name}</h1>
          <div className="detail-hero-meta">
            <span className="detail-hero-meta-item">
              <MapPin size={16} /> {location.district}, Telangana
            </span>
            <span className="detail-hero-meta-item">
              <Star size={16} fill="#FBBF24" color="#FBBF24" /> {location.rating} ({location.review_count} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="container">
        <button className="detail-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back to explore
        </button>

        <div className="detail-content">
          {/* Main Content */}
          <div className="detail-main">
            {/* Description */}
            <div className="detail-section">
              <h2>About {location.name}</h2>
              <p className="detail-description">{location.description}</p>
              <div className="detail-tags">
                {location.tags?.map((tag) => (
                  <span key={tag} className="detail-tag">{tag}</span>
                ))}
              </div>
            </div>

            {/* Info Grid */}
            <div className="detail-section">
              <h2>Visitor Information</h2>
              <div className="detail-info-grid">
                <div className="detail-info-card">
                  <div className="detail-info-icon"><Clock size={20} /></div>
                  <div>
                    <div className="detail-info-label">Best Time to Visit</div>
                    <div className="detail-info-value">{location.best_time}</div>
                  </div>
                </div>
                <div className="detail-info-card">
                  <div className="detail-info-icon"><Ticket size={20} /></div>
                  <div>
                    <div className="detail-info-label">Entry Fee</div>
                    <div className="detail-info-value">{location.entry_fee}</div>
                  </div>
                </div>
                <div className="detail-info-card">
                  <div className="detail-info-icon"><Bus size={20} /></div>
                  <div>
                    <div className="detail-info-label">Nearby Transport</div>
                    <div className="detail-info-value">{location.nearby_transport}</div>
                  </div>
                </div>
                <div className="detail-info-card">
                  <div className="detail-info-icon"><Calendar size={20} /></div>
                  <div>
                    <div className="detail-info-label">District</div>
                    <div className="detail-info-value">{location.district}, Telangana</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery */}
            {location.gallery?.length > 0 && (
              <div className="detail-section">
                <h2>Photo Gallery</h2>
                <div className="detail-gallery">
                  <img src={location.image_url} alt={`${location.name} main`} className="detail-gallery-image" />
                  {location.gallery.map((img, i) => (
                    <img key={i} src={img} alt={`${location.name} ${i + 1}`} className="detail-gallery-image" />
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="detail-section">
              <h2>Location & Nearby</h2>
              <MapView
                latitude={location.latitude}
                longitude={location.longitude}
                name={location.name}
              />
            </div>

            {/* Reviews */}
            <div className="detail-section">
              <h2>Traveler Reviews</h2>
              <div className="review-cards-grid" style={{ marginBottom: 'var(--spacing-xl)' }}>
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
              <ReviewForm
                locationId={location.id}
                onReviewAdded={loadReviews}
                onAuthClick={onAuthClick}
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="detail-sidebar">
            {/* Rating summary */}
            <div className="detail-sidebar-card">
              <h3>Rating</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
                  {location.rating}
                </span>
                <div>
                  <StarRating rating={Math.round(location.rating)} size={20} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginTop: 4 }}>
                    Based on {location.review_count} reviews
                  </span>
                </div>
              </div>
            </div>

            {/* Best For */}
            <div className="detail-sidebar-card">
              <h3>Best For</h3>
              <div className="detail-group-badges">
                {location.group_type?.map((g) => {
                  const Icon = groupIcons[g] || Users;
                  return (
                    <span key={g} className="detail-group-badge">
                      <Icon size={14} />
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Share */}
            <button className="detail-share-btn" onClick={handleShare}>
              <Share2 size={16} />
              Share This Place
            </button>
          </aside>
        </div>
      </div>

      {/* Related Locations */}
      {relatedLocations.length > 0 && (
        <section className="container related-locations">
          <h2 className="section-title">You May Also Like</h2>
          <p className="section-subtitle" style={{ marginBottom: 'var(--spacing-xl)' }}>
            Similar places in {location.category} or {location.district}
          </p>
          <div className="related-scroll">
            {relatedLocations.map((loc) => (
              <LocationCard key={loc.id} location={loc} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
