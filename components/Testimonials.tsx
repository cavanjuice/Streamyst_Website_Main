
import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "It's like having a sixth sense for my community. I can finally feel when the chat is hyped without looking away from the game.",
    name: "Alex_Streams",
    role: "Variety Streamer • 45K followers",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4",
    borderColor: "border-orange-500/30" 
  },
  {
    quote: "The burnout reduction is real. I used to feel drained after every stream. Now I leave feeling connected, not exhausted.",
    name: "NightQueenGG",
    role: "FPS Pro • 120K followers",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NightQueen&backgroundColor=ffdfbf",
    borderColor: "border-pink-500/30"
  },
  {
    quote: "My viewers love seeing their collective energy visualized. It's completely changed how we interact as a community.",
    name: "ChillVibes_",
    role: "Just Chatting • 80K followers",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chill&backgroundColor=c0aede",
    borderColor: "border-violet-500/30" 
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 lg:py-48 relative z-10 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl bg-violet-900/5 blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight mb-4"
          >
            Trusted by Creators. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Loved by Communities.</span>
          </motion.h2>
        </div>

        {/* Testimonial Carousel */}
        {/* Mobile: Horizontal Snap Scroll | Desktop: Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-12 md:grid md:grid-cols-3 md:gap-6 md:pb-0 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="snap-center shrink-0 w-[85vw] md:w-auto flex flex-col bg-[#0A0A0B] border border-white/10 p-8 md:p-10 rounded-[2rem] relative group hover:border-white/20 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] pointer-events-none" />

              {/* Quote Icon */}
              <div className="mb-6 md:mb-8 opacity-40 group-hover:opacity-60 transition-opacity">
                <Quote size={32} className="text-violet-400 fill-violet-400/20" />
              </div>

              {/* Text */}
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 font-light relative z-10 italic">
                "{t.quote}"
              </p>
              
              {/* User Info */}
              <div className="flex items-center gap-4 mt-auto relative z-10 border-t border-white/5 pt-6">
                <div className={`p-[3px] rounded-full bg-gradient-to-tr from-white/20 to-transparent ${t.borderColor} border backdrop-blur-md`}>
                    <img 
                        src={t.avatar} 
                        alt={t.name} 
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50" 
                    />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base md:text-lg tracking-tight">{t.name}</h4>
                  <p className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
          {/* Padding element for mobile scroll to allow seeing the last card fully */}
          <div className="w-2 md:hidden shrink-0" />
        </div>

        {/* Compatibility Bar */}
        <div className="flex justify-center mt-8 md:mt-24">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex flex-col md:flex-row items-center gap-4 md:gap-8 px-8 py-4 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-sm"
            >
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Seamlessly Integrated With</span>
                <div className="flex items-center gap-8 opacity-75 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="text-[#a970ff] font-bold text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>
                        Twitch
                    </span>
                    <span className="text-[#ff0000] font-bold text-sm flex items-center gap-2">
                         <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        YouTube
                    </span>
                    <span className="text-[#53fc18] font-bold text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M11.23 2.51 18.2 2H22l-8.62 6.55L22 22h-3.95l-5.69-7.96L8.71 17.02V22H3.5V2h5.21v9.64z"/></svg>
                        Kick
                    </span>
                </div>
            </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
