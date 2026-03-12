import StarRating from './StarRating';
import './ReviewCard.css';

export default function ReviewCard({ review }) {
  const getInitial = () => {
    return review.user_name ? review.user_name[0].toUpperCase() : 'U';
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="review-card">
      <div className="review-card-header">
        <div className="review-card-avatar">{getInitial()}</div>
        <div className="review-card-user-info">
          <div className="review-card-username">{review.user_name || 'Anonymous'}</div>
          <div className="review-card-date">{formatDate(review.created_at)}</div>
        </div>
        <StarRating rating={review.rating} size={16} />
      </div>

      <p className="review-card-comment">{review.comment}</p>

      {review.images && review.images.length > 0 && (
        <div className="review-card-images">
          {review.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Review photo ${i + 1}`}
              className="review-card-image"
              loading="lazy"
            />
          ))}
        </div>
      )}
    </div>
  );
}
