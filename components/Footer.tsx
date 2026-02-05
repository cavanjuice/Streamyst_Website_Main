import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Shield } from 'lucide-react';
import { getAssetUrl } from '../utils/supabaseClient';

const DiscordLogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.29a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .077.01c.12.098.246.196.373.29a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.874.89.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const TwitchLogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
  </svg>
);

interface FooterProps {
    onNavigate?: (view: any) => void;
    onOpenCookieSettings?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenCookieSettings }) => {
  const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
          opacity: 1,
          transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2
          }
      }
  };

  const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "circOut" as const } }
  };

  return (
    <footer className="bg-gradient-to-b from-transparent to-cosmic-950 pt-32 pb-16 relative z-10">
      <motion.div 
        className="container mx-auto px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start mb-12 gap-10 lg:gap-0">
          <motion.div variants={itemVariants} className="mb-8 lg:mb-0 text-center lg:text-left max-w-xs">
             <div className="flex items-center justify-center lg:justify-start mb-4 cursor-pointer" onClick={() => onNavigate?.('home')}>
                <img 
                  src={getAssetUrl("logostreamyst.webp")} 
                  alt="Streamyst" 
                  className="h-20 w-auto object-contain" 
                />
             </div>
             <p className="text-gray-500 text-sm mb-4">
                Connecting Streamers with Audiences through Interactive XR. <br />
                Don't just watch. Experience.
             </p>
             <div className="text-xs text-gray-600 font-mono">
                <p>Streamyst BV</p>
                <p>Antwerp, Belgium</p>
                <p>BE 0123.456.789</p>
             </div>
          </motion.div>

          <div className="flex flex-wrap gap-10 md:gap-16 justify-center lg:justify-end flex-1">
             <motion.div variants={itemVariants}>
                <h4 className="font-bold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li><button onClick={() => onNavigate?.('home')} className="hover:text-orange-400 transition-colors">The Vybe</button></li>
                    <li><button onClick={() => onNavigate?.('home')} className="hover:text-orange-400 transition-colors">Software</button></li>
                </ul>
             </motion.div>
             
             <motion.div variants={itemVariants}>
                <h4 className="font-bold text-white mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li>
                        <button 
                            onClick={() => onNavigate?.('about')} 
                            className="hover:text-orange-400 transition-colors text-left"
                        >
                            About Us
                        </button>
                    </li>
                    <li><a href="mailto:hello@streamyst.com" className="hover:text-orange-400 transition-colors">Contact</a></li>
                </ul>
             </motion.div>

             <motion.div variants={itemVariants}>
                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    Legal <Shield size={14} className="text-violet-500" />
                </h4>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li>
                        <button onClick={() => onNavigate?.('privacy')} className="hover:text-violet-400 transition-colors text-left">
                            Privacy Policy
                        </button>
                    </li>
                    <li>
                        <button onClick={() => onNavigate?.('terms')} className="hover:text-violet-400 transition-colors text-left">
                            Terms of Service
                        </button>
                    </li>
                    <li>
                        <button onClick={() => onNavigate?.('legal-notice')} className="hover:text-violet-400 transition-colors text-left">
                            Legal Notice
                        </button>
                    </li>
                    <li>
                        <button onClick={() => onNavigate?.('accessibility')} className="hover:text-violet-400 transition-colors text-left">
                            Accessibility
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={onOpenCookieSettings}
                            className="hover:text-violet-400 transition-colors text-left underline decoration-white/20 underline-offset-4"
                        >
                            Cookie Settings
                        </button>
                    </li>
                </ul>
             </motion.div>

             <motion.div variants={itemVariants}>
                <h4 className="font-bold text-white mb-4">Social</h4>
                <div className="flex space-x-4">
                    <a href="https://www.instagram.com/streamyst/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
                    <a href="https://discord.gg/ty8mJHNS" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Discord"><DiscordLogo size={20} /></a>
                    <a href="https://www.twitch.tv/mistvein_live" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitch"><TwitchLogo size={20} /></a>
                </div>
             </motion.div>
          </div>
        </div>

        <motion.div variants={itemVariants} className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-center md:justify-between items-center text-xs text-gray-600">
            <p>&copy; {new Date().getFullYear()} Streamyst BV. All rights reserved.</p>
            <p className="mt-2 md:mt-0 font-mono text-[10px] opacity-30">Production Build 0.1.7</p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;