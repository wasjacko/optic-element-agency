
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: any = {
  hidden: {
    opacity: 0,
    y: 10
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
};

export const Brands: React.FC = () => {
  return (
    <section className="bg-tech-black py-32 relative overflow-hidden z-20 border-t border-dashed border-white/[0.03]">

      {/* Subtle Vertical Guide */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full border-l border-dashed border-white/[0.01] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header Section */}
        <div className="flex flex-col items-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-tech-accent font-mono text-[10px] tracking-[1.2em] uppercase font-black mb-2">
              BRANDS WE SERVE
            </span>
          </motion.div>
          <div className="w-px h-10 bg-gradient-to-b from-white/[0.05] to-transparent mt-6" />
        </div>

        {/* Minimal Staggered Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-wrap justify-center items-center gap-x-10 gap-y-8 md:gap-x-16 md:gap-y-12"
        >
          {LOGO_LIST.map((name, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="relative"
            >
              <span className="text-[10px] md:text-[11px] font-mono font-black tracking-[0.3em] uppercase text-white/50 whitespace-nowrap cursor-default hover:text-white transition-colors">
                {name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Technical Footer Logs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.0 }}
          className="mt-24 flex justify-center"
        >
          <div className="flex items-center gap-8 font-mono text-[6px] text-white/[0.03] uppercase tracking-[0.8em]">
            <span>REF_ARCHIVE</span>
            <div className="w-[1px] h-2 bg-white/[0.03]" />
            <span>STABLE</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
