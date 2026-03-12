import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, onRate, size = 20, interactive = false }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          fill={(hovered || rating) >= star ? '#FBBF24' : 'none'}
          color={(hovered || rating) >= star ? '#FBBF24' : '#CBD5E1'}
          style={{ cursor: interactive ? 'pointer' : 'default', transition: 'all 150ms ease' }}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onRate?.(star)}
        />
      ))}
    </div>
  );
}
