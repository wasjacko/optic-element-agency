import React from 'react';
import { motion } from 'framer-motion';

const LOGO_LIST = [
  "Investor Lift",
  "The Passionate Few",
  "LGC I Power",
  "The Coffe Co",
  "Devotion To Dogs",
  "The Maverick Entrepreneur",
  "Exhort Else",
  "Mindcore",
  "Minico Shibin",
  "Unbroken Fitness Solution"
];

const TacticalReveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  return (
    <div className="relative inline-block">
      <motion.div
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0%)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
        viewport={{ once: true }}
        className="relative whitespace-nowrap align-bottom block"
      >
        <span className="text-sm md:text-base font-medium tracking-wider text-white/40 hover:text-white transition-colors duration-300 cursor-default block px-1 text-center">
          {children}
        </span>
      </motion.div>
    </div>
  );
};

export const Brands: React.FC = () => {
  return (
    <section className="bg-[#050505] py-40 md:py-48 relative z-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-[#FF5000] font-mono text-xs tracking-[0.2em] uppercase mb-12"
        >
          Brands We Serve
        </motion.p>

        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 max-w-4xl mx-auto">
          {LOGO_LIST.map((name, i) => (
            <TacticalReveal key={i} delay={i * 0.1}>
              {name}
            </TacticalReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
