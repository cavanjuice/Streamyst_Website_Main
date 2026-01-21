
import React from 'react';
import { motion } from 'framer-motion';

const SingleStatShowcase: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 relative z-10 overflow-hidden flex justify-center items-center">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="relative w-full max-w-6xl mx-auto aspect-[1/1] md:aspect-[1.8/1] lg:aspect-[2/1] rounded-[2.5rem] overflow-hidden bg-[#030205] shadow-2xl flex flex-col items-center justify-center group border border-white/5"
            >
                {/* 1. BACKGROUND GRADIENT - Deep & Moody Indigo/Violet */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#18182b] via-[#030205] to-[#1e1a40] opacity-100" />
                
                {/* 2. GLOW BLOBS - Creating the "Backlight" for the text */}
                <motion.div 
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.6, 0.5] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-violet-600/20 blur-[100px] md:blur-[150px] rounded-full mix-blend-screen pointer-events-none" 
                />
                
                {/* Secondary Blue Glow for depth */}
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

                {/* 3. NOISE OVERLAY - Essential for the texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-25 mix-blend-overlay pointer-events-none" />
                
                {/* 5. CENTER CONTENT - THE MASSIVE "70%" */}
                <div className="relative z-10 flex items-center justify-center w-full h-full pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                        whileInView={{ opacity: 1, scale: 1, filter: "blur(5px)" }}
                        transition={{ duration: 1.2, ease: "circOut" }}
                        className="relative"
                    >
                        {/* 
                           THE SILHOUETTE EFFECT: 
                           The text is dark (#030205) matching the card bg, but has a massive colored shadow 
                           behind it. This makes it look like a void in the glowing fog.
                        */}
                        <h2 className="text-[120px] sm:text-[180px] md:text-[280px] lg:text-[400px] leading-none font-display font-bold tracking-tighter text-[#030205] select-none mix-blend-normal drop-shadow-[0_0_40px_rgba(139,92,246,0.3)] md:drop-shadow-[0_0_80px_rgba(139,92,246,0.5)]">
                            70%
                        </h2>

                        {/* Additional blur layer behind to enhance the 'fog' effect around the numbers */}
                        <div className="absolute inset-0 text-[120px] sm:text-[180px] md:text-[280px] lg:text-[400px] leading-none font-display font-bold tracking-tighter text-violet-500 blur-[60px] md:blur-[100px] opacity-40 select-none z-[-1]">
                            70%
                        </div>
                    </motion.div>
                </div>

                {/* 6. BOTTOM CONTENT - Description Left, Date Right */}
                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 max-w-[200px] md:max-w-md z-20">
                     <p className="text-sm md:text-xl text-gray-300 font-light leading-relaxed tracking-wide">
                        You can improve your chances of securing interaction by <span className="text-white font-medium">70%</span> with real-time emotional haptics.
                     </p>
                     <p className="mt-4 text-[10px] text-gray-600 font-mono">@streamyst_lab</p>
                </div>

                <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-20">
                    <span className="text-[10px] md:text-xs font-mono font-medium tracking-widest text-gray-500/70 lowercase">
                        2025
                    </span>
                </div>

                {/* Border sheen animation */}
                <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] z-30 pointer-events-none overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform ease-in-out" />
                </div>

            </motion.div>
        </div>
    </section>
  );
};

export default SingleStatShowcase;
