
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const VALUES = [
    {
        id: "01",
        title: "SIMPLICITY",
        desc: "We believe simplicity equals scalability therefore we add by subtraction."
    },
    {
        id: "02",
        title: "RELENTLESS",
        desc: "We believe simplicity equals scalability therefore we add by subtraction."
    },
    {
        id: "03",
        title: "EXCELLENCE",
        desc: "We believe in brand alchemy, therefore we only extract and create gold from your brand."
    },
    {
        id: "04",
        title: "GROWTH MINDED",
        desc: "We believe amateurs study tactics but professionals study logistics; therefore we are consistently learning and growing. Only solving the problems that matter."
    },
    {
        id: "05",
        title: "INTEGRITY",
        desc: "Honesty and transparency even in a difficult situation. Selective clients to partner with. Committed to accountability."
    },
    {
        id: "06",
        title: "INTENTIONAL",
        desc: "We believe in strategically leveraging science and art to stimulate emotion therefore we create with the end in mind"
    }
];

export const DataMetrics = () => {
    return (
        <section className="bg-black text-white py-32 relative border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24">

                {/* 1. STICKY HEADER (Right Side) */}
                <div className="lg:order-2 lg:sticky lg:top-32 lg:h-fit">
                    <div className="mb-12">

                        <h3 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight uppercase text-white mb-6">
                            Our<br />Values.
                        </h3>
                        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#FF5000] leading-relaxed max-w-xs opacity-80">
                            [ Six fundamental principles guiding every pixel and strategy we deploy. ]
                        </p>
                    </div>
                </div>

                {/* 2. THE LIST (Left Side - Clean Editorial Look) */}
                <div className="lg:order-1 flex flex-col">
                    {VALUES.map((item, i) => (
                        <ValueItem key={i} item={item} index={i} />
                    ))}
                </div>

            </div>
        </section>
    );
};

const ValueItem = ({ item, index }: { item: typeof VALUES[0], index: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["center end", "center center"]
    });

    const opacity = useTransform(scrollYProgress, [0, 1], [0.1, 1]);
    const x = useTransform(scrollYProgress, [0, 1], [-10, 0]);

    return (
        <motion.div
            ref={ref}
            style={{ opacity, x }}
            className="group py-12 border-b border-white/5 flex flex-col md:flex-row gap-6 md:items-baseline transition-colors hover:border-white/20"
        >
            <span className="font-mono text-xs text-[#FF5000] tabular-nums opacity-60">
                {item.id}
            </span>

            <div className="flex-1">
                <h3 className="text-3xl font-semibold uppercase tracking-tight mb-3 group-hover:translate-x-2 transition-transform duration-500 ease-out">
                    {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-md group-hover:text-gray-400 transition-colors duration-300 font-light">
                    {item.desc}
                </p>
            </div>
        </motion.div>
    );
};
