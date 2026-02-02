
import React from 'react';
import { motion } from 'framer-motion';

interface ProblemStatementProps {
  role: 'streamer' | 'viewer';
}

const ProblemStatement: React.FC<ProblemStatementProps> = ({ role }) => {
  const content = {
    streamer: {
      title: "Streaming feels lonely.",
      description: "Whether you have 1 viewer or 1000, you're pouring your energy into a camera lens. The digital barrier blocks the real human connection you crave."
    },
    viewer: {
      title: "Watching feels passive.",
      description: "You're trying to be part of the moment, but you're just text on a screen. The digital barrier keeps your excitement from truly reaching the Creator."
    }
  };

  const currentContent = content[role];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] as const
      } 
    }
  };

  return (
    <section className="py-24 lg:py-32 bg-[#030205] relative z-20 flex items-center justify-center overflow-hidden">
       
       {/* Background Glow - strictly behind text */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-full bg-violet-900/5 blur-[120px] pointer-events-none rounded-full z-0" />
       
       <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div 
                key={role}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ margin: "-20%", once: true }}
                className="max-w-4xl mx-auto"
             >
                <motion.div variants={itemVariants} className="inline-flex items-center justify-center gap-4 mb-6 opacity-60">
                    <div className="h-px w-8 lg:w-16 bg-gradient-to-r from-transparent to-white/50"></div>
                    <span className="text-xs lg:text-xs font-mono uppercase tracking-[0.3em] text-white">The Current Reality</span>
                    <div className="h-px w-8 lg:w-16 bg-gradient-to-l from-transparent to-white/50"></div>
                </motion.div>

                <motion.h2 
                    variants={itemVariants}
                    className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-[1.1] tracking-tight text-white drop-shadow-2xl"
                >
                    {currentContent.title}
                </motion.h2>
                
                <motion.p 
                    variants={itemVariants}
                    className="text-gray-300 text-lg md:text-xl lg:text-xl leading-relaxed font-light max-w-2xl mx-auto drop-shadow-lg"
                >
                    {currentContent.description}
                </motion.p>
             </motion.div>
       </div>
    </section>
  );
};

export default ProblemStatement;
