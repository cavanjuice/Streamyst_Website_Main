
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SolutionSectionProps {
  role: 'streamer' | 'viewer';
}

const SolutionSection: React.FC<SolutionSectionProps> = ({ role }) => {
  return (
    <section className="py-24 md:py-32 relative z-10 overflow-hidden">
      {/* Background - subtle atmospheric glow, blending seamlessly */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[600px] rounded-full blur-[120px] pointer-events-none mix-blend-screen ${role === 'streamer' ? 'bg-violet-900/5' : 'bg-fuchsia-900/5'}`}></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
            className="max-w-5xl mx-auto text-center"
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
                        className={`absolute inset-0 blur-3xl rounded-full ${role === 'streamer' ? 'bg-violet-500/20' : 'bg-fuchsia-500/20'}`}
                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    ></motion.span>
                    
                    {/* Main Text */}
                    <span className={`relative text-white italic tracking-wide ${role === 'streamer' ? 'drop-shadow-[0_0_35px_rgba(139,92,246,0.5)]' : 'drop-shadow-[0_0_35px_rgba(232,121,249,0.5)]'}`}>
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
                    className={`w-[1px] h-8 bg-gradient-to-b from-transparent to-transparent mx-auto mb-6 ${role === 'streamer' ? 'via-violet-500/30' : 'via-fuchsia-500/30'}`}
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
                            Interact using <span className="text-fuchsia-200 font-medium">digital effects</span> that make you an active part of the stream, reaching common goals.
                        </>
                    )}
                </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;
    