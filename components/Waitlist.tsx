
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, ChevronRight } from 'lucide-react';

const Waitlist: React.FC = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'streamer' | 'viewer' | 'both'>('streamer');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <section id="waitlist" className="py-24 md:py-36 relative z-10">
      <div className="container mx-auto px-6">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto bg-[#0A0A0B] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[550px] relative"
        >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="lg:w-1/2 relative min-h-[250px] lg:min-h-full bg-cosmic-800 overflow-hidden group">
                <img 
                    src="https://raw.githubusercontent.com/cavanjuice/assets/main/preview (2).webp" 
                    alt="Streamers connecting" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0A0A0B]/40 to-[#0A0A0B]"></div>
                
                <div className="absolute bottom-12 left-12 z-20">
                     <div className="font-display font-bold text-white text-2xl mb-2 tracking-tight">The Future is Tactile</div>
                     <div className="w-10 h-1 bg-cyan-500 rounded-full"></div>
                </div>
            </div>

            <div className="lg:w-1/2 p-8 md:p-14 flex flex-col justify-center relative bg-[#0A0A0B] z-10">
                 <AnimatePresence mode='wait'>
                    {status === 'success' ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center text-center justify-center h-full w-full py-12"
                        >
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-400 border border-green-500/20">
                                <Check className="w-8 h-8" />
                            </div>
                            <h3 className="font-display font-bold text-2xl mb-3 text-white">Sequence Initiated 🚀</h3>
                            <p className="text-gray-400 text-sm">You are now in the queue. Stand by for transmission.</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-sm mx-auto"
                        >
                            <div className="inline-block px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[9px] font-bold uppercase tracking-[0.2em] mb-8">
                                ALPHA ACCESS PROGRAM
                            </div>

                            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 leading-tight tracking-tight">
                                Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Waitlist</span>
                            </h2>
                            
                            <p className="text-gray-500 text-sm md:text-base mb-10 leading-relaxed font-light">
Be among the first to experience the future. Early adopters get exclusive pricing and first access to Vybe.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 pl-1">ROLE SELECTION</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['streamer', 'viewer', 'both'] as const).map((r) => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => setRole(r)}
                                                className={`py-2.5 rounded-xl text-[11px] font-bold tracking-wider transition-all uppercase border ${
                                                    role === r 
                                                    ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-900/40' 
                                                    : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 pl-1">EMAIL COORDINATES</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="ENTER EMAIL ADDRESS"
                                        className="w-full bg-[#13131F] border border-white/5 rounded-xl px-5 py-3.5 text-white text-xs placeholder-gray-700 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all font-mono tracking-widest uppercase"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="relative w-full overflow-hidden bg-white text-black font-bold py-3.5 rounded-xl text-sm transition-all transform hover:-translate-y-0.5 group shadow-xl shadow-white/5"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 to-violet-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {status === 'loading' ? (
                                            <><Loader2 className="animate-spin w-4 h-4" /> PROCESSING...</>
                                        ) : (
                                            <>REQUEST ACCESS <ChevronRight className="w-4 h-4" /></>
                                        )}
                                    </span>
                                </button>
                                
                                <div className="text-[9px] text-gray-700 text-center pt-2 font-mono tracking-[0.3em] uppercase">
                                    Encrypted Sync Channel
                                </div>
                            </form>
                        </motion.div>
                    )}
                 </AnimatePresence>
            </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Waitlist;
