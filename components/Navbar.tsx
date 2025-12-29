
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'ABOUT US', href: '#about' },
  { label: 'WORK', href: '#works' },
  { label: 'THE LAB', href: '#process' },
  { label: 'GEAR', href: '#contact' },
  { label: 'CONTACT US', href: '#contact-page', isContact: true },
];

interface NavbarProps {
  onContactClick: () => void;
  onHomeClick: () => void;
  onAboutClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onContactClick, onHomeClick, onAboutClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent, item: typeof NAV_ITEMS[0]) => {
    if (item.isContact) {
      e.preventDefault();
      onContactClick();
    } else if (item.href === '#about') {
      e.preventDefault();
      onAboutClick();
    } else if (item.href === '#home') {
      e.preventDefault();
      onHomeClick();
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] flex justify-center pointer-events-none pt-8 px-4">
      <div className="pointer-events-auto bg-black/90 backdrop-blur-md border border-white/10 px-6 py-3 flex items-center justify-between gap-6 md:gap-10 rounded-none shadow-2xl w-full max-w-5xl">

        {/* Logo Image */}
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); onHomeClick(); }}
          className="flex items-center group transition-opacity hover:opacity-80"
        >
          <img
            src="/assets/logo.png"
            alt="Optic Element Logo"
            className="h-10 w-auto"
          />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item)}
              className="text-[10px] font-mono font-black text-white/60 hover:text-white transition-all duration-300 uppercase tracking-[0.2em] relative group whitespace-nowrap"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-tech-accent group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white hover:text-tech-accent transition-colors p-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-24 pointer-events-auto bg-black border border-white/10 p-8 flex flex-col gap-6 w-[80%] max-w-xs left-1/2 -translate-x-1/2 shadow-2xl z-[110]"
          >
            {NAV_ITEMS.map((item, i) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-mono font-black text-white/60 hover:text-white transition-colors uppercase tracking-[0.3em] flex items-center justify-between"
                onClick={(e) => {
                  handleLinkClick(e, item);
                  setIsOpen(false);
                }}
              >
                {item.label}
                <span className="text-[9px] text-tech-accent opacity-40">0{i + 1}</span>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
