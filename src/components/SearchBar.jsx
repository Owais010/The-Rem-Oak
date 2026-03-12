import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import './SearchBar.css';

export default function SearchBar({ locations, placeholder = 'Search destinations in Telangana...' }) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const filtered = query.trim()
    ? locations.filter((l) =>
        l.name.toLowerCase().includes(query.toLowerCase()) ||
        l.district.toLowerCase().includes(query.toLowerCase()) ||
        l.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (location) => {
    navigate(`/location/${location.slug}`);
    setQuery('');
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/explore?search=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="search-bar-container" ref={containerRef}>
      <form className="search-bar" onSubmit={handleSubmit}>
        <Search size={20} className="search-bar-icon" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => query.trim() && setShowSuggestions(true)}
          id="search-input"
        />
        <button type="submit" className="search-bar-btn">
          <Search size={16} />
          <span>Search</span>
        </button>
      </form>

      {showSuggestions && filtered.length > 0 && (
        <div className="search-suggestions">
          {filtered.map((loc) => (
            <div
              key={loc.id}
              className="search-suggestion-item"
              onClick={() => handleSelect(loc)}
            >
              <div className="search-suggestion-icon">
                <MapPin size={16} />
              </div>
              <div className="search-suggestion-info">
                <div className="search-suggestion-name">{loc.name}</div>
                <div className="search-suggestion-meta">
                  {loc.district} · {loc.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
