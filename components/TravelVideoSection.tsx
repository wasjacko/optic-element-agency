
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Maximize, Volume2, VolumeX } from 'lucide-react';

const TRAVEL_VIDEOS = [
    {
        id: '0738',
        title: 'MEXICO HOUSE BUILD',
        url: 'https://video.wixstatic.com/video/8fb0bb_37ccb7c01fb5468d9465985f791cef9f/1080p/mp4/file.mp4'
    },
    {
        id: '0548',
        title: 'LGCY MASTERS HYPE VIDEO',
        url: 'https://video.wixstatic.com/video/8fb0bb_2345e2ed454a472bacf9f6fee9b690d9/1080p/mp4/file.mp4'
    },
    {
        id: '0436',
        title: 'LGCY SOLAR RECUITMENT VIDEO',
        url: 'https://video.wixstatic.com/video/8fb0bb_b9a25be31bc34c65970d07346fe1f732/480p/mp4/file.mp4'
    },
    {
        id: '0348',
        title: 'KOFFEE CO.',
        url: 'https://video.wixstatic.com/video/8fb0bb_4722b88e8b614accaadc3be3ba825bf7/480p/mp4/file.mp4'
    }
];

const VideoCard: React.FC<{ video: typeof TRAVEL_VIDEOS[0] }> = ({ video }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="group relative aspect-video bg-gray-50 overflow-hidden border border-gray-100"
        >
            <video
                ref={videoRef}
                src={video.url}
                className={`w-full h-full object-cover transition-all duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-80 grayscale group-hover:grayscale-0'}`}
                loop muted={isMuted} playsInline
            />

            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] text-white mix-blend-difference tracking-[0.3em] font-bold">
                        {video.id} // TRAVEL_SEQ
                    </span>
                </div>

                <div className="flex justify-between items-end">
                    <div className="text-white mix-blend-difference">
                        <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight leading-none">
                            {video.title}
                        </h3>
                    </div>

                    <button
                        onClick={togglePlay}
                        className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl bg-white/10 text-white/80 hover:text-white transition-all transform hover:scale-110 border border-white/20"
                    >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                    </button>
                </div>
            </div>

            {/* Border Accent */}
            <div className="absolute inset-4 border border-white/10 pointer-events-none group-hover:inset-3 transition-all duration-700" />
        </motion.div>
    );
};

export const TravelVideoSection = () => {
    return (
        <section className="w-full bg-white pt-12 pb-24 md:pb-40 px-6 md:px-12 border-t border-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="mb-24">
                    <span className="text-[10px] font-mono text-black/20 uppercase tracking-[0.5em] block mb-4">
                        Service_04
                    </span>
                    <h2 className="text-5xl md:text-7xl font-light uppercase tracking-tighter text-black">
                        Travel <br />
                        <span className="text-black/5 italic font-black">Adventures_</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {TRAVEL_VIDEOS.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>
            </div>
        </section>
    );
};
