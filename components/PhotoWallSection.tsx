import React from 'react';
import { motion } from 'framer-motion';

const IMAGES = [
    { url: 'https://images.unsplash.com/photo-1620503374956-c942862f0372?q=80&w=2070&auto=format&fit=crop', height: 'h-[400px]' },
    { url: 'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?q=80&w=2058&auto=format&fit=crop', height: 'h-[600px]' },
    { url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop', height: 'h-[500px]' },
    { url: 'https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?q=80&w=2069&auto=format&fit=crop', height: 'h-[700px]' },
    { url: 'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?q=80&w=2064&auto=format&fit=crop', height: 'h-[450px]' },
    { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop', height: 'h-[550px]' },
    { url: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=2070&auto=format&fit=crop', height: 'h-[650px]' },
    { url: 'https://images.unsplash.com/photo-1504270997636-07ddfbd48945?q=80&w=2071&auto=format&fit=crop', height: 'h-[500px]' },
    { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2074&auto=format&fit=crop', height: 'h-[800px]' },
    { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop', height: 'h-[600px]' },
    { url: 'https://images.unsplash.com/photo-1518136247453-74e7b5265980?q=80&w=2070&auto=format&fit=crop', height: 'h-[400px]' },
    { url: 'https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?q=80&w=2030&auto=format&fit=crop', height: 'h-[550px]' }
];

export const PhotoWallSection = () => {
    return (
        <section className="w-full bg-white pt-12 pb-24 px-6 md:px-12 border-t border-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {IMAGES.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="break-inside-avoid relative group overflow-hidden bg-gray-50 border border-gray-100"
                        >
                            <div className={`${img.height} w-full relative overflow-hidden`}>
                                <img
                                    src={img.url}
                                    alt={`Capture ${i + 1}`}
                                    className="w-full h-full object-cover grayscale brightness-95 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                                />

                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                    <div className="flex justify-between items-end w-full text-white mix-blend-difference">
                                        <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Capture_{i + 1}</span>
                                        <div className="text-[8px] font-mono opacity-60 text-right">
                                            Optic Element<br />Archive_24
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
