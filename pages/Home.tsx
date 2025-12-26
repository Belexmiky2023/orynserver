
import React, { useState, useEffect } from 'react';
import { Page } from '../types';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set target date to end of current month
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + 1);
    targetDate.setDate(0); 

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });

      if (distance < 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-24">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Animated Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00FF41]/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        
        <h1 className="font-orbitron text-5xl md:text-8xl font-black mb-6 leading-tight tracking-tighter">
          EDITORS <span className="text-[#00FF41] neon-glow">ARENA</span>
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-white/70 mb-12 font-medium">
          The most prestigious tournament platform dedicated to elite video editors. 
          Showcase your skills, climb the ranks, and dominate the leaderboard.
        </p>

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-4 md:gap-8 mb-12">
          {[
            { label: 'DAYS', value: timeLeft.days },
            { label: 'HOURS', value: timeLeft.hours },
            { label: 'MINUTES', value: timeLeft.minutes },
            { label: 'SECONDS', value: timeLeft.seconds },
          ].map((item) => (
            <div key={item.label} className="glass-panel p-4 md:p-6 rounded-2xl border border-white/10 w-20 md:w-32">
              <span className="block font-orbitron text-2xl md:text-4xl font-bold text-[#00FF41]">{item.value.toString().padStart(2, '0')}</span>
              <span className="text-[10px] md:text-xs text-white/40 tracking-[0.2em] font-bold mt-1">{item.label}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => onNavigate(Page.Vote)}
          className="bg-[#00FF41] text-black font-orbitron font-extrabold px-10 py-4 rounded-full hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,65,0.4)]"
        >
          EXPLORE TOURNAMENT
        </button>
      </section>

      {/* Info Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="font-orbitron text-3xl md:text-5xl font-bold leading-tight">
            WANT TO REGISTER & <br/>
            <span className="text-[#00FF41]">WIN THE PRIZE?</span>
          </h2>
          <p className="text-white/60 text-lg">
            Registration is now open for Season 4. Fill out the application form with your best work 
            to be considered for the main brackets.
          </p>
          <a 
            href="https://forms.gle/UWnLvPZRE4Q2kKS96" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block font-orbitron font-bold text-[#00FF41] border border-[#00FF41] px-8 py-3 rounded hover:bg-[#00FF41]/10 transition-all shadow-[0_0_15px_rgba(0,255,65,0.1)]"
          >
            REGISTER HERE
          </a>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-[#00FF41]/20 rounded-2xl blur-xl transition-all group-hover:blur-3xl"></div>
          <img 
            src="https://picsum.photos/seed/oryn-prize/800/600" 
            alt="Tournament Preview" 
            className="relative rounded-2xl border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-700"
          />
        </div>
      </section>

      {/* Prize Preview Section */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="font-orbitron text-4xl font-bold mb-4">SEASON PRIZES</h2>
          <div className="w-24 h-1 bg-[#00FF41] mx-auto shadow-[0_0_10px_#00FF41]"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { rank: '01', title: 'CHAMPION', reward: '$500 + Custom PC Bundle', color: '#00FF41' },
            { rank: '02', title: 'RUNNER UP', reward: '$200 + Editing Suite', color: '#FFFFFF' },
            { rank: '03', title: 'BRONZE', reward: '$50 + Asset Pack', color: '#888888' },
          ].map((p) => (
            <div key={p.rank} className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-[#00FF41]/40 transition-all group overflow-hidden relative">
              <span className="absolute -top-4 -right-4 text-9xl font-black text-white/[0.03] group-hover:text-[#00FF41]/[0.05] transition-all">{p.rank}</span>
              <h3 className="font-orbitron text-2xl font-bold mb-2 tracking-tighter" style={{ color: p.color }}>{p.title}</h3>
              <p className="text-white/60 font-medium">{p.reward}</p>
              <div className="mt-6 w-full h-[2px] bg-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#00FF41] -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
