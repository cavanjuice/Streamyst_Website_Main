
import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { MessageSquare, Zap, Activity, ArrowRight } from 'lucide-react';

const steps = [
  {
    id: "01",
    title: "Audience Input",
    subtitle: "The Trigger",
    desc: "Viewers chat, react, or donate. Our system detects sentiment spikes and energy shifts in real-time.",
    icon: MessageSquare,
    color: "violet", // Theme color
    gradient: "from-violet-500/20 via-fuchsia-500/20 to-purple-500/20",
    border: "group-hover:border-violet-500/50",
    shadow: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]"
  },
  {
    id: "02",
    title: "Instant Translation",
    subtitle: "The Processor",
    desc: "Collective emotion is processed into digital and physical feedback. Chaos becomes a pulse. Love becomes warmth.",
    icon: Activity,
    color: "cyan",
    gradient: "from-cyan-500/20 via-blue-500/20 to-indigo-500/20",
    border: "group-hover:border-cyan-500/50",
    shadow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
  },
  {
    id: "03",
    title: "Streamer Feels",
    subtitle: "The Feedback",
    desc: "The wearable activates. You feel the crowd's energy instantly, They see the AR effects, creating a bi-directional feedback loop.",
    icon: Zap,
    color: "orange",
    gradient: "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
    border: "group-hover:border-orange-500/50",
    shadow: "group-hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]"
  }
];

const ConnectionBeam = () => {
  return (
    <div className="hidden md:block absolute top-1/2 left-0 w-full -translate-y-1/2 z-0 pointer-events-none">
      {/* Base Line */}
      <div className="absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-white/5 rounded-full" />
      
      {/* Animated Pulse */}
      <div className="absolute top-1/2 left-[10%] right-[10%] h-[2px] overflow-hidden rounded-full">
        <motion.div 
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-1/2 h-full bg-gradient-to-r from-transparent via-violet-500 to-transparent blur-[2px]"
        />
      </div>
    </div>
  );
};

const ProcessCard: React.FC<{ step: typeof steps[0]; index: number }> = ({ step, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.2, duration: 0.6, ease: "backOut" }}
      className={`relative z-10 group flex flex-col h-full min-h-[300px] w-[85vw] md:w-auto rounded-3xl bg-[#0A0A0B] border border-white/10 overflow-hidden transition-all duration-500 ${step.border} ${step.shadow} snap-center shrink-0 hover:-translate-y-2`}
    >
      {/* Internal Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

      {/* Large Background Number */}
      <div className="absolute -right-4 -top-8 text-[120px] font-display font-bold text-white/[0.03] group-hover:text-white/[0.06] transition-colors duration-500 select-none pointer-events-none">
        {step.id}
      </div>

      <div className="relative z-10 p-8 flex flex-col h-full">
        {/* Header Icon */}
        <div className="mb-6 flex justify-between items-start">
            <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                <step.icon className={`w-6 h-6 text-${step.color}-400`} />
            </div>
            {index < 2 && (
                <div className="hidden md:flex text-white/10 group-hover:text-white/30 transition-colors">
                    <ArrowRight size={32} />
                </div>
            )}
        </div>

        {/* Content */}
        <div className="flex-1">
            <span className={`text-[10px] font-mono uppercase tracking-widest text-${step.color}-400 mb-2 block`}>
                {step.subtitle}
            </span>
            <h3 className="text-2xl font-display font-bold text-white mb-4 group-hover:translate-x-1 transition-transform duration-300">
                {step.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed font-light">
                {step.desc}
            </p>
        </div>
      </div>
    </motion.div>
  );
};

const HowItWorks: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
      if (scrollRef.current) {
          const container = scrollRef.current;
          // Basic approximation for indicator
          const index = Math.round(container.scrollLeft / (container.clientWidth * 0.8)); // 0.8 is roughly card width ratio
          setActiveIndex(Math.min(steps.length - 1, Math.max(0, index)));
      }
  };

  return (
    <section id="how-it-works" className="relative z-10 bg-[#030205] py-24 lg:py-32 overflow-hidden">
      
      {/* Section Background - Darker center to pop the cards */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Dynamic Header */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 tracking-tight"
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
            className="text-lg text-gray-400 font-light leading-relaxed max-w-2xl mx-auto"
          >
            A seamless bridge between digital chatrooms and physical sensation.
          </motion.p>
        </div>

        {/* Process Visualizer */}
        <div className="relative">
            <ConnectionBeam />
            
            <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 md:pb-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0"
            >
                {steps.map((step, i) => (
                    <ProcessCard key={i} step={step} index={i} />
                ))}
                
                {/* Spacer for mobile */}
                <div className="w-4 shrink-0 md:hidden" />
            </div>
        </div>
        
        {/* Mobile Indicators */}
        <div className="flex md:hidden justify-center gap-2 mt-2">
            {steps.map((_, i) => (
                 <div key={i} className={`h-1 rounded-full transition-all duration-300 ${activeIndex === i ? 'w-8 bg-violet-500' : 'w-2 bg-white/20'}`} />
            ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
