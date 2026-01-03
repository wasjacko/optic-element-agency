
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';




export const VideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Enhanced expansion transforms
  const growthProgress = useTransform(smoothProgress, [0, 0.85], [0, 1]);
  const containerScale = useTransform(smoothProgress, [0, 1], [0.98, 1.05]);

  const widthVW = useTransform(growthProgress, [0, 1], [35, 55]);
  const width = useTransform(widthVW, (w) => `${w}vw`);
  // Calculate exact visual width including the scale factor to ensure perfectly attached lines


  const lineWidth = useTransform(growthProgress, [0, 1], ["35vw", "110vw"]); // Starts same as video, grows wider
  const opacity = useTransform(smoothProgress, [0, 0.9, 1], [1, 1, 0.8]); // Always visible start
  const videoScale = useTransform(smoothProgress, [0, 1], [1.1, 1]);
  const gridScale = useTransform(smoothProgress, [0, 1], [1, 1.4]);

  // Calculate dynamic frame height to match video growth + margins
  // Fixed height as per user request to stop vertical movement.
  // Max video height is approx 31vw (55vw * 9/16). We give it 33vw to be snug but safe.
  const frameHeight = "33vw";

  const togglePlay = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.warn("Video playback was interrupted or blocked:", err);
        }
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const newState = !isMuted;
      videoRef.current.muted = newState;
      setIsMuted(newState);
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#050505] h-[350vh] overflow-visible"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

        {/* Unified High-Visibility Grid (Brands/BrainWhisperer style) */}
        <div className="absolute inset-0 z-0">
          <motion.div
            style={{
              opacity: 0.1,
              scale: gridScale
            }}
            className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:400px_400px]"
          />
        </div>

        <div className="w-full relative flex flex-col items-center z-10 box-border">
          {/* Tactical UI Status */}


          <div className="relative flex flex-col items-center">
            {/* Dynamic Frame Container - Attached Lines */}
            {/* Dynamic Frame Container */}
            <motion.div
              style={{
                height: frameHeight,
                opacity
              }}
              className="absolute top-1/2 left-0 -translate-y-1/2 z-40 pointer-events-none flex flex-col justify-between items-center w-full"
            >
              {/* Horizontal Lines (Wide) */}
              <motion.div style={{ width: lineWidth }} className="h-[1px] bg-white/90 shadow-[0_0_25px_rgba(255,255,255,0.2)] absolute top-0" />
              <motion.div style={{ width: lineWidth }} className="h-[1px] bg-white/90 shadow-[0_0_25px_rgba(255,255,255,0.2)] absolute bottom-0" />

              {/* Vertical Lines (Video Width) */}
              <motion.div style={{ width, scaleX: containerScale }} className="absolute inset-0 mx-auto">
                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
                <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
              </motion.div>
            </motion.div>

            <div className="relative flex justify-center w-full">
              <motion.div
                ref={containerRef}
                style={{
                  width,
                  scale: containerScale,
                  opacity,
                }}
                onClick={() => togglePlay()}
                className="relative aspect-video max-w-none bg-[#050505] group cursor-pointer shadow-[0_0_120px_rgba(0,0,0,0.9)] z-20"
              >
                {/* Video Clipping Wrapper to keep video contained while gradients bleed out */}
                <div className="absolute inset-0 overflow-hidden">
                  {/* Progress Indicators (Internal) */}
                  <motion.div
                    style={{ scaleY: scrollYProgress }}
                    className="absolute left-0 top-0 w-px h-full bg-[#FF5000]/30 origin-top z-10"
                  />
                  <motion.div
                    style={{ scaleY: scrollYProgress }}
                    className="absolute right-0 top-0 w-px h-full bg-[#FF5000]/30 origin-bottom z-10"
                  />

                  <motion.video
                    ref={videoRef}
                    style={{ scale: videoScale }}
                    className={`w-full h-full object-cover transition-all duration-700 ${isPlaying ? 'blur-0 opacity-100' : 'blur-md opacity-80'}`}
                    autoPlay loop muted={isMuted} playsInline
                  >
                    <source src="https://lightcoral-hawk-369217.hostingersite.com/wp-content/uploads/2025/06/Video-Optic-element.mp4" type="video/mp4" />
                  </motion.video>
                </div>

                {/* Blending Overlays - Extended Outwards (Bleed) */}
                {/* Now positioned -top-12 and -bottom-12 to visibly extend beyond the frame */}
                <div className="absolute inset-x-0 -top-12 h-[35%] bg-gradient-to-b from-[#050505] via-[#050505] to-transparent pointer-events-none z-30" />
                <div className="absolute inset-x-0 -bottom-12 h-[35%] bg-gradient-to-t from-[#050505] via-[#050505] to-transparent pointer-events-none z-30" />

                {/* Controls */}
                {/* Controls */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-40 bg-black/10">
                  <div className="flex justify-end">
                    <button
                      onClick={toggleFullscreen}
                      className="w-10 h-10 border border-white/10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
                    >
                      <Maximize size={16} />
                    </button>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <button
                      onClick={togglePlay}
                      className={`w-20 h-20 rounded-full flex items-center justify-center bg-white/5 text-white/40 hover:text-white transition-all transform hover:scale-105 border border-white/5 ${!isPlaying ? 'opacity-100 bg-[#FF5000]/10 text-[#FF5000] border-[#FF5000]/40 shadow-[0_0_40px_rgba(255,80,0,0.3)]' : ''}`}
                    >
                      {isPlaying ? <Pause size={28} /> : <Play size={28} fill="currentColor" className="ml-1" />}
                    </button>
                  </div>
                  <div className="flex justify-start">
                    <button
                      onClick={toggleMute}
                      className="w-10 h-10 border border-white/10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all font-mono"
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>


          </div>

          <motion.div
            style={{ opacity: useTransform(smoothProgress, [0.85, 1], [0, 0.4]) }}
            className="absolute -bottom-28 font-mono text-[9px] tracking-[1.2em] text-[#FF5000]/40"
          >
            SYSTEM_OPTIMIZATION_COMPLETE
          </motion.div>
        </div>
      </div>
    </section>
  );
};
