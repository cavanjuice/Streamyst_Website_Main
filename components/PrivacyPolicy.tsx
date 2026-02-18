
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-cosmic-950 text-white pt-32 pb-20 px-6 relative z-50">
            <div className="container mx-auto max-w-3xl relative z-10">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group cursor-pointer relative z-20"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    <h1 className="font-display font-bold text-4xl md:text-5xl mb-8">Privacy Policy</h1>
                    
                    <div className="text-gray-300 leading-relaxed space-y-6">
                        <p>
                            Streamyst BV ("we", "us", "our") values your privacy. This policy explains how we collect, use, and protect your personal data in compliance with the General Data Protection Regulation (GDPR).
                        </p>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">1. Data Controller</h2>
                            <p>
                                Streamyst BV<br />
                                Antwerp, Belgium<br />
                                Email: <a href="mailto:hello@streamyst.com" className="text-violet-400 hover:underline">hello@streamyst.com</a>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">2. Data We Collect</h2>
                            <p className="mb-2">We collect data to understand the market needs for our hardware and software products. This includes:</p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-400">
                                <li><strong>Identity & Contact Data:</strong> Email address (only if voluntarily provided for the waitlist or beta access).</li>
                                <li><strong>Profile Data:</strong> Your role (Streamer, Viewer, or Other), streaming frequency, viewer count estimates, and platform usage habits.</li>
                                <li><strong>Preference & Feedback Data:</strong> Information on your challenges (pain points), desired features, interaction styles, and free-text feedback regarding the livestreaming experience.</li>
                                <li><strong>Economic Research Data:</strong> Pricing sensitivity data (Van Westendorp price sensitivity meter), preferred business models (subscription vs one-time), and purchase intent levels.</li>
                                <li><strong>Usage Data:</strong> IP addresses, browser type, and interaction data (clicks, heatmaps, scroll behavior) collected via analytics tools. <strong>Note:</strong> Behavioural tracking is only active if you explicitly click "Accept" on our cookie banner.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">3. Purpose of Processing</h2>
                            <p>We process your data for the following purposes:</p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-400 mt-2">
                                <li>To manage the alpha/beta access waitlist and contact selected participants.</li>
                                <li>To analyze market pricing tolerance and business model viability.</li>
                                <li>To prioritize feature development based on user-reported pain points.</li>
                                <li>To inform you about product launches and updates (based on your consent).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">4. Third-Party Services</h2>
                            <p className="mb-2">
                                We utilize specialized partners to ensure a high-quality experience. We maintain a <strong>Zero-Tolerance Policy</strong>: we never sell or license platform-derived data to third parties.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-400">
                                <li>
                                    <strong>Supabase:</strong> For secure database management. Data is stored on servers within the European Union (EU-Central). A Data Processing Agreement (DPA) is in place with all sub-processors to ensure GDPR-equivalent protection.
                                </li>
                                <li>
                                    <strong>Analytics Tools:</strong> We use industry-standard tools (Google Analytics) for UX tracking. These scripts are strictly blocked until you provide consent via our Cookie Banner.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">5. Data Retention</h2>
                            <p>
                                We store your personal data only as long as necessary for the development of the alpha/beta phase. We maintain a standard retention period of two (2) years or until the conclusion of the Alpha/Beta phase, whichever comes first, unless you request earlier deletion or withdraw your consent. Survey data is anonymized once the research phase is complete.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">6. Your Rights</h2>
                            <p>Under GDPR, you have the right to:</p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-400 mt-2">
                                <li>Access the personal data we hold about you.</li>
                                <li>Request correction or deletion of your data.</li>
                                <li>Withdraw consent at any time (e.g., unsubscribing from emails).</li>
                                <li>Lodge a complaint with the Belgian Data Protection Authority (GBA).</li>
                            </ul>
                            <p className="mt-4">
                                Contact: <a href="mailto:hello@streamyst.com" className="text-violet-400 hover:underline">hello@streamyst.com</a> to request any of the above data modifications.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">7. Cookies</h2>
                            <p>
                                We use essential cookies to make the site work. Optional analytics cookies are only set with your explicit consent via our Cookie Banner. You can change your preferences at any time via the "Cookie Settings" link in the footer.
                            </p>
                        </section>

                        <div className="h-px w-full bg-white/10 my-8" />
                        <p className="text-sm text-gray-500">Last Updated: March 2024</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
