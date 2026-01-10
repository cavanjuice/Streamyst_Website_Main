
import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: "87%", label: "accuracy detecting sentiment shifts" },
  { value: "70%", label: "increase in interaction" },
  { value: "65%", label: "reduction in post-stream exhaustion" }
];

const DataStats: React.FC = () => {
  return (
    <section className="py-24 md:py-32 relative z-10">
       {/* Background decorative glow */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-violet-900/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-16 md:gap-8 text-center items-start">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-4">
                  <h3 className="font-display font-bold text-7xl md:text-8xl tracking-tight bg-gradient-to-b from-blue-200 via-indigo-300 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(139,92,246,0.2)]">
                    {stat.value}
                  </h3>
              </div>
              <p className="text-gray-400 text-base md:text-lg font-medium leading-tight max-w-[200px] mx-auto opacity-80">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DataStats;
