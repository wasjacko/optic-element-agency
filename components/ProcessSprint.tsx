
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

export const ProcessSprint: React.FC<{ onProcessClick?: () => void, data?: any }> = ({ onProcessClick, data }) => {
  const steps = data?.steps || SPRINT_STEPS;
  const title = data?.title || "S.P.R.I.N.T";
  const subtitle = data?.subtitle || "// our proven system";
  const cta = data?.cta || "OUR DETAILLED PROCESS";


  return (
    <section id="process" className="bg-black py-20 md:py-32 relative overflow-hidden flex flex-col items-center justify-center min-h-[50vh]">

      {/* 1. HEADER */}
      <div className="flex flex-col items-center mb-24 relative z-10 text-center">
        <h2 className="font-ocr font-black tracking-[0.15em] text-2xl md:text-3xl text-white uppercase leading-none whitespace-nowrap relative inline-block mb-4">
          {title}
        </h2>
        <span className="font-mono text-[10px] tracking-[0.3em] text-[#FF5000] mt-2 block uppercase">
          {subtitle}
        </span>
      </div>

      {/* 2. MAIN HORIZONTAL RAIL */}
      <div className="w-full max-w-5xl mx-auto px-6 relative">
        <div className="relative flex flex-col md:flex-row items-center md:items-center justify-between w-full">

          {/* The Connector Line (Desktop) */}
          <div className="absolute top-3 left-0 right-0 h-[1px] bg-white/20 z-0 hidden md:block" />

          {/* The Connector Line (Mobile) */}
          <div className="absolute left-3 top-0 bottom-0 w-[1px] bg-white/20 z-0 md:hidden" />

          {steps.map((step: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative z-10 flex md:flex-col flex-row items-center md:items-center gap-4 md:gap-6 w-full md:w-24 group cursor-default mb-8 md:mb-0"
            >
              {/* Node Container */}
              <div className="relative flex-shrink-0 bg-black px-2">
                {/* Visual Square Node */}
                <div className="w-6 h-6 border border-white bg-black relative z-20 flex items-center justify-center transition-all duration-300 transform group-hover:-translate-y-2 group-hover:border-[#FF5000] group-hover:shadow-[0_0_15px_rgba(255,80,0,0.5)]">
                  <div className="w-2 h-2 bg-white group-hover:bg-[#FF5000] transition-colors duration-300" />
                </div>
              </div>

              {/* Text Content */}
              <div className="flex flex-col items-start md:items-center text-left md:text-center w-full pl-4 md:pl-0">
                {/* Title */}
                <div className="font-ocr text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-white mb-1 transition-colors duration-150 transform group-hover:-translate-y-1">
                  <span className="text-[#FF5000]">{step.first}</span>
                  <span className="transition-colors duration-150 group-hover:text-white">{step.rest}</span>
                </div>

                {/* Detail Description (Absolute on Desktop) */}
                <div className="md:absolute md:top-full md:left-1/2 md:-translate-x-1/2 w-max text-center pt-2">
                  <p className="font-mono text-[9px] tracking-[0.1em] text-gray-500 uppercase leading-relaxed whitespace-nowrap opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform md:translate-y-2 md:group-hover:translate-y-0">
                    {step.detail}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. CTA BUTTON */}
      <div className="mt-24 relative z-10">
        <button
          onClick={onProcessClick}
          className="bg-white text-black px-8 py-4 flex items-center gap-4 group hover:bg-[#FF5000] hover:text-white transition-all duration-500"
        >
          <span className="text-[10px] font-mono tracking-[0.2em] font-bold uppercase transition-all">
            {cta}
          </span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </section>
  );
};
