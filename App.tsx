
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

const GOOGLE_CLIENT_ID = "1027735078146-l610f2vn1cnm4o791d4795m07fdq9gd2.apps.googleusercontent.com";

// Helper to decode JWT from Google
const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const isGSIInitialized = useRef(false);

  // Initialize Auth from local storage
  useEffect(() => {
    const savedUser = localStorage.getItem('oryn_current_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setCurrentUser(u);
      setIsAdmin(u.isAdmin);
    }
  }, []);

  const handleGoogleResponse = useCallback((response: any) => {
    const payload = decodeJwt(response.credential);
    if (payload) {
      const voteMap = getVoteMap();
      // Admin check: oryn179@gmail.com is the authorized admin
      const isUserAdmin = payload.email === 'oryn179@gmail.com' || payload.email === 'admin@orynserver.com';
      
      const newUser: User = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        isAdmin: isUserAdmin,
        votedFor: voteMap[payload.sub] || undefined,
        loginTime: Date.now()
      };
      
      setCurrentUser(newUser);
      setIsAdmin(isUserAdmin);
      saveUser(newUser);
      localStorage.setItem('oryn_current_user', JSON.stringify(newUser));
    }
  }, []);

  const initializeGSI = useCallback(() => {
    const googleObj = (window as any).google;
    if (googleObj?.accounts?.id && !isGSIInitialized.current) {
      googleObj.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });
      isGSIInitialized.current = true;
      console.log("GSI Initialized successfully");
    }
  }, [handleGoogleResponse]);

  useEffect(() => {
    // Check every 500ms if google script is loaded, then initialize
    const interval = setInterval(() => {
      if ((window as any).google?.accounts?.id) {
        initializeGSI();
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [initializeGSI]);

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('oryn_current_user');
    setCurrentPage(Page.Home);
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrompt = () => {
    const googleObj = (window as any).google;
    if (googleObj?.accounts?.id) {
      if (!isGSIInitialized.current) {
        initializeGSI();
      }
      googleObj.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.warn("One Tap not displayed:", notification.getNotDisplayedReason());
          // Fallback if prompt is blocked or not shown
          alert("Please ensure third-party cookies are enabled or try again.");
        }
      });
    } else {
      alert("Google Sign-In is still loading. Please wait a moment.");
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home: return <Home onNavigate={handleNavigate} />;
      case Page.Vote: return <Vote user={currentUser} onLogin={handlePrompt} />;
      case Page.Gift: return <Gift user={currentUser} onNavigate={handleNavigate} />;
      case Page.RateUs: return <RateUs user={currentUser} onLogin={handlePrompt} />;
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
        onLogin={handlePrompt}
      />
      <main className="pt-20 pb-12">
        {renderPage()}
      </main>
      
      <footer className="border-t border-white/5 py-10 px-6 text-center text-white/40 text-sm">
        <p>&copy; {new Date().getFullYear()} ORYN SERVER. EXCLUSIVE FOR EDITORS.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="hover:text-[#00FF41] transition-colors">Discord</a>
          <a href="https://t.me/oryn179" className="hover:text-[#00FF41] transition-colors">Telegram</a>
          <a href="#" className="hover:text-[#00FF41] transition-colors">Instagram</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
