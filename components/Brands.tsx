import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView, useSpring, useTransform } from 'framer-motion';

const AnimatedCounter = ({ end, duration = 2, prefix = '', suffix = '' }: any) => {
    const nodeRef = useRef(null);
    const inView = useInView(nodeRef, { once: true });

    const springValue = useSpring(0, {
        stiffness: 50,
        damping: 30,
        duration: duration * 1000
    });

    const displayValue = useTransform(springValue, (latest) =>
        `${prefix}${Math.floor(latest).toLocaleString()}${suffix}`
    );

    useEffect(() => {
        if (inView) {
            springValue.set(end);
        }
    }, [inView, end, springValue]);

    return <motion.span ref={nodeRef}>{displayValue}</motion.span>;
};

const LOGO_IMAGES = [
    "/assets/brands/brand_1.png",
    "/assets/brands/brand_2.png",
    "/assets/brands/brand_3.png",
    "/assets/brands/brand_4.png",
    "/assets/brands/brand_5.png",
    "/assets/brands/brand_6.png",
    "/assets/brands/brand_7.png"
];

const LogoReveal: React.FC<{ src: string; delay?: number }> = ({ src, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className="will-change-transform group cursor-pointer backface-hidden transform-gpu p-4 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
        >
            <img src={src} alt="Brand Logo" className="max-w-[100px] h-auto object-contain max-h-[60px]" loading="lazy" />
        </motion.div>
    );
};

export const Brands: React.FC<{ data?: any, title?: string }> = ({ data, title }) => {
    const images = data?.brands?.logos?.length ? data.brands.logos : LOGO_IMAGES;
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
                {/* Discreet Brand Title */}
                <div className="mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase font-ocr opacity-50"
                        style={{ color: data?.brands?.titleColor || 'var(--color-text)' }}
                    >
                        {sectionTitle}
                    </motion.h2>
                </div>

                {/* Restored Logo Slider */}
                {/* Optimized Seamless Logo Marquee */}
                <div className="relative overflow-hidden py-12 mb-10 w-full group">
                    {/* Gradient Masks */}
                    <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[var(--color-bg)] to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[var(--color-bg)] to-transparent z-10 pointer-events-none" />

                    <motion.div
                        className="flex w-fit"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            duration: 35,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "loop"
                        }}
                    >
                        {/* Group 1 */}
                        <div className="flex gap-16 md:gap-20 items-center px-4 md:px-10">
                            {images.map((src: string, i: number) => (
                                <div key={`g1-${i}`} className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300 opacity-50 hover:opacity-100 shrink-0">
                                    <img src={src} alt="Brand" className="max-w-[160px] md:max-w-[100px] h-auto object-contain max-h-[80px] md:max-h-[50px]" />
                                </div>
                            ))}
                        </div>
                        {/* Group 2 (Identical for seamless reset) */}
                        <div className="flex gap-16 md:gap-20 items-center px-4 md:px-10">
                            {images.map((src: string, i: number) => (
                                <div key={`g2-${i}`} className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300 opacity-50 hover:opacity-100 shrink-0">
                                    <img src={src} alt="Brand" className="max-w-[160px] md:max-w-[100px] h-auto object-contain max-h-[80px] md:max-h-[50px]" />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Discreet Impact Section */}
                <div className="mt-12 md:mt-24 border-t border-white/5 pt-20 pb-16 md:pt-12 md:pb-0">
                    <div className="flex flex-col items-center">
                        <div className="grid grid-cols-3 gap-4 md:gap-24 w-full md:w-full max-w-4xl mx-auto px-4">
                            {(data?.brands?.kpis || [
                                { number: 1050, prefix: "", suffix: "+", label: "PROJECTS", desc: "Delivered Globally" },
                                { number: 4, prefix: "$", suffix: "M+", label: "CLIENT CASH COLLECTED", desc: "Creative Excellence" },
                                { number: 3, prefix: "", suffix: "x", label: "CONVERSION RATE", desc: "Driven by Video" }
                            ]).map((kpi: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group flex flex-col items-center text-center"
                                >
                                    <div className="text-2xl md:text-3xl lg:text-4xl font-black mb-3 md:mb-1 font-ocr transition-colors tracking-tighter tabular-nums whitespace-nowrap" style={{ color: data?.brands?.kpiNumberColor || 'rgba(255, 255, 255, 0.9)' }}>
                                        <AnimatedCounter end={kpi.number} prefix={kpi.prefix} suffix={kpi.suffix} />
                                    </div>
                                    <div className="text-[9px] md:text-[10px] font-bold tracking-[0.1em] md:tracking-[0.2em] uppercase font-ocr px-1 break-words" style={{ color: data?.brands?.kpiLabelColor || 'rgba(255, 255, 255, 0.4)' }}>
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


