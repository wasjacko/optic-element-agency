
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight, Plus, Minus } from 'lucide-react';

interface AboutProps {
  onContactClick: () => void;
}

const TEAM_MEMBERS = [
  { name: "Santiago Castro", role: "CEO", img: "/santiago-castro.png" },
  { name: "Luigi Ritchie", role: "COO", img: "/luigi-ritchie.png" },
  { name: "Dharimar Castro", role: "Relational Manager", img: "/dharimar-castro.png" },
  { name: "Atreyu Hondo", role: "Creative Strategist", img: "/atreyu-hondo.png" },
  { name: "Deztney Ayala", role: "Client Success Manager", img: "/deztney-ayala.png" },
  { name: "Ryan Lotze", role: "Creative Lead Videographer", img: "/ryan-lotze.png" },
  { name: "Joseph Robles", role: "Real Estate Creative Strategist", img: "/joseph-robles.png" },
  { name: "Henry Villasmil", role: "Graphic Designer", img: "/henry-villasmil.png" },
  { name: "Cesar Salais", role: "Editor/Videographer", img: "/cesar-salais.png" },
  { name: "Chloe Johnston", role: "Photographer", img: "/chloe-johnston.png" },
  { name: "Mike Smith", role: "Videographer", img: "/mike-smith.png" }
];

// Added Scientific/Chemical Properties to each differentiator
const DIFFERENTIATORS = [
  {
    title: "All Inclusive",
    desc: "Photography, videography, graphic design, strategy. We do it all in-house. No friction, just results.",
    symbol: "Ai",
    atomicNumber: "12",
    mass: "24.055",
    group: "PRODUCTION",
    config: "[He] 2s²"
  },
  {
    title: "Deep Understanding",
    desc: "We don't just execute; we learn your industry. Your priority becomes ours to create strategies that actually work.",
    symbol: "Du",
    atomicNumber: "48",
    mass: "96.412",
    group: "STRATEGY",
    config: "[Kr] 4d¹⁰"
  },
  {
    title: "Time Multiplier",
    desc: "We duplicate your digital presence, saving you time while maximizing your impact across all channels.",
    symbol: "Tm",
    atomicNumber: "84",
    mass: "168.93",
    group: "SCALING",
    config: "[Xe] 6s²"
  }
];

const TacticalReveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  return (
    <div className="relative inline-block mx-1">
      <motion.div
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0%)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
        viewport={{ once: true }}
        className="relative whitespace-nowrap align-bottom block"
      >
        <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase text-white cursor-default block">
          {children}
        </span>
      </motion.div>
    </div>
  );
};

export const About: React.FC<AboutProps> = ({ onContactClick }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen font-sans bg-white overflow-x-hidden pt-24 selection:bg-black selection:text-white">

      {/* SECTION 1: HEADER */}
      <section className="relative pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-black mb-12 uppercase text-center">
            Who We Are
          </h1>
        </div>
      </section>

      {/* SECTION 2: TEAM VIDEO */}
      <section className="relative bg-white pt-0 pb-0">
        <div className="max-w-[1600px] mx-auto px-6 relative z-10">
          <div className="w-full aspect-[21/9] md:aspect-[21/8] overflow-hidden border border-gray-100">
            <video
              src="https://video.wixstatic.com/video/8fb0bb_3101935948d84d248cbb6453b7ba87e8/720p/mp4/file.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover grayscale"
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: MEET THE TEAM (DARK INDUSTRIAL) */}
      <section className="bg-black text-white pt-48 pb-48 relative overflow-hidden border-t border-white/10">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#FF5000] blur-[120px] rounded-full pointer-events-none opacity-40 mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#FF5000] blur-[140px] rounded-full pointer-events-none opacity-35 mix-blend-screen" />
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#FF5000 1px, transparent 1px)', backgroundSize: '4px 4px' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center mb-24">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-white font-mono text-[10px] tracking-[0.8em] uppercase font-bold text-center underline underline-offset-[12px] decoration-white/30 mb-12"
            >
              THE TEAM
            </motion.h2>


            <div className="flex justify-center max-w-3xl px-6 leading-relaxed">
              <TacticalReveal delay={0.2}>
                "If you want to go fast, go alone. If you want to go far, go together."
              </TacticalReveal>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {TEAM_MEMBERS.map((member, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.02, duration: 0.4 }} className="relative flex flex-col group">
                <div className="relative w-full overflow-hidden bg-gray-900 border border-white/10 rounded-sm">
                  {member.img ? <img src={member.img} alt={member.name} className="w-full h-auto block" /> : <div className="w-full aspect-[4/5] bg-[#111] flex items-center justify-center"><div className="w-12 h-12 rounded-full border border-white/10" /></div>}
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex justify-center mt-48">
            <button onClick={onContactClick} className="group relative flex items-center gap-6 py-6 px-16 border border-white/10 text-white transition-all duration-700 overflow-hidden hover:border-white">
              <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.5em] group-hover:translate-x-2 transition-transform duration-500">JOIN_THE_TEAM</span>
              <ArrowUpRight size={18} className="relative z-10 transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-1" />
              <div className="absolute inset-x-0 bottom-0 h-0 bg-white group-hover:h-full transition-all duration-700 ease-[0.16,1,0.3,1]" />
              <span className="absolute inset-0 z-20 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-700 text-[11px] font-bold uppercase tracking-[0.5em]">JOIN_THE_TEAM</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: WHAT MAKES US DIFFERENT (INNOVATIVE FLEX CARDS) */}
      <section className="bg-white text-black py-32 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col items-center mb-20">
            <h2 className="font-mono text-[10px] md:text-xs tracking-[0.6em] md:tracking-[0.8em] uppercase font-bold text-black text-center underline underline-offset-[12px] decoration-[#FF5000]">
              WHAT MAKES US DIFFERENT?
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12 h-auto items-stretch">
            {DIFFERENTIATORS.map((item, i) => (
              <div
                key={i}
                className="group relative flex-1 bg-white border border-black/10 hover:border-transparent hover:bg-black hover:text-white p-8 md:p-10 flex flex-col justify-between transition-all duration-700 ease-[0.16,1,0.3,1] hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Corner Squares - Reference Style */}
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-black group-hover:bg-[#FF5000] transition-colors duration-700 z-20" />
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-black group-hover:bg-[#FF5000] transition-colors duration-700 z-20" />
                <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-black group-hover:bg-[#FF5000] transition-colors duration-700 z-20" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-black group-hover:bg-[#FF5000] transition-colors duration-700 z-20" />

                {/* Connecting Lines (Frame) */}
                <div className="absolute inset-0 border border-black group-hover:border-[#FF5000]/50 transition-colors duration-700 pointer-events-none" />

                {/* Header Area */}
                <div className="relative z-10 border-b border-black/10 group-hover:border-white/20 pb-6 mb-6 transition-colors duration-700">
                  <div className="flex justify-between items-center mb-4 opacity-40 font-mono text-xs group-hover:opacity-60 transition-opacity duration-700">
                    <span>0{i + 1}</span>
                    <span className="uppercase tracking-widest">{item.group}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase leading-[0.9] tracking-tighter">
                    {item.title}
                  </h3>
                </div>

                {/* Body Area */}
                <div className="relative z-10 flex-grow">
                  <p className="text-sm font-medium leading-relaxed opacity-60 group-hover:opacity-90 transition-opacity duration-700">
                    {item.desc}
                  </p>
                </div>

                {/* Hover Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF5000]/20 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-24 flex justify-center">
            <button
              onClick={onContactClick}
              className="bg-black text-white px-12 py-5 text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:bg-gray-900"
            >
              Book a Call
            </button>
          </div>

        </div>
      </section>

    </div >
  );
};
