
import React, { useRef, useState, useEffect } from 'react';
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
    label: "We define the North Star.",
    description: "We align on goals, positioning, and direction, then map the path forward before execution begins.",
    icon: BrainCircuit,
    color: "#FF5000",
    tag: "Define the Vision"
  },
  {
    id: "02",
    title: "Plan",
    label: "With strategy set, we build the roadmap.",
    description: "We map your content inside our shared dashboard — outlining ideas, scripts, and structure before production begins.",
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
    label: "From shoot to structure.",
    description: "We edit and refine every asset to match your brand, strategy, and objectives, reviewed for clarity and performance.",
    icon: Wand2,
    color: "#FFA060",
    tag: "Edit + Polish"
  },
  {
    id: "05",
    title: "Notify",
    label: "From shoot to structure.",
    description: "We edit and refine every asset to match your brand, strategy, and objectives, reviewed for clarity and performance.",
    icon: ScanEye,
    color: "#FF5000",
    tag: "STAY ALIGNED"
  },
  {
    id: "06",
    title: "Takeoff",
    label: "Launch. Distribute. Optimize.",
    description: "We push content live, run campaigns, gather insights, and refine continuously improving each sprint.",
    icon: Rocket,
    color: "#FFDEB0",
    tag: "LAUNCH & REFINE"
  }
];
export const ProcessPage = ({ onContactClick, data, activeSection }: { onContactClick: () => void, data?: any, activeSection?: string }) => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Force scroll to top when page mounts
    window.scrollTo(0, 0);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Overall page scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth out the progress reading
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 500, damping: 30 });

  // Progress bar height
  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  const showAll = !activeSection;
  const bgColor = data?.backgroundColor || '#000000';
  const txtColor = data?.textColor || '#ffffff';
  const accentColor = data?.accentColor || '#FF5000';

  return (
    <section
      ref={containerRef}
      className={`min-h-[100vh] relative pb-48 pt-24 md:pt-56 overflow-hidden`}
      style={{ backgroundColor: bgColor, color: txtColor }}
    >

      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Moving Gradient Mesh */}
        <motion.div
          className="absolute top-[40%] left-1/2 w-[120vw] h-[120vh] opacity-20 will-change-transform"
          style={{
            x: "-50%",
            y: useTransform(smoothProgress, [0, 1], ["-50%", "10%"]), // Parallax effect: moves down as you scroll
            background: `radial-gradient(circle at 50% 50%, ${accentColor} 0%, transparent 50%)`,
            scale: useTransform(smoothProgress, [0, 0.5, 1], [1, 1.3, 1]),
            opacity: useTransform(smoothProgress, [0, 0.5, 1], [0.1, 0.2, 0.1]),
          }}
        />
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Header */}
      {(showAll || activeSection === 'header') && (
        <div className="px-10 md:px-6 text-center mb-24 md:mb-48 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 uppercase text-center" style={{ color: txtColor }}>
              {data?.title || "Our Process"}
            </h1>
            <p className="text-base md:text-lg opacity-60 max-w-2xl mx-auto font-light" style={{ color: txtColor }}>
              {data?.subtitle || "Our strategy to get you leads with content"}
            </p>
          </motion.div>
        </div>
      )}

      {/* MAIN TIMELINE RAIL */}
      {(showAll || activeSection === 'timeline') && (
        <div className="relative max-w-5xl mx-auto px-10 md:px-6">

          {/* The "Power Line" - Animated Center Beam */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] z-0" style={{ backgroundColor: txtColor === '#ffffff' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
            <motion.div
              style={{
                height: lineHeight,
                background: `linear-gradient(to bottom, ${accentColor}, ${accentColor}, transparent)`,
                boxShadow: `0 0 30px ${accentColor}`
              }}
              className="w-full"
            />
          </div>

          <div className="space-y-48">
            {STEPS.map((step, index) => (
              <TimelineStep
                key={index}
                step={step}
                index={index}
                accentColor={accentColor}
                txtColor={txtColor}
                bgColor={bgColor}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
      )}

      {/* Final CTA */}
      {(showAll || activeSection === 'cta') && (
        <div className="mt-32 flex justify-center pb-24 relative z-10">
          <motion.button
            onClick={onContactClick}
            className="group relative inline-flex items-center gap-3 px-8 py-4 font-bold uppercase tracking-wider text-sm transition-opacity hover:opacity-90 rounded-sm"
            style={{ backgroundColor: accentColor, color: bgColor === '#000000' ? '#ffffff' : '#000000' }} // Contrast fix
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span>Book a call with us</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </div>
      )}
    </section>
  );
};

const TimelineStep = ({ step, index, accentColor = '#FF5000', txtColor = '#ffffff', bgColor = '#000000', isMobile }: { step: typeof STEPS[0], index: number, accentColor?: string, txtColor?: string, bgColor?: string, isMobile: boolean }) => {
  const isEven = index % 2 === 0;
  const ref = useRef(null);

  // Parallax & Reveal Logic
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Entrance Animations
  const contentOpacity = useTransform(progress, [0, 0.8], [0, 1]);
  const contentY = useTransform(progress, [0, 0.8], [50, 0]);

  return (
    <div ref={ref} className={`relative flex flex-col ${isMobile ? 'items-center space-y-12' : 'md:flex-row items-center md:gap-24'} ${!isMobile && (isEven ? 'md:flex-row' : 'md:flex-row-reverse')}`}>

      {/* 1. THE NODE (Center connection point) */}
      <div className={`${isMobile ? 'relative mb-8 z-20' : 'absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20'}`}>
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
        >
          <div
            style={{
              borderColor: txtColor === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              backgroundColor: bgColor,
              isolation: 'isolate'
            }}
            className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center shadow-2xl group border"
          >
            {/* Active Glow Ring */}
            <motion.div
              style={{ opacity: contentOpacity, borderColor: accentColor }}
              className="absolute -inset-2 border blur-sm opacity-50"
            />

            <span className="font-mono font-bold text-sm md:text-lg z-10 transition-colors leading-none" style={{ color: txtColor === '#ffffff' ? '#ffffff' : '#000000' }}>0{index + 1}</span>

            {/* Connector Line - Only for desktop or hidden if centered mobile */}
            {!isMobile && (
              <div className="absolute top-1/2 left-full w-4 h-px md:hidden" style={{ backgroundColor: txtColor === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }} />
            )}
          </div>
        </motion.div>
      </div>

      {/* 2. THE CARD (Content) */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className={`w-full relative z-10 ${isMobile ? 'px-4 text-center' : 'md:w-[45%] pl-16 md:pl-0'} ${!isMobile && (isEven ? 'text-left' : 'text-left md:text-right')}`}
      >
        <div className="relative group">

          {/* ANIMATION FOR MOBILE - Centered above text */}
          {isMobile && (
            <div className="flex justify-center items-center mb-8 transform scale-75 md:scale-100 relative">
              <div className="relative z-10">
                {step.id === "01" && <StrategyAnimation accentColor={accentColor} txtColor={txtColor} />}
                {step.id === "02" && <PlanAnimation accentColor={accentColor} txtColor={txtColor} />}
                {step.id === "03" && <RollAnimation accentColor={accentColor} txtColor={txtColor} />}
                {step.id === "04" && <InitiateAnimation accentColor={accentColor} txtColor={txtColor} />}
                {step.id === "05" && <NotifyAnimation accentColor={accentColor} txtColor={txtColor} />}
                {step.id === "06" && <TakeoffAnimation accentColor={accentColor} txtColor={txtColor} />}
              </div>
            </div>
          )}

          {/* Wireframe Card Container */}
          <div className="relative p-8 md:p-10 border will-change-transform backface-hidden z-10" style={{ borderColor: txtColor === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)', backgroundColor: bgColor }}>

            {/* Corner Nodes */}
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3" style={{ backgroundColor: txtColor }} />
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3" style={{ backgroundColor: txtColor }} />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3" style={{ backgroundColor: txtColor }} />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3" style={{ backgroundColor: txtColor }} />

            {/* Title */}
            <h3 className="text-3xl md:text-5xl font-bold uppercase mb-4 tracking-tight leading-none" style={{ color: txtColor }}>
              {step.title}
            </h3>

            <p className="text-sm md:text-base leading-relaxed font-light font-mono mx-auto" style={{ color: txtColor, opacity: 0.7, maxWidth: isMobile ? '300px' : 'none' }}>
              {step.description}
            </p>

            {/* Tech Decoration */}
            <div className={`mt-6 pt-6 border-t border-dashed flex gap-4 items-center opacity-80 ${isMobile ? 'justify-center' : (isEven ? 'flex-row' : 'flex-row md:flex-row-reverse')}`} style={{ borderColor: txtColor === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}>
              <span className="text-[10px] font-mono tracking-widest uppercase font-semibold" style={{ color: accentColor }}>{step.tag}</span>
            </div>

          </div>
        </div>
      </motion.div>

      {/* 3. Empty spacer / Animation for Desktop */}
      {!isMobile && (
        <div className="hidden md:flex w-[45%] justify-center items-center">
          {step.id === "01" && <StrategyAnimation accentColor={accentColor} txtColor={txtColor} />}
          {step.id === "02" && <PlanAnimation accentColor={accentColor} txtColor={txtColor} />}
          {step.id === "03" && <RollAnimation accentColor={accentColor} txtColor={txtColor} />}
          {step.id === "04" && <InitiateAnimation accentColor={accentColor} txtColor={txtColor} />}
          {step.id === "05" && <NotifyAnimation accentColor={accentColor} txtColor={txtColor} />}
          {step.id === "06" && <TakeoffAnimation accentColor={accentColor} txtColor={txtColor} />}
        </div>
      )}

    </div>
  );
};

// --- Custom Animations ---

const StrategyAnimation = ({ accentColor, txtColor }: { accentColor: string, txtColor: string }) => {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center opacity-90">
      <svg width="240" height="240" viewBox="0 0 240 240" className="stroke-[1px] fill-none" style={{ stroke: txtColor }}>

        {/* Triangle Structure - Stability/Strategy */}
        <motion.path
          d="M120 60 L 180 170 L 60 170 Z"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Nodes at vertices */}
        <motion.circle cx="120" cy="60" r="4" fill={txtColor} stroke="none" initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0 }} />
        <motion.circle cx="180" cy="170" r="4" fill={txtColor} stroke="none" initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.6 }} />
        <motion.circle cx="60" cy="170" r="4" fill={txtColor} stroke="none" initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 1.2 }} />

        {/* Center "Core" Strategy Node */}
        <motion.circle
          cx="120" cy="125" r="8"
          fill={accentColor} stroke="none"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: 2, type: "spring" }}
        />

        {/* Connecting lines to center */}
        <motion.path
          d="M120 60 L 120 125 M 180 170 L 120 125 M 60 170 L 120 125"
          stroke={accentColor} strokeOpacity="0.5" strokeDasharray="2 2"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
        />

      </svg>

      {/* Subtle Glow */}
      <div className="absolute inset-[-40px] opacity-5 blur-[40px] will-change-transform" style={{ backgroundColor: accentColor }} />
    </div>
  );
};

const PlanAnimation = ({ accentColor, txtColor }: { accentColor: string, txtColor: string }) => {
  return (
    <div className="relative w-72 h-56 flex items-center justify-center">

      {/* Wireframe Board (Kanban Style) */}
      <div className="relative z-10 w-64 h-40 border rounded-md bg-white/5 backdrop-blur-sm grid grid-cols-3 gap-2 p-2 overflow-hidden"
        style={{ borderColor: txtColor === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}>

        {/* Column 1 */}
        <div className="flex flex-col gap-2 border-r pr-1" style={{ borderColor: txtColor === '#ffffff' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
          <div className="h-1 w-8 rounded-full mb-1" style={{ backgroundColor: txtColor, opacity: 0.2 }} />
          {/* Target Card A */}
          <motion.div
            animate={{ scale: [1.1, 1.1, 1, 1, 1.1], opacity: [0.2, 0.2, 0.1, 0.1, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.5, 0.9, 1] }}
            className="h-6 w-full rounded-sm border"
            style={{ backgroundColor: txtColor, borderColor: txtColor }}
          />
          <div className="h-6 w-full rounded-sm border opacity-50" style={{ backgroundColor: txtColor, borderColor: txtColor }} />
          <div className="h-6 w-full rounded-sm border opacity-30" style={{ backgroundColor: txtColor, borderColor: txtColor }} />
          <div className="h-6 w-full rounded-sm border opacity-20" style={{ backgroundColor: txtColor, borderColor: txtColor }} />
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-2 border-r pr-1" style={{ borderColor: txtColor === '#ffffff' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
          <div className="h-1 w-8 rounded-full mb-1" style={{ backgroundColor: txtColor, opacity: 0.2 }} />
          <div className="h-6 w-full rounded-sm border opacity-60" style={{ backgroundColor: txtColor, borderColor: txtColor }} />
          <div className="h-6 w-full rounded-sm border opacity-40" style={{ backgroundColor: txtColor, borderColor: txtColor }} />
          <div className="h-6 w-full rounded-sm border opacity-30" style={{ backgroundColor: txtColor, borderColor: txtColor }} />
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-2">
          <div className="h-1 w-8 rounded-full mb-1" style={{ backgroundColor: txtColor, opacity: 0.2 }} />
          <div className="h-6 w-full rounded-sm border opacity-40" style={{ backgroundColor: txtColor, borderColor: txtColor }} />
          <div className="h-6 w-full rounded-sm border opacity-20" style={{ backgroundColor: txtColor, borderColor: txtColor }} />
          {/* Target Card B (Moved to bottom) */}
          <motion.div
            animate={{ scale: [1, 1, 1.1, 1.1, 1], opacity: [0.1, 0.1, 0.3, 0.3, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.5, 0.9, 1] }}
            className="h-6 w-full rounded-sm border"
            style={{ backgroundColor: accentColor, borderColor: accentColor }}
          />
        </div>

      </div>

      {/* Floating Large Cursor */}
      <div className="absolute inset-0 pointer-events-none z-[100]">
        <motion.div
          initial={{ x: 60, y: 55 }}
          animate={{
            x: [60, 60, 225, 225, 60],
            y: [60, 60, 125, 125, 60],
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
            <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill={txtColor} stroke={txtColor === '#ffffff' ? '#000000' : '#ffffff'} strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>

      {/* Ambient Glow */}
      <div className="absolute inset-[-40px] opacity-5 blur-[50px] -z-10 will-change-transform" style={{ backgroundColor: accentColor }} />
    </div>
  );
};
const RollAnimation = ({ accentColor, txtColor }: { accentColor: string, txtColor: string }) => {
  return (
    <div className="relative w-64 h-48">

      {/* Background Image: Studio Set (Top Left) */}
      <motion.div
        className="absolute top-0 left-0 w-48 h-32 z-0 rounded-lg overflow-hidden border shadow-lg"
        style={{ borderColor: txtColor === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}
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
        className="absolute bottom-0 right-0 z-10 w-44 h-28 rounded-lg overflow-hidden border shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        style={{ borderColor: txtColor === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}
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
      </motion.div>

      {/* Ambient Glow */}
      <div className="absolute inset-[-40px] opacity-10 blur-[40px] -z-10 will-change-transform" style={{ backgroundColor: accentColor }} />
    </div>
  );
};
const InitiateAnimation = ({ accentColor, txtColor }: { accentColor: string, txtColor: string }) => {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
      className="relative w-64 h-64 flex items-center justify-center opacity-90"
    >
      <svg width="240" height="240" viewBox="0 0 240 240" className="fill-none">

        {/* Adobe Ps (Photoshop) - Top Left */}
        <motion.g
          variants={{
            initial: { opacity: 0, x: -20, y: -20 },
            animate: { opacity: 1, x: 0, y: 0 }
          }}
          transition={{ duration: 0.8 }}
        >
          {/* Box */}
          <motion.rect
            x="40" y="40" width="50" height="50" rx="2"
            stroke={txtColor} strokeWidth="1.5"
            variants={{
              initial: { pathLength: 0 },
              animate: { pathLength: 1 }
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          {/* Ps OCRA STYLED PATHS */}
          <motion.path
            d="M53 75 V55 H65 V65 H53" // P
            stroke={txtColor} strokeWidth="2"
            variants={{
              initial: { pathLength: 0 },
              animate: { pathLength: 1 }
            }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.path
            d="M72 65 H80 V70 H72 V75 H80" // s
            stroke={txtColor} strokeWidth="2"
            variants={{
              initial: { pathLength: 0 },
              animate: { pathLength: 1 }
            }}
            transition={{ duration: 1, delay: 0.7 }}
          />
        </motion.g>

        {/* Adobe Ai (Illustrator) - Center */}
        <motion.g
          variants={{
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 }
          }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Box */}
          <motion.rect
            x="95" y="95" width="50" height="50" rx="2"
            stroke={txtColor} strokeWidth="1.5"
            variants={{
              initial: { pathLength: 0 },
              animate: { pathLength: 1 }
            }}
            transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
          />

          {/* Ai OCRA STYLED PATHS */}
          <motion.path
            d="M106 130 V115 L112 110 L118 115 V130 M106 123 H118" // A
            stroke={txtColor} strokeWidth="2"
            variants={{
              initial: { pathLength: 0 },
              animate: { pathLength: 1 }
            }}
            transition={{ duration: 1, delay: 0.9 }}
          />
          <motion.path
            d="M128 115 V130 M128 108 V110" // i
            stroke={txtColor} strokeWidth="2"
            variants={{
              initial: { pathLength: 0 },
              animate: { pathLength: 1 }
            }}
            transition={{ duration: 1, delay: 1.1 }}
          />
        </motion.g>

        {/* Adobe Ae (After Effects) - Bottom Right */}
        <motion.g
          variants={{
            initial: { opacity: 0, x: 20, y: 20 },
            animate: { opacity: 1, x: 0, y: 0 }
          }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {/* Box */}
          <motion.rect
            x="150" y="150" width="50" height="50" rx="2"
            stroke={txtColor} strokeWidth="1.5"
            variants={{
              initial: { pathLength: 0 },
              animate: { pathLength: 1 }
            }}
            transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
          />
          {/* Ae OCRA STYLED PATHS */}
          <motion.path
            d="M161 185 V170 L167 165 L173 170 V185 M161 178 H173" // A
            stroke={txtColor} strokeWidth="2"
            variants={{
              initial: { pathLength: 0 },
              animate: { pathLength: 1 }
            }}
            transition={{ duration: 1, delay: 1.3 }}
          />
          <motion.path
            d="M188 178 H180 V184 H188 M180 181 H188" // e
            stroke={txtColor} strokeWidth="2"
            variants={{
              initial: { pathLength: 0 },
              animate: { pathLength: 1 }
            }}
            transition={{ duration: 1, delay: 1.5 }}
          />
        </motion.g>

      </svg>

      {/* Connecting Lines (Pipeline) - Subtle Gray */}
      <svg className="absolute inset-0 pointer-events-none stroke-[1px] fill-none" style={{ stroke: txtColor, opacity: 0.1 }}>
        <motion.path
          d="M90 90 L 95 95"
          variants={{
            initial: { pathLength: 0 },
            animate: { pathLength: 1 }
          }}
          transition={{ duration: 1, delay: 1 }}
        />
        <motion.path
          d="M145 145 L 150 150"
          variants={{
            initial: { pathLength: 0 },
            animate: { pathLength: 1 }
          }}
          transition={{ duration: 1, delay: 1.5 }}
        />
      </svg>

      {/* Ambient Glow */}
      <div className="absolute inset-[-40px] opacity-5 blur-[40px] -z-10 will-change-transform" style={{ backgroundColor: accentColor }} />
    </motion.div>
  );
};
const NotifyAnimation = ({ accentColor, txtColor }: { accentColor: string, txtColor: string }) => {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">

      {/* Background Static Circles */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="absolute w-28 h-28 border rounded-full opacity-20" style={{ borderColor: txtColor }} />
        <div className="absolute w-48 h-48 border rounded-full opacity-10" style={{ borderColor: txtColor }} />
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
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-2xl" style={{ stroke: txtColor }}>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>

          {/* Notification Bubble "1" - Pops in on scroll */}
          <motion.div
            className="absolute top-1 right-2 w-5 h-5 rounded-full flex items-center justify-center border"
            style={{ backgroundColor: accentColor, borderColor: txtColor === '#ffffff' ? '#000000' : '#ffffff' }}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: false }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
          >
            <span className="text-[10px] font-bold" style={{ color: txtColor === '#ffffff' ? '#000000' : '#ffffff' }}>1</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Ambient Glow */}
      <div className="absolute inset-[-40px] opacity-5 blur-[40px] -z-10 will-change-transform" style={{ backgroundColor: accentColor }} />
    </div>
  );
};

const TakeoffAnimation = ({ accentColor, txtColor }: { accentColor: string, txtColor: string }) => {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">

      {/* Slow Scrolling Stars Background - More lines, wider spread */}
      <div className="absolute inset-0 flex justify-around items-start w-full px-2 opacity-20">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className={`w-[1px] bg-gradient-to-b from-transparent to-transparent ${i % 2 === 0 ? "h-32" : "h-20"}`} // Varied lengths
            style={{
              '--tw-gradient-via': txtColor,
              backgroundImage: `linear-gradient(to bottom, transparent, ${txtColor}, transparent)`
            } as any}
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
        <svg width="60" height="90" viewBox="0 0 60 90" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" style={{ stroke: txtColor }}>
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
          className="mt-[-5px] w-6 h-12 to-transparent rounded-full opacity-60 blur-md"
          style={{ background: `linear-gradient(to bottom, ${accentColor}, transparent)` }}
          animate={{ height: [40, 50, 40], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Ambient Glow */}
      <div className="absolute inset-[-40px] opacity-5 blur-[30px] -z-10 will-change-transform" style={{ backgroundColor: accentColor }} />
    </div>
  );
};
