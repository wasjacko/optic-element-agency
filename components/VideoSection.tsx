
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';




export const VideoSection: React.FC<{ data?: any }> = ({ data }) => {
  const videoUrl = data?.videoUrl || "https://lightcoral-hawk-369217.hostingersite.com/wp-content/uploads/2025/06/Video-Optic-element.mp4";
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

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
    <section id="video" className="relative w-full py-32 overflow-hidden flex flex-col items-center justify-center transition-colors duration-500" style={{ backgroundColor: data?.backgroundColor || 'var(--color-bg)' }}>
      {/* Unified High-Visibility Grid (Brands/BrainWhisperer style) */}
      <div className="absolute inset-0 z-0">
        <div
          style={{
            opacity: 0.1,
            backgroundImage: `linear-gradient(to right, var(--color-text) 1px, transparent 1px), linear-gradient(to bottom, var(--color-text) 1px, transparent 1px)`
          }}
          className="absolute inset-0 bg-[size:400px_400px]"
        />
      </div>

      <div className="w-full relative flex flex-col items-center z-10 box-border">
        {/* Tactical UI Status */}
        <div className="relative flex flex-col items-center">
          <div className="relative flex justify-center w-full">
            <motion.div
              ref={containerRef}
              onClick={() => togglePlay()}
              className="relative w-[85vw] max-w-7xl aspect-video bg-[#050505] group cursor-pointer shadow-[0_0_120px_rgba(0,0,0,0.9)] z-20"
            >
              {/* Video Clipping Wrapper to keep video contained while gradients bleed out */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.video
                  ref={videoRef}
                  preload="auto"
                  className={`w-full h-full object-cover transition-all duration-700 ${isPlaying ? 'blur-0 opacity-100' : 'blur-md opacity-80'}`}
                  autoPlay loop muted={isMuted} playsInline
                  src={videoUrl}
                  poster={videoUrl.replace('.mp4', '.jpg')}
                />
              </div>

              {/* Blending Overlays - Extended Outwards (Bleed) */}
              {/* Now positioned -top-12 and -bottom-12 to visibly extend beyond the frame */}
              <div className="absolute inset-x-0 -top-12 h-[35%] pointer-events-none z-30" style={{ backgroundImage: `linear-gradient(to bottom, ${data?.backgroundColor || 'var(--color-bg)'}, ${data?.backgroundColor || 'var(--color-bg)'}, transparent)` }} />
              <div className="absolute inset-x-0 -bottom-12 h-[35%] pointer-events-none z-30" style={{ backgroundImage: `linear-gradient(to top, ${data?.backgroundColor || 'var(--color-bg)'}, ${data?.backgroundColor || 'var(--color-bg)'}, transparent)` }} />

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
                    className={`w-20 h-20 rounded-full flex items-center justify-center bg-white/5 hover:text-white transition-all transform hover:scale-105 border border-white/5 ${!isPlaying ? 'opacity-100 shadow-[0_0_40px_rgba(255,80,0,0.3)]' : ''}`}
                    style={{
                      color: !isPlaying ? (data?.accentColor || '#FF5000') : 'rgba(255,255,255,0.4)',
                      backgroundColor: !isPlaying ? (data?.accentColor ? `${data.accentColor}1A` : 'rgba(255,80,0,0.1)') : undefined,
                      borderColor: !isPlaying ? (data?.accentColor ? `${data.accentColor}66` : 'rgba(255,80,0,0.4)') : undefined
                    }}
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

      </div>
    </section>
  );
};
