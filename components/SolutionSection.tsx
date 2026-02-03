
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useScroll } from 'framer-motion';
import { Activity, DollarSign, Users, Heart, ArrowUp, Eye, Crown, Signal, Zap, Wifi, Lock } from 'lucide-react';
import { getAssetUrl } from '../utils/supabaseClient';

interface SolutionSectionProps {
  role: 'streamer' | 'viewer';
}

const SolutionSection: React.FC<SolutionSectionProps> = ({ role }) => {
  const [leveledUp, setLeveledUp] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  // Preload Level-Up Images to prevent delay/flicker
  useEffect(() => {
    const imgUrls = [
        getAssetUrl("streamersad.webp"),
        getAssetUrl("viewersad.webp"),
        getAssetUrl("wearable_.webp"),
        getAssetUrl("wearable_2.webp"),
        getAssetUrl("wearable_3.webp"),
        getAssetUrl("wearable_1.webp"),
        getAssetUrl("viewerhappy.webp")
    ];
    // Deferred load to not block main thread
    const t = setTimeout(() => {
        imgUrls.forEach(url => {
            const img = new Image();
            img.src = url;
            if ('decode' in img) {
                img.decode().catch(() => {});
            }
        });
    }, 2500);
    return () => clearTimeout(t);
  }, []);
  
  // Section Scroll Logic for Auto-Level Up
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // If we scroll past 65% of the section lifecycle and haven't leveled up, do it automatically
      // This ensures the user sees the transformation before the section leaves the viewport
      if (latest > 0.65 && !leveledUp) {
        setLeveledUp(true);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, leveledUp]);

  // 3D Tilt Logic for Card
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 50, damping: 10 });
  const mouseY = useSpring(y, { stiffness: 50, damping: 10 });

  // Moderate rotation for a solid feel
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-3, 3]);
  const shineX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const shineY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXVal = e.clientX - rect.left;
    const mouseYVal = e.clientY - rect.top;
    const xPct = mouseXVal / width - 0.5;
    const yPct = mouseYVal / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Reset state when switching roles
  useEffect(() => {
    setLeveledUp(false);
    setCurrentFrame(0);
  }, [role]);

  // Image sequence loop for Streamer Level Up
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (leveledUp && role === 'streamer') {
        const sequenceLength = 4;
        interval = setInterval(() => {
            setCurrentFrame(prev => (prev + 1) % sequenceLength);
        }, 3000); // 3 seconds per frame
    } else {
        setCurrentFrame(0);
    }
    return () => clearInterval(interval);
  }, [leveledUp, role]);

  const toggleLevelUp = () => {
    setLeveledUp(!leveledUp);
  };

  const streamerImages = [
    getAssetUrl("wearable_.webp"),
    getAssetUrl("wearable_2.webp"),
    getAssetUrl("wearable_3.webp"),
    getAssetUrl("wearable_1.webp")
  ];

  const evolutionData = {
    streamer: {
      before: {
        level: 1,
        rank: "Chat Reader",
        desc: "Struggling to keep up with chat scroll. Feeling disconnected.",
        image: getAssetUrl("streamersad.webp"),
        stats: [
          { label: "Connection", value: 30, icon: <Signal size={12} /> },
          { label: "Depth", value: 45, icon: <Activity size={12} /> },
          { label: "Revenue", value: 25, icon: <DollarSign size={12} /> },
        ]
      },
      after: {
        level: 99,
        rank: "Immersion Master",
        desc: "Physically feeling every sub, donation, and hype moment.",
        image: streamerImages[0], 
        stats: [
          { label: "Connection", value: 88, icon: <Signal size={12} /> },
          { label: "Depth", value: 92, icon: <Activity size={12} /> },
          { label: "Revenue", value: 84, icon: <DollarSign size={12} /> },
        ],
        features: [
            { icon: Activity, label: "Feel", sub: "Haptics" },
            { icon: Zap, label: "Sync", sub: "Bio-link" },
            { icon: DollarSign, label: "Earn", sub: "Premium" }
        ]
      }
    },
    viewer: {
      before: {
        level: 1,
        rank: "Anonymous Lurker",
        desc: "Just another name in a fast-moving chat. Invisible and passive.",
        image: getAssetUrl("viewersad.webp"),
        stats: [
          { label: "Influence", value: 15, icon: <Users size={12} /> },
          { label: "Visibility", value: 10, icon: <Eye size={12} /> },
          { label: "Immersion", value: 40, icon: <Heart size={12} /> },
        ]
      },
      after: {
        level: 99,
        rank: "Community MVP",
        desc: "Directly impacting the stream. Your presence is felt.",
        image: getAssetUrl("viewerhappy.webp"),
        stats: [
          { label: "Influence", value: 85, icon: <Users size={12} /> },
          { label: "Visibility", value: 88, icon: <Eye size={12} /> },
          { label: "Immersion", value: 91, icon: <Heart size={12} /> },
        ],
        features: [
            { icon: Wifi, label: "Impact", sub: "Trigger" },
            { icon: Users, label: "Hive", sub: "Sync" },
            { icon: Heart, label: "Love", sub: "Physical" }
        ]
      }
    }
  };

  const currentRoleData = evolutionData[role];
  const currentState = leveledUp ? currentRoleData.after : currentRoleData.before;
  const isStreamer = role === 'streamer';

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 relative z-10 overflow-hidden flex flex-col justify-center min-h-[90vh]">
      {/* Background Atmosphere */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[600px] rounded-full blur-[100px] pointer-events-none mix-blend-screen transition-all duration-1000 ${
            leveledUp 
                ? (isStreamer ? 'bg-violet-900/20' : 'bg-orange-900/20') 
                : 'bg-gray-900/10'
        }`}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">
        <div className="text-center mb-16 lg:mb-24 max-w-4xl mx-auto">
          <AnimatePresence mode='wait'>
            <motion.div
                key={role}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
            >
                {/* Unified Title Style */}
                <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 tracking-tight">
                    What if you could <br className="hidden md:block" />
                    <span className="relative inline-block mx-2">
                        <motion.span 
                            className={`absolute inset-0 blur-3xl rounded-full ${isStreamer ? 'bg-violet-500/20' : 'bg-orange-500/20'}`}
                            animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        ></motion.span>
                        
                        <span className={`relative italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r ${isStreamer ? 'from-white via-violet-400 to-indigo-500 drop-shadow-[0_0_25px_rgba(139,92,246,0.4)]' : 'from-white via-orange-400 to-red-500 drop-shadow-[0_0_25px_rgba(249,115,22,0.4)]'}`}>
                            TRULY CONNECT
                        </span>
                    </span> 
                </h2>
            
                {/* Unified Description Style */}
                <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto">
                    {isStreamer ? (
                        <>Don't settle for the basics. Upgrade your stream's <span className="text-violet-200 font-medium">emotional intelligence</span>.</>
                    ) : (
                        <>Don't just watch from the sidelines. Upgrade your <span className="text-orange-200 font-medium">impact</span> on the show.</>
                    )}
                </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3D EVOLUTION CARD */}
        {/* Scaled down container width from 750px to 600px for desktop */}
        <div className="relative perspective-1000 mx-auto mt-8" style={{ width: 'min(100%, 600px)' }}>
             <motion.div 
                ref={cardRef}
                initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ 
                    rotateX, 
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                // Reduced minimum height from 420px to 340px for desktop to maintain ratio
                className="relative w-full group min-h-[400px] lg:min-h-[340px]"
             >
                {/* --- FLOATING HEADER PANELS (OUTSIDE CARD) --- */}
                
                {/* Level Badge - Top Left Outside - Scaled Down */}
                <motion.div 
                    layout
                    className={`absolute -top-5 left-4 lg:-top-6 lg:-left-4 z-40 flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transform-gpu ${
                        leveledUp 
                            ? (isStreamer ? 'bg-[#1e1b2e] border-violet-500/50 text-white' : 'bg-[#2e1b1b] border-orange-500/50 text-white')
                            : 'bg-[#0A0A0B] border-white/10 text-gray-500'
                    }`}
                >
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">Lvl</span>
                    <motion.span 
                        key={currentState.level}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-mono text-lg font-bold leading-none"
                    >
                        {currentState.level}
                    </motion.span>
                </motion.div>

                {/* Rank Badge - Top Right Outside - Scaled Down */}
                <motion.div 
                    layout
                    className={`absolute -top-5 right-4 lg:-top-6 lg:-right-4 z-40 flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transform-gpu ${
                        leveledUp 
                            ? (isStreamer ? 'bg-[#1e1b2e] border-violet-500/50 text-violet-200' : 'bg-[#2e1b1b] border-orange-500/50 text-orange-200')
                            : 'bg-[#0A0A0B] border-white/10 text-gray-500'
                    }`}
                >
                    {leveledUp ? <Crown size={12} /> : <Activity size={12} />}
                    <motion.span layout className="text-[10px] font-bold uppercase tracking-widest">{currentState.rank}</motion.span>
                </motion.div>

                {/* --- CARD BACKGROUND --- */}
                <div className={`absolute inset-0 top-0 rounded-[2.5rem] border transition-all duration-1000 ease-out overflow-hidden pointer-events-none ${
                    leveledUp 
                        ? (isStreamer 
                            ? 'bg-[#0b0a14] border-violet-500/40 shadow-[0_30px_80px_-20px_rgba(139,92,246,0.3)]' 
                            : 'bg-[#0f0a05] border-orange-500/40 shadow-[0_30px_80px_-20px_rgba(249,115,22,0.3)]')
                        : 'bg-white/5 border-white/10 shadow-2xl'
                }`}>
                    {/* Dynamic Glare Effect */}
                    <motion.div 
                        className="absolute inset-0 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
                        style={{
                            background: useTransform(
                                [shineX, shineY],
                                ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.08) 0%, transparent 50%)`
                            )
                        }}
                    />
                    
                    {/* Background Texture/Pattern */}
                    <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${leveledUp ? 'opacity-30' : 'opacity-10'}`}>
                        <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]`} />
                    </div>

                    {/* Active State Background Gradient */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: leveledUp ? 1 : 0 }}
                        transition={{ duration: 1 }}
                        className={`absolute inset-0 bg-gradient-to-tr ${isStreamer ? 'from-violet-900/20 via-transparent to-indigo-900/20' : 'from-orange-900/20 via-transparent to-red-900/20'}`}
                    />
                </div>

                {/* --- CONTENT LAYER --- */}
                <div className="grid lg:grid-cols-2 relative z-20 h-full">
                    
                    {/* LEFT: CHARACTER VISUAL */}
                    <div className="relative h-[280px] lg:h-auto w-full flex items-end justify-center lg:justify-start order-1 lg:order-none pointer-events-none">
                        
                        {/* Wrapper to align image - Adjusted left offset for smaller width */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 lg:-left-8 lg:translate-x-0 w-[140%] max-w-[360px] lg:max-w-none lg:w-[130%] h-[160%] lg:h-[180%] z-30">
                             <AnimatePresence mode="wait">
                                {leveledUp && isStreamer ? (
                                    streamerImages.map((src, index) => (
                                        <motion.img 
                                            key={`seq-${index}`}
                                            src={src} 
                                            alt="Streamer Level Up" 
                                            className="absolute inset-0 w-full h-full object-contain object-bottom origin-bottom"
                                            style={{ 
                                                // Mask only the bottom edge to blend into card
                                                maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                                                WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                                            }} 
                                            initial={{ opacity: 0 }}
                                            animate={{ 
                                                opacity: currentFrame === index ? 1 : 0, 
                                                scale: 0.95,
                                                y: [0, -5, 0],
                                                filter: `brightness(1.1) contrast(1.1)` 
                                            }}
                                            transition={{ 
                                                opacity: { duration: 0.5 },
                                                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                                                filter: { duration: 0.5 }
                                            }}
                                        />
                                    ))
                                ) : (
                                    <motion.img 
                                        key={currentState.image}
                                        src={currentState.image} 
                                        alt={role} 
                                        className="absolute inset-0 w-full h-full object-contain object-bottom origin-bottom"
                                        style={{ 
                                            // Mask only the bottom edge to blend into card
                                            maskImage: leveledUp ? 'linear-gradient(to bottom, black 85%, transparent 100%)' : 'linear-gradient(to bottom, black 80%, transparent 100%)',
                                            WebkitMaskImage: leveledUp ? 'linear-gradient(to bottom, black 85%, transparent 100%)' : 'linear-gradient(to bottom, black 80%, transparent 100%)',
                                        }} 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ 
                                            opacity: 1, 
                                            scale: leveledUp ? 0.95 : 1,
                                            y: leveledUp ? [0, -5, 0] : 0,
                                            filter: leveledUp 
                                                ? `brightness(1.1) contrast(1.1)` 
                                                : 'drop-shadow(0 10px 20px rgba(0,0,0,0.5)) grayscale(100%) brightness(0.7) contrast(0.9)'
                                        }}
                                        transition={{ 
                                            opacity: { duration: 0.5 },
                                            scale: { duration: 0.5 },
                                            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                                            filter: { duration: 0.5 }
                                        }}
                                    />
                                )}
                             </AnimatePresence>
                        </div>
                    </div>

                    {/* RIGHT: STATS & CONTROLS - Scaled padding down */}
                    <div className="relative z-30 p-6 lg:p-8 flex flex-col justify-center h-full order-2 lg:order-none pointer-events-none">
                        
                        <div className="flex flex-col gap-5 lg:gap-6 pointer-events-auto">
                            {/* HEADER - Tightened height and margin */}
                            <div>
                                <div className="h-[32px] lg:h-[40px] mb-3 relative">
                                    <AnimatePresence mode="wait">
                                        <motion.h3 
                                            key={leveledUp ? 'up' : 'down'}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute top-0 left-0 w-full text-2xl lg:text-3xl font-display font-bold leading-tight text-white"
                                        >
                                            {leveledUp ? (isStreamer ? "Maximum Sync" : "Full Presence") : "Disconnected State"}
                                        </motion.h3>
                                    </AnimatePresence>
                                </div>
                                
                                <div className="h-[40px] relative">
                                    <AnimatePresence mode="wait">
                                        <motion.p 
                                            key={currentState.desc}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute top-[5px] left-0 w-full text-gray-400 text-xs lg:text-sm leading-relaxed font-light"
                                        >
                                            {currentState.desc}
                                        </motion.p>
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* STATS BARS */}
                            <div className="space-y-3">
                                {currentState.stats.map((stat, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-end mb-1 text-[10px]">
                                            <span className="font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                {stat.icon} {stat.label}
                                            </span>
                                            <motion.span 
                                                key={stat.value}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className={`font-mono font-bold ${leveledUp ? (isStreamer ? 'text-violet-400' : 'text-orange-400') : 'text-gray-600'}`}
                                            >
                                                {stat.value}/100
                                            </motion.span>
                                        </div>
                                        <div className="h-1 lg:h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${stat.value}%` }}
                                                transition={{ duration: 1, delay: i * 0.1, ease: "circOut" }}
                                                className={`h-full rounded-full relative ${
                                                    leveledUp 
                                                        ? (isStreamer ? 'bg-gradient-to-r from-violet-600 to-indigo-400' : 'bg-gradient-to-r from-orange-500 to-red-500')
                                                        : 'bg-gray-700'
                                                }`}
                                            >
                                                {leveledUp && <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite] w-full" />}
                                            </motion.div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* FEATURE GRID - Scaled Padding */}
                            <div className="grid grid-cols-3 gap-2">
                                {(currentRoleData.after.features || []).map((feat, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + (i * 0.1) }}
                                        className={`
                                            rounded-lg p-2 border transition-all duration-500 relative overflow-hidden group text-center flex flex-col items-center justify-center gap-1.5
                                            ${leveledUp 
                                                ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                                                : 'bg-black/20 border-white/5 opacity-40 grayscale'
                                            }
                                        `}
                                    >
                                        {!leveledUp && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px] z-20">
                                                <Lock size={12} className="text-gray-500" />
                                            </div>
                                        )}

                                        <div className={`${leveledUp ? (isStreamer ? 'text-violet-400' : 'text-orange-400') : 'text-gray-600'}`}>
                                            <feat.icon size={16} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`font-bold text-[9px] uppercase tracking-wide ${leveledUp ? 'text-white' : 'text-gray-600'}`}>
                                                {feat.label}
                                            </span>
                                            <span className="text-[8px] text-gray-500 hidden lg:block">{feat.sub}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* ACTION BUTTON - Scaled Padding */}
                            <motion.button
                                layout
                                onClick={toggleLevelUp}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-3 rounded-xl font-bold text-xs tracking-[0.2em] uppercase overflow-hidden transition-all duration-300 relative group ${
                                    leveledUp 
                                        ? 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10' 
                                        : (isStreamer 
                                            ? 'bg-violet-600 text-white shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_50px_rgba(139,92,246,0.6)]' 
                                            : 'bg-orange-600 text-white shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_50px_rgba(249,115,22,0.6)]')
                                }`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {leveledUp ? (
                                        <>VIEW BASIC STATS <ArrowUp className="w-4 h-4 rotate-180" /></>
                                    ) : (
                                        <>
                                            LEVEL UP EXPERIENCE <ArrowUp className="w-4 h-4 animate-bounce" />
                                        </>
                                    )}
                                </span>
                                
                                {!leveledUp && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                                )}
                            </motion.button>
                        </div>

                    </div>
                </div>
             </motion.div>
        </div>

      </div>
    </section>
  );
};

export default SolutionSection;
