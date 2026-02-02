
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const TermsOfService: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
                    <h1 className="font-display font-bold text-4xl md:text-5xl mb-8">Terms of Service</h1>
                    
                    <div className="text-gray-300 leading-relaxed space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">1. Overview</h2>
                            <p>
                                By accessing the Streamyst website (www.streamyst.com), you agree to be bound by these Terms of Service. If you do not agree, please do not use our website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">2. Beta & Waitlist</h2>
                            <p>
                                Streamyst is currently in a pre-release development phase. Joining the waitlist or survey does not guarantee access to the product. We reserve the right to select participants for Alpha/Beta testing at our discretion.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">3. Feedback & Survey Submissions</h2>
                            <p>
                                We value your input. If you submit feedback, survey responses, ideas, or suggestions ("Feedback") to us through our website:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>You agree that such Feedback is non-confidential and becomes the sole property of Streamyst BV.</li>
                                <li>Streamyst BV shall own exclusive rights, including all intellectual property rights, and shall be entitled to the unrestricted use and dissemination of this Feedback for any purpose (commercial or otherwise) without acknowledgment or compensation to you.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">4. Intellectual Property</h2>
                            <p>
                                All content on this site (including text, graphics, logos, 3D models, and code) is the property of Streamyst BV and is protected by copyright and intellectual property laws. You may not reproduce or distribute any content without our written permission.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">5. Disclaimer of Warranties</h2>
                            <p>
                                The website is provided "as is". We make no warranties regarding the accuracy, reliability, or availability of the website. The product concepts shown are subject to change during development.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">6. Limitation of Liability</h2>
                            <p>
                                Streamyst BV shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">7. Governing Law</h2>
                            <p>
                                These terms are governed by the laws of Belgium. Any disputes shall be subject to the exclusive jurisdiction of the courts of Antwerp.
                            </p>
                        </section>

                        <div className="h-px w-full bg-white/10 my-8" />
                        <p className="text-sm text-gray-500">Last Updated: February 2026</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsOfService;
