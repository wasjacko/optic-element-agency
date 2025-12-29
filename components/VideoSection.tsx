
import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

export const VideoSection: React.FC = () => {
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
    <section className="relative w-full bg-tech-black py-40 flex flex-col items-center justify-center overflow-hidden">
      
      <div 
        ref={containerRef}
        onClick={() => togglePlay()}
        className="relative w-full max-w-6xl aspect-video bg-black overflow-hidden group cursor-pointer"
      >
        <video 
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${isPlaying ? 'opacity-90' : 'opacity-40'}`}
          autoPlay loop muted={isMuted} playsInline
        >
          <source src="https://lightcoral-hawk-369217.hostingersite.com/wp-content/uploads/2025/06/Video-Optic-element.mp4" type="video/mp4" />
        </video>

        {/* Seamless Blending Overlays (Top and Bottom Fade) */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-tech-black to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-tech-black to-transparent pointer-events-none z-10" />

        {/* Essential Controls Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
          
          {/* Top Right: Fullscreen */}
          <div className="flex justify-end">
            <button 
              onClick={toggleFullscreen}
              className="w-10 h-10 border border-white/10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
            >
              <Maximize size={16} />
            </button>
          </div>

          {/* Center: Play/Pause */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <button 
              onClick={togglePlay}
              className={`w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-xl bg-white/5 text-white/40 hover:text-white transition-all transform hover:scale-105 border border-white/5 ${!isPlaying ? 'opacity-100 bg-white/10 text-white border-white/20' : ''}`}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
          </div>

          {/* Bottom Left: Sound */}
          <div className="flex justify-start">
            <button 
              onClick={toggleMute}
              className="w-10 h-10 border border-white/10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>
      </div>

    </section>
  );
};
