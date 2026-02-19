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
    // Parallax Logic: Even items move down, Odd items move up relative to scroll
    const y = useTransform(
        scrollYProgress,
        [0, 1],
        index % 2 === 0 ? [0, 100] : [0, -100]
    );

    return (
        <motion.div
            style={{ y }}
            className={`flex flex-col items-center group ${index % 2 === 1 ? 'md:mt-16' : ''}`}
        >
            {/* CUBE (Visual Only) - Fixed Position on Hover */}
            <div className="relative w-24 h-24 mb-6 cursor-pointer">

                {/* Cube Face (Front) */}
                <div className="absolute inset-0 border-2 border-black bg-white flex flex-col justify-between p-2 z-20 transition-colors duration-300 group-hover:bg-black group-hover:border-black">

                    {/* BRACKETS (Corner Accents) */}
                    <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-black transition-colors group-hover:border-[#FF5000]" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-black transition-colors group-hover:border-[#FF5000]" />
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-black transition-colors group-hover:border-[#FF5000]" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-black transition-colors group-hover:border-[#FF5000]" />

                    {/* Content */}
                    <div className="flex justify-between items-start font-mono text-[8px] font-bold text-black/50 group-hover:text-white/50 transition-colors">
                        <span>{el.id}</span>
                        <span>{el.mass}</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <span className="text-3xl font-black tracking-tighter group-hover:text-white transition-colors">{el.symbol}</span>
                    </div>
                </div>

                {/* Shadow/Depth (Tactical Striped Background) - Fixed Position */}
                <div
                    className="absolute top-2 left-2 w-full h-full border-2 border-black/10 -z-10 group-hover:border-[#FF5000] transition-colors duration-300"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)',
                    }}
                >
                    {/* Hover Striped Overlay (Orange) */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #FF5000 2px, #FF5000 4px)',
                        }}
                    />
                </div>
            </div>

            {/* TEXT (Always Visible) */}
            <div className="text-center mt-4">
                <h3 className="font-mono text-xs text-[#FF5000] uppercase tracking-widest mb-2 font-bold opacity-80 group-hover:opacity-100 group-hover:tracking-[0.2em] transition-all">
                    {el.name}
                </h3>
                <p className="text-sm font-bold uppercase mb-2 group-hover:text-black transition-colors">
                    {el.role}
                </p>
                <p className="text-xs text-gray-400 font-mono leading-relaxed max-w-[180px] mx-auto group-hover:text-gray-600 transition-colors">
                    {el.desc}
                </p>
            </div>

        </motion.div>
    );
};

export const MissingElements: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    return (
        <section ref={containerRef} className="bg-white text-black py-32 border-t border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-24">
                    <h2 className="font-ocr text-sm md:text-base tracking-[0.3em] uppercase font-bold text-black mb-4">
                        AGENCY ELEMENTS
                    </h2>
                </div>

                {/* Grid with Parallax */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-start min-h-[400px]">
                    {ELEMENTS.map((el, index) => (
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
