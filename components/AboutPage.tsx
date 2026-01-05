
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { ArrowRight, Twitter, Linkedin, Github, MessageSquare, Zap, Globe, Users, Code, ChevronDown } from 'lucide-react';

// --- ASSETS & CONSTANTS ---

const FOUNDER_1_IMG = "https://raw.githubusercontent.com/cavanjuice/assets/main/DSC00257da.png"; // Robbe
const FOUNDER_2_IMG = "https://raw.githubusercontent.com/cavanjuice/assets/main/%C2%A9HF_Justin%20313.jpg"; // Justin

// --- DOM SUB-COMPONENTS ---

const SocialLink = ({ icon }: { icon: React.ReactNode }) => (
    <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300">
        {icon}
    </a>
);

// --- ACT II: TIMELINE COMPONENT ---

const TimelineNode = ({ title, date, children, index }: { title: string, date: string, children?: React.ReactNode, index: number }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.2 }}
            className="relative pl-12 md:pl-24 py-12 border-l border-white/10 group"
        >
            {/* The Node */}
            <div className="absolute left-[-8px] top-12 w-4 h-4 rounded-full bg-cosmic-950 border border-white/30 group-hover:border-cyan-400 group-hover:scale-125 transition-all duration-300 shadow-[0_0_0_4px_rgba(0,0,0,1)]">
                <div className="absolute inset-0 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
            </div>

            <div className="mb-2 flex items-center gap-4">
                <span className="font-mono text-xs text-cyan-500 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-900/50">{date}</span>
            </div>
            <h3 className="text-3xl font-display font-bold text-white mb-4">{title}</h3>
            <div className="text-gray-400 text-lg leading-relaxed max-w-xl">
                {children}
            </div>
        </motion.div>
    );
};

// --- ACT IV: FOUNDER CARD ---

const FounderCard = ({ img, name, role, quote, delay }: { img: string, name: string, role: string, quote: string, delay: number }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8 }}
            className="relative group w-full"
        >
            <div className="relative rounded-3xl overflow-hidden bg-[#0A0A0B] border border-white/10 hover:border-white/20 transition-all duration-500 shadow-2xl">
                {/* Image */}
                <div className="relative h-[450px] overflow-hidden">
                    <img 
                        src={img} 
                        alt={name} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent opacity-80" />
                    
                    {/* Scanlines Effect */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                </div>

                {/* Content */}
                <div className="relative p-8 -mt-24 z-10">
                    <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md mb-4">
                        <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">{role}</span>
                    </div>
                    
                    <h3 className="font-display font-bold text-3xl text-white mb-4">{name}</h3>
                    
                    <div className="mb-6 pl-4 border-l-2 border-violet-500/50">
                        <p className="text-gray-400 italic font-light leading-relaxed">
                            "{quote}"
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <SocialLink icon={<Linkedin size={18} />} />
                        <SocialLink icon={<Twitter size={18} />} />
                        <SocialLink icon={<Github size={18} />} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- MAIN PAGE COMPONENT ---

const AboutPage = ({ onBack }: { onBack: () => void }) => {
    const { scrollYProgress } = useScroll();
    const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
    
    // Background parallax based on scroll
    const bgY = useTransform(springScroll, [0, 1], ["0%", "20%"]);
    
    return (
        <div className="relative bg-[#030205] text-white min-h-screen overflow-x-hidden selection:bg-cyan-500/30">
            
            {/* --- GLOBAL BACKGROUND (Clean, Non-Cosmic) --- */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-[#030205]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B] via-[#05040a] to-[#000000] opacity-80" />
            </div>

            {/* --- ACT I: THE PARADOX --- */}
            <section className="relative z-10 min-h-[120vh] flex flex-col items-center justify-center px-6 pt-32 pb-20">
                <div className="max-w-4xl mx-auto text-center mb-24">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ duration: 2 }}
                        className="mb-12"
                    >
                        <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-none tracking-tighter mb-8">
                            We believe in a <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-white">Simple Truth.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
                            Technology should bring us <span className="text-cyan-400 font-medium glow-text">closer</span>, 
                            not pull us <span className="text-red-400 font-medium glow-text">apart</span>.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur text-xs font-mono mb-8 uppercase tracking-widest text-gray-400">
                            The Founders
                        </div>
                        
                        <div className="relative w-full max-w-4xl mx-auto md:h-[500px] flex items-center justify-center group">
                             {/* Glow */}
                             <div className="absolute inset-0 bg-violet-500/10 blur-[100px] rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
                             <img 
                                src="https://raw.githubusercontent.com/cavanjuice/assets/main/Founders%20Pic%20Transparent.png"
                                alt="Streamyst Founders"
                                className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_50px_rgba(139,92,246,0.2)]"
                                style={{
                                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
                                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)'
                                }}
                             />
                        </div>
                    </motion.div>
                </div>
                
                <motion.div 
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-600"
                >
                    <ChevronDown size={24} />
                </motion.div>
            </section>

            {/* --- ACT II: THE SPARK --- */}
            <section className="relative z-10 py-32 md:py-48 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        whileInView={{ opacity: 1 }}
                        className="mb-20 pl-12 md:pl-24"
                    >
                        <h2 className="font-display font-bold text-4xl md:text-6xl mb-4">It Started With A <span className="text-violet-400">Question.</span></h2>
                        <div className="h-1 w-20 bg-violet-500 rounded-full" />
                    </motion.div>

                    <div className="relative">
                        <TimelineNode title="The Thesis" date="ANTWERP, 2024" index={0}>
                            <p className="mb-4">
                                Robbe De Block was finishing his Master's in Product Development. 
                                His question was simple but radical:
                            </p>
                            <p className="italic text-white font-medium border-l-2 border-violet-500 pl-4 mb-4">
                                "How can XR create meaningful interaction in livestreaming?"
                            </p>
                            <p>
                                The research confirmed what he felt.
                            </p>
                        </TimelineNode>

                        <TimelineNode title="Industrial Supervisor" date="THE BRIDGE" index={1}>
                            <p className="mb-4">
                                Enter <strong className="text-white">Justin-Caine Cavanas</strong>. 
                                XR & AI Lead at PLAYAR, building immersive experiences for Apple, Dior, and Samsung.
                            </p>
                            <p>
                                He wasn't just Robbe's thesis mentor—he was the bridge between academic theory and real-world magic.
                                But it wasn't being used to its full potential.
                            </p>
                        </TimelineNode>

                        <TimelineNode title="The Realization" date="THE SPARK" index={2}>
                            <p className="mb-4">
                                Most graduate projects end on a shelf. But they couldn't unsee the data.
                                <br/>
                                <span className="text-white">Millions of creators burning out. Billions of viewers feeling invisible.</span>
                            </p>
                            <p>
                                Streamyst was born not from a desire to build a company, 
                                but from a refusal to accept a broken system.
                            </p>
                        </TimelineNode>
                    </div>
                </div>
            </section>

            {/* --- ACT III: THE VISION --- */}
            <section className="relative z-10 py-32 overflow-hidden">
                {/* Background wash */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-gradient-to-b from-transparent via-violet-900/10 to-transparent pointer-events-none blur-3xl" />

                <div className="container mx-auto px-6 relative">
                    <div className="text-center max-w-3xl mx-auto mb-24">
                        <h2 className="font-display font-bold text-5xl md:text-7xl mb-6">Not A Gadget. <br/>An <span className="text-cyan-400">OS for Emotion.</span></h2>
                        <p className="text-xl text-gray-400">We're building the emotional infrastructure for the creator economy.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "For Streamers", desc: "Superhuman Perception. Feel 10,000 viewers the way you feel 10 friends.", icon: <Zap className="w-8 h-8 text-yellow-400"/>, color: "border-yellow-500/30" },
                            { title: "For Audiences", desc: "Meaningful Impact. Your energy becomes visible. You aren't just watching; you're influencing.", icon: <Users className="w-8 h-8 text-cyan-400"/>, color: "border-cyan-500/30" },
                            { title: "For Everyone", desc: "Connection That Scales. Ambient emotional intelligence as standard as a microphone.", icon: <Globe className="w-8 h-8 text-violet-400"/>, color: "border-violet-500/30" }
                        ].map((card, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className={`bg-white/5 backdrop-blur-md border ${card.color} p-8 rounded-3xl hover:bg-white/10 transition-colors group`}
                            >
                                <div className="mb-6 p-4 bg-black/20 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                                    {card.icon}
                                </div>
                                <h3 className="font-bold text-2xl mb-4 font-display">{card.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {card.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-32 text-center">
                        <div className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4">The Mission</div>
                        <h3 className="font-display font-bold text-3xl md:text-5xl max-w-4xl mx-auto leading-tight">
                            "By 2030, emotional intelligence will be as standard in streaming as HD video."
                        </h3>
                    </div>
                </div>
            </section>

            {/* --- ACT IV: THE HUMANS --- */}
            <section className="relative z-10 py-32 px-6">
                <div className="container mx-auto max-w-6xl">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        whileInView={{ opacity: 1 }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-display font-bold text-4xl md:text-6xl mb-6">The Humans Behind The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Hologram.</span></h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Building the bridge between digital and physical reality.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start justify-center">
                        <FounderCard 
                            img={FOUNDER_1_IMG} 
                            name="Robbe De Block" 
                            role="Co-Founder & CEO" 
                            quote="Technology is only useful when it disappears, leaving only the human connection behind."
                            delay={0}
                        />

                        <FounderCard 
                            img={FOUNDER_2_IMG} 
                            name="Justin-Caine Cavanas" 
                            role="Co-Founder & CTO" 
                            quote="We don't build tools. We build instruments for human connection."
                            delay={0.2}
                        />
                    </div>
                </div>
            </section>

            {/* --- ACT V: THE INVITATION --- */}
            <section className="relative z-10 min-h-screen flex items-center justify-center py-32 px-6 overflow-hidden bg-[#030205]">
                
                {/* Refined Background */}
                <div className="absolute inset-0 pointer-events-none">
                     <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-violet-900/10 to-transparent" />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-cyan-900/5 blur-[120px] rounded-full mix-blend-screen" />
                </div>

                <div className="container mx-auto relative z-10">
                    <div className="text-center max-w-4xl mx-auto mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="font-display font-bold text-5xl md:text-8xl mb-8 tracking-tighter leading-none">
                                The Future Is <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 animate-pulse-slow">Being Built.</span>
                            </h2>
                            <p className="text-xl md:text-2xl text-gray-400 font-light mb-8 max-w-2xl mx-auto">
                                Streaming is broken. We're fixing it with humanity. <br/>
                                Choose your path.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-24">
                        <PortalPath title="Creators" desc="Join the waitlist for superhuman connection." cta="Join Waitlist" color="violet" delay={0} />
                        <PortalPath title="Audiences" desc="Help us shape the future of interaction." cta="Join Discord" color="cyan" delay={0.1} />
                        <PortalPath title="Builders" desc="Engineers, designers, believers." cta="View Careers" color="pink" delay={0.2} />
                    </div>

                    <div className="text-center">
                         <button 
                            onClick={onBack} 
                            className="group relative inline-flex items-center justify-center px-12 py-5 bg-white text-black rounded-full overflow-hidden font-bold text-lg tracking-widest uppercase hover:scale-105 transition-transform duration-300"
                        >
                            <span className="relative z-10 flex items-center gap-3 group-hover:gap-5 transition-all duration-300">
                                Return to Home <ArrowRight className="w-5 h-5" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-violet-300 to-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
};

const QuoteBlock = ({ children }: { children?: React.ReactNode }) => (
    <div className="relative pl-6 italic text-gray-300 font-light text-lg">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-violet-500 rounded-full" />
        {children}
    </div>
);

const PortalPath = ({ title, desc, cta, color, delay }: { title: string, desc: string, cta: string, color: string, delay: number }) => {
    
    const colorClasses = {
        violet: { border: 'group-hover:border-violet-500/50', bg: 'bg-violet-500', text: 'group-hover:text-violet-400' },
        cyan: { border: 'group-hover:border-cyan-500/50', bg: 'bg-cyan-500', text: 'group-hover:text-cyan-400' },
        pink: { border: 'group-hover:border-pink-500/50', bg: 'bg-pink-500', text: 'group-hover:text-pink-400' }
    }[color as 'violet' | 'cyan' | 'pink'];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className={`group relative p-8 h-[360px] flex flex-col justify-between bg-[#0A0A0B] border border-white/10 rounded-3xl hover:bg-[#0F0F12] transition-all duration-500 ${colorClasses.border}`}
        >
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
                 <div className={`absolute -top-1/2 -right-1/2 w-full h-full ${colorClasses.bg} opacity-0 group-hover:opacity-10 blur-[80px] transition-opacity duration-700`} />
             </div>

             <div>
                 <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-1 ${colorClasses.bg} rounded-full`} />
                    <ArrowRight className={`w-6 h-6 text-gray-600 -rotate-45 group-hover:rotate-0 group-hover:text-white transition-all duration-500`} />
                 </div>
                 <h3 className="font-display font-bold text-3xl text-white mb-4 group-hover:translate-x-1 transition-transform duration-300">{title}</h3>
                 <p className="text-gray-400 font-light leading-relaxed">{desc}</p>
             </div>

             <div className="pt-8 border-t border-white/5">
                 <span className={`text-xs font-mono uppercase tracking-widest text-gray-500 ${colorClasses.text} transition-colors duration-300`}>{cta}</span>
             </div>
        </motion.div>
    );
};

export default AboutPage;
