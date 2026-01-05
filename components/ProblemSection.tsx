
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Users, Frown, Sword, Gem, Star, Crown, Gift, Smile, Settings, EyeOff, MonitorStop, Ghost, Lock, BatteryWarning, Play } from 'lucide-react';

interface ProblemSectionProps {
  role: 'streamer' | 'viewer';
}

const ProblemSection: React.FC<ProblemSectionProps> = ({ role }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  const streamerProblems = [
      {
          icon: <EyeOff className="w-6 h-6 text-red-400" />,
          title: "Not feeling seen",
          desc: "Discovery and growth are limited"
      },
      {
          icon: <MessageSquare className="w-6 h-6 text-red-400" />,
          title: "Chat overload",
          desc: "Messages flying by faster than you can read them"
      },
      {
          icon: <Settings className="w-6 h-6 text-red-400" />,
          title: "Complex setups",
          desc: "Interactive tools require complicated setups"
      },
      {
          icon: <Frown className="w-6 h-6 text-red-400" />,
          title: "Missed moments",
          desc: "Unable to feel the energy of epic chat reactions"
      }
  ];

  const viewerProblems = [
      {
          icon: <Ghost className="w-6 h-6 text-fuchsia-400" />,
          title: "Lost in the crowd",
          desc: "Chat goes so fast, you feel invisible and anonymous"
      },
      {
          icon: <Lock className="w-6 h-6 text-fuchsia-400" />,
          title: "Limited agency",
          desc: "You want to participate but can't fully be a meaningful part"
      },
      {
          icon: <BatteryWarning className="w-6 h-6 text-fuchsia-400" />,
          title: "Social Fatigue",
          desc: "Not easy to find the streaming community that fits you"
      },
      {
          icon: <MonitorStop className="w-6 h-6 text-fuchsia-400" />,
          title: "Interrupted",
          desc: "Ads really break the immersion of the experience"
      }
  ];

  const currentProblems = role === 'streamer' ? streamerProblems : viewerProblems;

  // --- Chat Simulation Logic (For Streamer) ---
  
  interface ChatMessage {
    id: number;
    user: string;
    color: string;
    text: string;
    badges: ('mod' | 'vip' | 'sub' | 'prime' | null)[];
  }

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(0);

  const generateMessage = () => {
      const users = ["NeonNinja", "PixelPioneer", "CyberSamurai", "GlitchGamer", "VaporWave99", "RetroRider", "QuantumQueen", "DigitalDruid", "TechnoTitan", "StreamLover45", "ChatSpammer40", "NightOwl_92", "Lurker_007", "SpeedRunner", "CoolDude123", "xX_Slayer_Xx", "NoobMaster69", "TwitchKitten"];
      
      const colors = [
          "text-[#FF0000]", "text-[#0000FF]", "text-[#008000]", "text-[#B22222]", "text-[#FF7F50]", 
          "text-[#9ACD32]", "text-[#FF4500]", "text-[#2E8B57]", "text-[#DAA520]", "text-[#D2691E]", 
          "text-[#5F9EA0]", "text-[#1E90FF]", "text-[#FF69B4]", "text-[#8A2BE2]", "text-[#00FF7F]"
      ];

      const texts = [
        "POG", "LUL", "OMEGALUL", "HYPE 🔥", "🔥🔥🔥🔥🔥", "Can't believe that happened!", "stream looks crisp", 
        "what resolution is this?", "hello from brazil", "first", "gg", "ez clap", "no way", "RIP", "F",
        "playing so well today", "song name?", "vibes", "Wait what???", "clutch", "monkaS", "Kappa",
        "so many viewers wow", "let's gooooo", "Streamyst is the future", "insane gameplay", "lol", "nice", 
        "hi chat", "PogChamp", "KEKW", "NotLikeThis", "BibleThump", "Rigged", "????????", "clip that", "modCheck"
      ];
      
      const badgeTypes: ('mod' | 'vip' | 'sub' | 'prime' | null)[] = ['mod', 'vip', 'sub', 'prime', null, null, null, null, null, null];
      
      const numBadges = Math.random() > 0.7 ? (Math.random() > 0.8 ? 2 : 1) : 0;
      const selectedBadges = [];
      for(let i=0; i<numBadges; i++) {
          const b = badgeTypes[Math.floor(Math.random() * badgeTypes.length)];
          if (b && !selectedBadges.includes(b)) selectedBadges.push(b);
      }

      msgIdRef.current += 1;

      return {
          id: msgIdRef.current,
          user: users[Math.floor(Math.random() * users.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          text: texts[Math.floor(Math.random() * texts.length)],
          badges: selectedBadges
      };
  };

  useEffect(() => {
    // Only run simulation if role is streamer
    if (role !== 'streamer') return;

    const initial = Array.from({ length: 12 }, () => generateMessage());
    setMessages(initial);

    let timeoutId: ReturnType<typeof setTimeout>;
    let isBursting = false;
    let burstRemaining = 0;

    const scheduleNextMessage = () => {
        if (!isBursting && Math.random() > 0.92) {
            isBursting = true;
            burstRemaining = Math.floor(Math.random() * 15) + 5; 
        }

        let delay;
        if (isBursting) {
            delay = Math.random() * 150 + 50; 
            burstRemaining--;
            if (burstRemaining <= 0) isBursting = false;
        } else {
            if (Math.random() > 0.7) {
                delay = Math.random() * 1000 + 800; 
            } else {
                delay = Math.random() * 600 + 200; 
            }
        }

        timeoutId = setTimeout(() => {
            setMessages(prev => {
                const newMsg = generateMessage();
                if (isBursting && Math.random() > 0.3 && prev.length > 0) {
                     newMsg.text = prev[prev.length - 1].text; 
                }
                const updated = [...prev, newMsg];
                if (updated.length > 20) return updated.slice(updated.length - 20);
                return updated;
            });
            scheduleNextMessage();
        }, delay);
    };

    scheduleNextMessage();
    return () => clearTimeout(timeoutId);
  }, [role]);

  useEffect(() => {
      if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
  }, [messages, role]);

  return (
    <section className="py-24 md:py-32 relative z-10 overflow-hidden">
      {/* 
         Fixed Background Transition 
      */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] -z-10 pointer-events-none">
          <div 
            className="absolute inset-0" 
            style={{ 
              background: 'radial-gradient(ellipse at center, rgba(13, 11, 26, 0.6) 0%, transparent 70%)' 
            }}
          />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="font-display font-bold text-4xl md:text-5xl mb-6"
            >
                Streaming <span className="text-gray-500">should be connective</span>
            </motion.h2>
            <motion.p 
                key={role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto"
            >
                {role === 'streamer' 
                    ? "Whether you're big or small, you're pouring your heart into every stream, but the digital barrier still keeps you from truly feeling your community."
                    : "You're trying your best to be part of the stream, but the digital barrier keeps you from truly connecting with the creators."
                }
            </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Problem Cards */}
            <motion.div 
                key={`${role}-cards`}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid sm:grid-cols-2 gap-6"
            >
                {currentProblems.map((problem, i) => (
                    <motion.div key={i} variants={itemVariants} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-colors backdrop-blur-sm">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${role === 'streamer' ? 'bg-red-500/10' : 'bg-fuchsia-500/10'}`}>
                            {problem.icon}
                        </div>
                        <h3 className="font-bold text-xl text-white mb-2">{problem.title}</h3>
                        <p className="text-gray-400 text-sm">{problem.desc}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Right: Visual (Chat Simulator for Streamer / Viewer Ad Interrupt for Viewer) */}
            <motion.div
                key={`${role}-visual`}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="relative"
            >
                {role === 'streamer' ? (
                    /* STREAMER VISUAL: CHAT OVERLOAD */
                    <div className="bg-[#18181b] border border-[#26262c] rounded-lg overflow-hidden shadow-2xl max-w-sm mx-auto h-[480px] flex flex-col font-sans relative z-10">
                        {/* Header */}
                        <div className="h-10 border-b border-[#26262c] flex justify-between items-center px-3 bg-[#18181b] shrink-0">
                            <div className="flex items-center space-x-2">
                                <div className="rotate-90 p-1 hover:bg-[#26262c] rounded cursor-pointer">
                                    <svg width="16" height="16" viewBox="0 0 20 20" fill="#adadb8"><path d="M14 8l-4-4-4 4"></path><path d="M10 4v12"></path></svg>
                                </div>
                                <span className="text-[#efeff1] text-xs font-bold uppercase tracking-wide">Stream Chat</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-[#adadb8]" />
                                <span className="text-[#adadb8] text-xs font-semibold">12.8k</span>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div 
                            ref={chatContainerRef}
                            className="flex-1 overflow-hidden relative flex flex-col bg-[#18181b] p-2 space-y-0.5"
                        >
                            <AnimatePresence initial={false}>
                                {messages.map((msg) => (
                                    <motion.div 
                                        key={msg.id}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-[13px] leading-5 px-2 py-0.5 hover:bg-[#26262c] rounded transition-colors break-words"
                                    >
                                        <span className="inline-flex items-center align-middle mr-1.5 space-x-0.5 select-none">
                                            {msg.badges.map((badge, idx) => (
                                                <span key={idx} className="inline-block">
                                                    {badge === 'mod' && <div className="w-4 h-4 bg-[#00ad03] rounded flex items-center justify-center"><Sword size={10} className="text-white fill-current" /></div>}
                                                    {badge === 'vip' && <div className="w-4 h-4 bg-[#e005b9] rounded flex items-center justify-center"><Gem size={10} className="text-white fill-current" /></div>}
                                                    {badge === 'sub' && <div className="w-4 h-4 bg-[#8205b4] rounded flex items-center justify-center"><Star size={10} className="text-white fill-current" /></div>}
                                                    {badge === 'prime' && <div className="w-4 h-4 bg-[#0073e6] rounded flex items-center justify-center"><Crown size={10} className="text-white fill-current" /></div>}
                                                </span>
                                            ))}
                                        </span>
                                        <span className={`font-bold ${msg.color} hover:underline cursor-pointer mr-1`}>
                                            {msg.user}
                                        </span>
                                        <span className="text-[#adadb8] mr-1">:</span>
                                        <span className="text-[#efeff1]">{msg.text}</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-[#18181b] shrink-0">
                            <div className="relative">
                                <div className="w-full bg-[#26262c] rounded flex items-center p-2 border-2 border-transparent focus-within:border-[#a970ff] transition-colors">
                                    <span className="text-[#adadb8] text-xs">Send a message</span>
                                </div>
                                <div className="flex justify-between items-center mt-2 px-1">
                                    <div className="flex space-x-2">
                                        <div className="text-[#adadb8] hover:bg-[#26262c] p-1 rounded cursor-pointer"><div className="w-5 h-5 flex items-center justify-center border border-[#adadb8] rounded text-[10px] font-bold">💎</div></div>
                                        <div className="text-[#adadb8] hover:bg-[#26262c] p-1 rounded cursor-pointer"><Gift size={18} /></div>
                                    </div>
                                    <div className="flex space-x-2 items-center">
                                        <div className="text-[#adadb8] hover:bg-[#26262c] p-1 rounded cursor-pointer"><Smile size={18} /></div>
                                        <div className="bg-[#9147ff] text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-[#772ce8] cursor-pointer">Chat</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* VIEWER VISUAL: AD INTERRUPTION / DISCONNECT */
                    <div className="bg-[#0A0A0B] border border-white/10 rounded-lg overflow-hidden shadow-2xl max-w-sm mx-auto h-[480px] flex flex-col font-sans relative z-10 group">
                        {/* Video Area (Blurred/Blocked) */}
                        <div className="flex-1 bg-gray-900 relative flex items-center justify-center overflow-hidden">
                             {/* Fake Stream Background */}
                             <div className="absolute inset-0 bg-cosmic-800 opacity-50 blur-sm flex items-center justify-center">
                                 <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-30 grayscale" alt="Stream BG" />
                             </div>
                             
                             {/* AD Overlay */}
                             <div className="absolute top-4 right-4 bg-black/80 px-3 py-1 rounded text-[10px] font-bold text-gray-400 border border-white/10 z-20">
                                 Ad 1 of 2 · 0:15
                             </div>

                             <div className="relative z-10 text-center p-6 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 max-w-[80%]">
                                 <MonitorStop className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                                 <h3 className="text-white font-bold text-lg mb-1">Commercial Break</h3>
                                 <p className="text-gray-400 text-xs">This ad supports the streamer.</p>
                                 <div className="mt-4 w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                                     <div className="h-full bg-yellow-500 w-1/3"></div>
                                 </div>
                             </div>

                             {/* Play controls (fake) */}
                             <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/80 to-transparent flex items-center px-4 gap-4">
                                <Play className="w-4 h-4 text-white fill-white" />
                                <div className="h-1 bg-white/30 rounded flex-1"></div>
                             </div>
                        </div>

                        {/* Chat Area (Static/Fast) */}
                        <div className="h-1/3 border-t border-white/10 bg-[#18181b] p-2 overflow-hidden relative">
                             {/* Fast scrolling blur effect */}
                             <div className="space-y-2 opacity-50 blur-[1px]">
                                <div className="h-3 bg-white/10 rounded w-3/4"></div>
                                <div className="h-3 bg-white/10 rounded w-1/2"></div>
                                <div className="h-3 bg-white/10 rounded w-5/6"></div>
                                <div className="h-3 bg-white/10 rounded w-2/3"></div>
                                <div className="h-3 bg-white/10 rounded w-full"></div>
                                <div className="h-3 bg-white/10 rounded w-1/2"></div>
                             </div>
                             <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                 <span className="text-xs text-gray-500 font-mono">Chat paused due to scroll speed</span>
                             </div>
                        </div>
                    </div>
                )}
                
                {/* Back glow for visual integration */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[90%] blur-3xl -z-0 rounded-full ${role === 'streamer' ? 'bg-violet-900/10' : 'bg-fuchsia-900/10'}`}></div>
            </motion.div>
        </div>

      </div>
    </section>
  );
};

export default ProblemSection;
