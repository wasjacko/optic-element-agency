
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Target, Database, UserCheck, Zap, Activity, Rocket, ArrowUpRight } from 'lucide-react';

const SPRINT_STEPS = [
  { id: "01", title: "STRATEGY", first: "S", rest: "TRATEGY", icon: <Target size={32} />, detail: "Hypothesis construction. We map market intelligence to creative growth vectors and define the operational North Star." },
  { id: "02", title: "PLAN", first: "P", rest: "LAN", icon: <Database size={32} />, detail: "Granular technical blueprints. Selecting cinema optics for 8K surgical precision and logistical synchronicity." },
  { id: "03", title: "ROLE", first: "R", rest: "OLE", icon: <UserCheck size={32} />, detail: "Protocol definition. Assigning high-output creators to specific narrative roles to ensure creative velocity." },
  { id: "04", title: "INITIATE", first: "I", rest: "NITIATE", icon: <Zap size={32} />, detail: "Neural processing. Assets refined through proprietary VFX, color logic, and structural assembly." },
  { id: "05", title: "NOTIFY", first: "N", rest: "OTIFY", icon: <Activity size={32} />, detail: "System check. Multi-channel stress testing for cross-platform fidelity and aesthetic validation." },
  { id: "06", title: "TAKEOFF", first: "T", rest: "AKEOFF", icon: <Rocket size={32} />, detail: "Final deployment. High-impact assets delivered with optimized metadata for maximum market penetration." }
];

const SprintCard: React.FC<{ step: typeof SPRINT_STEPS[0], index: number, progress: any }> = ({ step, index, progress }) => {
  const cardProgress = useTransform(progress,
    [0.1 + (index * 0.12), 0.18 + (index * 0.12), 0.26 + (index * 0.12)],
    [-100, 0, 100]
  );

  const rotateY = useTransform(cardProgress, [-100, 0, 100], [45, 0, -45]);
  const z = useTransform(cardProgress, [-100, 0, 100], [-300, 50, -300]);
  const opacity = useTransform(cardProgress, [-100, -25, 0, 25, 100], [0, 0.4, 1, 0.4, 0]);
  const blur = useTransform(cardProgress, [-100, 0, 100], ["blur(15px)", "blur(0px)", "blur(15px)"]);
  const scale = useTransform(cardProgress, [-100, 0, 100], [0.85, 1.1, 0.85]);

  return (
    <motion.div
      style={{
        rotateY,
        z,
        opacity,
        filter: blur,
        scale,
        perspective: "1200px",
        boxShadow: useTransform(cardProgress, [-20, 0, 20], ["0 0 0px transparent", "0 40px 120px rgba(0,0,0,0.15)", "0 0 0px transparent"])
      }}
      className="flex-shrink-0 w-[320px] md:w-[500px] h-[550px] bg-white border border-black/[0.08] p-12 flex flex-col justify-between relative group"
    >
      <motion.div
        style={{ opacity: useTransform(cardProgress, [-15, 0, 15], [0, 1, 0]) }}
        className="absolute inset-0 border-2 border-black pointer-events-none opacity-0"
      />

      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-black/10 group-hover:border-black transition-colors duration-500" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-black/10 group-hover:border-black transition-colors duration-500" />

      <div className="flex justify-between items-start">
        <motion.div
          style={{ scale: useTransform(cardProgress, [-10, 0, 10], [1, 1.2, 1]) }}
          className="text-black opacity-20 group-hover:opacity-100 transition-all duration-700"
        >
          {step.icon}
        </motion.div>
        <div className="flex flex-col items-end">
          <span className="text-8xl font-black text-black/[0.03] font-mono leading-none tracking-tighter absolute -top-4 -right-2 select-none">
            {step.id}
          </span>
          <span className="text-[10px] font-mono text-black/20 tracking-[0.4em] uppercase font-bold relative z-10">
            <span className="text-[#FF5000]">STP_</span>{step.id}
          </span>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        <h3 className="text-6xl font-light tracking-tighter text-black uppercase leading-[0.85]">
          <span className="text-[#FF5000] font-black">{step.first}</span>
          {step.rest}
        </h3>
        <p className="text-black text-base leading-relaxed font-light max-w-[95%]">
          {step.detail}
        </p>
      </div>

      <div className="pt-10 border-t border-dashed border-black/10 flex justify-between items-center text-[8px] font-mono text-black/40 uppercase tracking-[0.4em]">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 bg-black rounded-full"
          />
          <span>SYNCED</span>
        </div>
        <span className="font-bold opacity-30">LIVE</span>
      </div>
    </motion.div>
  );
};

export const ProcessSprint: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 20,
    restDelta: 0.001
  });

  const x = useTransform(smoothProgress, [0.05, 0.95], ["0%", "-85%"]);
  const bgX = useTransform(smoothProgress, [0, 1], ["0%", "-50%"]);
  const bgOpacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 0.05, 0.05, 0]);

  // Track head movement
  const trackHeadPos = useTransform(smoothProgress, [0.1, 0.9], ["0%", "100%"]);

  // HUD Data Flow Pulse
  const pulseScale = useTransform(smoothProgress, [0, 1], [1, 1.2]);

  return (
    <section
      ref={containerRef}
      id="process"
      className="relative h-[1000vh] bg-white z-30"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">

        {/* Cinematic Background Text */}
        <motion.div
          style={{ x: bgX, opacity: bgOpacity }}
          className="absolute inset-0 flex items-center whitespace-nowrap pointer-events-none z-0"
        >
          <span className="text-[45rem] font-black text-[#FF5000] tracking-tighter uppercase leading-none select-none opacity-5">
            S.P.R.I.N.T. S.P.R.I.N.T. S.P.R.I.N.T.
          </span>
        </motion.div>

        {/* --- THE ENHANCED SPRINT RAIL --- */}
        <div className="absolute top-[65%] left-1/2 -translate-x-1/2 w-full max-w-5xl z-30 pointer-events-none px-12 md:px-0">
          {/* Black Line Rail - Solid black, 100% visibility */}
          <div className="relative h-px bg-black/10 w-full mb-12">

            {/* Pulsing Energy Trail */}
            <motion.div
              style={{ width: trackHeadPos }}
              className="absolute inset-y-0 left-0 bg-black"
            />

            {/* Static Nodes */}
            {SPRINT_STEPS.map((_, i) => {
              const nodeStart = 0.1 + (i * 0.12);
              const nodeMid = 0.18 + (i * 0.12);
              const nodeEnd = 0.26 + (i * 0.12);

              return (
                <div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: `${(i / (SPRINT_STEPS.length - 1)) * 100}%` }}
                >
                  <motion.div
                    style={{
                      scale: useTransform(smoothProgress, [nodeStart, nodeMid, nodeEnd], [1, 1.4, 1]),
                      backgroundColor: useTransform(smoothProgress, [nodeStart, nodeMid, nodeEnd], ["#e5e7eb", "#000000", "#e5e7eb"]),
                    }}
                    className="w-3 h-3 border border-white relative z-10"
                  />
                </div>
              );
            })}
          </div>

          {/* PHASE LABELS - Pure Minimalist */}
          <div className="flex justify-between w-full px-2 mb-16">
            {SPRINT_STEPS.map((step, i) => {
              const start = 0.1 + (i * 0.12);
              const mid = 0.18 + (i * 0.12);
              const end = 0.26 + (i * 0.12);

              return (
                <motion.div
                  key={i}
                  style={{
                    opacity: useTransform(smoothProgress, [start, mid, end], [0.4, 1, 0.4]),
                    scale: useTransform(smoothProgress, [start, mid, end], [0.95, 1.1, 0.95])
                  }}
                  className="flex flex-col items-center w-0 overflow-visible"
                >
                  <div className="whitespace-nowrap font-mono text-[11px] md:text-xs tracking-[0.4em] font-bold uppercase text-black">
                    <span className="text-[#FF5000]">{step.first}</span>
                    {step.rest}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CENTRAL BOOK CONSULTATION CTA - Sober Technical Button */}
          <div className="flex justify-center mt-4">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="relative flex items-center gap-6 py-6 px-12 bg-black text-white font-bold transition-all duration-300 pointer-events-auto shadow-xl"
            >
              <span className="relative z-10 text-[11px] uppercase tracking-[0.4em]">BOOK FREE CONSULTATION</span>
              <ArrowUpRight size={18} className="relative z-10" />
            </motion.button>
          </div>
        </div>

        {/* Tactical Section Header */}
        <div className="absolute top-24 left-0 w-full flex flex-col items-center z-30 pointer-events-none">
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

        {/* Main Content (Cards) */}
        <div className="relative w-full z-10 perspective-[2000px] -translate-y-20">
          <motion.div
            style={{ x }}
            className="flex gap-40 pl-[50vw] -translate-x-1/2 w-max"
          >
            {SPRINT_STEPS.map((step, i) => (
              <SprintCard
                key={step.id}
                step={step}
                index={i}
                progress={smoothProgress}
              />
            ))}
            <div className="w-[100vw] flex-shrink-0" />
          </motion.div>
        </div>

        {/* Bottom Metadata HUD */}
        <div className="absolute bottom-16 left-0 w-full px-12 md:px-24 z-30 pointer-events-none">
          <div className="max-w-7xl mx-auto flex justify-between items-end border-t border-black/10 pt-12">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                <span className="text-black font-mono text-[11px] tracking-widest font-bold uppercase">SYSTEM_DEPLOYMENT</span>
              </div>
              <span className="text-black font-mono text-[8px] tracking-[0.2em] opacity-40 uppercase">LATENCY: 1.2MS // BANDWIDTH: OPTIMAL</span>
            </div>

            <div className="flex flex-col items-end gap-2 pointer-events-none">
              <span className="font-mono text-[10px] text-black tracking-[0.8em] uppercase font-bold">STAGE</span>
              <motion.div className="text-8xl font-light text-black tracking-tighter leading-none flex items-baseline">
                <motion.span>{useTransform(smoothProgress, [0.1, 0.9], [1, 6], { clamp: true }).get().toFixed(0)}</motion.span>
                <span className="text-2xl text-black/20 ml-4 font-mono font-bold italic">/06</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-white via-white/40 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-white via-white/40 to-transparent" />
        </div>
      </div>
    </section>
  );
};
