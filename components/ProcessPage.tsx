
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

const SPRINT_LOGS = [
  { step: "01", name: "STRATEGY", status: "COMPLETED", log: "Hypothesis defined. Narrative core localized." },
  { step: "02", name: "PLAN", status: "COMPLETED", log: "Resource allocation mapping finalized." },
  { step: "03", name: "ROLL", status: "ACTIVE", log: "Current phase: Raw material acquisition." },
  { step: "04", name: "INITIATE", status: "PENDING", log: "Post-production sequence queued." },
  { step: "05", name: "NOTIFY", status: "PENDING", log: "Feedback loop parameters initialized." },
  { step: "06", name: "LAUNCH", status: "PENDING", log: "Final distribution protocol on standby." },
];

export const ProcessPage: React.FC = () => {
  return (
    <div className="bg-tech-black text-white min-h-screen pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3 bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-10 flex flex-col justify-center">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-tech-accent" />
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em]">Operational Pipeline</span>
             </div>
             <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-6">THE SPRINT</h1>
             <p className="text-white/40 max-w-xl text-lg font-light leading-relaxed">
               A high-velocity production system engineered to convert abstract vision into quantifiable visual assets within 30-day cycles.
             </p>
          </div>
          
          <div className="bg-tech-accent rounded-[2rem] p-10 flex flex-col items-center justify-center text-center">
             <div className="bg-white/10 p-4 rounded-full mb-6">
                <Zap size={32} className="text-white" />
             </div>
             <div className="text-5xl font-black tracking-tighter mb-2">30</div>
             <div className="text-[10px] font-mono uppercase tracking-widest opacity-70">Day Cycle Velocity</div>
          </div>
        </div>

        {/* The Logistics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Blueprint */}
          <div className="lg:col-span-8 bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-10 overflow-hidden relative">
             <div className="absolute top-10 right-10 text-[10px] font-mono text-white/20">BLUEPRINT_V2.04</div>
             <h3 className="text-xl font-bold tracking-tight mb-12 uppercase">Sprint Roadmap</h3>
             
             <div className="space-y-4">
                {SPRINT_LOGS.map((log, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-tech-accent/30 transition-colors"
                  >
                    <span className="text-2xl font-black text-white/10 group-hover:text-tech-accent transition-colors">{log.step}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-sm tracking-widest uppercase">{log.name}</h4>
                        <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full ${log.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' : log.status === 'ACTIVE' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-white/5 text-white/20'}`}>
                          {log.status}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-white/40 uppercase">{log.log}</p>
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>

          {/* Side Metrics */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-10">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="font-bold tracking-tight uppercase">Efficiency Index</h3>
                   <Activity size={20} className="text-cyan-500" />
                </div>
                <div className="flex items-end gap-2 mb-6">
                   <span className="text-6xl font-black tracking-tighter">98.2</span>
                   <span className="text-white/20 font-mono text-sm mb-2">%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '98.2%' }}
                    className="h-full bg-cyan-500" 
                   />
                </div>
                <p className="mt-6 text-[10px] font-mono text-white/30 uppercase tracking-widest">Minimal Friction Ratio Detected</p>
             </div>

             <div className="bg-white text-black rounded-[2rem] p-10 flex flex-col justify-between min-h-[300px]">
                <ShieldCheck size={40} className="text-tech-accent" />
                <div>
                   <h3 className="text-3xl font-black tracking-tighter leading-none mb-4 uppercase">Reliability Protocol</h3>
                   <p className="text-xs font-sans opacity-60 leading-relaxed">
                     Every asset is stress-tested across 12 different visual neural networks before deployment to ensure maximum aesthetic impact.
                   </p>
                </div>
                <button className="mt-8 border-b border-black/20 text-[10px] font-mono uppercase tracking-widest text-left pb-2 hover:border-black transition-colors">
                  View Validation Standards
                </button>
             </div>
          </div>

        </div>

        {/* Global Action */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
             <div className="bg-white/5 p-4 rounded-2xl">
                <Clock size={24} className="text-white/40" />
             </div>
             <div>
                <h3 className="font-bold uppercase tracking-tight">System Initialization Ready</h3>
                <p className="text-[10px] font-mono text-white/40">Next Sprint Start: Monday, 09:00 AM</p>
             </div>
          </div>
          <button className="bg-white text-black font-black px-12 py-5 rounded-2xl text-xs uppercase tracking-[0.4em] hover:bg-tech-accent hover:text-white transition-all flex items-center gap-4 group">
            START 30-DAY SPRINT <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};
