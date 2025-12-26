
import React from 'react';
import { Page, GiftPackage, User } from '../types';
import { saveTransaction } from '../store';

interface GiftProps {
  user: User | null;
  onNavigate: (page: Page) => void;
}

const Gift: React.FC<GiftProps> = ({ user, onNavigate }) => {
  const packages: GiftPackage[] = [
    { id: '1', name: 'STARTER PACK', stars: 1, votes: 2 },
    { id: '2', name: 'PREMIUM PACK', stars: 15, votes: 35, highlighted: true },
    { id: '3', name: 'ELITE PACK', stars: 50, votes: 125 },
    { id: '4', name: 'WHALE PACK', stars: 100, votes: 300 },
  ];

  const handlePurchase = (pkg: GiftPackage) => {
    if (!user) {
      alert('Please login first to buy votes.');
      return;
    }

    // Save transaction locally for admin view
    saveTransaction({
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      packageId: pkg.id,
      stars: pkg.stars,
      votes: pkg.votes,
      timestamp: Date.now(),
      status: 'pending'
    });

    onNavigate(Page.Success);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="font-orbitron text-4xl md:text-5xl font-black">BOOST <span className="text-[#00FF41]">VOTES</span></h1>
        <p className="text-white/50">Want to help your favorite editor climb the ranks faster? Gift them extra votes through our premium star packages.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {packages.map((pkg) => (
          <div 
            key={pkg.id} 
            className={`glass-panel p-8 rounded-3xl border flex flex-col items-center text-center transition-all duration-500 relative ${
              pkg.highlighted 
                ? 'border-[#00FF41] scale-110 z-10 bg-[#00FF41]/5 shadow-[0_0_40px_rgba(0,255,65,0.15)]' 
                : 'border-white/10 hover:border-white/30'
            }`}
          >
            {pkg.highlighted && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00FF41] text-black font-orbitron font-black text-[10px] px-4 py-1 rounded-full shadow-[0_0_10px_#00FF41]">BEST VALUE</span>
            )}
            
            <div className="w-16 h-16 bg-[#00FF41]/20 rounded-full flex items-center justify-center mb-6 group">
               <svg className="w-8 h-8 text-[#00FF41] group-hover:scale-125 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
               </svg>
            </div>

            <h3 className="font-orbitron font-bold text-xl mb-1">{pkg.name}</h3>
            <p className="text-[#00FF41] font-orbitron font-black text-3xl mb-4">{pkg.stars} STARS</p>
            <div className="w-full h-px bg-white/10 mb-6"></div>
            
            <p className="text-white/70 mb-8 flex flex-col">
              <span className="text-white text-2xl font-black">{pkg.votes}</span>
              <span className="text-[10px] font-bold tracking-[0.2em] opacity-40 uppercase">EXTRA VOTES</span>
            </p>

            <button 
              onClick={() => handlePurchase(pkg)}
              className={`w-full font-orbitron font-black py-4 rounded-2xl transition-all ${
                pkg.highlighted 
                  ? 'bg-[#00FF41] text-black shadow-[0_0_30px_#00FF41]' 
                  : 'bg-white/10 text-white hover:bg-white hover:text-black'
              }`}
            >
              PAY HERE
            </button>
          </div>
        ))}
      </div>

      <div className="glass-panel p-10 rounded-3xl border border-white/10 max-w-3xl mx-auto space-y-6 text-center">
        <h2 className="font-orbitron text-2xl font-bold">PAYMENT INSTRUCTIONS</h2>
        <div className="space-y-4 text-white/60">
          <p>1. Click "PAY HERE" on your desired package above.</p>
          <p>2. You will be redirected to DM our Telegram Admin <span className="text-[#00FF41] font-bold">@Oryn179</span>.</p>
          <p>3. Send the screenshot of your selection and the number of stars you want.</p>
          <p>4. Once confirmed, your votes will be added manually by our team within 24 hours.</p>
        </div>
        <div className="flex justify-center pt-4">
           <a 
            href="https://t.me/oryn179" 
            className="flex items-center gap-3 bg-blue-500 text-white font-bold px-8 py-3 rounded-full hover:bg-blue-400 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
           >
             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.98-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.91-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.72-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
             TELEGRAM ADMIN
           </a>
        </div>
      </div>
    </div>
  );
};

export default Gift;
