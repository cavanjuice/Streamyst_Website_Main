
import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Youtube, Instagram, Github } from 'lucide-react';

interface FooterProps {
    onNavigate?: (view: 'home' | 'about') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-gradient-to-b from-transparent to-cosmic-950 pt-16 pb-8 relative z-10">
      <motion.div 
        className="container mx-auto px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-12">
          <div className="mb-8 md:mb-0 text-center md:text-left">
             <div className="flex items-center justify-center md:justify-start mb-4 cursor-pointer" onClick={() => onNavigate?.('home')}>
                <img 
                  src="https://raw.githubusercontent.com/cavanjuice/assets/main/logostreamyst.png" 
                  alt="Streamyst" 
                  className="h-20 w-auto object-contain" 
                />
             </div>
             <p className="text-gray-500 max-w-xs text-sm">
                The next evolution of livestreaming connection. <br />
                Don't just watch. Feel.
             </p>
          </div>

          <div className="flex flex-wrap gap-8 justify-center">
             <div>
                <h4 className="font-bold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-cyan-400 transition-colors">The Vybe</a></li>
                    <li><a href="#" className="hover:text-cyan-400 transition-colors">Software</a></li>
                    <li><a href="#" className="hover:text-cyan-400 transition-colors">Integrations</a></li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-white mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li>
                        <button 
                            onClick={() => onNavigate?.('about')} 
                            className="hover:text-cyan-400 transition-colors text-left"
                        >
                            About Us
                        </button>
                    </li>
                    <li><a href="#" className="hover:text-cyan-400 transition-colors">Careers</a></li>
                    <li><a href="#" className="hover:text-cyan-400 transition-colors">Blog</a></li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-white mb-4">Social</h4>
                <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors"><Youtube size={20} /></a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github size={20} /></a>
                </div>
             </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
            <p>&copy; {new Date().getFullYear()} Streamyst BV. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Built with 💜 in Antwerp, Belgium</p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
