
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Page, User, Editor } from './types';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Vote from './pages/Vote';
import Gift from './pages/Gift';
import RateUs from './pages/RateUs';
import Admin from './pages/Admin';
import SuccessPage from './pages/SuccessPage';
import { getStoredUsers, saveUser, getVoteMap } from './store';

// OAuth Configuration
const GOOGLE_CLIENT_ID = "1027735078146-l610f2vn1cnm4o791d4795m07fdq9gd2.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

// Secure JWT decoding helper
const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Auth System Error: Malformed credential payload", e);
    return null;
  }
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const isGSIInitialized = useRef(false);

  // Advanced Session Management Protocol
  useEffect(() => {
    const stored = localStorage.getItem('oryn_current_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        // Stricter session check: 24 hours expiry
        const isExpired = (Date.now() - u.loginTime) > (24 * 60 * 60 * 1000);
        
        if (!isExpired) {
          setCurrentUser(u);
          setIsAdmin(u.isAdmin);
        } else {
          console.warn("Security Alert: Session expired. Wiping sensitive tokens.");
          localStorage.removeItem('oryn_current_user');
        }
      } catch (e) {
        localStorage.removeItem('oryn_current_user');
      }
    }
  }, []);

  const handleGoogleResponse = useCallback((response: any) => {
    const payload = decodeJwt(response.credential);
    if (payload) {
      const voteMap = getVoteMap();
      
      // Multi-layer Identity Verification
      const restrictedEmails = ['oryn179@gmail.com', 'admin@orynserver.com'];
      const userEmailLower = payload.email.toLowerCase();
      const hasPrivilegedAccess = restrictedEmails.includes(userEmailLower);
      
      const sessionUser: User = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        isAdmin: hasPrivilegedAccess,
        votedFor: voteMap[payload.sub] || undefined,
        loginTime: Date.now()
      };
      
      // Secure State Update
      setCurrentUser(sessionUser);
      setIsAdmin(hasPrivilegedAccess);
      
      // Atomic Persistence
      saveUser(sessionUser);
      localStorage.setItem('oryn_current_user', JSON.stringify(sessionUser));
      
      console.log(`Access Log: ${sessionUser.name} signed in. Status: ${hasPrivilegedAccess ? 'ROOT' : 'USER'}`);
    }
  }, []);

  const initializeGSI = useCallback(() => {
    const googleObj = (window as any).google;
    if (googleObj?.accounts?.id && !isGSIInitialized.current) {
      googleObj.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        context: 'signin'
      });
      isGSIInitialized.current = true;
      console.log("Oryn Auth Engine: Standard Encrypted Initialization Complete.");
    }
  }, [handleGoogleResponse]);

  useEffect(() => {
    const authWatcher = setInterval(() => {
      if ((window as any).google?.accounts?.id) {
        initializeGSI();
        clearInterval(authWatcher);
      }
    }, 500);
    return () => clearInterval(authWatcher);
  }, [initializeGSI]);

  const logout = () => {
    const googleObj = (window as any).google;
    if (googleObj?.accounts?.id && currentUser) {
      googleObj.accounts.id.disableAutoSelect();
    }
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('oryn_current_user');
    setCurrentPage(Page.Home);
  };

  const handleNavigate = (page: Page) => {
    // Basic route protection
    if (page === Page.Admin && !isAdmin) {
      setCurrentPage(Page.Home);
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthTrigger = () => {
    const googleObj = (window as any).google;
    if (googleObj?.accounts?.id) {
      if (!isGSIInitialized.current) initializeGSI();
      googleObj.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
           console.warn("Auth Notification Hidden: ", notification.getNotDisplayedReason());
        }
      });
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home: return <Home onNavigate={handleNavigate} />;
      case Page.Vote: return <Vote user={currentUser} onLogin={handleAuthTrigger} />;
      case Page.Gift: return <Gift user={currentUser} onNavigate={handleNavigate} />;
      case Page.RateUs: return <RateUs user={currentUser} onLogin={handleAuthTrigger} />;
      case Page.Admin: return isAdmin ? <Admin /> : <Home onNavigate={handleNavigate} />;
      case Page.Success: return <SuccessPage onNavigate={handleNavigate} />;
      default: return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#00FF41] selection:text-black">
      <Navbar 
        activePage={currentPage} 
        onNavigate={handleNavigate} 
        user={currentUser} 
        onLogout={logout}
        onLogin={handleAuthTrigger}
      />
      <main className="pt-20 pb-12">
        {renderPage()}
      </main>
      
      <footer className="border-t border-white/5 py-12 px-6 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-50">
             <div className="w-5 h-5 bg-[#00FF41] rounded-sm"></div>
             <span className="font-orbitron font-bold text-sm tracking-tighter">ORYN SERVER</span>
          </div>
          <p className="font-orbitron tracking-[0.3em] text-[10px] text-white/30 uppercase">
            &copy; {new Date().getFullYear()} PROXIMAL MOTION | ALL RIGHTS RESERVED
          </p>
          <div className="flex justify-center gap-8 mt-2">
            <a href="#" className="text-white/40 hover:text-[#00FF41] transition-all text-xs font-bold uppercase tracking-widest">Discord</a>
            <a href="https://t.me/oryn179" target="_blank" rel="noreferrer" className="text-white/40 hover:text-[#00FF41] transition-all text-xs font-bold uppercase tracking-widest">Telegram</a>
            <a href="#" className="text-white/40 hover:text-[#00FF41] transition-all text-xs font-bold uppercase tracking-widest">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
