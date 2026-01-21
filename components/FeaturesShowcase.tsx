
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    title: "Unique expression",
    desc: "With XR we're able to create any look that fits your style, making you stand out!",
    image: "https://raw.githubusercontent.com/cavanjuice/assets/main/Express.png",
    delay: 0,
    sizeClass: "h-[120%] max-h-[300px] md:max-h-[400px]"
  },
  {
    title: "Engage audiences",
    desc: "Make use of XR elements to let your viewers become part of the experience",
    image: "https://raw.githubusercontent.com/cavanjuice/assets/main/FIRED.png",
    delay: 0.1,
    sizeClass: "h-[120%] max-h-[300px] md:max-h-[400px]"
  },
  {
    title: "Reflect sentiment",
    desc: "Let the overlay react directly to the input from your streamers, making it reflective of your audience",
    image: "https://raw.githubusercontent.com/cavanjuice/assets/main/WATER.png",
    delay: 0.2,
    sizeClass: "h-[120%] max-h-[300px] md:max-h-[400px]"
  },
  {
    title: "Feel the vybe",
    desc: "Add the Vybe for a more immersive experience, feeling and Seeing the digital connection IRL",
    image: "https://raw.githubusercontent.com/cavanjuice/assets/main/DSC006262.png",
    delay: 0.3,
    sizeClass: "h-[125%] max-h-[350px] md:max-h-[450px] -mb-4"
  }
];

const FeaturesShowcase: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Create 3 sets for infinite scroll illusion on mobile
  const extendedFeatures = [...features, ...features, ...features];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Get all card elements
    const cards = Array.from(container.children) as HTMLElement[];
    if (cards.length < extendedFeatures.length) return;

    // Initialize Scroll Position: Center on Index 5 (Set 2, Card 2 "Engage Audiences")
    const initializeScroll = () => {
        if (container.scrollWidth <= container.clientWidth) return;
        
        // Target: Index 5 (Second card of the middle set)
        const targetIndex = 5; 
        
        if (cards[targetIndex]) {
            const card = cards[targetIndex];
            const scrollPos = card.offsetLeft - (container.clientWidth / 2) + (card.clientWidth / 2);
            container.scrollLeft = scrollPos;
        }
    };

    const handleScroll = () => {
         if (container.scrollWidth <= container.clientWidth) return;

         // Determine which card is currently closest to the center of the viewport
         const containerCenter = container.scrollLeft + container.clientWidth / 2;
         
         let closestCard = cards[0];
         let minDistance = Infinity;

         // Find active card
         cards.forEach((card) => {
             const cardCenter = card.offsetLeft + card.offsetWidth / 2;
             const dist = Math.abs(containerCenter - cardCenter);
             if (dist < minDistance) {
                 minDistance = dist;
                 closestCard = card;
             }
         });

         const activeIndex = cards.indexOf(closestCard);
         const setLength = features.length; // 4 cards per set

         // Infinite Loop Logic based on Active Card Index
         // Set 1: Indices 0-3
         // Set 2: Indices 4-7 (Target Zone)
         // Set 3: Indices 8-11

         // If we drift into Set 1 (left), jump forward to Set 2
         if (activeIndex < setLength) {
             const targetIndex = activeIndex + setLength;
             // Calculate precise distance between the identical cards
             const delta = cards[targetIndex].offsetLeft - cards[activeIndex].offsetLeft;
             container.scrollLeft += delta;
         }
         // If we drift into Set 3 (right), jump backward to Set 2
         else if (activeIndex >= setLength * 2) {
             const targetIndex = activeIndex - setLength;
             const delta = cards[activeIndex].offsetLeft - cards[targetIndex].offsetLeft;
             container.scrollLeft -= delta;
         }
    };

    // Initialize after layout
    requestAnimationFrame(() => {
        initializeScroll();
        // Add listener after initial scroll to avoid triggering it during setup
        setTimeout(() => {
            container.addEventListener('scroll', handleScroll);
        }, 100);
    });
    
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="py-24 lg:py-48 relative z-10 bg-[#030205] overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl bg-violet-900/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Unified Header Style */}
        <div className="text-center mb-16 lg:mb-24 max-w-4xl mx-auto">
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ delay: 0.1 }}
             className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-6 tracking-tight"
           >
             SEE IT IN <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">ACTION</span>
           </motion.h2>
           
           <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto"
           >
                Breaking the fourth wall between creator and community.
           </motion.p>
        </div>

        {/* 
            MOBILE: Horizontal Scroll Snap with Infinite Loop logic
            DESKTOP: Grid (duplicates hidden)
        */}
        <motion.div 
            ref={scrollRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pt-12 pb-8 lg:pt-0 lg:grid lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12 lg:overflow-visible scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0"
            style={{ scrollBehavior: 'auto' }} // Ensure instant jumps don't animate
        >
          {extendedFeatures.map((feature, i) => (
            <motion.div
              key={i}
              variants={{
                 hidden: { opacity: 0, y: 40 },
                 visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
              }}
              className={`snap-center shrink-0 w-[85vw] sm:w-[400px] lg:w-auto group relative flex flex-col justify-end min-h-[400px] lg:min-h-[480px] hover:-translate-y-2 transition-transform duration-500 ${i >= features.length ? 'lg:hidden' : ''}`}
            >
              {/* 
                  THE CARD BASE 
                  Visually acts as the container, but sits lower to allow the image to pop out top.
              */}
              <div className="absolute bottom-0 w-full h-[75%] lg:h-[80%] rounded-[2rem] border border-white/10 bg-[#0A0A0B] transition-all duration-500 group-hover:border-violet-500/40 group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] overflow-visible">
                  
                  {/* Inner Glow Gradient */}
                  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-violet-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Decorative Texture */}
                  <div className="absolute inset-0 rounded-[2rem] opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />
              </div>

              {/* 
                  THE IMAGE (POP OUT)
                  Positioned absolutely to overlap the top of the card base.
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
                  Fixed height containers ensure alignment across cards
              */}
              <div className="relative z-30 p-6 pt-12 text-center pb-8 flex flex-col items-center">
                  <div className="w-10 h-1 bg-violet-500 rounded-full mx-auto mb-4 group-hover:w-16 transition-all duration-300 shrink-0" />
                  
                  {/* Title Container - Fixed height for alignment */}
                  <div className="h-8 mb-2 flex items-center justify-center shrink-0">
                    <h3 className="font-display font-bold text-xl text-white group-hover:text-violet-200 transition-colors">
                        {feature.title}
                    </h3>
                  </div>
                  
                  {/* Description Container - Fixed height for alignment */}
                  <div className="h-16 flex items-start justify-center">
                    <p className="text-gray-400 text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity line-clamp-3">
                        {feature.desc}
                    </p>
                  </div>
              </div>

            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
