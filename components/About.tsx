
import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useVelocity, useAnimationFrame, useInView } from 'framer-motion';
import { ArrowUpRight, Plus, Minus } from 'lucide-react';

interface AboutProps {
  onContactClick: () => void;
}

const TEAM_MEMBERS = [
  { name: "Santiago Castro", role: "COO", img: "/santiago.png" },
  { name: "Dharimar Castro", role: "Creative Strategist", img: "/deedee%202025%20headshot.png" },
  { name: "Deztney Ayala", role: "Client Success Manager", img: "/dez%202025%20headshot.png" },
  { name: "Ryan Lotze", role: "Creative Lead Videographer", img: "/ryan%202025%20headshot.png" },
  { name: "Nick", role: "Creative", img: "/nick%202025%20headshot.png" }
];

// Added Scientific/Chemical Properties to each differentiator
const DIFFERENTIATORS = [
  {
    title: "SIMPLICITY",
    subtitle: "Addition by Subtraction",
    desc: "We believe simplicity creates clarity, speed, and scale. We remove before we add. If it doesn't serve the outcome, it doesn't belong.",
    symbol: "Si",
    atomicNumber: "14",
    mass: "28.085",
    group: "PRINCIPLE",
    config: "[Ne] 3s² 3p²"
  },
  {
    title: "EXCELLENCE",
    subtitle: "How you do one thing is how you do everything.",
    desc: "Excellence requires focus, precision, and intentionality. Not shortcuts. God is in the details.",
    symbol: "Ex",
    atomicNumber: "99",
    mass: "252.08",
    group: "QUALITY",
    config: "[Rn] 5f¹¹ 7s²"
  },
  {
    title: "EXPERIMENTALIST",
    subtitle: "Relentless Learning Through Action",
    desc: "We learn by doing. We test, fail, refine, and try again. Curiosity, creativity, and a growth mindset fuel progress.",
    symbol: "Er",
    atomicNumber: "68",
    mass: "167.26",
    group: "INNOVATION",
    config: "[Xe] 4f¹² 6s²"
  },
  {
    title: "STEWARDSHIP",
    subtitle: "We polish what's in our hands and leave it better than we found it.",
    desc: "We take full responsibility for what's placed in our care, knowing it does not belong to us. We treat brands, time, trust, and resources with respect and discipline.",
    symbol: "St",
    atomicNumber: "38",
    mass: "87.62",
    group: "PARTNERSHIP",
    config: "[Kr] 5s²"
  },
  {
    title: "TEMPERED",
    subtitle: "Built to endure.",
    desc: "We do not wish for lighter loads — we build the capacity to carry more. Growth adds responsibility, not volatility. Under pressure, we become more precise, more disciplined, and more aligned.",
    symbol: "Te",
    atomicNumber: "52",
    mass: "127.60",
    group: "BALANCE",
    config: "[Kr] 4d¹⁰ 5s² 5p⁴"
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
        <span className="font-ocr text-[10px] md:text-xs tracking-[0.2em] uppercase text-white cursor-default block">
          {children}
        </span>
      </motion.div>
    </div>
  );
};
const ScrollGlitchText: React.FC<{ text: string, className?: string }> = ({ text, className = "" }) => {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&[]{}<>";

  // Initial Reveal State
  const [revealed, setRevealed] = useState(false);
  const revealRef = useRef(0);

  useEffect(() => {
    // Simple initial reveal animation
    const interval = setInterval(() => {
      if (revealRef.current < text.length) {
        revealRef.current += 3; // Much faster reveal (was 0.5)
      } else {
        setRevealed(true);
        clearInterval(interval);
      }
    }, 15); // Faster updates (was 30)
    return () => clearInterval(interval);
  }, [text]);

  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef);
  const chaosRef = useRef(0);
  const frameRef = useRef(0);

  useAnimationFrame(() => {
    if (!isInView) return;
    if (!revealed) {
      // Handle Initial Reveal Logic in Animation Frame for smoothness with the same state
      const currentLen = Math.floor(revealRef.current);
      setDisplayText(
        text.split("").map((char, i) => {
          if (char === " ") return " ";
          if (i < currentLen) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      return;
    }

    const currentVelocity = Math.abs(velocity.get()); // Get scroll velocity

    // 1. Calculate Target Chaos (Sensitivity)
    // High sensitivity: reaches max intensity at lower scroll speeds (e.g. 150)
    const targetChaos = Math.min(currentVelocity / 150, 1.0);

    // 2. Apply Momentum/Decay to Chaos
    // Fast Attack (reacts instantly to scroll)
    // Quick Decay (stabilizes fast)
    if (targetChaos > chaosRef.current) {
      chaosRef.current = targetChaos;
    } else {
      chaosRef.current *= 0.8; // Faster cool-down (was 0.95)
    }

    // 3. Throttle Updates
    // Only update text every 6 frames (approx 10fps) for better performance
    frameRef.current++;
    if (frameRef.current % 6 !== 0) return;

    // 4. Render Glitch
    if (chaosRef.current > 0.05) {
      const newText = text.split("").map((char) => {
        if (char === " ") return " ";
        if (Math.random() < chaosRef.current * 0.6) {
          return chars[Math.floor(Math.random() * chars.length)];
        }
        return char;
      }).join("");

      // Only set state if the text actually changed
      if (newText !== displayText) {
        setDisplayText(newText);
      }
    } else if (displayText !== text) {
      setDisplayText(text);
    }
  });

  return (
    <span ref={containerRef} className={className}>{displayText}</span>
  );
};

const MemberCard = ({ member, index }: { member: typeof TEAM_MEMBERS[0], index: number }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.02, duration: 0.4 }}
      className="relative flex flex-col group h-full will-change-transform"
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm">
        {/* Corner Brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/50 z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/50 z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/50 z-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/50 z-20 pointer-events-none" />
        {!imageError && member.img ? (
          <img
            src={member.img}
            alt={member.name}
            className="w-full h-full object-cover block"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-[#0A0A0A] flex flex-col items-center justify-center border border-white/5 p-4 text-center">
            <div className="w-10 h-10 border border-white/10 mb-4 bg-white/5 flex items-center justify-center text-white/20 text-xs font-ocr">!</div>
            <span className="text-white/30 text-[9px] font-ocr tracking-widest uppercase">OFFLINE</span>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <h3 className="text-white text-[13px] md:text-base font-bold tracking-widest uppercase mb-1">{member.name}</h3>
        <p className="text-white/50 text-[9px] md:text-xs font-ocr tracking-wider uppercase leading-tight">{member.role}</p>
      </div>
    </motion.div>
  );
};

export const About: React.FC<AboutProps & { data?: any, activeSection?: string }> = ({ onContactClick, data, activeSection }) => {
  useEffect(() => {
    if (!activeSection) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeSection]);

  const showAll = !activeSection;
  const bgColor = data?.backgroundColor || '#ffffff';
  const txtColor = data?.textColor || '#000000';
  const accentColor = data?.accentColor || '#FF5000';

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <div
      className="min-h-screen font-sans overflow-x-hidden pt-12 md:pt-24 selection:bg-black selection:text-white"
      style={{ backgroundColor: bgColor, color: txtColor }}
    >

      {/* SECTION 1: HEADER */}
      {(showAll || activeSection === 'header') && (
        <section className="relative pt-6 pb-2" style={{ backgroundColor: 'transparent' }}>
          <div className="max-w-7xl mx-auto px-10 md:px-6 relative z-10 flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 uppercase text-center" style={{ color: txtColor }}>
              {data?.title || "Who We Are"}
            </h1>
          </div>
        </section>
      )}

      {/* SECTION 2: TEAM VIDEO */}
      {(showAll || activeSection === 'video') && (
        <section className="relative w-full pt-0 pb-0" style={{ backgroundColor: 'transparent' }}>
          <div className="w-full relative z-10">
            <div className="relative w-full h-[25vh] md:h-[40vh] overflow-hidden border-y border-gray-100">
              {/* Halftone Overlay */}
              <div
                className="absolute inset-0 z-20 pointer-events-none opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)',
                  backgroundSize: '4px 4px'
                }}
              />
              {/* Scanline/Screen Effect */}
              <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-2 bg-[length:100%_2px,3px_100%] pointer-events-none" />

              <video
                ref={videoRef}
                src={data?.videoUrl || "https://video.wixstatic.com/video/8fb0bb_3101935948d84d248cbb6453b7ba87e8/720p/mp4/file.mp4"}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: MEET THE TEAM (DARK INDUSTRIAL) */}
      {(showAll || activeSection === 'team') && (
        <section className="bg-black text-white pt-16 md:pt-24 pb-24 md:pb-48 relative overflow-hidden border-t border-white/10">
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] blur-[80px] rounded-full pointer-events-none opacity-20 mix-blend-screen" style={{ backgroundColor: accentColor || '#FF5000' }} />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] blur-[100px] rounded-full pointer-events-none opacity-15 mix-blend-screen" style={{ backgroundColor: accentColor || '#FF5000' }} />
          <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `radial-gradient(${accentColor} 1px, transparent 1px)`, backgroundSize: '8px 8px' }} />

          <div className="max-w-7xl mx-auto px-10 md:px-6 relative z-10">


            <div className="flex flex-col items-center mb-16 md:mb-24">
              <h2 className="text-white font-black text-2xl md:text-4xl tracking-tighter uppercase text-center mb-10 md:mb-16">
                THE TEAM
              </h2>

              <div className="flex justify-center max-w-4xl px-10 md:px-6 leading-relaxed items-center">
                <div className="text-xs md:text-base font-ocr text-gray-500 text-center">
                  <ScrollGlitchText text='"If you want to go fast, go alone. If you want to go far, go together."' />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {TEAM_MEMBERS.map((member, i) => (
                <MemberCard key={member.name + i} member={member} index={i} />
              ))}
            </div>

          </div>
        </section>
      )}

      {/* SECTION 4: CORE VALUES 2.0 */}
      {(showAll || activeSection === 'diffs') && (
        <section className="pt-12 pb-32 border-t border-black/5 text-inherit" style={{ backgroundColor: 'transparent', borderColor: txtColor === '#ffffff' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
          <div className="max-w-7xl mx-auto px-10 md:px-6">
            <div className="flex flex-col items-center justify-center py-4 mb-12">
              <h2 className="text-2xl md:text-4xl font-black uppercase text-center leading-tight tracking-tighter cursor-default text-black">
                Core Values 2.0
              </h2>
            </div>

            <div className={`grid grid-cols-1 ${isMobile ? 'gap-12' : 'md:grid-cols-6 gap-8'} pb-4`}>
              {DIFFERENTIATORS.map((diff: any, i) => {
                if (isMobile) {
                  return (
                    <div
                      key={i}
                      className="relative px-8 py-16 flex flex-col items-center text-center w-full bg-white border border-gray-100"
                    >
                      {/* Prominent Mobile Brackets */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#FF5000] z-10" />
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#FF5000] z-10" />
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#FF5000] z-10" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#FF5000] z-10" />

                      <h4 className="text-2xl font-black uppercase tracking-tighter text-black mb-6 leading-none">
                        {diff.title}
                      </h4>
                      <p className="text-[12px] leading-relaxed text-gray-500 font-ocr uppercase tracking-[0.05em] max-w-[240px]">
                        {diff.desc}
                      </p>
                    </div>
                  );
                }

                // Desktop 3+2 Layout Math
                const desktopGridClasses = i < 3
                  ? "md:col-span-2"
                  : (i === 3 ? "md:col-start-2 md:col-span-2" : "md:col-span-2");

                return (
                  <div
                    key={i}
                    className={`group relative p-8 md:p-10 flex flex-col h-full w-full bg-transparent border border-gray-200 hover:border-[#FF5000]/40 transition-colors duration-500 ease-out will-change-transform backface-hidden aspect-square ${desktopGridClasses}`}
                  >
                    {/* Hover Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-[#1a0600] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none" />

                    {/* Periodic Table Styled Background Decor */}
                    <div className="absolute top-8 right-8 text-right opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                      <div className="text-5xl font-black text-black group-hover:text-white transition-colors duration-500">{diff.symbol}</div>
                    </div>

                    {/* Corner Squares */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-black transition-colors duration-500 group-hover:bg-[#FF5000] z-10" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-black transition-colors duration-500 group-hover:bg-[#FF5000] z-10" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-black transition-colors duration-500 group-hover:bg-[#FF5000] z-10" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-black transition-colors duration-500 group-hover:bg-[#FF5000] z-10" />

                    {/* Header */}
                    <div className="relative z-10 flex justify-between items-start mb-6 border-b border-gray-100 group-hover:border-white/20 pb-4 transition-colors duration-500">
                      <div className="flex flex-col">
                        <span className="font-ocr text-[10px] tracking-widest text-[#FF5000] mb-1">{diff.atomicNumber}</span>
                        <span className="font-ocr text-[10px] tracking-widest text-gray-400 group-hover:text-white/50 transition-colors duration-500">
                          {diff.symbol}
                        </span>
                      </div>
                      <span className="font-ocr text-[10px] tracking-widest uppercase text-gray-400 group-hover:text-white/50 transition-colors duration-500">
                        {diff.group}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div>
                        {/* Title */}
                        <div className="min-h-[4rem] flex items-end mb-6">
                          <h4 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black group-hover:text-white leading-none w-full transition-colors duration-500">
                            {diff.title}
                          </h4>
                        </div>

                        {/* Separator */}
                        <div className="w-full h-px bg-gray-200 group-hover:bg-white/20 mb-6 transition-colors duration-500" />

                        <p className="text-[11px] md:text-[12px] leading-relaxed text-gray-400 group-hover:text-white/60 font-ocr uppercase tracking-wider transition-colors duration-500">
                          {diff.desc}
                        </p>
                      </div>

                      {/* Scientific Footer Reveal */}
                      <div className="mt-6 pt-3 border-t border-transparent group-hover:border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-700">
                        <div className="flex justify-between items-center font-ocr text-[9px] tracking-widest text-white/20">
                          <span>{diff.mass}</span>
                          <span>{diff.config}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

    </div >
  );
};
