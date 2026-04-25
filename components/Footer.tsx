
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Instagram, Facebook, Youtube } from 'lucide-react';


export const Footer: React.FC<{ onContactClick?: () => void }> = ({ onContactClick }) => {
  return (
    <footer className="pt-32 pb-16 border-t border-white/10 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>

      <div className="max-w-[1800px] mx-auto px-8 md:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 mb-24 items-end">
          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col gap-2"
          >
            <h2
              onClick={onContactClick}
              className="text-5xl md:text-8xl font-light tracking-tighter text-white uppercase leading-[0.9] cursor-pointer hover:opacity-70 transition-opacity"
            >
              LET'S WORK<br />
              <span className="text-white font-light">TOGETHER</span>
            </h2>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col md:items-end gap-10 text-left md:text-right"
          >
            <div className="space-y-1">
              <p className="text-lg md:text-xl font-light uppercase tracking-tight text-white">
                1499 Poinsettia Ave Suite 164
              </p>
              <p className="text-lg md:text-xl font-light uppercase tracking-tight text-white/40">
                Vista, CA
              </p>
            </div>

            <div className="flex flex-col md:items-end gap-4">
              <a href="mailto:hello@opticelement.com" className="group flex flex-row items-center gap-3 text-lg md:text-2xl font-light uppercase tracking-tight text-white hover:text-white/60 transition-colors break-all md:break-normal w-fit">
                HELLO@OPTICELEMENT.COM
                <div className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-full group-hover:bg-white group-hover:text-black transition-all shrink-0">
                  <ArrowUpRight size={20} className="transition-all" />
                </div>
              </a>
            </div>
          </motion.div>
        </div>

        <div className="h-px w-full bg-white/10 mb-12" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-ocr text-white/30 uppercase tracking-[0.2em] gap-8">
          <div className="flex items-center gap-8 text-center md:text-left">
            <span>© 2026 OPTIC ELEMENT.</span>
            <div className="w-px h-3 bg-white/20 hidden md:block" />
            <span>ALL RIGHTS RESERVED.</span>
          </div>

          <div className="flex gap-8 md:gap-10 items-center">

            <a href="https://www.facebook.com/opticxelement" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Facebook">
              <Facebook size={18} strokeWidth={1.5} />
            </a>
            <a href="https://www.instagram.com/optic.element/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
              <Instagram size={18} strokeWidth={1.5} />
            </a>
            <a href="https://www.youtube.com/channel/UCshhDjajuDEy1spbRy7npDQ" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="YouTube">
              <Youtube size={18} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
