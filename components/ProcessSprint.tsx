
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const SPRINT_STEPS = [
  { id: "01", title: "STRATEGY", first: "S", rest: "TRATEGY", detail: "Define the Vision" },
  { id: "02", title: "PLAN", first: "P", rest: "LAN", detail: "Map Out the Content" },
  { id: "03", title: "ROLE", first: "R", rest: "OLE", detail: "Lights, Camera, Action." },
  { id: "04", title: "INITIATE", first: "I", rest: "NITIATE", detail: "Edit + Polish" },
  { id: "05", title: "NOTIFY", first: "N", rest: "OTIFY", detail: "Get Your Input" },
  { id: "06", title: "TAKEOFF", first: "T", rest: "AKEOFF", detail: "Launch & Celebrate" }
];

export const ProcessSprint: React.FC<{ onProcessClick?: () => void }> = ({ onProcessClick }) => {


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
      <div className="w-full max-w-7xl mx-auto px-6 relative">
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-12 md:gap-0">

          {/* The Connector Line (Desktop) */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-8 left-0 right-0 h-[4px] bg-black z-0 origin-left hidden md:block" // Stronger line
          />

          {/* The Connector Line (Mobile) */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-8 top-0 bottom-0 w-[4px] bg-black z-0 origin-top md:hidden"
          />

          {SPRINT_STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="relative z-10 flex md:flex-col flex-row items-center md:items-center gap-6 md:gap-0 group w-full md:w-auto"
            >
              {/* Node Container */}
              <div className="relative flex items-center justify-center">
                {/* Just the Black Square Node */}
                <div className="w-4 h-4 bg-black relative z-20 mt-6 md:mb-8 shadow-sm" />
              </div>

              {/* Text Content */}
              <div className="flex flex-col md:items-center text-left md:text-center">
                {/* Big Letter Title */}
                <h3 className={`font-sans text-xl md:text-2xl font-bold uppercase tracking-widest text-black mb-2`}>
                  <span className="text-[#FF5000] text-2xl md:text-3xl">{step.first}</span>{step.rest}
                </h3>

                {/* Detail Description */}
                <p className="max-w-[200px] text-xs font-medium text-gray-400 leading-relaxed md:block">
                  {step.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. CTA BUTTON */}
      <div className="mt-32 relative z-10">
        <button
          onClick={onProcessClick}
          className="bg-black text-white px-8 py-5 flex items-center gap-4 group hover:bg-[#FF5000] transition-colors duration-500"
        >
          <span className="text-[10px] font-mono tracking-[0.3em] font-bold uppercase transition-all">
            OUR DETAILLED PROCESS
          </span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </section>
  );
};
