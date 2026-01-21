
import React, { useState, useRef, useEffect } from 'react';
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

  const streamerImage = "https://raw.githubusercontent.com/cavanjuice/assets/main/streamersad.png";
  const viewerImage = "https://raw.githubusercontent.com/cavanjuice/assets/main/viewersad.png";

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
        desc: "Lost in the noise. You want to participate, but you're just watching a video feed.",
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
        // We assume cards are full width (min-w-full) + gap
        // Using offsetLeft of children is most reliable
        let nextTarget = currentScroll;
        const children = Array.from(container.children) as HTMLElement[];
        
        // Find the first child that is fully to the right of current scroll
        // A simple heuristic: center point of child > center point of view + small offset
        const viewCenter = currentScroll + (container.clientWidth / 2);
        
        for (let child of children) {
            if (child.offsetLeft > currentScroll + 10) {
                nextTarget = child.offsetLeft;
                break;
            }
        }
        
        // If no target found or target is same, force a step (fallback)
        if (nextTarget <= currentScroll) {
             nextTarget = currentScroll + container.clientWidth; 
        }

        // Ensure we don't overshoot max
        if (nextTarget > maxScroll) nextTarget = maxScroll;


        // ANIMATION LOOP
        const startScroll = currentScroll;
        const distance = nextTarget - startScroll;
        const duration = 1500; // 1.5 seconds (Updated from 2000)
        const startTime = performance.now();

        // Temporarily disable scroll snap to allow smooth JS animation
        container.style.scrollSnapType = 'none';

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            
            if (elapsed < duration) {
                const progress = elapsed / duration;
                // EaseInOutQuad for gentle start and end
                const ease = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                container.scrollLeft = startScroll + (distance * ease);
                requestAnimationFrame(animate);
            } else {
                container.scrollLeft = nextTarget;
                // Re-enable scroll snap for manual interaction
                container.style.scrollSnapType = 'x mandatory';
            }
        };
        
        requestAnimationFrame(animate);

    }, 5000); // Wait 5 seconds between scrolls

    return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [role]);

  return (
    <section id="choose-player" className="py-12 lg:py-24 relative z-10 overflow-hidden bg-black/20 min-h-[100dvh] flex flex-col justify-center">
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
        
        {/* 1. HEADER: VISUALS & STATS */}
        <div className="max-w-6xl mx-auto w-full mb-10 md:mb-16">
            <AnimatePresence mode="wait">
                <motion.div 
                    key={role}
                    initial={{ opacity: 0, x: role === 'streamer' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: role === 'streamer' ? 20 : -20 }}
                    transition={{ duration: 0.4 }}
                    // Desktop: Grid | Mobile: Flex Row centered
                    className="flex flex-row items-center justify-center gap-6 md:grid md:grid-cols-2 md:gap-16 lg:gap-20"
                >
                    {/* LEFT: CHARACTER IMAGE */}
                    <div className="relative w-56 h-72 sm:w-64 sm:h-80 md:w-full md:h-[400px] flex items-center justify-center shrink-0 order-1 md:order-none">
                         {/* Background Glow */}
                         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[350px] lg:h-[350px] rounded-full blur-[50px] lg:blur-[100px] opacity-40 ${role === 'streamer' ? 'bg-violet-600' : 'bg-orange-600'}`} />

                         <img 
                             src={role === 'streamer' ? streamerImage : viewerImage}
                             alt={role}
                             className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_25px_rgba(0,0,0,0.6)] grayscale-[20%] contrast-125"
                         />
                    </div>

                    {/* RIGHT: STATS & CONTENT */}
                    <div className="relative z-10 order-2 md:order-none flex-1 min-w-0">
                        <h3 className={`text-2xl sm:text-4xl lg:text-6xl font-display font-bold mb-3 italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r ${role === 'streamer' ? 'from-white via-violet-200 to-indigo-400' : 'from-white via-orange-200 to-red-400'}`}>
                            {activeStats.title}
                        </h3>

                        <p className="text-gray-400 text-xs sm:text-sm lg:text-lg leading-relaxed mb-5 lg:mb-8 max-w-md font-light line-clamp-4 md:line-clamp-none">
                            {activeStats.desc}
                        </p>

                        {/* Progress Bars */}
                        <div className="space-y-3 lg:space-y-5 mb-0 max-w-md">
                            {activeStats.bars.map((stat, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-end mb-1.5">
                                        <span className="text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
                                        <span className={`font-mono text-xs lg:text-sm font-bold ${role === 'streamer' ? 'text-violet-400' : 'text-orange-400'}`}>{stat.value}%</span>
                                    </div>
                                    <div className="h-1.5 lg:h-2 bg-white/5 rounded-full overflow-hidden">
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

        {/* 2. TOGGLE BUTTON - Sleeker Mobile */}
        <div className="flex justify-center mb-10 md:mb-16 relative z-20">
             <div className="relative inline-flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md shadow-2xl overflow-hidden origin-center">
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
                   className={`relative z-10 px-4 py-2 md:px-6 md:py-3.5 rounded-full font-bold font-display tracking-[0.1em] transition-colors duration-300 w-32 md:w-48 text-[10px] md:text-xs ${role === 'streamer' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                 >
                   STREAMER
                 </button>
                 <button
                   onClick={() => setRole('viewer')}
                   className={`relative z-10 px-4 py-2 md:px-6 md:py-3.5 rounded-full font-bold font-display tracking-[0.1em] transition-colors duration-300 w-32 md:w-48 text-[10px] md:text-xs ${role === 'viewer' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                 >
                   VIEWER
                 </button>
             </div>
        </div>

        {/* 3. PROBLEM CARDS - Horizontal Scroll on Mobile, Grid on Desktop */}
        <div className="relative max-w-6xl mx-auto w-full">
             <AnimatePresence mode="wait">
                <motion.div 
                    key={role}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                >
                    {/* 
                        Mobile Layout: Flex row, snap scroll, hidden scrollbar
                        Desktop Layout: Grid
                        NOTE: scrollSnapType is managed dynamically by the useEffect for animation smoothness
                    */}
                    <div 
                        ref={scrollRef}
                        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-4 scrollbar-hide"
                        style={{ scrollSnapType: 'x mandatory' }} 
                    >
                        {currentProblem.items.map((item, i) => (
                            // Min-width 100% on mobile ensures "1 at a time"
                            <div key={i} className="min-w-full md:min-w-0 snap-center flex h-full">
                                <SpotlightCard 
                                    index={i} 
                                    className="p-6 md:p-6 backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-colors w-full h-full border-white/10 flex flex-col justify-center"
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${role === 'streamer' ? 'bg-violet-500/10' : 'bg-orange-500/10'}`}>
                                        <item.Icon 
                                            className="w-6 h-6" 
                                            style={{ stroke: role === 'streamer' ? "url(#grad-streamer)" : "url(#grad-viewer)" }} 
                                        />
                                    </div>
                                    <h3 className="font-bold text-lg text-white mb-2 leading-tight">{item.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                                </SpotlightCard>
                            </div>
                        ))}
                    </div>
                    
                    {/* Mobile Navigation Hint (Dots) */}
                    <div className="flex md:hidden justify-center gap-2 mt-2">
                        {currentProblem.items.map((_, i) => (
                             <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
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
    