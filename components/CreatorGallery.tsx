import React from 'react';
import { motion } from 'framer-motion';
import { SupabaseImg } from './SupabaseImg';
import { Cpu, Instagram, Youtube, Twitch, ExternalLink } from 'lucide-react';

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
  span?: string;
  creator?: CreatorInfo;
}

const galleryImages: GalleryItem[] = [
  // Row 1
  { 
    src: 'elliii(2).webp', 
    span: 'md:col-span-1 md:row-span-1',
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
    span: 'md:col-span-2 md:row-span-1',
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
    span: 'md:col-span-1 md:row-span-1',
    creator: {
      name: "Espe",
      socials: [
        { icon: Instagram, url: "https://www.instagram.com/hyper_espe/" },
        { icon: Twitch, url: "https://www.twitch.tv/espe_be" }
      ]
    }
  },
  
  // Row 2 & 3 (Vertical anchor on left)
  { 
    src: 'noomielitpurple.webp', 
    span: 'md:col-span-1 md:row-span-2',
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
    span: 'md:col-span-1 md:row-span-1',
    creator: { name: "Lilly", status: "Offline" }
  },
  { 
    src: '_DSC0148.webp', 
    span: 'md:col-span-2 md:row-span-1',
    creator: { name: "Lilly", status: "Offline" }
  },
  
  // Row 3 Fillers
  { 
    src: '_DSC0156purple.webp', 
    span: 'md:col-span-1 md:row-span-1',
    creator: { name: "Lilly", status: "Offline" }
  },
  { 
    src: '_DSC0139.webp', 
    span: 'md:col-span-1 md:row-span-1',
    creator: { name: "Lilly", status: "Offline" }
  },
  { 
    src: 'ayron.webp', 
    span: 'md:col-span-1 md:row-span-1',
    creator: {
      name: "Ayron",
      quote: "A great tool to shape a closer bond with your audience.",
      socials: [
        { icon: Twitch, url: "https://www.twitch.tv/onionknightt" },
        { icon: Instagram, url: "https://www.instagram.com/0nionknightt/" }
      ]
    }
  },

  // Row 4
  { 
    src: 'STREAMER2.webp', 
    span: 'md:col-span-1 md:row-span-1',
    creator: { name: "Lilly", status: "Offline" }
  },
  { 
    src: 'mad3stranspa.PNG', 
    span: 'md:col-span-2 md:row-span-1',
    creator: { name: "Lea" }
  },
  { 
    src: 'transpafiredmads.png', 
    span: 'md:col-span-1 md:row-span-1',
    creator: { name: "Lea" }
  },
];

const CreatorGallery: React.FC = () => {
  return (
    <section id="gallery" className="py-6 md:py-8 relative z-10 bg-[#030205] overflow-hidden">
      {/* Background Ambience - Minimal */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[200px] h-[200px] bg-violet-600/5 blur-[80px] rounded-full" />
        <div className="absolute bottom-[20%] left-[10%] w-[200px] h-[200px] bg-orange-600/5 blur-[80px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        {/* Header - Ultra Compact */}
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

        {/* Dynamic Bento Grid - Fixed Row Heights for Compactness */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] md:auto-rows-[170px] gap-2">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: "circOut" }}
              className={`relative group overflow-hidden rounded-lg bg-white/5 border border-white/10 ${img.span}`}
            >
              {/* Image Container */}
              <div className="w-full h-full overflow-hidden">
                <SupabaseImg
                  filename={img.src}
                  alt={img.creator?.name || `Prototype Session ${i + 1}`}
                  className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
              </div>

              {/* Overlay Content - Richer Info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-4">
                
                {img.creator && (
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    <div className="flex items-end justify-between mb-1">
                      <h3 className="text-lg font-bold font-display text-white leading-none">{img.creator.name}</h3>
                      {img.creator.status && (
                        <span className="text-[8px] font-mono uppercase tracking-wider text-gray-500 bg-white/10 px-1.5 py-0.5 rounded">
                          {img.creator.status}
                        </span>
                      )}
                    </div>
                    
                    {img.creator.quote && (
                      <p className="text-[9px] md:text-[10px] text-gray-300 italic mb-2 leading-tight opacity-90 border-l-2 border-violet-500 pl-2">
                        "{img.creator.quote}"
                      </p>
                    )}

                    {img.creator.socials && (
                      <div className="flex gap-2 mt-2">
                        {img.creator.socials.map((social, idx) => (
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default CreatorGallery;