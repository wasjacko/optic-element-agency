
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'HOME', href: '#home' },
  { label: 'ABOUT US', href: '#about' },
  { label: 'WORKS', href: '#works' },
  { label: 'THE LAB', href: '#process' },
];

interface NavbarProps {
  onContactClick: () => void;
  onHomeClick: () => void;
  onAboutClick: () => void;
  onWorksClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onContactClick, onHomeClick, onAboutClick, onWorksClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent, item: typeof NAV_ITEMS[0]) => {
    if (item.href === '#about') {
      e.preventDefault();
      onAboutClick();
    } else if (item.href === '#works') {
      e.preventDefault();
      onWorksClick();
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
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-[0.16,1,0.3,1] ${isVisible ? 'translate-y-0' : '-translate-y-full'} bg-[#050505] border-b border-white/5`}>
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-overlay" />

      <div className="flex justify-center w-full px-6 md:px-32">
        <div className="relative w-full max-w-[1800px] py-4 flex items-center justify-between">





          {/* Left Side: Logo & Main Nav - With Padding to align with footer max-width internal content */}
          <div className="flex items-center gap-8 relative z-10 px-6 md:px-0 ml-0 md:ml-4">
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); onHomeClick(); }}
              className="flex items-center group transition-opacity hover:opacity-80"
            >
              <img
                src="/assets/logo.png"
                alt="Optic Element Logo"
                className="h-6 w-auto brightness-0 invert"
              />
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-10">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item)}
                  className="relative group flex flex-col items-center justify-center py-1"
                >
                  <span className="text-[11px] font-mono font-bold text-white transition-colors duration-300 uppercase tracking-[0.2em]">
                    {item.label}
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#FF5000] group-hover:w-full transition-all duration-300 ease-[0.16,1,0.3,1]" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Side: Contact Button & Mobile Toggle */}
          <div className="flex items-center gap-8 relative z-10 px-6 md:px-0 mr-0 md:mr-4">
            {/* Tactical Contact Button */}
            <button
              onClick={onContactClick}
              className="hidden md:block group relative px-8 py-3 bg-white/5 hover:bg-[#FF5000] transition-all duration-500 overflow-hidden"
            >
              {/* Brackets/Corners */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white group-hover:border-black transition-colors" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white group-hover:border-black transition-colors" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white group-hover:border-black transition-colors" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white group-hover:border-black transition-colors" />

              <span className="text-[11px] font-mono font-bold text-white group-hover:text-black transition-colors uppercase tracking-[0.3em]">
                CONTACT US
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
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-24 bg-zinc-900/95 backdrop-blur-xl border border-white/10 p-8 flex flex-col gap-6 w-[90%] left-1/2 -translate-x-1/2 shadow-2xl shadow-black/50 z-[110]"
          >
            {NAV_ITEMS.map((item, i) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-mono font-bold text-white transition-colors uppercase tracking-[0.3em] flex items-center justify-between group"
                onClick={(e) => {
                  handleLinkClick(e, item);
                  setIsOpen(false);
                }}
              >
                {item.label}
                <span className="text-[9px] text-white/20 group-hover:text-[#FF5000] transition-colors">0{i + 1}</span>
              </a>
            ))}
            <button
              onClick={() => { onContactClick(); setIsOpen(false); }}
              className="mt-4 w-full py-4 bg-[#FF5000] text-black font-mono font-bold uppercase tracking-[0.3em] text-xs"
            >
              CONTACT US
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav >
  );
};
