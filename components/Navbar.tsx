
import React, { useState, useEffect, useRef } from 'react';
import { ClipboardList, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
    currentView?: 'home' | 'about' | 'survey';
    onNavigate?: (view: 'home' | 'about' | 'survey') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView = 'home', onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 1. Handle Background State
      setScrolled(currentScrollY > 50);

      // 2. Handle Visibility (Hide on scroll down, Show on scroll up)
      if (currentScrollY < lastScrollYRef.current) {
        // Scrolling UP -> Show
        setIsVisible(true);
      } else if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
        // Scrolling DOWN and past threshold -> Hide
        setIsVisible(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (view: 'home' | 'about' | 'survey', id?: string) => {
      if (onNavigate) onNavigate(view);
      setMobileMenuOpen(false);
      
      if (view === 'home' && id) {
          setTimeout(() => {
              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
      }
  };

  const navItemVariants = {
      hidden: { opacity: 0, y: -10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "circOut" } }
  };

  return (
    <>
        <nav
          className={`fixed top-0 left-0 w-full z-50 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          {/* Background Layer with Fade Out Mask */}
          <div 
            className={`absolute inset-0 transition-opacity duration-700 ease-out pointer-events-none ${
               scrolled || mobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
          >
              <div 
                  className="absolute inset-0 bg-[#05040a]/90 backdrop-blur-md"
                  style={{
                      maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
                  }}
              />
              {/* Subtle top edge definition */}
              <div className="absolute top-0 left-0 w-full h-px bg-white/5" />
          </div>

          {/* Content Container */}
          <div className="container mx-auto px-6 py-0 flex justify-between items-center h-20 md:h-28 relative z-50">
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
                className="flex items-center cursor-pointer group h-full" 
                onClick={() => handleNav('home')}
            >
              {/* Logo fills the height of the container - Minimized padding for maximum mobile logo size */}
              <div className="relative h-full transition-transform duration-300 group-hover:scale-105 origin-left py-1 md:py-2">
                 <img 
                  src="https://raw.githubusercontent.com/cavanjuice/assets/main/Logo2.png" 
                  alt="Streamyst" 
                  className="h-full w-auto object-contain" 
                />
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 md:gap-10">
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
                    className="flex items-center space-x-8"
                >
                  <motion.button 
                    variants={navItemVariants}
                    onClick={() => handleNav('home', 'choose-player')} 
                    className={`text-base font-bold tracking-tight hover:text-white transition-colors duration-300 ${currentView === 'home' ? 'text-white' : 'text-gray-400'}`}
                  >
                      Experience
                  </motion.button>
                  
                  <motion.button 
                    variants={navItemVariants}
                    onClick={() => handleNav('about')}
                    className={`text-base font-bold tracking-tight hover:text-white transition-colors duration-300 ${currentView === 'about' ? 'text-white' : 'text-gray-400'}`}
                  >
                      About Us
                  </motion.button>

                  <motion.button 
                    variants={navItemVariants}
                    onClick={() => handleNav('survey')}
                    className={`text-base font-bold tracking-tight hover:text-violet-400 transition-colors duration-300 ${currentView === 'survey' ? 'text-violet-400' : 'text-gray-400'}`}
                  >
                      Beta Survey
                  </motion.button>
                </motion.div>

                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5, ease: "backOut" }}
                  onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-full font-bold transition-all duration-500 shadow-lg shadow-violet-900/20 hover:shadow-violet-600/40 hover:-translate-y-0.5 whitespace-nowrap px-7 py-3 text-base"
                >
                  I WANT THIS
                </motion.button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden items-center gap-4">
                <motion.button 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full font-bold text-xs px-4 py-2 shadow-lg shadow-violet-900/20"
                >
                    GET ACCESS
                </motion.button>
                <motion.button 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-[#05040a] border-b border-white/10 overflow-hidden absolute top-20 left-0 w-full z-40 shadow-2xl"
                >
                    <div className="flex flex-col p-6 space-y-6">
                        <button 
                            onClick={() => handleNav('home', 'choose-player')}
                            className={`text-lg font-bold text-left ${currentView === 'home' ? 'text-white' : 'text-gray-400'}`}
                        >
                            Experience
                        </button>
                        <button 
                            onClick={() => handleNav('about')}
                            className={`text-lg font-bold text-left ${currentView === 'about' ? 'text-white' : 'text-gray-400'}`}
                        >
                            About Us
                        </button>
                        <button 
                            onClick={() => handleNav('survey')}
                            className={`text-lg font-bold text-left ${currentView === 'survey' ? 'text-violet-400' : 'text-gray-400'}`}
                        >
                            Beta Survey
                        </button>
                        <div className="h-px bg-white/10 w-full" />
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-gray-500 uppercase tracking-widest">Connect</span>
                            <div className="flex gap-4">
                                {/* Social placeholders */}
                                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                                <a href="#" className="text-gray-400 hover:text-white">Discord</a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Small Striking Floating Button - Appears when Navbar hides */}
        <button
            onClick={() => handleNav('survey')}
            className={`fixed top-4 right-4 md:top-6 md:right-6 z-40 flex items-center gap-3 pl-4 pr-5 py-2.5 rounded-full bg-[#0A0A0B] border border-violet-500/50 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transform hover:scale-105 hover:border-violet-400 hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] ${
               !isVisible && !mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-32 opacity-0 pointer-events-none'
            }`}
        >
            <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <ClipboardList size={16} className="relative z-10 text-violet-200" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-violet-100">
                Beta Survey
            </span>
        </button>
    </>
  );
};

export default Navbar;
    