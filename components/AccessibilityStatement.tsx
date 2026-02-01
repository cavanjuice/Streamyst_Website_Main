
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const AccessibilityStatement: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
                    <h1 className="font-display font-bold text-4xl md:text-5xl mb-8">Accessibility Statement</h1>
                    
                    <div className="text-gray-300 leading-relaxed space-y-6">
                        <p>
                            Streamyst BV is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
                        </p>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">Measures to support accessibility</h2>
                            <p>Streamyst BV takes the following measures to ensure accessibility of the Streamyst website:</p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-400 mt-2">
                                <li>Include accessibility as part of our internal mission statement.</li>
                                <li>Ensure high contrast ratios for text visibility.</li>
                                <li>Support keyboard navigation for core interactions.</li>
                                <li>Use semantic HTML for better screen reader compatibility.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">Conformance Status</h2>
                            <p>
                                The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
                            </p>
                            <p className="mt-2">
                                The Streamyst website is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not yet fully conform to the accessibility standard, as we are in an early development phase.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">Feedback</h2>
                            <p>
                                We welcome your feedback on the accessibility of Streamyst. Please let us know if you encounter accessibility barriers on our website:
                            </p>
                            <p className="mt-2">
                                Email: <a href="mailto:hello@streamyst.com" className="text-violet-400 hover:underline">hello@streamyst.com</a>
                            </p>
                            <p>We try to respond to feedback within 2 business days.</p>
                        </section>

                        <div className="h-px w-full bg-white/10 my-8" />
                        <p className="text-sm text-gray-500">Date: March 2024</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AccessibilityStatement;
