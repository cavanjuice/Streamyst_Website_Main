
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'framer-motion';
import { Sparkles, Wifi } from 'lucide-react';
import { getAssetUrl } from '../utils/supabaseClient';

// Custom Icons from Old Code to ensure exact animation match
const HeartIcon = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);

const StarIcon = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

type Emotion = 'happy' | 'love' | 'hype' | 'shock' | 'clap';

interface EmotionData {
  id: Emotion;
  label: string;
  emoji: string;
  color: string;
  hex: string;
}

const emotions: EmotionData[] = [
  { id: 'happy', label: "Joy", emoji: "😊", color: "text-green-400", hex: "#4ade80" },
  { id: 'love', label: "Love", emoji: "😍", color: "text-pink-500", hex: "#ec4899" },
  { id: 'hype', label: "Fyre", emoji: "🔥", color: "text-orange-500", hex: "#f97316" },
  { id: 'shock', label: "Shock", emoji: "⚡", color: "text-white", hex: "#ffffff" },
  { id: 'clap', label: "Support", emoji: "👏", color: "text-yellow-400", hex: "#facc15" }
];

const staticImage = getAssetUrl("originalcharacter.png");

const emotionImages: Record<Emotion, string> = {
  happy: getAssetUrl("joy2.png"),
  love: getAssetUrl("love2.png"),
  hype: getAssetUrl("hype2.png"),
  shock: getAssetUrl("shock2.png"),
  clap: getAssetUrl("support2.png")
};

// Sentiment Analysis Simulation Data
const SENTIMENT_MESSAGES: Record<Emotion, string[]> = {
    happy: [
        "This is amazing! 😊", "So wholesome <3", "Best stream ever!", 
        "Love the vibes today", "Smiling so hard rn", "Positivity 100%"
    ],
    love: [
        "I love this community 😍", "Marry me!!", "ALL THE LOVE", 
        "<3 <3 <3", "My heart is full", "You're the best streamer!"
    ],
    hype: [
        "LETS GOOOO 🔥", "THIS IS INSANE", "HYPE HYPE HYPE", 
        "FIRE IN THE CHAT", "ABSOLUTE CINEMA", "CANT BELIEVE IT"
    ],
    shock: [
        "WHAT???", "NO WAY ⚡", "DID YOU SEE THAT??", 
        "Wait what just happened", "IM SHOOK", "Unreal..."
    ],
    clap: [
        "Well played 👏", "GG", "Amazing performance", 
        "You deserve it!", "Respect +1", "Keep it up!"
    ]
};

const USERNAMES = ["PixelFan", "NeonRider", "StreamLover", "GlitchWizard", "VibeCheck", "RetroGamer"];

interface ChatMessage {
  id: number;
  user: string;
  text: string;
  color: string;
  isSystem?: boolean;
}

const InteractiveDemo: React.FC = () => {
  const [activeEmotion, setActiveEmotion] = useState<Emotion | null>(null);
  const [triggerKey, setTriggerKey] = useState(0);
  const [shake, setShake] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, user: "System", text: "Connected to Streamyst server...", color: "text-gray-500", isSystem: true },
    { id: 2, user: "System", text: "Waiting for input...", color: "text-gray-500", isSystem: true }
  ]);
  const [isMobile, setIsMobile] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // --- 3D TILT LOGIC (Restored from Old Code) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 40, damping: 20, mass: 1.2 };
  
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Transforms
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);
  
  const glareX = useTransform(springX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(springY, [-0.5, 0.5], [0, 100]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15), transparent 60%)`;

  const layerX = useTransform(springX, [-0.5, 0.5], [-15, 15]);
  const layerY = useTransform(springY, [-0.5, 0.5], [-15, 15]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    
    // Calculate percentages -0.5 to 0.5
    const xPct = (mouseXPos / width) - 0.5;
    const yPct = (mouseYPos / height) - 0.5;

    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const triggerReaction = (emotionId: Emotion) => {
    setActiveEmotion(emotionId);
    setTriggerKey(prev => prev + 1);
    
    // Shake effect based on emotion intensity
    if (emotionId === 'hype' || emotionId === 'shock') {
        setShake(5);
        setTimeout(() => setShake(0), 500);
    }

    // Add Simulated Sentiment Analysis Chat Message
    const potentialMessages = SENTIMENT_MESSAGES[emotionId];
    const randomMsg = potentialMessages[Math.floor(Math.random() * potentialMessages.length)];
    const randomUser = USERNAMES[Math.floor(Math.random() * USERNAMES.length)];
    const emotionColor = emotions.find(e => e.id === emotionId)?.color || "text-white";

    const newMessage: ChatMessage = {
      id: Date.now(),
      user: randomUser,
      text: randomMsg,
      color: emotionColor
    };
    
    setMessages(prev => {
        const updated = [...prev, newMessage];
        return updated.slice(-10); // Keep last 10
    });
  };

  // Scroll chat when messages update
  useEffect(() => {
    if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const activeEmotionData = emotions.find(e => e.id === activeEmotion);

  // --- RESTORED ANIMATION LOGIC FROM OLD CODE ---

  // Lightning Paths (Calculated dynamically as in old code)
  const lightningPaths = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        let d = `M 50 50`;
        let cx = 50;
        let cy = 50;
        const steps = 6;
        for(let j=0; j<steps; j++) {
            const r = 8 * (j+1);
            cx += Math.cos(angle) * r + (Math.random()-0.5)*10;
            cy += Math.sin(angle) * r + (Math.random()-0.5)*10;
            d += ` L ${cx} ${cy}`;
        }
        return d;
    });
  }, [triggerKey]);

  // Love Particles (Old Code Version)
  const loveParticles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 60 + Math.random() * 100;
        const lift = 150 + Math.random() * 250;
        const xDir = Math.cos(angle);
        const depth = Math.random(); 
        const scale = 0.5 + depth * 1.0;
        const blur = (1 - depth) * 4;
        const zIndex = Math.floor(depth * 50);

        return {
            id: i,
            startX: xDir * 20, 
            startY: Math.sin(angle) * 20,
            endX: xDir * velocity + (Math.random() - 0.5) * 60,
            endY: -lift,
            rotateStart: (Math.random() - 0.5) * 60,
            rotateEnd: (Math.random() - 0.5) * 120,
            scale,
            blur,
            zIndex,
            duration: 2 + Math.random() * 1.5,
            delay: Math.random() * 0.3,
            fill: i % 2 === 0 ? 'url(#heart-grad-1)' : 'url(#heart-grad-2)'
        };
    });
  }, [triggerKey]);

  // Joy Particles (Old Code Version)
  const joyParticles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
        const angle = (i / 40) * Math.PI * 2 + (Math.random() - 0.5); 
        const dist = 150 + Math.random() * 200;
        
        return {
            id: i,
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            scale: Math.random() * 1.5 + 0.5,
            rotate: Math.random() * 360,
            delay: Math.random() * 0.2,
            duration: 1.5 + Math.random(),
            color: Math.random() > 0.5 ? '#22c55e' : '#86efac' 
        };
    });
  }, [triggerKey]);

  // Clap Particles (Exact Logic from Old Code)
  const clapParticles = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => {
        const startX = (Math.random() - 0.5) * 400; 
        const startY = 400; 
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = -250 - Math.random() * 200; 
        const rotationAxis = Math.random() > 0.5 ? 'rotateX' : 'rotateY';
        
        return {
            id: i,
            startX,
            startY,
            midX: (startX + endX) / 2,
            midY: endY,
            finalX: endX + (Math.random() - 0.5) * 150, 
            finalY: 600, 
            size: Math.random() * 8 + 4,
            color: ['#facc15', '#fde047', '#eab308', '#ffffff'][Math.floor(Math.random() * 4)],
            rotationAxis,
            rotateAmount: 720 + Math.random() * 720, 
            delay: Math.random() * 0.15, 
            duration: 3 + Math.random() * 2 
        };
    });
  }, [triggerKey]);

  return (
    <section 
        id="demo" 
        className="py-24 lg:py-32 relative z-10 overflow-hidden bg-[#030205] perspective-1000"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
    >
      
      {/* Shared Definitions for SVGs */}
      <svg width="0" height="0" className="absolute">
          <defs>
              <linearGradient id="heart-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#db2777" />
              </linearGradient>
              <linearGradient id="heart-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#be185d" />
              </linearGradient>
              <filter id="glow-shock" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                  </feMerge>
              </filter>
          </defs>
      </svg>

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        
        {/* Unified Header Style */}
        <div className="text-center mb-16 lg:mb-20 max-w-4xl mx-auto">
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ delay: 0.1 }}
             className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 tracking-tight"
           >
             CONTROL THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-600 filter drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]">EXPERIENCE</span>
           </motion.h2>
        </div>

        {/* 3D TILT CONTAINER */}
        <div 
            className="relative max-w-4xl mx-auto flex justify-center perspective-1000"
            style={{ perspective: 1000 }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{ 
                    rotateX: isMobile ? 0 : rotateX, 
                    rotateY: isMobile ? 0 : rotateY,
                    transformStyle: 'preserve-3d',
                }}
                animate={{
                    x: shake > 0 ? [0, -shake, shake, -shake, shake, 0] : 0 
                }}
                className="relative w-full max-w-4xl bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] lg:rounded-[2rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden transform-style-3d"
            >
                {/* Dynamic Glare Reflection */}
                <motion.div 
                    className="absolute inset-0 z-20 pointer-events-none opacity-30 mix-blend-overlay transition-all duration-75"
                    style={{
                        background: isMobile ? 'none' : glareBackground
                    }}
                />

                <div className="grid lg:grid-cols-12 lg:min-h-[420px]">
                    
                    {/* LEFT: VISUALIZER */}
                    <div className="lg:col-span-7 relative flex items-center justify-center p-4 lg:p-8 overflow-hidden bg-[#0A0A0B] h-[360px] lg:h-auto">
                        
                        {/* Dynamic Environment Glow */}
                        <div 
                            className="absolute inset-0 transition-colors duration-500 ease-out"
                            style={{ 
                                background: activeEmotion 
                                    ? `radial-gradient(circle at center, ${emotions.find(e => e.id === activeEmotion)?.hex}25 0%, transparent 70%)` 
                                    : 'radial-gradient(circle at center, rgba(139,92,246,0.05) 0%, transparent 70%)' 
                            }} 
                        />
                        
                        {/* Grid Pattern with Parallax */}
                        <motion.div 
                            style={{ x: isMobile ? 0 : layerX, y: isMobile ? 0 : layerY }}
                            className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"
                        />

                        {/* UNIQUE EMOTION ANIMATIONS (RESTORED FROM OLD CODE) */}
                        <AnimatePresence>
                            {/* === HAPPY / JOY === */}
                            {activeEmotion === 'happy' && (
                                <motion.div 
                                    key={`happy-${triggerKey}`} 
                                    className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden"
                                >
                                     <motion.div 
                                        initial={{ opacity: 0, rotate: 0, scale: 0.5 }}
                                        animate={{ opacity: 0.3, rotate: 180, scale: 1.5 }}
                                        transition={{ duration: 3, ease: "circOut" }}
                                        className="absolute w-[600px] h-[600px] rounded-full"
                                        style={{
                                            background: 'conic-gradient(from 0deg, transparent 0%, #22c55e 10%, transparent 20%, #86efac 30%, transparent 40%, #22c55e 50%, transparent 60%, #86efac 70%, transparent 80%, #22c55e 90%, transparent 100%)',
                                            filter: 'blur(40px)'
                                        }}
                                     />
                                     <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [0, 1.2, 0.8] }}
                                        transition={{ duration: 0.8, ease: "backOut" }}
                                        className="absolute w-40 h-40 bg-green-500/20 rounded-full blur-2xl"
                                     />
                                     {joyParticles.map((p) => (
                                         <motion.div
                                             key={p.id}
                                             initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                                             animate={{ x: p.x, y: p.y, scale: [0, p.scale, 0], opacity: [0, 1, 0], rotate: p.rotate }}
                                             transition={{ duration: p.duration, delay: p.delay, ease: "circOut" }}
                                             className="absolute"
                                         >
                                             <StarIcon className="w-4 h-4" style={{ color: p.color, filter: `drop-shadow(0 0 5px ${p.color})` }} />
                                         </motion.div>
                                     ))}
                                </motion.div>
                            )}

                            {/* === LOVE === */}
                            {activeEmotion === 'love' && (
                                <motion.div 
                                    key={`love-${triggerKey}`} 
                                    className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
                                >
                                     <motion.div
                                         initial={{ opacity: 0 }}
                                         animate={{ opacity: 0.3 }}
                                         exit={{ opacity: 0 }}
                                         transition={{ duration: 1 }}
                                         className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.3)_0%,transparent_70%)] blur-xl"
                                     />
                                     <motion.div
                                        initial={{ scale: 0, opacity: 0.8, borderWidth: '2px' }}
                                        animate={{ scale: 2.5, opacity: 0, borderWidth: '0px' }}
                                        transition={{ duration: 1, ease: "circOut" }}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-pink-500 shadow-[0_0_50px_#ec4899] blur-sm"
                                        style={{ borderStyle: 'solid' }}
                                     />
                                     {loveParticles.map((p) => (
                                         <motion.div
                                             key={p.id}
                                             className="absolute top-1/2 left-1/2 drop-shadow-lg"
                                             initial={{ x: p.startX, y: p.startY, scale: 0, opacity: 0, rotate: p.rotateStart }}
                                             animate={{ x: p.endX, y: p.endY, scale: [0, p.scale * 1.2, p.scale], opacity: [0, 1, 1, 0], rotate: p.rotateEnd }}
                                             transition={{ duration: p.duration, delay: p.delay, ease: [0.22, 1, 0.36, 1], times: [0, 0.15, 0.4, 1] }}
                                             style={{ filter: `blur(${p.blur}px)`, zIndex: p.zIndex }}
                                         >
                                             <HeartIcon className="w-8 h-8 md:w-12 md:h-12" style={{ fill: p.fill }} />
                                         </motion.div>
                                     ))}
                                </motion.div>
                            )}

                            {/* === HYPE (FYRE) === */}
                            {activeEmotion === 'hype' && (
                                <motion.div 
                                    key={`hype-${triggerKey}`} 
                                    className="absolute inset-0 z-0 pointer-events-none flex items-end justify-center pb-12"
                                >
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.4 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.8 }}
                                            className="absolute bottom-0 inset-x-0 h-3/4 bg-gradient-to-t from-orange-600/30 via-orange-500/10 to-transparent"
                                        />
                                        <motion.div
                                            initial={{ opacity: 1, scale: 0 }}
                                            animate={{ opacity: 0, scale: 2.5 }}
                                            transition={{ duration: 0.5, ease: "circOut" }}
                                            className="absolute bottom-0 w-60 h-40 bg-orange-200 rounded-full blur-[50px] mix-blend-hard-light"
                                        />
                                        {[...Array(25)].map((_, i) => (
                                            <motion.div
                                                key={`flame-${i}`}
                                                initial={{ opacity: 0, y: 50, scale: 0.5, x: (Math.random() - 0.5) * 50 }}
                                                animate={{ opacity: [0, 1, 0], y: -300 - Math.random() * 150, x: (Math.random() - 0.5) * 200, scale: [0.5, 2.5, 0.8] }}
                                                transition={{ duration: 0.8 + Math.random() * 0.4, delay: Math.random() * 0.1, ease: "easeOut" }}
                                                className="absolute bottom-0 w-24 h-24 rounded-full blur-[20px] mix-blend-screen"
                                                style={{ backgroundColor: i % 3 === 0 ? '#fbbf24' : (i % 2 === 0 ? '#f97316' : '#ef4444') }}
                                            />
                                        ))}
                                </motion.div>
                            )}

                            {/* === SHOCK (NEUTRAL/ELECTRIC WHITE) === */}
                            {activeEmotion === 'shock' && (
                                <motion.div 
                                    key={`shock-${triggerKey}`} 
                                    className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center"
                                >
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.2 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_60%)]"
                                        />
                                        <motion.div
                                            initial={{ opacity: 1 }}
                                            animate={{ opacity: [1, 0] }}
                                            transition={{ duration: 0.1, ease: "linear" }}
                                            className="absolute inset-0 bg-white mix-blend-overlay z-50"
                                        />
                                        <motion.div
                                            className="absolute inset-0 bg-white/10 mix-blend-color-dodge z-10"
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: [0, -20, 20, -10, 0], opacity: [0, 0.5, 0] }}
                                            transition={{ duration: 0.4 }}
                                        />
                                        <motion.div
                                            initial={{ scale: 0, opacity: 1, borderWidth: '10px' }}
                                            animate={{ scale: 2.2, opacity: 0, borderWidth: '0px' }}
                                            transition={{ duration: 0.4, ease: "circOut" }}
                                            className="absolute w-[300px] h-[300px] rounded-full border-white blur-[2px] shadow-[0_0_80px_#ffffff] z-20"
                                            style={{ borderStyle: 'solid' }}
                                        />
                                        <svg className="absolute inset-0 w-full h-full overflow-visible z-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            {lightningPaths.map((path, i) => (
                                                <motion.path
                                                    key={`bolt-${i}`}
                                                    d={path}
                                                    stroke="#fff"
                                                    strokeWidth="0.5"
                                                    fill="none"
                                                    filter="url(#glow-shock)"
                                                    vectorEffect="non-scaling-stroke"
                                                    initial={{ pathLength: 0, opacity: 0 }}
                                                    animate={{ pathLength: [0, 1], opacity: [0, 1, 0], strokeWidth: [1.5, 0.5, 0] }}
                                                    transition={{ duration: 0.25, delay: Math.random() * 0.1, ease: "linear" }}
                                                />
                                            ))}
                                        </svg>
                                </motion.div>
                            )}

                            {/* === CLAP / SUPPORT (EXACT CONFETTI BLAST) === */}
                            {activeEmotion === 'clap' && (
                                <motion.div 
                                    key={`clap-${triggerKey}`} 
                                    className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden"
                                >
                                     <motion.div 
                                        initial={{ opacity: 0, height: '0%' }}
                                        animate={{ opacity: 0.6, height: '120%' }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-[-20%] w-[300px] bg-gradient-to-b from-yellow-300/20 via-yellow-500/5 to-transparent blur-xl"
                                        style={{ transform: 'perspective(500px) rotateX(10deg)' }}
                                     />
                                     <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 0.4 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute bottom-20 w-[400px] h-20 bg-yellow-500/30 rounded-[100%] blur-3xl"
                                     />
                                     {clapParticles.map((p) => (
                                         <motion.div
                                             key={p.id}
                                             className="absolute w-2 h-3"
                                             initial={{ x: p.startX, y: 600, opacity: 0, rotate: 0 }}
                                             animate={{ 
                                                 x: [p.startX, p.midX, p.finalX], 
                                                 y: [600, p.midY, p.finalY], 
                                                 opacity: [0, 1, 0], 
                                                 rotate: p.rotateAmount,
                                                 rotateX: p.rotationAxis === 'rotateX' ? p.rotateAmount : 0,
                                                 rotateY: p.rotationAxis === 'rotateY' ? p.rotateAmount : 0,
                                             }}
                                             transition={{ duration: p.duration, delay: p.delay, ease: ["circOut", "easeInOut"], times: [0, 0.15, 1] }}
                                             style={{ backgroundColor: p.color, boxShadow: '0 0 5px rgba(255,215,0,0.5)' }}
                                         />
                                     ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Device Image Stack (PRESERVED NEW STRUCTURE & PADDING) */}
                        <motion.div 
                            style={{ 
                                maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                                WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                                x: isMobile ? 0 : layerX,
                                y: isMobile ? 0 : layerY
                            }}
                            className="relative z-10 w-full max-w-[280px] lg:max-w-[400px] aspect-[4/5]"
                        >
                             {activeEmotion === 'shock' && (
                                <>
                                    <motion.img 
                                        key="ghost-r"
                                        src={emotionImages['shock']}
                                        className="absolute inset-0 w-full h-full object-contain opacity-50 mix-blend-screen p-4 md:p-6"
                                        initial={{ x: 0 }}
                                        animate={{ x: [-5, 5, -5, 0], opacity: [0.5, 0.8, 0] }}
                                        transition={{ duration: 0.3 }}
                                        style={{ filter: 'grayscale(100%)' }}
                                    />
                                    <motion.img 
                                        key="ghost-b"
                                        src={emotionImages['shock']}
                                        className="absolute inset-0 w-full h-full object-contain opacity-50 mix-blend-screen p-4 md:p-6"
                                        initial={{ x: 0 }}
                                        animate={{ x: [5, -5, 5, 0], opacity: [0.5, 0.8, 0] }}
                                        transition={{ duration: 0.3 }}
                                        style={{ filter: 'invert(100%)' }}
                                    />
                                </>
                             )}

                            <div className="absolute inset-0 w-full h-full pointer-events-none">
                                {/* Base Image */}
                                <motion.img 
                                    src={staticImage}
                                    alt="Streamyst Wearable Base"
                                    initial={false}
                                    animate={{ filter: 'none' }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0 w-full h-full object-contain p-4 md:p-6"
                                />
                                <AnimatePresence>
                                    {activeEmotion && emotionImages[activeEmotion] !== staticImage && (
                                        <motion.img 
                                            key={activeEmotion}
                                            src={emotionImages[activeEmotion]}
                                            alt="Streamyst Wearable Active"
                                            initial={{ opacity: 0 }}
                                            animate={{ 
                                                opacity: 1, 
                                                filter: `drop-shadow(0 0 20px ${activeEmotionData?.hex || 'white'})`
                                            }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.4 }}
                                            className="absolute inset-0 w-full h-full object-contain z-20 p-4 md:p-6"
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>

                    </div>

                    {/* RIGHT COLUMN: CONTROL PANEL */}
                    <motion.div 
                        className="lg:col-span-5 bg-[#05040a]/90 backdrop-blur-md p-4 lg:p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/5 relative z-30 transition-transform duration-100"
                        style={{
                            x: isMobile ? 0 : layerX, 
                            y: isMobile ? 0 : layerY
                        }}
                    >
                        {/* CHAT INTERFACE */}
                        <div className="flex-1 flex flex-col h-[100px] lg:h-auto lg:min-h-[220px] mb-4 relative">
                            <div className="flex items-center justify-between text-gray-400 border-b border-white/10 pb-2 mb-2">
                                <div className="flex items-center gap-2">
                                    <Wifi className="w-3 h-3 lg:w-4 lg:h-4 text-violet-500" />
                                    <span className="text-[9px] lg:text-[10px] font-mono tracking-widest uppercase">Live Connection</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[10px] font-mono font-bold text-white">12.4k</span>
                                </div>
                            </div>

                            <div className="relative flex-1 bg-black/40 rounded-xl border border-white/5 overflow-hidden flex flex-col">
                                 <div 
                                    ref={chatScrollRef}
                                    className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-hide scroll-smooth"
                                 >
                                    <AnimatePresence initial={false}>
                                        {messages.slice(isMobile ? -5 : -8).map((msg) => (
                                            <motion.div 
                                                key={msg.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className={`text-[10px] md:text-xs leading-relaxed ${msg.isSystem ? 'italic opacity-60' : ''}`}
                                            >
                                                {!msg.isSystem && (
                                                    <span className={`font-bold mr-2 ${msg.color}`}>{msg.user}:</span>
                                                )}
                                                <span className="text-gray-300">{msg.text}</span>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                 </div>
                                 <div className="hidden lg:flex p-2 bg-white/5 border-t border-white/5 gap-2 items-center">
                                     <div className="flex-1 h-6 bg-black/50 rounded flex items-center px-2 text-[10px] text-gray-500">
                                         React with emojis below...
                                     </div>
                                 </div>
                            </div>
                        </div>

                        {/* INTERACTION CONTROLS */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-3 h-3 text-violet-400 animate-pulse" />
                                <span className="text-[9px] font-bold text-violet-200 tracking-wider uppercase">Send Feedback</span>
                            </div>
                            
                            {/* Grid changes for mobile: single row (grid-cols-5) vs multi-row desktop */}
                            <div className="grid grid-cols-5 lg:grid-cols-3 gap-2 lg:gap-3">
                                {emotions.map((e) => (
                                    <motion.button
                                        key={e.id}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => triggerReaction(e.id)}
                                        className={`
                                            relative h-12 lg:h-14 rounded-xl border border-white/10 overflow-hidden group transition-all duration-300
                                            ${activeEmotion === e.id ? 'bg-white/10 border-white/40 ring-1 ring-white/20' : 'bg-white/5 hover:bg-white/10'}
                                        `}
                                    >
                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity ${e.color}`} />
                                        
                                        <div className="relative z-10 flex flex-col items-center justify-center h-full">
                                            <span className="text-xl lg:text-2xl mb-0 lg:mb-1 filter drop-shadow-lg group-hover:scale-110 transition-transform duration-200">{e.emoji}</span>
                                            <span className="hidden lg:block text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">{e.label}</span>
                                        </div>

                                        {activeEmotion === e.id && (
                                            <motion.div 
                                                layoutId="activeLine"
                                                className={`absolute bottom-0 left-0 w-full h-0.5 ${e.color} shadow-[0_0_10px_currentColor]`}
                                            />
                                        )}
                                    </motion.button>
                                ))}
                            </div>

                            <div className="mt-4 pt-3 border-t border-white/5">
                                <p className="text-[9px] lg:text-[10px] text-gray-600 font-mono leading-relaxed">
                                    &gt; STREAM STATUS: LIVE <br/>
                                    &gt; WAITING FOR INPUT... <span className="animate-pulse text-violet-500">_</span>
                                </p>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
