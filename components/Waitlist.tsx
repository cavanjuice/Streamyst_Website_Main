
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, ChevronRight, ClipboardList, AlertCircle } from 'lucide-react';
import { saveEmailToWaitlist, trackEvent } from '../utils/supabaseClient';
import { SupabaseImg } from './SupabaseImg';

interface WaitlistProps {
    onJoinSurvey?: (email: string) => void;
}

const Waitlist: React.FC<WaitlistProps> = ({ onJoinSurvey }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    
    // Save to Database and wait for result
    const { error } = await saveEmailToWaitlist(email);
    
    if (error) {
        setStatus('error');
        // Log is already handled in client, UI stays in error state
        return;
    }

    setStatus('success');
  };

  const handleSurveyClick = () => {
      trackEvent('waitlist_survey_click', { email_present: !!email });
      if (onJoinSurvey) onJoinSurvey(email);
  };

  return (
    // Changed: Reduced padding significantly
    <section id="waitlist" className="py-16 lg:py-32 relative z-10">
      <div className="container mx-auto px-6">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl mx-auto bg-[#0A0A0B] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[450px] relative"
        >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="lg:w-1/2 relative min-h-[250px] lg:min-h-full bg-cosmic-800 overflow-hidden group">
                <SupabaseImg 
                    filename="preview(2).webp" 
                    alt="Streamers connecting" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0A0A0B]/40 to-[#0A0A0B]"></div>
                
                <div className="absolute bottom-12 left-12 z-20">
                     <div className="font-display font-bold text-white text-2xl mb-2 tracking-tight">The Future is Tactile</div>
                     {/* Updated bar to violet to match theme */}
                     <div className="w-10 h-1 bg-violet-500 rounded-full"></div>
                </div>
            </div>

            <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-[#0A0A0B] z-10">
                 <AnimatePresence mode='wait'>
                    {status === 'success' ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center text-center justify-center h-full w-full py-8"
                        >
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-400 border border-green-500/20">
                                <Check className="w-8 h-8" />
                            </div>
                            <h3 className="font-display font-bold text-2xl mb-2 text-white">You're on the list! 🚀</h3>
                            
                            <div className="max-w-sm mx-auto mb-8 space-y-4">
                                <p className="text-gray-300 text-sm font-medium">
                                    Your spot is secured.
                                </p>
                                <div className="p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-violet-500" />
                                    <p className="text-xs text-gray-400 leading-relaxed text-left pl-2">
                                         <strong className="text-violet-300 block mb-1">Important:</strong>
                                         The product is currently in private development and <span className="text-white">not yet available for purchase</span>. We are building this custom for you, so your feedback is our most important blueprint.
                                    </p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleSurveyClick}
                                className="group relative overflow-hidden bg-white text-black font-bold py-3.5 px-8 rounded-full text-sm transition-all transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/20 flex items-center gap-2 w-full sm:w-auto justify-center"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Take Beta Survey <ClipboardList className="w-4 h-4" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-sm mx-auto"
                        >
                            <div className="inline-block px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-[9px] font-bold uppercase tracking-[0.2em] mb-8">
                                ALPHA ACCESS PROGRAM
                            </div>

                            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 leading-tight tracking-tight">
                                Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Experience</span>
                            </h2>
                            
                            <p className="text-gray-500 text-sm md:text-base mb-10 leading-relaxed font-light">
                                Be among the first to access the next evolution of livestreaming connection.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 pl-1">EMAIL COORDINATES</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (status === 'error') setStatus('idle');
                                        }}
                                        placeholder="ENTER EMAIL ADDRESS"
                                        className="w-full bg-[#13131F] border border-white/5 rounded-xl px-5 py-3.5 text-white text-xs placeholder-gray-700 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all font-mono tracking-widest uppercase"
                                    />
                                </div>

                                {status === 'error' && (
                                    <div className="flex items-center gap-2 text-red-400 text-xs">
                                        <AlertCircle size={14} />
                                        <span>Connection failed. Please check your internet or try again.</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="relative w-full overflow-hidden bg-white text-black font-bold py-3.5 rounded-xl text-sm transition-all transform hover:-translate-y-0.5 group shadow-xl shadow-white/5"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
