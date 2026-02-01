
import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Youtube, Instagram, Github } from 'lucide-react';

interface FooterProps {
    onNavigate?: (view: 'home' | 'about') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
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
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-12">
          <motion.div variants={itemVariants} className="mb-8 md:mb-0 text-center md:text-left">
             <div className="flex items-center justify-center md:justify-start mb-4 cursor-pointer" onClick={() => onNavigate?.('home')}>
                <img 
                  src="https://raw.githubusercontent.com/cavanjuice/assets/main/logostreamyst.png" 
                  alt="Streamyst" 
                  className="h-20 w-auto object-contain" 
                />
             </div>
             <p className="text-gray-500 max-w-xs text-sm">
                Connecting Streamers with Audiences through Interactive XR. <br />
                Don't just watch. Experience.
             </p>
          </motion.div>

          <div className="flex flex-wrap gap-8 justify-center">
             <motion.div variants={itemVariants}>
                <h4 className="font-bold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-orange-400 transition-colors">The Vybe</a></li>
                    <li><a href="#" className="hover:text-orange-400 transition-colors">Software</a></li>
                    <li><a href="#" className="hover:text-orange-400 transition-colors">Integrations</a></li>
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
                    <li><a href="#" className="hover:text-orange-400 transition-colors">Careers</a></li>
                    <li><a href="#" className="hover:text-orange-400 transition-colors">Blog</a></li>
                </ul>
             </motion.div>
             <motion.div variants={itemVariants}>
                <h4 className="font-bold text-white mb-4">Social</h4>
                <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors"><Youtube size={20} /></a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github size={20} /></a>
                </div>
             </motion.div>
          </div>
        </div>

        <motion.div variants={itemVariants} className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
            <p>&copy; {new Date().getFullYear()} Streamyst BV. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Built with 💜 in Antwerp, Belgium</p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
