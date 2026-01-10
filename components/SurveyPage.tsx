
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
    ChevronRight, Check, X, ArrowLeft, ArrowRight, Send, 
    MonitorPlay, Eye, Users, Clock, MessageSquare, 
    Activity, DollarSign, Lightbulb, Wifi, Shield, 
    Cpu, Zap, GripVertical, AlertCircle, PlayCircle 
} from 'lucide-react';

// --- TYPES ---

type UserType = 'streamer' | 'viewer' | 'both' | null;

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
}

// --- CONSTANTS ---

const PROBLEM_OPTIONS = [
    { id: 'engagement', label: 'Audience engagement / connection', icon: <Users size={18} /> },
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

const SurveyPage: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [step, setStep] = useState(0);
    const [data, setData] = useState<Partial<SurveyData>>({
        problemRank: [],
        attemptedSolutions: [],
        desiredFeatures: [],
        painIntensity: 5,
        priceCheap: 5,
        priceExpensive: 15,
        priceTooExpensive: 30,
        priceTooCheap: 2,
    });
    const [showExitModal, setShowExitModal] = useState(false);
    const [rankingItems, setRankingItems] = useState(PROBLEM_OPTIONS);

    // Calculate progress
    const totalSteps = 13;
    const progress = Math.min(100, (step / totalSteps) * 100);

    // --- LOGIC ---

    const nextStep = () => {
        // Validation checks
        if (step === 4 && data.problemRank?.length !== 3) return; // Must rank 3
        if (step === 8 && (data.desiredFeatures?.length || 0) !== 2) return; // Must pick 2

        setStep(prev => prev + 1);
        window.scrollTo(0, 0);
    };

    const updateData = (key: keyof SurveyData, value: any) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const toggleArrayItem = (key: 'attemptedSolutions' | 'desiredFeatures', value: string) => {
        const current = data[key] || [];
        if (current.includes(value)) {
            updateData(key, current.filter(i => i !== value));
        } else {
            // Logic for max selection
            if (key === 'desiredFeatures' && current.length >= 2) return;
            updateData(key, [...current, value]);
        }
    };

    // Exit Intent Logic
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (step > 1 && step < 13) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [step]);

    // --- ANIMATION COMPONENTS ---

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "circOut" } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: "circIn" } }
    };

    // --- STEP CONTENT ---

    const renderStep = () => {
        switch (step) {
            case 0: // ENTRY HOOK
                return (
                    <div className="text-center max-w-2xl mx-auto pt-10">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-900/20 text-violet-400 font-mono text-xs tracking-widest uppercase animate-pulse">
                                Transmission Incoming
                            </div>
                            <h1 className="font-display font-bold text-5xl md:text-7xl mb-8 leading-tight">
                                Help Us Build The <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">Future of Streaming</span>
                            </h1>
                            <p className="text-xl text-gray-400 mb-12 font-light leading-relaxed max-w-lg mx-auto">
                                We're creating something that could change how creators and audiences connect. 
                                <br/><br/>
                                This takes 5 minutes. Your answers could shape what we build.
                            </p>
                            <button
                                onClick={nextStep}
                                className="group relative px-10 py-5 bg-white text-black font-bold text-lg rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
                            >
                                <span className="relative z-10 flex items-center gap-2">I'm In <ArrowRight size={20} /></span>
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-300 via-indigo-300 to-violet-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                            <p className="mt-6 text-xs text-gray-500 uppercase tracking-widest font-mono">
                                + Early Access Perks Included
                            </p>
                        </motion.div>
                    </div>
                );

            case 1: // IDENTITY
                return (
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-display font-bold text-center mb-12">First things first—which best describes you?</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { id: 'streamer', icon: <MonitorPlay size={32} />, title: "I Create Content", desc: "I stream/broadcast to an audience" },
                                { id: 'viewer', icon: <Eye size={32} />, title: "I Watch Content", desc: "I'm part of streaming communities" },
                                { id: 'both', icon: <Zap size={32} />, title: "Both", desc: "I create and consume content" }
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

            case 2: // QUALIFICATION
                if (data.userType === 'viewer') {
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
                            
                            <div className="mt-12 flex justify-end">
                                <button onClick={nextStep} className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">Continue →</button>
                            </div>
                        </div>
                    )
                }
                // Default Streamer View
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
                        <h2 className="text-3xl font-display font-bold mb-6">Quick—we'll need your email to send you early access</h2>
                        <p className="text-gray-400 mb-8">We're building in public. We'll send you beta invites first.</p>
                        
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
                            Lock In Access →
                        </button>
                    </div>
                );

            case 4: // PROBLEM RANKING (DRAG DROP)
                return (
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-display font-bold mb-2">Rank your TOP 3 streaming challenges</h2>
                            <p className="text-gray-400">Drag items from the list below into your top 3 slots.</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Selected Slots */}
                            <div className="md:w-1/2 space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4">Your Top 3 Priorities</h3>
                                {[0, 1, 2].map((index) => {
                                    const item = data.problemRank ? data.problemRank[index] : null;
                                    const itemDetails = item ? PROBLEM_OPTIONS.find(p => p.id === item) : null;

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
                                                        <span className="font-bold">{itemDetails.label}</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => updateData('problemRank', data.problemRank?.filter(id => id !== item))}
                                                        className="p-1 hover:bg-white/10 rounded-full"
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
                                    {PROBLEM_OPTIONS.filter(opt => !data.problemRank?.includes(opt.id)).map(opt => (
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

                        <div className="mt-8 flex justify-end">
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
                return (
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl font-display font-bold mb-4">How painful is your #1 challenge?</h2>
                        <div className="bg-white/5 p-4 rounded-xl inline-block mb-12 text-violet-300">
                            {PROBLEM_OPTIONS.find(p => p.id === (data.problemRank?.[0]))?.label || "Your top challenge"}
                        </div>

                        <div className="relative mb-16 px-4">
                            <div className="flex justify-between text-2xl mb-8">
                                <span className={`transition-opacity ${data.painIntensity! < 4 ? 'opacity-100' : 'opacity-30'}`}>😐</span>
                                <span className={`transition-opacity ${data.painIntensity! > 7 ? 'opacity-100' : 'opacity-30'}`}>😫</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="10" 
                                value={data.painIntensity}
                                onChange={(e) => updateData('painIntensity', parseInt(e.target.value))}
                                className="w-full h-4 bg-white/10 rounded-full appearance-none cursor-pointer accent-violet-500"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-4 font-mono uppercase tracking-widest">
                                <span>Minor Annoyance</span>
                                <span>Considering Quitting</span>
                            </div>
                            <div className="mt-4 text-4xl font-bold text-violet-400">{data.painIntensity} / 10</div>
                        </div>

                        <button onClick={nextStep} className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">Continue →</button>
                    </div>
                );

            case 6: // ATTEMPTED SOLUTIONS
                return (
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-display font-bold text-center mb-12">Have you tried to improve this before?</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                "Better chat moderation tools", "Polls, predictions, channel points", 
                                "Discord community", "Upgraded equipment/lighting", 
                                "Emote reactions / Sound alerts", "Hired a community manager", 
                                "Nothing has really worked", "Haven't tried anything yet"
                            ].map((sol) => (
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
                        <div className="mt-12 flex justify-end">
                            <button onClick={nextStep} className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">Continue →</button>
                        </div>
                    </div>
                );

            case 7: // SOLUTION PREFERENCE
                return (
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-display font-bold text-center mb-4">If you could choose ONE way to improve connection?</h2>
                        <p className="text-gray-400 text-center mb-12">Which of these sounds most like magic to you?</p>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { id: 'analytics', icon: <Activity size={32} />, title: "Better Analytics", desc: "Deeper insights into chat & behavior" },
                                { id: 'ai', icon: <Cpu size={32} />, title: "AI Moderation", desc: "Smarter bots to filter spam & highlight VIPs" },
                                { id: 'xr', icon: <Zap size={32} />, title: "Ambient Awareness", desc: "Wearable tech to FEEL audience emotion without reading chat", highlight: true },
                                { id: 'gamification', icon: <PlayCircle size={32} />, title: "Interaction Tools", desc: "More polls, predictions & mini-games" },
                                { id: 'other', icon: <MessageSquare size={32} />, title: "Something Else", desc: "I have a different idea..." }
                            ].map((opt) => (
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
                return (
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-display font-bold mb-2">Which features excite you most?</h2>
                            <p className="text-violet-400 font-bold uppercase tracking-widest text-sm">Pick your top 2</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                "Feel audience emotion in real-time",
                                "Visual XR overlays on stream",
                                "Sentiment-responsive lighting",
                                "No need to read every chat message",
                                "Works with all streaming platforms",
                                "Audience sees their collective impact"
                            ].map((feat) => (
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
                        <div className="mt-12 flex justify-end">
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
                    <div className="max-w-xl mx-auto text-center">
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

            case 11: // PAYMENT MODEL
                return (
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-display font-bold text-center mb-12">Which pricing model do you prefer?</h2>
                        
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { title: "SUBSCRIPTION", price: "€14.99/mo", detail: "Cancel anytime", sub: "Low upfront cost" },
                                { title: "ONE-TIME", price: "€349", detail: "Device + Lifetime", sub: "Higher upfront" },
                                { title: "FREEMIUM", price: "Free + €9.99", detail: "Basic Free / Pro Paid", sub: "Limited features" },
                            ].map((opt) => (
                                <Card
                                    key={opt.title}
                                    selected={data.pricingModel === opt.title}
                                    onClick={() => {
                                        updateData('pricingModel', opt.title);
                                        setTimeout(nextStep, 300);
                                    }}
                                    className="text-center py-12"
                                >
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{opt.title}</h3>
                                    <div className="text-3xl font-bold text-white mb-2">{opt.price}</div>
                                    <p className="text-violet-400 text-sm font-bold mb-6">{opt.detail}</p>
                                    <p className="text-xs text-gray-500">{opt.sub}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                );
            
            case 12: // EXIT / THANK YOU
                return (
                    <div className="max-w-2xl mx-auto text-center pt-10">
                         <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="mb-8 relative"
                         >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500/20 rounded-full blur-[80px]" />
                            <div className="w-24 h-24 bg-gradient-to-tr from-violet-400 to-indigo-500 rounded-full mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.5)]">
                                <Check size={48} className="text-white" />
                            </div>
                         </motion.div>
                         
                         <h1 className="font-display font-bold text-5xl mb-6">YOU'RE IN. 🚀</h1>
                         <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                            Thank you for helping us build the future of streaming.
                            <br/>
                            <span className="text-violet-400 font-bold">You've been added to the priority alpha list.</span>
                         </p>

                         <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12">
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

                         <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <button className="px-8 py-3 bg-[#5865F2] text-white font-bold rounded-full hover:bg-[#4752C4] transition-colors flex items-center justify-center gap-2">
                                <MessageSquare size={20} /> Join Discord
                            </button>
                            <button onClick={onExit} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-colors">
                                Return to Site
                            </button>
                         </div>
                    </div>
                );

            default:
                return null;
        }
    };

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

            {/* HEADER INFO */}
            {step > 0 && step < 12 && (
                <div className="fixed top-6 right-6 z-40 flex items-center gap-4 text-xs font-mono text-gray-500 uppercase tracking-widest">
                    <span>Survey In Progress</span>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="hidden md:inline">~{Math.max(1, 5 - Math.floor(step * 0.4))} mins left</span>
                </div>
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
            {showExitModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center px-4">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#1A1830] border border-white/20 p-8 rounded-2xl max-w-md text-center shadow-2xl"
                    >
                        <h3 className="text-2xl font-bold mb-4">Wait! You're {Math.round(progress)}% done.</h3>
                        <p className="text-gray-400 mb-8">Your answers are helping us build something that could actually solve the problem you described.</p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => setShowExitModal(false)}
                                className="w-full py-3 bg-white text-black font-bold rounded-xl"
                            >
                                Finish Survey (1 min)
                            </button>
                            <button 
                                onClick={onExit}
                                className="w-full py-3 text-gray-500 hover:text-white"
                            >
                                No thanks, I'll leave
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* BACKGROUND ELEMENTS */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,transparent_70%)]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-900/10 blur-[120px]" />
            </div>
        </div>
    );
};

export default SurveyPage;
