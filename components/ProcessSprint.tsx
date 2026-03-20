
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
    <section id="process" className="pt-12 pb-0 md:pt-32 md:pb-8 relative overflow-hidden flex flex-col items-center justify-center" style={{ backgroundColor: data?.backgroundColor || '#000000' }}>

      {/* 1. HEADER */}
      <div className="flex flex-col items-center mb-12 md:mb-24 relative z-10 text-center">
        <h2 className="font-ocr font-black tracking-[0.15em] text-2xl md:text-3xl uppercase leading-none whitespace-nowrap relative inline-block mb-4" style={{ color: data?.titleColor || '#ffffff' }}>
          {title}
        </h2>
        <span className="font-mono text-[10px] tracking-[0.3em] mt-2 block uppercase" style={{ color: data?.subtitleColor || '#EF5304' }}>
          {subtitle}
        </span>
      </div>

      {/* 2. SPRINT STEPS (MOBILE & DESKTOP LAYOUTS) */}
      <div className="w-full max-w-5xl mx-auto px-10 md:px-6 relative">

        {/* MOBILE LAYOUT: Minimalist Typographic List */}
        <div className="flex md:hidden flex-col w-full border-t border-white/10">
          {steps.map((step: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative flex flex-row items-center border-b border-white/10 py-5 group"
            >
              {/* Giant Initial Letter */}
              <div className="text-[50px] font-black leading-none w-16 flex-shrink-0 group-hover:scale-110 transition-transform duration-500 select-none" style={{ color: data?.accentColor || '#EF5304' }}>
                {step.first}
              </div>

              {/* Text Block */}
              <div className="flex flex-col ml-2 flex-1">
                <h3 className="text-lg font-black tracking-[0.1em] uppercase mb-0.5 leading-none transition-colors duration-300" style={{ color: data?.textColor || '#ffffff' }}>
                  <span className="select-none hidden opacity-20">{step.first}</span>{step.rest}
                </h3>
                <p className="text-[9px] font-ocr tracking-[0.15em] uppercase leading-tight opacity-70" style={{ color: data?.accentColor || '#EF5304' }}>
                  {step.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* DESKTOP LAYOUT: Horizontal Rail */}
        <div className="hidden md:flex relative flex-row items-center justify-between w-full">

          {/* The Connector Line */}
          <div className="absolute top-3 left-0 right-0 h-[1px] bg-white/20 z-0" />

          {steps.map((step: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative z-10 flex flex-col items-center gap-6 w-24 group cursor-default"
            >
              {/* Node Container */}
              <div className="relative flex-shrink-0 bg-black px-2">
                {/* Visual Square Node */}
                <div
                  className="w-6 h-6 border flex items-center justify-center transition-all duration-300 transform group-hover:-translate-y-2"
                  style={{ borderColor: data?.textColor || '#ffffff', backgroundColor: data?.backgroundColor || '#000000' }}
                >
                  <div className="w-2 h-2 transition-colors duration-300" style={{ backgroundColor: data?.accentColor || '#EF5304' }} />
                </div>
              </div>

              {/* Text Content */}
              <div className="flex flex-col items-center text-center w-full">
                {/* Title */}
                <div className="font-ocr text-[11px] font-bold uppercase tracking-[0.15em] mb-1 transition-colors duration-150 transform group-hover:-translate-y-1" style={{ color: data?.textColor || '#ffffff' }}>
                  <span style={{ color: data?.accentColor || '#EF5304' }}>{step.first}</span>
                  <span className="transition-colors duration-150">{step.rest}</span>
                </div>

                {/* Detail Description */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-max text-center pt-2">
                  <p className="font-mono text-[9px] tracking-[0.1em] text-gray-500 uppercase leading-relaxed whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    {step.detail}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. CTA BUTTON */}
      <div className="mt-10 md:mt-16 mb-4 md:mb-8 relative z-10">
        <button
          onClick={onProcessClick}
          className="px-8 py-4 flex items-center gap-4 group hover:opacity-80 transition-all duration-500"
          style={{ backgroundColor: data?.ctaBg || '#ffffff', color: data?.ctaText || '#000000' }}
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
