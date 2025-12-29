
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface AboutProps {
  onContactClick: () => void;
  onHomeClick: () => void;
}

const TEAM_MEMBERS = [
  { name: "PERSONA 1", role: "Founder & CEO", img: "" },
  { name: "PERSONA 2", role: "Creative Lead", img: "" },
  { name: "PERSONA 3", role: "Ops Director", img: "" },
  { name: "PERSONA 4", role: "Tech Lead", img: "" },
  { name: "PERSONA 5", role: "Brand Strategist", img: "" },
  { name: "PERSONA 6", role: "Account Manager", img: "" },
  { name: "PERSONA 7", role: "Dev Lead", img: "" },
  { name: "PERSONA 8", role: "Creative", img: "" },
  { name: "PERSONA 9", role: "Designer", img: "" },
  { name: "PERSONA 10", role: "Visual Designer", img: "" },
  { name: "PERSONA 11", role: "Developer", img: "" }
];

const VALUES = [
  { title: "INTEGRITY", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam." },
  { title: "RELENTLESS", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam." },
  { title: "GROWTH MINDED", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam." },
  { title: "INTENTIONAL", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam." }
];

const BarRevealText: React.FC<{ text: string; className?: string }> = ({ text, className = "" }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* Skeleton for space */}
      <span className="opacity-0 whitespace-nowrap font-mono tracking-[0.3em] text-[10px] uppercase">{text}</span>

      {/* Hidden container that expands for reveal effect */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: '100%' }}
        viewport={{ once: true }}
        transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="absolute top-0 left-0 h-full overflow-hidden whitespace-nowrap"
      >
        <span className="font-mono tracking-[0.3em] text-[10px] text-white uppercase">{text}</span>
      </motion.div>
    </div>
  );
};

export const About: React.FC<AboutProps> = ({ onContactClick, onHomeClick }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen font-sans bg-white overflow-x-hidden pt-24 selection:bg-black selection:text-white">

      {/* SECTION 1: HEADER (BOLD) */}
      <section className="relative pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <h1
            className="text-6xl md:text-9xl font-black tracking-tighter text-black mb-12 uppercase text-center"
            style={{ fontFamily: '"Tactic Sans Exd", sans-serif' }}
          >
            ABOUT US
          </h1>
        </div>
      </section>

      {/* SECTION 2: TEAM PHOTO SECTION */}
      <section className="relative bg-white pt-0 pb-0 shadow-sm">
        {/* Big Team Collective Photo */}
        <div className="max-w-[1600px] mx-auto px-6 relative z-10">
          <div
            className="w-full aspect-[21/9] md:aspect-[21/8] overflow-hidden transition-all duration-1000 group cursor-crosshair border border-black/5 shadow-2xl"
          >
            <img
              src="https://static.wixstatic.com/media/8fb0bb_c5fa54381baf47ccb388a184609da19e~mv2.jpg/v1/fill/w_2330,h_1260,al_b,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/8fb0bb_c5fa54381baf47ccb388a184609da19e~mv2.jpg"
              alt="Team Collective"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: MEET THE TEAM (Straight Transition) */}
      <section className="bg-black text-white pt-48 pb-48 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Aligned Title Style (Testimonials Style) */}
          <div className="flex flex-col items-center mb-24">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-white font-mono text-[12px] tracking-[1em] uppercase font-black text-center relative pb-4 w-fit mx-auto"
            >
              MEET THE TEAM
              <div className="absolute bottom-0 left-0 w-full h-[6px] bg-orange-tactical" />
            </motion.h2>
            <div className="mb-16" />

            <BarRevealText text="If you want to go fast, go alone. If you want to go far, go together." />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-16">
            {TEAM_MEMBERS.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.8 }}
                className="group flex flex-col items-center"
              >
                <div className="relative aspect-[3/4] w-full bg-white/[0.03] border border-white/5 overflow-hidden mb-8 shadow-xl">
                  <div className="w-full h-full grayscale transition-all duration-1000 opacity-40 group-hover:opacity-100" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-[11px] md:text-[12px] font-black tracking-[0.2em] uppercase text-white/90 group-hover:text-white transition-colors">{member.name}</h3>
                  <p className="text-[9px] font-mono text-white/30 tracking-[0.3em] uppercase">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center mt-48"
          >
            <button
              onClick={onContactClick}
              className="group relative bg-white text-black px-20 py-5 text-[11px] font-black tracking-[0.5em] uppercase border border-white transition-all duration-700 overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              <span className="relative z-10 group-hover:text-white">JOIN US</span>
              <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: DIFFERENT */}
      <section className="bg-black text-white py-48 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Aligned Title Style (Testimonials Style) */}
          <div className="flex flex-col items-center mb-32">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-white font-mono text-[12px] tracking-[1em] uppercase font-black text-center relative pb-4 w-fit mx-auto"
            >
              What Makes Us diffEReNt?
              <div className="absolute bottom-0 left-0 w-full h-[6px] bg-orange-tactical" />
            </motion.h2>
            <div className="mb-16" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "WE ARE ALL INCLUSIVE",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
              },
              {
                title: "WE UNDERSTAND WHAT YOU DO",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
              },
              {
                title: "WE HELP YOU SAVE TIME AND MULTIPLY IT",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white/[0.02] border border-white/5 p-12 space-y-8 hover:bg-white/[0.04] transition-all duration-500 group shadow-lg"
              >
                <div className="space-y-6">
                  <h3 className="text-xl font-black tracking-[0.1em] text-white/90 leading-snug">{item.title}</h3>
                  <p className="text-[13px] font-light text-white/40 leading-relaxed uppercase tracking-[0.05em] group-hover:text-white/60 transition-colors">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: VALUES (WHITE BACKGROUND) */}
      <section className="bg-white text-black pt-24 pb-72 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Aligned Title Style (Testimonials Style) */}
          <div className="flex flex-col items-center mb-40">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-black font-mono text-[12px] tracking-[1em] uppercase font-black text-center relative pb-4 w-fit mx-auto"
            >
              OUR VALUES
              <div className="absolute bottom-0 left-0 w-full h-[6px] bg-orange-tactical" />
            </motion.h2>
            <div className="mb-16" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12">
            {VALUES.map((val, i) => (
              <motion.div
                key={i}
                className="space-y-6 flex flex-col items-center text-center md:items-start md:text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-black tracking-tight uppercase text-black leading-tight">
                    {val.title}
                  </h3>
                </div>
                <p className="text-[13px] font-light text-black/40 leading-relaxed uppercase tracking-wide">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mt-56"
          >
            <button
              onClick={onContactClick}
              className="group relative bg-black text-white px-24 py-6 text-[12px] font-black tracking-[0.7em] uppercase border border-black transition-all duration-1000 flex items-center gap-6 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.1)]"
            >
              <span className="relative z-10 group-hover:text-black">BOOK CALL</span>
              <ChevronRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
              <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
            </button>
          </motion.div>
        </div>
      </section>

    </div>
  );
};
