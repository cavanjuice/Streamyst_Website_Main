
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
                                Email: hello@streamyst.com
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">2. Data We Collect</h2>
                            <ul className="list-disc pl-5 space-y-2 text-gray-400">
                                <li><strong>Contact Information:</strong> Email address (when you join our waitlist or survey).</li>
                                <li><strong>Survey Data:</strong> Responses regarding streaming habits, preferences, and hardware interest.</li>
                                <li><strong>Usage Data:</strong> Anonymous analytics (via cookies) to improve website performance, if consented to.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">3. Purpose of Processing</h2>
                            <p>We process your data for the following purposes:</p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-400 mt-2">
                                <li>To manage the alpha/beta access waitlist.</li>
                                <li>To inform you about product launches and updates (based on your consent).</li>
                                <li>To analyze market needs through survey responses (Legitimate Interest).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">4. Third-Party Services</h2>
                            <p>
                                We use Supabase (hosted in the EU/US with standard contractual clauses) for database management. We do not sell your data to third parties.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">5. Your Rights</h2>
                            <p>Under GDPR, you have the right to:</p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-400 mt-2">
                                <li>Access the personal data we hold about you.</li>
                                <li>Request correction or deletion of your data.</li>
                                <li>Withdraw consent at any time (e.g., unsubscribing from emails).</li>
                                <li>Lodge a complaint with the Belgian Data Protection Authority (GBA).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">6. Cookies</h2>
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
