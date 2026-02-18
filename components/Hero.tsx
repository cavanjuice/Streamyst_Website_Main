
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, ChevronRight } from 'lucide-react';
import { SupabaseImg } from './SupabaseImg';
import { trackEvent } from '../utils/supabaseClient';

// --- MAIN HERO COMPONENT ---

interface HeroProps {
  onOpenVideo: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenVideo }) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };

    const checkMobile = () => {
        setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleJoinWaitlist = () => {
      trackEvent('cta_click', { location: 'hero', button: 'join_waitlist' });
      document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWatchDemo = () => {
      trackEvent('cta_click', { location: 'hero', button: 'watch_demo' });
      onOpenVideo();
  };

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden flex flex-col bg-cosmic-950">
        {/* Clean background - No Gradients */}

        <div className="container mx-auto px-6 lg:px-12 relative z-10 h-full max-w-6xl">
            {/* 
               LAYOUT STRATEGY CHANGE:
               Mobile: Flex Column. Image takes top portion (38%), Content takes bottom space.
               Desktop: Grid with 2 columns.
            */}
            <div className="relative h-full w-full flex flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 pt-16 lg:pt-24">
                
                {/* --- IMAGE SECTION --- */}
                {/* Reduced height on mobile to 38vh to leave more room for text below */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "circOut" }}
                    className="relative w-full h-[38vh] lg:h-auto lg:order-2 flex items-end lg:items-center justify-center z-0 lg:z-10 shrink-0"
                >
                    <div className="relative w-full h-full flex items-end lg:items-center justify-center lg:justify-end pb-0 lg:pb-0">
                         {/* Asset Wrapper */}
                         <div 
                             className="relative z-10 w-full h-full max-h-[600px] lg:max-h-[60vh] lg:max-w-[400px] xl:max-w-[450px] flex items-end lg:items-center justify-center"
                             style={{
                                 // Subtle fade at bottom to blend with text section on mobile
                                 maskImage: isMobile 
                                    ? 'linear-gradient(to bottom, black 60%, transparent 100%)'
                                    : 'linear-gradient(to bottom, black 80%, transparent 100%)',
                                 WebkitMaskImage: isMobile 
                                    ? 'linear-gradient(to bottom, black 60%, transparent 100%)'
                                    : 'linear-gradient(to bottom, black 80%, transparent 100%)'
                             }}
                         >
                             <SupabaseImg 
                               filename="DSC006262.webp"
                               alt="Streamyst Wearable Tech"
                               className="relative z-10 h-full w-auto object-contain object-bottom lg:object-center animate-float"
                               // @ts-ignore
                               fetchPriority="high"
                               loading="eager"
                             />
                         </div>
                    </div>
                </motion.div>

                {/* --- TEXT SECTION --- */}
                {/* Mobile: Pushed up with negative margin to blend. Tightened vertical spacing. */}
                <div className="relative z-20 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left flex-1 lg:flex-none justify-start lg:justify-center -mt-6 lg:mt-0 pt-2 lg:pt-0">
                    
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-3 lg:mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                    >
                        <Sparkles className="w-3 h-3 text-violet-400 animate-pulse" />
                        <span className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-violet-100 uppercase">The Next Evolution of Livestreaming</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="font-display font-bold text-4xl sm:text-5xl lg:text-5xl xl:text-6xl leading-[1.1] mb-3 lg:mb-6 tracking-tight"
                    >
                        Connect to your audience. <br className="hidden lg:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-300 to-indigo-400 text-glow">
                            In Real-Time.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="font-body text-sm sm:text-base lg:text-base xl:text-lg text-gray-400 max-w-lg mb-6 lg:mb-10 leading-relaxed font-light px-4 lg:px-0"
                    >
                        STREAMYST transforms emotional reactions into physical sensations. Don't just read the chat, <span className="text-white font-medium">feel the room</span>.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-row items-center gap-3 w-full justify-center lg:justify-start"
                    >
                        <button
                            onClick={handleJoinWaitlist}
                            className="group relative px-5 py-3 md:px-6 md:py-3 bg-white text-cosmic-950 font-bold text-xs sm:text-sm lg:text-base rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.35)] overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:translate-x-1 transition-transform">
                                Join the Waitlist <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>

                        <button
                            onClick={handleWatchDemo}
                            className="relative px-5 py-3 md:px-6 md:py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm lg:text-base rounded-full transition-all duration-300 flex items-center justify-center gap-2 group backdrop-blur-sm"
                        >
                             <div className="relative flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/10 border border-white/20 group-hover:border-violet-400 transition-colors">
                                <span className="absolute w-full h-full rounded-full bg-violet-500/30 animate-ping opacity-0 group-hover:opacity-100" />
                                <Play className="w-1.5 h-1.5 sm:w-2 sm:h-2 fill-white relative z-10 ml-0.5" />
                             </div>
                            <span>Watch Demo</span>
                        </button>
                    </motion.div>
                </div>

            </div>

            {/* Scroll Hint (Desktop) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hasScrolled ? 0 : 1 }}
                transition={{ delay: hasScrolled ? 0 : 1.5, duration: hasScrolled ? 0.3 : 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 hidden md:flex flex-col items-center gap-2 pointer-events-none"
            >
                <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-medium">Scroll</span>
                <div className="w-[1px] h-12 bg-white/10 relative overflow-hidden">
                    <motion.div 
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-violet-400 to-transparent"
                    />
                </div>
            </motion.div>

            {/* Scroll Hint (Mobile) */}
            <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: hasScrolled ? 0 : 1 }}
                 transition={{ delay: hasScrolled ? 0 : 1.5, duration: hasScrolled ? 0.3 : 1 }}
                 className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 md:hidden flex flex-col items-center pointer-events-none"
            >
                 <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center p-1.5 backdrop-blur-sm">
                     <motion.div 
                         animate={{ y: [0, 8, 0] }}
                         transition={{ duration: 1.5, repeat: Infinity }}
                         className="w-1 h-1 bg-white rounded-full"
                     />
                 </div>
            </motion.div>
        </div>
    </section>
  );
};

export default Hero;
