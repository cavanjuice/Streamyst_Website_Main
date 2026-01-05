
import React, { useState, useEffect } from 'react';

interface NavbarProps {
    currentView?: 'home' | 'about' | 'survey';
    onNavigate?: (view: 'home' | 'about' | 'survey') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView = 'home', onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (view: 'home' | 'about' | 'survey', id?: string) => {
      if (onNavigate) onNavigate(view);
      
      if (view === 'home' && id) {
          // Allow time for state switch if needed, then scroll
          setTimeout(() => {
              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
      }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        scrolled 
          ? 'bg-[#05040a]/90 backdrop-blur-xl py-3 shadow-2xl shadow-violet-900/20' 
          : 'bg-transparent py-8 md:py-10'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center cursor-pointer group" onClick={() => handleNav('home')}>
          <div className={`relative transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${scrolled ? 'h-10' : 'h-14 md:h-16'}`}>
             <img 
              src="https://raw.githubusercontent.com/cavanjuice/assets/main/logostreamyst.png" 
              alt="Streamyst" 
              className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105 origin-left" 
            />
          </div>
        </div>

        <div className="flex items-center gap-6 md:gap-10">
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => handleNav('home', 'choose-player')} 
                className={`font-bold tracking-tight hover:text-white transition-all duration-300 ${scrolled ? 'text-xs uppercase' : 'text-base'} ${currentView === 'home' ? 'text-white' : 'text-gray-400'}`}
              >
                  Experience
              </button>
              
              <button 
                onClick={() => handleNav('about')}
                className={`font-bold tracking-tight hover:text-white transition-all duration-300 ${scrolled ? 'text-xs uppercase' : 'text-base'} ${currentView === 'about' ? 'text-white' : 'text-gray-400'}`}
              >
                  About Us
              </button>

              <button 
                onClick={() => handleNav('survey')}
                className={`font-bold tracking-tight hover:text-cyan-400 transition-all duration-300 ${scrolled ? 'text-xs uppercase' : 'text-base'} ${currentView === 'survey' ? 'text-cyan-400' : 'text-gray-400'}`}
              >
                  Beta Survey
              </button>
            </div>

            <button 
              onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
              className={`
                bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-full font-bold transition-all duration-500 shadow-lg shadow-violet-900/20 hover:shadow-violet-600/40 hover:-translate-y-0.5 whitespace-nowrap
                ${scrolled ? 'px-5 py-2 text-xs tracking-wider uppercase' : 'px-7 py-3 text-base'}
              `}
            >
              I WANT THIS
            </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
