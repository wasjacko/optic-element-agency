
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const SPRINT_STEPS = [
  { first: "S", rest: "TRATEGY" },
  { first: "P", rest: "LAN" },
  { first: "R", rest: "OLE" },
  { first: "I", rest: "NITIATE" },
  { first: "N", rest: "OTIFY" },
  { first: "T", rest: "AKEOFF" }
];

export const PerspectiveGrid: React.FC = () => {
  return (
    <section className="relative w-full bg-white flex flex-col items-center justify-center overflow-hidden py-40 border-t border-gray-100">

      <div className="w-full max-w-7xl mx-auto px-6 text-center relative z-10">
        {/* Tactical Section Header */}
        <div className="flex flex-col items-center mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative inline-block"
          >
            <h2 className="text-black font-mono text-xs md:text-sm tracking-[0.5em] uppercase font-black relative z-10">
              S . P . R . I . N . T .
            </h2>
            <div className="absolute -bottom-4 left-0 w-full h-[3px] bg-[#FF5000]" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            className="font-mono text-[8px] md:text-[9px] tracking-[0.2em] mt-8 block text-black"
          >
            // our proven system
          </motion.span>
        </div>

        <div className="relative w-full max-w-5xl mx-auto mb-16">
          <div className="relative h-px bg-black/10 w-full mb-12">
            {/* Main Rail Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0 bg-black origin-center"
            />

            {/* Terminal Squares (End of Line) */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-1.5 h-1.5 bg-black" />

            {/* Step Marker Squares */}
            {SPRINT_STEPS.map((_, i) => (
              <div
                key={`marker-${i}`}
                className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black"
                style={{ left: `${(i / (SPRINT_STEPS.length - 1)) * 100}%`, transform: 'translate(-50%, -50%)' }}
              />
            ))}
          </div>

          <div className="flex justify-between mt-12">
            {SPRINT_STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="flex flex-col items-center w-0 overflow-visible"
                style={{ flexBasis: "0%" }}
              >
                <div className="whitespace-nowrap font-mono text-[11px] md:text-xs tracking-[0.4em] font-bold text-black">
                  <span className="text-[#FF5000]">{step.first}</span>
                  <span className="text-black">{step.rest}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-24">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="relative flex items-center gap-6 py-6 px-12 bg-black text-white font-bold transition-all duration-300 pointer-events-auto shadow-xl"
            >
              <span className="relative z-10 text-[11px] uppercase tracking-[0.4em]">BOOK FREE CONSULTATION</span>
              <ArrowRight size={18} className="relative z-10" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};
