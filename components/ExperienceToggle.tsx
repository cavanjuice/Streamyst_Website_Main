
import React from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Activity, Zap, DollarSign, Radio, Users, Heart } from 'lucide-react';

type Role = 'streamer' | 'viewer';

interface ExperienceToggleProps {
  role: Role;
  setRole: (role: Role) => void;
}

const ExperienceToggle: React.FC<ExperienceToggleProps> = ({ role, setRole }) => {

  const streamerData = {
    title: "THE BROADCASTER",
    subtitle: "Level 99 Creator",
    description: "Equipped with the Vybe, you translate audience sentiment into physical feedback. You don't just read the chat—you feel the room.",
    image: "https://raw.githubusercontent.com/cavanjuice/assets/main/DSC006262.png",
    color: "from-cyan-400 to-blue-600",
    accent: "text-cyan-400",
    border: "border-cyan-500/30",
    stats: [
      { label: "Stand out", value: 98 },
      { label: "Interact", value: 90 },
      { label: "Reflect the energy", value: 100 },
    ],
    abilities: [
      { icon: <Activity className="w-5 h-5" />, name: "Feel the Crowd", desc: "Haptic response to chat velocity." },
      { icon: <Zap className="w-5 h-5" />, name: "Energy Link", desc: "Visual bio-feedback loop." },
      { icon: <DollarSign className="w-5 h-5" />, name: "Monetize", desc: "Premium interaction revenue." },
    ]
  };

  const viewerData = {
    title: "THE AUDIENCE",
    subtitle: "Community MVP",
    description: "No longer a passive observer. Your reactions trigger real-time lighting and haptic events for the streamer. Your hype matters.",
    image: "https://raw.githubusercontent.com/cavanjuice/assets/main/IMG_20250504_121801.png",
    color: "from-fuchsia-500 to-purple-600",
    accent: "text-fuchsia-400",
    border: "border-fuchsia-500/30",
    stats: [
      { label: "Express", value: 95 },
      { label: "Influence", value: 85 },
      { label: "Connect", value: 100 },
    ],
    abilities: [
      { icon: <Radio className="w-5 h-5" />, name: "Direct Impact", desc: "Trigger real-world device feedback." },
      { icon: <Users className="w-5 h-5" />, name: "Hive Mind", desc: "Sync colors with other viewers." },
      { icon: <Heart className="w-5 h-5" />, name: "Express", desc: "Send physical heartbeats." },
    ]
  };

  const currentData = role === 'streamer' ? streamerData : viewerData;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const springConfig = { stiffness: 40, damping: 20, mass: 1.2 };
  
  const charX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
  const charY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-15, 15]), springConfig);
  
  const bgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [10, -10]), springConfig);
  const bgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);

  return (
    <section 
      id="choose-player" 
      className="py-24 md:py-32 relative z-10 overflow-hidden bg-black/20"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8"
          >
             <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-gray-700" />
             <span className="text-gray-500 font-display font-bold tracking-[0.4em] text-[10px] uppercase">CHOOSE YOUR PATH</span>
             <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-gray-700" />
          </motion.div>

          <div className="relative inline-flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md shadow-2xl">
             <motion.div 
               className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] z-0`}
               layout
               initial={false}
               animate={{ 
                   left: role === 'streamer' ? 4 : 'calc(50% + 0px)',
                   backgroundImage: role === 'streamer' ? 'linear-gradient(to right, #06b6d4, #2563eb)' : 'linear-gradient(to right, #d946ef, #9333ea)'
               }}
               transition={{ type: "spring", stiffness: 400, damping: 40 }}
             />
             <button
               onClick={() => setRole('streamer')}
               className={`relative z-10 px-8 py-3 rounded-full font-bold font-display tracking-[0.1em] transition-colors duration-300 w-36 md:w-44 text-[11px] md:text-xs ${role === 'streamer' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
             >
               STREAMER
             </button>
             <button
               onClick={() => setRole('viewer')}
               className={`relative z-10 px-8 py-3 rounded-full font-bold font-display tracking-[0.1em] transition-colors duration-300 w-36 md:w-44 text-[11px] md:text-xs ${role === 'viewer' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
             >
               VIEWER
             </button>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto">
             <AnimatePresence mode="wait">
                <motion.div 
                    key={role}
                    initial={{ opacity: 0, x: role === 'streamer' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: role === 'streamer' ? 20 : -20 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center"
                >
                    <div className="lg:col-span-5 relative h-[450px] lg:h-[650px] flex items-center justify-center order-2 lg:order-1 perspective-1000">
                        <motion.div 
                            className={`absolute inset-0 border-[1.5px] rounded-[3rem] opacity-10 ${currentData.border}`}
                            animate={{ rotate: [0, 3, 0] }}
                            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                            style={{ x: bgX, y: bgY }}
                        />
                        
                         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px] transition-colors duration-700 opacity-30 ${role === 'streamer' ? 'bg-cyan-500' : 'bg-fuchsia-500'}`} />

                        <motion.div
                           className="relative z-10 w-full h-full max-w-[320px] lg:max-w-none"
                           style={{ x: charX, y: charY }}
                        >
                            <img 
                                src={currentData.image}
                                alt={currentData.title}
                                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                            />
                        </motion.div>

                        <motion.div 
                            className="absolute top-12 left-0 p-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl font-mono text-[9px] text-gray-500 shadow-2xl"
                            style={{ x: bgX, y: bgY }}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${role === 'streamer' ? 'bg-cyan-400' : 'bg-fuchsia-400'} animate-pulse`} />
                                <span className="text-white font-bold opacity-80">LATENCY: 4MS</span>
                            </div>
                            PORT: {role === 'streamer' ? '8080' : '443'}
                        </motion.div>
                    </div>

                    <div className="lg:col-span-7 order-1 lg:order-2">
                        <div className={`inline-block px-3 py-1 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm mb-6`}>
                             <span className={`font-mono text-[10px] font-bold tracking-[0.2em] uppercase ${currentData.accent}`}>
                                 {currentData.subtitle}
                             </span>
                        </div>
                        
                        <motion.h2 
                            className="font-display font-bold text-4xl md:text-6xl mb-6 tracking-tight"
                            initial={{ y: 15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                             <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentData.color} italic`}>
                                {currentData.title}
                             </span>
                        </motion.h2>

                        <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-10 max-w-2xl font-light">
                            {currentData.description}
                        </p>

                        <div className="space-y-6 mb-12 max-w-md">
                            {currentData.stats.map((stat, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">{stat.label}</span>
                                        <span className={`text-[10px] font-mono ${currentData.accent}`}>{stat.value}%</span>
                                    </div>
                                    <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            className={`h-full bg-gradient-to-r ${currentData.color}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.value}%` }}
                                            transition={{ duration: 1.2, delay: 0.3 + (i * 0.1), ease: "circOut" }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                            {currentData.abilities.map((ability, i) => (
                                <motion.div 
                                    key={i}
                                    className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl hover:bg-white/[0.06] hover:border-white/10 transition-all group cursor-default"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                >
                                    <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${currentData.accent}`}>
                                        {ability.icon}
                                    </div>
                                    <h4 className="font-bold text-[13px] text-white mb-2">{ability.name}</h4>
                                    <p className="text-[11px] text-gray-500 leading-normal">{ability.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
             </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ExperienceToggle;
