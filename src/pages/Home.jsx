import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, TrendingUp } from 'lucide-react';
import locations, { categories, groupTypes } from '../lib/locations-seed';
import HeroSlideshow from '../components/HeroSlideshow';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import LocationCard from '../components/LocationCard';
import RandomPicker from '../components/RandomPicker';
import './Home.css';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const navigate = useNavigate();

  const filteredLocations = useMemo(() => {
    let result = [...locations];

    if (selectedCategory !== 'all') {
      result = result.filter((l) => l.category === selectedCategory);
    }

    if (selectedGroup !== 'all') {
      result = result.filter((l) => l.group_type?.includes(selectedGroup));
    }

    return result;
  }, [selectedCategory, selectedGroup]);

  const popularLocations = useMemo(() => {
    return [...locations].sort((a, b) => b.review_count - a.review_count).slice(0, 4);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Slideshow */}
      <HeroSlideshow locations={locations} />

      {/* Search Bar (overlapping hero) */}
      <div className="home-search-section">
        <SearchBar locations={locations} />
      </div>

      {/* Category & Group Filters */}
      <div className="container home-filters">
        <CategoryFilter
          categories={categories}
          groupTypes={groupTypes}
          selectedCategory={selectedCategory}
          selectedGroup={selectedGroup}
          onCategoryChange={setSelectedCategory}
          onGroupChange={setSelectedGroup}
        />
      </div>

      {/* Featured Locations Grid */}
      <section className="container home-featured">
        <div className="home-section-header">
          <div>
            <h2 className="section-title">
              {selectedCategory === 'all' ? 'Discover Telangana' : categories.find(c => c.id === selectedCategory)?.label || 'Locations'}
            </h2>
            <p className="section-subtitle">
              {filteredLocations.length} hidden gems waiting to be explored
            </p>
          </div>
          <button className="home-view-all" onClick={() => navigate('/explore')}>
            View All <ArrowRight size={16} />
          </button>
        </div>

        {filteredLocations.length > 0 ? (
          <div className="location-grid">
            {filteredLocations.slice(0, 6).map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No locations match your filters</h3>
            <p>Try adjusting your category or group type selection</p>
          </div>
        )}
      </section>

      {/* Stats Bar */}
      <section className="home-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">15+</div>
              <div className="stat-label">Hidden Gems</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10</div>
              <div className="stat-label">Districts Covered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2.5K+</div>
              <div className="stat-label">Community Reviews</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Sustainable Tourism</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular This Week - Horizontal Scroll */}
      <section className="container home-popular">
        <div className="home-section-header">
          <div>
            <h2 className="section-title">
              <TrendingUp size={28} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--color-cta)' }} />
              Trending Now
            </h2>
            <p className="section-subtitle">Most visited places by our community</p>
          </div>
        </div>

        <div className="location-grid">
          {popularLocations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </section>

      {/* Random Picker */}
      <section className="container home-random">
        <RandomPicker locations={locations} />
      </section>
    </div>
  );
}
