import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { SupabaseImg } from './SupabaseImg';
import { getAssetUrl } from '../utils/supabaseClient';
import { Cpu, Instagram, Youtube, Twitch } from 'lucide-react';

interface CreatorSocial {
  icon: React.ElementType;
  url: string;
}

interface CreatorInfo {
  name: string;
  socials?: CreatorSocial[];
  quote?: string;
  status?: string;
}

interface GalleryItem {
  src: string;
  creator?: CreatorInfo;
}

// All available items (Pool of 12)
const CREATOR_POOL: GalleryItem[] = [
  // Originally Row 1
  { 
    src: 'elliii(2).webp', 
    creator: {
      name: "Elli",
      socials: [
        { icon: Instagram, url: "https://www.instagram.com/elliartcore/" },
        { icon: Twitch, url: "https://www.twitch.tv/ElliArtcore" }
      ]
    }
  },
  { 
    src: 'EspeSpeakingtoaudience2.webp', 
    creator: {
      name: "Espe",
      socials: [
        { icon: Instagram, url: "https://www.instagram.com/hyper_espe/" },
        { icon: Twitch, url: "https://www.twitch.tv/espe_be" }
      ]
    }
  },
  { 
    src: 'EspeLaughingonfre.webp', 
    creator: {
      name: "Espe",
      socials: [
        { icon: Instagram, url: "https://www.instagram.com/hyper_espe/" },
        { icon: Twitch, url: "https://www.twitch.tv/espe_be" }
      ]
    }
  },
  
  // Originally Row 2 & 3
  { 
    src: 'noomielitpurple.webp', 
    creator: {
      name: "Noomie",
      socials: [
        { icon: Instagram, url: "https://www.instagram.com/itsnoomie/" },
        { icon: Youtube, url: "https://www.youtube.com/@itsnoomie" }
      ]
    }
  }, 
  { 
    src: 'lily.webp', 
    creator: { name: "Lilly", status: "Offline" }
  },
  { 
    src: '_DSC0148.webp', 
    creator: { name: "Lilly", status: "Offline" }
  },
  
  // Originally Row 3 Fillers
  { 
    src: '_DSC0156purple.webp', 
    creator: { name: "Lilly", status: "Offline" }
  },
  { 
    src: '_DSC0139.webp', 
    creator: { name: "Lilly", status: "Offline" }
  },
  { 
    src: 'ayron.webp', 
    creator: {
      name: "Ayron",
      quote: "A great tool to shape a closer bond with your audience.",
      socials: [
        { icon: Twitch, url: "https://www.twitch.tv/onionknightt" },
        { icon: Instagram, url: "https://www.instagram.com/0nionknightt/" }
      ]
    }
  },

  // Originally Row 4 (Now part of the swapping pool)
  { 
    src: 'STREAMER2.webp', 
    creator: { name: "Lilly", status: "Offline" }
  },
  { 
    src: 'mad3stranspa.PNG', 
    creator: { name: "Lea" }
  },
  { 
    src: 'transpafiredmads.png', 
    creator: { name: "Lea" }
  },
];

// Define the 9 fixed slots layout
// Adjusted for Mobile (2 cols) and Desktop (4 cols)
const GRID_LAYOUT = [
  { span: 'col-span-1 md:col-span-1 md:row-span-1' }, // 0
  { span: 'col-span-1 md:col-span-2 md:row-span-1' }, // 1
  { span: 'col-span-2 md:col-span-1 md:row-span-1' }, // 2 (Wide on Mobile)
  { span: 'col-span-1 row-span-2 md:col-span-1 md:row-span-2' }, // 3 (Tall on both)
  { span: 'col-span-1 md:col-span-1 md:row-span-1' }, // 4
  { span: 'col-span-1 md:col-span-2 md:row-span-1' }, // 5
  { span: 'hidden md:block md:col-span-1 md:row-span-1' }, // 6 (Hidden on Mobile)
  { span: 'hidden md:block md:col-span-1 md:row-span-1' }, // 7 (Hidden on Mobile)
  { span: 'hidden md:block md:col-span-1 md:row-span-1' }, // 8 (Hidden on Mobile)
];

const CreatorGallery: React.FC = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "100px" });
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  
  // State: Which index from CREATOR_POOL is in which slot?
  // Initialize with 0-8. Indices 9-11 are in reserve.
  const [slotIndices, setSlotIndices] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8]);

  useEffect(() => {
    // 1. Preload Images for smooth swapping
    CREATOR_POOL.forEach(item => {
        const img = new Image();
        img.src = getAssetUrl(item.src);
    });

    const handleLoad = () => {
        setTimeout(() => setIsPageLoaded(true), 1000);
    };

    if (document.readyState === 'complete') {
        handleLoad();
    } else {
        window.addEventListener('load', handleLoad);
        const timeout = setTimeout(handleLoad, 4000);
        return () => {
            window.removeEventListener('load', handleLoad);
            clearTimeout(timeout);
        };
    }
  }, []);

  // Random Swapping Logic
  useEffect(() => {
    if (!isInView) return;

    const intervalId = setInterval(() => {
        setSlotIndices(current => {
            // Identify images NOT currently displayed
            const availablePoolIndices = CREATOR_POOL.map((_, i) => i).filter(i => !current.includes(i));
            
            if (availablePoolIndices.length === 0) return current;

            // 1. Pick a random slot to update (0-8)
            const slotToUpdate = Math.floor(Math.random() * current.length);
            
            // 2. Pick a random image from the reserve
            const newImageIndex = availablePoolIndices[Math.floor(Math.random() * availablePoolIndices.length)];

            // 3. Create new state
            const next = [...current];
            next[slotToUpdate] = newImageIndex;
            return next;
        });
    }, 7000); // Increased from 4000ms to 7000ms

    return () => clearInterval(intervalId);
  }, [isInView]);

  const shouldRenderImages = isInView && isPageLoaded;

  return (
    <section id="gallery" className="py-6 md:py-8 relative z-10 bg-[#030205] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[200px] h-[200px] bg-violet-600/5 blur-[80px] rounded-full" />
        <div className="absolute bottom-[20%] left-[10%] w-[200px] h-[200px] bg-orange-600/5 blur-[80px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6 max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 mb-2 backdrop-blur-sm"
          >
            <Cpu className="w-2.5 h-2.5 text-violet-400" />
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-violet-200">v1 Prototype tests</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold text-xl md:text-2xl text-white mb-2 tracking-tight"
          >
            REAL CREATORS, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-white">REAL REACTIONS</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[10px] md:text-xs text-gray-400 font-light leading-relaxed max-w-md mx-auto"
          >
            From the lab to the setup. We've been testing Streamyst in the wild with creators who demand more from their connection.
          </motion.p>
        </div>

        {/* Dynamic Grid */}
        <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] md:auto-rows-[170px] gap-2 min-h-[300px]">
          {shouldRenderImages ? GRID_LAYOUT.map((layout, i) => {
            const itemIndex = slotIndices[i];
            const item = CREATOR_POOL[itemIndex];

            return (
              <motion.div
                key={i} // Use index as key for the grid cell itself to maintain structure
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: "circOut" }}
                className={`relative group overflow-hidden rounded-lg bg-white/5 border border-white/10 ${layout.span}`}
              >
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={item.src} // Changing this key triggers the exit/enter animation
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }} // Slow and smooth fade
                        className="absolute inset-0 w-full h-full"
                    >
                        {/* Image Container */}
                        <div className="w-full h-full overflow-hidden bg-white/5">
                            <SupabaseImg
                                filename={item.src}
                                alt={item.creator?.name || `Prototype Session`}
                                // Snappy hover zoom kept separate from the slow swap fade
                                className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-110 !transition-all !duration-500 ease-out transform-gpu will-change-transform"
                            />
                        </div>

                        {/* Overlay Content */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3 md:p-4">
                            {item.creator && (
                                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 ease-out">
                                    <div className="flex items-end justify-between mb-1">
                                        <h3 className="text-lg font-bold font-display text-white leading-none">{item.creator.name}</h3>
                                        {item.creator.status && (
                                            <span className="text-[8px] font-mono uppercase tracking-wider text-gray-500 bg-white/10 px-1.5 py-0.5 rounded">
                                            {item.creator.status}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {item.creator.quote && (
                                        <p className="text-[9px] md:text-[10px] text-gray-300 italic mb-2 leading-tight opacity-90 border-l-2 border-violet-500 pl-2">
                                            "{item.creator.quote}"
                                        </p>
                                    )}

                                    {item.creator.socials && (
                                        <div className="flex gap-2 mt-2">
                                            {item.creator.socials.map((social, idx) => (
                                            <a
                                                key={idx}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 rounded-full bg-white/10 hover:bg-violet-500 text-gray-300 hover:text-white transition-colors duration-200"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <social.icon size={12} />
                                            </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
              </motion.div>
            );
          }) : (
            // Skeletons
            GRID_LAYOUT.map((layout, i) => (
               <div key={`skel-${i}`} className={`rounded-lg bg-white/[0.02] border border-white/[0.05] animate-pulse ${layout.span}`} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default CreatorGallery;