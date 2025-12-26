
import React, { useState, useEffect } from 'react';
import { Page } from '../types';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Logic: If there's a stored end date, use it; otherwise, set one for 4 days from now.
    // This ensures the 4-day countdown is persistent for the user.
    let targetTime: number;
    const storedEndDate = localStorage.getItem('oryn_tournament_end');
    
    if (storedEndDate) {
      targetTime = parseInt(storedEndDate, 10);
    } else {
      targetTime = new Date().getTime() + (4 * 24 * 60 * 60 * 1000);
      localStorage.setItem('oryn_tournament_end', targetTime.toString());
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-24">
      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Animated Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00FF41]/10 rounded-full blur-[140px] -z-10 animate-pulse"></div>
        
        <div className="inline-block border border-[#00FF41]/30 bg-[#00FF41]/5 px-4 py-1 rounded-full mb-8 animate-bounce">
           <span className="font-orbitron text-[10px] font-bold text-[#00FF41] tracking-[0.3em]">SEASON 04 TOURNAMENT</span>
        </div>

        <h1 className="font-orbitron text-5xl md:text-8xl font-black mb-6 leading-tight tracking-tighter">
          EDITORS <span className="text-[#00FF41] neon-glow">ARENA</span>
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-white/70 mb-12 font-medium">
          The elite tournament platform for professional motion designers and video editors.
          Vote for your favorite artist before the clock runs out.
        </p>

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-4 md:gap-8 mb-12">
          {[
            { label: 'DAYS', value: timeLeft.days },
            { label: 'HOURS', value: timeLeft.hours },
            { label: 'MINUTES', value: timeLeft.minutes },
            { label: 'SECONDS', value: timeLeft.seconds },
          ].map((item) => (
            <div key={item.label} className="glass-panel p-4 md:p-6 rounded-2xl border border-white/10 w-20 md:w-32 group hover:border-[#00FF41]/50 transition-colors">
              <span className="block font-orbitron text-2xl md:text-4xl font-bold text-[#00FF41] group-hover:scale-110 transition-transform">{item.value.toString().padStart(2, '0')}</span>
              <span className="text-[10px] md:text-xs text-white/40 tracking-[0.2em] font-bold mt-1 uppercase">{item.label}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => onNavigate(Page.Vote)}
          className="bg-[#00FF41] text-black font-orbitron font-extrabold px-10 py-4 rounded-full hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,65,0.4)]"
        >
          CAST YOUR VOTE
        </button>
      </section>

      {/* Registration Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="font-orbitron text-3xl md:text-5xl font-bold leading-tight">
            WANT TO REGISTER & <br/>
            <span className="text-[#00FF41]">WIN THE PRIZE?</span>
          </h2>
          <p className="text-white/60 text-lg">
            Registration for the next bracket is now open. Join the most competitive
            creative league and win exclusive prizes.
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
            alt="Tournament Reward" 
            className="relative rounded-2xl border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-700 shadow-2xl"
          />
        </div>
      </section>

      {/* Rewards Grid */}
      <section className="space-y-12 pb-12">
        <div className="text-center">
          <h2 className="font-orbitron text-4xl font-bold mb-4 uppercase tracking-tighter">SEASON PRIZE POOL</h2>
          <div className="w-24 h-1 bg-[#00FF41] mx-auto shadow-[0_0_10px_#00FF41]"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { rank: '01', title: 'CHAMPION', reward: '$500 + Rtx 4090 Bundle', color: '#00FF41' },
            { rank: '02', title: 'FINALIST', reward: '$200 + Plugin Suite', color: '#FFFFFF' },
            { rank: '03', title: 'CONTENDER', reward: '$50 + Asset Pack', color: '#888888' },
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
