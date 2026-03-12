import { Globe, Castle, TreePine, Landmark, Waves, Clapperboard, Palette, User, Users, Home, Heart } from 'lucide-react';
import './CategoryFilter.css';

const iconMap = {
  Globe: Globe,
  Castle: Castle,
  TreePine: TreePine,
  Landmark: Landmark,
  Waves: Waves,
  Clapperboard: Clapperboard,
  Palette: Palette,
  User: User,
  Users: Users,
  Home: Home,
  Heart: Heart,
};

export default function CategoryFilter({
  categories,
  groupTypes,
  selectedCategory,
  selectedGroup,
  onCategoryChange,
  onGroupChange,
}) {
  return (
    <div className="category-filter">
      <div className="filter-section">
        <div className="filter-label">Browse by Category</div>
        <div className="category-filter-row">
          {categories.map((cat) => {
            const IconComponent = iconMap[cat.icon] || Globe;
            return (
              <button
                key={cat.id}
                className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => onCategoryChange(cat.id)}
              >
                <IconComponent size={16} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-label">Who are you traveling with?</div>
        <div className="group-filter-row">
          {groupTypes.map((group) => {
            const IconComponent = iconMap[group.icon] || Users;
            return (
              <button
                key={group.id}
                className={`group-pill ${selectedGroup === group.id ? 'active' : ''}`}
                onClick={() => onGroupChange(group.id)}
              >
                <IconComponent size={14} />
                {group.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
