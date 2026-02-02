
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';
import { getAssetUrl } from '../utils/supabaseClient';

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
                transition={{ duration: 0.6, ease: "easeInOut" }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 cursor-pointer"
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-5xl aspect-video pointer-events-none">
                
                {/* 
                    Animation Concept: "The Cyber Split" - Refined for Fluidity
                    1. Horizontal line expands (ScaleX)
                    2. Opens vertically (ScaleY)
                    Uses custom bezier curves [0.16, 1, 0.3, 1] for smooth settling
                */}
                <motion.div 
                    initial={{ scaleX: 0, scaleY: 0.005, opacity: 0 }}
                    animate={{ 
                        scaleX: 1, 
                        opacity: 1,
                        scaleY: 1,
                        transition: {
                            scaleX: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                            scaleY: { duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
                            opacity: { duration: 0.2 }
                        }
                    }}
                    exit={{ 
                        scaleY: 0.005,
                        scaleX: 0,
                        opacity: 0,
                        transition: {
                            scaleY: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                            scaleX: { duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
                            opacity: { duration: 0.2, delay: 0.7 }
                        }
                    }}
                    className="absolute inset-0 bg-black overflow-hidden pointer-events-auto border border-white/10 shadow-[0_0_100px_rgba(139,92,246,0.2)] rounded-sm"
                >
                    {/* Content Fade In (Waits for box to fully open) */}
                    <motion.div
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                         transition={{ duration: 0.4, delay: 0.9 }} 
                         className="w-full h-full relative group"
                    >
                         {/* Close Button (Inside Frame) */}
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-white/10 text-white/50 hover:text-white rounded-full transition-all border border-white/5 backdrop-blur-md"
                        >
                            <X size={24} />
                        </button>

                         {/* Actual Video Player Sourced from Supabase */}
                         <div className="w-full h-full bg-black flex items-center justify-center relative overflow-hidden">
                             <video 
                                src={getAssetUrl('videonotext.mp4')}
                                autoPlay
                                controls
                                className="w-full h-full object-contain"
                             >
                                <div className="text-center text-white">
                                    <p className="mb-2">Your browser does not support the video tag.</p>
                                    <a href={getAssetUrl('videonotext.mp4')} className="text-violet-400 hover:underline">Download Video</a>
                                </div>
                             </video>
                         </div>
                    </motion.div>

                    {/* Cosmetic Tech Borders */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50" />
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />
                    
                    {/* Corner Brackets */}
                    <svg className="absolute top-0 left-0 w-8 h-8 text-violet-500 pointer-events-none" viewBox="0 0 32 32">
                        <path d="M1 31V1H31" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <svg className="absolute bottom-0 right-0 w-8 h-8 text-orange-500 pointer-events-none" viewBox="0 0 32 32">
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
