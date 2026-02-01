
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield, ChevronRight } from 'lucide-react';

interface GDPRBannerProps {
    forceOpen?: boolean;
    onCloseForce?: () => void;
}

const GDPRBanner: React.FC<GDPRBannerProps> = ({ forceOpen, onCloseForce }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // 1. Initial Check on Mount (Delay)
        const consent = localStorage.getItem('streamyst_cookie_consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    // 2. React to prop changes (Footer Trigger)
    useEffect(() => {
        if (forceOpen) {
            setIsVisible(true);
        }
    }, [forceOpen]);

    const handleClose = () => {
        setIsVisible(false);
        if (onCloseForce) onCloseForce();
    };

    const handleConsent = (type: 'all' | 'necessary') => {
        localStorage.setItem('streamyst_cookie_consent', type);
        handleClose();
        
        if (type === 'all') {
            console.log('Streamyst: Analytics cookies accepted');
            // Initialize GA4 / Pixel here
        } else {
            console.log('Streamyst: Necessary cookies only');
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 flex justify-center md:justify-end pointer-events-none"
                >
                    <div className="pointer-events-auto w-full max-w-md bg-[#0A0A0B]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden group">
                        
                        {/* Cosmic Glow */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500 opacity-80" />
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-violet-500/10 rounded-full blur-[50px] pointer-events-none" />

                        <div className="p-6 relative z-10">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-violet-400 shrink-0">
                                    <Cookie size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-display font-bold text-lg mb-1 flex items-center gap-2">
                                        Cookie Preferences <Shield size={14} className="text-gray-500" />
                                    </h3>
                                    <p className="text-gray-400 text-xs leading-relaxed font-light">
                                        We use cookies to enhance your experience, analyze site traffic, and personalize content. 
                                        Your data remains yours.
                                    </p>
                                </div>
                                <button 
                                    onClick={handleClose}
                                    className="text-gray-500 hover:text-white transition-colors -mt-1 -mr-2 p-2 cursor-pointer relative z-20"
                                    aria-label="Close"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => handleConsent('necessary')}
                                    className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all uppercase tracking-wider cursor-pointer relative z-20"
                                >
                                    Necessary Only
                                </button>
                                <button
                                    onClick={() => handleConsent('all')}
                                    className="flex-1 py-3 px-4 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-violet-50 transition-all flex items-center justify-center gap-2 group/btn shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] cursor-pointer relative z-20"
                                >
                                    Accept All
                                    <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GDPRBanner;
