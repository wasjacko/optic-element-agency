
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const AnimatedText: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);

  return (
    <div
      ref={containerRef}
      className="relative h-[50vh] overflow-hidden bg-white flex flex-col justify-center border-y border-gray-100 z-20"
    >
      <div className="flex flex-col gap-6 opacity-30">
        <motion.div
          style={{ x: x1 }}
          className="whitespace-nowrap flex gap-12 text-6xl md:text-[12rem] font-black text-black/[0.02] select-none tracking-tighter uppercase italic"
        >
          <span>VISUAL MATTER</span>
          <span className="text-black/5" style={{ WebkitTextStroke: '1px rgba(0,0,0,0.1)', color: 'transparent' }}>HIGH OUTPUT</span>
          <span>VISUAL MATTER</span>
          <span className="text-black/5" style={{ WebkitTextStroke: '1px rgba(0,0,0,0.1)', color: 'transparent' }}>HIGH OUTPUT</span>
        </motion.div>

        <motion.div
          style={{ x: x2 }}
          className="whitespace-nowrap flex gap-12 text-6xl md:text-[12rem] font-light text-black/[0.01] select-none tracking-tighter uppercase"
        >
          <span className="font-mono">GROWTH ENGINE</span>
          <span className="text-black/[0.05]">SYSTEMS</span>
          <span className="font-mono">GROWTH ENGINE</span>
          <span className="text-black/[0.05]">SYSTEMS</span>
        </motion.div>
      </div>

      {/* Central Technical Focus */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <div className="w-1.5 h-1.5 bg-black rounded-full animate-ping" />
        <div className="h-20 w-px bg-gradient-to-b from-transparent via-black/10 to-transparent" />
      </div>
    </div>
  );
};
