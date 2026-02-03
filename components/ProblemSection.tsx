
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Send, Zap, Wind, AlertCircle, MessageSquare } from 'lucide-react';

interface ProblemSectionProps {
  role: 'streamer' | 'viewer';
}

const USERNAMES = [
  "NeonNinja", "PixelPioneer", "CyberSamurai", "GlitchGamer", "VaporWave99", 
  "RetroRider", "QuantumQueen", "DigitalDruid", "TechnoTitan", "StreamLover45", 
  "NightOwl_92", "Lurker_007", "SpeedRunner", "CoolDude123", "xX_Slayer_Xx", 
  "NoobMaster69", "TwitchKitten", "PogChamp2024", "Kappa_Pride", "FrankerZ"
];

const MESSAGES_QUIET = [
  "Hello?", "Anyone here?", "Stream looks good!", "What game is this?", "Hi streamer!",
  "Nice vibe", "How are you today?", "First time chatter", "Lurk mode on", "GG"
];

const MESSAGES_CHAOS = [
  "POG", "LUL", "OMEGALUL", "HYPE 🔥", "🔥🔥🔥🔥🔥", "Can't believe that happened!", 
  "what resolution?", "HELLO FROM BRAZIL", "FIRST", "gg", "ez clap", "no way", "RIP", "F",
  "playing so well today", "song name?", "vibes", "Wait what???", "clutch", "monkaS", "Kappa",
  "LET'S GOOO", "Streamyst is the future", "insane gameplay", "lol", "nice", "POGGERS",
  "CLIP IT", "RIGGED", "????????", "modCheck", "I WAS HERE", "SCAM", "LMAO", "KEKW"
];

const MESSAGES_MISSED = [
  "I've been subbed for 3 years, this stream saved me.",
  "Hey! You missed the secret chest behind the waterfall!",
  "My mom just passed away, your content helps so much.",
  "I just donated $100, did the alert play?",
  "Can you please wish my little brother a happy birthday?",
  "Wait, I think your audio is desynced...",
  "Thank you for being such an inspiration to me."
];

const COLORS = [
  "text-red-400", "text-orange-400", "text-amber-400", "text-yellow-400", 
  "text-lime-400", "text-green-400", "text-emerald-400", "text-teal-400", 
  "text-cyan-400", "text-sky-400", "text-blue-400", "text-indigo-400", 
  "text-violet-400", "text-purple-400", "text-fuchsia-400", "text-pink-400", "text-rose-400"
];

const ProblemSection: React.FC<ProblemSectionProps> = ({ role }) => {
  const [mode, setMode] = useState<'quiet' | 'overload'>('quiet');
  const [messages, setMessages] = useState<{ id: number; user: string; text: string; color: string; isUser?: boolean; isMissed?: boolean }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(0);

  // --- Chat Generation Logic ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const addMessage = (count = 1) => {
      setMessages(prev => {
        const newMsgs = [];
        for (let i = 0; i < count; i++) {
          msgIdRef.current++;
          const isChaos = mode === 'overload';
          
          // 8% chance to inject a "missed" important message during chaos
          const isMissedOpportunity = isChaos && Math.random() < 0.08;

          if (isMissedOpportunity) {
             newMsgs.push({
                id: msgIdRef.current,
                user: USERNAMES[Math.floor(Math.random() * USERNAMES.length)],
                text: MESSAGES_MISSED[Math.floor(Math.random() * MESSAGES_MISSED.length)],
                color: "text-yellow-400", // Gold to imply value
                isMissed: true
             });
          } else {
             const pool = isChaos ? MESSAGES_CHAOS : MESSAGES_QUIET;
             newMsgs.push({
                id: msgIdRef.current,
                user: USERNAMES[Math.floor(Math.random() * USERNAMES.length)],
                text: pool[Math.floor(Math.random() * pool.length)],
                color: COLORS[Math.floor(Math.random() * COLORS.length)]
             });
          }
        }
        
        // Keep buffer size manageable
        const combined = [...prev, ...newMsgs];
        return combined.slice(-100); 
      });
    };

    if (mode === 'quiet') {
      // Slow trickle
      interval = setInterval(() => addMessage(1), 2500);
      // Initial population for quiet
      if (messages.length === 0) addMessage(3);
    } else {
      // CHAOS MODE - Adjusted for ~5000 viewers
      interval = setInterval(() => addMessage(1), 150); 
    }

    return () => clearInterval(interval);
  }, [mode]);

  // --- Auto Scroll ---
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now(),
      user: "YOU",
      text: inputValue,
      color: "text-white",
      isUser: true
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    
    // Force scroll immediately
    setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 10);
  };

  return (
    <section className="py-20 lg:py-28 relative z-10 overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030205] via-[#0A0A0B] to-[#030205] -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-violet-900/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* Header - Unified Style */}
        <div className="text-center mb-12 lg:mb-16 max-w-4xl mx-auto">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.1 }}
                className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 tracking-tight"
            >
                The <span className="text-red-500">Visibility</span> Problem.
            </motion.h2>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto"
            >
                {role === 'streamer' 
                    ? "When the chat moves too fast, you lose the ability to connect with individuals. It becomes a wall of text."
                    : "In a crowded chat, your voice is lost instantly. You're just another line of text scrolling by."
                }
            </motion.p>
        </div>

        {/* --- MAIN INTERFACE (VIDEO LEFT, CHAT RIGHT) --- */}
        {/* FORCE WIDTH using strict CSS function */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: 'min(100%, 700px)' }}
            className="mx-auto bg-[#0A0A0B] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[300px] relative group"
        >
            
            {/* LEFT: VIDEO PLAYER */}
            <div className="flex-1 relative bg-black overflow-hidden flex flex-col justify-between group/video min-h-[200px] lg:min-h-0">
                
                {/* Video Simulation */}
                <div className="absolute inset-0 opacity-70">
                     <video
                        key={role} // Force reload on role change
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={`w-full h-full object-cover transition-transform duration-[20s] ease-linear ${mode === 'overload' ? 'scale-110' : 'scale-100'}`}
                     >
                        <source 
                            src={role === 'streamer' 
                                ? "https://ssdjhkdkoqgmysgncfqa.supabase.co/storage/v1/object/public/assetscompressed/streamersad.mp4" 
                                : "https://ssdjhkdkoqgmysgncfqa.supabase.co/storage/v1/object/public/assetscompressed/viewersad.mp4"
                            } 
                            type="video/mp4" 
                        />
                     </video>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60" />
                </div>

                {/* --- VIDEO OVERLAYS --- */}

                {/* Top Left: Live Status */}
                <div className="relative z-20 p-4 flex justify-between items-start">
                    <div className="flex gap-3">
                        <div className="bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2 shadow-lg">
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            LIVE
                        </div>
                    </div>
                </div>

                {/* CENTER: SIMULATION CONTROLS */}
                <div className="relative z-30 flex flex-col items-center justify-center space-y-3">
                     <div className="bg-black/40 backdrop-blur-md border border-white/10 p-1.5 rounded-full inline-flex items-center gap-1 shadow-2xl">
                          <button 
                            onClick={() => setMode('quiet')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'quiet' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                          >
                             <Wind size={12} />
                             Quiet
                          </button>
                          <button 
                            onClick={() => setMode('overload')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'overload' ? 'bg-red-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                          >
                             <Zap size={12} />
                             Overload
                          </button>
                     </div>
                     
                     <AnimatePresence mode="wait">
                        <motion.div
                            key={mode}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="hidden md:block text-[10px] font-medium text-white/80 bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/5 max-w-xs text-center"
                        >
                            {mode === 'quiet' 
                                ? "Normal chat flow. Individual messages are visible and meaningful." 
                                : "High traffic. Meaningful messages are lost in the noise instantly."}
                        </motion.div>
                     </AnimatePresence>
                </div>

                {/* Bottom Bar: Stream Info */}
                <div className="relative z-20 p-4 flex justify-between items-end">
                    <div className="space-y-0.5 max-w-[70%]">
                    </div>
                    
                    {role === 'viewer' ? (
                        <div className="flex items-center gap-2">
                             <div className="hidden sm:block px-4 py-1.5 rounded-full bg-violet-600 text-[10px] font-bold uppercase tracking-wider hover:bg-violet-500 cursor-pointer transition-colors shadow-lg">
                                Subscribe
                             </div>
                        </div>
                    ) : (
                         <div className="flex gap-2">
                         </div>
                    )}
                </div>

            </div>

            {/* RIGHT: CHAT VISUALIZER - Reduced width from w-72 to w-64 */}
            <div className="w-full lg:w-64 bg-[#05040a] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col relative z-20 shrink-0 h-[250px] lg:h-auto">
                {/* Header Stats */}
                <div className="h-9 border-b border-white/5 flex items-center justify-center md:justify-between px-3 bg-[#0A0A0B]/90 backdrop-blur-md z-10 sticky top-0">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-3 h-3 text-gray-500" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Chat</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-gray-500" />
                        <span className={`font-mono text-xs font-bold transition-colors duration-500 ${mode === 'overload' ? 'text-red-400' : 'text-emerald-400'}`}>
                            {mode === 'overload' ? '5,492' : '12'}
                        </span>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="relative flex-1 overflow-hidden bg-[#05040a]">
                    {/* Gradient Masks */}
                    <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#05040a] to-transparent z-10 pointer-events-none" />
                    
                    <div 
                        ref={scrollRef}
                        className="absolute inset-0 overflow-y-auto px-3 py-4 space-y-1.5 scroll-smooth scrollbar-hide"
                    >
                        {messages.map((msg) => (
                            <motion.div 
                                key={msg.id}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: msg.isMissed ? 0.6 : 1, x: 0 }}
                                className={`
                                    text-xs py-0.5 px-2 rounded flex items-baseline gap-2 leading-relaxed transition-all break-words
                                    ${msg.isUser 
                                        ? 'bg-violet-600/20 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                                        : msg.isMissed
                                            ? 'bg-yellow-500/5 border border-yellow-500/10 grayscale-[0.5]' 
                                            : 'hover:bg-white/5'}
                                `}
                            >
                                {msg.isUser && (
                                    <span className="shrink-0 inline-block px-1.5 py-0.5 rounded bg-violet-600 text-[8px] font-bold text-white uppercase tracking-wider">
                                        YOU
                                    </span>
                                )}
                                {msg.isMissed && (
                                    <AlertCircle size={10} className="text-yellow-500/50 shrink-0 self-center" />
                                )}
                                <span className={`font-bold shrink-0 text-[10px] md:text-xs ${msg.isMissed ? 'text-yellow-500/50' : msg.color}`}>{msg.user}:</span>
                                <span className={`text-[10px] md:text-xs ${msg.isUser ? 'text-white font-medium' : msg.isMissed ? 'text-yellow-100/50 italic' : 'text-gray-300'}`}>{msg.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-3 bg-[#0A0A0B] border-t border-white/5 relative z-20">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={mode === 'overload' ? "Good luck being seen..." : "Say something..."}
                            className="w-full bg-[#1A1830] border border-white/10 rounded-lg py-1.5 pl-3 pr-8 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors text-xs"
                        />
                        <button 
                            type="submit"
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 bg-violet-600 hover:bg-violet-500 text-white rounded transition-colors"
                        >
                            <Send size={10} />
                        </button>
                    </div>
                </form>

                {/* Overload Effect Overlay on Chat */}
                {mode === 'overload' && (
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-red-500/5 z-0" />
                )}
            </div>

        </motion.div>

      </div>
    </section>
  );
};

export default ProblemSection;
