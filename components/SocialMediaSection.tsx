import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const SERVICES = [
    {
        id: '01',
        title: 'Strategy & Analysis',
        description: 'Data-driven positioning and competitive mapping to define your brand’s digital trajectory.'
    },
    {
        id: '02',
        title: 'Creative Production',
        description: 'Scalable production systems for premium digital cinematography and narrative.'
    },
    {
        id: '03',
        title: 'Media Management',
        description: 'Precision-led growth strategies focused on retention and organic reach optimization.'
    },
    {
        id: '04',
        title: 'Performance Data',
        description: 'Elite visual languages tailored for high-impact social performance.'
    }
];

export const SocialMediaSection = () => {
    return (
        <section className="w-full bg-white pt-12 pb-24 md:pb-48 px-6 md:px-12 border-t border-gray-100">
            <div className="max-w-7xl mx-auto">

                {/* Minimal Header */}
                <div className="mb-24 md:mb-32">
                    <span className="text-[10px] font-mono text-black/20 uppercase tracking-[0.5em] block mb-4">
                        Service_01
                    </span>
                    <h2
                        className="text-5xl md:text-7xl font-light uppercase tracking-tighter text-black"
                    >
                        Social <br />
                        <span className="text-black/5 italic font-black">Marketing_</span>
                    </h2>
                </div>

                {/* Ultra Simple Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16 border-t border-gray-100 pt-16">
                    {SERVICES.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group space-y-6"
                        >
                            <div className="flex justify-between items-center w-full pb-4 border-b border-gray-50">
                                <span className="text-[10px] font-mono text-black/40 uppercase tracking-widest font-bold">
                                    0{service.id} // <span className="text-black/10">SYS_DEPLOY</span>
                                </span>
                                <ArrowUpRight size={14} className="text-black transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 opacity-20 group-hover:opacity-100" />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-3xl font-bold uppercase tracking-tight text-black">
                                    {service.title}
                                </h3>

                                <p className="text-sm text-black/50 font-light leading-relaxed max-w-sm uppercase tracking-wide">
                                    {service.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};
