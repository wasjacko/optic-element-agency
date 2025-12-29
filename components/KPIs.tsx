import React from 'react';
import { DashedContainer } from './ui/DashedContainer';
import { Stat } from '../types';

const STATS: Stat[] = [
  { label: "ROI (90d)", value: "340", suffix: "%", description: "Return on Ad Spend." },
  { label: "VELOCITY", value: "2.5", suffix: "x", description: "Deployment speed." },
  { label: "RETENTION", value: "92", suffix: "%", description: "Client satisfaction." },
  { label: "REVENUE", value: "150", suffix: "M", description: "Total generated." },
];

export const KPIs: React.FC = () => {
  return (
    <section className="py-40 bg-tech-gray/20 border-t border-dashed border-white/10">
      <DashedContainer showSpine className="border-none" noBorderTop noBorderBottom>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <div key={i} className="relative p-6 border border-white/10 hover:bg-white/5 transition-colors group">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-tech-accent transition-colors" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-tech-accent transition-colors" />

              <div className="text-tech-accent font-mono text-xs mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-tech-accent rounded-sm animate-pulse"></span>
                {stat.label}
              </div>
              {/* Changed font-bold to font-light tracking-tighter */}
              <div className="text-4xl md:text-5xl font-light text-white mb-2 tracking-tighter">
                {stat.value}<span className="text-xl text-white/50 ml-1 tracking-normal">{stat.suffix}</span>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent my-4"></div>
              <p className="text-xs text-gray-400 font-mono uppercase tracking-wide">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </DashedContainer>
    </section>
  );
};