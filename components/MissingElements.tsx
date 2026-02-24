import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ELEMENTS = [
    {
        id: '20',
        symbol: 'oE',
        mass: '40.078',
        name: 'Identity',
        role: 'Brand Strategy',
        desc: 'Crafting comprehensive visual systems. From logos to guidelines.'
    },
    {
        id: '05',
        symbol: 'Pa',
        mass: '10.811',
        name: 'Growth',
        role: 'User Acquisition',
        desc: 'Data-driven performance marketing to scale revenue.'
    },
    {
        id: '01',
        symbol: 'Lb',
        mass: '1.008',
        name: 'Content',
        role: 'Production Lab',
        desc: 'High-fidelity assets. Photography, video, and 3D motion.'
    },
    {
        id: '15',
        symbol: 'Mx',
        mass: '30.974',
        name: 'Systems',
        role: 'Operations',
        desc: 'Automating workflows with Notion & Zapier for scalability.'
    },
];

const ParallaxCard = ({ el, index, scrollYProgress }: { el: any, index: number, scrollYProgress: any }) => {
    const [isMobile, setIsMobile] = React.useState(false);
    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Parallax Logic: Even items move down, Odd items move up relative to scroll
    const y = useTransform(
        scrollYProgress,
        [0, 1],
        isMobile ? [0, 0] : (index % 2 === 0 ? [0, 100] : [0, -100])
    );

    return (
        <motion.div
            style={{ y }}
            className={`flex flex-col items-center group ${index % 2 === 1 ? 'md:mt-16' : ''} w-full relative`}
        >
            {/* CUBE (Desktop & Mobile) - Fixed Position on Hover */}
            <div className="relative w-20 h-20 md:w-20 md:h-20 mb-2 md:mb-4 cursor-pointer flex-shrink-0 mx-auto">
                {/* Cube Face (Front) */}
                <div className="absolute inset-0 border-2 border-black bg-white flex flex-col justify-center items-center p-1 z-20 transition-colors duration-300 group-hover:bg-black group-hover:border-black">
                    {/* BRACKETS (Corner Accents) */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-black transition-colors group-hover:border-[#FF5000]" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-black transition-colors group-hover:border-[#FF5000]" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-black transition-colors group-hover:border-[#FF5000]" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-black transition-colors group-hover:border-[#FF5000]" />

                    {/* Content inside the cube */}
                    <span className="font-mono text-[9px] md:text-[10px] font-bold text-[#FF5000] uppercase tracking-widest text-center">
                        {el.name}
                    </span>
                    <span className="font-black text-[10px] text-black/20 group-hover:text-white/20 absolute bottom-1 right-1">
                        {el.symbol}
                    </span>
                </div>

                {/* Shadow/Depth (Tactical Striped Background) */}
                <div
                    className="absolute top-1.5 left-1.5 w-full h-full border-2 border-black/10 -z-10 group-hover:border-[#FF5000] transition-colors duration-300"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)',
                    }}
                >
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #FF5000 2px, #FF5000 4px)',
                        }}
                    />
                </div>
            </div>

            {/* TEXT (Centered on all devices) */}
            <div className="text-center mt-2 flex-1 relative z-10 py-2 md:py-0">
                <p className="text-lg md:text-sm font-black md:font-bold tracking-tighter md:tracking-normal uppercase mb-2 text-black transition-colors flex items-center justify-center leading-tight">
                    {el.role}
                </p>
                <p className="text-xs text-gray-500 md:text-gray-400 font-mono leading-relaxed max-w-[280px] md:max-w-[180px] mx-auto transition-colors">
                    {el.desc}
                </p>
            </div>

        </motion.div>
    );
};

export const MissingElements: React.FC<{ data?: any[] }> = ({ data }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const displayElements = data || ELEMENTS;

    return (
        <section ref={containerRef} className="bg-white text-black py-32 border-t border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-10 md:px-6">



                {/* Grid with Parallax */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16 items-start min-h-[400px]">
                    {displayElements.map((el, index) => (
                        <ParallaxCard
                            key={el.id}
                            el={el}
                            index={index}
                            scrollYProgress={scrollYProgress}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};
