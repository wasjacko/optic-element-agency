import React, { useRef, useEffect } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

const AnimatedCounter = ({ end, prefix = "", suffix = "" }: { end: number, prefix?: string, suffix?: string }) => {
    const ref = useRef(null);
    // Margin -50px ensures it starts counting exactly when it comes well into view
    const inView = useInView(ref, { once: true, margin: "-50px" });
    // Spring configuration maps directly to a "dialing-in" feel (fast to start, slows down smoothly at the end)
    const spring = useSpring(0, { mass: 1, stiffness: 60, damping: 20 });

    useEffect(() => {
        if (inView) {
            spring.set(end);
        }
    }, [inView, end, spring]);

    const display = useTransform(spring, (current) => {
        return prefix + Math.round(current).toLocaleString() + suffix;
    });

    return <motion.span ref={ref}>{display}</motion.span>;
};

const LOGO_IMAGES = [
    "https://static.wixstatic.com/media/8fb0bb_10196fa29d6049cf9c62e7151ea6ef82~mv2.png/v1/fit/w_123,h_123,q_90,enc_avif,quality_auto/8fb0bb_10196fa29d6049cf9c62e7151ea6ef82~mv2.png",
    "https://static.wixstatic.com/media/8fb0bb_0d5ae6c432754b53bfb74c18a31de09e~mv2.png/v1/fit/w_123,h_123,q_90,enc_avif,quality_auto/8fb0bb_0d5ae6c432754b53bfb74c18a31de09e~mv2.png",
    "https://static.wixstatic.com/media/8fb0bb_52736c58c8a147fabdcd89bd259c7aa3~mv2.png/v1/fit/w_123,h_123,q_90,enc_avif,quality_auto/8fb0bb_52736c58c8a147fabdcd89bd259c7aa3~mv2.png",
    "https://static.wixstatic.com/media/8fb0bb_f87b0fac1ef2443489c6d114aaf5521c~mv2.png/v1/fit/w_124,h_123,q_90,enc_avif,quality_auto/8fb0bb_f87b0fac1ef2443489c6d114aaf5521c~mv2.png",
    "https://static.wixstatic.com/media/8fb0bb_98f25b27839644728ceb8ceff04aac43~mv2.png/v1/fit/w_123,h_123,q_90,enc_avif,quality_auto/8fb0bb_98f25b27839644728ceb8ceff04aac43~mv2.png",
    "https://static.wixstatic.com/media/8fb0bb_7ed4a5779f7945999dc781dd501f841f~mv2.png/v1/fit/w_123,h_123,q_90,enc_avif,quality_auto/8fb0bb_7ed4a5779f7945999dc781dd501f841f~mv2.png",
    "https://static.wixstatic.com/media/8fb0bb_680d0b9de5a149a1afb6259f2fa3c18a~mv2.png/v1/fit/w_123,h_123,q_90,enc_avif,quality_auto/8fb0bb_680d0b9de5a149a1afb6259f2fa3c18a~mv2.png",
    "https://static.wixstatic.com/media/8fb0bb_a7fa8416e5fd4346a648ef5c5bc8cab5~mv2.png/v1/fit/w_123,h_123,q_90,enc_avif,quality_auto/8fb0bb_a7fa8416e5fd4346a648ef5c5bc8cab5~mv2.png",
    "https://static.wixstatic.com/media/8fb0bb_e809a5010d714be985ecf442e990aa53~mv2.png/v1/fit/w_124,h_123,q_90,enc_avif,quality_auto/8fb0bb_e809a5010d714be985ecf442e990aa53~mv2.png",
    "https://static.wixstatic.com/media/8fb0bb_11b3fbfbec8c43e3bc80dea8317b30b6~mv2.png/v1/fit/w_123,h_123,q_90,enc_avif,quality_auto/8fb0bb_11b3fbfbec8c43e3bc80dea8317b30b6~mv2.png",
    "https://static.wixstatic.com/media/8fb0bb_77ee9fcc503e45e6a877eb63dda79cd9~mv2.png/v1/fit/w_123,h_123,q_90,enc_avif,quality_auto/8fb0bb_77ee9fcc503e45e6a877eb63dda79cd9~mv2.png",
    "https://static.wixstatic.com/media/8fb0bb_2e8589a7c9034266bcdb6f6761aaaed3~mv2.png/v1/fit/w_123,h_123,q_90,enc_avif,quality_auto/8fb0bb_2e8589a7c9034266bcdb6f6761aaaed3~mv2.png",
    "https://static.wixstatic.com/media/8fb0bb_737177e783fd4a9993d0877a1bfa2f98~mv2.png/v1/fit/w_123,h_123,q_90,enc_avif,quality_auto/8fb0bb_737177e783fd4a9993d0877a1bfa2f98~mv2.png",
    "https://static.wixstatic.com/media/8fb0bb_92f87f8f536742419f6ee8c768f741be~mv2.png/v1/fit/w_123,h_50,q_90,enc_avif,quality_auto/8fb0bb_92f87f8f536742419f6ee8c768f741be~mv2.png",
    "https://static.wixstatic.com/media/8fb0bb_7a239f824fab4f279ce9b1f7da792f93~mv2.png/v1/fit/w_123,h_123,q_90,enc_avif,quality_auto/8fb0bb_7a239f824fab4f279ce9b1f7da792f93~mv2.png",
    "https://static.wixstatic.com/media/8fb0bb_f8ce5cf6e1e64583a7e273e52a0cdb7f~mv2.png/v1/fit/w_123,h_123,q_90,enc_avif,quality_auto/8fb0bb_f8ce5cf6e1e64583a7e273e52a0cdb7f~mv2.png",
    "https://static.wixstatic.com/media/8fb0bb_7b7fbe258dfe416eb25850bc4c3f6bee~mv2.png/v1/fit/w_124,h_123,q_90,enc_avif,quality_auto/8fb0bb_7b7fbe258dfe416eb25850bc4c3f6bee~mv2.png"
];

const LogoReveal: React.FC<{ src: string; delay?: number }> = ({ src, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className="relative flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
        >
            <img src={src} alt="Brand Logo" className="max-w-[100px] h-auto object-contain max-h-[60px]" loading="lazy" />
        </motion.div>
    );
};

export const Brands: React.FC<{ data?: any, title?: string }> = ({ data, title }) => {
    const images = data?.brands?.images?.length ? data.brands.images : LOGO_IMAGES;
    const sectionTitle = title || data?.title || "Brands We Serve";
    const bgColor = data?.brands?.backgroundColor || 'var(--color-bg)';

    return (
        <section className="py-16 md:py-32 relative z-20 border-t border-white/5 transition-colors duration-500"
            style={{
                backgroundColor: bgColor,
                color: 'var(--color-text)',
                '--brand-color': data?.brands?.brandColor || 'var(--color-text)'
            } as React.CSSProperties}>

            <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .text-shimmer {
          background: linear-gradient(to right, #666 20%, #fff 50%, #666 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

            <div className="max-w-7xl mx-auto px-10 md:px-6 text-center">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="font-mono text-sm md:text-base tracking-[0.3em] uppercase mb-16 transition-colors duration-500 font-bold"
                    style={{ color: data?.brands?.titleColor || 'var(--color-primary)' }}
                >
                    {sectionTitle}
                </motion.p>

                <div className="relative w-full overflow-hidden mask-linear-fade">
                    {/* Linear Gradient Masks for smooth fade out at edges */}
                    <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-[var(--color-bg)] to-transparent z-10 pointer-events-none" style={{ '--color-bg': bgColor } as any} />
                    <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[var(--color-bg)] to-transparent z-10 pointer-events-none" style={{ '--color-bg': bgColor } as any} />

                    <motion.div
                        className="flex gap-16 md:gap-24 items-center w-max will-change-transform backface-hidden"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            duration: 40,
                            ease: "linear",
                            repeat: Infinity,
                        }}
                    >
                        {[...images, ...images].map((src: string, i: number) => (
                            <div key={i} className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                                <img
                                    src={src}
                                    alt="Brand Logo"
                                    className="max-w-[100px] h-auto object-contain max-h-[60px]"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Discreet Impact Section */}
                <div className="mt-24 md:mt-32 border-t border-white/5 pt-20 pb-16 md:pt-12 md:pb-0">
                    <div className="flex flex-col items-center">
                        <div className="grid grid-cols-3 gap-4 md:gap-24 w-full md:w-full max-w-4xl mx-auto px-4">
                            {[
                                { number: 1050, prefix: "", suffix: "+", label: "PROJECTS", desc: "Delivered Globally" },
                                { number: 4, prefix: "$", suffix: "M+", label: "CLIENT CASH COLLECTED", desc: "Creative Excellence" },
                                { number: 3, prefix: "", suffix: "x", label: "CONVERSION RATE", desc: "Driven by Video" }
                            ].map((kpi, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group flex flex-col items-center text-center"
                                >
                                    <div className="text-2xl md:text-3xl lg:text-4xl font-black mb-3 md:mb-1 font-ocr text-white/90 group-hover:text-white transition-colors tracking-tighter tabular-nums whitespace-nowrap">
                                        <AnimatedCounter end={kpi.number} prefix={kpi.prefix} suffix={kpi.suffix} />
                                    </div>
                                    <div className="text-[9px] md:text-[10px] font-bold tracking-[0.1em] md:tracking-[0.2em] text-white/40 uppercase font-ocr px-1 break-words">
                                        {kpi.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


