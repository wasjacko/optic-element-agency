
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const VisualMaker: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll across the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Horizontal parallax: text moves horizontally as we scroll
  const x1 = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative h-[120vh] bg-white overflow-hidden flex items-center justify-center z-20">

      {/* Background Parallax Horizontal Text Layers */}
      <div className="absolute inset-0 flex flex-col justify-center gap-4 md:gap-8 pointer-events-none">
        <motion.div
          style={{ x: x1, opacity }}
          className="text-[10rem] md:text-[20rem] font-black uppercase tracking-tighter text-black/[0.02] select-none italic whitespace-nowrap"
        >
          VISUAL MATTER VISUAL MATTER VISUAL MATTER
        </motion.div>

        <motion.div
          style={{ x: x2, opacity }}
          className="text-[10rem] md:text-[20rem] font-black uppercase tracking-tighter text-black/[0.02] select-none whitespace-nowrap"
        >
          REFINED VISION REFINED VISION REFINED VISION
        </motion.div>
      </div>

      {/* Centerpiece Technical Typography */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center space-y-8 md:space-y-12"
      >
        <div className="flex flex-col items-center gap-6 md:gap-8">
          <div className="mb-8" />
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 border border-black rounded-full animate-ping" />
            <span className="text-black font-mono text-[10px] md:text-xs tracking-[1.2em] uppercase font-bold">
              aesthetic_engine_v4
            </span>
          </div>
        </div>

        <div className="space-y-2 md:space-y-4">
          <h2 className="text-4xl md:text-9xl font-light tracking-tighter text-black uppercase leading-none">
            RAW MATERIALS.
          </h2>
          <h2 className="text-4xl md:text-9xl font-light tracking-tighter text-black/20 uppercase leading-none italic">
            REFINED VISION.
          </h2>
        </div>

        <div className="flex flex-col items-center gap-6 mt-8 md:mt-12">
          <div className="text-[9px] md:text-[10px] font-mono text-black/30 uppercase tracking-[0.6em] font-bold">
            INITIALIZING_PRODUCTION_LOGIC
          </div>

          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                className="w-1.5 h-1.5 bg-black/40 rounded-full"
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Technical Grid Accents */}
      <div className="absolute inset-x-0 top-0 h-px border-t border-dashed border-gray-100 mx-auto max-w-7xl" />
      <div className="absolute inset-x-0 bottom-0 h-px border-b border-dashed border-gray-100 mx-auto max-w-7xl" />
      <div className="absolute inset-y-0 left-1/2 w-px border-l border-dashed border-gray-100 -translate-x-1/2" />
    </section>
  );
};
