
import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Zap, Activity } from 'lucide-react';

const steps = [
  {
    id: "01",
    title: "Audience Reacts",
    desc: "Viewers chat naturally or support their streamer. Our system detects sentiment spikes and energy shifts in real-time.",
    icon: MessageSquare,
    gradient: "from-amber-400/20 via-orange-500/20 to-red-500/20",
    highlight: "bg-orange-500",
    glow: "group-hover:shadow-orange-500/20"
  },
  {
    id: "02",
    title: "Instant Translation",
    desc: "Our custom software processes collective emotion into physical and digital feedback. Chaos becomes a pulse. Love becomes warmth.",
    icon: Activity,
    gradient: "from-blue-400/20 via-indigo-500/20 to-violet-500/20",
    highlight: "bg-indigo-500",
    glow: "group-hover:shadow-indigo-500/20"
  },
  {
    id: "03",
    title: "Streamer Feels",
    desc: "The wearable activates and digital expressions react. You feel the crowd's energy physically, creating an instant feedback loop.",
    icon: Zap,
    gradient: "from-pink-400/20 via-rose-500/20 to-fuchsia-600/20",
    highlight: "bg-pink-500",
    glow: "group-hover:shadow-pink-500/20"
  }
];

const PremiumCard: React.FC<{ step: typeof steps[0]; index: number }> = ({ step, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
      className={`group relative flex flex-col justify-between h-full min-h-[320px] w-[85vw] md:w-auto md:h-[380px] rounded-[2rem] bg-[#0A0A0B] border border-white/5 overflow-hidden transition-all duration-500 hover:border-white/10 ${step.glow} hover:shadow-2xl snap-center shrink-0`}
    >
      {/* 1. Ambient Background Layer */}
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0A0A0B]" />
          {/* Subtle Noise Texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
          
          {/* Active Gradient Orb (Expands on Hover) */}
          <div className={`absolute -top-[20%] -right-[20%] w-[80%] h-[80%] bg-gradient-to-br ${step.gradient} blur-[80px] rounded-full opacity-40 group-hover:opacity-60 group-hover:scale-125 transition-all duration-700 ease-in-out`} />
          
          {/* Secondary Ambient Light (Bottom Left) */}
          <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-white/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
      </div>

      {/* 2. Content Layer */}
      <div className="relative z-10 p-8 md:p-10 flex flex-col h-full justify-between">
        
        {/* Header */}
        <div className="flex justify-between items-start">
            <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-lg group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                     <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${step.highlight}`} />
                     <step.icon className="w-6 h-6 text-white relative z-10" />
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                 <span className="font-mono text-[10px] font-bold text-gray-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 tracking-widest uppercase group-hover:text-gray-300 transition-colors">
                    Step {step.id}
                 </span>
            </div>
        </div>

        {/* Text Content */}
        <div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 group-hover:translate-x-1 transition-transform duration-300">
                {step.title}
            </h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                {step.desc}
            </p>
        </div>

        {/* Bottom Decoration line */}
        <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden mt-8">
            <div className={`absolute top-0 left-0 h-full w-0 ${step.highlight} group-hover:w-full transition-all duration-1000 ease-out`} />
        </div>

      </div>
    </motion.div>
  );
};

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="relative z-10 bg-[#030205] overflow-hidden min-h-screen flex flex-col justify-center py-24 lg:py-0">
      
      {/* Section Background Subtle Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
           <div className="absolute top-[20%] left-0 w-[500px] h-[500px] bg-violet-900/5 blur-[120px] rounded-full" />
           <div className="absolute bottom-[20%] right-0 w-[500px] h-[500px] bg-blue-900/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Reverted Header Style - Centered & Colorful */}
        <div className="text-center mb-16 lg:mb-24 max-w-4xl mx-auto">
          {/* Badge Removed Here */}
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-6 tracking-tight"
          >
            Zero Latency. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">
              Maximum Immersion.
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto"
          >
            A seamless bridge between digital chatrooms and physical sensation, designed for the current streaming workflow.
          </motion.p>
        </div>

        {/* Grid / Horizontal Scroll */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 md:grid md:grid-cols-3 md:gap-8 md:pb-0 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
          {steps.map((step, i) => (
            <PremiumCard key={i} step={step} index={i} />
          ))}
          
          {/* Spacer for mobile scroll */}
          <div className="w-4 shrink-0 md:hidden" />
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
