
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Activity } from 'lucide-react';

const REELS = [
  { id: "REEL_001", client: "DORAN_TECH", url: "https://vjs.zencdn.net/v/oceans.mp4", link: "#" },
  { id: "REEL_002", client: "SARAH_LIN", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", link: "#" },
  { id: "REEL_003", client: "DR_CLARENCE_LEE_JR", url: "https://vjs.zencdn.net/v/oceans.mp4", link: "https://www.instagram.com/drclarenceleejr/" }
];

const ReelCard: React.FC<{ reel: typeof REELS[0] }> = ({ reel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (e) {
          console.warn("Playback prevented by browser policy", e);
        }
      }
    }
  };

  return (
    <div className="relative group bg-gray-50 border border-gray-100 overflow-hidden">
      {/* Aspect Ratio 9:16 for Reels */}
      <div className="aspect-[9/16] relative">
        <video
          ref={videoRef}
          src={reel.url}
          loop muted playsInline
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700 grayscale group-hover:grayscale-0"
        />

        {/* Technical Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 font-mono text-[8px] text-black/20 tracking-widest">{reel.id} // SYS_STABLE</div>
          <div className="absolute bottom-4 left-4 font-mono text-[8px] text-black tracking-widest flex items-center gap-2 pointer-events-auto">
            <div className="w-1 h-1 bg-black rounded-full animate-pulse" />
            {reel.link && reel.link !== "#" ? (
              <a href={reel.link} target="_blank" rel="noopener noreferrer" className="hover:text-[#FF5000] transition-colors underline decoration-black/20 hover:decoration-[#FF5000]">
                {reel.client}_VERIFIED
              </a>
            ) : (
              <span>{reel.client}_VERIFIED</span>
            )}
          </div>

          {/* Micro Corner Accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black/10" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black/10" />
        </div>

        {/* Centered Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full border border-black/10 bg-white/40 backdrop-blur-md flex items-center justify-center hover:bg-black hover:text-white transition-all transform hover:scale-110 text-black pointer-events-auto"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
        </div>

        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(0,0,0,0.02),rgba(0,0,0,0.01),rgba(0,0,0,0.02))] bg-[length:100%_2px,3px_100%] opacity-20" />
      </div>
    </div>
  );
};

export const VideoTestimonials: React.FC = () => {
  return (
    <section className="bg-white py-40 border-t border-gray-100 relative">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header Indicator */}
        <div className="flex flex-col items-center gap-4 mb-24">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-black" />
          <span className="font-mono text-[8px] text-black/20 tracking-[1em] uppercase">Visual_Proof_Vault</span>
        </div>

        {/* 3-Column Reel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REELS.map((reel, i) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
            >
              <ReelCard reel={reel} />
            </motion.div>
          ))}
        </div>

        {/* Bottom Metadata */}
        <div className="mt-20 flex justify-center">
          <div className="flex items-center gap-6 font-mono text-[7px] text-black/20 uppercase tracking-[0.5em]">
            <div className="flex items-center gap-2">
              <Activity size={10} className="text-black" />
              <span>PHASE_DEPLOYED_SYNCED</span>
            </div>
            <div className="w-px h-4 bg-black/5" />
            <span>3_NODES_ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Background Decorative Lines */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-dashed border-black/5 -translate-x-1/2 pointer-events-none" />
    </section>
  );
};
