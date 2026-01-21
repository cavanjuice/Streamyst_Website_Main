
import React, { useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

const stats = [
  { value: "87%", label: "accuracy detecting sentiment shifts" },
  { value: "70%", label: "increase in interaction" },
  { value: "65%", label: "reduction in post-stream exhaustion" }
];

interface AnimatedStatProps {
    value: string;
    label: string;
}

const AnimatedStat: React.FC<AnimatedStatProps> = ({ value, label }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-20%" });
    
    // Extract number and suffix
    const numberValue = parseInt(value.replace(/\D/g, ''));
    const suffix = value.replace(/[0-9]/g, '');

    const count = useSpring(0, { duration: 2500, bounce: 0 });
    const rounded = useTransform(count, (latest) => Math.round(latest));

    useEffect(() => {
        if (isInView) {
            count.set(numberValue);
        }
    }, [isInView, numberValue, count]);

    return (
        <div ref={ref} className="flex flex-col items-center text-center px-1 md:px-4">
            <div className="relative mb-2 md:mb-4">
                <h3 className="font-display font-bold text-2xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight text-white drop-shadow-lg flex items-center justify-center">
                    <motion.span>{rounded}</motion.span>
                    <span>{suffix}</span>
                </h3>
            </div>
            <p className="text-gray-400 text-[9px] sm:text-xs md:text-lg font-medium leading-snug max-w-[100px] sm:max-w-none mx-auto opacity-80">
                {label}
            </p>
        </div>
    );
};

const DataStats: React.FC = () => {
  return (
    <section className="py-12 lg:py-32 relative z-10">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Unified Card Container for better composition */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="bg-[#0A0A0B]/50 backdrop-blur-sm border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-xl relative overflow-hidden"
        >
            {/* Subtle Gradient Accent */}
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
            
            <div className="grid grid-cols-3 gap-2 md:gap-8 divide-x divide-white/5 items-start">
                {stats.map((stat, index) => (
                    <AnimatedStat key={index} value={stat.value} label={stat.label} />
                ))}
            </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DataStats;
