
import React, { useState, useEffect } from 'react';
import { User, Rating } from '../types';
import { saveRating, getStoredRatings } from '../store';

interface RateUsProps {
  user: User | null;
  onLogin: () => void;
}

const RateUs: React.FC<RateUsProps> = ({ user, onLogin }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [allRatings, setAllRatings] = useState<Rating[]>([]);

  useEffect(() => {
    setAllRatings(getStoredRatings());
  }, []);

  const handleSubmit = () => {
    if (!user) {
      onLogin();
      return;
    }
    if (rating === 0) return;

    saveRating({
      userId: user.id,
      userName: user.name,
      stars: rating,
      timestamp: Date.now()
    });
    
    setSubmitted(true);
    setAllRatings(getStoredRatings());
  };

  const avgRating = allRatings.length > 0 
    ? (allRatings.reduce((a, b) => a + b.stars, 0) / allRatings.length).toFixed(1)
    : "0.0";

  return (
    <div className="max-w-4xl mx-auto px-6 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="font-orbitron text-4xl md:text-5xl font-black">RATE YOUR <span className="text-[#00FF41]">EXPERIENCE</span></h1>
        <p className="text-white/50">Your feedback helps us improve the tournament experience for everyone.</p>
      </div>

      <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-8">
        {!submitted ? (
          <>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  className="transition-all transform hover:scale-125 focus:outline-none"
                >
                  <svg 
                    className={`w-12 h-12 transition-all ${
                      (hover || rating) >= star ? 'text-[#00FF41] drop-shadow-[0_0_10px_#00FF41]' : 'text-white/10'
                    }`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>

            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white focus:outline-none focus:border-[#00FF41]/50 transition-all min-h-[150px]"
              placeholder="Tell us what you think about Oryn Server..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>

            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className={`font-orbitron font-black px-12 py-4 rounded-full transition-all ${
                rating === 0 
                ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                : 'bg-[#00FF41] text-black shadow-[0_0_30px_rgba(0,255,65,0.4)] hover:scale-105'
              }`}
            >
              SUBMIT RATING
            </button>
          </>
        ) : (
          <div className="py-12 space-y-6">
            <div className="w-20 h-20 bg-[#00FF41] rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_#00FF41]">
              <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="font-orbitron text-2xl font-bold">THANK YOU!</h3>
            <p className="text-white/50">Your rating has been received. We appreciate your support!</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center">
          <span className="block text-[#00FF41] font-orbitron text-5xl font-black mb-2">{avgRating}</span>
          <span className="text-white/40 font-bold uppercase tracking-widest text-xs">AVERAGE RATING</span>
        </div>
        <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center">
          <span className="block text-white font-orbitron text-5xl font-black mb-2">{allRatings.length}</span>
          <span className="text-white/40 font-bold uppercase tracking-widest text-xs">TOTAL REVIEWS</span>
        </div>
        <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center">
          <span className="block text-white font-orbitron text-5xl font-black mb-2">100%</span>
          <span className="text-white/40 font-bold uppercase tracking-widest text-xs">EDITOR SATISFACTION</span>
        </div>
      </div>
    </div>
  );
};

export default RateUs;
