
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Instagram, Facebook, Youtube } from 'lucide-react';


export const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-40 pb-10 border-t border-black/[0.05] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-[10vw] leading-[0.8] font-light tracking-tighter text-tech-black uppercase select-none"
          >
            LET'S <br />
            WORK <span className="text-black/10">TOGETHER.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-12 md:mt-0 md:mb-4 flex flex-col items-start md:items-end gap-6 text-right"
          >
            <div className="flex flex-col items-start md:items-end gap-1">
              <p className="text-xl md:text-2xl font-light uppercase tracking-tight text-tech-black">
                1495 Poinsettia Ave Suite 146
              </p>
              <p className="text-xl md:text-2xl font-light uppercase tracking-tight text-black/60">
                San Diego, CA
              </p>
            </div>

            <a href="mailto:hello@opticelement.com" className="group flex items-center gap-2 text-xl md:text-2xl font-light uppercase tracking-tight text-tech-accent hover:text-black transition-colors">
              hello@opticelement.com
              <ArrowUpRight size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
            </a>

            <p className="text-black/40 font-mono text-[10px] uppercase tracking-widest">
              Monday - Friday [ 9am - 5pm ]
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="h-px w-full bg-black/[0.1] mb-8 origin-left"
        />

        <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-black/30 uppercase tracking-[0.2em] gap-6">
          <div className="flex flex-col md:flex-row gap-6 text-center md:text-left">
            <span>© 2026 OPTIC ELEMENT.</span>
            <span>ALL RIGHTS RESERVED.</span>
          </div>

          <div className="flex gap-8 items-center">
            <a href="https://www.facebook.com/opticxelement" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" aria-label="Facebook">
              <Facebook size={18} strokeWidth={1.5} />
            </a>
            <a href="https://www.instagram.com/optic.element/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" aria-label="Instagram">
              <Instagram size={18} strokeWidth={1.5} />
            </a>
            <a href="https://www.youtube.com/channel/UCshhDjajuDEy1spbRy7npDQ" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" aria-label="YouTube">
              <Youtube size={18} strokeWidth={1.5} />
            </a>
          </div>

          <span className="hidden md:block">EST. 2024</span>
        </div>
      </div>
    </footer>
  );
};
