
import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "It's like having a sixth sense for my community. I can finally feel when the chat is hyped without looking away from the game.",
    name: "Alex_Streams",
    role: "Variety Streamer • 45K followers",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4",
    borderColor: "border-orange-500/30" // Was Cyan
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
    borderColor: "border-violet-500/30" // Changed to violet for purple theme
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 md:py-32 relative z-10 overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-3xl md:text-5xl"
          >
            Trusted by Creators. <span className="text-gray-500">Loved by Communities.</span>
          </motion.h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0A0A0B] border border-white/10 p-8 rounded-3xl relative"
            >
              {/* Quote Icon */}
              <div className="mb-6 opacity-30">
                <Quote size={40} strokeWidth={1} className="text-gray-400 fill-transparent" />
              </div>

              {/* Text */}
              <p className="text-gray-300 text-lg leading-relaxed mb-8 font-light relative z-10">
                "{t.quote}"
              </p>
              
              {/* User Info */}
              <div className="flex items-center gap-4 mt-auto">
                <div className={`p-[2px] rounded-full bg-gradient-to-tr from-white/10 to-transparent ${t.borderColor} border`}>
                    <img 
                        src={t.avatar} 
                        alt={t.name} 
                        className="w-10 h-10 rounded-full bg-black/50" 
                    />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{t.name}</h4>
                  <p className="text-gray-500 text-xs font-medium">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Compatibility */}
        <div className="flex flex-col items-center">
            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-8 bg-white/5 px-8 py-4 rounded-full border border-white/5 backdrop-blur-sm"
            >
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mr-2">Compatible with</span>
                <div className="flex items-center gap-8">
                    <span className="text-[#a970ff] font-bold text-sm hover:text-[#bf94ff] transition-colors cursor-default">Twitch</span>
                    <span className="text-[#ff4444] font-bold text-sm hover:text-[#ff6666] transition-colors cursor-default">YouTube</span>
                    <span className="text-[#53fc18] font-bold text-sm hover:text-[#74ff42] transition-colors cursor-default">Kick</span>
                </div>
            </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
