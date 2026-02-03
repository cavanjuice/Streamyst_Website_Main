
import React, { useState, useEffect, useRef, useCallback, memo, useTransition } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ExperienceToggle from './components/ExperienceToggle';
import ProblemStatement from './components/ProblemStatement';
import InteractiveDemo from './components/InteractiveDemo';
import ProductShowcase from './components/ProductShowcase';
import Waitlist from './components/Waitlist';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
// import DataStats from './components/DataStats'; // Commented out as requested
import SingleStatShowcase from './components/SingleStatShowcase'; // New component
// import Testimonials from './components/Testimonials';
import FeaturesShowcase from './components/FeaturesShowcase';
import VideoModal from './components/VideoModal';
import AboutPage from './components/AboutPage'; 
import SurveyPage from './components/SurveyPage'; // Import Survey Page
import HowItWorks from './components/HowItWorks';
import GDPRBanner from './components/GDPRBanner'; // Import GDPR Banner

// Legal Pages
import LegalNotice from './components/LegalNotice';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import AccessibilityStatement from './components/AccessibilityStatement';

import { AnimatePresence, motion } from 'framer-motion';
import { Ghost, Radio } from 'lucide-react';

// Define the View Type including new legal pages
type ViewState = 'home' | 'about' | 'survey' | 'legal-notice' | 'privacy' | 'terms' | 'accessibility';

// --- MEMOIZED COMPONENTS ---
// Wrapping heavy components to prevent re-renders when parent state (like 'role') changes but props don't.
const MemoizedNavbar = memo(Navbar);
const MemoizedHero = memo(Hero);
const MemoizedParticleBackground = memo(ParticleBackground);
const MemoizedHowItWorks = memo(HowItWorks);
const MemoizedFeaturesShowcase = memo(FeaturesShowcase);
const MemoizedProductShowcase = memo(ProductShowcase);
const MemoizedInteractiveDemo = memo(InteractiveDemo);
const MemoizedSingleStatShowcase = memo(SingleStatShowcase);
const MemoizedWaitlist = memo(Waitlist);
const MemoizedFooter = memo(Footer);

const FloatingRoleToggle: React.FC<{ role: 'streamer' | 'viewer', setRole: (r: 'streamer' | 'viewer') => void }> = ({ role, setRole }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const toggleSection = document.getElementById('choose-player');
      const endSection = document.getElementById('how-it-works');

      if (!toggleSection || !endSection) return;

      const toggleRect = toggleSection.getBoundingClientRect();
      const endRect = endSection.getBoundingClientRect();

      // Show when the bottom of the main toggle section leaves the viewport (scrolled past)
      // And hide when the top of How It Works enters the viewport (arrived at static content)
      const scrolledPastToggle = toggleRect.bottom < 0;
      const reachedEnd = endRect.top < window.innerHeight;

      setIsVisible(scrolledPastToggle && !reachedEnd);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // WRAPPER: Handles Fixed Positioning & Centering statically to avoid Framer Motion conflicts
    // Changed top-1/2 to top-[50vh] to ensure viewport-relative positioning even if parent has transforms
    <div className="fixed top-[50vh] right-0 md:right-auto md:left-6 z-40 -translate-y-1/2 pointer-events-none">
        <AnimatePresence>
        {isVisible && (
            <motion.div
                // Use Motion for entrance/exit (X-axis) only. 
                // Vertical position is handled by the parent wrapper.
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-auto flex flex-col items-center p-1 md:p-1.5 rounded-l-2xl rounded-r-none md:rounded-full bg-[#0A0A0B]/80 backdrop-blur-xl border-y border-l border-white/10 md:border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
            >
            {/* Active Pill Background */}
            <motion.div
                className={`absolute left-1 right-0 md:left-1.5 md:right-1.5 rounded-l-xl rounded-r-none md:rounded-full z-0 ${role === 'streamer' ? 'bg-violet-600' : 'bg-orange-500'}`}
                initial={false}
                animate={{
                    y: role === 'streamer' ? 0 : '100%',
                    height: 'calc(50% - 4px)' 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{ top: 2 }} // Tighter offset for thinner look
            />

            <button 
                onClick={() => setRole('streamer')}
                className={`relative z-10 w-7 md:w-10 py-4 md:py-6 rounded-l-xl rounded-r-none md:rounded-full flex flex-col items-center justify-center gap-2 transition-colors duration-300 ${role === 'streamer' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                title="Streamer Mode"
            >
                <Radio size={14} className={`md:w-4 md:h-4 ${role === 'streamer' ? 'animate-pulse' : ''}`} />
                {/* Vertical Text - Centered properly */}
                <div className="hidden md:flex items-center justify-center h-20 w-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest whitespace-nowrap origin-center" style={{ transform: 'rotate(-90deg)' }}>
                        Streamer
                    </span>
                </div>
            </button>

            <button 
                onClick={() => setRole('viewer')}
                className={`relative z-10 w-7 md:w-10 py-4 md:py-6 rounded-l-xl rounded-r-none md:rounded-full flex flex-col items-center justify-center gap-2 transition-colors duration-300 ${role === 'viewer' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                title="Viewer Mode"
            >
                <div className="hidden md:flex items-center justify-center h-20 w-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest whitespace-nowrap origin-center" style={{ transform: 'rotate(-90deg)' }}>
                        Viewer
                    </span>
                </div>
                <Ghost size={14} className="md:w-4 md:h-4" />
            </button>
            </motion.div>
        )}
        </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  // UI State: Updates instantly for responsive buttons
  const [role, setRole] = useState<'streamer' | 'viewer'>('streamer');
  
  // Content State: Updates via Transition to prevent UI freeze
  const [contentRole, setContentRole] = useState<'streamer' | 'viewer'>('streamer');
  const [isPending, startTransition] = useTransition();

  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const pendingScrollRef = useRef<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [isCookieBannerOpen, setIsCookieBannerOpen] = useState(false);

  // Sync contentRole with role using transition
  useEffect(() => {
    startTransition(() => {
      setContentRole(role);
    });
  }, [role]);

  // Consolidated Navigation Handler - Memoized to prevent Navbar re-renders
  const handleNavigation = useCallback((view: ViewState, id?: string) => {
      // Case 1: Already on the view, just scroll to ID
      if (currentView === view) {
          if (id) {
              const element = document.getElementById(id);
              if (element) element.scrollIntoView({ behavior: 'smooth' });
          } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
          }
      } 
      // Case 2: Changing view
      else {
          if (id) {
              pendingScrollRef.current = id; // Set intent
          }
          setCurrentView(view); // Trigger view change
      }
  }, [currentView]);

  // Callbacks for memoized components
  const handleOpenVideo = useCallback(() => setIsVideoOpen(true), []);
  const handleCloseVideo = useCallback(() => setIsVideoOpen(false), []);
  const handleJoinSurvey = useCallback((email: string) => { 
        if (email) setUserEmail(email); 
        setCurrentView('survey'); 
  }, []);
  const handleOpenCookieSettings = useCallback(() => setIsCookieBannerOpen(true), []);

  // Effect to handle scrolling logic after view changes
  useEffect(() => {
      // Check if we have a pending scroll target from the navigation action
      const scrollTargetId = pendingScrollRef.current;
      
      if (scrollTargetId) {
          // Clear the ref immediately so future renders don't use it
          pendingScrollRef.current = null;

          // WAIT for AnimatePresence to finish exiting the old view (duration is ~0.5s)
          // We set 600ms to be safe, ensuring the new DOM is mounted.
          const timer = setTimeout(() => {
              const element = document.getElementById(scrollTargetId);
              if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
              }
          }, 600); 
          return () => clearTimeout(timer);
      } else {
          // Standard page transition - scroll to top
          window.scrollTo(0, 0);
      }
  }, [currentView]);

  // Handle View Rendering
  const renderView = () => {
    switch(currentView) {
      case 'about':
        return (
          <motion.div key="about" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
             <AboutPage 
                onBack={() => setCurrentView('home')} 
                onNavigate={(view, id) => handleNavigation(view, id)}
             />
          </motion.div>
        );
      case 'survey':
        return (
          <motion.div key="survey" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.5 }} className="min-h-screen z-50 relative">
             <SurveyPage onExit={() => setCurrentView('home')} initialEmail={userEmail} />
          </motion.div>
        );
      case 'legal-notice':
        return (
           <motion.div key="legal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              <LegalNotice onBack={() => setCurrentView('home')} />
           </motion.div>
        );
      case 'privacy':
        return (
           <motion.div key="privacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              <PrivacyPolicy onBack={() => setCurrentView('home')} />
           </motion.div>
        );
      case 'terms':
        return (
           <motion.div key="terms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              <TermsOfService onBack={() => setCurrentView('home')} />
           </motion.div>
        );
      case 'accessibility':
        return (
           <motion.div key="access" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              <AccessibilityStatement onBack={() => setCurrentView('home')} />
           </motion.div>
        );
      case 'home':
      default:
        return (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              <MemoizedHero onOpenVideo={handleOpenVideo} />
              {/* Pass contentRole to heavy sections to delay their update */}
              <ProblemStatement role={contentRole} />
              
              {/* ExperienceToggle needs instant feedback for the pill, but might render heavy content. 
                  We pass 'role' (instant) for the pill/buttons, but consider separating internal content if needed.
                  For now, let's keep it responsive. */}
              <ExperienceToggle role={role} setRole={setRole} />
              
              {/* FloatingRoleToggle moved to root App level to fix positioning context */}
              <ProblemSection role={contentRole} />
              <SolutionSection role={contentRole} />
              
              <MemoizedHowItWorks />
              <MemoizedFeaturesShowcase />
              <MemoizedProductShowcase />
              <MemoizedInteractiveDemo />
              <MemoizedSingleStatShowcase />
              <MemoizedWaitlist onJoinSurvey={handleJoinSurvey} />
          </motion.div>
        );
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-cosmic-950 text-white selection:bg-cyan-500/30 overflow-x-hidden">
      <MemoizedParticleBackground />
      <GDPRBanner 
        forceOpen={isCookieBannerOpen} 
        onCloseForce={() => setIsCookieBannerOpen(false)} 
      />
      
      {/* Navbar Logic - Using handleNavigation for consistent behavior */}
      {(currentView === 'home' || currentView === 'about') && (
        <MemoizedNavbar 
          currentView={currentView}
          onNavigate={(view, id) => handleNavigation(view as any, id)} 
        />
      )}

      {/* 
          Moved FloatingRoleToggle here (outside of motion.div) 
          to ensure fixed positioning works relative to viewport 
      */}
      {currentView === 'home' && (
         <FloatingRoleToggle role={role} setRole={setRole} />
      )}
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </main>

      {/* Show Footer only on Home/About/Legal pages, generally hidden on full-screen flows like Survey */}
      {currentView !== 'survey' && (
        <MemoizedFooter 
            onNavigate={(view) => setCurrentView(view)} 
            onOpenCookieSettings={handleOpenCookieSettings}
        />
      )}
      
      <VideoModal isOpen={isVideoOpen} onClose={handleCloseVideo} />
    </div>
  );
};

export default App;
