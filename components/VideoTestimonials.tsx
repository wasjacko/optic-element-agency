import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const REELS = [
  { label: 'DORAN_TECH', video: 'https://cdn.shopify.com/videos/c/o/v/06353381e592476088277258385750aa.mp4' },
  { label: 'VISUAL_FLOW', video: 'https://cdn.shopify.com/videos/c/o/v/3c29990e663f41d08e7b9ee34857564d.mp4' },
  { label: 'SYSTEM_X', video: 'https://cdn.shopify.com/videos/c/o/v/881e1864a7814db382433f81498b030b.mp4' },
];

export const VideoTestimonials = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    // Pause all videos first
    videoRefs.current.forEach(video => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });

    // Play active video if hovered/selected
    if (activeIndex !== null && videoRefs.current[activeIndex]) {
      const video = videoRefs.current[activeIndex];
      video?.play().catch(() => { });
    }
  }, [activeIndex]);

  return (
    <section className="bg-white py-24 md:py-32 px-4 border-t border-gray-100">


      {/* 3-Column Reel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-7xl mx-auto">
        {REELS.map((reel, i) => (
          <div
            key={i}
            className="relative aspect-[9/16] bg-black group overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {/* Video */}
            <video
              ref={el => videoRefs.current[i] = el}
              src={reel.video}
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
            />

            {/* Overlay Noise Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />

            {/* Center Text Overlay - EXTRA BOLD */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-20 w-full px-4 mix-blend-difference">
              <span
                className="block text-[10px] md:text-[11px] uppercase mb-2 drop-shadow-xl opacity-80 group-hover:opacity-100 transition-opacity"
                style={{ fontFamily: 'Impact, sans-serif', letterSpacing: '0.2em' }}
              >
                CLIENT_REF
              </span>
              <span
                className="block text-3xl md:text-4xl uppercase drop-shadow-xl leading-none scale-100 group-hover:scale-110 transition-transform duration-500"
                style={{ fontFamily: 'Impact, sans-serif', letterSpacing: '0.05em' }}
              >
                {reel.label}
              </span>
            </div>

            {/* Bottom Frame Decoration */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-20 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
              <span className="font-mono text-[9px] font-black text-white">0{i + 1}</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-100" />
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
