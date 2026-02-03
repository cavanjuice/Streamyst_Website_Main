
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
    ChevronRight, Check, X, ArrowLeft, ArrowRight, Send, 
    MonitorPlay, Eye, Users, Clock, MessageSquare, 
    Activity, DollarSign, Lightbulb, Wifi, Shield, 
    Cpu, Zap, GripVertical, AlertCircle, PlayCircle,
    Ghost, Crown, Heart, Briefcase, Globe, Layers, 
    PenTool, Share2, HelpCircle, MousePointer2, Loader2
} from 'lucide-react';
import { saveSurveyResponse, getAssetUrl } from '../utils/supabaseClient';

// --- ASSETS ---
const MASCOT_1 = getAssetUrl("mascot1.webp");
const MASCOT_2 = getAssetUrl("mascot2.webp");
const MASCOT_3 = getAssetUrl("mascot3.webp");

// --- TYPES ---
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

// --- CONSTANTS ---
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

const OTHER_ROLES = [ "Brand representative", "Creator", "Designer", "Developer", "Agency", "Platform partner", "Researcher", "Investor" ];
const OTHER_CONTEXTS = [ "Brand activations / marketing", "Content creation", "Product or experience design", "Community building", "Technology / platform development", "Research or innovation", "Investment or business development" ];
const OTHER_INTERESTS = [ "Interactive digital overlays", "Audience sentiment & emotional feedback", "Physical device reacting to livestreams", "Stronger audience–creator connection", "XR / mixed digital-physical experiences", "New monetization or engagement models" ];
const OTHER_CONCERNS = [ "Cost", "Hardware requirements", "Integration complexity", "Scalability", "Audience adoption", "Creative limitations", "Data/privacy concerns", "Unclear ROI" ];
const OTHER_PRICING = [ "One-time purchase", "Subscription", "Per-campaign or per-event", "Licensing / enterprise pricing", "Revenue share", "Not sure yet" ];
const OTHER_COLLAB = [ "I’d like updates/newsletter", "I’m interested in early access or beta testing", "I’m open to partnerships or collaborations", "I’d like to talk to the team", "Just exploring for now" ];
const STREAMER_FRICTION_OPTIONS = [ "Monthly cost", "Upfront hardware cost", "Asking my community for money", "Setup complexity", "Brand ads on my stream", "Nothing would stop me" ];
const VIEWER_FRICTION_OPTIONS = [ "Cost", "I don’t want more monetization in chat", "I don’t feel involved enough", "I prefer passive viewing", "I already support enough" ];

const STREAMER_PRICING_GROUPS = [
    {
        title: "Flexible / No Upfront Cost",
        description: "Start using Streamyst features without buying hardware immediately.",
        options: [
            {
                id: 'free_start',
                title: 'Free-to-Start',
                desc: 'I want to try Streamyst for free and unlock more as my channel grows.',
                features: ['Free core features', 'Paid visual upgrades (€9,99–14,99 / month)']
            },
            {
                id: 'brand_supported',
                title: 'Brand Supported',
                desc: 'I want features for free, supported by occasional branded watermarks/ads.',
                features: ['Free interactive experience', 'Branded ads woven into overlays']
            },
            {
                id: 'community_growth',
                title: 'Community-Supported',
                desc: 'I want my community to help unlock Streamyst features together.',
                features: ['Free base experience', 'Monthly goal-based upgrades']
            }
        ]
    },
    {
        title: "Subscription Based",
        description: "Access powerful digital tools with a simple monthly plan.",
        options: [
             {
                id: 'creator_sub',
                title: 'Creator Subscription',
                desc: 'Full access to overlays, customization, and updates. No hardware required.',
                features: ['Customizable overlays', '€14,99 / month']
            }
        ]
    },
    {
        title: "Hardware Ownership",
        description: "Get the physical Vybe device for maximum immersion and connection.",
        options: [
            {
                id: 'hardware_first',
                title: 'Hardware-First',
                desc: 'I want the physical device for better immersion and emotional connection.',
                features: ['€150 device + free core features', '€9,99/mo service']
            },
            {
                id: 'affiliate_hardware',
                title: 'Affiliate Program',
                desc: 'I want to earn the hardware through engagement stats.',
                features: ['Discounted device (€50) at 500+ interactions', 'Performance based']
            },
            {
                id: 'all_in',
                title: 'All-In Lifetime',
                desc: 'I want to own everything outright with no monthly fees.',
                features: ['€349 one-time payment', 'Lifetime overlays + support']
            }
        ]
    }
];

const VIEWER_PRICING_GROUPS = [
    {
        title: "Community & Collective",
        description: "Join forces with other viewers to unlock features.",
        options: [
            {
                id: 'community_goal',
                title: 'Community Goals',
                desc: 'Contributing small amounts together to unlock features.',
                features: ['€1–€3 micro-contributions', 'Collective achievement']
            },
            {
                id: 'hardware_unlock',
                title: 'Hardware Unlock',
                desc: 'Helping save up to unlock the physical device for a streamer.',
                features: ['Donations towards hardware', 'Community milestones']
            }
        ]
    },
    {
        title: "Direct & Personal",
        description: "Enhance your own personal impact on the stream.",
        options: [
             {
                id: 'interaction_boosts',
                title: 'Interaction Boosts',
                desc: 'Paying occasionally to trigger special effects.',
                features: ['One-time boosts (like Bits)', 'Visual + physical response']
            },
            {
                id: 'monthly_supporter',
                title: 'Monthly Supporter',
                desc: 'Supporting the service as part of a monthly sub.',
                features: ['€3–€5 / month', 'Exclusive interactions']
            }
        ]
    },
    {
        title: "Passive",
        description: "Prefer to watch without financial involvement.",
        options: [
            {
                id: 'no_pay',
                title: 'I wouldn’t pay',
                desc: 'I prefer watching without spending money.',
                features: []
            }
        ]
    }
];

// --- COMPONENTS ---

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
            cursor-pointer relative p-6 rounded-2xl border transition-all duration-300 overflow-hidden group
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
        <div className="relative z-10">
            {children}
        </div>
        {/* Selection Check */}
        <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${selected ? 'bg-violet-500 border-violet-500' : 'border-white/20'}`}>
            {selected && <Check size={14} className="text-white" />}
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
    const [isSubmitting, setIsSubmitting] = useState(false);
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
    
    // Flow Logic
    const isOther = data.userType === 'other';
    const totalSteps = isOther ? 3 : 5; 
    const progress = Math.min(100, (step / totalSteps) * 100);

    const submitData = async () => {
        setIsSubmitting(true);
        const { error } = await saveSurveyResponse(data);
        setIsSubmitting(false);
        
        if (error) {
            console.error("Error saving survey:", error);
            return false;
        }
        return true;
    };

    const nextStep = async () => {
        // Validation checks
        if (step === 1 && !data.userType) return;
        
        // Trigger save on intermediate steps
        if (step > 0) {
             await submitData();
        }

        if (step < totalSteps) {
            setStep(prev => prev + 1);
        } else {
            setShowExitModal(true);
        }
    };

    const prevStep = () => {
        if (step > 0) setStep(prev => prev - 1);
    };

    return (
        <div className="min-h-screen bg-cosmic-950 text-white flex flex-col items-center pt-24 pb-12 px-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
                 <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-violet-900/10 blur-[120px] rounded-full" />
                 <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-indigo-900/10 blur-[120px] rounded-full" />
            </div>

            <div className="w-full max-w-4xl relative z-10 flex flex-col h-full flex-grow">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button onClick={onExit} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
                        <ArrowLeft size={16} /> Exit Survey
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="text-xs font-mono text-gray-500">
                            STEP {step + 1}/{totalSteps + 1}
                        </div>
                        <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-violet-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                </div>

                <AnimatePresence mode='wait'>
                    {/* STEP 0: EMAIL & INTRO */}
                    {step === 0 && (
                        <motion.div 
                            key="step0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col flex-grow justify-center"
                        >
                            <h1 className="font-display font-bold text-3xl md:text-5xl mb-6">First, a quick check.</h1>
                            <p className="text-gray-400 mb-8 text-lg">To keep your responses saved, please confirm your email.</p>
                            
                            <input 
                                type="email" 
                                placeholder="name@example.com"
                                value={data.email}
                                onChange={(e) => setData({...data, email: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-xl mb-8 focus:outline-none focus:border-violet-500 transition-colors"
                            />

                            <button onClick={nextStep} disabled={!data.email.includes('@')} className="bg-white text-black font-bold py-4 px-8 rounded-full self-start hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed">
                                Begin Survey
                            </button>
                            <Mascot src={MASCOT_1} className="right-[-50px] bottom-[-50px] w-80 h-80 opacity-50" />
                        </motion.div>
                    )}

                    {/* STEP 1: ROLE SELECTION */}
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h1 className="font-display font-bold text-3xl md:text-5xl mb-6">What best describes you?</h1>
                            <p className="text-gray-400 mb-8 text-lg">We'll tailor the questions to your experience.</p>
                            
                            <div className="grid md:grid-cols-3 gap-6">
                                <Card selected={data.userType === 'streamer'} onClick={() => setData({...data, userType: 'streamer'})}>
                                    <MonitorPlay className="w-10 h-10 text-violet-400 mb-4" />
                                    <h3 className="text-xl font-bold mb-2">Streamer</h3>
                                    <p className="text-sm text-gray-400">I broadcast content on Twitch, YouTube, or Kick.</p>
                                </Card>
                                <Card selected={data.userType === 'viewer'} onClick={() => setData({...data, userType: 'viewer'})}>
                                    <Eye className="w-10 h-10 text-orange-400 mb-4" />
                                    <h3 className="text-xl font-bold mb-2">Viewer</h3>
                                    <p className="text-sm text-gray-400">I watch livestreams and participate in chat.</p>
                                </Card>
                                <Card selected={data.userType === 'other'} onClick={() => setData({...data, userType: 'other'})}>
                                    <Briefcase className="w-10 h-10 text-pink-400 mb-4" />
                                    <h3 className="text-xl font-bold mb-2">Industry / Other</h3>
                                    <p className="text-sm text-gray-400">I work in the industry or build for streamers.</p>
                                </Card>
                            </div>

                            <div className="mt-12 flex justify-end">
                                <button onClick={nextStep} disabled={!data.userType} className="flex items-center gap-2 bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform disabled:opacity-50">
                                    Continue <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEPS 2+: GENERIC PLACEHOLDER FOR REMAINING FLOW */}
                    {step > 1 && !showExitModal && (
                        <motion.div 
                            key="generic"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col flex-grow"
                        >
                            <h1 className="font-display font-bold text-3xl md:text-5xl mb-6">
                                {data.userType === 'streamer' ? 'Your Streaming Experience' : 'Your Viewing Experience'}
                            </h1>
                            <p className="text-gray-400 mb-8 text-lg">Tell us more about how you interact.</p>
                            
                            {/* Placeholder UI for remaining steps */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
                                <p className="text-gray-300 italic">
                                    [Survey questions for {data.userType} would continue here based on the detailed data model. 
                                    For this demo, click continue to finish.]
                                </p>
                            </div>

                            <div className="mt-auto flex justify-between">
                                <button onClick={prevStep} className="text-gray-400 hover:text-white px-4 py-2">Back</button>
                                <button onClick={nextStep} className="flex items-center gap-2 bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform">
                                    {step === totalSteps ? 'Finish' : 'Continue'} <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* EXIT MODAL */}
                    {showExitModal && (
                        <motion.div 
                            key="exit"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
                        >
                            <div className="bg-[#0A0A0B] border border-white/10 rounded-3xl p-12 max-w-lg text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-indigo-500" />
                                <Check className="w-16 h-16 text-green-400 mx-auto mb-6" />
                                <h2 className="font-display font-bold text-3xl text-white mb-4">Response Saved!</h2>
                                <p className="text-gray-400 mb-8">
                                    Thank you for helping us shape the future of Streamyst. We'll be in touch soon.
                                </p>
                                <button onClick={onExit} className="bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform">
                                    Return to Home
                                </button>
                                <Mascot src={MASCOT_2} className="right-[-20px] bottom-[-20px] w-40 h-40 opacity-20" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SurveyPage;
