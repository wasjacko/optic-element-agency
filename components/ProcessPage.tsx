
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  BrainCircuit,
  ScrollText,
  Aperture,
  Wand2,
  ScanEye,
  Rocket,
  ArrowRight
} from 'lucide-react';

const STEPS = [
  {
    id: "01",
    title: "Strategy",
    label: "THE FOUNDATION",
    description: "We align on goals, schedule your shoot, and kick things off with a strategy call.",
    icon: BrainCircuit,
    color: "#FF5000",
    tag: "Define the Vision"
  },
  {
    id: "02",
    title: "Plan",
    label: "SCRIPT & STRUCTURE",
    description: "You help fuel our shared content dashboard. We review ideas, scripts, and organize everything.",
    icon: ScrollText,
    color: "#FF7030",
    tag: "Map Out the Content"
  },
  {
    id: "03",
    title: "Roll",
    label: "PRODUCTION",
    description: "Our team films your content, captures b-roll, and follows a detailed plan to keep things smooth.",
    icon: Aperture,
    color: "#FF5000",
    tag: "Lights, Camera, Action"
  },
  {
    id: "04",
    title: "Initiate",
    label: "POST-PRODUCTION",
    description: "Our team edits videos, designs graphics, and manages internal quality control behind the scenes.",
    icon: Wand2,
    color: "#FFA060",
    tag: "Edit + Polish"
  },
  {
    id: "05",
    title: "Notify",
    label: "QUALITY ASSURANCE",
    description: "We send content previews for feedback and handle revisions to get everything client-approved.",
    icon: ScanEye,
    color: "#FF5000",
    tag: "Get Your Input"
  },
  {
    id: "06",
    title: "Takeoff",
    label: "LAUNCH & CELEBRATE",
    description: "Final content is published, client wins are shared, and performance insights are gathered.",
    icon: Rocket,
    color: "#FFDEB0",
    tag: "Launch & Celebrate"
  }
];

export const ProcessPage = ({ onContactClick }: { onContactClick: () => void }) => {
  const containerRef = useRef(null);

  // Overall page scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth out the progress reading
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 500, damping: 30 });

  // Progress bar height
  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="bg-black min-h-[250vh] text-white relative pb-48 pt-56 overflow-hidden">

      {/* Dynamic Background */}
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Moving Gradient Mesh */}
        <motion.div
          className="absolute top-[40%] left-1/2 w-[120vw] h-[120vh] opacity-20"
          style={{
            x: "-50%",
            y: useTransform(smoothProgress, [0, 1], ["-50%", "10%"]), // Parallax effect: moves down as you scroll
            background: 'radial-gradient(circle at 50% 50%, #FF5000 0%, transparent 50%)',
            scale: useTransform(smoothProgress, [0, 0.5, 1], [1, 1.3, 1]),
            opacity: useTransform(smoothProgress, [0, 0.5, 1], [0.1, 0.2, 0.1]),
          }}
        />
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Header */}
      <div className="px-6 text-center mb-48 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 uppercase text-center">
            Our Process
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light">
            Our strategy to get you leads with content
          </p>
        </motion.div>
      </div>

      {/* MAIN TIMELINE RAIL */}
      <div className="relative max-w-5xl mx-auto px-6">

        {/* The "Power Line" - Animated Center Beam */}
        <div className="absolute top-0 bottom-0 left-[20px] md:left-1/2 md:-translate-x-1/2 w-[2px] bg-white/5 z-0">
          <motion.div
            style={{ height: lineHeight }}
            className="w-full bg-gradient-to-b from-[#FF5000] via-[#FF5000] to-transparent shadow-[0_0_30px_#FF5000]"
          />
        </div>

        <div className="space-y-48">
          {STEPS.map((step, index) => (
            <TimelineStep
              key={index}
              step={step}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="mt-32 flex justify-center pb-24 relative z-10">
        <motion.button
          onClick={onContactClick}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#FF5000] text-white font-bold uppercase tracking-wider text-sm hover:bg-[#ff6a2b] transition-colors rounded-sm"
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span>Book a call with us</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>
    </div>
  );
};

const TimelineStep = ({ step, index }: { step: typeof STEPS[0], index: number }) => {
  const isEven = index % 2 === 0;
  const ref = useRef(null);

  // Parallax & Reveal Logic
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Entrance Animations
  const xOffset = isEven ? 100 : -100;

  // Content Transforms (REMOVED animations)
  const contentOpacity = useTransform(progress, [0, 0.8], [0, 1]);

  return (
    <div ref={ref} className={`relative flex flex-col md:flex-row items-center md:gap-24 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

      {/* 1. THE NODE (Center connection point) */}
      <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 z-20 top-0 md:top-1/2 md:-translate-y-1/2 pl-0 md:pl-0">
        <motion.div
          style={{ opacity: contentOpacity }}
          className="relative w-12 h-12 md:w-16 md:h-16 bg-black border border-white/20 flex items-center justify-center shadow-2xl group"
        >

          {/* Active Glow Ring - Restored */}
          <motion.div
            style={{ opacity: contentOpacity }}
            className="absolute -inset-2 border border-[#FF5000] blur-sm opacity-50"
          />

          <span className="font-mono font-bold text-white text-sm md:text-lg z-10 group-hover:text-[#FF5000] transition-colors leading-none">0{index + 1}</span>

          {/* Connector Line to Content (Mobile only really visible) */}
          <div className="absolute top-1/2 left-full w-4 h-px bg-white/20 md:hidden" />
        </motion.div>
      </div>

      {/* 2. THE CARD (Content) */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className={`w-full md:w-[45%] pl-16 md:pl-0 ${isEven ? 'text-left' : 'text-left md:text-right'}`}
      >
        <div className="relative group">

          {/* Wireframe Card Container - Static, No Icons */}
          <div className="relative p-8 md:p-10 border border-white/20">

            {/* Corner Nodes - Static White */}
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white" />
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white" />

            {/* Title */}
            <h3 className="text-3xl md:text-5xl font-bold uppercase mb-4 tracking-tight leading-none text-white">
              {step.title}
            </h3>

            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light font-mono">
              {step.description}
            </p>

            {/* Tech Decoration */}
            <div className={`mt-6 pt-6 border-t border-dashed border-white/20 flex gap-4 items-center opacity-80 ${isEven ? 'flex-row' : 'flex-row md:flex-row-reverse'}`}>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#FF5000] font-semibold">{step.tag}</span>
            </div>

          </div>
        </div>
      </motion.div>

      {/* 3. Empty spacer for grid balance OR Animation */}
      <div className="hidden md:flex w-[45%] justify-center items-center">
        {step.id === "01" && <StrategyAnimation />}
        {step.id === "02" && <PlanAnimation />}
        {step.id === "03" && <RollAnimation />}
        {step.id === "04" && <InitiateAnimation />}
        {step.id === "05" && <NotifyAnimation />}
        {step.id === "06" && <TakeoffAnimation />}
      </div>

    </div>
  );
};

// --- Custom Animations ---

const StrategyAnimation = () => {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center opacity-90">
      <svg width="240" height="240" viewBox="0 0 240 240" className="stroke-white stroke-[1px] fill-none">

        {/* Triangle Structure - Stability/Strategy */}
        <motion.path
          d="M120 60 L 180 170 L 60 170 Z"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Nodes at vertices */}
        <motion.circle cx="120" cy="60" r="4" fill="white" stroke="none" initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0 }} />
        <motion.circle cx="180" cy="170" r="4" fill="white" stroke="none" initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.6 }} />
        <motion.circle cx="60" cy="170" r="4" fill="white" stroke="none" initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 1.2 }} />

        {/* Center "Core" Strategy Node */}
        <motion.circle
          cx="120" cy="125" r="8"
          fill="#FF5000" stroke="none"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: 2, type: "spring" }}
        />

        {/* Connecting lines to center */}
        <motion.path
          d="M120 60 L 120 125 M 180 170 L 120 125 M 60 170 L 120 125"
          stroke="#FF5000" strokeOpacity="0.5" strokeDasharray="2 2"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
        />

      </svg>

      {/* Subtle Glow */}
      <div className="absolute inset-0 bg-[#FF5000] opacity-5 blur-[60px]" />
    </div>
  );
};

const PlanAnimation = () => {
  return (
    <div className="relative w-72 h-56 flex items-center justify-center">

      {/* Wireframe Board (Kanban Style) */}
      <div className="relative z-10 w-64 h-40 border border-white/20 rounded-md bg-white/5 backdrop-blur-sm grid grid-cols-3 gap-2 p-2 overflow-hidden">

        {/* Column 1 */}
        <div className="flex flex-col gap-2 border-r border-white/10 pr-1">
          <div className="h-1 w-8 bg-white/20 rounded-full mb-1" />
          {/* Target Card A */}
          <motion.div
            animate={{ scale: [1.1, 1.1, 1, 1, 1.1], backgroundColor: ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.2)"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.5, 0.9, 1] }}
            className="h-6 w-full bg-white/10 rounded-sm border border-white/10"
          />
          <div className="h-6 w-full bg-white/10 rounded-sm border border-white/10 opacity-50" />
          <div className="h-6 w-full bg-white/10 rounded-sm border border-white/10 opacity-30" />
          <div className="h-6 w-full bg-white/10 rounded-sm border border-white/10 opacity-20" />
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-2 border-r border-white/10 pr-1">
          <div className="h-1 w-8 bg-white/20 rounded-full mb-1" />
          <div className="h-6 w-full bg-white/10 rounded-sm border border-white/10 opacity-60" />
          <div className="h-6 w-full bg-white/10 rounded-sm border border-white/10 opacity-40" />
          <div className="h-6 w-full bg-white/10 rounded-sm border border-white/10 opacity-30" />
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-2">
          <div className="h-1 w-8 bg-white/20 rounded-full mb-1" />
          <div className="h-6 w-full bg-white/10 rounded-sm border border-white/10 opacity-40" />
          <div className="h-6 w-full bg-white/10 rounded-sm border border-white/10 opacity-20" />
          {/* Target Card B (Moved to bottom) */}
          <motion.div
            animate={{ scale: [1, 1, 1.1, 1.1, 1], backgroundColor: ["rgba(255, 80, 0, 0.1)", "rgba(255, 80, 0, 0.1)", "rgba(255, 80, 0, 0.3)", "rgba(255, 80, 0, 0.3)", "rgba(255, 80, 0, 0.1)"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.5, 0.9, 1] }}
            className="h-6 w-full bg-[#FF5000]/10 rounded-sm border border-[#FF5000]/20"
          />
        </div>

      </div>

      {/* Floating Large Cursor */}
      <div className="absolute inset-0 pointer-events-none z-[100]">
        <motion.div
          initial={{ x: 60, y: 55 }}
          animate={{
            x: [60, 60, 225, 225, 60], // Exact centers: Col 1 Card 1 (60px) -> Col 3 Card 3 (225px)
            y: [60, 60, 125, 125, 60], // Exact centers: Row 1 (60px) -> Row 3 (125px)
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.4, 0.5, 0.9, 1]
          }}
          className="absolute top-0 left-0"
        >
          {/* Robust Cursor SVG */}
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
            <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="white" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>

      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-[#FF5000] opacity-5 blur-[80px] -z-10" />
    </div>
  );
};
const RollAnimation = () => {
  return (
    <div className="relative w-64 h-48">

      {/* Background Image: Studio Set (Top Left) */}
      <motion.div
        className="absolute top-0 left-0 w-48 h-32 z-0 rounded-lg overflow-hidden border border-white/20 shadow-lg"
        initial={{ y: 0 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src="/studio-set.png"
          alt="Studio Background"
          className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </motion.div>

      {/* Foreground Image: Camera Monitor (Bottom Right) */}
      <motion.div
        className="absolute bottom-0 right-0 z-10 w-44 h-28 rounded-lg overflow-hidden border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        initial={{ y: 0 }}
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <img
          src="/camera-monitor.png"
          alt="Camera Monitor"
          className="w-full h-full object-cover"
        />
        {/* Rec overlay */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          <span className="text-[6px] font-mono text-white tracking-widest">REC</span>
        </div>
        {/* Frame guides */}
        <div className="absolute inset-x-4 top-4 bottom-4 border-x border-white/20 opacity-30" />
        <div className="absolute inset-y-4 left-4 right-4 border-y border-white/20 opacity-30" />
      </motion.div>

      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-[#FF5000] opacity-10 blur-[60px] -z-10" />
    </div>
  );
};
const InitiateAnimation = () => {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center opacity-90">
      <svg width="240" height="240" viewBox="0 0 240 240" className="fill-none">

        {/* Adobe Ps (Photoshop) - Top Left */}
        <motion.g
          initial={{ opacity: 0, x: -20, y: -20 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Box */}
          <motion.rect
            x="40" y="40" width="50" height="50" rx="3"
            stroke="white" strokeWidth="1.5"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          {/* Ps Text Path */}
          <motion.path
            d="M55 75 V55 H62 C66 55 66 63 62 63 H55 M75 62 C73 62 72 63 72 65 C72 67 78 68 78 71 C78 74 74 75 71 75"
            stroke="white" strokeWidth="1.5"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.5 }}
          />
        </motion.g>

        {/* Adobe Ai (Illustrator) - Center */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Box */}
          <motion.rect
            x="95" y="95" width="50" height="50" rx="3"
            stroke="white" strokeWidth="1.5"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
          />
          {/* Ai Text Path */}
          <motion.path
            d="M108 130 L115 110 L122 130 M110 124 H120 M128 114 V130 M128 108 V110"
            stroke="white" strokeWidth="1.5"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.9 }}
          />
        </motion.g>

        {/* Adobe Ae (After Effects) - Bottom Right */}
        <motion.g
          initial={{ opacity: 0, x: 20, y: 20 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {/* Box */}
          <motion.rect
            x="150" y="150" width="50" height="50" rx="3"
            stroke="white" strokeWidth="1.5"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
          />
          {/* Ae Text Path */}
          <motion.path
            // Corrected 'e' shape: Start middle, right, up-curve, left, down-curve, right
            d="M162 185 L169 165 L176 185 M164 179 H174 M182 180 H190 C190 174 180 174 180 180 C180 186 190 186 190 184"
            stroke="white" strokeWidth="1.5"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.3 }}
          />
        </motion.g>

      </svg>

      {/* Connecting Lines (Pipeline) - Subtle Gray */}
      <svg className="absolute inset-0 pointer-events-none stroke-white/10 stroke-[1px] fill-none">
        <motion.path
          d="M90 90 L 95 95"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, delay: 1 }}
        />
        <motion.path
          d="M145 145 L 150 150"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.5 }}
        />
      </svg>

      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-[#FF5000] opacity-5 blur-[60px] -z-10" />
    </div>
  );
};
const NotifyAnimation = () => {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">

      {/* Background Static Circles */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="absolute w-28 h-28 border border-white/20 rounded-full" />
        <div className="absolute w-48 h-48 border border-white/10 rounded-full" />
      </div>

      {/* Notification Bell Icon - Animates ONLY when scrolled into view */}
      <motion.div
        className="relative z-20 flex items-center justify-center"
        initial={{ rotate: 0 }}
        whileInView={{ rotate: [0, -10, 10, -10, 10, 0] }} // Ring effect on scroll
        viewport={{ once: false, margin: "-50px" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <div className="relative">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-2xl">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>

          {/* Notification Bubble "1" - Pops in on scroll */}
          <motion.div
            className="absolute top-1 right-2 w-5 h-5 bg-[#FF5000] rounded-full flex items-center justify-center border border-black"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: false }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
          >
            <span className="text-[10px] font-bold text-white">1</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-[#FF5000] opacity-5 blur-[60px] -z-10" />
    </div>
  );
};

const TakeoffAnimation = () => {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center overflow-hidden">

      {/* Slow Scrolling Stars Background - More lines, wider spread */}
      <div className="absolute inset-0 flex justify-around items-start w-full px-2 opacity-20">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className={`w-[1px] bg-gradient-to-b from-transparent via-white to-transparent ${i % 2 === 0 ? "h-32" : "h-20"}`} // Varied lengths
            animate={{ y: [-150, 300] }}
            transition={{
              duration: 6 + (i % 3) * 2, // Varied speeds (6s, 8s, 10s)
              repeat: Infinity,
              ease: "linear",
              delay: i * 1.5 // Staggered start
            }}
          />
        ))}
      </div>

      {/* Sleek Rocket Ship - Smooth Float */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        animate={{ y: [0, -10, 0] }} // Gentle floating
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Ship Body - Minimalist & Rounded */}
        <svg width="60" height="90" viewBox="0 0 60 90" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          {/* Main Hull */}
          <path d="M30 5 C 15 20, 15 60, 20 75 H 40 C 45 60, 45 20, 30 5 Z" />
          {/* Simple Window */}
          <circle cx="30" cy="35" r="6" />
          {/* Fins - Integrated */}
          <path d="M20 65 L 10 80 H 22" />
          <path d="M40 65 L 50 80 H 38" />
        </svg>

        {/* Gentle Thruster Glow */}
        <motion.div
          className="mt-[-5px] w-6 h-12 bg-gradient-to-b from-[#FF5000] to-transparent rounded-full opacity-60 blur-md"
          animate={{ height: [40, 50, 40], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-[#FF5000] opacity-5 blur-[50px] -z-10" />
    </div>
  );
};
