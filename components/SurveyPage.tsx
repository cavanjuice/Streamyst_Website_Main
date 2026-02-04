
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
import { saveSurveyResponse, getAssetUrl, trackEvent } from '../utils/supabaseClient';

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
    // Other / Professional Flow Fields
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
    // New Friction Field
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
        features: ['Free core features', 'Paid visual and experience upgrades (€9,99–14,99 / month)']
    },
    {
        id: 'brand_supported',
        title: 'Brand Supported',
        desc: 'I want me and my audiences to use the features of streamyst for free, but it will be watermarked with brands every so often.',
        features: ['Free interactive experience with branded ads woven into', 'Create branded overlay presets']
    },
    {
        id: 'creator_sub',
        title: 'Creator Subscription',
        desc: 'I want full access to all digital overlays, customization, and updates, no hardware required.',
        features: ['Customizable overlays and experiences', '€14,99 / month']
    },
    {
        id: 'community_growth',
        title: 'Community-Supported Growth',
        desc: 'I want my community to help unlock Streamyst features together.',
        features: ['Free base experience', 'Monthly goal-based upgrades (hardware/software)']
    },
    {
        id: 'hardware_first',
        title: 'Hardware-First Creator',
        desc: 'I want to feel the digital experience myself, for better immersion, interaction with my audience and makes me emotionally more connected!',
        features: ['€150 device + free core features', '€9,99 / month digital custom service']
    },
    {
        id: 'affiliate_hardware',
        title: 'Affiliate Hardware Program',
        desc: 'I like earning hardware through engagement rather than paying upfront',
        features: ['Reach +/- 500 unique extention interactions through digital overlays', 'Device discounted at €50 instead of €150']
    },
    {
        id: 'all_in',
        title: 'All-In Creator',
        desc: 'I want to own Streamyst outright with no monthly fees.',
        features: ['€349 one-time for both hardware and service', 'Lifetime digital overlays + continuous support']
    }
];

const VIEWER_PRICING_MODELS = [
    {
        id: 'community_goal',
        title: 'Community Goal Contributions',
        desc: 'I like contributing small amounts together with others to unlock Streamyst features.',
        features: ['€1–€3 micro-contributions', 'Visible collective achievement']
    },
    {
        id: 'interaction_boosts',
        title: 'Interaction Boosts',
        desc: 'I’d pay occasionally to trigger special interactions or effects during streams.',
        features: ['One-time boosts (Similar to bits)', 'Visual + physical responses']
    },
    {
        id: 'monthly_supporter',
        title: 'Monthly Supporter Tier',
        desc: 'I’d support Streamyst’s service as part of my monthly support for a streamer.',
        features: ['€3–€5 / month', 'Receive exclusive interactions with streamer overlays']
    },
    {
        id: 'hardware_unlock',
        title: 'Hardware Unlock Campaign',
        desc: 'I’d help save up to unlock the physical Streamyst device for a streamer I love.',
        features: ['Small donations throughout streams', 'Community milestones!']
    },
    {
        id: 'no_pay',
        title: 'I wouldn’t pay for this',
        desc: 'I prefer watching without spending money.',
        features: []
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
        // Other Flow Defaults
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

    // Initial load tracking
    useEffect(() => {
        trackEvent('survey_view');
    }, []);

    // Track step changes
    useEffect(() => {
        if (step > 0) {
            trackEvent('survey_step_view', { step, totalSteps: totalSteps, userType: data.userType });
        }
    }, [step]);

    // Flow Logic
    const isViewer = data.userType === 'viewer';
    const isOther = data.userType === 'other';
    // Standard flow increased by 1 step for friction question
    const totalSteps = isOther ? 17 : 14; // 0-16 for other, 0-13 for standard
    const progress = Math.min(100, (step / totalSteps) * 100);

    // --- LOGIC ---

    const submitData = async () => {
        const { error } = await saveSurveyResponse(data);
        if (error) console.error("Error saving survey:", error);
    };

    const nextStep = () => {
        // Validation checks for Standard Flow
        if (!isOther) {
            if (step === 4 && data.problemRank?.length !== 3) return; // Must rank 3
            if (step === 8 && (data.desiredFeatures?.length || 0) !== 2) return; // Must pick 2
        }

        // TRIGGER SAVE ON FINAL STEP TRANSITION
        // Standard Flow ends at step 12 (Friction) -> Next is 13 (Exit)
        // Other Flow ends at step 15 (Anything else) -> Next is 16 (Exit)
        if ((!isOther && step === 12) || (isOther && step === 15)) {
            if (!hasAgreedToTerms) return; // Explicit check, though button should be disabled
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
    };

    const toggleArrayItem = (key: 'attemptedSolutions' | 'desiredFeatures' | 'otherRoles' | 'otherContexts' | 'initialInterest' | 'concerns' | 'collaborationInterest' | 'frictionPoints', value: string) => {
        const current = data[key] || [];
        if (current.includes(value)) {
            updateData(key, current.filter(i => i !== value));
        } else {
            // Logic for max selection for standard features
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

    // --- ANIMATION COMPONENTS ---

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

    // Updated renderContinue to accept an optional pre-check logic or extra validation
    const renderContinue = (disabled = false) => (
        <div className="mt-12 flex justify-end">
            <button 
                onClick={nextStep}
                disabled={disabled}
                className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Continue →
            </button>
        </div>
    );

    // NEW: Render Consent Checkbox
    const renderConsent = () => (
        <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl">
            <div 
                className="flex items-start gap-3 cursor-pointer"
                onClick={() => setHasAgreedToTerms(!hasAgreedToTerms)}
            >
                <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${hasAgreedToTerms ? 'bg-violet-500 border-violet-500' : 'border-gray-500 hover:border-white'}`}>
                    {hasAgreedToTerms && <Check size={14} className="text-white" />}
                </div>
                <p className="text-xs text-gray-400 leading-relaxed select-none">
                    I agree to the Terms of Service regarding Feedback and Privacy. I understand my feedback is provided voluntarily to help build Streamyst.
                </p>
            </div>
        </div>
    );

    // --- STEP CONTENT ---

    const renderStep = () => {
        // --- SHARED STEPS ---
        if (step === 0) { // ENTRY HOOK
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
                            onClick={() => {
                                trackEvent('survey_start_click');
                                nextStep();
                            }}
                            className="group relative px-10 py-5 bg-white text-black font-bold text-lg rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
                        >
                            <span className="relative z-10 flex items-center gap-2">I'm In <ArrowRight size={20} /></span>
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-300 via-indigo-300 to-violet-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                        <p className="mt-6 text-xs text-gray-500 uppercase tracking-widest font-mono mb-12">
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

        if (step === 1) { // IDENTITY
             return (
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-display font-bold text-center mb-12">First things first—which best describes you?</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { id: 'streamer', icon: <MonitorPlay size={32} />, title: "I Create Content", desc: "I stream/broadcast to an audience" },
                            { id: 'viewer', icon: <Eye size={32} />, title: "I Watch Content", desc: "I'm part of streaming communities" },
                            { id: 'other', icon: <Globe size={32} />, title: "Other", desc: "Brand, Developer, Agency, or Curious" }
                        ].map((opt) => (
                            <Card
                                key={opt.id}
                                selected={data.userType === opt.id}
                                onClick={() => {
                                    updateData('userType', opt.id);
                                    setTimeout(nextStep, 300);
                                }}
                                className="flex flex-col items-center text-center py-10"
                            >
                                <div className="mb-6 p-4 bg-white/5 rounded-full text-violet-400">{opt.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{opt.title}</h3>
                                <p className="text-sm text-gray-400">{opt.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            );
        }

        // --- OTHER FLOW (14 Questions) ---
        if (isOther) {
            switch(step) {
                case 2: // Q1 Roles
                    return (
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl font-display font-bold text-center mb-12">Please describe your role(s)</h2>
                            {renderMultiSelect(OTHER_ROLES, data.otherRoles || [], 'otherRoles')}
                            {renderContinue()}
                        </div>
                    );
                case 3: // Q2 Context
                    return (
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl font-display font-bold text-center mb-12">In what context are you interested in livestreaming?</h2>
                            {renderMultiSelect(OTHER_CONTEXTS, data.otherContexts || [], 'otherContexts')}
                            {renderContinue()}
                        </div>
                    );
                case 4: // Q3 Familiarity
                    return (
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-3xl font-display font-bold text-center mb-12">How familiar are you with livestreaming platforms?</h2>
                            {renderScale(data.platformFamiliarity || 5, (n) => updateData('platformFamiliarity', n), "Curious", "Expert")}
                            {renderContinue()}
                        </div>
                    );
                case 5: // Q4 Interest
                    return (
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl font-display font-bold text-center mb-12">What initially caught your interest about Streamyst?</h2>
                            {renderMultiSelect(OTHER_INTERESTS, data.initialInterest || [], 'initialInterest')}
                            {renderContinue()}
                        </div>
                    );
                case 6: // Q5 Missing
                    return (
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-3xl font-display font-bold text-center mb-6">From your perspective, what is currently missing in livestream experiences?</h2>
                            {renderTextArea(data.missingInLivestream, 'missingInLivestream', "Share your thoughts...")}
                            {renderContinue()}
                        </div>
                    );
                case 7: // Q6 Fit
                     return (
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-3xl font-display font-bold text-center mb-2">How do you see Streamyst fitting into your world?</h2>
                            <p className="text-gray-400 text-center mb-8">What potential use cases do you imagine? (e.g. brand campaigns, events, installations, etc.)</p>
                            {renderTextArea(data.streamystFit, 'streamystFit', "Describe potential use cases...")}
                            {renderContinue()}
                        </div>
                    );
                case 8: // Q7 Problem
                    return (
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-3xl font-display font-bold text-center mb-8">What problem would you most want Streamyst to help solve?</h2>
                            <input
                                type="text"
                                value={data.problemToSolve || ''}
                                onChange={(e) => updateData('problemToSolve', e.target.value)}
                                placeholder="Short description of the problem..."
                                className="w-full bg-[#1A1830] border border-white/10 rounded-xl p-5 text-white placeholder-gray-500 focus:border-violet-500 outline-none"
                            />
                            {renderContinue()}
                        </div>
                    );
                case 9: // Q8 Value
                     return (
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-3xl font-display font-bold text-center mb-2">What would make Streamyst truly valuable for you?</h2>
                            <p className="text-gray-400 text-center mb-8">(Features, integrations, scale, customization, data, etc.)</p>
                            {renderTextArea(data.valueDrivers, 'valueDrivers', "What features matter most?")}
                            {renderContinue()}
                        </div>
                    );
                case 10: // Q9 Concerns
                    return (
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl font-display font-bold text-center mb-12">What concerns or frictions do you foresee?</h2>
                            {renderMultiSelect(OTHER_CONCERNS, data.concerns || [], 'concerns')}
                            {renderContinue()}
                        </div>
                    );
                case 11: // Q10 Pricing
                    return (
                         <div className="max-w-2xl mx-auto">
                            <h2 className="text-3xl font-display font-bold text-center mb-12">How would you expect Streamyst to be priced for your use case?</h2>
                            <div className="grid gap-3">
                                {OTHER_PRICING.map((opt) => (
                                     <div 
                                        key={opt}
                                        onClick={() => updateData('pricingExpectation', opt)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${data.pricingExpectation === opt ? 'bg-violet-900/20 border-violet-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                    >
                                        <span className="font-medium">{opt}</span>
                                        {data.pricingExpectation === opt && <div className="w-4 h-4 rounded-full bg-violet-500" />}
                                    </div>
                                ))}
                            </div>
                            {renderContinue()}
                        </div>
                    );
                case 12: // Q11 Interest
                     return (
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-3xl font-display font-bold text-center mb-12">How interested are you in Streamyst?</h2>
                            {renderScale(data.interestLevel || 5, (n) => updateData('interestLevel', n), "Not Interested", "Very Interested")}
                            {renderContinue()}
                        </div>
                    );
                case 13: // Q12 Collab
                    return (
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl font-display font-bold text-center mb-12">Would you be open to collaborating or exploring further?</h2>
                            {renderMultiSelect(OTHER_COLLAB, data.collaborationInterest || [], 'collaborationInterest')}
                            {renderContinue()}
                        </div>
                    );
                case 14: // Q13 Email
                     return (
                        <div className="max-w-xl mx-auto text-center">
                            <h2 className="text-3xl font-display font-bold mb-6">
                                Leave your email (optional)
                            </h2>
                            <p className="text-gray-400 mb-8">
                                We’ll only reach out if it’s relevant to your interest.
                            </p>
                            
                            <input 
                                type="email" 
                                placeholder="yourname@email.com"
                                value={data.email || ''}
                                onChange={(e) => updateData('email', e.target.value)}
                                className="w-full bg-[#1A1830] border border-white/20 rounded-xl p-5 text-xl text-center text-white focus:border-violet-500 outline-none mb-6 placeholder-gray-600 font-mono"
                            />
                            
                            {renderContinue()}
                        </div>
                    );
                case 15: // Q14 Anything Else + MANDATORY CONSENT
                     return (
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-3xl font-display font-bold text-center mb-2">Anything else you’d like to share?</h2>
                            <p className="text-gray-400 text-center mb-8">Ideas, questions, concerns, wild concepts, we’d love to hear them.</p>
                            {renderTextArea(data.anythingElse, 'anythingElse', "Open floor...")}
                            
                            {renderConsent()}
                            {renderContinue(!hasAgreedToTerms)}
                        </div>
                    );
                case 16: // EXIT
                    return renderExit();
                default:
                    return null;
            }
        }

        // --- STANDARD FLOW (Viewer/Streamer) ---
        // Remapping step numbers because 'Other' flow has pushed indices if handled linearly, 
        // but here we are in a branched render.
        // Step 0 & 1 are shared.
        // Viewer/Streamer flow is steps 2-12.
        
        switch (step) {
            case 2: // QUALIFICATION
                if (isViewer) {
                    return (
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-3xl font-display font-bold text-center mb-12">Tell us about your viewing habits</h2>
                            
                            <div className="mb-12">
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Hours per week watching streams?</label>
                                <div className="flex items-center gap-4">
                                    <span className="font-mono text-violet-400 text-xl w-12 text-right">{data.hoursWatched || 0}</span>
                                    <input 
                                        type="range" 
                                        min="0" max="60" 
                                        value={data.hoursWatched || 0} 
                                        onChange={(e) => updateData('hoursWatched', parseInt(e.target.value))}
                                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                                    />
                                    <span className="text-gray-500">40+</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">How do you interact?</label>
                                {['I chat actively', 'I lurk but sometimes interact', 'I mostly just watch', 'I never interact'].map((opt) => (
                                    <div 
                                        key={opt}
                                        onClick={() => updateData('interactionStyle', opt)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${data.interactionStyle === opt ? 'bg-violet-900/20 border-violet-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${data.interactionStyle === opt ? 'border-violet-500' : 'border-gray-500'}`}>
                                            {data.interactionStyle === opt && <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />}
                                        </div>
                                        <span>{opt}</span>
                                    </div>
                                ))}
                            </div>
                            {renderContinue()}
                        </div>
                    )
                }
                return (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl font-display font-bold text-center mb-12">Tell us about your stream</h2>
                        
                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">How often do you stream?</label>
                                <select 
                                    className="w-full bg-[#1A1830] border border-white/10 rounded-xl p-4 text-white focus:border-violet-500 outline-none"
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
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Typical viewer count?</label>
                                <select 
                                    className="w-full bg-[#1A1830] border border-white/10 rounded-xl p-4 text-white focus:border-violet-500 outline-none"
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

                        <div className="mt-12 flex justify-end">
                            <button 
                                onClick={nextStep} 
                                disabled={!data.streamFreq || !data.viewerCount}
                                className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue →
                            </button>
                        </div>
                    </div>
                );

            case 3: // EMAIL
                return (
                    <div className="max-w-xl mx-auto text-center">
                        <h2 className="text-3xl font-display font-bold mb-6">
                            {initialEmail ? "Just to confirm—is this email correct?" : "Quick—we'll need your email to send you early access"}
                        </h2>
                        <p className="text-gray-400 mb-8">
                             {initialEmail ? "We grabbed this from your waitlist entry. We want to make sure your invite lands safely." : "We're building in public. We'll send you beta invites first."}
                        </p>
                        
                        <input 
                            type="email" 
                            placeholder="yourname@email.com"
                            value={data.email || ''}
                            onChange={(e) => updateData('email', e.target.value)}
                            className="w-full bg-[#1A1830] border border-white/20 rounded-xl p-5 text-xl text-center text-white focus:border-violet-500 outline-none mb-6 placeholder-gray-600 font-mono"
                        />
                        
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-10">
                            <Check size={16} className="text-violet-500" />
                            <span>We promise not to spam you. Ever.</span>
                        </div>

                        <button 
                            onClick={nextStep}
                            disabled={!data.email?.includes('@')}
                            className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl font-bold text-white shadow-lg hover:shadow-violet-500/20 transition-all disabled:opacity-50"
                        >
                            {initialEmail ? "Yes, that's me →" : "Lock In Access →"}
                        </button>
                    </div>
                );

            case 4: // PROBLEM RANKING (DRAG DROP)
                const problemOptions = isViewer ? VIEWER_PROBLEM_OPTIONS : STREAMER_PROBLEM_OPTIONS;

                return (
                    <div className="max-w-4xl mx-auto relative">
                        {/* Mascot Peek */}
                        <Mascot src={MASCOT_1} className="-top-24 right-10 w-40" delay={0.3} />
                        
                        <div className="text-center mb-8 relative z-10">
                            <h2 className="text-3xl font-display font-bold mb-2">
                                {isViewer ? "What frustrates you most as a viewer?" : "Rank your TOP 3 streaming challenges"}
                            </h2>
                            <p className="text-gray-400">Drag items from the list below into your top 3 slots.</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 relative z-10">
                            {/* Selected Slots */}
                            <div className="md:w-1/2 space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4">Your Top 3 Priorities</h3>
                                {[0, 1, 2].map((index) => {
                                    const item = data.problemRank ? data.problemRank[index] : null;
                                    const itemDetails = item ? problemOptions.find(p => p.id === item) : null;

                                    return (
                                        <div 
                                            key={index} 
                                            className={`h-20 rounded-xl border-2 border-dashed flex items-center px-4 relative transition-colors ${item ? 'border-violet-500 bg-violet-900/10 border-solid' : 'border-white/10 bg-white/5'}`}
                                        >
                                            <div className="absolute left-4 font-display font-bold text-4xl text-white/10 pointer-events-none">{index + 1}</div>
                                            {itemDetails ? (
                                                <div className="flex items-center justify-between w-full pl-8">
                                                    <div className="flex items-center gap-3">
                                                        {itemDetails.icon}
                                                        <span className="font-bold text-sm leading-tight">{itemDetails.label}</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => updateData('problemRank', data.problemRank?.filter(id => id !== item))}
                                                        className="p-1 hover:bg-white/10 rounded-full shrink-0"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="w-full text-center text-sm text-gray-500 pl-8">Select from list →</span>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Available Options */}
                            <div className="md:w-1/2">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Available Challenges</h3>
                                <div className="space-y-2 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {problemOptions.filter(opt => !data.problemRank?.includes(opt.id)).map(opt => (
                                        <motion.div
                                            key={opt.id}
                                            layoutId={opt.id}
                                            onClick={() => {
                                                if ((data.problemRank?.length || 0) < 3) {
                                                    updateData('problemRank', [...(data.problemRank || []), opt.id]);
                                                }
                                            }}
                                            className="p-4 bg-[#1A1830] border border-white/5 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors group"
                                        >
                                            <div className="text-gray-500 group-hover:text-white transition-colors">{opt.icon}</div>
                                            <span className="text-sm">{opt.label}</span>
                                            <div className="ml-auto opacity-0 group-hover:opacity-100 text-violet-400">
                                                <ArrowLeft size={16} />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end relative z-10">
                            <button 
                                onClick={nextStep}
                                disabled={(data.problemRank?.length || 0) !== 3}
                                className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform disabled:opacity-50"
                            >
                                Continue →
                            </button>
                        </div>
                    </div>
                );

            case 5: // PAIN INTENSITY
                const currentProblemList = isViewer ? VIEWER_PROBLEM_OPTIONS : STREAMER_PROBLEM_OPTIONS;
                const problemLabel = currentProblemList.find(p => p.id === (data.problemRank?.[0]))?.label || "Your top challenge";

                return (
                    <div className="max-w-2xl mx-auto text-center relative">
                        <Mascot src={MASCOT_2} className="-left-32 bottom-0 w-48 opacity-60" delay={0.4} />
                        <div className="relative z-10">
                            <h2 className="text-3xl font-display font-bold mb-4">How painful is your #1 challenge?</h2>
                            <div className="bg-white/5 p-4 rounded-xl inline-block mb-12 text-violet-300">
                                {problemLabel}
                            </div>
                            {renderScale(data.painIntensity || 5, (n) => updateData('painIntensity', n), "Minor Annoyance", "Considering Quitting")}
                            {renderContinue()}
                        </div>
                    </div>
                );

            case 6: // ATTEMPTED SOLUTIONS
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
                        <h2 className="text-3xl font-display font-bold text-center mb-12">Have you tried to improve this before?</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {attemptOptions.map((sol) => (
                                <div 
                                    key={sol}
                                    onClick={() => toggleArrayItem('attemptedSolutions', sol)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${data.attemptedSolutions?.includes(sol) ? 'bg-violet-900/20 border-violet-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                >
                                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center ${data.attemptedSolutions?.includes(sol) ? 'border-violet-500 bg-violet-500' : 'border-gray-500'}`}>
                                        {data.attemptedSolutions?.includes(sol) && <Check size={14} className="text-white" />}
                                    </div>
                                    <span>{sol}</span>
                                </div>
                            ))}
                        </div>
                        {renderContinue()}
                    </div>
                );

            case 7: // SOLUTION PREFERENCE
                const solutionOptions = isViewer
                    ? [
                        { id: 'interaction', icon: <Zap size={32} />, title: "Better Interaction", desc: "Tools to affect the stream directly" },
                        { id: 'recognition', icon: <Crown size={32} />, title: "Recognition", desc: "Ways to stand out without paying" },
                        { id: 'xr', icon: <Heart size={32} />, title: "Ambient Connection", desc: "Wearable tech to FEEL the stream vibe", highlight: true },
                        { id: 'content', icon: <PlayCircle size={32} />, title: "Better Content", desc: "Higher quality streams" },
                        { id: 'community', icon: <Users size={32} />, title: "Community Tools", desc: "Easier ways to make friends" }
                      ]
                    : [
                        { id: 'analytics', icon: <Activity size={32} />, title: "Better Analytics", desc: "Deeper insights into chat & behavior" },
                        { id: 'ai', icon: <Cpu size={32} />, title: "AI Moderation", desc: "Smarter bots to filter spam & highlight VIPs" },
                        { id: 'xr', icon: <Zap size={32} />, title: "Ambient Awareness", desc: "Wearable tech to FEEL audience emotion without reading chat", highlight: true },
                        { id: 'gamification', icon: <PlayCircle size={32} />, title: "Interaction Tools", desc: "More polls, predictions & mini-games" },
                        { id: 'other', icon: <MessageSquare size={32} />, title: "Something Else", desc: "I have a different idea..." }
                      ];

                return (
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-display font-bold text-center mb-4">If you could choose ONE way to improve connection?</h2>
                        <p className="text-gray-400 text-center mb-12">Which of these sounds most like magic to you?</p>

                        <div className="grid md:grid-cols-3 gap-6">
                            {solutionOptions.map((opt) => (
                                <Card
                                    key={opt.id}
                                    selected={data.solutionPreference === opt.id}
                                    onClick={() => updateData('solutionPreference', opt.id)}
                                    className={`flex flex-col items-center text-center h-full ${opt.highlight ? 'md:col-span-1 md:row-span-1 ring-2 ring-violet-500/50' : ''}`}
                                >
                                    <div className={`mb-4 p-4 rounded-full ${opt.highlight ? 'bg-violet-500/20 text-violet-400' : 'bg-white/5 text-gray-400'}`}>
                                        {opt.icon}
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{opt.title}</h3>
                                    <p className="text-sm text-gray-400">{opt.desc}</p>
                                    {opt.highlight && <div className="mt-4 px-2 py-1 bg-violet-500/10 rounded text-[10px] font-bold text-violet-400 uppercase tracking-widest">Streamyst Approach</div>}
                                </Card>
                            ))}
                        </div>
                        <div className="mt-12 flex justify-end">
                            <button 
                                onClick={nextStep}
                                disabled={!data.solutionPreference}
                                className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform disabled:opacity-50"
                            >
                                Continue →
                            </button>
                        </div>
                    </div>
                );

            case 8: // FEATURE DESIRABILITY
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
                        <div className="text-center mb-12 relative z-10">
                            <h2 className="text-3xl font-display font-bold mb-2">Which features excite you most?</h2>
                            <p className="text-violet-400 font-bold uppercase tracking-widest text-sm">Pick your top 2</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 relative z-10">
                            {featureOptions.map((feat) => (
                                <div 
                                    key={feat}
                                    onClick={() => toggleArrayItem('desiredFeatures', feat)}
                                    className={`
                                        p-6 rounded-xl border cursor-pointer transition-all flex items-start gap-4
                                        ${data.desiredFeatures?.includes(feat) 
                                            ? 'bg-violet-900/20 border-violet-500' 
                                            : (data.desiredFeatures?.length || 0) >= 2 
                                                ? 'opacity-50 cursor-not-allowed bg-white/5 border-white/5' 
                                                : 'bg-white/5 border-white/10 hover:bg-white/10'}
                                    `}
                                >
                                    <div className={`mt-0.5 w-6 h-6 rounded border flex items-center justify-center shrink-0 ${data.desiredFeatures?.includes(feat) ? 'border-violet-500 bg-violet-500' : 'border-gray-500'}`}>
                                        {data.desiredFeatures?.includes(feat) && <Check size={16} className="text-white" />}
                                    </div>
                                    <span className="font-medium text-lg">{feat}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 flex justify-end relative z-10">
                            <button 
                                onClick={nextStep}
                                disabled={(data.desiredFeatures?.length || 0) !== 2}
                                className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform disabled:opacity-50"
                            >
                                Continue →
                            </button>
                        </div>
                    </div>
                );

            case 9: // PURCHASE INTENT
                return (
                    <div className="max-w-xl mx-auto text-center relative">
                        <Mascot src={MASCOT_2} className="-right-24 bottom-10 w-40 opacity-80" delay={0.4} />
                        <div className="relative z-10">
                            <h2 className="text-3xl font-display font-bold mb-12">How interested are you in Streamyst?</h2>
                            
                            <div className="space-y-4">
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
                                        className={`w-full p-4 rounded-xl border bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center ${opt.glow} hover:scale-102`}
                                    >
                                        <span className="font-bold text-lg mb-1">{opt.label}</span>
                                        <span className="text-xs text-gray-400 uppercase tracking-widest">{opt.sub}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 10: // PRICING (Van Westendorp)
                return (
                    <div className="max-w-3xl mx-auto">
                         <h2 className="text-3xl font-display font-bold text-center mb-4">Let's talk pricing for a moment...</h2>
                         <p className="text-gray-400 text-center mb-12 max-w-lg mx-auto">There are no wrong answers here. We want to know what feels fair to you for the monthly software subscription.</p>

                         <div className="space-y-12">
                             {[
                                 { key: 'priceCheap', label: "At what price is it a GREAT DEAL?", color: "text-green-400" },
                                 { key: 'priceExpensive', label: "At what price is it EXPENSIVE but worth it?", color: "text-yellow-400" },
                                 { key: 'priceTooExpensive', label: "At what price is it TOO EXPENSIVE?", color: "text-red-400" },
                             ].map((q) => (
                                 <div key={q.key}>
                                     <div className="flex justify-between items-end mb-4">
                                        <label className={`font-bold uppercase tracking-widest text-sm ${q.color}`}>{q.label}</label>
                                        <span className="font-mono text-2xl font-bold">€{(data as any)[q.key]}/mo</span>
                                     </div>
                                     <input 
                                        type="range" 
                                        min="0" max="100" step="1"
                                        value={(data as any)[q.key]}
                                        onChange={(e) => updateData(q.key as keyof SurveyData, parseInt(e.target.value))}
                                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                                     />
                                     <div className="flex justify-between text-xs text-gray-600 mt-2 font-mono">
                                         <span>€0</span>
                                         <span>€50</span>
                                         <span>€100+</span>
                                     </div>
                                 </div>
                             ))}
                         </div>
                         <div className="mt-12 flex justify-end">
                             <button onClick={nextStep} className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">Continue →</button>
                         </div>
                    </div>
                );

            case 11: // PAYMENT MODEL - REVISED
                const pricingOptions = isViewer ? VIEWER_PRICING_MODELS : STREAMER_PRICING_MODELS;
                const question = isViewer 
                    ? "If Streamyst launches to make your favorite streamer’s content more interactive and meaningful, how would you prefer to support it?"
                    : "If Streamyst becomes part of your regular stream. Which way would you most want to access it?";

                return (
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12 max-w-4xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">{question}</h2>
                            <p className="text-gray-400">Select the model that fits you best.</p>
                        </div>
                        
                        <div className={`grid gap-6 ${isViewer ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                            {pricingOptions.map((opt) => (
                                <Card
                                    key={opt.id}
                                    selected={data.pricingModel === opt.id}
                                    onClick={() => {
                                        updateData('pricingModel', opt.id);
                                    }}
                                    className="flex flex-col text-left h-full"
                                >
                                    <h3 className="text-lg font-bold text-white mb-3 leading-tight">{opt.title}</h3>
                                    <p className="text-xs text-gray-400 mb-6 leading-relaxed flex-grow">{opt.desc}</p>
                                    
                                    {opt.features.length > 0 && (
                                        <ul className="space-y-3 mt-auto border-t border-white/5 pt-4">
                                            {opt.features.map((feat, i) => (
                                                <li key={i} className="text-[11px] text-violet-200 flex items-start gap-2 leading-snug">
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

            case 12: // NEW FRICTION QUESTION + MANDATORY CONSENT
                const frictionOptions = isViewer ? VIEWER_FRICTION_OPTIONS : STREAMER_FRICTION_OPTIONS;
                return (
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-display font-bold text-center mb-12">
                            {isViewer ? "What would stop you from supporting Streamyst?" : "What would most stop you from trying Streamyst?"}
                        </h2>
                        {renderMultiSelect(frictionOptions, data.frictionPoints || [], 'frictionPoints')}
                        
                        {renderConsent()}
                        {renderContinue(!hasAgreedToTerms)}
                    </div>
                );
            
            case 13: // EXIT
                return renderExit();

            default:
                return null;
        }
    };

    const renderExit = () => (
        <div className="max-w-2xl mx-auto text-center pt-10 relative">
                <Mascot src={MASCOT_2} className="-left-40 bottom-20 w-56 opacity-80" delay={0.3} />
                <Mascot src={MASCOT_3} className="-right-40 bottom-20 w-56 opacity-80" delay={0.6} />

                <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8 relative z-10"
                >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500/20 rounded-full blur-[80px]" />
                <div className="w-24 h-24 bg-gradient-to-tr from-violet-400 to-indigo-500 rounded-full mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.5)]">
                    <Check size={48} className="text-white" />
                </div>
                </motion.div>
                
                <h1 className="font-display font-bold text-5xl mb-6 relative z-10">YOU'RE IN. 🚀</h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed relative z-10">
                Thank you for helping us build the future of streaming.
                <br/>
                <span className="text-violet-400 font-bold">You've been added to the priority alpha list.</span>
                </p>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12 relative z-10">
                <h3 className="font-bold text-lg mb-4">What happens next?</h3>
                <ul className="text-left space-y-4 text-gray-400">
                    <li className="flex items-center gap-3">
                        <Check size={16} className="text-green-400" />
                        We analyze the data to refine the Vybe hardware.
                    </li>
                    <li className="flex items-center gap-3">
                        <Check size={16} className="text-green-400" />
                        You'll receive a personal invite when Beta opens.
                    </li>
                    <li className="flex items-center gap-3">
                        <Check size={16} className="text-green-400" />
                        Founders pricing locked in for your account.
                    </li>
                </ul>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center relative z-10">
                <button className="px-8 py-3 bg-[#5865F2] text-white font-bold rounded-full hover:bg-[#4752C4] transition-colors flex items-center justify-center gap-2">
                    <MessageSquare size={20} /> Join Discord
                </button>
                <button onClick={onExit} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-colors">
                    Return to Site
                </button>
                </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-cosmic-950 text-white pb-20 pt-24 px-6 font-body">
            
            {/* PROGRESS BAR */}
            <div className="fixed top-0 left-0 w-full h-2 bg-white/5 z-50">
                <motion.div 
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 shadow-[0_0_20px_rgba(139,92,246,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {/* HEADER INFO & NAVIGATION */}
            {step > 0 && step < (totalSteps - 1) && (
                <>
                    <button 
                        onClick={prevStep}
                        className="fixed top-8 left-6 z-50 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="fixed top-6 right-6 z-40 flex items-center gap-4 text-xs font-mono text-gray-500 uppercase tracking-widest">
                        <span>Survey In Progress</span>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="hidden md:inline">~{Math.max(1, 3 - Math.floor(step * 0.25))} mins left</span>
                    </div>
                </>
            )}

            {/* MAIN CONTENT AREA */}
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

            {/* EXIT INTENT MODAL */}
            <AnimatePresence>
                {showExitModal && (
                    <div className="fixed inset-0 bg-[#030205]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-[#0A0A0B] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
                        >
                            {/* Decorative Glow */}
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

                                {/* Progress Bar in Modal */}
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

            {/* BACKGROUND ELEMENTS */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,transparent_70%)]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-900/10 blur-[120px]" />
            </div>
        </div>
    );
};

export default SurveyPage;
