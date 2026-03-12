import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { ArrowRight, MapPin } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import './HeroSlideshow.css';

export default function HeroSlideshow({ locations }) {
  const navigate = useNavigate();
  const featured = locations.filter((l) => l.is_featured).slice(0, 5);

  if (featured.length === 0) return null;

  return (
    <section className="hero-slideshow" id="hero">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        speed={800}
      >
        {featured.map((location) => (
          <SwiperSlide key={location.id}>
            <div className="hero-slide">
              <img
                src={location.image_url}
                alt={location.name}
                className="hero-slide-image"
                loading="eager"
              />
              <div className="hero-slide-overlay" />
              <div className="hero-slide-content">
                <div className="hero-slide-badge">
                  <MapPin size={12} />
                  {location.district}, Telangana
                </div>
                <h1 className="hero-slide-title">{location.name}</h1>
                <p className="hero-slide-desc">{location.short_description}</p>
                <button
                  className="hero-slide-cta"
                  onClick={() => navigate(`/location/${location.slug}`)}
                >
                  Explore Now <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
