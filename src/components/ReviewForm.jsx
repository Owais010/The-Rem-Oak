import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Camera, Send, X, LogIn } from 'lucide-react';
import StarRating from './StarRating';
import './ReviewForm.css';

export default function ReviewForm({ locationId, onReviewAdded, onAuthClick }) {
  const { user, profile, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  if (!isAuthenticated) {
    return (
      <div className="review-login-prompt">
        <p>Log in to share your experience and help fellow travelers!</p>
        <button className="btn btn-primary" onClick={() => onAuthClick?.('login')}>
          <LogIn size={16} /> Log In to Review
        </button>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setImages((prev) => [...prev, ...files].slice(0, 4));
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result].slice(0, 4));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;

    setSubmitting(true);
    try {
      // Upload images to Supabase Storage
      const uploadedUrls = [];
      for (const file of images) {
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${file.name.split('.').pop()}`;
        const { data, error } = await supabase.storage
          .from('review-images')
          .upload(`reviews/${fileName}`, file);
        
        if (!error && data) {
          const { data: urlData } = supabase.storage
            .from('review-images')
            .getPublicUrl(`reviews/${fileName}`);
          uploadedUrls.push(urlData.publicUrl);
        } else {
          console.warn('Image upload failed, continuing without image:', error);
        }
      }

      // Insert review
      const { error } = await supabase.from('reviews').insert({
        location_id: String(locationId), // Ensure string for new schema
        user_id: user.id,
        user_name: profile?.display_name || user.email?.split('@')[0] || 'Anonymous',
        rating,
        comment: comment.trim(),
        images: uploadedUrls,
      });

      if (error) throw error;

      // Reset form
      setRating(0);
      setComment('');
      setImages([]);
      setPreviews([]);
      onReviewAdded?.();
      alert('Review submitted successfully!');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review via Supabase. Make sure you ran the SQL schema and created the storage bucket in your Supabase dashboard.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Share Your Experience</h3>

      <div className="review-form-group">
        <label className="review-form-label">Your Rating</label>
        <StarRating rating={rating} onRate={setRating} size={28} interactive />
      </div>

      <div className="review-form-group">
        <label className="review-form-label" htmlFor="review-comment">Your Review</label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell others about your experience at this place..."
          required
        />
      </div>

      <div className="review-form-group">
        <label className="review-form-label">Photos (up to 4)</label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="review-form-file-input"
          id="review-images"
        />
        <div className="review-form-images">
          {previews.map((src, i) => (
            <div key={i} className="review-form-image-preview">
              <img src={src} alt={`Preview ${i + 1}`} />
              <button
                type="button"
                className="review-form-image-remove"
                onClick={() => removeImage(i)}
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {previews.length < 4 && (
            <button
              type="button"
              className="review-form-upload-btn"
              onClick={() => fileRef.current?.click()}
            >
              <Camera size={16} />
              Add Photos
            </button>
          )}
        </div>
      </div>

      <div className="review-form-actions">
        <button
          type="submit"
          className="review-form-submit"
          disabled={submitting || rating === 0 || !comment.trim()}
        >
          <Send size={16} />
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
}
