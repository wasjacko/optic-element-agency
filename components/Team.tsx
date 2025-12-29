
import React from 'react';
import { motion } from 'framer-motion';
import { DashedContainer } from './ui/DashedContainer';

const TEAM = [
  { name: "ALEX RIVERA", role: "Creative Director", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop" },
  { name: "SOPHIA CHEN", role: "VFX Supervisor", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop" },
  { name: "MARCUS KANE", role: "Lead Strategist", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop" }
];

export const Team: React.FC = () => {
  return (
    <section className="bg-tech-black pt-40 pb-20 border-t border-dashed border-white/10 relative z-10" id="team">
      <DashedContainer width="lg" noBorderTop noBorderBottom>
        <div className="flex flex-col items-center mb-24">
          <h2 className="text-4xl md:text-6xl font-light tracking-tighter text-white uppercase mb-4">THE TEAM</h2>
          <div className="w-12 h-px bg-tech-accent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {TEAM.map((member, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative w-full aspect-[4/5] mb-8 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 bg-tech-gray">
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                />
                {/* Corner details */}
                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/20" />
                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/20" />
              </div>
              
              <h3 className="text-sm font-light tracking-[0.3em] text-white uppercase mb-2">
                {member.name}
              </h3>
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>
      </DashedContainer>
    </section>
  );
};
