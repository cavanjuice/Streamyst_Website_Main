
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ExperienceToggle from './components/ExperienceToggle';
import InteractiveDemo from './components/InteractiveDemo';
import ProductShowcase from './components/ProductShowcase';
import Waitlist from './components/Waitlist';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import DataStats from './components/DataStats';
import Testimonials from './components/Testimonials';
import FeaturesShowcase from './components/FeaturesShowcase';
import VideoModal from './components/VideoModal';
import AboutPage from './components/AboutPage'; 
import SurveyPage from './components/SurveyPage'; // Import Survey Page
import HowItWorks from './components/HowItWorks';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [role, setRole] = useState<'streamer' | 'viewer'>('streamer');
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'survey'>('home');

  // Scroll to top when view changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  return (
    <div className="min-h-screen relative bg-cosmic-950 text-white overflow-hidden selection:bg-cyan-500/30">
      <ParticleBackground />
      {/* Hide Navbar on survey page to reduce distraction, or keep it. Keeping it for navigation continuity but simplified. */}
      {currentView !== 'survey' && <Navbar currentView={currentView} onNavigate={setCurrentView} />}
      
      <main>
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
                <ExperienceToggle role={role} setRole={setRole} />
                <ProblemSection role={role} />
                <SolutionSection role={role} />
                <HowItWorks />
                <FeaturesShowcase />
                <ProductShowcase />
                <InteractiveDemo />
                <DataStats />
                <Testimonials />
                <Waitlist onJoinSurvey={() => setCurrentView('survey')} />
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
                <SurveyPage onExit={() => setCurrentView('home')} />
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
