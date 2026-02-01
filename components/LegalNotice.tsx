
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const LegalNotice: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
                    <h1 className="font-display font-bold text-4xl md:text-5xl mb-8">Legal Notice (Impressum)</h1>
                    
                    <div className="prose-custom text-gray-300 leading-relaxed space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-2">Information according to § 5 TMG / EU E-Commerce Directive</h2>
                            <p>
                                <strong>Streamyst BV</strong><br />
                                [Street Name & Number]<br />
                                2000 Antwerp<br />
                                Belgium
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-2">Represented by</h2>
                            <p>
                                Robbe De Block (CEO)<br />
                                Justin-Caine Cavanas (CTO)
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-2">Contact</h2>
                            <p>
                                Email: <a href="mailto:hello@streamyst.com" className="text-violet-400 hover:underline">hello@streamyst.com</a><br />
                                Phone: [Phone Number Optional]<br />
                                Web: www.streamyst.com
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-2">Register Entry</h2>
                            <p>
                                Registered in the Commercial Register (Kruispuntbank van Ondernemingen).<br />
                                <strong>VAT ID (BTW/TVA):</strong> BE 0123.456.789
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-2">Dispute Resolution</h2>
                            <p>
                                The European Commission provides a platform for online dispute resolution (ODR): 
                                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline ml-1">https://ec.europa.eu/consumers/odr/</a>.<br />
                                We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
                            </p>
                        </section>

                        <div className="h-px w-full bg-white/10 my-8" />
                        
                        <p className="text-sm text-gray-500">
                            Last Updated: March 2024
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LegalNotice;
