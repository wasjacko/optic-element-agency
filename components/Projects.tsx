
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Plus, Terminal } from 'lucide-react';

const PROJECTS = [
  {
    id: "LOG_01",
    title: "NEURAL INTERFACE",
    client: "NEURALINK",
    category: "BIOMETRIC_VISUALIZATION",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    id: "LOG_02",
    title: "ORBITAL LOGISTICS",
    client: "SPACEX",
    category: "AEROSPACE_TELEMETRY",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  {
    id: "LOG_03",
    title: "AUTONOMOUS FLEET",
    client: "TESLA",
    category: "ML_VISUAL_ENGINEERING",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  {
    id: "LOG_04",
    title: "DEFENSE GRID",
    client: "ANDURIL",
    category: "TACTICAL_OS_INTERFACE",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
  }
];

const ProjectCard: React.FC<{ project: typeof PROJECTS[0], index: number }> = ({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      className="group relative flex flex-col bg-[#080808] border border-white/[0.05] hover:border-white/20 transition-all duration-500 overflow-hidden"
    >
      {/* Visual Container */}
      <div className="aspect-video relative overflow-hidden bg-black">
        <video
          src={project.video}
          autoPlay loop muted playsInline
          className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100"
        />

        {/* Minimal Overlay - Only icon */}
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
            <Plus size={14} />
          </div>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-8">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="text-[9px] font-mono text-white/40 tracking-[0.2em] font-medium uppercase">{project.category.replace(/_/g, ' ')}</div>
            <h3 className="text-2xl font-light tracking-tight text-white uppercase group-hover:text-tech-accent transition-colors">
              {project.title}
            </h3>
          </div>
          <ArrowUpRight size={20} className="text-white/20 group-hover:text-tech-accent transition-colors" />
        </div>
      </div>

      {/* Hover corner markers */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-tech-accent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-tech-accent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

export const Projects: React.FC = () => {
  return (
    <section id="works" className="bg-tech-black py-40 border-t border-white/[0.03] relative">

      {/* Background technical text */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-[0.02] pointer-events-none select-none">
        <span className="text-[20rem] font-black tracking-tighter uppercase italic">ARCHIVE</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Simplified Header */}
        <div className="mb-24">
          <h2 className="text-7xl md:text-9xl font-light tracking-tighter text-white uppercase leading-none">
            SELECTED <span className="text-white/10 italic" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.05)' }}>WORKS.</span>
          </h2>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* Section Footer */}
        <div className="mt-32 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black px-12 py-5 font-mono text-[11px] font-medium uppercase tracking-[0.3em] hover:bg-tech-accent hover:text-white transition-colors duration-300"
          >
            View More Works
          </motion.button>
        </div>
      </div>

      {/* Dashed Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="work-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2,8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#work-grid)" />
        </svg>
      </div>
    </section>
  );
};
