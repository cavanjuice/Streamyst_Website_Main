
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Activity, DollarSign, Users, Heart, ArrowUp, Eye, Crown, Signal, Zap, Wifi, Lock } from 'lucide-react';

interface SolutionSectionProps {
  role: 'streamer' | 'viewer';
}

const SolutionSection: React.FC<SolutionSectionProps> = ({ role }) => {
  const [leveledUp, setLeveledUp] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  
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
    "https://raw.githubusercontent.com/cavanjuice/assets/main/wearable_.png",
    "https://raw.githubusercontent.com/cavanjuice/assets/main/wearable_2.png",
    "https://raw.githubusercontent.com/cavanjuice/assets/main/wearable_3.png",
    "https://raw.githubusercontent.com/cavanjuice/assets/main/wearable_1.png"
  ];

  const evolutionData = {
    streamer: {
      before: {
        level: 1,
        rank: "Chat Reader",
        desc: "Struggling to keep up with chat scroll. Feeling disconnected.",
        image: "https://raw.githubusercontent.com/cavanjuice/assets/main/streamersad.png",
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
        // Note: image property is handled by streamerImages array when leveled up
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
        image: "https://raw.githubusercontent.com/cavanjuice/assets/main/viewersad.png",
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
        image: "https://raw.githubusercontent.com/cavanjuice/assets/main/viewerhappy.png",
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
    <section className="py-24 lg:py-48 relative z-10 overflow-hidden flex flex-col justify-center min-h-[90vh]">
      {/* Background Atmosphere */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[600px] rounded-full blur-[100px] pointer-events-none mix-blend-screen transition-all duration-1000 ${
            leveledUp 
                ? (isStreamer ? 'bg-violet-900/20' : 'bg-orange-900/20') 
                : 'bg-gray-900/10'
        }`}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
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
                <h2 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-6 tracking-tight">
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
        <div className="max-w-5xl mx-auto relative perspective-1000">
             <motion.div 
                ref={ref}
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
                className="relative w-full group"
             >
                {/* --- CARD BACKGROUND --- */}
                <div className={`absolute inset-0 top-8 md:top-12 rounded-[2rem] border transition-all duration-700 ease-out overflow-hidden pointer-events-none ${
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
                    <div className={`absolute inset-0 z-0 opacity-20 transition-all duration-1000 ${leveledUp ? 'scale-110' : 'scale-100'}`}>
                        <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]`} />
                    </div>
                </div>

                {/* --- CONTENT LAYER --- */}
                {/* Sized up for large screens: min-h-[500px] */}
                <div className="grid lg:grid-cols-2 relative z-20 pointer-events-none min-h-[320px] lg:min-h-[500px]">
                    
                    {/* LEFT: CHARACTER VISUAL (BREAKS OUT) */}
                    <div className="relative h-[180px] lg:h-auto w-full flex items-end justify-center lg:justify-start order-1 lg:order-none pointer-events-none">
                        
                        {/* 
                           WRAPPER: Used for centering. 
                           The image itself animates scale/y but stays within this centered wrapper. 
                        */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 lg:-ml-12 w-full max-w-[260px] lg:max-w-none h-[130%] lg:h-[145%] z-20">
                            {leveledUp && isStreamer ? (
                                streamerImages.map((src, index) => (
                                    <motion.img 
                                        key={`seq-${index}`}
                                        src={src} 
                                        alt="Streamer Level Up Sequence" 
                                        className="absolute inset-0 w-full h-full object-contain object-bottom"
                                        style={{ 
                                            mixBlendMode: 'normal',
                                            maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                                            WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                                        }} 
                                        initial={{ opacity: 0 }}
                                        animate={{ 
                                            opacity: currentFrame === index ? 1 : 0, 
                                            scale: 1,
                                            y: [0, -10, 0],
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
                                    className="absolute inset-0 w-full h-full object-contain object-bottom"
                                    style={{ 
                                        maskImage: leveledUp ? 'linear-gradient(to bottom, black 85%, transparent 100%)' : 'linear-gradient(to bottom, black 80%, transparent 100%)',
                                        WebkitMaskImage: leveledUp ? 'linear-gradient(to bottom, black 85%, transparent 100%)' : 'linear-gradient(to bottom, black 80%, transparent 100%)',
                                        mixBlendMode: leveledUp ? 'screen' : 'normal'
                                    }} 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ 
                                        opacity: 1, 
                                        scale: 1,
                                        y: leveledUp ? [0, -10, 0] : 0,
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
                        </div>

                        {/* Level Badge */}
                        <motion.div 
                            className={`absolute top-8 left-6 lg:top-8 lg:left-8 flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md z-40 transition-all duration-500 pointer-events-auto ${
                                leveledUp 
                                    ? (isStreamer ? 'bg-violet-500/20 border-violet-500/50 text-white' : 'bg-orange-500/20 border-orange-500/50 text-white')
                                    : 'bg-black/40 border-white/10 text-gray-500'
                            }`}
                        >
                            <span className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest">Lvl</span>
                            <span className="font-mono text-sm lg:text-base font-bold leading-none">{currentState.level}</span>
                        </motion.div>

                    </div>

                    {/* RIGHT: STATS & CONTROLS */}
                    <div className="pt-0 pb-5 px-5 lg:px-12 lg:py-12 flex flex-col justify-center relative order-2 lg:order-none h-full pointer-events-none">
                        
                        <div className="mb-4 lg:mb-6 pointer-events-auto">
                            <motion.div 
                                key={leveledUp ? 'active' : 'inactive'}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className={`inline-flex items-center gap-2 mb-2 px-2 py-0.5 rounded-full border text-[8px] lg:text-[9px] font-bold uppercase tracking-[0.2em] ${
                                    leveledUp 
                                        ? (isStreamer ? 'border-violet-500/30 bg-violet-500/10 text-violet-300' : 'border-orange-500/30 bg-orange-500/10 text-orange-300')
                                        : 'border-white/10 bg-white/5 text-gray-500'
                                }`}>
                                    {leveledUp ? <Crown size={10} /> : <Activity size={10} />}
                                    {currentState.rank}
                                </div>
                                <h3 className={`text-lg md:text-2xl lg:text-3xl font-display font-bold mb-2 leading-tight ${leveledUp ? 'text-white' : 'text-gray-400'}`}>
                                    {leveledUp ? (isStreamer ? "Maximum Sync" : "Full Presence") : "Default State"}
                                </h3>
                                <p className="text-gray-400 text-xs lg:text-sm leading-relaxed font-light line-clamp-2">
                                    {currentState.desc}
                                </p>
                            </motion.div>
                        </div>

                        {/* Stats Bars - POINTER-EVENTS-AUTO */}
                        <div className="space-y-3 mb-4 lg:mb-6 pointer-events-auto">
                            {currentState.stats.map((stat, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-end mb-0.5 text-[9px] md:text-[10px]">
                                        <span className="font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                            {stat.icon} {stat.label}
                                        </span>
                                        <span className={`font-mono transition-colors duration-500 ${leveledUp ? (isStreamer ? 'text-violet-400' : 'text-orange-400') : 'text-gray-600'}`}>
                                            {stat.value}/100
                                        </span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
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

                        {/* Feature Cards */}
                        <div className="grid grid-cols-3 gap-2 lg:gap-3 mb-4 lg:mb-6 pointer-events-auto">
                            {(currentRoleData.after.features || []).map((feat, i) => (
                                <motion.div 
                                    key={i} 
                                    className={`
                                        rounded-lg p-1.5 lg:p-2 border transition-all duration-500 relative overflow-hidden group text-center
                                        ${leveledUp 
                                            ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                                            : 'bg-black/40 border-white/5 opacity-60'
                                        }
                                    `}
                                >
                                    {!leveledUp && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] z-20">
                                            <Lock size={10} className="text-gray-600" />
                                        </div>
                                    )}

                                    <div className={`mb-1 flex justify-center ${leveledUp ? (isStreamer ? 'text-violet-400' : 'text-orange-400') : 'text-gray-600'}`}>
                                        <feat.icon size={16} />
                                    </div>
                                    <div className={`font-bold text-[8px] md:text-[9px] mb-0.5 leading-tight ${leveledUp ? 'text-white' : 'text-gray-500'}`}>{feat.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Level Up Button */}
                        <motion.div 
                            className="mt-2 relative z-50 pointer-events-auto"
                            initial={{ z: 150 }} 
                        >
                            <button
                                onClick={toggleLevelUp}
                                className={`w-full group relative py-2.5 md:py-4 rounded-xl font-bold text-[10px] md:text-xs tracking-[0.2em] uppercase overflow-hidden transition-all duration-300 cursor-pointer ${
                                    leveledUp 
                                        ? 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10' 
                                        : (isStreamer 
                                            ? 'bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]' 
                                            : 'bg-orange-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]')
                                }`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {leveledUp ? (
                                        <>VIEW BASIC STATS <ArrowUp className="w-3 h-3 rotate-180" /></>
                                    ) : (
                                        <>
                                            LEVEL UP <ArrowUp className="w-3 h-3 animate-bounce" />
                                        </>
                                    )}
                                </span>
                                
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
