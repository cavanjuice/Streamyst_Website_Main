
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, ChevronRight } from 'lucide-react';

interface HeroProps {
  onOpenVideo: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenVideo }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
             <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen" />
             <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[100px] mix-blend-screen" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div className="text-left order-2 lg:order-1">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                    >
                        <Sparkles className="w-3 h-3 text-violet-400 animate-pulse" />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-violet-100 uppercase">The Next Evolution of Livestreaming</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6 tracking-tight"
                    >
                        Feel Your Audience. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 text-glow">
                            In Real-Time.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="font-body text-base md:text-lg text-gray-400 max-w-lg mb-10 leading-relaxed font-light"
                    >
                        STREAMYST transforms emotional reactions into physical sensations through XR wearable technology. Don't just read the chat—<span className="text-white font-medium">feel the room</span>.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center gap-4"
                    >
                        <button
                            onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group relative px-8 py-3.5 bg-white text-cosmic-950 font-bold text-base rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.35)] w-full sm:w-auto overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:translate-x-1 transition-transform">
                                Get Early Access <ChevronRight className="w-4 h-4" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 to-violet-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>

                        <button
                            onClick={onOpenVideo}
                            className="relative px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-base rounded-full transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto group backdrop-blur-sm"
                        >
                             <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-white/10 border border-white/20 group-hover:border-violet-400 transition-colors">
                                <span className="absolute w-full h-full rounded-full bg-violet-500/30 animate-ping opacity-0 group-hover:opacity-100" />
                                <Play className="w-2.5 h-2.5 fill-white relative z-10 ml-0.5" />
                             </div>
                            <span>Watch Demo</span>
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.4, ease: "circOut" }}
                    className="relative order-1 lg:order-2 flex justify-center lg:justify-end"
                >
                    <div className="relative z-10 w-full max-w-[420px] lg:max-w-[640px] animate-float drop-shadow-[0_20px_60px_rgba(139,92,246,0.2)]">
                         <img 
                           src="https://raw.githubusercontent.com/cavanjuice/assets/main/wearable_.png"
                           alt="Streamyst Wearable Tech"
                           className="relative z-10 w-full h-auto"
                           style={{
                               maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                               WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                           }}
                         />
                         
                         <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-3">
                             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                             <span className="text-[9px] font-mono text-gray-400 uppercase tracking-[0.2em]">System: Active</span>
                         </div>
                    </div>
                </motion.div>
            </div>
        </div>
    </section>
  );
};

export default Hero;
