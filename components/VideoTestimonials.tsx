
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Activity } from 'lucide-react';

const REELS = [
  { id: "REEL_001", client: "DORAN_TECH", url: "https://vjs.zencdn.net/v/oceans.mp4" },
  { id: "REEL_002", client: "SARAH_LIN", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
  { id: "REEL_003", client: "VELO_DYNAMICS", url: "https://vjs.zencdn.net/v/oceans.mp4" }
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
    <div className="relative group bg-[#080808] border border-white/[0.05] overflow-hidden">
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
          <div className="absolute top-4 left-4 font-mono text-[8px] text-white/20 tracking-widest">{reel.id} // SYS_STABLE</div>
          <div className="absolute bottom-4 left-4 font-mono text-[8px] text-tech-accent tracking-widest flex items-center gap-2">
            <div className="w-1 h-1 bg-tech-accent rounded-full animate-pulse" /> 
            {reel.client}_VERIFIED
          </div>
          
          {/* Micro Corner Accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/10" />
        </div>

        {/* Centered Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={togglePlay}
            className="w-16 h-16 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-black transition-all transform hover:scale-110"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
        </div>

        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] opacity-20" />
      </div>
    </div>
  );
};

export const VideoTestimonials: React.FC = () => {
  return (
    <section className="bg-tech-black py-40 border-t border-white/[0.03] relative">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Indicator */}
        <div className="flex flex-col items-center gap-4 mb-24">
           <div className="w-px h-12 bg-gradient-to-b from-transparent to-tech-accent" />
           <span className="font-mono text-[8px] text-white/20 tracking-[1em] uppercase">Visual_Proof_Vault</span>
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
          <div className="flex items-center gap-6 font-mono text-[7px] text-white/10 uppercase tracking-[0.5em]">
             <div className="flex items-center gap-2">
                <Activity size={10} className="text-tech-accent" />
                <span>PHASE_DEPLOYED_SYNCED</span>
             </div>
             <div className="w-px h-4 bg-white/5" />
             <span>3_NODES_ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Background Decorative Lines */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-dashed border-white/[0.02] -translate-x-1/2 pointer-events-none" />
    </section>
  );
};
