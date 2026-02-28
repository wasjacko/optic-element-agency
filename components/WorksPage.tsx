import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

const SERVICES = [
   {
      id: 'brand',
      label: 'Brand Videos',
      type: 'video',
      description: 'Cinematic storytelling that elevates brand identity, merges strategy with premium aesthetics to command audience attention.',
      videos: [
         {
            id: 'pv-recap',
            title: 'PV RECAP',
            description: 'EVENT HIGHLIGHTS',
            src: '/assets/pv-recap.mov'
         },
         {
            id: 'founders-circle',
            title: 'FOUNDERS CIRCLE',
            description: 'VSL PROJECT',
            src: '/assets/founders-circle.mp4'
         },
         {
            id: 'grant-cardone',
            title: 'GRANT CARDONE',
            description: '500B CRISIS',
            src: '/assets/grant-cardone.mp4'
         },
         {
            id: 'andrew-vsl',
            title: 'ANDREW VSL',
            description: 'BRAND STORY',
            src: '/assets/andrew-vsl.mp4'
         },
         {
            id: 'ex-mafia',
            title: 'EX-MAFIA BOSS',
            description: 'YOUTUBE PROMO',
            src: '/assets/ex-mafia.mp4'
         },
         {
            id: 'the-one',
            title: 'THE ONE',
            description: 'PREMIUM FEATURE',
            src: '/assets/the-one.mp4'
         },
         {
            id: 'property-06',
            title: 'PROPERTY 06',
            description: 'REAL ESTATE SHOWCASE',
            src: '/assets/property-06.mp4'
         },
         {
            id: 'property-07',
            title: 'PROPERTY 07',
            description: 'REAL ESTATE SHOWCASE',
            src: '/assets/property-07.mp4'
         },
         {
            id: 'season-trailer',
            title: 'SEASON TRAILER',
            description: 'SHOW HIGHLIGHTS',
            src: '/assets/season-trailer.mp4'
         },
         {
            id: 'real-estate-advice',
            title: '100M CRE ADVICE',
            description: 'INVESTING ADVICE',
            src: '/assets/real-estate-advice.mp4'
         },
         {
            id: 'koffee',
            title: 'KOFFEE CO.',
            description: 'PREMIUM COMMERCIAL',
            src: '/assets/koffee-commercial.mp4'
         },
         {
            id: 'dasfleet',
            title: 'DASFLEET',
            description: 'LUX CAR CLUB',
            src: '/assets/dasfleet-short.mp4'
         },
         {
            id: 'passionate-few',
            title: 'PASSIONATE FEW',
            description: 'HOUSE BUILD TRIP',
            src: '/assets/passionate-few-short.mp4'
         }
      ]
   },
   {
      id: 'shorts',
      label: 'Short Videos',
      type: 'video',
      description: 'High-impact short-form content designed for maximum engagement and social reach.',
      videos: [
         {
            id: 'valor-eoy-2025',
            title: 'VALOR EOY 2025',
            description: 'EVENT HIGHLIGHTS',
            src: '/assets/valor-eoy-2025.mp4'
         },
         {
            id: 'lambros-v3',
            title: 'LAMBROS V3',
            description: 'SOCIAL EDIT',
            src: '/assets/lambros-v3.mp4'
         },
         {
            id: 'merch-edit-v3',
            title: 'MERCH EDIT V3',
            description: 'VERTICAL EDIT',
            src: '/assets/merch-edit-v3.mp4'
         },
         {
            id: 'snapinsta-1',
            title: 'SOCIAL EDIT 01',
            description: 'CONTENT STRATEGY',
            src: '/assets/snapinsta-1.mp4'
         },
         {
            id: 'snapinsta-2',
            title: 'SOCIAL EDIT 02',
            description: 'VIRAL HOOK',
            src: '/assets/snapinsta-2.mp4'
         },
         {
            id: 'snapinsta-3',
            title: 'SOCIAL EDIT 03',
            description: 'STORYTELLING',
            src: '/assets/snapinsta-3.mp4'
         },
         {
            id: 'snapinsta-4',
            title: 'SOCIAL EDIT 04',
            description: 'BRAND REACH',
            src: '/assets/snapinsta-4.mp4'
         },
         {
            id: 'snapinsta-5',
            title: 'SOCIAL EDIT 05',
            description: 'HIGH IMPACT',
            src: '/assets/snapinsta-5.mp4'
         },
         {
            id: 'dog-treats',
            title: 'DOG TREATS',
            description: 'PRODUCT HIGHLIGHT',
            src: '/assets/dog-treats.mp4'
         },
         {
            id: 'follower-ad-1',
            title: 'FOLLOWER AD 1',
            description: 'SOCIAL AD',
            src: '/assets/follower-ad-1.mp4'
         },
         {
            id: 'alyssa-v3',
            title: 'ALYSSA V3',
            description: 'BRAND EDIT',
            src: '/assets/alyssa-v3.mp4'
         },
         {
            id: 'cost-of-alone',
            title: 'THE COST OF ALONE',
            description: 'STRATEGY & GROWTH',
            src: '/assets/cost-of-alone.mp4'
         },
         {
            id: 'nutrient-timing',
            title: 'NUTRIENT TIMING',
            description: 'PERFORMANCE & NUTRITION',
            src: '/assets/nutrient-timing.mp4'
         },
         {
            id: 'wix-short-1',
            title: 'KOFFEE CO. SHORT',
            description: 'CAFE PREMIER',
            src: '/assets/wix-short-1.mp4'
         },
         {
            id: 'passionate-few-short',
            title: 'PASSIONATE FEW SHORT',
            description: 'HOUSE BUILD TRIP',
            src: '/assets/passionate-few-short.mp4'
         },
         {
            id: 'dasfleet-short',
            title: 'DASFLEET SHORT',
            description: 'LUX CAR CLUB',
            src: '/assets/dasfleet-short.mp4'
         }
      ]
   },
   {
      id: 'photo',
      label: 'Photography',
      type: 'image',
      description: 'High-end visual assets captured with editorial precision, defining your brand’s visual language across all digital touchpoints.',
      images: [
         '/assets/photography/photo_1.jpg',
         '/assets/photography/photo_2.jpg',
         '/assets/photography/photo_3.jpg',
         '/assets/photography/photo_4.jpg',
         '/assets/photography/photo_5.jpg',
         '/assets/photography/photo_6.jpg',
         '/assets/photography/photo_7.jpg'
      ]
   },
];

interface WorksPageProps {
   onContactClick: () => void;
}

export const WorksPage: React.FC<WorksPageProps & { data?: any, activeSection?: string }> = ({ onContactClick, data, activeSection }) => {
   const [activeService, setActiveService] = useState(0);
   const [activeVideo, setActiveVideo] = useState(0);
   const [visibleVideos, setVisibleVideos] = useState(3);
   const [isMobile, setIsMobile] = useState(false);
   const videoRef = useRef<HTMLVideoElement>(null);

   useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   useEffect(() => {
      setActiveVideo(0);
      setVisibleVideos(3);
   }, [activeService]);

   const services = data?.services || SERVICES;
   const currentService = services[activeService];
   const isVideoService = currentService.type === 'video';
   const currentVideo = isVideoService && currentService.videos ? currentService.videos[activeVideo] : null;

   const handlePrev = () => {
      if (!currentService.videos) return;
      setActiveVideo((prev) => (prev === 0 ? currentService.videos.length - 1 : prev - 1));
   };

   const handleNext = () => {
      if (!currentService.videos) return;
      setActiveVideo((prev) => (prev === currentService.videos.length - 1 ? 0 : prev + 1));
   };

   const showAll = !activeSection;
   const bgColor = data?.backgroundColor || '#ffffff';
   const txtColor = data?.textColor || '#000000';
   const accentColor = data?.accentColor || '#FF5000';

   return (
      <div className={`min-h-screen ${!showAll ? 'pt-12' : ''}`} style={{ backgroundColor: bgColor, color: txtColor }}>
         <div className="relative z-10 flex flex-col">
            {(showAll || activeSection === 'gallery') && (
               <>
                  <div className="sticky top-0 z-40 backdrop-blur-md border-b" style={{ backgroundColor: bgColor ? `${bgColor}cc` : 'rgba(255,255,255,0.8)', borderColor: 'rgba(0,0,0,0.05)' }}>
                     <div className="max-w-7xl mx-auto px-10 md:px-6 h-20 flex items-center justify-start md:justify-between overflow-x-auto no-scrollbar">
                        <div className="flex items-center gap-6 md:gap-8 min-w-max">
                           {services.map((service: any, index: number) => (
                              <button key={service.id} onClick={() => setActiveService(index)} className="group relative flex flex-col items-center gap-1">
                                 <span className="text-sm font-bold tracking-widest uppercase transition-colors duration-300" style={{ color: txtColor, opacity: activeService === index ? 1 : 0.4 }}>{service.label}</span>
                                 <motion.div className="h-0.5 transition-all duration-300" style={{ backgroundColor: accentColor, width: activeService === index ? '100%' : '0%' }} layoutId="navUnderline" />
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className={`relative w-full max-w-7xl mx-auto mt-6 transition-all duration-500 ${isVideoService ? 'h-auto shadow-none' : 'min-h-[85vh]'}`}>
                     <AnimatePresence mode="wait">
                        <motion.div key={activeService} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="w-full h-full">
                           {isVideoService && currentService.videos ? (
                              isMobile ? (
                                 <div className="flex flex-col w-full py-12 gap-24 md:gap-32">
                                    {currentService.videos.slice(0, visibleVideos).map((video: any) => (
                                       <div key={video.id} className={`group relative w-full bg-black/5 overflow-hidden mx-auto ${currentService.id === 'shorts' ? 'aspect-[9/16] max-w-md' : 'aspect-[16/9]'}`}>
                                          <video
                                             src={video.src}
                                             poster={video.src ? video.src.replace('.mp4', '.jpg') : undefined}
                                             className="w-full h-full object-cover"
                                             muted
                                             loop
                                             playsInline
                                             preload="metadata"
                                             onMouseEnter={(e) => {
                                                const playPromise = e.currentTarget.play();
                                                if (playPromise !== undefined) {
                                                   playPromise.catch((error) => console.log("Video playback blocked:", error));
                                                }
                                             }}
                                             onMouseLeave={(e) => {
                                                e.currentTarget.pause();
                                                e.currentTarget.currentTime = 0;
                                             }}
                                          />
                                          <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 bg-gradient-to-t from-black/90 pointer-events-none">
                                             <h3 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">{video.title}</h3>
                                             <p className="text-white/60 font-mono text-[10px] uppercase tracking-widest pl-4 border-l border-[#FF5000]">{video.description}</p>
                                          </div>
                                       </div>
                                    ))}
                                    {visibleVideos < currentService.videos.length && (
                                       <div className="flex justify-center pb-24">
                                          <button onClick={() => setVisibleVideos(prev => prev + 3)} className="py-6 px-16 border border-black/10 text-[11px] font-bold uppercase tracking-[0.5em] hover:bg-black hover:text-white transition-all duration-500">SEE MORE</button>
                                       </div>
                                    )}
                                 </div>
                              ) : (
                                 currentService.id === 'shorts' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
                                       {currentService.videos.map((video: any) => (
                                          <div key={video.id} className="relative aspect-[9/16] group overflow-hidden bg-black/5">
                                             <video
                                                src={video.src}
                                                poster={video.src ? video.src.replace('.mp4', '.jpg') : undefined}
                                                className="w-full h-full object-cover"
                                                muted
                                                loop
                                                playsInline
                                                preload="metadata"
                                                onMouseEnter={(e) => {
                                                   const playPromise = e.currentTarget.play();
                                                   if (playPromise !== undefined) {
                                                      playPromise.catch((error) => console.log("Video playback blocked:", error));
                                                   }
                                                }}
                                                onMouseLeave={(e) => {
                                                   e.currentTarget.pause();
                                                   e.currentTarget.currentTime = 0;
                                                }}
                                             />
                                             <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/90 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                <h3 className="text-2xl font-black text-white uppercase mb-2">{video.title}</h3>
                                                <p className="text-xs font-mono text-[#FF5000]">{video.description}</p>
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 ) : (
                                    <div className="relative w-full h-[80vh] bg-black group/slider">
                                       {currentVideo && (
                                          <>
                                             <video
                                                key={currentVideo.src}
                                                src={currentVideo.src}
                                                className="w-full h-full object-cover opacity-80"
                                                autoPlay muted loop playsInline preload="auto"
                                             />
                                             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
                                             <div className="absolute inset-0 bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />

                                             <button onClick={handlePrev} className="absolute left-8 top-1/2 -translate-y-1/2 z-40 p-4 text-white/30 hover:text-white transition-colors bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                                                <ChevronLeft size={32} />
                                             </button>
                                             <button onClick={handleNext} className="absolute right-8 top-1/2 -translate-y-1/2 z-40 p-4 text-white/30 hover:text-white transition-colors bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                                                <ChevronRight size={32} />
                                             </button>

                                             <div className="absolute bottom-0 left-0 w-full p-16 z-30 flex justify-between items-end pb-32">
                                                <div className="max-w-xl">
                                                   <AnimatePresence mode="wait">
                                                      <motion.div key={activeVideo} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3 }}>
                                                         <h2 className="text-7xl font-black text-white uppercase tracking-tighter mb-4 leading-none">{currentVideo.title}</h2>
                                                         <p className="text-white/60 font-mono text-base border-l-2 border-[#FF5000] pl-6 uppercase tracking-wider">{currentVideo.description}</p>
                                                      </motion.div>
                                                   </AnimatePresence>
                                                </div>
                                                <div className="flex flex-col items-end gap-3 max-h-[50vh] overflow-y-auto pr-4 no-scrollbar">
                                                   {currentService.videos.map((vid: any, vIdx: number) => (
                                                      <button key={vid.id} onClick={() => setActiveVideo(vIdx)} className={`flex items-center gap-4 transition-all duration-300 ${activeVideo === vIdx ? 'opacity-100 scale-105' : 'opacity-30 hover:opacity-100'}`}>
                                                         <span className={`text-[10px] font-mono tracking-widest uppercase ${activeVideo === vIdx ? 'text-[#FF5000]' : 'text-white'}`}>{vid.title}</span>
                                                         <div className={`w-1.5 h-1.5 ${activeVideo === vIdx ? 'bg-[#FF5000]' : 'bg-white'}`} />
                                                      </button>
                                                   ))}
                                                </div>
                                             </div>
                                          </>
                                       )}
                                    </div>
                                 )
                              )
                           ) : (
                              <div className={`columns-1 md:columns-3 gap-4 p-8 space-y-4`}>
                                 {currentService.images?.map((img: string, idx: number) => (
                                    <img key={idx} src={img} className="w-full rounded-sm opacity-90 hover:opacity-100 transition-opacity" />
                                 ))}
                              </div>
                           )}
                        </motion.div>
                     </AnimatePresence>
                  </div>
               </>
            )}
         </div>

         {(showAll || activeSection === 'cta') && (
            <div className="max-w-7xl mx-auto px-10 md:px-6 flex flex-col items-center pt-12 pb-32 border-t border-black/5">
               <motion.button whileHover={{ scale: 1.02 }} onClick={onContactClick} className="group relative flex items-center gap-6 py-6 px-16 bg-black text-white overflow-hidden">
                  <span className="relative z-10 text-[12px] font-bold uppercase tracking-[0.6em]">{data?.cta || "SCHEDULE_CALL"}</span>
                  <ArrowUpRight size={18} className="relative z-10" />
                  <div className="absolute inset-0 bg-[#FF5000] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
               </motion.button>
            </div>
         )}
      </div>
   );
};
