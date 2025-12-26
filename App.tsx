
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

// OAuth Configuration - Fixed as per client requirements
const GOOGLE_CLIENT_ID = "1027735078146-l610f2vn1cnm4o791d4795m07fdq9gd2.apps.googleusercontent.com";
// Client Secret included as requested for documentation/backend reference, 
// though GSI frontend uses the Client ID for the implicit flow.
const GOOGLE_CLIENT_SECRET = "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";

// Helper to decode JWT from Google Identity Services
const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Auth Error: Malformed JWT", e);
    return null;
  }
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const isGSIInitialized = useRef(false);

  // Robust Session Management
  useEffect(() => {
    const savedUserJson = localStorage.getItem('oryn_current_user');
    if (savedUserJson) {
      try {
        const u = JSON.parse(savedUserJson);
        // Sessions expire after 48 hours for security
        const isSessionValid = (Date.now() - u.loginTime) < (48 * 60 * 60 * 1000);
        
        if (isSessionValid) {
          setCurrentUser(u);
          setIsAdmin(u.isAdmin);
        } else {
          localStorage.removeItem('oryn_current_user');
          console.log("Session expired. Please sign in again.");
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
      
      // Admin Access Control: strictly restricted to these addresses
      const adminEmails = ['oryn179@gmail.com', 'admin@orynserver.com'];
      const isUserAdmin = adminEmails.includes(payload.email.toLowerCase());
      
      const authenticatedUser: User = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        isAdmin: isUserAdmin,
        votedFor: voteMap[payload.sub] || undefined,
        loginTime: Date.now()
      };
      
      // Atomic state updates
      setCurrentUser(authenticatedUser);
      setIsAdmin(isUserAdmin);
      
      // Persistence
      saveUser(authenticatedUser);
      localStorage.setItem('oryn_current_user', JSON.stringify(authenticatedUser));
      
      console.log(`Access Granted: ${authenticatedUser.name} | Role: ${isUserAdmin ? 'Admin' : 'Editor'}`);
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
      console.log("Oryn Auth Engine: Operational");
    }
  }, [handleGoogleResponse]);

  useEffect(() => {
    // Monitor library availability for dynamic script loading
    const checkGSI = setInterval(() => {
      if ((window as any).google?.accounts?.id) {
        initializeGSI();
        clearInterval(checkGSI);
      }
    }, 400);

    return () => clearInterval(checkGSI);
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
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthPrompt = () => {
    const googleObj = (window as any).google;
    if (googleObj?.accounts?.id) {
      if (!isGSIInitialized.current) initializeGSI();
      googleObj.accounts.id.prompt();
    } else {
      alert("Authentication system is initializing. Please try again in a few seconds.");
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home: return <Home onNavigate={handleNavigate} />;
      case Page.Vote: return <Vote user={currentUser} onLogin={handleAuthPrompt} />;
      case Page.Gift: return <Gift user={currentUser} onNavigate={handleNavigate} />;
      case Page.RateUs: return <RateUs user={currentUser} onLogin={handleAuthPrompt} />;
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
        onLogin={handleAuthPrompt}
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
