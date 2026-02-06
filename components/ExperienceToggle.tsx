import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeOff, MessageSquare, Settings, Frown, Ghost, Lock, BatteryWarning, MonitorStop } from 'lucide-react';
import { SupabaseImg } from './SupabaseImg';
import { getAssetUrl, trackEvent } from '../utils/supabaseClient';

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
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      <div className="relative h-full flex flex-col">{children}</div>
    </div>
  );
};

const ExperienceToggle: React.FC<ExperienceToggleProps> = ({ role, setRole }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Preload images to prevent flickering when switching roles
  useEffect(() => {
    const imagesToPreload = [
        getAssetUrl("streamersad.webp"),
        getAssetUrl("viewersad.webp")
    ];
    imagesToPreload.forEach(url => {
        const img = new Image();
        img.src = url;
    });
  }, []);

  const handleRoleChange = (newRole: Role) => {
      setRole(newRole);
      // Tracking occurs in parent or we can track here if needed, but parent tracks primary switch
  };

  const handleScroll = () => {
      if (scrollRef.current) {
          const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
          setActiveIndex(index);
      }
  };

  const problems = {
    streamer: {
      items: [
        { Icon: EyeOff, title: "Not feeling seen", desc: "Discovery and growth are limited" },
        { Icon: MessageSquare, title: "Chat overload", desc: "Messages flying by faster than you can read them" },
        { Icon: Settings, title: "Complex setups", desc: "Interactive tools require complicated setups" },
        { Icon: Frown, title: "Missed moments", desc: "Unable to feel the energy of epic chat reactions" }
      ]
    },
    viewer: {
      items: [
        { Icon: Ghost, title: "Lost in the crowd", desc: "Chat goes so fast, you feel invisible and anonymous" },
        { Icon: Lock, title: "Limited agency", desc: "You want to participate but can't fully be a meaningful part" },
        { Icon: BatteryWarning, title: "Social Fatigue", desc: "Not easy to find the streaming community that fits you" },
        { Icon: MonitorStop, title: "Interrupted", desc: "Ads really break the immersion of the experience" }
      ]
    }
  };

  const currentProblem = role === 'streamer' ? problems.streamer : problems.viewer;

  const statsData = {
    streamer: {
        title: "THE STREAMER",
        desc: "Separated by the screen. You read the chat, but you don't feel the energy.",
        bars: [
            { label: "CONNECTION", value: 30 },
            { label: "INTERACTION", value: 45 },
            { label: "IMMERSION", value: 20 }
        ],
        theme: "violet"
    },
    viewer: {
        title: "THE AUDIENCE",
        desc: "Lost in the noise. You want to participate but you don't feel like you can connect to your favourite creator.",
        bars: [
            { label: "INFLUENCE", value: 15 },
            { label: "VISIBILITY", value: 10 },
            { label: "IMMERSION", value: 25 }
        ],
        theme: "orange"
    }
  };

  const activeStats = statsData[role];

  // Auto-scroll logic for mobile
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Reset scroll position when role changes
    container.scrollTo({ left: 0 });
    setActiveIndex(0);

    // Clear any existing interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
        // Basic check: Only run if content overflows (mobile behavior)
        if (container.scrollWidth <= container.clientWidth) return;

        const currentScroll = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;

        // If we've reached the end (with small tolerance), stop scrolling
        if (currentScroll >= maxScroll - 10) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        // Calculate Target: Next card position
        let nextTarget = currentScroll;
        const children = Array.from(container.children) as HTMLElement[];
        
        // Find the first child that is fully to the right of current scroll
        for (let child of children) {
            if (child.offsetLeft > currentScroll + 10) {
                nextTarget = child.offsetLeft;
                break;
            }
        }
        
        if (nextTarget <= currentScroll) {
             nextTarget = currentScroll + container.clientWidth; 
        }
        if (nextTarget > maxScroll) nextTarget = maxScroll;


        // ANIMATION LOOP
        const startScroll = currentScroll;
        const distance = nextTarget - startScroll;
        const duration = 1500;
        const startTime = performance.now();

        container.style.scrollSnapType = 'none';

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            
            if (elapsed < duration) {
                const progress = elapsed / duration;
                const ease = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                container.scrollLeft = startScroll + (distance * ease);
                requestAnimationFrame(animate);
            } else {
                container.scrollLeft = nextTarget;
                container.style.scrollSnapType = 'x mandatory';
            }
        };
        
        requestAnimationFrame(animate);

    }, 5000);

    return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [role]);

  return (
    // Reduced padding and constrained min-height for desktop
    <section id="choose-player" className="py-12 lg:py-16 relative z-10 overflow-hidden bg-black/20 min-h-[100dvh] lg:min-h-[85vh] flex flex-col justify-center">
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

      <motion.div 
        className="container mx-auto px-6 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "circOut" }}
      >
        
        {/* 1. HEADER: VISUALS & STATS - Reduced width max-w-4xl */}
        <div className="max-w-4xl mx-auto w-full mb-8 md:mb-10">
            <AnimatePresence mode="wait">
                <motion.div 
                    key={role}
                    initial={{ opacity: 0, x: role === 'streamer' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: role === 'streamer' ? 20 : -20 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-row items-center justify-center gap-6 md:grid md:grid-cols-2 md:gap-12 lg:gap-16"
                >
                    {/* LEFT: CHARACTER IMAGE - Reduced height */}
                    <div className="relative w-56 h-72 sm:w-64 sm:h-80 md:w-full md:h-[260px] lg:h-[280px] flex items-center justify-center shrink-0 order-1 md:order-none">
                         {/* Background Glow - Scaled down */}
                         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[240px] md:h-[240px] rounded-full blur-[50px] lg:blur-[60px] opacity-40 ${role === 'streamer' ? 'bg-violet-600' : 'bg-orange-600'}`} />

                         <SupabaseImg 
                             filename={role === 'streamer' ? "streamersad.webp" : "viewersad.webp"}
                             alt={role}
                             className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_25px_rgba(0,0,0,0.6)] grayscale-[20%] contrast-125"
                         />
                    </div>

                    {/* RIGHT: STATS & CONTENT */}
                    <div className="relative z-10 order-2 md:order-none flex-1 min-w-0">
                        {/* Reduced Font Size for Header */}
                        <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-3 italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r ${role === 'streamer' ? 'from-white via-violet-200 to-indigo-400' : 'from-white via-orange-200 to-red-400'}`}>
                            {activeStats.title}
                        </h3>

                        {/* Reduced Font Size for Description */}
                        <p className="text-gray-400 text-xs sm:text-sm lg:text-sm leading-relaxed mb-5 lg:mb-6 max-w-md font-light line-clamp-4 md:line-clamp-none">
                            {activeStats.desc}
                        </p>

                        {/* Progress Bars - Scaled */}
                        <div className="space-y-3 lg:space-y-3 mb-0 max-w-sm">
                            {activeStats.bars.map((stat, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-end mb-1">
                                        {/* Smaller labels */}
                                        <span className="text-[10px] lg:text-[11px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
                                        <span className={`font-mono text-xs lg:text-xs font-bold ${role === 'streamer' ? 'text-violet-400' : 'text-orange-400'}`}>{stat.value}%</span>
                                    </div>
                                    <div className="h-1 lg:h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.value}%` }}
                                            transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: "circOut" }}
                                            className={`h-full rounded-full opacity-60 ${role === 'streamer' ? 'bg-violet-500' : 'bg-orange-500'}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>

        {/* 2. TOGGLE BUTTON - Scaled Down */}
        <div className="flex justify-center mb-10 md:mb-10 relative z-20">
             <div className="relative inline-flex p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                 
                 <motion.div 
                   className="absolute top-1 bottom-1 rounded-full border border-white/10 bg-white/5 pointer-events-none z-0"
                   initial={false}
                   animate={{ 
                       left: role === 'streamer' ? 'calc(100% - 4px)' : '4px',
                       x: role === 'streamer' ? '-100%' : '0%',
                       opacity: [0, 0.4, 0], 
                       scale: [0.95, 1.02, 0.95]
                   }}
                   transition={{ 
                       left: { type: "spring", stiffness: 300, damping: 30 },
                       x: { type: "spring", stiffness: 300, damping: 30 },
                       opacity: { duration: 3, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" },
                       scale: { duration: 3, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }
                   }}
                   style={{ 
                       width: 'calc(50% - 4px)'
                   }}
                 />

                 <motion.div 
                   className="absolute top-1 bottom-1 left-1 rounded-full z-0"
                   layout
                   initial={false}
                   animate={{ 
                       x: role === 'streamer' ? '0%' : '100%',
                       background: role === 'streamer' 
                        ? 'linear-gradient(to right, #8b5cf6, #4f46e5)' 
                        : 'linear-gradient(to right, #f97316, #dc2626)',
                   }}
                   transition={{ type: "spring", stiffness: 300, damping: 30 }}
                   style={{ 
                       width: 'calc(50% - 4px)',
                       boxShadow: role === 'streamer' 
                        ? '0 0 30px 2px rgba(139, 92, 246, 0.4)' 
                        : '0 0 30px 2px rgba(249, 115, 22, 0.4)' 
                   }}
                 />
                 
                 {/* BUTTONS - Reduced Width */}
                 <button
                   onClick={() => handleRoleChange('streamer')}
                   className={`relative z-10 w-32 md:w-36 lg:w-40 py-2 md:py-2.5 rounded-full font-bold font-display tracking-widest text-[10px] md:text-xs transition-colors duration-200 ${role === 'streamer' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                 >
                   STREAMER
                 </button>
                 <button
                   onClick={() => handleRoleChange('viewer')}
                   className={`relative z-10 w-32 md:w-36 lg:w-40 py-2 md:py-2.5 rounded-full font-bold font-display tracking-widest text-[10px] md:text-xs transition-colors duration-200 ${role === 'viewer' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                 >
                   VIEWER
                 </button>
             </div>
        </div>

        {/* 3. PROBLEM CARDS - Reduced Max Width for grid */}
        <div className="relative max-w-5xl mx-auto w-full">
             <AnimatePresence mode="wait">
                <motion.div 
                    key={role}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                >
                    <div 
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-4 scrollbar-hide"
                        style={{ scrollSnapType: 'x mandatory' }} 
                    >
                        {currentProblem.items.map((item, i) => (
                            <div key={i} className="min-w-full md:min-w-0 snap-center flex h-full">
                                {/* Reduced Padding in Cards */}
                                <SpotlightCard 
                                    index={i} 
                                    className="p-5 md:p-4 lg:p-4 backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-colors w-full h-full border-white/10 flex flex-col justify-center"
                                >
                                    {/* Reduced Icon Box Size */}
                                    <div className={`w-10 h-10 lg:w-9 lg:h-9 rounded-xl flex items-center justify-center mb-3 lg:mb-4 ${role === 'streamer' ? 'bg-violet-500/10' : 'bg-orange-500/10'}`}>
                                        <item.Icon 
                                            className="w-5 h-5 lg:w-4 lg:h-4" 
                                            style={{ stroke: role === 'streamer' ? "url(#grad-streamer)" : "url(#grad-viewer)" }} 
                                        />
                                    </div>
                                    <h3 className="font-bold text-base lg:text-sm text-white mb-2 leading-tight">{item.title}</h3>
                                    <p className="text-gray-400 text-xs lg:text-[11px] leading-relaxed">{item.desc}</p>
                                </SpotlightCard>
                            </div>
                        ))}
                    </div>
                    
                    {/* Mobile Navigation Hint */}
                    <div className="flex md:hidden justify-center gap-2 mt-2">
                        {currentProblem.items.map((_, i) => (
                             <button 
                                key={i} 
                                onClick={() => {
                                    if (scrollRef.current) {
                                        scrollRef.current.scrollTo({
                                            left: i * scrollRef.current.clientWidth,
                                            behavior: 'smooth'
                                        });
                                    }
                                }}
                                className={`rounded-full transition-all duration-300 ${activeIndex === i ? 'w-2 h-2 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'w-1.5 h-1.5 bg-white/20'}`}
                             />
                        ))}
                    </div>

                </motion.div>
             </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};

export default ExperienceToggle;