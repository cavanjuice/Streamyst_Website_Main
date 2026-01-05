
import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    title: "Unique expression",
    desc: "With XR we're able to create any look that fits your style, making you stand out!",
    image: "https://raw.githubusercontent.com/cavanjuice/assets/main/Express.png",
    delay: 0
  },
  {
    title: "Engage audiences",
    desc: "Make use of XR elements to let your viewers become part of the experience",
    image: "https://raw.githubusercontent.com/cavanjuice/assets/main/FIRED.png",
    delay: 0.1
  },
  {
    title: "Reflect sentiment",
    desc: "Let the overlay react directly to the input from your streamers, making it reflective of your audience",
    image: "https://raw.githubusercontent.com/cavanjuice/assets/main/WATER.png",
    delay: 0.2
  },
  {
    title: "Feel the vybe",
    desc: "Add the Vybe for a more immersive experience, feeling and Seeing the digital connection IRL",
    image: "https://raw.githubusercontent.com/cavanjuice/assets/main/DSC006262.png",
    delay: 0.3
  }
];

const FeaturesShowcase: React.FC = () => {
  return (
    <section className="py-24 relative z-10 bg-cosmic-900/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="font-display font-bold text-4xl md:text-5xl mb-6"
           >
             SEE IT IN ACTION
           </motion.h2>
           <motion.div 
             initial={{ width: 0 }}
             whileInView={{ width: '6rem' }}
             viewport={{ once: true }}
             className="h-1 bg-gradient-to-r from-blue-500 to-violet-500 mx-auto rounded-full" 
           />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: feature.delay }}
              className="group relative h-[450px] rounded-2xl overflow-hidden border border-white/10 bg-cosmic-800 shadow-xl"
            >
              {/* Image Layer */}
              <div className="absolute inset-0">
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-60"
                />
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-cosmic-950 via-cosmic-950/60 to-transparent" />
              </div>

              {/* Content Layer */}
              <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end h-full">
                <div className="transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
                    <div className="w-12 h-1 bg-violet-500 mb-4 rounded-full origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    
                    <h3 className="font-display font-bold text-2xl mb-3 text-white leading-tight">
                        {feature.title}
                    </h3>
                    
                    <p className="text-gray-300 text-sm leading-relaxed opacity-90">
                        {feature.desc}
                    </p>
                </div>
              </div>
              
              {/* Hover Glow Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-violet-500/30 rounded-2xl transition-colors duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
