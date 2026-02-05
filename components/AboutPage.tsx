import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Linkedin, ChevronDown, Mail } from 'lucide-react';
import { getAssetUrl } from '../utils/supabaseClient';

// --- BRAND SVG COMPONENTS ---

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

// --- ASSETS & CONSTANTS ---

const FOUNDER_1_IMG = getAssetUrl("robbe.webp"); // Robbe
const FOUNDER_2_IMG = getAssetUrl("HF_Justin 313.webp"); // Justin

// --- DOM SUB-COMPONENTS ---

const SocialLink = ({ icon, href, label }: { icon: React.ReactNode, href: string, label: string }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label={label}
        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-violet-500/50 transition-all duration-300"
    >
        {icon}
    </a>
);

// --- ACT II: TIMELINE COMPONENT ---

const TimelineNode = ({ title, date, children, index }: { title: string, date: string, children?: React.ReactNode, index: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 85%", "center center"]
    });
    
    // Content entry animation linked to scroll
    const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const x = useTransform(scrollYProgress, [0, 1], [-30, 0]);

    // Line fill animation - fills as you scroll through the section
    const { scrollYProgress: lineProgress } = useScroll({
        target: ref,
        offset: ["start center", "end center"]
    });
    const lineScale = useTransform(lineProgress, [0, 1], [0, 1]);

    return (
        <div ref={ref} className="relative pl-12 md:pl-24 py-10 group">
            {/* Base Line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />
            
            {/* Active Scroll Line */}
            <motion.div 
                style={{ scaleY: lineScale }}
                className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500 to-indigo-500 origin-top"
            />

            {/* The Node Dot */}
            <motion.div 
                style={{ opacity, scale: opacity }}
                className="absolute left-[-8px] top-12 w-4 h-4 rounded-full bg-[#030205] border border-white/30 group-hover:border-violet-400 group-hover:scale-125 transition-all duration-300 shadow-[0_0_0_4px_#030205] z-10"
            >
                <div className="absolute inset-0 bg-violet-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
            </motion.div>

            <motion.div style={{ opacity, x }}>
                <div className="mb-2 flex items-center gap-4">
                    <span className="font-mono text-xs text-violet-500 bg-violet-950/30 px-2 py-1 rounded border border-violet-900/50">{date}</span>
                </div>
                <h3 className="text-3xl font-display font-bold text-white mb-4">{title}</h3>
                <div className="text-gray-400 text-lg leading-relaxed max-w-xl">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

// --- ACT IV: FOUNDER CARD ---

interface FounderSocials {
    linkedin?: string;
    email?: string;
    twitch?: string;
}

const FounderCard = ({ img, name, role, quote, socials, delay }: { img: string, name: string, role: string, quote: string, socials: FounderSocials, delay: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    });
    
    // Parallax: Image moves from -15% to 15% relative to scroll
    const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

    return (
        <motion.div 
            ref={cardRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay }}
            className="relative group w-full"
        >
            <div className="relative rounded-3xl overflow-hidden bg-[#0A0A0B] border border-white/10 shadow-2xl">
                {/* Image Container with Overflow Hidden */}
                <div className="relative h-[380px] overflow-hidden">
                    <motion.div 
                        style={{ y }} 
                        className="absolute inset-0 h-[130%] -top-[15%] w-full"
                    >
                        <img 
                            src={img} 
                            alt={name} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 object-top"
                        />
                    </motion.div>

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent opacity-80" />
                    
                    {/* Scanlines Effect */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                </div>

                {/* Content */}
                <div className="relative p-8 -mt-24 z-10">
                    <div className="inline-block px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 backdrop-blur-md mb-4">
                        <span className="text-[10px] font-mono font-bold text-violet-400 uppercase tracking-widest">{role}</span>
                    </div>
                    
                    <h3 className="font-display font-bold text-3xl text-white mb-4">{name}</h3>
                    
                    <div className="mb-6 pl-4 border-l-2 border-violet-500/50">
                        <p className="text-gray-400 italic font-light leading-relaxed">
                            "{quote}"
                        </p>
                    </div>

                    <div className="flex gap-4">
                        {socials.linkedin && <SocialLink icon={<Linkedin size={18} />} href={socials.linkedin} label="LinkedIn" />}
                        {socials.email && <SocialLink icon={<Mail size={18} />} href={`mailto:${socials.email}`} label="Email" />}
                        {socials.twitch && <SocialLink icon={<TwitchLogo size={18} />} href={socials.twitch} label="Twitch" />}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- MAIN PAGE COMPONENT ---

interface AboutPageProps {
    onBack: () => void;
    onNavigate?: (view: any, id?: string) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack, onNavigate }) => {
    const { scrollYProgress } = useScroll();
    
    return (
        <div className="relative bg-[#030205] text-white min-h-screen overflow-x-hidden selection:bg-orange-500/30">
            
            {/* --- GLOBAL BACKGROUND --- */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-[#030205]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B] via-[#05040a] to-[#000000] opacity-80" />
            </div>

            {/* --- ACT I: THE PARADOX --- */}
            <section className="relative z-10 min-h-[100vh] flex flex-col items-center justify-center px-6 pt-32 pb-20">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ duration: 2 }}
                        className="mb-12"
                    >
                        <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-none tracking-tighter mb-8">
                            We believe in a <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-white">Simple Truth.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
                            Technology should bring us <span className="text-violet-400 font-medium glow-text">closer</span>, 
                            not pull us <span className="text-orange-400 font-medium glow-text">apart</span>.
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
                        
                        <div className="relative w-full max-w-4xl mx-auto md:h-[400px] flex items-center justify-center group">
                             <div className="absolute inset-0 bg-violet-500/10 blur-[100px] rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
                             <img 
                                src={getAssetUrl("Founders Pic Transparent.webp")}
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
            <section className="relative z-10 py-24 md:py-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        whileInView={{ opacity: 1 }}
                        className="mb-16 pl-12 md:pl-24"
                    >
                        <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">It Started With A <span className="text-violet-400">Question.</span></h2>
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
                                XR & AI Lead at PLAYAR, 6+ years experience building immersive experiences for leading brands.
                            </p>
                            <p>
                                He wasn't just Robbe's thesis mentor, he was the bridge between academic theory and real-world magic.
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

            {/* --- Vision Section --- */}
            <section className="relative z-10 py-24 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-gradient-to-b from-transparent via-violet-900/10 to-transparent pointer-events-none blur-3xl" />

                <div className="container mx-auto px-6 relative">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="font-display font-bold text-5xl md:text-6xl mb-6">Not A Gadget. <br/>An <span className="text-violet-400">OS for Emotion.</span></h2>
                        <p className="text-xl text-gray-400">We're building the emotional infrastructure for the creator economy.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "For Streamers", desc: "Superhuman Perception. Interact with 10,000 viewers the way you talk to 10 friends.", icon: <div className="text-yellow-400"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>, color: "border-yellow-500/30" },
                            { title: "For Audiences", desc: "Meaningful Impact. Your energy becomes visible. You aren't just watching; you're influencing.", icon: <div className="text-orange-400"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>, color: "border-orange-500/30" },
                            { title: "For Everyone", desc: "Connection That Scales. Ambient emotional intelligence as standard as a microphone.", icon: <div className="text-violet-400"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div>, color: "border-violet-500/30" }
                        ].map((card, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className={`bg-white/5 backdrop-blur-md border ${card.color} p-8 rounded-3xl`}
                            >
                                <div className="mb-6 p-4 bg-black/20 rounded-2xl w-fit">
                                    {card.icon}
                                </div>
                                <h3 className="font-bold text-2xl mb-4 font-display">{card.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {card.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- ACT IV: THE HUMANS --- */}
            <section className="relative z-10 py-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        whileInView={{ opacity: 1 }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-display font-bold text-4xl md:text-6xl mb-6">The Humans Behind The <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">Hologram.</span></h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Building the bridge between digital and physical reality.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start justify-center mb-24">
                        <FounderCard 
                            img={FOUNDER_1_IMG} 
                            name="Robbe De Block" 
                            role="Co-Founder & CEO" 
                            quote="Interaction has to be felt and cherished, we are driven to always make it meaningful"
                            socials={{
                                linkedin: "https://www.linkedin.com/in/robbe-de-block-a9b148296/",
                                email: "robbe.deblock@streamyst.com",
                                twitch: "https://www.twitch.tv/mistvein_live"
                            }}
                            delay={0}
                        />

                        <FounderCard 
                            img={FOUNDER_2_IMG} 
                            name="Justin-Caine Cavanas" 
                            role="Co-Founder & CTO" 
                            quote="As our world becomes more digital, it must also become more profoundly human."
                            socials={{
                                linkedin: "https://www.linkedin.com/in/justin-caine-cavanas",
                                email: "justin.cavanas@streamyst.com"
                            }}
                            delay={0.2}
                        />
                    </div>

                    {/* Partnership Mention */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto pt-16 border-t border-white/5 text-center"
                    >
                        <h3 className="text-xs font-mono text-gray-500 uppercase tracking-[0.4em] mb-8">Strategic Ecosystem Partner</h3>
                        <a 
                            href="https://www.playar.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group relative inline-flex items-center justify-center p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl transition-all duration-500 hover:border-violet-500/50 overflow-hidden cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 flex flex-col items-center">
                                <span className="text-3xl md:text-4xl font-display font-bold text-white tracking-tighter mb-2">PLAYAR</span>
                                <p className="text-gray-400 text-sm md:text-base font-light italic">
                                    Our official XR & Immersive Technology Partner.
                                </p>
                            </div>
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* --- ACT V: THE INVITATION --- */}
            <section className="relative z-10 min-h-screen flex items-center justify-center py-24 px-6 overflow-hidden bg-[#030205]">
                <div className="absolute inset-0 pointer-events-none">
                     <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-violet-900/10 to-transparent" />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-violet-900/5 blur-[120px] rounded-full mix-blend-screen" />
                </div>

                <div className="container mx-auto relative z-10">
                    <div className="text-center max-w-4xl mx-auto mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="font-display font-bold text-5xl md:text-7xl mb-8 tracking-tighter leading-none">
                                The Future Is <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-purple-600 animate-pulse-slow">Being Built.</span>
                            </h2>
                            <p className="text-xl md:text-2xl text-gray-400 font-light mb-8 max-w-2xl mx-auto">
                                Streaming is meant to be more meaningful. We're on a mission to fix this with human connection. <br/>
                                Choose your path.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-24">
                        <PortalPath 
                            title="Creators" 
                            desc="Join the priority list for superhuman connection." 
                            cta="Join Early Access" 
                            color="violet" 
                            delay={0} 
                            image={getAssetUrl("mascot3.webp")}
                            onClick={() => onNavigate?.('home', 'waitlist')}
                        />
                        <PortalPath 
                            title="Audiences" 
                            desc="Help us shape the future of interaction." 
                            cta="Join Discord" 
                            ctaIcon={<DiscordLogo size={14} />}
                            color="orange" 
                            delay={0.1} 
                            image={getAssetUrl("mascot2.webp")}
                            href="https://discord.gg/ty8mJHNS"
                        />
                        <PortalPath 
                            title="Builders" 
                            desc="Engineers, designers, believers." 
                            cta="View Careers" 
                            color="pink" 
                            delay={0.2} 
                            image={getAssetUrl("mascot1.webp")}
                            href="mailto:justin.cavanas@streamyst.com"
                        />
                    </div>

                    <div className="text-center">
                         <button 
                            onClick={onBack} 
                            className="group relative inline-flex items-center justify-center px-12 py-5 bg-white text-black rounded-full overflow-hidden font-bold text-lg tracking-widest uppercase hover:scale-105 transition-transform duration-300"
                        >
                            <span className="relative z-10 flex items-center gap-3 group-hover:gap-5 transition-all duration-300">
                                Return to Home <ArrowRight className="w-5 h-5" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-300 via-indigo-300 to-violet-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
};

const PortalPath = ({ title, desc, cta, ctaIcon, color, delay, image, onClick, href }: { title: string, desc: string, cta: string, ctaIcon?: React.ReactNode, color: string, delay: number, image: string, onClick?: () => void, href?: string }) => {
    
    const colorClasses = {
        violet: { border: 'border-violet-500/30', bg: 'bg-violet-500', text: 'text-violet-400' },
        orange: { border: 'border-orange-500/30', bg: 'bg-orange-500', text: 'text-orange-400' },
        pink: { border: 'border-pink-500/30', bg: 'bg-pink-500', text: 'text-pink-400' }
    }[color as 'violet' | 'orange' | 'pink'];

    const Component = href ? motion.a : (onClick ? motion.button : motion.div);
    const props = href ? { href, target: "_blank", rel: "noopener noreferrer" } : { onClick };

    return (
        // @ts-ignore
        <Component 
            {...props}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className={`group relative h-[380px] w-full text-left block cursor-pointer transition-transform duration-300 hover:-translate-y-2`}
        >
             <div className="absolute inset-0 rounded-3xl bg-[#0A0A0B] border border-white/10 overflow-hidden group-hover:border-white/20 transition-colors z-0">
                 <div className={`absolute -top-1/2 -right-1/2 w-full h-full ${colorClasses.bg} opacity-0 blur-[80px] group-hover:opacity-20 transition-opacity duration-700`} />
             </div>

             <div className="absolute bottom-[-24px] right-[-24px] w-56 h-56 z-20 pointer-events-none">
                 <img 
                    src={image} 
                    alt={title}
                    className="w-full h-full object-contain object-bottom-right opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out translate-y-4 translate-x-4"
                 />
             </div>

             <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                 <div>
                     <div className="flex justify-between items-start mb-6">
                        <div className={`w-12 h-1 ${colorClasses.bg} rounded-full`} />
                        <ArrowRight className={`w-6 h-6 text-gray-600 group-hover:text-white transition-colors`} />
                     </div>
                     <h3 className="font-display font-bold text-3xl text-white mb-4">{title}</h3>
                     <p className="text-gray-400 font-light leading-relaxed max-w-[85%]">{desc}</p>
                 </div>

                 <div className="pt-8 border-t border-white/5">
                     <span className={`text-xs font-mono uppercase tracking-widest text-gray-500 ${colorClasses.text} transition-colors duration-300 group-hover:text-white flex items-center gap-2`}>
                        {ctaIcon}
                        {cta}
                     </span>
                 </div>
             </div>
        </Component>
    );
};

export default AboutPage;