import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';

const PROJECTS = [
  {
    title: "PROPERTY 06",
    subtitle: "NUMERO 0001",
    src: "/assets/property-06.mp4",
    poster: "/assets/property-06.jpg"
  },
  {
    title: "THE ONE",
    subtitle: "NUMERO 0002",
    src: "/assets/the-one.mp4",
    poster: "/assets/the-one.jpg"
  },
  {
    title: "SEASON TRAILER",
    subtitle: "NUMERO 0003",
    src: "/assets/season-trailer.mp4",
    poster: "/assets/season-trailer.jpg"
  },
  {
    title: "PROPERTY 07",
    subtitle: "NUMERO 0004",
    src: "/assets/property-07.mp4",
    poster: "/assets/property-07.jpg"
  },
  {
    title: "MAFIA BOSS",
    subtitle: "NUMERO 0005",
    src: "/assets/ex-mafia.mp4",
    poster: "/assets/ex-mafia.jpg"
  }
];

// Configuration
const CARD_WIDTH = 250;
const CARD_HEIGHT = 250;
const GAP = 100;

const VideoModal = ({ video, isOpen, onClose }: { video: any, isOpen: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-12"
          onClick={onClose}
        >
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={onClose}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[10000]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </motion.button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-6xl aspect-video bg-black shadow-2xl overflow-hidden border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tactical Brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/20 z-50 pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/20 z-50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/20 z-50 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/20 z-50 pointer-events-none" />

            <video
              src={video.src}
              className="w-full h-full object-contain"
              controls
              autoPlay
              playsInline
            />

            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">{video.title}</h3>
              <p className="text-xs font-mono text-white/40 uppercase tracking-[0.3em] pl-4 border-l border-[#EF5304]">{video.subtitle}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ParabolicCard = React.memo(({ project, index, scrollX, onClick }: { project: any, index: number, scrollX: any, onClick: () => void }) => {
  const myPosition = index * (CARD_WIDTH + GAP);

  const startTime = 5;
  const loopDuration = 4;
  const loopEndTime = startTime + loopDuration;

  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // play/pause logic (wider center for smoother playback start)
  const isCentered = useInView(cardRef, { margin: "-20% 0px -20% 0px" });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isCentered) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => { });
      }
    } else {
      video.pause();
      // Keep it at startTime when not centered so the "thumbnail" is always ready
      if (video.currentTime !== startTime) {
        video.currentTime = startTime;
      }
    }
  }, [isCentered, startTime]);

  // Transform Logic
  const dist = useTransform(scrollX, (center: number) => myPosition - center);

  // Performance optimization: Hide content if too far
  const opacity = useTransform(dist, (d: number) => {
    const ad = Math.abs(d);
    if (ad > 1500) return 0;
    if (ad > 1000) return (1500 - ad) / 500;
    return 1;
  });

  const y = useTransform(dist, (d: number) => (d * d) / 2500);
  const rotateY = useTransform(dist, [-1000, 1000], [80, -80]);
  const rotateZ = useTransform(dist, (d: number) => d / 40);
  const z = useTransform(dist, (d: number) => -Math.abs(d) * 1.5);
  const zIndex = useTransform(dist, (d: number) => Math.floor(1000 - Math.abs(d)));

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      className="will-change-transform group cursor-pointer backface-hidden transform-gpu"
      style={{
        position: 'absolute',
        top: '30%',
        left: `calc(50% - ${CARD_WIDTH / 2}px)`,
        x: dist,
        y,
        z,
        rotateY,
        rotateZ,
        scale: 1,
        zIndex,
        opacity,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        WebkitBackfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
        pointerEvents: isCentered ? 'auto' : 'none'
      }}
    >
      <div className="w-full h-full bg-neutral-900 overflow-hidden relative shadow-2xl mb-4">
        {/* Tactical Brackets */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/70 z-20" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/70 z-20" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/70 z-20" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/70 z-20" />

        <div className="absolute inset-0">
          <video
            ref={videoRef}
            src={project.src}
            poster={project.poster || project.src.replace(/\.(mp4|mov|webm)$/, '.jpg')}
            muted
            playsInline
            preload="metadata"
            onLoadedData={(e) => {
              if (e.currentTarget.currentTime === 0) {
                e.currentTarget.currentTime = startTime;
              }
            }}
            onTimeUpdate={(e) => {
              if (e.currentTarget.currentTime >= loopEndTime) {
                e.currentTarget.currentTime = startTime;
                e.currentTarget.play().catch(() => { });
              }
            }}
            className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
          />
        </div>
      </div>
      <div className="flex justify-between items-center mt-6 px-1">
        <h3 className="text-[10px] md:text-[11px] font-black tracking-[0.2em] font-sans text-white uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">{project.title}</h3>
        <p className="text-[8px] font-ocr tracking-widest text-zinc-500">{project.subtitle}</p>
      </div>
    </motion.div>
  );
});

const MobileProjectCard = ({ project, onClick }: { project: any, onClick: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.6 });

  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.play().catch(() => { });
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isInView]);

  return (
    <div ref={containerRef} onClick={onClick} className="min-w-[85vw] snap-center shrink-0">
      <div className="w-full aspect-square bg-neutral-900 overflow-hidden relative shadow-2xl mb-4">
        {/* Brackets */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/70 z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/70 z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/70 z-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/70 z-20 pointer-events-none" />
        <div className="absolute inset-0 z-10">
          <video
            ref={videoRef}
            src={project.src}
            poster={project.poster || project.src.replace(/\.(mp4|mov|webm)$/, '.jpg')}
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover opacity-90 transition-opacity duration-700"
          />
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 px-1">
        <h3 className="text-[11px] font-black tracking-[0.2em] font-sans text-white uppercase">{project.title}</h3>
        <p className="text-[9px] font-ocr tracking-widest text-zinc-500">{project.subtitle}</p>
      </div>
    </div>
  );
};

export const Projects: React.FC<{ onWorksClick?: () => void, title?: string, data?: any }> = ({ onWorksClick, title, data }) => {
  const [selectedVideo, setSelectedVideo] = React.useState<any>(null);
  // Extract project from data.worksPage.services if available
  const cmsProjects = data?.worksPage?.services?.reduce((acc: any[], service: any) => {
    const serviceVideos = service.videos?.map((v: any, i: number) => ({
      ...v,
      subtitle: v.subtitle || v.description || `NUMERO ${String(acc.length + i + 1).padStart(4, '0')}`
    })) || [];
    return [...acc, ...serviceVideos];
  }, []) || [];

  const adminProjects = data?.projects?.videos?.map((v: any, i: number) => ({
    ...v,
    subtitle: v.subtitle || v.description || `NUMERO ${String(i + 1).padStart(4, '0')}`
  })) || [];

  const sourceProjects = adminProjects.length > 0 ? adminProjects : (cmsProjects.length > 0 ? cmsProjects : PROJECTS);
  const displayProjects = Array(2).fill(sourceProjects).flat();
  const sectionTitle = title || "PROJECTS";

  const [isMobile, setIsMobile] = React.useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const totalWidth = displayProjects.length * (CARD_WIDTH + GAP);
  const centerPos = totalWidth / 2;
  const traversalDistance = 6 * (CARD_WIDTH + GAP);
  const startX = centerPos - (traversalDistance / 2);
  const endX = centerPos + (traversalDistance / 2);

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 35,
    mass: 0.8
  });

  const scrollX = useTransform(smoothProgress, [0, 1], [startX, endX]);
  const progressBarWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="works" className="relative w-full" style={{ backgroundColor: data?.projects?.backgroundColor || '#000000', color: data?.projects?.textColor || '#ffffff' }}>
      {isMobile ? (
        <div className="flex flex-col items-center py-10 pb-20 w-full overflow-hidden">
          <h2 className="font-ocr font-black tracking-[0.15em] text-2xl mb-8 uppercase text-center" style={{ color: data?.projects?.titleColor || '#ffffff' }}>{sectionTitle}</h2>
          <div className="w-full flex overflow-x-auto snap-x snap-mandatory gap-6 px-10 md:px-6 pb-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
            <style>{`
                  ::-webkit-scrollbar { display: none; }
              `}</style>
            {sourceProjects.map((project: any, i: number) => (
              <MobileProjectCard key={i} project={project} onClick={() => setSelectedVideo(project)} />
            ))}
          </div>
          <div className="mt-8">
            <button
              onClick={onWorksClick}
              className="group relative px-6 py-3 font-bold text-[11px] tracking-[0.3em] uppercase transition-all"
              style={{ backgroundColor: data?.projects?.ctaBg || '#ffffff', color: data?.projects?.ctaText || '#000000' }}
            >
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black/30 group-hover:border-white/40 transition-colors" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black/30 group-hover:border-white/40 transition-colors" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black/30 group-hover:border-white/40 transition-colors" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black/30 group-hover:border-white/40 transition-colors" />
              <span className="relative z-10">{data?.projects?.cta || "SEE MORE PROJECTS"}</span>
            </button>
          </div>
        </div>
      ) : (
        <div ref={containerRef} className="relative h-[200vh]">
          <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center">

            <div className="absolute top-32 z-30 flex flex-col items-center gap-4">
              <h2 className="font-ocr font-black tracking-[0.15em] text-2xl md:text-3xl uppercase leading-none whitespace-nowrap" style={{ color: data?.projects?.titleColor || '#ffffff' }}>{sectionTitle}</h2>
              <div className="w-24 h-[1px] bg-white/20 relative overflow-hidden rounded-full">
                <motion.div style={{ width: progressBarWidth, backgroundColor: data?.projects?.accentColor || '#EF5304' }} className="absolute left-0 top-0 bottom-0" />
              </div>
            </div>

            <div className="relative w-full h-[800px] z-10 perspective-[1000px]">
              {displayProjects.map((project: any, i: number) => (
                <ParabolicCard
                  key={i}
                  index={i}
                  project={project}
                  scrollX={scrollX}
                  onClick={() => setSelectedVideo(project)}
                />
              ))}
            </div>

            <div className="absolute bottom-0 left-0 w-full h-[60vh] bg-gradient-to-t from-black via-black/90 to-transparent z-40 pointer-events-none" />

            {/* CTA Button */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50">
              <button
                onClick={onWorksClick}
                className="group relative px-6 py-3 font-bold text-[9px] md:text-[11px] tracking-[0.3em] uppercase transition-all hover:opacity-80"
                style={{ backgroundColor: data?.projects?.ctaBg || '#ffffff', color: data?.projects?.ctaText || '#000000' }}
              >
                {/* Brackets */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black/30 group-hover:border-white/40 transition-colors" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black/30 group-hover:border-white/40 transition-colors" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black/30 group-hover:border-white/40 transition-colors" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black/30 group-hover:border-white/40 transition-colors" />

                <span className="relative z-10">{data?.projects?.cta || "SEE MORE PROJECTS"}</span>
              </button>
            </div>

          </div>
        </div>
      )}
      <VideoModal
        video={selectedVideo}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </section>
  );
};
