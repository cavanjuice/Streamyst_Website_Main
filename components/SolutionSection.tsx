
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Activity, DollarSign, Users, Heart, ArrowUp, Eye, Crown, Signal } from 'lucide-react';

interface SolutionSectionProps {
  role: 'streamer' | 'viewer';
}

const SolutionSection: React.FC<SolutionSectionProps> = ({ role }) => {
  const [leveledUp, setLeveledUp] = useState(false);
  
  // 3D Tilt Logic
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 50, damping: 10 });
  const mouseY = useSpring(y, { stiffness: 50, damping: 10 });

  // Moderate rotation for a solid feel
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);
  const shineX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const shineY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
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
  }, [role]);

  const toggleLevelUp = () => {
    setLeveledUp(!leveledUp);
  };

  const streamerImage = "https://raw.githubusercontent.com/cavanjuice/assets/main/wearable_.png";
  const viewerImage = "https://raw.githubusercontent.com/cavanjuice/assets/main/IMG_20250504_121801.png";

  const evolutionData = {
    streamer: {
      image: streamerImage,
      before: {
        level: 1,
        rank: "Chat Reader",
        desc: "Struggling to keep up with chat scroll. Feeling disconnected from the community energy.",
        stats: [
          { label: "Audience Connection", value: 30, icon: <Signal size={12} /> },
          { label: "Interaction Depth", value: 45, icon: <Activity size={12} /> },
          { label: "Revenue Potential", value: 25, icon: <DollarSign size={12} /> },
        ]
      },
      after: {
        level: 99,
        rank: "Immersion Master",
        desc: "Physically feeling every sub, donation, and hype moment. One with the crowd.",
        stats: [
          { label: "Audience Connection", value: 88, icon: <Signal size={12} /> },
          { label: "Interaction Depth", value: 92, icon: <Activity size={12} /> },
          { label: "Revenue Potential", value: 84, icon: <DollarSign size={12} /> },
        ]
      }
    },
    viewer: {
      image: viewerImage,
      before: {
        level: 1,
        rank: "Anonymous Lurker",
        desc: "Just another name in a fast-moving chat. Invisible and passive.",
        stats: [
          { label: "Stream Influence", value: 15, icon: <Users size={12} /> },
          { label: "Visibility", value: 10, icon: <Eye size={12} /> },
          { label: "Immersion", value: 40, icon: <Heart size={12} /> },
        ]
      },
      after: {
        level: 99,
        rank: "Community MVP",
        desc: "Directly impacting the stream environment. Your presence is felt and seen.",
        stats: [
          { label: "Stream Influence", value: 85, icon: <Users size={12} /> },
          { label: "Visibility", value: 88, icon: <Eye size={12} /> },
          { label: "Immersion", value: 91, icon: <Heart size={12} /> },
        ]
      }
    }
  };

  const currentRoleData = evolutionData[role];
  const currentState = leveledUp ? currentRoleData.after : currentRoleData.before;
  const isStreamer = role === 'streamer';

  return (
    <section className="py-24 md:py-32 relative z-10 overflow-visible">
      {/* Background Atmosphere */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[800px] rounded-full blur-[120px] pointer-events-none mix-blend-screen transition-all duration-1000 ${
            leveledUp 
                ? (isStreamer ? 'bg-violet-900/30' : 'bg-orange-900/30') 
                : 'bg-gray-900/20'
        }`}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
            className="max-w-5xl mx-auto text-center mb-16"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
          <AnimatePresence mode='wait'>
            <motion.div
                key={role}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="font-display font-bold text-4xl md:text-6xl mb-6 leading-tight tracking-tight">
                    What if you could <br className="md:hidden" />
                    <span className="relative inline-block mx-3">
                    {/* Soft atmospheric backlight behind text */}
                    <motion.span 
                        className={`absolute inset-0 blur-3xl rounded-full ${isStreamer ? 'bg-violet-500/20' : 'bg-orange-500/20'}`}
                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    ></motion.span>
                    
                    {/* Main Text */}
                    <span className={`relative italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r ${isStreamer ? 'from-white via-violet-400 to-indigo-500 drop-shadow-[0_0_25px_rgba(139,92,246,0.4)]' : 'from-white via-orange-400 to-red-500 drop-shadow-[0_0_25px_rgba(249,115,22,0.4)]'}`}>
                        TRULY CONNECT
                    </span>
                    </span> 
                    {isStreamer ? 'with your audience?' : 'with your favourite streamers?'}
                </h2>
            
                <div className={`w-[1px] h-8 bg-gradient-to-b from-transparent to-transparent mx-auto mb-6 ${isStreamer ? 'via-violet-500/30' : 'via-orange-500/30'}`} />
            
                <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                    {isStreamer ? (
                        <>Don't settle for the basics. Upgrade your stream's <span className="text-violet-200 font-medium">emotional intelligence</span>.</>
                    ) : (
                        <>Don't just watch from the sidelines. Upgrade your <span className="text-orange-200 font-medium">impact</span> on the show.</>
                    )}
                </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* 3D EVOLUTION CARD */}
        <div className="max-w-5xl mx-auto relative perspective-1000 mt-12 md:mt-20">
             <motion.div 
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ 
                    rotateX, 
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                className="relative w-full group"
             >
                {/* --- CARD BACKGROUND (CLIPPED BOTTOM) --- */}
                {/* 
                    POINTER-EVENTS-NONE: This ensures the background layer NEVER steals a click.
                    It sits visually behind, but sometimes 3D transforms can confuse hit-testing.
                */}
                <div className={`absolute inset-0 top-12 md:top-16 rounded-[2.5rem] border transition-all duration-700 ease-out overflow-hidden pointer-events-none ${
                    leveledUp 
                        ? (isStreamer 
                            ? 'bg-[#0b0a14] border-violet-500/40 shadow-[0_20px_60px_-15px_rgba(139,92,246,0.3)]' 
                            : 'bg-[#0f0a05] border-orange-500/40 shadow-[0_20px_60px_-15px_rgba(249,115,22,0.3)]')
                        : 'bg-white/5 border-white/10 shadow-2xl'
                }`}>
                    {/* Dynamic Glare Effect */}
                    <motion.div 
                        className="absolute inset-0 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
                        style={{
                            background: useTransform(
                                [shineX, shineY],
                                ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.1) 0%, transparent 60%)`
                            )
                        }}
                    />

                    {/* Animated Grid Background */}
                    <div className={`absolute inset-0 z-0 opacity-20 transition-all duration-1000 ${leveledUp ? 'scale-110' : 'scale-100'}`}>
                        <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]`} />
                    </div>

                    {/* Background Aura (Clipped inside card) */}
                    <div className="absolute left-0 top-0 bottom-0 w-full lg:w-1/2 overflow-hidden pointer-events-none">
                        <motion.div 
                            className={`absolute inset-0 transition-opacity duration-1000 ${leveledUp ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[80px] ${isStreamer ? 'bg-violet-600/30' : 'bg-orange-600/30'}`} />
                        </motion.div>
                    </div>
                </div>

                {/* --- CONTENT LAYER --- */}
                {/* 
                   POINTER-EVENTS-NONE on the GRID CONTAINER.
                   We will explicitly enable pointer-events only on elements that need it (Text, Button).
                */}
                <div className="grid lg:grid-cols-2 relative z-20 pointer-events-none">
                    
                    {/* LEFT: CHARACTER VISUAL (BREAKS OUT) */}
                    <div className="relative h-[400px] lg:h-[550px] w-full flex items-end justify-center lg:justify-start order-1 lg:order-none pointer-events-none">
                        
                        {/* Main Image */}
                        <motion.img 
                            src={currentRoleData.image} 
                            alt={role} 
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 lg:-ml-12 w-auto h-[110%] lg:h-[125%] object-contain z-20 origin-bottom max-w-[90%] lg:max-w-none pointer-events-none"
                            style={{ z: 60 }} 
                            animate={{ 
                                y: leveledUp ? [0, -10, 0] : 0,
                                filter: leveledUp 
                                    ? `drop-shadow(0 20px 40px ${isStreamer ? 'rgba(139,92,246,0.4)' : 'rgba(249,115,22,0.4)'}) brightness(1.1) contrast(1.1)` 
                                    : 'drop-shadow(0 10px 20px rgba(0,0,0,0.5)) grayscale(100%) brightness(0.7) contrast(0.9)'
                            }}
                            transition={{ 
                                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                                filter: { duration: 0.5 }
                            }}
                        />

                        {/* Level Badge - POINTER-EVENTS-AUTO to allow interactions/tooltips */}
                        <motion.div 
                            className={`absolute top-24 left-8 lg:top-24 lg:left-8 flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-md z-40 transition-all duration-500 pointer-events-auto ${
                                leveledUp 
                                    ? (isStreamer ? 'bg-violet-500/20 border-violet-500/50 text-white' : 'bg-orange-500/20 border-orange-500/50 text-white')
                                    : 'bg-black/40 border-white/10 text-gray-500'
                            }`}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-widest">Lvl</span>
                            <span className="font-mono text-lg font-bold leading-none">{currentState.level}</span>
                        </motion.div>

                    </div>

                    {/* RIGHT: STATS & CONTROLS */}
                    <div className="pt-32 pb-12 px-8 lg:pt-44 lg:pb-20 lg:pr-16 flex flex-col justify-center relative order-2 lg:order-none h-full pointer-events-none">
                        
                        {/* POINTER-EVENTS-AUTO for text selection */}
                        <div className="mb-8 pointer-events-auto">
                            <motion.div 
                                key={leveledUp ? 'active' : 'inactive'}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className={`inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] ${
                                    leveledUp 
                                        ? (isStreamer ? 'border-violet-500/30 bg-violet-500/10 text-violet-300' : 'border-orange-500/30 bg-orange-500/10 text-orange-300')
                                        : 'border-white/10 bg-white/5 text-gray-500'
                                }`}>
                                    {leveledUp ? <Crown size={12} /> : <Activity size={12} />}
                                    {currentState.rank}
                                </div>
                                <h3 className={`text-3xl font-display font-bold mb-4 leading-tight ${leveledUp ? 'text-white' : 'text-gray-400'}`}>
                                    {leveledUp ? (isStreamer ? "Maximum Sync" : "Full Presence") : "Default State"}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed font-light">
                                    {currentState.desc}
                                </p>
                            </motion.div>
                        </div>

                        {/* Stats Bars - POINTER-EVENTS-AUTO for potential tooltips */}
                        <div className="space-y-6 mb-10 pointer-events-auto">
                            {currentState.stats.map((stat, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-end mb-2 text-xs">
                                        <span className="font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            {stat.icon} {stat.label}
                                        </span>
                                        <span className={`font-mono transition-colors duration-500 ${leveledUp ? (isStreamer ? 'text-violet-400' : 'text-orange-400') : 'text-gray-600'}`}>
                                            {stat.value}/100
                                        </span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
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

                        {/* Level Up Button - CRITICAL FIX */}
                        {/* 
                            1. pointer-events-auto: Explicitly enables clicks on this element.
                            2. translateZ(150px): Pushes it WAY forward in 3D space, past the image (z=60).
                            3. relative z-50: Ensures high stack order within local context.
                            4. cursor-pointer: Forces the hand cursor.
                        */}
                        <motion.div 
                            className="mt-auto relative z-50 pointer-events-auto"
                            style={{ z: 150 }} 
                        >
                            <button
                                onClick={toggleLevelUp}
                                className={`w-full group relative py-4 rounded-xl font-bold text-sm tracking-[0.2em] uppercase overflow-hidden transition-all duration-300 cursor-pointer ${
                                    leveledUp 
                                        ? 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10' 
                                        : (isStreamer 
                                            ? 'bg-violet-600 text-white shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_50px_rgba(139,92,246,0.6)]' 
                                            : 'bg-orange-600 text-white shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_50px_rgba(249,115,22,0.6)]')
                                }`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {leveledUp ? (
                                        <>VIEW BASIC STATS <ArrowUp className="w-4 h-4 rotate-180" /></>
                                    ) : (
                                        <>
                                            LEVEL UP <ArrowUp className="w-4 h-4 animate-bounce" />
                                        </>
                                    )}
                                </span>
                                
                                {/* Button Hover Shine */}
                                {!leveledUp && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                                )}
                            </button>
                        </motion.div>

                    </div>
                </div>
             </motion.div>
        </div>

      </div>
    </section>
  );
};

export default SolutionSection;
