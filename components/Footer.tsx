
import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Youtube, Instagram, Github, Shield } from 'lucide-react';

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
                  src="https://raw.githubusercontent.com/cavanjuice/assets/main/logostreamyst.png" 
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

             {/* LEGAL COLUMN - Now Functional */}
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
                    <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter"><Twitter size={20} /></a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="YouTube"><Youtube size={20} /></a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub"><Github size={20} /></a>
                </div>
             </motion.div>
          </div>
        </div>

        <motion.div variants={itemVariants} className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
            <p>&copy; {new Date().getFullYear()} Streamyst BV. All rights reserved.</p>
            <div className="flex gap-4 mt-2 md:mt-0">
                <span>Built with 💜 in Antwerp</span>
            </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
