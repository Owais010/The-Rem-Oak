import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shuffle, MapPin, Star, ArrowRight } from 'lucide-react';
import './RandomPicker.css';

export default function RandomPicker({ locations }) {
  const [result, setResult] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const navigate = useNavigate();

  const pickRandom = () => {
    setSpinning(true);
    setResult(null);

    // Animate then reveal
    setTimeout(() => {
      const random = locations[Math.floor(Math.random() * locations.length)];
      setResult(random);
      setSpinning(false);
    }, 600);
  };

  return (
    <div className="random-picker">
      <h3>Can't Decide?</h3>
      <p>Let us pick a surprise destination for you!</p>

      <button
        className={`random-picker-btn ${spinning ? 'spinning' : ''}`}
        onClick={pickRandom}
        disabled={spinning}
      >
        <Shuffle size={22} className="random-picker-icon" />
        {spinning ? 'Finding...' : 'Surprise Me!'}
      </button>

      {result && (
        <div className="random-result">
          <div
            className="random-result-card"
            onClick={() => navigate(`/location/${result.slug}`)}
          >
            <img
              src={result.image_url}
              alt={result.name}
              className="random-result-image"
            />
            <div className="random-result-info">
              <h4>{result.name}</h4>
              <p>
                <MapPin size={12} style={{ verticalAlign: 'middle' }} /> {result.district} ·{' '}
                <Star size={12} fill="#FBBF24" color="#FBBF24" style={{ verticalAlign: 'middle' }} />{' '}
                {result.rating}
              </p>
            </div>
            <ArrowRight size={20} style={{ color: 'var(--color-primary)' }} />
          </div>
        </div>
      )}
    </div>
  );
}
