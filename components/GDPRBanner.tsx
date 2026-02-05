import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, ChevronRight, Lock } from 'lucide-react';

interface GDPRBannerProps {
    forceOpen?: boolean;
    onCloseForce?: () => void;
    isPriority?: boolean;
}

const GDPRBanner: React.FC<GDPRBannerProps> = ({ forceOpen, onCloseForce, isPriority }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        try {
            const consent = localStorage.getItem('streamyst_cookie_consent');
            if (!consent) {
                // Wait slightly before showing for natural flow
                const timer = setTimeout(() => setIsVisible(true), 1500);
                return () => clearTimeout(timer);
            }
        } catch (e) {
            setIsVisible(true);
        }
    }, []);

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
        const isGranted = type === 'all' ? 'granted' : 'denied';
        
        // Update Google Consent Mode v2 state
        if ((window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                'ad_storage': isGranted,
                'ad_user_data': isGranted,
                'ad_personalization': isGranted,
                'analytics_storage': isGranted
            });
        }

        try {
            localStorage.setItem('streamyst_cookie_consent', type);
        } catch (e) {}
        
        handleClose();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0, x: "-50%" }}
                    animate={{ 
                        y: 0, 
                        opacity: 1, 
                        x: "-50%",
                        scale: isPriority ? [1, 1.02, 1] : 1
                    }}
                    exit={{ y: 100, opacity: 0, x: "-50%" }}
                    transition={{ 
                        duration: 0.6, 
                        ease: [0.16, 1, 0.3, 1],
                        scale: isPriority ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}
                    }}
                    className="fixed bottom-4 md:bottom-8 left-1/2 z-[100] w-[95%] max-w-2xl pointer-events-none"
                >
                    <div className={`pointer-events-auto bg-[#0A0A0B]/95 backdrop-blur-2xl border rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group transition-all duration-500 ${isPriority ? 'border-violet-500/50 ring-1 ring-violet-500/20' : 'border-white/10'}`}>
                        
                        {/* Shimmer Border for Priority */}
                        {isPriority && (
                            <motion.div 
                                className="absolute inset-0 z-0 pointer-events-none"
                                animate={{
                                    background: [
                                        "radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
                                        "radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
                                        "radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)"
                                    ]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />
                        )}

                        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10">
                            <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-2">
                                <div className={`p-4 rounded-2xl border transition-colors ${isPriority ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' : 'bg-white/5 border-white/5 text-gray-400'}`}>
                                    <Cookie size={28} />
                                </div>
                                <div className="md:mt-2">
                                    <h3 className="text-white font-display font-bold text-lg md:text-xl flex items-center gap-2">
                                        Privacy Sync <Shield size={14} className="text-gray-500" />
                                    </h3>
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light mb-6 md:mb-0">
                                    We use cookies to measure our mission's impact. Your data remains yours, used only to improve the <span className="text-white font-medium">Streamyst</span> experience.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
                                <button
                                    onClick={() => handleConsent('all')}
                                    className="w-full md:w-48 py-4 px-6 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-violet-50 transition-all flex items-center justify-center gap-2 group/btn shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] cursor-pointer"
                                >
                                    Accept All
                                    <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => handleConsent('necessary')}
                                    className="w-full md:w-48 py-4 px-6 rounded-xl border border-white/10 text-xs font-bold text-gray-500 hover:text-white hover:bg-white/5 transition-all uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <Lock size={12} /> Necessary Only
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