
import React, { useState, useEffect } from 'react';
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
import { AnimatePresence, motion } from 'framer-motion';
import { Ghost, Radio } from 'lucide-react';

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
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          // Mobile: Right side flush (right-0), thinner padding, tab shape. 
          // Desktop: Left side floating (left-6), full padding, pill shape.
          className="fixed right-0 md:right-auto md:left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center p-1 md:p-1.5 rounded-l-2xl rounded-r-none md:rounded-full bg-[#0A0A0B]/80 backdrop-blur-xl border-y border-l border-white/10 md:border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
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
  );
};

const App: React.FC = () => {
  const [role, setRole] = useState<'streamer' | 'viewer'>('streamer');
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'survey'>('home');
  const [userEmail, setUserEmail] = useState('');

  // Scroll to top when view changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  return (
    <div className="relative w-full min-h-screen bg-cosmic-950 text-white selection:bg-cyan-500/30 overflow-x-hidden">
      <ParticleBackground />
      {/* Hide Navbar on survey page to reduce distraction, or keep it. Keeping it for navigation continuity but simplified. */}
      {currentView !== 'survey' && <Navbar currentView={currentView} onNavigate={setCurrentView} />}
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {currentView === 'home' ? (
            <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Hero onOpenVideo={() => setIsVideoOpen(true)} />
                <ProblemStatement role={role} />
                <ExperienceToggle role={role} setRole={setRole} />
                
                {/* Floating Toggle appears between ExperienceToggle and HowItWorks */}
                <FloatingRoleToggle role={role} setRole={setRole} />

                <ProblemSection role={role} />
                <SolutionSection role={role} />
                <HowItWorks />
                <FeaturesShowcase />
                <ProductShowcase />
                <InteractiveDemo />
                {/* <DataStats /> */}
                <SingleStatShowcase />
                {/* <Testimonials /> */}
                <Waitlist onJoinSurvey={(email) => { 
                    if (email) setUserEmail(email);
                    setCurrentView('survey'); 
                }} />
            </motion.div>
          ) : currentView === 'about' ? (
            <motion.div
                key="about"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
            >
                <AboutPage onBack={() => setCurrentView('home')} />
            </motion.div>
          ) : (
            <motion.div
                key="survey"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen z-50 relative"
            >
                <SurveyPage onExit={() => setCurrentView('home')} initialEmail={userEmail} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {currentView !== 'survey' && <Footer onNavigate={setCurrentView} />}
      
      {/* Global Modals */}
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </div>
  );
};

export default App;
