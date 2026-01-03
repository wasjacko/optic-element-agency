
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useScroll, useTransform, useSpring } from 'framer-motion';

const PROJECTS = [
  {
    title: "MEXICO HOUSE",
    subtitle: "NUMERO 0738",
    video: "https://video.wixstatic.com/video/8fb0bb_37ccb7c01fb5468d9465985f791cef9f/1080p/mp4/file.mp4"
  },
  {
    title: "LGCY SOLAR",
    subtitle: "NUMERO 0435",
    video: "https://video.wixstatic.com/video/8fb0bb_b9a25be31bc34c65970d07346fe1f732/480p/mp4/file.mp4"
  },
  {
    title: "KOFFEE CO.",
    subtitle: "NUMERO 0348",
    video: "https://video.wixstatic.com/video/8fb0bb_4722b88e8b614accaadc3be3ba825bf7/480p/mp4/file.mp4"
  }
];

const ProjectCard = ({ project, index }: { project: typeof PROJECTS[0], index: number }) => {
  const cardRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity }}
      className="w-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Project Meta - Subtle Column */}
        <motion.div
          style={{ y: springY }}
          className="lg:col-span-4 self-center pr-12"
        >
          <div className="space-y-4">
            <h3 className="text-4xl md:text-5xl font-black tracking-tight text-black uppercase leading-[0.9]">
              {project.title}
            </h3>
            <p className="font-mono text-[10px] text-black/20 tracking-[0.4em] uppercase font-bold">
              {project.subtitle}
            </p>
          </div>
        </motion.div>

        {/* Video Column - High Quality Simplicty */}
        <div className="lg:col-span-8 relative">
          <motion.div
            style={{ scale }}
            className="aspect-video bg-gray-50 overflow-hidden relative group shadow-2xl"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-all duration-1000 ease-out"
            >
              <source src={project.video} type="video/mp4" />
            </video>

            {/* Subtle Tactical Markers */}
            <div className="absolute top-4 left-4 w-4 h-[1px] bg-white/40" />
            <div className="absolute top-4 left-4 w-[1px] h-4 bg-white/40" />
            <div className="absolute bottom-4 right-4 w-4 h-[1px] bg-white/40" />
            <div className="absolute bottom-4 right-4 w-[1px] h-4 bg-white/40" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export const Projects: React.FC<{ onWorksClick?: () => void }> = ({ onWorksClick }) => {
  return (
    <section id="works" className="relative w-full bg-white py-24 md:py-48 px-6 md:px-12 z-20">
      <div className="max-w-7xl mx-auto">

        {/* Tactical Header - Matching your Sprint Style */}
        <div className="flex flex-col items-center mb-32 md:mb-64 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative inline-block"
          >
            <h2 className="text-black font-mono text-sm md:text-base tracking-[1em] uppercase font-black relative z-10">
              SELECTED WORKS
            </h2>
            <div className="absolute -bottom-4 left-0 w-full h-[3px] bg-[#FF5000]" />
          </motion.div>
        </div>

        {/* Vertical List of Projects */}
        <div className="flex flex-col gap-32 md:gap-64">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} />
          ))}
        </div>

        {/* Final Simple CTA */}
        <div className="mt-40 md:mt-60 flex flex-col items-center">
          <motion.button
            onClick={onWorksClick}
            className="group relative px-8 py-4 bg-black border border-black text-white overflow-hidden shadow-xl"
          >
            <div className="relative z-10 flex items-center gap-3">
              <span className="font-mono text-[11px] font-black tracking-[0.4em] uppercase">
                SEE MORE WORKS
              </span>
              <ArrowUpRight size={18} />
            </div>
          </motion.button>
        </div>

      </div>
    </section>
  );
};
