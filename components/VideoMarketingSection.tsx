import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export const VideoMarketingSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.5], [0.85, 0.95]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const springScale = useSpring(scale, { stiffness: 40, damping: 30 });

    return (
        <section ref={sectionRef} className="w-full bg-white pt-12 pb-32 md:pb-48 px-6 md:px-12 relative overflow-hidden border-t border-gray-100">
            <div className="max-w-5xl mx-auto flex flex-col items-center">

                {/* Pure Cinematic Showcase */}
                <motion.div
                    style={{ scale: springScale, opacity }}
                    className="relative w-full aspect-video bg-gray-50 overflow-hidden border border-gray-100"
                >
                    <video
                        ref={videoRef}
                        src="https://video.wixstatic.com/video/8fb0bb_6471e8a538c04daa982acd5e0dac1447/1080p/mp4/file.mp4"
                        className="w-full h-full object-cover grayscale transition-all duration-1000"
                        autoPlay muted loop playsInline
                    />

                    {/* Minimal Technical Boundary */}
                    <div className="absolute inset-4 md:inset-8 border border-white/20 pointer-events-none" />
                </motion.div>

                {/* Subtitle / Focus Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-24 text-center space-y-8"
                >
                    <span className="text-[10px] font-mono text-black/20 uppercase tracking-[1em]">
                        Cinematic Excellence // 02
                    </span>
                    <h2
                        className="text-4xl md:text-6xl font-light uppercase tracking-tighter text-black max-w-4xl"
                    >
                        High-fidelity motion assets designed to <br />
                        <span className="text-black/5 italic font-black">scale brand authority_</span>
                    </h2>
                </motion.div>

            </div>
        </section>
    );
};
