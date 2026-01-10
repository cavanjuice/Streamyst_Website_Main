
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, DollarSign, Radio, Users, Heart } from 'lucide-react';

interface SolutionSectionProps {
  role: 'streamer' | 'viewer';
}

const SolutionSection: React.FC<SolutionSectionProps> = ({ role }) => {

  const streamerData = {
    title: "THE BROADCASTER",
    subtitle: "Level 99 Creator",
    description: "Equipped with the Vybe, you translate audience sentiment into physical feedback. You don't just read the chat—you feel the room.",
    color: "from-violet-500 to-indigo-600",
    accent: "text-violet-400",
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
    color: "from-orange-400 to-red-600",
    accent: "text-orange-400",
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

  return (
    <section className="py-24 md:py-32 relative z-10 overflow-hidden">
      {/* Background - subtle atmospheric glow, blending seamlessly */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[600px] rounded-full blur-[120px] pointer-events-none mix-blend-screen ${role === 'streamer' ? 'bg-violet-900/5' : 'bg-orange-900/5'}`}></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
            className="max-w-5xl mx-auto text-center mb-20"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
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
                        className={`absolute inset-0 blur-3xl rounded-full ${role === 'streamer' ? 'bg-violet-500/20' : 'bg-orange-500/20'}`}
                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    ></motion.span>
                    
                    {/* Main Text */}
                    <span className={`relative text-white italic tracking-wide ${role === 'streamer' ? 'drop-shadow-[0_0_35px_rgba(139,92,246,0.5)]' : 'drop-shadow-[0_0_35px_rgba(249,115,22,0.5)]'}`}>
                        TRULY CONNECT
                    </span>
                    </span> 
                    {role === 'streamer' ? 'with your audience?' : 'with your favourite streamers?'}
                </h2>
            
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{ height: '2rem', opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className={`w-[1px] h-8 bg-gradient-to-b from-transparent to-transparent mx-auto mb-6 ${role === 'streamer' ? 'via-violet-500/30' : 'via-orange-500/30'}`}
                />
            
                <p className="text-gray-300 text-lg md:text-2xl font-light leading-relaxed max-w-3xl mx-auto">
                    {role === 'streamer' ? (
                        <>
                            Interact with your audience like never before. <br className="hidden md:block"/>
                            Use <span className="text-violet-200 font-medium">digital effects</span> that help you understand and resonate with any audience size.
                        </>
                    ) : (
                        <>
                            Interact with your creators and other audiences like never before. <br className="hidden md:block"/>
                            Interact using <span className="text-orange-200 font-medium">digital effects</span> that make you an active part of the stream, reaching common goals.
                        </>
                    )}
                </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* PERSONA DETAILS (Moved from ExperienceToggle) */}
        <div className="max-w-6xl mx-auto">
             <AnimatePresence mode="wait">
                <motion.div 
                    key={role}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Persona Stats & Abilities */}
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start border-t border-white/5 pt-12">
                        {/* Left: Description */}
                        <div>
                            <div className={`inline-block px-3 py-1 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm mb-4`}>
                                 <span className={`font-mono text-[10px] font-bold tracking-[0.2em] uppercase ${currentData.accent}`}>
                                     {currentData.subtitle}
                                 </span>
                            </div>
                            
                            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 tracking-tight">
                                 <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentData.color} italic`}>
                                    {currentData.title}
                                 </span>
                            </h2>

                            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-xl font-light">
                                {currentData.description}
                            </p>

                            <div className="space-y-4">
                                {currentData.stats.map((stat, i) => (
                                    <div key={i} className="group">
                                        <div className="flex justify-between items-end mb-1.5">
                                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
                                            <span className={`text-[10px] font-mono ${currentData.accent}`}>{stat.value}%</span>
                                        </div>
                                        <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                className={`h-full bg-gradient-to-r ${currentData.color}`}
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${stat.value}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.2, delay: 0.3 + (i * 0.1), ease: "circOut" }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Abilities Grid */}
                        <div className="grid sm:grid-cols-2 gap-3 lg:gap-4">
                             {currentData.abilities.map((ability, i) => (
                                <motion.div 
                                    key={i}
                                    className="bg-white/[0.03] border border-white/5 p-4 rounded-xl"
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                >
                                    <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mb-3 ${currentData.accent}`}>
                                        {ability.icon}
                                    </div>
                                    <h4 className="font-bold text-xs text-white mb-1">{ability.name}</h4>
                                    <p className="text-[10px] text-gray-500 leading-normal">{ability.desc}</p>
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

export default SolutionSection;
