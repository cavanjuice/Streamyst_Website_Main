
import React from 'react';
import { motion } from 'framer-motion';

const SingleStatShowcase: React.FC = () => {
  const metrics = [
    {
      value: "+133%",
      title: "Engagement/interaction Boost",
      desc: "Viewer analysis observed jump from 30% to 70% interaction levels."
    },
    {
      value: "98%",
      title: "Intuitive Adoption",
      desc: "Prototype test Interaction became \"second nature\" and improved immersion via peripheral cues."
    },
    {
      value: "100%",
      title: "Creative Inspiration",
      desc: "All prototype testers \"left the session visibly inspired\" in search for more creative configurations."
    }
  ];

  return (
    <section className="py-20 lg:py-24 relative z-10 overflow-hidden flex justify-center items-center">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
            
            {/* NEW CLEAN LAYOUT (Requested Style) */}
            <div className="grid md:grid-cols-3 gap-12 md:gap-8 max-w-7xl mx-auto items-start">
                {metrics.map((metric, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: i * 0.15, duration: 0.8, ease: "circOut" }}
                        className="flex flex-col items-center text-center group"
                    >
                        {/* Number with Glow */}
                        <div className="relative mb-4">
                             <div className="absolute inset-0 bg-violet-500/20 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                             <h3 className="relative z-10 text-6xl md:text-6xl lg:text-7xl font-display font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-violet-200 to-indigo-400 drop-shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                                {metric.value}
                            </h3>
                        </div>
                        
                        <h4 className="text-lg md:text-lg font-bold text-white mb-3 font-display uppercase tracking-wider">
                            {metric.title}
                        </h4>
                        <p className="text-gray-400 leading-relaxed text-sm md:text-sm font-light max-w-xs mx-auto">
                            {metric.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
  );
};

export default SingleStatShowcase;
