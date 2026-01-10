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

const COLORS = [
  "text-red-400", "text-orange-400", "text-amber-400", "text-yellow-400", 
  "text-lime-400", "text-green-400", "text-emerald-400", "text-teal-400", 
  "text-cyan-400", "text-sky-400", "text-blue-400", "text-indigo-400", 
  "text-violet-400", "text-purple-400", "text-fuchsia-400", "text-pink-400", "text-rose-400"
];

const ProblemSection: React.FC<ProblemSectionProps> = ({ role }) => {
  const [mode, setMode] = useState<'quiet' | 'overload'>('quiet');
  const [messages, setMessages] = useState<{ id: number; user: string; text: string; color: string; isUser?: boolean }[]>([]);
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
          const pool = isChaos ? MESSAGES_CHAOS : MESSAGES_QUIET;
          
          newMsgs.push({
            id: msgIdRef.current,
            user: USERNAMES[Math.floor(Math.random() * USERNAMES.length)],
            text: pool[Math.floor(Math.random() * pool.length)],
            color: COLORS[Math.floor(Math.random() * COLORS.length)]
          });
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
      // CHAOS MODE
      interval = setInterval(() => addMessage(4), 50); // 4 messages every 50ms = 80 msg/sec
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
    <section className="py-24 relative z-10 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030205] via-[#0A0A0B] to-[#030205] -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-violet-900/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
            <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">
                The <span className="text-red-500">Visibility</span> Problem.
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
                In a crowded digital room, connection is lost in the noise. <br className="hidden md:block"/>
                Experience the difference between being present and being buried.
            </p>
        </div>

        {/* --- HORIZONTAL CHAT SIMULATOR --- */}
        <div className="max-w-6xl mx-auto bg-[#0A0A0B] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] relative group">
            
            {/* LEFT: CONTROLS */}
            <div className="w-full md:w-80 bg-[#13131F] border-r border-white/5 p-6 flex flex-col justify-between shrink-0 relative z-20">
                <div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        <span className="font-mono text-xs font-bold text-gray-400 uppercase tracking-widest">Live Simulation</span>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select Environment</label>
                        
                        <button 
                            onClick={() => setMode('quiet')}
                            className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all duration-300 ${mode === 'quiet' ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${mode === 'quiet' ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
                                <Wind size={20} />
                            </div>
                            <div className="text-left">
                                <div className={`font-bold ${mode === 'quiet' ? 'text-white' : 'text-gray-400'}`}>Quiet Room</div>
                                <div className="text-[10px] text-gray-500">Low traffic • Readable</div>
                            </div>
                        </button>

                        <button 
                            onClick={() => setMode('overload')}
                            className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all duration-300 ${mode === 'overload' ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${mode === 'overload' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                                <Zap size={20} />
                            </div>
                            <div className="text-left">
                                <div className={`font-bold ${mode === 'overload' ? 'text-white' : 'text-gray-400'}`}>Overload</div>
                                <div className="text-[10px] text-gray-500">Extreme traffic • Chaotic</div>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="mt-8 md:mt-0 p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-sm text-violet-200 mb-1">Try It Yourself</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Type a message in the chat on the right. Notice how quickly it disappears in <strong>Overload</strong> mode vs <strong>Quiet</strong> mode.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: CHAT VISUALIZER */}
            <div className="flex-1 flex flex-col bg-[#05040a] relative overflow-hidden">
                {/* Header Stats */}
                <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0A0A0B]/50 backdrop-blur-md z-10">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stream Chat</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className={`font-mono text-sm font-bold transition-colors duration-500 ${mode === 'overload' ? 'text-red-400' : 'text-emerald-400'}`}>
                            {mode === 'overload' ? '142,893' : '12'}
                        </span>
                        <span className="text-xs text-gray-600 uppercase tracking-widest">Viewers</span>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="relative flex-1 overflow-hidden">
                    {/* Gradient Masks */}
                    <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-[#05040a] to-transparent z-10 pointer-events-none" />
                    
                    <div 
                        ref={scrollRef}
                        className="absolute inset-0 overflow-y-auto px-6 py-4 space-y-1 scroll-smooth scrollbar-hide"
                    >
                        {messages.map((msg) => (
                            <motion.div 
                                key={msg.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`
                                    text-sm py-1 px-2 rounded flex items-baseline gap-2 leading-relaxed transition-all
                                    ${msg.isUser 
                                        ? 'bg-violet-600/20 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                                        : 'hover:bg-white/5'}
                                `}
                            >
                                {msg.isUser && (
                                    <span className="inline-block px-1.5 py-0.5 rounded bg-violet-600 text-[10px] font-bold text-white uppercase tracking-wider">
                                        YOU
                                    </span>
                                )}
                                <span className={`font-bold text-xs md:text-sm whitespace-nowrap ${msg.color}`}>{msg.user}:</span>
                                <span className={`${msg.isUser ? 'text-white font-medium' : 'text-gray-300'}`}>{msg.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 bg-[#0A0A0B] border-t border-white/5 relative z-20">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={mode === 'overload' ? "Good luck being seen..." : "Say something..."}
                            className="w-full bg-[#1A1830] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                        <button 
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </form>

                {/* Overload Effect Overlay */}
                {mode === 'overload' && (
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-red-500/5 z-0" />
                )}
            </div>

        </div>

      </div>
    </section>
  );
};

export default ProblemSection;