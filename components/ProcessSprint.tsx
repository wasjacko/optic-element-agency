
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const SPRINT_STEPS = [
  { id: "01", title: "STRATEGY", first: "S", rest: "TRATEGY", detail: "Hypothesis construction. We map market intelligence to creative growth vectors." },
  { id: "02", title: "PLAN", first: "P", rest: "LAN", detail: "Granular technical blueprints. Selecting optics for surgical precision." },
  { id: "03", title: "ROLE", first: "R", rest: "OLE", detail: "Protocol definition. Assigning high-output creators to specific narrative roles." },
  { id: "04", title: "INITIATE", first: "I", rest: "NITIATE", detail: "Neural processing. Assets refined through proprietary VFX and color logic." },
  { id: "05", title: "NOTIFY", first: "N", rest: "OTIFY", detail: "System check. Multi-channel stress testing for fidelity and validation." },
  { id: "06", title: "TAKEOFF", first: "T", rest: "AKEOFF", detail: "Final deployment. High-impact assets delivered with optimized metadata." }
];

export const ProcessSprint: React.FC = () => {


  return (
    <section className="bg-white pt-56 pb-32 relative overflow-hidden flex flex-col items-center justify-center min-h-[80vh]">

      {/* 1. HEADER */}
      <div className="flex flex-col items-center mb-24 relative z-10">
        <h2 className="font-bold tracking-[0.5em] text-2xl md:text-4xl text-black uppercase leading-none font-sans whitespace-nowrap drop-shadow-md relative inline-block mb-4">
          S.P.R.I.N.T
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            className="absolute -bottom-4 left-0 w-full h-[2px] bg-[#FF5000] origin-left"
          />
        </h2>
        <span className="font-mono text-[9px] tracking-[0.2em] text-gray-400 mt-2 block">
          // our proven system
        </span>
      </div>

      {/* 2. MAIN HORIZONTAL RAIL */}
      <div className="w-full max-w-7xl mx-auto px-6 relative flex items-center justify-between">

        {/* The Connector Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute top-1.5 left-6 right-6 h-px bg-gray-200 z-0 origin-left"
        />

        {SPRINT_STEPS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 + (i * 0.15) }}
            className="relative z-10 flex flex-col items-center group"
          >
            {/* Dot Node */}
            <div className={`w-3 h-3 bg-black border-2 border-white relative z-20 mb-16 shadow-sm`} />

            {/* Label */}
            <div className={`font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold text-gray-400`}>
              <span className="text-[#FF5000]">{step.first}</span>
              {step.rest}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. CTA BUTTON */}
      <div className="mt-32 relative z-10">
        <button className="bg-black text-white px-8 py-5 flex items-center gap-4 group hover:bg-[#FF5000] transition-colors duration-500">
          <span className="text-[10px] font-mono tracking-[0.3em] font-bold uppercase transition-all">
            BOOK FREE CONSULTATION
          </span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </section>
  );
};
