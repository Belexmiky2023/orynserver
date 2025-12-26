
import React from 'react';
import { Page, User } from '../types';

interface NavbarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  user: User | null;
  onLogout: () => void;
  onLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate, user, onLogout, onLogin }) => {
  const navItems = [
    { label: 'HOME', id: Page.Home },
    { label: 'VOTE', id: Page.Vote },
    { label: 'GIFT', id: Page.Gift },
    { label: 'RATE US', id: Page.RateUs },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => onNavigate(Page.Home)}
      >
        <div className="w-8 h-8 bg-[#00FF41] rounded shadow-[0_0_15px_#00FF41] transition-transform group-hover:scale-110"></div>
        <span className="font-orbitron font-bold text-xl tracking-tighter">
          ORYN<span className="text-[#00FF41]">SERVER</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8 font-orbitron text-sm font-semibold tracking-wider">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`transition-all hover:text-[#00FF41] relative ${
              activePage === item.id ? 'text-[#00FF41]' : 'text-white/70'
            }`}
          >
            {item.label}
            {activePage === item.id && (
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#00FF41] shadow-[0_0_8px_#00FF41]"></span>
            )}
          </button>
        ))}
        {user?.isAdmin && (
          <button
            onClick={() => onNavigate(Page.Admin)}
            className={`transition-all text-red-500 hover:text-red-400 font-bold border border-red-500/30 px-3 py-1 rounded bg-red-500/5 ${
              activePage === Page.Admin ? 'bg-red-500/20' : ''
            }`}
          >
            ADMIN
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold leading-none">{user.name}</p>
              <button 
                onClick={onLogout}
                className="text-[10px] text-white/50 hover:text-red-500 transition-colors uppercase tracking-widest"
              >
                Sign Out
              </button>
            </div>
            <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full border border-white/20" />
          </div>
        ) : (
          <button 
            id="google-signin-btn"
            className="font-orbitron text-xs font-bold border border-[#00FF41] text-[#00FF41] px-4 py-2 rounded bg-[#00FF41]/5 hover:bg-[#00FF41]/20 transition-all shadow-[0_0_10px_rgba(0,255,65,0.2)]"
            onClick={onLogin}
          >
            SIGN IN
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
