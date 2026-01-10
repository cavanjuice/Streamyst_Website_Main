
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeOff, MessageSquare, Settings, Frown, Ghost, Lock, BatteryWarning, MonitorStop } from 'lucide-react';

type Role = 'streamer' | 'viewer';

interface ExperienceToggleProps {
  role: Role;
  setRole: (role: Role) => void;
}

const SpotlightCard: React.FC<{ children: React.ReactNode; index: number; className?: string }> = ({ children, index, className = "" }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-white/5 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
};

const ExperienceToggle: React.FC<ExperienceToggleProps> = ({ role, setRole }) => {

  const problems = {
    streamer: {
      title: "Streaming should be connective",
      description: "Whether you're big or small, you're pouring your heart into every stream, but the digital barrier still keeps you from truly feeling your community.",
      items: [
        { Icon: EyeOff, title: "Not feeling seen", desc: "Discovery and growth are limited" },
        { Icon: MessageSquare, title: "Chat overload", desc: "Messages flying by faster than you can read them" },
        { Icon: Settings, title: "Complex setups", desc: "Interactive tools require complicated setups" },
        { Icon: Frown, title: "Missed moments", desc: "Unable to feel the energy of epic chat reactions" }
      ]
    },
    viewer: {
      title: "Streaming Should Be Connected",
      description: "You're trying your best to be part of the stream, but the digital barrier keeps you from truly connecting with the Creators.",
      items: [
        { Icon: Ghost, title: "Lost in the crowd", desc: "Chat goes so fast, you feel invisible and anonymous" },
        { Icon: Lock, title: "Limited agency", desc: "You want to participate but can't fully be a meaningful part" },
        { Icon: BatteryWarning, title: "Social Fatigue", desc: "Not easy to find the streaming community that fits you" },
        { Icon: MonitorStop, title: "Interrupted", desc: "Ads really break the immersion of the experience" }
      ]
    }
  };

  const streamerImage = "https://raw.githubusercontent.com/cavanjuice/assets/main/wearable_.png";
  const viewerImage = "https://raw.githubusercontent.com/cavanjuice/assets/main/IMG_20250504_121801.png";

  const currentProblem = role === 'streamer' ? problems.streamer : problems.viewer;

  return (
    <section id="choose-player" className="py-12 md:py-16 relative z-10 overflow-hidden bg-black/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)] pointer-events-none" />
      
      {/* SVG Definitions for Gradients */}
      <svg width="0" height="0" className="absolute pointer-events-none">
          <defs>
              <linearGradient id="grad-streamer" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
              <linearGradient id="grad-viewer" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#f87171" />
              </linearGradient>
          </defs>
      </svg>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* 1. TITLE & DESCRIPTION */}
        <div className="text-center max-w-4xl mx-auto mb-4 relative z-20">
             <motion.div 
                key={role}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
             >
                <h2 className="font-display font-bold text-3xl md:text-5xl mb-3 leading-tight">
                    {currentProblem.title}
                </h2>
                <p className="text-gray-400 text-sm md:text-lg leading-relaxed font-light max-w-2xl mx-auto">
                    {currentProblem.description}
                </p>
             </motion.div>
        </div>

        {/* 2. HERO VISUALS (Centerpiece - Fighter Style) */}
        <div className="relative h-[200px] md:h-[280px] w-full max-w-2xl mx-auto mb-8 flex items-end justify-center perspective-1000 mt-2">
             
             {/* Center Glow based on Active Role */}
             <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[180px] h-[180px] rounded-full blur-[80px] transition-colors duration-500 ${role === 'streamer' ? 'bg-violet-600/30' : 'bg-orange-600/30'}`} />

             {/* VIEWER IMAGE (Left Side - Right aligned to center) */}
             <motion.div
                className="absolute bottom-0 right-[50%] w-[140px] md:w-[210px] origin-bottom-right cursor-pointer"
                style={{ marginRight: '-45px' }} 
                animate={{
                    scale: role === 'viewer' ? 1.01 : 0.99, // Extremely subtle scale
                    x: role === 'viewer' ? 4 : -4, // Very minimal movement
                    opacity: role === 'viewer' ? 1 : 0.5,
                    filter: role === 'viewer' 
                        ? 'grayscale(0%) brightness(1.1) drop-shadow(0 0 20px rgba(249,115,22,0.3)) blur(0px)' 
                        : 'grayscale(100%) brightness(0.6) blur(2px)', 
                    zIndex: role === 'viewer' ? 20 : 10,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                onClick={() => setRole('viewer')}
             >
                <img 
                    src={viewerImage} 
                    alt="Viewer" 
                    className="w-full h-full object-contain"
                    style={{
                        maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                    }}
                />
             </motion.div>

             {/* STREAMER IMAGE (Right Side - Left aligned to center) */}
             <motion.div
                className="absolute bottom-0 left-[50%] w-[140px] md:w-[210px] origin-bottom-left cursor-pointer"
                style={{ marginLeft: '-45px' }}
                animate={{
                    scale: role === 'streamer' ? 1.01 : 0.99, // Extremely subtle scale
                    x: role === 'streamer' ? -4 : 4, // Very minimal movement
                    opacity: role === 'streamer' ? 1 : 0.5,
                    filter: role === 'streamer' 
                        ? 'grayscale(0%) brightness(1.1) drop-shadow(0 0 20px rgba(139,92,246,0.3)) blur(0px)' 
                        : 'grayscale(100%) brightness(0.6) blur(2px)',
                    zIndex: role === 'streamer' ? 20 : 10,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                onClick={() => setRole('streamer')}
             >
                <img 
                    src={streamerImage} 
                    alt="Streamer" 
                    className="w-full h-full object-contain"
                    style={{
                        maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                    }}
                />
             </motion.div>

        </div>

        {/* 3. TOGGLE BUTTON (Control) */}
        <div className="flex justify-center mb-8 relative z-20">
             <div className="relative inline-flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md shadow-2xl overflow-hidden scale-90 md:scale-100">
                 <motion.div 
                   className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r rounded-full z-0`}
                   layout
                   animate={{ 
                       left: role === 'streamer' ? 4 : 'calc(50% + 0px)',
                       backgroundImage: role === 'streamer' ? 'linear-gradient(to right, #8b5cf6, #4f46e5)' : 'linear-gradient(to right, #f97316, #dc2626)',
                       boxShadow: role === 'streamer' 
                        ? "0 0 20px rgba(139,92,246,0.5)" 
                        : "0 0 20px rgba(249,115,22,0.5)"
                   }}
                   transition={{ type: "spring", stiffness: 400, damping: 30 }}
                 />
                 
                 <button
                   onClick={() => setRole('streamer')}
                   className={`relative z-10 px-8 py-2.5 rounded-full font-bold font-display tracking-[0.1em] transition-colors duration-300 w-36 md:w-44 text-[10px] md:text-xs ${role === 'streamer' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                 >
                   STREAMER
                 </button>
                 <button
                   onClick={() => setRole('viewer')}
                   className={`relative z-10 px-8 py-2.5 rounded-full font-bold font-display tracking-[0.1em] transition-colors duration-300 w-36 md:w-44 text-[10px] md:text-xs ${role === 'viewer' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                 >
                   VIEWER
                 </button>
             </div>
        </div>

        {/* 4. CONTENT & DETAILS */}
        <div className="relative max-w-6xl mx-auto">
             <AnimatePresence mode="wait">
                <motion.div 
                    key={role}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                >
                    {/* Problem Cards with Spotlight Effect */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                        {currentProblem.items.map((item, i) => (
                            <SpotlightCard key={i} index={i} className="p-5 backdrop-blur-sm">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${role === 'streamer' ? 'bg-violet-500/10' : 'bg-orange-500/10'}`}>
                                    <item.Icon 
                                        className="w-5 h-5" 
                                        style={{ stroke: role === 'streamer' ? "url(#grad-streamer)" : "url(#grad-viewer)" }} 
                                    />
                                </div>
                                <h3 className="font-bold text-base text-white mb-1.5">{item.title}</h3>
                                <p className="text-gray-400 text-[11px] leading-relaxed">{item.desc}</p>
                            </SpotlightCard>
                        ))}
                    </div>
                </motion.div>
             </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ExperienceToggle;
