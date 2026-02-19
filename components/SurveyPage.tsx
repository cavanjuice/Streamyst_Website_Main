
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Check, X, ArrowLeft, ArrowRight, Send, 
    MonitorPlay, Eye, Users, Clock, MessageSquare, 
    Activity, DollarSign, Lightbulb, Wifi, Shield, 
    Cpu, Zap, AlertCircle, PlayCircle,
    Ghost, Crown, Heart, Briefcase, Globe, 
    MousePointer2, Square, CheckSquare
} from 'lucide-react';
import { saveSurveyResponse, getAssetUrl, trackEvent, setGAUserProperty } from '../utils/supabaseClient';

const MASCOT_1 = getAssetUrl("mascot1.webp");
const MASCOT_2 = getAssetUrl("mascot2.webp");
const MASCOT_3 = getAssetUrl("mascot3.webp");

type UserType = 'streamer' | 'viewer' | 'other' | null;

interface SurveyData {
    userType: UserType;
    streamFreq: string;
    viewerCount: string;
    hoursWatched: number;
    interactionStyle: string;
    email: string;
    problemRank: string[];
    painIntensity: number;
    attemptedSolutions: string[];
    solutionPreference: string;
    desiredFeatures: string[];
    purchaseIntent: string;
    priceCheap: number;
    priceExpensive: number;
    priceTooExpensive: number;
    priceTooCheap: number;
    pricingModel: string;
    platform: string;
    content: string;
    discovery: string;
    otherRoles: string[];
    otherContexts: string[];
    platformFamiliarity: number;
    initialInterest: string[];
    missingInLivestream: string;
    streamystFit: string;
    problemToSolve: string;
    valueDrivers: string;
    concerns: string[];
    pricingExpectation: string;
    interestLevel: number;
    collaborationInterest: string[];
    anythingElse: string;
    frictionPoints: string[];
}

const STREAMER_PROBLEM_OPTIONS = [
    { id: 'engagement', label: 'Audience engagement / connection', icon: <Users size={18} /> },
    { id: 'interaction_limits', label: 'Limited interaction possibilities', icon: <MousePointer2 size={18} /> },
    { id: 'monetization', label: 'Monetization / income', icon: <DollarSign size={18} /> },
    { id: 'creativity', label: 'Content ideas / creativity', icon: <Lightbulb size={18} /> },
    { id: 'tech_quality', label: 'Technical quality', icon: <Wifi size={18} /> },
    { id: 'growth', label: 'Growing viewer count', icon: <Activity size={18} /> },
    { id: 'moderation', label: 'Chat moderation / toxicity', icon: <Shield size={18} /> },
    { id: 'burnout', label: 'Burnout / mental health', icon: <AlertCircle size={18} /> },
    { id: 'discovery', label: 'Discoverability', icon: <Eye size={18} /> },
    { id: 'setup', label: 'Equipment costs', icon: <Cpu size={18} /> },
    { id: 'consistency', label: 'Consistency / scheduling', icon: <Clock size={18} /> },
];

const VIEWER_PROBLEM_OPTIONS = [
    { id: 'ignored', label: 'Feeling ignored / invisible', icon: <Ghost size={18} /> },
    { id: 'interaction_limits', label: 'Limited interaction possibilities', icon: <MousePointer2 size={18} /> },
    { id: 'ads', label: 'Too many ads / interruptions', icon: <X size={18} /> },
    { id: 'toxic', label: 'Toxic chat / community', icon: <Shield size={18} /> },
    { id: 'impact', label: 'My interactions feel meaningless', icon: <Activity size={18} /> },
    { id: 'discovery', label: 'Hard to find good streams', icon: <Eye size={18} /> },
    { id: 'cost', label: 'Supporting is too expensive', icon: <DollarSign size={18} /> },
    { id: 'connection', label: 'Hard to make friends', icon: <Users size={18} /> },
    { id: 'quality', label: 'Bad audio/video quality', icon: <Wifi size={18} /> },
];

const OTHER_ROLES = [
    "Brand representative", "Creator", "Designer", "Developer", 
    "Agency", "Platform partner", "Researcher", "Investor"
];

const OTHER_CONTEXTS = [
    "Brand activations / marketing", "Content creation", 
    "Product or experience design", "Community building", 
    "Technology / platform development", "Research or innovation", 
    "Investment or business development"
];

const OTHER_INTERESTS = [
    "Interactive digital overlays", "Audience sentiment & emotional feedback",
    "Physical device reacting to livestreams", "Stronger audience–creator connection",
    "XR / mixed digital-physical experiences", "New monetization or engagement models"
];

const OTHER_CONCERNS = [
    "Cost", "Hardware requirements", "Integration complexity", 
    "Scalability", "Audience adoption", "Creative limitations", 
    "Data/privacy concerns", "Unclear ROI"
];

const OTHER_PRICING = [
    "One-time purchase", "Subscription", "Per-campaign or per-event", 
    "Licensing / enterprise pricing", "Revenue share", "Not sure yet"
];

const OTHER_COLLAB = [
    "I’d like updates/newsletter", "I’m interested in early access or beta testing",
    "I’m open to partnerships or collaborations", "I’d like to talk to the team",
    "Just exploring for now"
];

const STREAMER_FRICTION_OPTIONS = [
    "Monthly cost",
    "Upfront hardware cost",
    "Asking my community for money",
    "Setup complexity",
    "Brand ads on my stream",
    "Nothing would stop me"
];

const VIEWER_FRICTION_OPTIONS = [
    "Cost",
    "I don’t want more monetization in chat",
    "I don’t feel involved enough",
    "I prefer passive viewing",
    "I already support enough"
];

const STREAMER_PRICING_MODELS = [
    {
        id: 'free_start',
        title: 'Free-to-Start',
        desc: 'I want to try Streamyst for free and unlock more as my channel grows.',
        features: ['Free core features', 'Paid visual upgrades']
    },
    {
        id: 'brand_supported',
        title: 'Brand Supported',
        desc: 'Free usage for me and audience, supported by watermarked brand ads.',
        features: ['Free interactive experience', 'Branded overlay presets']
    },
    {
        id: 'creator_sub',
        title: 'Creator Subscription',
        desc: 'Full access to all digital overlays and customization, no hardware required.',
        features: ['Customizable overlays', '€14,99 / month']
    },
    {
        id: 'community_growth',
        title: 'Community-Supported',
        desc: 'My community helps unlock Streamyst features together through goals.',
        features: ['Free base experience', 'Monthly goal upgrades']
    },
    {
        id: 'hardware_first',
        title: 'Hardware-First',
        desc: 'I want to feel the digital experience myself for better immersion.',
        features: ['€150 device', '€9,99 / month service']
    },
    {
        id: 'affiliate_hardware',
        title: 'Affiliate Program',
        desc: 'Earn hardware through engagement rather than paying upfront.',
        features: ['Reach interaction goals', 'Discounted device']
    },
    {
        id: 'all_in',
        title: 'All-In Creator',
        desc: 'Own Streamyst outright with no monthly fees.',
        features: ['€349 one-time', 'Lifetime support']
    }
];

const VIEWER_PRICING_MODELS = [
    {
        id: 'community_goal',
        title: 'Community Goals',
        desc: 'Contributing small amounts together to unlock features.',
        features: ['Micro-contributions', 'Collective achievement']
    },
    {
        id: 'interaction_boosts',
        title: 'Interaction Boosts',
        desc: 'Pay occasionally to trigger special effects.',
        features: ['One-time boosts', 'Visual responses']
    },
    {
        id: 'monthly_supporter',
        title: 'Monthly Supporter',
        desc: 'Support service as part of monthly sub.',
        features: ['€3–€5 / month', 'Exclusive interactions']
    },
    {
        id: 'hardware_unlock',
        title: 'Hardware Campaign',
        desc: 'Help save up to unlock the device for a streamer.',
        features: ['Donations', 'Community milestones']
    },
    {
        id: 'no_pay',
        title: 'No Payment',
        desc: 'I prefer watching without spending money.',
        features: []
    }
];

interface CardProps {
    selected: boolean;
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ 
    selected, 
    onClick, 
    children, 
    className = "" 
}) => (
    <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`
            cursor-pointer relative p-3 md:p-6 rounded-xl md:rounded-2xl border transition-all duration-300 overflow-hidden group
            ${selected 
                ? 'bg-violet-900/20 border-violet-500 shadow-[0_0_30px_rgba(139,92,246,0.3)]' 
                : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'}
            ${className}
        `}
    >
        {selected && (
            <motion.div 
                layoutId="selectionGlow"
                className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />
        )}
        <div className="relative z-10 w-full">
            {children}
        </div>
        <div className={`absolute top-2 right-2 md:top-4 md:right-4 w-4 h-4 md:w-6 md:h-6 rounded-full border flex items-center justify-center transition-colors ${selected ? 'bg-violet-500 border-violet-500' : 'border-white/20'}`}>
            {selected && <Check size={12} className="text-white md:hidden" />}
            {selected && <Check size={14} className="text-white hidden md:block" />}
        </div>
    </motion.div>
);

const Mascot = ({ src, className, delay = 0.5 }: { src: string, className: string, delay?: number }) => (
    <motion.img 
        src={src}
        initial={{ opacity: 0, y: 30, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ delay, duration: 0.6, ease: "backOut" }}
        className={`absolute pointer-events-none z-0 hidden lg:block ${className}`}
    />
);

const SurveyPage: React.FC<{ onExit: () => void; initialEmail?: string }> = ({ onExit, initialEmail }) => {
    const [step, setStep] = useState(0);
    const [data, setData] = useState<Partial<SurveyData>>({
        email: initialEmail || '',
        problemRank: [],
        attemptedSolutions: [],
        desiredFeatures: [],
        painIntensity: 5,
        priceCheap: 5,
        priceExpensive: 15,
        priceTooExpensive: 30,
        priceTooCheap: 2,
        otherRoles: [],
        otherContexts: [],
        platformFamiliarity: 5,
        initialInterest: [],
        concerns: [],
        collaborationInterest: [],
        interestLevel: 5,
        frictionPoints: [],
    });
    const [showExitModal, setShowExitModal] = useState(false);
    const [hasSeenExitModal, setHasSeenExitModal] = useState(false);
    const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);

    useEffect(() => {
        trackEvent('survey_view');
    }, []);

    useEffect(() => {
        if (step > 0) {
            trackEvent('survey_step_view', { step, totalSteps: totalSteps, userType: data.userType });
        }
    }, [step]);

    const isViewer = data.userType === 'viewer';
    const isOther = data.userType === 'other';
    const totalSteps = isOther ? 17 : 15; 
    const progress = Math.min(100, (step / totalSteps) * 100);

    const submitData = async () => {
        const { error } = await saveSurveyResponse(data);
        if (error) console.error("Error saving survey:", error);
    };

    const nextStep = () => {
        if (!isOther) {
            if (step === 3 && data.problemRank?.length !== 3) return; 
            if (step === 7 && (data.desiredFeatures?.length || 0) !== 2) return; 
        }

        if (step === totalSteps - 2) {
            if (!hasAgreedToTerms) return; 
            submitData();
        }

        setStep(prev => prev + 1);
        window.scrollTo(0, 0);
    };

    const prevStep = () => {
        setStep(prev => Math.max(0, prev - 1));
        window.scrollTo(0, 0);
    }

    const updateData = (key: keyof SurveyData, value: any) => {
        setData(prev => ({ ...prev, [key]: value }));
        if (key === 'userType' && value) {
            setGAUserProperty({ user_role: value });
        }
    };

    const toggleArrayItem = (key: 'attemptedSolutions' | 'desiredFeatures' | 'otherRoles' | 'otherContexts' | 'initialInterest' | 'concerns' | 'collaborationInterest' | 'frictionPoints', value: string) => {
        const current = data[key] || [];
        if (current.includes(value)) {
            updateData(key, current.filter(i => i !== value));
        } else {
            if (key === 'desiredFeatures' && current.length >= 2) return;
            updateData(key, [...current, value]);
        }
    };

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (step > 1 && step < (totalSteps - 1)) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [step, totalSteps]);

    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && step > 0 && step < (totalSteps - 1) && !hasSeenExitModal) {
                setShowExitModal(true);
                setHasSeenExitModal(true);
                trackEvent('survey_exit_intent');
            }
        };
        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [step, hasSeenExitModal, totalSteps]);

    const handleSurveyAbandon = () => {
        trackEvent('survey_abandon', { step });
        onExit();
    };

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "circOut" as const } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: "circIn" as const } }
    };

    const renderScale = (val: number, setVal: (n: number) => void, minLabel = "Low", maxLabel = "High") => (
        <div className="relative mb-4 md:mb-8 px-2 md:px-4">
            <div className="flex justify-between text-lg md:text-2xl mb-4 md:mb-8">
                <span className={`transition-opacity ${val < 4 ? 'opacity-100' : 'opacity-30'}`}>😐</span>
                <span className={`transition-opacity ${val > 7 ? 'opacity-100' : 'opacity-30'}`}>🤩</span>
            </div>
            <input 
                type="range" 
                min="0" max="10" 
                value={val}
                onChange={(e) => setVal(parseInt(e.target.value))}
                className="w-full h-3 md:h-4 bg-white/10 rounded-full appearance-none cursor-pointer accent-violet-500 touch-none"
            />
            <div className="flex justify-between text-[10px] md:text-xs text-gray-500 mt-3 md:mt-4 font-mono uppercase tracking-widest">
                <span>{minLabel}</span>
                <span>{maxLabel}</span>
            </div>
            <div className="mt-3 md:mt-4 text-2xl md:text-4xl font-bold text-violet-400 text-center">{val} / 10</div>
        </div>
    );

    const renderMultiSelect = (options: string[], selected: string[], field: any) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
            {options.map((opt) => (
                <div 
                    key={opt}
                    onClick={() => toggleArrayItem(field, opt)}
                    className={`p-3 md:p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${selected?.includes(opt) ? 'bg-violet-900/20 border-violet-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                >
                    <div className={`mt-0.5 w-4 h-4 md:w-5 md:h-5 rounded border flex items-center justify-center shrink-0 ${selected?.includes(opt) ? 'border-violet-500 bg-violet-500' : 'border-gray-500'}`}>
                        {selected?.includes(opt) && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-xs md:text-sm">{opt}</span>
                </div>
            ))}
        </div>
    );

    const renderTextArea = (value: string | undefined, field: keyof SurveyData, placeholder: string) => (
        <textarea
            value={value || ''}
            onChange={(e) => updateData(field, e.target.value)}
            placeholder={placeholder}
            className="w-full h-24 md:h-40 bg-[#1A1830] border border-white/10 rounded-xl p-3 md:p-5 text-sm md:text-base text-white placeholder-gray-500 focus:border-violet-500 outline-none resize-none"
        />
    );

    const renderContinue = (disabled = false) => (
        <div className="mt-4 md:mt-12 flex justify-end">
            <button 
                onClick={nextStep}
                disabled={disabled}
                className="px-6 py-2.5 md:px-8 md:py-3 bg-white text-black text-sm md:text-base font-bold rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Continue →
            </button>
        </div>
    );

    const renderConsent = () => (
        <div className="mt-4 md:mt-8 p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl">
            <div 
                className="flex items-start gap-3 cursor-pointer"
                onClick={() => setHasAgreedToTerms(!hasAgreedToTerms)}
            >
                <div className={`mt-0.5 w-4 h-4 md:w-5 md:h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${hasAgreedToTerms ? 'bg-violet-500 border-violet-500' : 'border-gray-500 hover:border-white'}`}>
                    {hasAgreedToTerms && <Check size={12} className="text-white" />}
                </div>
                <p className="text-[10px] md:text-xs text-gray-400 leading-relaxed select-none">
                    I agree to the Terms of Service regarding Feedback and Privacy. I understand my feedback is provided voluntarily to help build Streamyst.
                </p>
            </div>
        </div>
    );

    const renderEmailStep = () => (
        <div className="max-w-xl mx-auto text-center relative">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 md:mb-6">
                {initialEmail ? "Just to confirm—is this email correct?" : "We would love to keep you in the loop"}
            </h2>
            <p className="text-sm md:text-base text-gray-400 mb-6 md:mb-8 leading-relaxed">
                 {initialEmail ? "We grabbed this from your waitlist entry. We want to make sure your invite lands safely." : "Sign up to be the first to get early access."}
            </p>
            
            <div className="relative group">
                <input 
                    type="email" 
                    placeholder="yourname@email.com"
                    value={data.email || ''}
                    onChange={(e) => updateData('email', e.target.value)}
                    className="w-full bg-[#1A1830] border border-white/20 rounded-xl p-4 md:p-5 text-lg md:text-xl text-center text-white focus:border-violet-500 outline-none mb-4 md:mb-6 placeholder-gray-600 font-mono transition-all group-hover:border-white/40"
                />
            </div>
            
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-400 mb-8 md:mb-10">
                <Check size={16} className="text-violet-500" />
                <span>We promise not to spam you. Ever.</span>
            </div>

            <button 
                onClick={nextStep}
                disabled={!data.email?.includes('@')}
                className="w-full py-3.5 md:py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl font-bold text-white shadow-lg hover:shadow-violet-500/20 transition-all disabled:opacity-50"
            >
                {initialEmail ? "Yes, that's me →" : "Lock In Access →"}
            </button>
        </div>
    );

    const renderExit = () => (
        <div className="max-w-2xl mx-auto text-center pt-8 md:pt-12 relative">
             <Mascot src={MASCOT_3} className="-right-20 top-0 w-32 opacity-50 md:hidden" delay={0} />
             <Mascot src={MASCOT_3} className="-right-32 bottom-20 w-56 opacity-80 hidden md:block" delay={0.6} />
             
             <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
             >
                 <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 mx-auto text-green-400 border border-green-500/20">
                    <Check className="w-8 h-8 md:w-10 md:h-10" />
                 </div>
                 
                 <h1 className="font-display font-bold text-3xl md:text-5xl mb-4 md:mb-6 leading-tight">
                    You're officially <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">on the list.</span>
                 </h1>
                 
                 <p className="text-sm md:text-xl text-gray-400 mb-8 md:mb-12 font-light leading-relaxed max-w-lg mx-auto">
                    Thank you for shaping the future of streaming with us. We'll be in touch soon.
                 </p>

                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                     <button
                        onClick={onExit}
                        className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform w-full sm:w-auto"
                     >
                        Back to Home
                     </button>
                     <a
                        href="https://discord.gg/ty8mJHNS"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 bg-[#5865F2] text-white font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2 w-full sm:w-auto justify-center"
                     >
                        Join Discord <ArrowRight size={16} />
                     </a>
                 </div>
             </motion.div>
        </div>
    );

    const renderStep = () => {
        if (step === 0) {
             return (
                <div className="text-center max-w-2xl mx-auto pt-4 md:pt-10 relative">
                    <Mascot src={MASCOT_3} className="-right-32 bottom-20 w-56 opacity-80" delay={0.6} />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10"
                    >
                        <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-7xl mb-4 md:mb-8 leading-tight">
                            Help Us Build The <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">Future of Streaming</span>
                        </h1>
                        <p className="text-sm md:text-xl text-gray-400 mb-8 md:mb-12 font-light leading-relaxed max-w-lg mx-auto">
                            We're creating something that could change how creators and audiences connect. 
                            <br/><br/>
                            This takes 3 minutes. Your answers could shape what we build.
                        </p>
                        <button
                            onClick={() => {
                                trackEvent('survey_start_click');
                                nextStep();
                            }}
                            className="group relative px-8 py-4 md:px-10 md:py-5 bg-white text-black font-bold text-base md:text-lg rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
                        >
                            <span className="relative z-10 flex items-center gap-2">I'm In <ArrowRight size={20} /></span>
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-300 via-indigo-300 to-violet-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                        <p className="mt-4 md:mt-6 text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-mono mb-8 md:mb-12">
                            + Early Access Perks Included
                        </p>

                        <button 
                            onClick={onExit}
                            className="text-gray-600 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 mx-auto"
                        >
                            <ArrowLeft size={16} /> Return to Site
                        </button>
                    </motion.div>
                </div>
            );
        }

        if (step === 1) {
             return (
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-6 md:mb-12">First things first—which best describes you?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
                        {[
                            { id: 'streamer', icon: <MonitorPlay size={24} />, title: "I Create Content", desc: "I stream/broadcast to an audience" },
                            { id: 'viewer', icon: <Eye size={24} />, title: "I Watch Content", desc: "I'm part of streaming communities" },
                            { id: 'other', icon: <Globe size={24} />, title: "Other", desc: "Brand, Developer, Agency, or Curious" }
                        ].map((opt) => (
                            <Card
                                key={opt.id}
                                selected={data.userType === opt.id}
                                onClick={() => {
                                    updateData('userType', opt.id as UserType);
                                    setTimeout(nextStep, 300);
                                }}
                                className="flex flex-col items-center text-center py-6 md:py-10"
                            >
                                <div className="mb-3 md:mb-6 p-3 md:p-4 bg-white/5 rounded-full text-violet-400">{opt.icon}</div>
                                <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">{opt.title}</h3>
                                <p className="text-xs md:text-sm text-gray-400">{opt.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            );
        }

        if (isOther) {
            switch(step) {
                case 2:
                    return (
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-xl md:text-3xl font-display font-bold text-center mb-6 md:mb-12">Please describe your role(s)</h2>
                            {renderMultiSelect(OTHER_ROLES, data.otherRoles || [], 'otherRoles')}
                            {renderContinue()}
                        </div>
                    );
                case 3:
                    return (
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-xl md:text-3xl font-display font-bold text-center mb-6 md:mb-12">In what context are you interested in livestreaming?</h2>
                            {renderMultiSelect(OTHER_CONTEXTS, data.otherContexts || [], 'otherContexts')}
                            {renderContinue()}
                        </div>
                    );
                case 4:
                    return (
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-xl md:text-3xl font-display font-bold text-center mb-6 md:mb-12">How familiar are you with livestreaming platforms?</h2>
                            {renderScale(data.platformFamiliarity || 5, (n) => updateData('platformFamiliarity', n), "Curious", "Expert")}
                            {renderContinue()}
                        </div>
                    );
                case 5:
                    return (
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-xl md:text-3xl font-display font-bold text-center mb-6 md:mb-12">What initially caught your interest about Streamyst?</h2>
                            {renderMultiSelect(OTHER_INTERESTS, data.initialInterest || [], 'initialInterest')}
                            {renderContinue()}
                        </div>
                    );
                case 6:
                    return (
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-xl md:text-3xl font-display font-bold text-center mb-4 md:mb-6">From your perspective, what is currently missing in livestream experiences?</h2>
                            {renderTextArea(data.missingInLivestream, 'missingInLivestream', "Share your thoughts...")}
                            {renderContinue()}
                        </div>
                    );
                case 7:
                     return (
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-xl md:text-3xl font-display font-bold text-center mb-2">How do you see Streamyst fitting into your world?</h2>
                            <p className="text-sm md:text-base text-gray-400 text-center mb-6 md:mb-8">What potential use cases do you imagine? (e.g. brand campaigns, events, installations, etc.)</p>
                            {renderTextArea(data.streamystFit, 'streamystFit', "Describe potential use cases...")}
                            {renderContinue()}
                        </div>
                    );
                case 8:
                    return (
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-xl md:text-3xl font-display font-bold text-center mb-6 md:mb-8">What problem would you most want Streamyst to help solve?</h2>
                            <input
                                type="text"
                                value={data.problemToSolve || ''}
                                onChange={(e) => updateData('problemToSolve', e.target.value)}
                                placeholder="Short description of the problem..."
                                className="w-full bg-[#1A1830] border border-white/10 rounded-xl p-4 md:p-5 text-white placeholder-gray-500 focus:border-violet-500 outline-none text-sm md:text-base"
                            />
                            {renderContinue()}
                        </div>
                    );
                case 9:
                     return (
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-xl md:text-3xl font-display font-bold text-center mb-2">What would make Streamyst truly valuable for you?</h2>
                            <p className="text-sm md:text-base text-gray-400 text-center mb-6 md:mb-8">(Features, integrations, scale, customization, data, etc.)</p>
                            {renderTextArea(data.valueDrivers, 'valueDrivers', "What features matter most?")}
                            {renderContinue()}
                        </div>
                    );
                case 10:
                    return (
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-xl md:text-3xl font-display font-bold text-center mb-6 md:mb-12">What concerns or frictions do you foresee?</h2>
                            {renderMultiSelect(OTHER_CONCERNS, data.concerns || [], 'concerns')}
                            {renderContinue()}
                        </div>
                    );
                case 11:
                    return (
                         <div className="max-w-2xl mx-auto">
                            <h2 className="text-xl md:text-3xl font-display font-bold text-center mb-6 md:mb-12">How would you expect Streamyst to be priced for your use case?</h2>
                            <div className="grid gap-2 md:gap-3">
                                {OTHER_PRICING.map((opt) => (
                                     <div 
                                        key={opt}
                                        onClick={() => updateData('pricingExpectation', opt)}
                                        className={`p-3 md:p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${data.pricingExpectation === opt ? 'bg-violet-900/20 border-violet-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                    >
                                        <span className="font-medium text-sm md:text-base">{opt}</span>
                                        {data.pricingExpectation === opt && <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-violet-500" />}
                                    </div>
                                ))}
                            </div>
                            {renderContinue()}
                        </div>
                    );
                case 12:
                     return (
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-xl md:text-3xl font-display font-bold text-center mb-6 md:mb-12">How interested are you in Streamyst?</h2>
                            {renderScale(data.interestLevel || 5, (n) => updateData('interestLevel', n), "Not Interested", "Very Interested")}
                            {renderContinue()}
                        </div>
                    );
                case 13:
                    return (
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-xl md:text-3xl font-display font-bold text-center mb-6 md:mb-12">Would you be open to collaborating or exploring further?</h2>
                            {renderMultiSelect(OTHER_COLLAB, data.collaborationInterest || [], 'collaborationInterest')}
                            {renderContinue()}
                        </div>
                    );
                case 14:
                    return renderEmailStep();
                case 15:
                     return (
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-xl md:text-3xl font-display font-bold text-center mb-2">Anything else you’d like to share?</h2>
                            <p className="text-sm md:text-base text-gray-400 text-center mb-6 md:mb-8">Ideas, questions, concerns, wild concepts, we’d love to hear them.</p>
                            {renderTextArea(data.anythingElse, 'anythingElse', "Open floor...")}
                            
                            {renderConsent()}
                            {renderContinue(!hasAgreedToTerms)}
                        </div>
                    );
                case 16:
                    return renderExit();
                default:
                    return null;
            }
        }
        
        switch (step) {
            case 2:
                if (isViewer) {
                    return (
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-xl md:text-3xl font-display font-bold text-center mb-6 md:mb-12">Tell us about your viewing habits</h2>
                            
                            <div className="mb-8 md:mb-12">
                                <label className="block text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 md:mb-4">Hours per week watching streams?</label>
                                <div className="flex items-center gap-4">
                                    <span className="font-mono text-violet-400 text-lg md:text-xl w-12 text-right">{data.hoursWatched || 0}</span>
                                    <input 
                                        type="range" 
                                        min="0" max="60" 
                                        value={data.hoursWatched || 0} 
                                        onChange={(e) => updateData('hoursWatched', parseInt(e.target.value))}
                                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                                    />
                                    <span className="text-gray-500 text-xs md:text-base">40+</span>
                                </div>
                            </div>

                            <div className="space-y-2 md:space-y-4">
                                <label className="block text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-1 md:mb-2">How do you interact?</label>
                                {['I chat actively', 'I lurk but sometimes interact', 'I mostly just watch', 'I never interact'].map((opt) => (
                                    <div 
                                        key={opt}
                                        onClick={() => updateData('interactionStyle', opt)}
                                        className={`p-3 md:p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${data.interactionStyle === opt ? 'bg-violet-900/20 border-violet-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                    >
                                        <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border flex items-center justify-center ${data.interactionStyle === opt ? 'border-violet-500' : 'border-gray-500'}`}>
                                            {data.interactionStyle === opt && <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-violet-500" />}
                                        </div>
                                        <span className="text-sm md:text-base">{opt}</span>
                                    </div>
                                ))}
                            </div>
                            {renderContinue()}
                        </div>
                    )
                }
                return (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-xl md:text-3xl font-display font-bold text-center mb-6 md:mb-12">Tell us about your stream</h2>
                        
                        <div className="space-y-4 md:space-y-8">
                            <div>
                                <label className="block text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 md:mb-4">How often do you stream?</label>
                                <select 
                                    className="w-full bg-[#1A1830] border border-white/10 rounded-xl p-3 md:p-4 text-sm md:text-base text-white focus:border-violet-500 outline-none appearance-none"
                                    onChange={(e) => updateData('streamFreq', e.target.value)}
                                    value={data.streamFreq || ''}
                                >
                                    <option value="" disabled>Select frequency</option>
                                    <option>Daily</option>
                                    <option>3-5 times per week</option>
                                    <option>1-2 times per week</option>
                                    <option>Few times per month</option>
                                    <option>Just starting out</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 md:mb-4">Typical viewer count?</label>
                                <select 
                                    className="w-full bg-[#1A1830] border border-white/10 rounded-xl p-3 md:p-4 text-sm md:text-base text-white focus:border-violet-500 outline-none appearance-none"
                                    onChange={(e) => updateData('viewerCount', e.target.value)}
                                    value={data.viewerCount || ''}
                                >
                                    <option value="" disabled>Select range</option>
                                    <option>&lt; 50</option>
                                    <option>50 - 500</option>
                                    <option>500 - 5K</option>
                                    <option>5K - 50K</option>
                                    <option>50K+</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-8 md:mt-12 flex justify-end">
                            <button 
                                onClick={nextStep} 
                                disabled={!data.streamFreq || !data.viewerCount}
                                className="px-6 py-2.5 md:px-8 md:py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue →
                            </button>
                        </div>
                    </div>
                );

            case 3:
                const problemOptions = isViewer ? VIEWER_PROBLEM_OPTIONS : STREAMER_PROBLEM_OPTIONS;

                return (
                    <div className="max-w-4xl mx-auto relative h-full flex flex-col">
                        <Mascot src={MASCOT_1} className="-top-24 right-10 w-40 hidden md:block" delay={0.3} />
                        
                        <div className="text-center mb-4 md:mb-8 relative z-10 shrink-0">
                            <h2 className="text-xl md:text-3xl font-display font-bold mb-1 md:mb-2">
                                {isViewer ? "What frustrates you most?" : "Rank TOP 3 challenges"}
                            </h2>
                            <p className="text-xs md:text-base text-gray-400">Select 3 items from below.</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 md:gap-8 relative z-10 flex-1 min-h-0">
                            {/* Top 3 Section */}
                            <div className="md:w-1/2 space-y-2 md:space-y-4 shrink-0">
                                <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-violet-400 mb-1 md:mb-4">Your Priorities</h3>
                                {[0, 1, 2].map((index) => {
                                    const item = data.problemRank ? data.problemRank[index] : null;
                                    const itemDetails = item ? problemOptions.find(p => p.id === item) : null;

                                    return (
                                        <div 
                                            key={index} 
                                            className={`h-12 md:h-20 rounded-xl border-2 border-dashed flex items-center px-3 md:px-4 relative transition-colors ${item ? 'border-violet-500 bg-violet-900/10 border-solid' : 'border-white/10 bg-white/5'}`}
                                        >
                                            <div className="absolute left-3 md:left-4 font-display font-bold text-xl md:text-4xl text-white/10 pointer-events-none">{index + 1}</div>
                                            {itemDetails ? (
                                                <div className="flex items-center justify-between w-full pl-6 md:pl-8">
                                                    <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
                                                        <div className="shrink-0 scale-75 md:scale-100">{itemDetails.icon}</div>
                                                        <span className="font-bold text-xs md:text-sm leading-tight truncate">{itemDetails.label}</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => updateData('problemRank', data.problemRank?.filter(id => id !== item))}
                                                        className="p-1 hover:bg-white/10 rounded-full shrink-0"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="w-full text-center text-xs md:text-sm text-gray-500 pl-6 md:pl-8">Select below</span>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Available List Section */}
                            <div className="md:w-1/2 flex flex-col min-h-0 h-full">
                                <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 md:mb-4 shrink-0">Available Options</h3>
                                <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1 min-h-[200px] md:min-h-0">
                                    {problemOptions.filter(opt => !data.problemRank?.includes(opt.id)).map(opt => (
                                        <motion.div
                                            key={opt.id}
                                            layoutId={opt.id}
                                            onClick={() => {
                                                if ((data.problemRank?.length || 0) < 3) {
                                                    updateData('problemRank', [...(data.problemRank || []), opt.id]);
                                                }
                                            }}
                                            className="p-3 md:p-4 bg-[#1A1830] border border-white/5 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors group"
                                        >
                                            <div className="text-gray-500 group-hover:text-white transition-colors scale-75 md:scale-100">{opt.icon}</div>
                                            <span className="text-xs md:text-sm leading-tight">{opt.label}</span>
                                            <div className="ml-auto opacity-0 group-hover:opacity-100 text-violet-400 hidden md:block">
                                                <ArrowLeft size={16} />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 md:mt-8 flex justify-end relative z-10 shrink-0">
                            <button 
                                onClick={nextStep}
                                disabled={(data.problemRank?.length || 0) !== 3}
                                className="px-6 py-2.5 md:px-8 md:py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform disabled:opacity-50"
                            >
                                Continue →
                            </button>
                        </div>
                    </div>
                );

            case 4:
                // ... (Applying scale helper update for Step 4 automatically via renderScale change)
                const currentProblemList = isViewer ? VIEWER_PROBLEM_OPTIONS : STREAMER_PROBLEM_OPTIONS;
                const problemLabel = currentProblemList.find(p => p.id === (data.problemRank?.[0]))?.label || "Your top challenge";

                return (
                    <div className="max-w-2xl mx-auto text-center relative">
                        <Mascot src={MASCOT_2} className="-left-32 bottom-0 w-48 opacity-60 hidden md:block" delay={0.4} />
                        <div className="relative z-10">
                            <h2 className="text-xl md:text-3xl font-display font-bold mb-4">How painful is your #1 challenge?</h2>
                            <div className="bg-white/5 p-3 md:p-4 rounded-xl inline-block mb-8 md:mb-12 text-violet-300 text-sm md:text-base font-bold max-w-full truncate">
                                {problemLabel}
                            </div>
                            {renderScale(data.painIntensity || 5, (n) => updateData('painIntensity', n), "Minor Annoyance", "Considering Quitting")}
                            {renderContinue()}
                        </div>
                    </div>
                );

            case 5:
                // ... (Attempted solutions grid update)
                const attemptOptions = isViewer 
                    ? [
                        "Donated to get attention", "Joined Discord communities",
                        "Switched to smaller streams", "Used Adblock",
                        "Turned off chat", "Became a moderator",
                        "Nothing really works", "Just lurk mostly"
                      ]
                    : [
                        "Better chat moderation tools", "Polls, predictions, channel points", 
                        "Discord community", "Upgraded equipment/lighting", 
                        "Emote reactions / Sound alerts", "Hired a community manager", 
                        "Nothing has really worked", "Haven't tried anything yet"
                      ];

                return (
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-xl md:text-3xl font-display font-bold text-center mb-6 md:mb-12">Have you tried to improve this before?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                            {attemptOptions.map((sol) => (
                                <div 
                                    key={sol}
                                    onClick={() => toggleArrayItem('attemptedSolutions', sol)}
                                    className={`p-3 md:p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${data.attemptedSolutions?.includes(sol) ? 'bg-violet-900/20 border-violet-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                >
                                    <div className={`mt-0.5 w-4 h-4 md:w-5 md:h-5 rounded border flex items-center justify-center shrink-0 ${data.attemptedSolutions?.includes(sol) ? 'border-violet-500 bg-violet-500' : 'border-gray-500'}`}>
                                        {data.attemptedSolutions?.includes(sol) && <Check size={12} className="text-white" />}
                                    </div>
                                    <span className="text-xs md:text-sm leading-tight">{sol}</span>
                                </div>
                            ))}
                        </div>
                        {renderContinue()}
                    </div>
                );

            case 6:
                // ... (Solution preference)
                const solutionOptions = isViewer
                    ? [
                        { id: 'interaction', icon: <Zap size={24} />, title: "Better Interaction", desc: "Tools to affect the stream directly" },
                        { id: 'recognition', icon: <Crown size={24} />, title: "Recognition", desc: "Ways to stand out without paying" },
                        { id: 'xr', icon: <Heart size={24} />, title: "Ambient Connection", desc: "Wearable tech to FEEL the stream vibe", highlight: true },
                        { id: 'content', icon: <PlayCircle size={24} />, title: "Better Content", desc: "Higher quality streams" },
                        { id: 'community', icon: <Users size={24} />, title: "Community Tools", desc: "Easier ways to make friends" }
                      ]
                    : [
                        { id: 'analytics', icon: <Activity size={24} />, title: "Better Analytics", desc: "Deeper insights into chat & behavior" },
                        { id: 'ai', icon: <Cpu size={24} />, title: "AI Moderation", desc: "Smarter bots to filter spam & highlight VIPs" },
                        { id: 'xr', icon: <Zap size={24} />, title: "Ambient Awareness", desc: "Wearable tech to FEEL audience emotion without reading chat", highlight: true },
                        { id: 'gamification', icon: <PlayCircle size={24} />, title: "Interaction Tools", desc: "More polls, predictions & mini-games" },
                        { id: 'other', icon: <MessageSquare size={24} />, title: "Something Else", desc: "I have a different idea..." }
                      ];

                return (
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-xl md:text-3xl font-display font-bold text-center mb-2 md:mb-4">If you could choose ONE way to improve connection?</h2>
                        <p className="text-xs md:text-base text-gray-400 text-center mb-6 md:mb-12">Which of these sounds most like magic to you?</p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                            {solutionOptions.map((opt) => (
                                <Card
                                    key={opt.id}
                                    selected={data.solutionPreference === opt.id}
                                    onClick={() => updateData('solutionPreference', opt.id)}
                                    className={`flex flex-col items-center text-center h-full p-3 md:p-6 ${opt.highlight ? 'col-span-2 md:col-span-1 md:row-span-1 ring-2 ring-violet-500/50' : ''}`}
                                >
                                    <div className={`mb-2 md:mb-4 p-3 md:p-4 rounded-full ${opt.highlight ? 'bg-violet-500/20 text-violet-400' : 'bg-white/5 text-gray-400'}`}>
                                        {opt.icon}
                                    </div>
                                    <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2 leading-tight">{opt.title}</h3>
                                    <p className="text-[10px] md:text-sm text-gray-400 leading-tight">{opt.desc}</p>
                                    {opt.highlight && <div className="mt-2 md:mt-4 px-2 py-1 bg-violet-500/10 rounded text-[9px] md:text-[10px] font-bold text-violet-400 uppercase tracking-widest">Streamyst Approach</div>}
                                </Card>
                            ))}
                        </div>
                        {renderContinue(!data.solutionPreference)}
                    </div>
                );

            case 7:
                // ... (Desired features)
                const featureOptions = isViewer 
                    ? [
                        "My actions change the stream lighting/visuals",
                        "Feel game events (haptics) along with streamer",
                        "See my contribution visualized",
                        "Sync pulse with the community",
                        "No ads for device owners",
                        "Exclusive interaction modes"
                      ]
                    : [
                        "Feel audience emotion in real-time",
                        "Visual XR overlays on stream",
                        "Sentiment-responsive lighting",
                        "No need to read every chat message",
                        "Works with all streaming platforms",
                        "Audience sees their collective impact"
                      ];

                return (
                    <div className="max-w-3xl mx-auto relative">
                        <div className="text-center mb-6 md:mb-12 relative z-10">
                            <h2 className="text-xl md:text-3xl font-display font-bold mb-2">Which features excite you most?</h2>
                            <p className="text-violet-400 font-bold uppercase tracking-widest text-xs md:text-sm">Pick your top 2</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 relative z-10">
                            {featureOptions.map((feat) => (
                                <div 
                                    key={feat}
                                    onClick={() => toggleArrayItem('desiredFeatures', feat)}
                                    className={`
                                        p-3 md:p-6 rounded-xl border cursor-pointer transition-all flex items-start gap-3 md:gap-4
                                        ${data.desiredFeatures?.includes(feat) 
                                            ? 'bg-violet-900/20 border-violet-500' 
                                            : (data.desiredFeatures?.length || 0) >= 2 
                                                ? 'opacity-50 cursor-not-allowed bg-white/5 border-white/5' 
                                                : 'bg-white/5 border-white/10 hover:bg-white/10'}
                                    `}
                                >
                                    <div className={`mt-0.5 w-5 h-5 md:w-6 md:h-6 rounded border flex items-center justify-center shrink-0 ${data.desiredFeatures?.includes(feat) ? 'border-violet-500 bg-violet-500' : 'border-gray-500'}`}>
                                        {data.desiredFeatures?.includes(feat) && <Check size={14} className="text-white" />}
                                    </div>
                                    <span className="font-medium text-xs md:text-lg leading-snug">{feat}</span>
                                </div>
                            ))}
                        </div>
                        {renderContinue((data.desiredFeatures?.length || 0) !== 2)}
                    </div>
                );

            case 8:
                // ... (Interest)
                return (
                    <div className="max-w-xl mx-auto text-center relative">
                        <Mascot src={MASCOT_2} className="-right-24 bottom-10 w-40 opacity-80 hidden md:block" delay={0.4} />
                        <div className="relative z-10">
                            <h2 className="text-xl md:text-3xl font-display font-bold mb-6 md:mb-12">How interested are you in Streamyst?</h2>
                            
                            <div className="space-y-3 md:space-y-4">
                                {[
                                    { id: 'take_money', label: "🔥 TAKE MY MONEY", sub: "I'd pre-order today if I could", glow: "shadow-[0_0_30px_rgba(139,92,246,0.4)] border-violet-500" },
                                    { id: 'very_interested', label: "✋ VERY INTERESTED", sub: "Definitely want early access", glow: "shadow-[0_0_20px_rgba(99,102,241,0.3)] border-indigo-500" },
                                    { id: 'curious', label: "👀 CURIOUS", sub: "Sounds interesting, want to learn more", glow: "border-violet-500/50" },
                                    { id: 'neutral', label: "😐 NEUTRAL", sub: "Not sure yet", glow: "border-white/20" },
                                    { id: 'not_for_me', label: "👎 NOT FOR ME", sub: "Doesn't solve my problem", glow: "border-gray-700 opacity-60" }
                                ].map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => {
                                            updateData('purchaseIntent', opt.id);
                                            setTimeout(nextStep, 300);
                                        }}
                                        className={`w-full p-3 md:p-4 rounded-xl border bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center ${opt.glow} hover:scale-102`}
                                    >
                                        <span className="font-bold text-base md:text-lg mb-1">{opt.label}</span>
                                        <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest">{opt.sub}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 9:
                // ... (Price Sliders)
                return (
                    <div className="max-w-3xl mx-auto">
                         <h2 className="text-xl md:text-3xl font-display font-bold text-center mb-2 md:mb-4">Let's talk pricing for a moment...</h2>
                         <p className="text-gray-400 text-center mb-8 md:mb-12 max-w-lg mx-auto text-xs md:text-base">There are no wrong answers here. We want to know what feels fair to you for the monthly software subscription.</p>

                         <div className="space-y-6 md:space-y-12">
                             {[
                                 { key: 'priceCheap', label: "At what price is it a GREAT DEAL?", color: "text-green-400" },
                                 { key: 'priceExpensive', label: "At what price is it EXPENSIVE but worth it?", color: "text-yellow-400" },
                                 { key: 'priceTooExpensive', label: "At what price is it TOO EXPENSIVE?", color: "text-red-400" },
                             ].map((q) => (
                                 <div key={q.key}>
                                     <div className="flex justify-between items-end mb-2 md:mb-4">
                                        <label className={`font-bold uppercase tracking-widest text-[10px] md:text-sm ${q.color} max-w-[70%] leading-tight`}>{q.label}</label>
                                        <span className="font-mono text-lg md:text-2xl font-bold">€{(data as any)[q.key]}/mo</span>
                                     </div>
                                     <input 
                                        type="range" 
                                        min="0" max="100" step="1"
                                        value={(data as any)[q.key]}
                                        onChange={(e) => updateData(q.key as keyof SurveyData, parseInt(e.target.value))}
                                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                                     />
                                     <div className="flex justify-between text-[10px] md:text-xs text-gray-600 mt-2 font-mono">
                                         <span>€0</span>
                                         <span>€50</span>
                                         <span>€100+</span>
                                     </div>
                                 </div>
                             ))}
                         </div>
                         <div className="mt-8 md:mt-12 flex justify-end">
                             <button onClick={nextStep} className="px-6 py-2.5 md:px-8 md:py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">Continue →</button>
                         </div>
                    </div>
                );

            case 10:
                // ... (Pricing Models)
                const pricingOptions = isViewer ? VIEWER_PRICING_MODELS : STREAMER_PRICING_MODELS;
                const question = isViewer 
                    ? "If Streamyst launches, how would you prefer to support it?"
                    : "Which way would you most want to access Streamyst?";

                return (
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-6 md:mb-12 max-w-4xl mx-auto">
                            <h2 className="text-xl md:text-3xl font-display font-bold mb-2 md:mb-4">{question}</h2>
                            <p className="text-xs md:text-base text-gray-400">Select the model that fits you best.</p>
                        </div>
                        
                        {/* On mobile, use a 2-column grid for compactness or even a scrollable area if needed, but 2 cols usually fits well enough for short cards */}
                        <div className={`grid grid-cols-1 xs:grid-cols-2 gap-3 md:gap-6 ${isViewer ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                            {pricingOptions.map((opt) => (
                                <Card
                                    key={opt.id}
                                    selected={data.pricingModel === opt.id}
                                    onClick={() => {
                                        updateData('pricingModel', opt.id);
                                    }}
                                    className="flex flex-col text-left h-full p-4"
                                >
                                    <h3 className="text-sm md:text-lg font-bold text-white mb-1 md:mb-3 leading-tight">{opt.title}</h3>
                                    <p className="text-[10px] md:text-xs text-gray-400 mb-2 md:mb-6 leading-relaxed flex-grow">{opt.desc}</p>
                                    
                                    {opt.features.length > 0 && (
                                        <ul className="space-y-1 md:space-y-3 mt-auto border-t border-white/5 pt-2 md:pt-4">
                                            {opt.features.map((feat, i) => (
                                                <li key={i} className="text-[9px] md:text-[11px] text-violet-200 flex items-start gap-2 leading-snug">
                                                    <span className="mt-1 w-1 h-1 rounded-full bg-violet-500 shrink-0" />
                                                    {feat}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </Card>
                            ))}
                        </div>
                        
                        {renderContinue(!data.pricingModel)}
                    </div>
                );

            case 11:
                const frictionOptions = isViewer ? VIEWER_FRICTION_OPTIONS : STREAMER_FRICTION_OPTIONS;
                return (
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-xl md:text-3xl font-display font-bold text-center mb-6 md:mb-12">
                            {isViewer ? "What would stop you from supporting Streamyst?" : "What would most stop you from trying Streamyst?"}
                        </h2>
                        {renderMultiSelect(frictionOptions, data.frictionPoints || [], 'frictionPoints')}
                        {renderContinue()}
                    </div>
                );
            
            case 12:
                return renderEmailStep();

            case 13:
                return (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-xl md:text-3xl font-display font-bold text-center mb-2">Anything else you’d like to share?</h2>
                        <p className="text-sm md:text-base text-gray-400 text-center mb-6 md:mb-8">Ideas, questions, concerns, wild concepts, we’d love to hear them.</p>
                        {renderTextArea(data.anythingElse, 'anythingElse', "Open floor...")}
                        
                        {renderConsent()}
                        {renderContinue(!hasAgreedToTerms)}
                    </div>
                );

            case 14:
                return renderExit();

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-cosmic-950 text-white font-body relative overflow-x-hidden">
            
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,transparent_70%)]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-900/10 blur-[120px]" />
            </div>

            <div className="w-full min-h-[100dvh] pb-4 md:pb-10 pt-20 md:pt-24 px-4 md:px-6 flex flex-col justify-center">
                <div className="fixed top-0 left-0 w-full h-1 md:h-2 bg-white/5 z-50">
                    <motion.div 
                        className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 shadow-[0_0_20px_rgba(139,92,246,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                {step > 0 && step < (totalSteps - 1) && (
                    <>
                        <button 
                            onClick={prevStep}
                            className="fixed top-6 left-4 md:top-8 md:left-6 z-50 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5"
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <div className="fixed top-4 right-4 md:top-6 md:right-6 z-40 flex items-center gap-4 text-[10px] md:text-xs font-mono text-gray-500 uppercase tracking-widest">
                            <span className="hidden xs:inline">Survey In Progress</span>
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="hidden md:inline">~{Math.max(1, 3 - Math.floor(step * 0.25))} mins left</span>
                        </div>
                    </>
                )}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-full h-full flex flex-col justify-center"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>

                {/* Exit Modal logic remains same */}
                <AnimatePresence>
                    {showExitModal && (
                        <div className="fixed inset-0 bg-[#030205]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                            <motion.div 
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                className="relative w-full max-w-md bg-[#0A0A0B] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500" />
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-500/10 rounded-full blur-[60px] pointer-events-none" />

                                <div className="p-8 relative z-10 text-center">
                                    <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 mx-auto">
                                    <div className="relative">
                                        <AlertCircle className="text-violet-400" size={28} />
                                        <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    </div>
                                    </div>
                                    
                                    <h3 className="text-2xl font-display font-bold text-white mb-3">
                                        Wait! You're almost there.
                                    </h3>
                                    
                                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                        You've completed <strong>{Math.round(progress)}%</strong> of the survey. 
                                        Leaving now means losing your priority access spot and your chance to shape the product.
                                    </p>

                                    <div className="w-full h-2 bg-white/5 rounded-full mb-8 overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500" 
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button 
                                            onClick={() => setShowExitModal(false)}
                                            className="w-full py-3.5 bg-white text-black font-bold rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 group shadow-lg shadow-white/5"
                                        >
                                            <span>Complete Survey</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <button 
                                            onClick={handleSurveyAbandon}
                                            className="w-full py-3 text-gray-500 hover:text-white text-xs font-medium uppercase tracking-widest transition-colors"
                                        >
                                            Abandon Progress
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SurveyPage;
