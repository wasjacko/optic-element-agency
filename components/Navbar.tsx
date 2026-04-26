import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useAnimationFrame } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'HOME', href: '#home' },
  { label: 'ABOUT US', href: '#about' },
  { label: 'PROJECTS', href: '#works' },
  { label: 'OUR PROCESS', href: '#process' },
];

const HoverGlitchText: React.FC<{ text: string, isHovered: boolean }> = ({ text, isHovered }) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isHovered) {
      let iteration = -1.5; // Starts negative for a very brief 50ms full-word glitch before reveal
      let rAFId: number;
      const glitchChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789[]<>-_";

      const loop = () => {
        if (spanRef.current) {
          const newText = text.split("").map((char, index) => {
            if (char === " ") return " ";

            // Individual character jitter (+/- 20% approx)
            const jitter = Math.sin(index * 987.654) * 0.6;

            // If the "reveal wave" (plus jitter) has passed this character AND iteration is positive
            if (iteration > 0 && index < iteration + jitter) {
              return text[index];
            }

            // Otherwise, keep glitching it
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }).join("");

          spanRef.current.textContent = newText;

          if (iteration < text.length) {
            iteration += 0.15;
            rAFId = requestAnimationFrame(loop);
          } else {
            spanRef.current.textContent = text;
          }
        }
      };

      rAFId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rAFId);
    } else {
      if (spanRef.current && spanRef.current.textContent !== text) {
        spanRef.current.textContent = text;
      }
    }
  }, [isHovered, text]);

  return (
    <span className="relative inline-block">
      <span className="opacity-0">{text}</span>
      <span ref={spanRef} className="absolute top-0 left-0 pointer-events-none">{text}</span>
    </span>
  );
};

const NavItem: React.FC<{ item: typeof NAV_ITEMS[0], activePage: string, handleLinkClick: any, onPreload: any }> = ({ item, activePage, handleLinkClick, onPreload }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isActive =
    (item.label === 'HOME' && activePage === 'home') ||
    (item.label === 'ABOUT US' && activePage === 'about') ||
    (item.label === 'PROJECTS' && activePage === 'work') ||
    (item.label === 'OUR PROCESS' && activePage === 'process');

  return (
    <a
      href={item.href}
      onClick={(e) => handleLinkClick(e, item)}
      onMouseEnter={() => {
        setIsHovered(true);
        onPreload?.(item.href.replace('#', ''));
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group flex flex-col items-center justify-center py-1 whitespace-nowrap"
    >
      <span className="text-[11px] font-mono font-bold text-white transition-colors duration-300 uppercase tracking-[0.2em]">
        <HoverGlitchText text={item.label} isHovered={isHovered} />
      </span>
      <span className={`absolute bottom-0 left-0 h-[1px] bg-[var(--color-primary)] transition-all duration-300 ease-[0.16,1,0.3,1] ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
    </a>
  );
};

interface NavbarProps {
  onContactClick: () => void;
  onHomeClick: () => void;
  onAboutClick: () => void;
  onWorksClick: () => void;
  onLabClick: () => void;
  onProcessClick: () => void;
  onPreload?: (page: string) => void;
  isScrolled: boolean;
  introCompleted?: boolean;
  introExpanded?: boolean;
  forceHide?: boolean;
  activePage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onContactClick, onHomeClick, onAboutClick, onWorksClick, onLabClick, onProcessClick, onPreload, isScrolled, introCompleted = false, introExpanded = false, forceHide = false, activePage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isContactHovered, setIsContactHovered] = useState(false); // For Contact Button Glitch
  const [isBookStudioHovered, setIsBookStudioHovered] = useState(false);

  const handleLinkClick = (e: React.MouseEvent, item: typeof NAV_ITEMS[0]) => {
    if (item.href === '#about') {
      e.preventDefault();
      onAboutClick();
    } else if (item.href === '#works') {
      e.preventDefault();
      onWorksClick();
    } else if (item.href === '#process') {
      e.preventDefault();
      onProcessClick();
    } else if (item.href === '#lab') {
      e.preventDefault();
      onLabClick();
    } else if (item.href === '#home') {
      e.preventDefault();
      onHomeClick();
    }
  };

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY.current) > 10) {
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        lastScrollY.current = currentScrollY;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <motion.nav
      initial={{ y: "-100%" }}
      animate={{ y: isVisible && (introExpanded || introCompleted || activePage !== 'home') && !forceHide ? "0%" : "-100%" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 w-full z-[999] md:border-b border-white/5 will-change-transform backface-hidden`}
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-overlay" />

      <div className="flex justify-center w-full px-10 md:px-32">
        <div className="relative w-full max-w-[1800px] py-4 flex items-center justify-between">





          {/* Left Side: Logo & Main Nav - With Padding to align with footer max-width internal content */}
          <div className="flex items-center gap-8 relative z-10 ml-0 md:ml-4">
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); onHomeClick(); }}
              className="flex items-center group transition-opacity hover:opacity-80"
            >
              <svg viewBox="0 0 100 100" className="h-10 w-10" fill="none">
                {/* White Brackets */}
                <path d="M0 0H30V10H10V30H0V0Z" fill="white" />
                <path d="M70 0H100V30H90V10H70V0Z" fill="white" />
                <path d="M100 70V100H70V90H90V70H100Z" fill="white" />
                <path d="M30 100H0V70H10V90H30V100Z" fill="white" />

                {/* Orange Plus */}
                <path d="M44 32H56V44H68V56H56V68H44V56H32V44H44V32Z" fill="#EF5304" />
              </svg>

            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-10">
              {NAV_ITEMS.map((item) => (
                <NavItem
                  key={item.label}
                  item={item}
                  activePage={activePage}
                  handleLinkClick={handleLinkClick}
                  onPreload={onPreload}
                />
              ))}
            </div>
          </div>

          {/* Right Side: Contact Button & Mobile Toggle */}
          <div className="flex items-center gap-4 md:gap-8 relative z-10 mr-0 md:mr-4">
            {/* Tactical Contact Button */}
            {/* Book Studio Button */}
            <button
              onClick={onLabClick}
              onMouseEnter={() => setIsBookStudioHovered(true)}
              onMouseLeave={() => setIsBookStudioHovered(false)}
              className="hidden md:block group relative px-8 py-3 bg-white/5 hover:bg-white transition-all duration-500 overflow-hidden border border-white/10 hover:border-white"
            >
              {/* Brackets/Corners */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white group-hover:border-black transition-colors" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white group-hover:border-black transition-colors" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white group-hover:border-black transition-colors" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white group-hover:border-black transition-colors" />

              <span className="text-[11px] font-mono font-bold text-white group-hover:text-black transition-colors uppercase tracking-[0.3em] whitespace-nowrap">
                <HoverGlitchText text="BOOK STUDIO" isHovered={isBookStudioHovered} />
              </span>
            </button>

            {/* Tactical Contact Button - Orange Secondary */}
            <button
              onClick={onContactClick}
              onMouseEnter={() => setIsContactHovered(true)}
              onMouseLeave={() => setIsContactHovered(false)}
              className="hidden md:block group relative px-8 py-3 bg-[#EF5304] hover:bg-[#EF5304]/90 transition-all duration-500 overflow-hidden"
            >
              {/* Brackets/Corners */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white transition-colors" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white transition-colors" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white transition-colors" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white transition-colors" />

              <span className="text-[11px] font-mono font-bold text-white transition-colors uppercase tracking-[0.3em] whitespace-nowrap">
                <HoverGlitchText text="CONTACT US" isHovered={isContactHovered} />
              </span>
            </button>

            <button
              className="md:hidden text-white hover:opacity-60 transition-colors p-1"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div >

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 left-0 w-full h-[100dvh] bg-[#050505] z-[110] flex flex-col"
          >
            {/* Nav Header Replicated for Overlay */}
            <div className="flex justify-center w-full px-10 md:px-32">
              <div className="relative w-full max-w-[1800px] py-4 flex items-center justify-between">
                <div className="flex items-center gap-8 relative z-10 ml-0 md:ml-4">
                  <a href="#home" onClick={(e) => { e.preventDefault(); onHomeClick(); setIsOpen(false); }} className="flex items-center group transition-opacity hover:opacity-80">
                    <svg viewBox="0 0 100 100" className="h-10 w-10" fill="none">
                      <path d="M0 0H30V10H10V30H0V0Z" fill="white" />
                      <path d="M70 0H100V30H90V10H70V0Z" fill="white" />
                      <path d="M100 70V100H70V90H90V70H100Z" fill="white" />
                      <path d="M30 100H0V70H10V90H30V100Z" fill="white" />
                      <path d="M44 32H56V44H68V56H56V68H44V56H32V44H44V32Z" fill="#EF5304" />
                    </svg>
                  </a>
                </div>
                <div className="flex items-center gap-4 md:gap-8 relative z-10 mr-0 md:mr-4">
                  <button className="md:hidden text-white hover:opacity-60 transition-colors p-1" onClick={() => setIsOpen(false)}>
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col items-center justify-start pt-24 pb-12 flex-1 gap-10 min-h-0 overflow-y-auto">
              {NAV_ITEMS.map((item, i) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-[14px] font-black text-white hover:text-[#EF5304] cursor-pointer transition-colors uppercase tracking-[0.3em] flex items-center group"
                  onClick={(e) => {
                    handleLinkClick(e, item);
                    setIsOpen(false);
                  }}
                >
                  {item.label}
                </a>
              ))}

              <div className="flex flex-col gap-4 mt-6">
                <button
                  onClick={() => { onLabClick(); setIsOpen(false); }}
                  className="px-12 py-4 bg-white text-black font-black uppercase tracking-[0.3em] text-[14px] transition-colors relative"
                >
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black/20 z-20" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black/20 z-20" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black/20 z-20" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black/20 z-20" />
                  BOOK STUDIO
                </button>

                <button
                  onClick={() => { onContactClick(); setIsOpen(false); }}
                  className="px-12 py-5 bg-[#EF5304] text-white font-black uppercase tracking-[0.3em] text-[14px] shadow-2xl relative"
                >
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black/30 z-20" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black/30 z-20" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black/30 z-20" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black/30 z-20" />
                  CONTACT US
                </button>
              </div>
            </div>

            {/* Decorative bottom element */}
            <div className="w-full text-center pb-8 opacity-30">
              <span className="font-ocr text-[9px] tracking-widest text-white uppercase">// OPTICELEMENT</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav >
  );
};
