
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Grid, List, Filter } from 'lucide-react';

const PROJECTS = [
  { id: "LOG_001", title: "NEURAL INTERFACE", client: "Neuralink", type: "VFX", img: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=600&auto=format&fit=crop" },
  { id: "LOG_002", title: "ORBITAL SYSTEMS", client: "SpaceX", type: "TELEMETRY", img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600&auto=format&fit=crop" },
  { id: "LOG_003", title: "QUANTUM CHIP", client: "IBM", type: "3D RENDER", img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop" },
  { id: "LOG_004", title: "DYNAMICS ALPHA", client: "Boston Dynamics", type: "MOTION", img: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?q=80&w=600&auto=format&fit=crop" },
];

export const WorksPage: React.FC = () => {
  return (
    <div className="bg-tech-black text-white min-h-screen pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-tech-accent animate-pulse" />
                 <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Archive Status: Online</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">WORKS</h1>
           </div>
           <div className="flex gap-4 bg-[#0A0A0A] border border-white/5 p-2 rounded-2xl">
              <button className="p-4 bg-white/5 rounded-xl hover:text-tech-accent transition-colors"><Grid size={18} /></button>
              <button className="p-4 rounded-xl text-white/20 hover:text-white transition-colors"><List size={18} /></button>
              <div className="w-px h-full bg-white/5" />
              <button className="flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-mono uppercase tracking-widest hover:bg-white/5">
                <Filter size={14} /> Filter Output
              </button>
           </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          
          {/* Main Showcase */}
          <div className="lg:col-span-8 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PROJECTS.map((proj, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-[#0A0A0A] border border-white/5 rounded-[2rem] overflow-hidden p-6 hover:border-tech-accent/40 transition-all duration-500"
                  >
                    <div className="aspect-video bg-white/5 rounded-2xl mb-6 overflow-hidden relative">
                       <img src={proj.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={proj.title} />
                       <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-white/90 p-4 rounded-full text-black scale-90 group-hover:scale-100 transition-transform">
                             <Play size={20} fill="currentColor" />
                          </div>
                       </div>
                    </div>
                    <div className="flex justify-between items-start">
                       <div>
                          <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1">{proj.id} // {proj.type}</p>
                          <h3 className="text-xl font-bold tracking-tight uppercase group-hover:text-tech-accent transition-colors">{proj.title}</h3>
                          <p className="text-[10px] font-mono text-white/20 uppercase mt-2">Client: {proj.client}</p>
                       </div>
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>

          {/* Side Logs */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-10">
                <h3 className="font-bold tracking-tight uppercase mb-8">Performance Metrics</h3>
                <div className="space-y-8">
                   <div>
                      <div className="flex justify-between items-center mb-3">
                         <span className="text-[10px] font-mono text-white/30 uppercase">Avg. View Duration</span>
                         <span className="text-[10px] font-mono text-tech-accent">84%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-tech-accent w-[84%]" />
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between items-center mb-3">
                         <span className="text-[10px] font-mono text-white/30 uppercase">Brand Recall</span>
                         <span className="text-[10px] font-mono text-cyan-500">92%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 w-[92%]" />
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-white text-black rounded-[2rem] p-10 flex flex-col justify-between min-h-[400px]">
                <div className="space-y-1">
                   <p className="text-[10px] font-mono opacity-40 uppercase tracking-widest">Next Evolution</p>
                   <h3 className="text-4xl font-black tracking-tighter uppercase leading-none">YOUR<br/>PROJECT<br/>HERE</h3>
                </div>
                <p className="text-xs font-sans opacity-60 leading-relaxed max-w-[240px]">
                  Join the elite partners currently redefining visual matter. Initialize your own log entries today.
                </p>
                <button className="bg-tech-black text-white py-4 rounded-xl text-[10px] font-mono uppercase tracking-[0.3em] font-bold hover:bg-tech-accent transition-colors">
                  INITIALIZE LOGS
                </button>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};
