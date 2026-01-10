
import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    title: "Unique expression",
    desc: "With XR we're able to create any look that fits your style, making you stand out!",
    image: "https://raw.githubusercontent.com/cavanjuice/assets/main/Express.png",
    delay: 0,
    sizeClass: "h-[120%] max-h-[400px]"
  },
  {
    title: "Engage audiences",
    desc: "Make use of XR elements to let your viewers become part of the experience",
    image: "https://raw.githubusercontent.com/cavanjuice/assets/main/FIRED.png",
    delay: 0.1,
    sizeClass: "h-[120%] max-h-[400px]"
  },
  {
    title: "Reflect sentiment",
    desc: "Let the overlay react directly to the input from your streamers, making it reflective of your audience",
    image: "https://raw.githubusercontent.com/cavanjuice/assets/main/WATER.png",
    delay: 0.2,
    sizeClass: "h-[120%] max-h-[400px]"
  },
  {
    title: "Feel the vybe",
    desc: "Add the Vybe for a more immersive experience, feeling and Seeing the digital connection IRL",
    image: "https://raw.githubusercontent.com/cavanjuice/assets/main/DSC006262.png",
    delay: 0.3,
    sizeClass: "h-[125%] max-h-[450px] -mb-4"
  }
];

const FeaturesShowcase: React.FC = () => {
  return (
    <section className="py-32 relative z-10 bg-[#030205] overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl bg-violet-900/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="font-display font-bold text-4xl md:text-6xl mb-6"
           >
             SEE IT IN <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">ACTION</span>
           </motion.h2>
           <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Breaking the fourth wall between creator and community.
           </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: feature.delay }}
              className="group relative flex flex-col justify-end min-h-[480px] hover:-translate-y-2 transition-transform duration-500"
            >
              {/* 
                  THE CARD BASE 
                  Visually acts as the container, but sits lower to allow the image to pop out top.
              */}
              <div className="absolute bottom-0 w-full h-[80%] rounded-[2rem] border border-white/10 bg-[#0A0A0B] transition-all duration-500 group-hover:border-violet-500/40 group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] overflow-visible">
                  
                  {/* Inner Glow Gradient */}
                  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-violet-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Decorative Texture */}
                  <div className="absolute inset-0 rounded-[2rem] opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />
              </div>

              {/* 
                  THE IMAGE (POP OUT)
                  Positioned absolutely to overlap the top of the card base.
                  Z-index ensures it sits above the card border/background.
              */}
              <div className="absolute top-0 left-0 right-0 bottom-32 z-20 flex items-end justify-center pointer-events-none">
                   {/* Back Glow behind subject */}
                   <div className="absolute bottom-10 w-32 h-32 bg-violet-500/20 rounded-full blur-[40px] group-hover:bg-violet-500/30 transition-colors duration-500" />

                   <motion.img 
                      src={feature.image} 
                      alt={feature.title}
                      className={`relative w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] origin-bottom transition-transform duration-500 ease-out group-hover:scale-110 ${feature.sizeClass}`}
                      style={{
                        maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                      }}
                   />
              </div>

              {/* 
                  CONTENT AREA
                  Sits inside the card base visually.
              */}
              <div className="relative z-30 p-6 pt-12 text-center pb-8">
                  <div className="w-10 h-1 bg-violet-500 rounded-full mx-auto mb-4 group-hover:w-16 transition-all duration-300" />
                  <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-violet-200 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    {feature.desc}
                  </p>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
