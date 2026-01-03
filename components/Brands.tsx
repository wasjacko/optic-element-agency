
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
    <section className="bg-[#050505] py-48 relative overflow-hidden z-20 border-t border-white/5">
      {/* Simplified High-Visibility Grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:400px_400px]" />
        {/* Fade Out Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Tactical Header */}
        <div className="flex flex-col items-center mb-24 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative inline-block"
          >
            <h2 className="text-white font-mono text-xs md:text-sm tracking-[0.5em] uppercase font-black relative z-10">
              BRANDS WE SERVE
            </h2>
            <div className="absolute -bottom-4 left-0 w-full h-[3px] bg-[#FF5000]" />
          </motion.div>
        </div>

        {/* Simple List Grid - Compact & Small */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-wrap justify-center gap-x-12 gap-y-12 max-w-5xl mx-auto relative"
        >
          {LOGO_LIST.map((name, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="relative"
            >
              <span className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 transition-colors duration-300">
                {name}
              </span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
