
import React from 'react';
import { Page } from '../types';

interface SuccessPageProps {
  onNavigate: (page: Page) => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center space-y-8">
      <div className="w-24 h-24 bg-[#00FF41] rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_#00FF41]">
        <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>

      <div className="space-y-4">
        <h1 className="font-orbitron text-5xl font-black">DONE!</h1>
        <p className="text-white/60 text-lg">
          If your transaction is not applied within 24 hours, please DM us immediately.
        </p>
      </div>

      <div className="flex flex-col gap-4 pt-8">
        <a 
          href="https://t.me/oryn179" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#00FF41] text-black font-orbitron font-black py-4 rounded-2xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,65,0.3)]"
        >
          INBOX ADMIN
        </a>
        <button 
          onClick={() => onNavigate(Page.Home)}
          className="text-white/40 font-bold uppercase tracking-[0.2em] hover:text-[#00FF41] transition-colors text-sm"
        >
          BACK TO HOME
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
