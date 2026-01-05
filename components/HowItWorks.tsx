
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Zap, Activity } from 'lucide-react';

const steps = [
  {
    id: "01",
    title: "Audience Reacts",
    desc: "Viewers send reactions and messages naturally in the chat. No new apps or tools needed.",
    icon: <MessageSquare className="w-6 h-6" />,
  },
  {
    id: "02",
    title: "Instant Translation",
    desc: "Our engine processes sentiment instantly, converting collective energy into data.",
    icon: <Activity className="w-6 h-6" />,
  },
  {
    id: "03",
    title: "Streamer Feels",
    desc: "The Vybe device delivers precise haptic feedback, bridging the physical gap.",
    icon: <Zap className="w-6 h-6" />,
  }
];

const SpotlightCard: React.FC<{ children: React.ReactNode; index: number }> = ({ children, index }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 px-8 py-10"
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      <div className="relative flex flex-col h-full">{children}</div>
    </motion.div>
  );
};

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-32 relative z-10 bg-[#030205]">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header - Clean & Minimal */}
        <div className="mb-20 max-w-2xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-medium text-4xl md:text-5xl text-white mb-6 tracking-tight"
          >
            Seamless Integration.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400 font-light leading-relaxed"
          >
            We've removed the friction. No plugins to install, no complex setups. It just works.
          </motion.p>
        </div>

        {/* Grid - Apple Style Bento */}
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <SpotlightCard key={i} index={i}>
              {/* Step Number - Subtle Watermark */}
              <div className="mb-8 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800/50 border border-white/5 text-white shadow-inner">
                  {step.icon}
                </div>
                <span className="font-mono text-xs font-medium text-zinc-600 tracking-widest">
                  STEP {step.id}
                </span>
              </div>

              <div className="mt-auto">
                <h3 className="font-display font-semibold text-2xl text-zinc-100 mb-3">
                  {step.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed font-light text-base">
                  {step.desc}
                </p>
              </div>

              {/* Subtle Progress Bar element at bottom of card */}
              <div className="mt-8 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + (i * 0.2), duration: 1.5, ease: "circOut" }}
                  className="h-full bg-zinc-600 rounded-full opacity-50"
                />
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
