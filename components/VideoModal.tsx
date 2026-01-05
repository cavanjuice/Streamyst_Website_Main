
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-0">
            {/* Backdrop with blur and darken */}
            <motion.div 
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.4 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 cursor-pointer"
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-5xl aspect-video pointer-events-none">
                
                {/* 
                    Animation Concept: "The Cyber Split"
                    1. A horizontal line appears (scaleX 0->1)
                    2. It opens vertically (scaleY 0->1)
                */}
                <motion.div 
                    initial={{ scaleX: 0, scaleY: 0.005, opacity: 0 }}
                    animate={{ 
                        scaleX: 1, 
                        opacity: 1,
                        scaleY: 1,
                        transition: {
                            scaleX: { duration: 0.4, ease: "circOut" },
                            scaleY: { duration: 0.5, delay: 0.4, ease: "circOut" },
                            opacity: { duration: 0.1 }
                        }
                    }}
                    exit={{ 
                        scaleY: 0.005,
                        scaleX: 0,
                        opacity: 0,
                        transition: {
                            scaleY: { duration: 0.4, ease: "circIn" },
                            scaleX: { duration: 0.4, delay: 0.3, ease: "circIn" },
                            opacity: { delay: 0.6 }
                        }
                    }}
                    className="absolute inset-0 bg-black overflow-hidden pointer-events-auto border border-white/10 shadow-[0_0_100px_rgba(139,92,246,0.2)] rounded-sm"
                >
                    {/* Content Fade In (Slightly delayed to wait for box to open) */}
                    <motion.div
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                         transition={{ duration: 0.3, delay: 0.7 }}
                         className="w-full h-full relative group"
                    >
                         {/* Close Button (Inside Frame) */}
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-white/10 text-white/50 hover:text-white rounded-full transition-all border border-white/5 backdrop-blur-md"
                        >
                            <X size={24} />
                        </button>

                         {/* Placeholder Video / Embed */}
                         <div className="w-full h-full bg-cosmic-900 flex items-center justify-center relative overflow-hidden">
                            {/* Animated Background for placeholder */}
                             <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-black to-cyan-900/20" />
                             <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                             
                             <div className="text-center relative z-10">
                                 <motion.div 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"
                                >
                                    <Play className="w-10 h-10 text-white fill-white ml-1 opacity-80" />
                                 </motion.div>
                                 <h3 className="font-display font-bold text-2xl mb-2 tracking-widest uppercase">Streamyst Demo</h3>
                                 <p className="text-gray-500 font-mono text-xs">Video Source Placeholder</p>
                             </div>

                             {/* Simulate Video UI */}
                             <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 30, ease: "linear" }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
                                 />
                             </div>
                         </div>
                    </motion.div>

                    {/* Cosmetic Tech Borders */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50" />
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                    
                    {/* Corner Brackets */}
                    <svg className="absolute top-0 left-0 w-8 h-8 text-violet-500 pointer-events-none" viewBox="0 0 32 32">
                        <path d="M1 31V1H31" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <svg className="absolute bottom-0 right-0 w-8 h-8 text-cyan-500 pointer-events-none" viewBox="0 0 32 32">
                        <path d="M31 1V31H1" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>

                </motion.div>
            </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;
