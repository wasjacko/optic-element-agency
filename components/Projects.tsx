import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

const PROJECTS = [
  {
    title: "PROPERTY 06",
    subtitle: "NUMERO 0001",
    src: "https://www.dropbox.com/scl/fo/gq9u9ugq1bg0xxkruhd2h/ANqDa3RcBW2t8G8gYtP9cRM/Horizontal%20Content/Property%2006%20Vertical.MP4?rlkey=ecoqcz4h9sos2wo3filjcmake&st=x8wc249z&raw=1"
  },
  {
    title: "THE ONE",
    subtitle: "NUMERO 0002",
    src: "https://www.dropbox.com/scl/fo/gq9u9ugq1bg0xxkruhd2h/AJ7dRMXLIyKrMH0etl_Cqy0/Horizontal%20Content/THE%20ONE%20v2.mov?rlkey=ecoqcz4h9sos2wo3filjcmake&st=j4vwn6e8&raw=1"
  },
  {
    title: "SEASON TRAILER",
    subtitle: "NUMERO 0003",
    src: "https://www.dropbox.com/scl/fo/gq9u9ugq1bg0xxkruhd2h/AEdgEqThS3wHY7jVy7yAIGU/Horizontal%20Content/Season%20trailerV4.mp4?rlkey=ecoqcz4h9sos2wo3filjcmake&st=9aexfx03&raw=1"
  },
  {
    title: "PROPERTY 07",
    subtitle: "NUMERO 0004",
    src: "https://www.dropbox.com/scl/fo/gq9u9ugq1bg0xxkruhd2h/AOXNGR1uNFCUGRNqolBS6BM/Horizontal%20Content/Property%2007%20V4.mp4?rlkey=ecoqcz4h9sos2wo3filjcmake&st=okq98v3t&raw=1"
  },
  {
    title: "MAFIA BOSS",
    subtitle: "NUMERO 0005",
    src: "https://www.dropbox.com/scl/fo/gq9u9ugq1bg0xxkruhd2h/ALSAU4uXizMclreOTmrnIQo/Horizontal%20Content/YTDown.com_YouTube_Ex-Mafia-Boss-I-Made-8-Million-Every-Wee_Media_ZAocWXnHSOw_001_1080p.mp4?rlkey=ecoqcz4h9sos2wo3filjcmake&st=1c289jaj&raw=1"
  }
];

// Configuration
const CARD_WIDTH = 250;
const CARD_HEIGHT = 250;
const GAP = 100;

const ParabolicCard = React.memo(({ project, index, scrollX }: { project: any, index: number, scrollX: any }) => {
  const myPosition = index * (CARD_WIDTH + GAP);

  const startTime = 5;
  const loopDuration = 4;
  const loopEndTime = startTime + loopDuration;

  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // play/pause logic (wider center for smoother playback start)
  const isCentered = useInView(cardRef, { margin: "-30% 0px -30% 0px" });

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
      video.currentTime = startTime;
    }
  }, [isCentered, startTime]);

  // Transform Logic
  const dist = useTransform(scrollX, (center: number) => myPosition - center);

  // Performance optimization: Hide content if too far
  const opacity = useTransform(dist, (d: number) => {
    const ad = Math.abs(d);
    if (ad > 1200) return 0;
    if (ad > 800) return (1200 - ad) / 400;
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
      className="will-change-transform group cursor-pointer backface-hidden"
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
            muted
            playsInline
            preload="auto"
            onLoadedData={(e) => {
              e.currentTarget.currentTime = startTime;
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

const MobileProjectCard = ({ project }: { project: any }) => {
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
    <div ref={containerRef} className="min-w-[85vw] snap-center shrink-0">
      <div className="w-full aspect-square bg-neutral-900 overflow-hidden relative shadow-2xl mb-4">
        {/* Brackets */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/70 z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/70 z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/70 z-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/70 z-20 pointer-events-none" />
        <div className="absolute inset-0 z-10">
          <video
            ref={videoRef}
            src={`${project.src}#t=5`}
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
  // Extract project from data.worksPage.services if available
  const cmsProjects = data?.worksPage?.services?.reduce((acc: any[], service: any) => {
    const serviceVideos = service.videos?.map((v: any, i: number) => ({
      ...v,
      subtitle: v.subtitle || `NUMERO ${String(acc.length + i + 1).padStart(4, '0')}`
    })) || [];
    return [...acc, ...serviceVideos];
  }, []) || [];

  const sourceProjects = cmsProjects.length > 0 ? cmsProjects : PROJECTS;
  const displayProjects = Array(2).fill(sourceProjects).flat();
  const sectionTitle = title || "OUR WORKS";

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
    <section id="works" className="relative bg-black text-white w-full">
      {isMobile ? (
        <div className="flex flex-col items-center py-10 pb-20 w-full overflow-hidden">
          <h2 className="font-ocr font-black tracking-[0.15em] text-2xl mb-8 text-white uppercase text-center">{sectionTitle}</h2>
          <div className="w-full flex overflow-x-auto snap-x snap-mandatory gap-6 px-10 md:px-6 pb-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
            <style>{`
                  ::-webkit-scrollbar { display: none; }
              `}</style>
            {sourceProjects.map((project: any, i: number) => (
              <MobileProjectCard key={i} project={project} />
            ))}
          </div>
          <div className="mt-8">
            <button
              onClick={onWorksClick}
              className="group relative px-6 py-3 bg-white text-black font-bold text-[11px] tracking-[0.3em] uppercase transition-all"
            >
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black/30 group-hover:border-white/40 transition-colors" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black/30 group-hover:border-white/40 transition-colors" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black/30 group-hover:border-white/40 transition-colors" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black/30 group-hover:border-white/40 transition-colors" />
              <span className="relative z-10">SEE MORE PROJECTS</span>
            </button>
          </div>
        </div>
      ) : (
        <div ref={containerRef} className="relative h-[200vh]">
          <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center">

            <div className="absolute top-32 z-30 flex flex-col items-center gap-4">
              <h2 className="font-ocr font-black tracking-[0.15em] text-2xl md:text-3xl text-white uppercase leading-none whitespace-nowrap">{sectionTitle}</h2>
              <div className="w-24 h-[1px] bg-white/20 relative overflow-hidden rounded-full">
                <motion.div style={{ width: progressBarWidth }} className="absolute left-0 top-0 bottom-0 bg-[#FF5000]" />
              </div>
            </div>

            <div className="relative w-full h-[800px] z-10 perspective-[1000px]">
              {displayProjects.map((project: any, i: number) => (
                <ParabolicCard
                  key={i}
                  index={i}
                  project={project}
                  scrollX={scrollX}
                />
              ))}
            </div>

            <div className="absolute bottom-0 left-0 w-full h-[60vh] bg-gradient-to-t from-black via-black/90 to-transparent z-40 pointer-events-none" />

            {/* CTA Button */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50">
              <button
                onClick={onWorksClick}
                className="group relative px-6 py-3 bg-white text-black font-bold text-[9px] md:text-[11px] tracking-[0.3em] uppercase transition-all hover:bg-[#FF5000] hover:text-white"
              >
                {/* Brackets */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black/30 group-hover:border-white/40 transition-colors" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black/30 group-hover:border-white/40 transition-colors" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black/30 group-hover:border-white/40 transition-colors" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black/30 group-hover:border-white/40 transition-colors" />

                <span className="relative z-10">SEE MORE PROJECTS</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
