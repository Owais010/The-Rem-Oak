import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import locations, { categories, groupTypes } from '../lib/locations-seed';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import LocationCard from '../components/LocationCard';
import './AllLocations.css';

export default function AllLocations() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const filteredLocations = useMemo(() => {
    let result = [...locations];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.district.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q) ||
          l.short_description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((l) => l.category === selectedCategory);
    }

    // Group filter
    if (selectedGroup !== 'all') {
      result = result.filter((l) => l.group_type?.includes(selectedGroup));
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'reviews':
        result.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
        break;
      default:
        break;
    }

    return result;
  }, [selectedCategory, selectedGroup, sortBy, searchQuery]);

  return (
    <div className="explore-page">
      <div className="container">
        <div className="explore-header">
          <h1>Explore Telangana</h1>
          <p>
            Browse all {locations.length} locations across the state
          </p>
        </div>

        <SearchBar
          locations={locations}
          placeholder="Search by name, district, or category..."
        />

        <CategoryFilter
          categories={categories}
          groupTypes={groupTypes}
          selectedCategory={selectedCategory}
          selectedGroup={selectedGroup}
          onCategoryChange={setSelectedCategory}
          onGroupChange={setSelectedGroup}
        />

        <div className="explore-toolbar">
          <span className="explore-count">
            Showing {filteredLocations.length} of {locations.length} locations
          </span>
          <div className="explore-sort">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rating">Top Rated</option>
              <option value="name">Name (A-Z)</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>

        {filteredLocations.length > 0 ? (
          <div className="location-grid" style={{ paddingBottom: 'var(--spacing-3xl)' }}>
            {filteredLocations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        ) : (
          <div className="no-results" style={{ paddingBottom: 'var(--spacing-3xl)' }}>
            <h3>No locations found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
