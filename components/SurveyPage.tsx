
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
const MASCOT_1 = getAssetUrl("mascot1.PNG");
const MASCOT_2 = getAssetUrl("mascot2.PNG");
const MASCOT_3 = getAssetUrl("mascot3.PNG");

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
    const [hasSeenExitModal, setHasSeenExitModal] = useState(false);

    // Flow Logic
    const isViewer = data.userType === 'viewer';
    const isOther = data.userType === 'other';
    const totalSteps = isOther ? 10 : 8; // Simplified step count
    const progress = Math.min(100, (step / totalSteps) * 100);

    const submitData = async () => {
        setIsSubmitting(true);
        const { error } = await saveSurveyResponse(data);
        setIsSubmitting(false);
        
        if (error) {
            console.error("Error saving survey:", error);
            // alert("Connection error. Please check your internet and try again.");
            return false;
        }
        return true;
    };

    const nextStep = async () => {
        // Validation checks
        if (step === 1 && !data.userType) return;
        
        // Trigger save on final steps
        if (step === totalSteps - 1) {
            const success = await submitData();
            if (!success) return; 
        }

        setStep(prev => prev + 1);
        window.scrollTo(0, 0);
    };

    const prevStep = () => {
        if (isSubmitting) return;
        setStep(prev => Math.max(0, prev - 1));
        window.scrollTo(0, 0);
    }

    const updateData = (key: keyof SurveyData, value: any) => {
        setData(prev => ({ ...prev, [key]: value }));
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

    // Exit Intent Logic (Before Unload - Browser Native)
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

    // Exit Intent Logic (Mouse Leave - Custom Modal)
    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && step > 0 && step < (totalSteps - 1) && !hasSeenExitModal) {
                setShowExitModal(true);
                setHasSeenExitModal(true);
            }
        };
        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [step, hasSeenExitModal, totalSteps]);

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "circOut" as const } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: "circIn" as const } }
    };

    // --- RENDER HELPERS ---
    
    const renderScale = (val: number, setVal: (n: number) => void, minLabel = "Low", maxLabel = "High") => (
        <div className="relative mb-8 px-4">
            <div className="flex justify-between text-2xl mb-8">
                <span className={`transition-opacity ${val < 4 ? 'opacity-100' : 'opacity-30'}`}>😐</span>
                <span className={`transition-opacity ${val > 7 ? 'opacity-100' : 'opacity-30'}`}>🤩</span>
            </div>
            <input 
                type="range" 
                min="0" max="10" 
                value={val}
                onChange={(e) => setVal(parseInt(e.target.value))}
                className="w-full h-4 bg-white/10 rounded-full appearance-none cursor-pointer accent-violet-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-4 font-mono uppercase tracking-widest">
                <span>{minLabel}</span>
                <span>{maxLabel}</span>
            </div>
            <div className="mt-4 text-4xl font-bold text-violet-400 text-center">{val} / 10</div>
        </div>
    );

    const renderMultiSelect = (options: string[], selected: string[], field: any) => (
        <div className="grid md:grid-cols-2 gap-3">
            {options.map((opt) => (
                <div 
                    key={opt}
                    onClick={() => toggleArrayItem(field, opt)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${selected?.includes(opt) ? 'bg-violet-900/20 border-violet-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                >
                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 ${selected?.includes(opt) ? 'border-violet-500 bg-violet-500' : 'border-gray-500'}`}>
                        {selected?.includes(opt) && <Check size={14} className="text-white" />}
                    </div>
                    <span className="text-sm">{opt}</span>
                </div>
            ))}
        </div>
    );

    const renderTextArea = (value: string | undefined, field: keyof SurveyData, placeholder: string) => (
        <textarea
            value={value || ''}
            onChange={(e) => updateData(field, e.target.value)}
            placeholder={placeholder}
            className="w-full h-40 bg-[#1A1830] border border-white/10 rounded-xl p-5 text-white placeholder-gray-500 focus:border-violet-500 outline-none resize-none"
        />
    );

    const renderContinue = (disabled = false) => (
        <div className="mt-12 flex justify-end">
            <button 
                onClick={nextStep}
                disabled={disabled || isSubmitting}
                className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {isSubmitting ? (
                    <>Saving <Loader2 size={16} className="animate-spin" /></>
                ) : (
                    <>Continue →</>
                )}
            </button>
        </div>
    );

    const renderStep = () => {
        // STEP 0: ENTRY
        if (step === 0) {
            return (
                <div className="text-center max-w-2xl mx-auto pt-10 relative">
                    <Mascot src={MASCOT_3} className="-right-32 bottom-20 w-56 opacity-80" delay={0.6} />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10"
                    >
                        <h1 className="font-display font-bold text-5xl md:text-7xl mb-8 leading-tight">
                            Help Us Build The <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">Future of Streaming</span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-12 font-light leading-relaxed max-w-lg mx-auto">
                            We're creating something that could change how creators and audiences connect. 
                            <br/><br/>
                            This takes 3 minutes. Your answers could shape what we build.
                        </p>
                        <button
                            onClick={nextStep}
                            className="group relative px-10 py-5 bg-white text-black font-bold text-lg rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                        >
                             <span className="relative z-10 flex items-center gap-2">Start Survey <ChevronRight /></span>
                             <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </motion.div>
                </div>
            );
        }

        // STEP 1: ROLE
        if (step === 1) {
            return (
                <div className="max-w-4xl mx-auto pt-10">
                    <h2 className="text-3xl font-bold mb-8 text-center">Which describes you best?</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card selected={data.userType === 'streamer'} onClick={() => updateData('userType', 'streamer')}>
                            <div className="text-center p-4">
                                <div className="bg-violet-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-400"><MonitorPlay size={32}/></div>
                                <h3 className="font-bold text-xl mb-2">Streamer</h3>
                                <p className="text-sm text-gray-400">I create content live.</p>
                            </div>
                        </Card>
                        <Card selected={data.userType === 'viewer'} onClick={() => updateData('userType', 'viewer')}>
                            <div className="text-center p-4">
                                <div className="bg-orange-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-400"><Eye size={32}/></div>
                                <h3 className="font-bold text-xl mb-2">Viewer</h3>
                                <p className="text-sm text-gray-400">I watch livestreams.</p>
                            </div>
                        </Card>
                        <Card selected={data.userType === 'other'} onClick={() => updateData('userType', 'other')}>
                            <div className="text-center p-4">
                                <div className="bg-gray-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400"><Briefcase size={32}/></div>
                                <h3 className="font-bold text-xl mb-2">Industry / Other</h3>
                                <p className="text-sm text-gray-400">Brand, Tech, Investor...</p>
                            </div>
                        </Card>
                    </div>
                    {data.userType && renderContinue()}
                </div>
            );
        }

        // STEP 2: CONTEXT
        if (step === 2) {
             if (isOther) {
                 return (
                    <div className="max-w-2xl mx-auto pt-10">
                         <h2 className="text-3xl font-bold mb-8">What brings you here?</h2>
                         {renderMultiSelect(OTHER_ROLES, data.otherRoles || [], 'otherRoles')}
                         {renderContinue()}
                    </div>
                 )
             }
             return (
                <div className="max-w-2xl mx-auto pt-10 space-y-8">
                     <h2 className="text-3xl font-bold mb-8">Let's get some context</h2>
                     <div>
                         <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">
                             {isViewer ? 'How often do you watch?' : 'How often do you stream?'}
                         </label>
                         <div className="grid grid-cols-3 gap-4">
                             {['Daily', 'Weekly', 'Occasionally'].map(opt => (
                                 <button 
                                     key={opt}
                                     onClick={() => updateData('streamFreq', opt)}
                                     className={`p-4 rounded-xl border ${data.streamFreq === opt ? 'bg-violet-600 border-violet-600' : 'border-white/10 hover:bg-white/5'}`}
                                 >
                                     {opt}
                                 </button>
                             ))}
                         </div>
                     </div>
                     <div>
                         <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">
                             {isViewer ? 'Who do you usually watch?' : 'Average Viewers (CCV)'}
                         </label>
                         <div className="grid grid-cols-4 gap-4">
                             {(isViewer ? ['Small (<100)', 'Mid (100-1k)', 'Large (1k+)', 'Mixed'] : ['0-10', '10-50', '50-200', '200+']).map(opt => (
                                 <button 
                                     key={opt}
                                     onClick={() => updateData('viewerCount', opt)}
                                     className={`p-4 rounded-xl border text-sm ${data.viewerCount === opt ? 'bg-violet-600 border-violet-600' : 'border-white/10 hover:bg-white/5'}`}
                                 >
                                     {opt}
                                 </button>
                             ))}
                         </div>
                     </div>
                     {renderContinue( !data.streamFreq || !data.viewerCount )}
                </div>
             );
        }

        // STEP 3: PROBLEMS / INTERESTS
        if (step === 3) {
            if (isOther) {
                return (
                    <div className="max-w-2xl mx-auto pt-10">
                        <h2 className="text-3xl font-bold mb-8">What are your main interests?</h2>
                        {renderMultiSelect(OTHER_INTERESTS, data.initialInterest || [], 'initialInterest')}
                        {renderContinue()}
                    </div>
                )
            }
            const options = isViewer ? VIEWER_PROBLEM_OPTIONS : STREAMER_PROBLEM_OPTIONS;
            return (
                <div className="max-w-3xl mx-auto pt-10">
                    <h2 className="text-3xl font-bold mb-8">What frustrates you most?</h2>
                    <p className="text-gray-400 mb-6">Select up to 3.</p>
                    <div className="grid md:grid-cols-2 gap-4">
                        {options.map((opt) => {
                             const isSelected = data.problemRank?.includes(opt.id);
                             return (
                                <div 
                                    key={opt.id}
                                    onClick={() => {
                                        const current = data.problemRank || [];
                                        if (isSelected) updateData('problemRank', current.filter(id => id !== opt.id));
                                        else if (current.length < 3) updateData('problemRank', [...current, opt.id]);
                                    }}
                                    className={`p-4 rounded-xl border cursor-pointer flex items-center gap-4 transition-all ${isSelected ? 'bg-violet-900/20 border-violet-500 shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                >
                                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-violet-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                                        {opt.icon}
                                    </div>
                                    <span className="font-medium">{opt.label}</span>
                                </div>
                             )
                        })}
                    </div>
                    {renderContinue((data.problemRank?.length || 0) === 0)}
                </div>
            );
        }

        // STEP 4: PRICING PREFERENCE
        if (step === 4) {
            if (isOther) return renderContinue(); // Skip for Other
            
            const groups = isViewer ? VIEWER_PRICING_GROUPS : STREAMER_PRICING_GROUPS;
            return (
                <div className="max-w-5xl mx-auto pt-10">
                    <h2 className="text-3xl font-bold mb-4 text-center">How would you prefer to access Streamyst?</h2>
                    <p className="text-gray-400 text-center mb-10 max-w-xl mx-auto">We're exploring different models. Be honest.</p>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        {groups.map((group, idx) => (
                            <div key={idx} className="space-y-4">
                                <h3 className="font-bold text-violet-300 text-sm uppercase tracking-wider mb-2">{group.title}</h3>
                                {group.options.map(opt => (
                                    <Card 
                                        key={opt.id} 
                                        selected={data.pricingModel === opt.id}
                                        onClick={() => updateData('pricingModel', opt.id)}
                                        className="h-full"
                                    >
                                        <h4 className="font-bold text-lg mb-2">{opt.title}</h4>
                                        <p className="text-sm text-gray-400 mb-4 leading-relaxed">{opt.desc}</p>
                                        <ul className="text-xs space-y-1 text-gray-500 border-t border-white/5 pt-3">
                                            {opt.features.map((f, i) => <li key={i}>• {f}</li>)}
                                        </ul>
                                    </Card>
                                ))}
                            </div>
                        ))}
                    </div>
                    {data.pricingModel && renderContinue()}
                </div>
            )
        }

        // STEP 5: FRICTION
        if (step === 5) {
             if (isOther) return renderContinue();
             const options = isViewer ? VIEWER_FRICTION_OPTIONS : STREAMER_FRICTION_OPTIONS;
             return (
                 <div className="max-w-2xl mx-auto pt-10">
                     <h2 className="text-3xl font-bold mb-8">What would stop you from using this?</h2>
                     {renderMultiSelect(options, data.frictionPoints || [], 'frictionPoints')}
                     {renderContinue()}
                 </div>
             )
        }

        // STEP 6: EMAIL / FINAL
        if (step === 6) {
             return (
                <div className="max-w-xl mx-auto pt-10 text-center">
                    <Mascot src={MASCOT_1} className="-left-20 top-0 w-40 opacity-50" delay={0} />
                    <h2 className="text-3xl font-bold mb-4">Stay in the loop?</h2>
                    <p className="text-gray-400 mb-8">We'll invite you to the closed Alpha when it's ready.</p>
                    
                    <input 
                        type="email"
                        value={data.email}
                        onChange={(e) => updateData('email', e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-[#1A1830] border border-white/10 rounded-xl px-6 py-4 text-white text-lg placeholder-gray-500 focus:border-violet-500 outline-none mb-4 text-center"
                    />
                    <p className="text-xs text-gray-600 mb-8">No spam. We promise.</p>
                    {renderContinue(!data.email)}
                </div>
             );
        }

        // STEP 7: THANK YOU
        if (step === 7 || (isOther && step >= 4)) {
             return (
                <div className="max-w-2xl mx-auto pt-20 text-center">
                    <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20"
                    >
                        <Check size={48} className="text-white" />
                    </motion.div>
                    <h2 className="text-4xl font-bold mb-4">Thank You!</h2>
                    <p className="text-gray-400 mb-12 text-lg">Your feedback helps us build a better future for streaming.</p>
                    <button onClick={onExit} className="px-10 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
                        Return to Home
                    </button>
                </div>
             )
        }

        return (
             <div className="flex flex-col items-center justify-center pt-20">
                 <Loader2 className="w-10 h-10 animate-spin text-violet-500 mb-4" />
                 <p>Loading...</p>
             </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030205] text-white p-6 pb-20 relative overflow-hidden flex flex-col">
             {/* Progress Bar */}
             <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
                <motion.div 
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
             </div>

             {/* Header */}
             <div className="flex justify-between items-center relative z-40 mb-8">
                 <button onClick={step > 0 ? prevStep : onExit} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                     {step > 0 ? <ArrowLeft /> : <X />}
                 </button>
                 <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                    {step > 0 && `Step ${step} / ${totalSteps}`}
                 </div>
                 <div className="w-10" /> {/* Spacer */}
             </div>

             {/* Main Content Area */}
             <div className="flex-1 flex flex-col justify-center relative z-30">
                 <AnimatePresence mode="wait">
                     <motion.div
                        key={step}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-full"
                     >
                        {renderStep()}
                     </motion.div>
                 </AnimatePresence>
             </div>

             {/* Exit Modal */}
             <AnimatePresence>
                {showExitModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0A0A0B] border border-white/10 p-8 rounded-2xl max-w-md w-full text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-indigo-500" />
                            <h3 className="text-2xl font-bold mb-4">Before you go...</h3>
                            <p className="text-gray-400 mb-8">Your feedback is crucial for us. It only takes a minute to finish.</p>
                            <div className="flex gap-4 justify-center">
                                <button onClick={onExit} className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 text-gray-400 text-sm">Leave</button>
                                <button onClick={() => setShowExitModal(false)} className="px-6 py-2 rounded-full bg-white text-black font-bold text-sm hover:scale-105 transition-transform">Continue Survey</button>
                            </div>
                        </motion.div>
                    </div>
                )}
             </AnimatePresence>
        </div>
    );
};

export default SurveyPage;
