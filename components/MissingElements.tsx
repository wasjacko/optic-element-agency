import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ELEMENTS = [
    {
        id: '20',
        symbol: 'oE',
        mass: '40.078',
        name: 'Identity',
        role: 'Brand Strategy',
        desc: 'Optic Element is the trust pillar — designing strategic visual systems that shape perception, build reputation, and position you as the clear leader in your market. From identity to full brand architecture, we don’t just make you look good. We make you credible.'
    },
    {
        id: '05',
        symbol: 'Pa',
        mass: '10.811',
        name: 'Growth',
        role: 'User Acquisition',
        desc: 'Precise Acquisition is the marketing pillar — putting you in front of the right audience and converting attention into qualified clients. Clear messaging. Data-backed strategy. Predictable growth.'
    },
    {
        id: '01',
        symbol: 'Lb',
        mass: '1.008',
        name: 'Content',
        role: 'Production Lab',
        desc: 'A 6,000 sq ft state-of-the-art content facility. Over 20 modular sets built for cinematic production, branded content, live events, and in-person funnels. This is where authority is captured at scale.'
    },
    {
        id: '15',
        symbol: 'Mx',
        mass: '30.974',
        name: 'Systems',
        role: 'Operations',
        desc: 'Operational infrastructure for sustainable scale. Automated workflows. Clean systems. Execution without chaos.'
    },
];

const ParallaxCard = ({ el, index, scrollYProgress, isMobile }: { el: any, index: number, scrollYProgress: any, isMobile: boolean }) => {
    // Parallax Logic: Even items move down, Odd items move up relative to scroll
    const y = useTransform(
        scrollYProgress,
        [0, 1],
        isMobile ? [0, 0] : (index % 2 === 0 ? [0, 100] : [0, -100])
    );

    const customData = el.sectionData || {};
    return (
        <motion.div
            style={{ y }}
            className={`flex flex-col items-center group w-full relative`}
        >
            {/* CUBE (Desktop & Mobile) - Fixed Position on Hover */}
            <div className="relative w-20 h-20 md:w-20 md:h-20 mb-2 md:mb-4 cursor-pointer flex-shrink-0 mx-auto">
                <div
                    className="absolute inset-0 border-2 flex flex-col justify-center items-center p-1 z-20 transition-colors duration-300"
                    style={{ borderColor: customData?.accentColor || '#000000', backgroundColor: customData?.cardBg || '#ffffff' }}
                >
                    {/* BRACKETS (Corner Accents) */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 transition-colors" style={{ borderColor: customData?.accentColor || '#000000' }} />
                    <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 transition-colors" style={{ borderColor: customData?.accentColor || '#000000' }} />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 transition-colors" style={{ borderColor: customData?.accentColor || '#000000' }} />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 transition-colors" style={{ borderColor: customData?.accentColor || '#000000' }} />

                    {/* Content inside the cube */}
                    <span className="font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-center" style={{ color: customData?.accentColor || '#EF5304' }}>
                        {el.name}
                    </span>
                    <span className="font-black text-[10px] opacity-20 absolute bottom-1 right-1" style={{ color: customData?.textColor || '#000000' }}>
                        {el.symbol}
                    </span>
                </div>

                {/* Shadow/Depth (Tactical Striped Background) */}
                <div
                    className="absolute top-1.5 left-1.5 w-full h-full border-2 border-black/10 -z-10 group-hover:border-[#EF5304] transition-colors duration-300"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)',
                    }}
                >
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #EF5304 2px, #EF5304 4px)',
                        }}
                    />
                </div>
            </div>

            {/* TEXT (Centered on all devices) */}
            <div className="text-center mt-2 flex-1 relative z-10 py-2 md:py-0">
                <p className="text-lg md:text-sm font-black md:font-bold tracking-tighter md:tracking-normal uppercase mb-2 transition-colors flex items-center justify-center leading-tight" style={{ color: customData?.textColor || '#000000' }}>
                    {el.role}
                </p>
                <p className="text-xs font-mono leading-relaxed max-w-[280px] md:max-w-[180px] mx-auto transition-colors opacity-70" style={{ color: customData?.textColor || '#000000' }}>
                    {el.desc}
                </p>
            </div>

        </motion.div>
    );
};

export const MissingElements: React.FC<{ data?: any }> = ({ data }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = React.useState(false);
    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const displayElements = Array.isArray(data) ? data : (data?.items || ELEMENTS);

    return (
        <section ref={containerRef} className="py-32 md:py-40 border-t border-white/5 overflow-hidden flex items-center min-h-[60vh]" style={{ backgroundColor: data?.backgroundColor || '#ffffff' }}>
            <div className="max-w-7xl mx-auto px-10 md:px-6 w-full">

                {/* Grid with Parallax */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16 items-start">
                    {displayElements.map((el: any, index: number) => (
                        <ParallaxCard
                            key={el.id || index}
                            el={{ ...el, sectionData: data }}
                            index={index}
                            scrollYProgress={scrollYProgress}
                            isMobile={isMobile}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};
