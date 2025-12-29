
import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Play, Pause, Star, ArrowRight, Volume2, VolumeX } from 'lucide-react';

const REVIEWS = [
  {
    text: "oE is always producing incredible content that is both engaging and conveys the exact brand on screen. They truly understand high-output visual engineering.",
    author: "Kalvin Payne",
    role: "Business Owner",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
  },
  {
    text: "Working with Optic Element has been one of the best decisions I've made for my business! Being someone new to production, they made the process seamless.",
    author: "Francine Dinh",
    role: "Strategic Partner",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
  },
  {
    text: "I couldn't be more happy with this epic team! My entire staff came into the studio to do videos for our website. The results exceeded our expectations.",
    author: "SD Complete",
    role: "Agency Client",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
  }
];

const REELS = [
  { id: "R_01", client: "PERSONA 1", url: "https://video.wixstatic.com/video/8fb0bb_26cfc458c0054812a82383379cb29c79/720p/mp4/file.mp4" },
  { id: "R_02", client: "PERSONA 2", url: "https://video.wixstatic.com/video/8fb0bb_d6e089eee8c1427b867ec8d101a46274/720p/mp4/file.mp4" },
  { id: "R_03", client: "PERSONA 3", url: "https://video.wixstatic.com/video/8fb0bb_bbef9fb4c4564d3181bc316e6496109b/720p/mp4/file.mp4" }
];

const SPRINT_STEPS = [
  { first: "S", rest: "TRATEGY" },
  { first: "P", rest: "LAN" },
  { first: "R", rest: "OLE" },
  { first: "I", rest: "NITIATE" },
  { first: "N", rest: "OTIFY" },
  { first: "T", rest: "AKE OFF" }
];

const ReelCard: React.FC<{ reel: typeof REELS[0] }> = ({ reel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (e) {
          console.warn("Playback prevented", e);
        }
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.warn("Playback prevented", e));
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative group bg-white border border-black/[0.08] overflow-hidden shadow-2xl cursor-pointer"
    >
      <div className="aspect-[9/16] relative">
        <video
          ref={videoRef}
          src={reel.url}
          loop muted={isMuted} playsInline
          crossOrigin="anonymous"
          className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity duration-700"
        />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-8 left-8 font-mono text-[11px] text-black tracking-[0.5em] bg-white px-5 py-2.5 font-black uppercase">
            {reel.client}
          </div>

          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-black/10" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-black/10" />
        </div>

        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button
            onClick={toggleMute}
            className="p-3 rounded-full border border-white/40 bg-black/10 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={togglePlay}
            className="w-20 h-20 rounded-full border-2 border-white bg-transparent flex items-center justify-center text-white hover:bg-white hover:text-black transition-all transform hover:scale-110"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export const PerspectiveGrid: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"]
  });



  return (
    <section ref={scrollRef} className="relative w-full bg-tech-paper flex flex-col items-center justify-center overflow-hidden py-40 border-t border-black/[0.05]">

      {/* 1. SYSTEM SECTION */}
      <div className="w-full max-w-7xl mx-auto px-6 mb-80 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <span className="text-tech-accent font-mono text-[9px] tracking-[0.6em] uppercase font-black">
            OUR PROVEN SYSTEM .5
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-light tracking-[0.4em] text-black leading-none uppercase border-y-2 border-black py-10 px-16 italic">
            S.P.R.I.N.T.
          </h2>
        </motion.div>

        <div className="relative w-full max-w-5xl mx-auto mb-12">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "circOut" }}
            className="h-[2.5px] bg-black relative origin-center"
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-black" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-black" />
          </motion.div>

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
                <div className="whitespace-nowrap font-mono text-[11px] md:text-xs tracking-widest font-black">
                  <span className="text-tech-accent">{step.first}</span>
                  <span className="text-black">{step.rest}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-24">
            <motion.button
              whileHover={{ backgroundColor: "#FF3300" }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white px-12 py-5 font-mono text-[11px] uppercase tracking-[0.4em] font-black transition-all duration-500 pointer-events-auto flex items-center gap-4"
            >
              BOOK FREE CONSULTATION <ArrowRight size={18} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* 2. TESTIMONIALS */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 mb-60">
        <div className="flex flex-col items-center mb-24">
          <span className="text-black font-mono text-[12px] tracking-[1em] uppercase font-black">
            TESTIMONIALS
          </span>
          <div className="mb-12" />
        </div>

        {/* Simple Aligned Grid - No Parallax */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {REELS.map((reel, i) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
            >
              <ReelCard reel={reel} />
            </motion.div>
          ))}
        </div>
      </div>



      <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="light-grid-pattern" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M 200 0 L 0 0 0 200" fill="none" stroke="black" strokeWidth="0.5" strokeDasharray="1,10" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#light-grid-pattern)" />
        </svg>
      </div>
    </section>
  );
};
