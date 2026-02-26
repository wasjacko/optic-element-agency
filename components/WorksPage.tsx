import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

const SERVICES = [
   {
      id: 'brand',
      label: 'Brand Videos',
      type: 'video',
      description: 'Cinematic storytelling that elevates brand identity, merges strategy with premium aesthetics to command audience attention.',
      videos: [
         {
            id: 'koffee',
            title: 'KOFFEE CO.',
            description: 'Premium commercial production highlighting product quality and brand atmosphere.',
            src: 'https://video.wixstatic.com/video/8fb0bb_4722b88e8b614accaadc3be3ba825bf7/1080p/mp4/file.mp4'
         },
         {
            id: 'rv-promo',
            title: 'RV PROMO',
            description: 'Dynamic promotional content showcasing lifestyle and utility with cinematic flair.',
            src: 'https://video.wixstatic.com/video/8fb0bb_b2dfc21f1d514060ab32a9e3004397bc/1080p/mp4/file.mp4'
         },
         {
            id: 'mexico-build',
            title: 'MEXICO BUILD',
            description: 'Impactful narrative focusing on community, construction, and the tangible difference made by specialized teams.',
            src: 'https://video.wixstatic.com/video/8fb0bb_37ccb7c01fb5468d9465985f791cef9f/1080p/mp4/file.mp4'
         },
         {
            id: 'masters-hype',
            title: 'MASTERS HYPE',
            description: 'Fast-paced, high-impact edit designed to build anticipation and drive momentum for major events.',
            src: 'https://video.wixstatic.com/video/8fb0bb_2345e2ed454a472bacf9f6fee9b690d9/1080p/mp4/file.mp4'
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
            id: 'investor-lift',
            title: 'INVESTOR LIFT',
            description: 'DOMINICAN REPUBLIC TRIP',
            src: 'https://video.wixstatic.com/video/8fb0bb_27627ec09f7e4a349e6efcaa71d751f4/480p/mp4/file.mp4'
         },
         {
            id: 'passionate-few',
            title: 'PASSIONATE FEW',
            description: 'MEXICO HOUSE BUILD TRIP',
            src: 'https://video.wixstatic.com/video/8fb0bb_70e8af86cad140fab13cad5b7aa60fbe/1080p/mp4/file.mp4'
         },
         {
            id: 'dasfleet',
            title: 'DASFLEET',
            description: 'LUX CAR CLUB PROMO',
            src: 'https://video.wixstatic.com/video/8fb0bb_6a9b9f18c9d549c5a9203f05f19f8c26/1080p/mp4/file.mp4'
         }
      ]
   },
   {
      id: 'photo',
      label: 'Photography',
      type: 'image',
      description: 'High-end visual assets captured with editorial precision, defining your brand’s visual language across all digital touchpoints.',
      images: [
         'https://static.wixstatic.com/media/8fb0bb_f35bdf8c081b4821af4a51eb4563f15c~mv2.jpg/v1/fill/w_1260,h_1892,q_95,enc_avif,quality_auto/8fb0bb_f35bdf8c081b4821af4a51eb4563f15c~mv2.jpg',
         'https://static.wixstatic.com/media/8fb0bb_7b343c64695d4252a18bb07053c4229f~mv2.jpg/v1/fill/w_1264,h_1896,q_95,enc_avif,quality_auto/8fb0bb_7b343c64695d4252a18bb07053c4229f~mv2.jpg',
         'https://static.wixstatic.com/media/8fb0bb_0a3dd121529446a6be4f1dd429d55660~mv2.jpg/v1/fill/w_1260,h_1892,q_95,enc_avif,quality_auto/8fb0bb_0a3dd121529446a6be4f1dd429d55660~mv2.jpg',
         'https://static.wixstatic.com/media/8fb0bb_82f99e32ae5e4db189345d44083638ae~mv2.jpg/v1/fill/w_1264,h_1896,q_95,enc_avif,quality_auto/8fb0bb_82f99e32ae5e4db189345d44083638ae~mv2.jpg',
         'https://static.wixstatic.com/media/8fb0bb_246ec8a099cf4a80a1547044c12499e4~mv2.jpg/v1/fill/w_1260,h_840,q_95,enc_avif,quality_auto/8fb0bb_246ec8a099cf4a80a1547044c12499e4~mv2.jpg',
         'https://static.wixstatic.com/media/8fb0bb_2866319eff6645caa6fcdb20dd165be8~mv2.jpg/v1/fill/w_1260,h_1892,q_95,enc_avif,quality_auto/8fb0bb_2866319eff6645caa6fcdb20dd165be8~mv2.jpg',
         'https://static.wixstatic.com/media/8fb0bb_23bb006099be47ef93029910c419bf84~mv2.jpg/v1/fill/w_1260,h_840,q_95,enc_avif,quality_auto/8fb0bb_23bb006099be47ef93029910c419bf84~mv2.jpg',
         'https://static.wixstatic.com/media/8fb0bb_0bc0d30e6f814d16acc394b4194f53be~mv2.jpg/v1/fill/w_1260,h_1892,q_95,enc_avif,quality_auto/8fb0bb_0bc0d30e6f814d16acc394b4194f53be~mv2.jpg',
         'https://static.wixstatic.com/media/8fb0bb_cb26525bfca94acbb11f9697335d4292~mv2.jpg/v1/fill/w_1264,h_1896,q_95,enc_avif,quality_auto/8fb0bb_cb26525bfca94acbb11f9697335d4292~mv2.jpg',
         'https://static.wixstatic.com/media/8fb0bb_b0a71b5840c648ed99819312ebb1866e~mv2.jpg/v1/fill/w_1260,h_1892,q_95,enc_avif,quality_auto/8fb0bb_b0a71b5840c648ed99819312ebb1866e~mv2.jpg',
         'https://static.wixstatic.com/media/8fb0bb_51cd067395834a218594207aacb5b649~mv2.jpg/v1/fill/w_1264,h_1580,q_95,enc_avif,quality_auto/8fb0bb_51cd067395834a218594207aacb5b649~mv2.jpg',
         'https://static.wixstatic.com/media/8fb0bb_7227b14a89c14b6ca9adf58492726f6d~mv2.jpg/v1/fill/w_1260,h_1732,q_95,enc_avif,quality_auto/8fb0bb_7227b14a89c14b6ca9adf58492726f6d~mv2.jpg'
      ]
   },

];

interface WorksPageProps {
   onContactClick: () => void;
}

export const WorksPage: React.FC<WorksPageProps & { data?: any, activeSection?: string }> = ({ onContactClick, data, activeSection }) => {
   const [activeService, setActiveService] = useState(0);
   const [activeVideo, setActiveVideo] = useState(0);
   const [visibleVideos, setVisibleVideos] = useState(6);
   const [isMobile, setIsMobile] = useState(false);

   useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   // Ensure logic handles switching back to first video if service changes
   useEffect(() => {
      setActiveVideo(0);
      setVisibleVideos(6);
   }, [activeService]);

   // Helper to get current content
   const services = data?.services || SERVICES;
   const currentService = services[activeService];

   // Determine if we need to show the video player logic
   const isVideoService = currentService.type === 'video';
   const currentVideo = isVideoService && currentService.videos
      ? currentService.videos[activeVideo]
      : null;

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
      <div
         className={`min-h-screen ${!showAll ? 'pt-12' : ''}`}
         style={{ backgroundColor: bgColor, color: txtColor }}
      >
         <div className="relative z-10 flex flex-col">
            {/* Top Navigation Bar - Sticky */}
            {(showAll || activeSection === 'gallery') && (
               <>
                  <div className="sticky top-0 z-40 backdrop-blur-md border-b" style={{ backgroundColor: bgColor ? `${bgColor}cc` : 'rgba(255,255,255,0.8)', borderColor: 'rgba(0,0,0,0.05)' }}>
                     <div className="max-w-7xl mx-auto px-10 md:px-6 h-20 flex items-center justify-start md:justify-between overflow-x-auto no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                        <div className="flex items-center gap-6 md:gap-8 min-w-max">
                           {services.map((service: any, index: number) => (
                              <button
                                 key={service.id}
                                 onClick={() => setActiveService(index)}
                                 className="group relative flex flex-col items-center gap-1"
                              >
                                 <span
                                    className={`text-sm font-bold tracking-widest uppercase transition-colors duration-300`}
                                    style={{ color: activeService === index ? txtColor : txtColor, opacity: activeService === index ? 1 : 0.4 }}
                                 >
                                    {service.label}
                                 </span>
                                 {/* Active Indicator Line */}
                                 <motion.div
                                    className={`h-0.5 transition-all duration-300 ${activeService === index ? 'w-full' : 'w-0 group-hover:w-1/2'}`}
                                    style={{ backgroundColor: accentColor }}
                                    layoutId="navUnderline"
                                 />
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Full Width Display Area */}
                  <div
                     className={`relative flex flex-col shadow-2xl transition-all duration-500 ${isVideoService ? `w-[calc(100%-1.5rem)] md:w-full max-w-7xl mx-auto mt-6 h-auto overflow-visible shadow-none` : 'w-[calc(100%-1.5rem)] md:w-full max-w-7xl mx-auto mt-6 min-h-[85vh] h-auto overflow-visible shadow-none'}`}
                     style={{ backgroundColor: isVideoService && services[activeService].id !== 'shorts' && services[activeService].id !== 'brand' ? '#050505' : 'transparent' }}
                  >
                     {/* No Tactical Corners anymore, simplifies UI */}

                     <AnimatePresence mode="wait">
                        <motion.div
                           key={`${activeService}-${activeVideo}`}
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           transition={{ duration: 0.3 }}
                           className="w-full h-full"
                        >
                           {isVideoService && currentService.videos ? (
                              isMobile ? (
                                 <div className="flex flex-col w-full py-12">
                                    <div className="grid grid-cols-1 gap-24 md:gap-32 w-full">
                                       {currentService.videos.slice(0, visibleVideos).map((video: any, idx: number) => (
                                          <motion.div
                                             key={video.id}
                                             initial={{ opacity: 0, y: 40 }}
                                             whileInView={{ opacity: 1, y: 0 }}
                                             viewport={{ once: true, margin: "-100px" }}
                                             className={`group relative w-full bg-black/5 overflow-hidden mx-auto ${currentService.id === 'shorts' ? 'aspect-[9/16] max-w-md' : 'aspect-[16/9]'}`}
                                          >
                                             <video
                                                src={video.src}
                                                className="w-full h-full object-cover opacity-90 transition-all duration-700 group-hover:scale-105"
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                             />

                                             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                                                <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col justify-end">
                                                   <h3 className={`${currentService.id === 'shorts' ? 'text-2xl md:text-3xl' : 'text-3xl md:text-6xl'} font-black text-white uppercase tracking-tighter mb-4`}>
                                                      {video.title}
                                                   </h3>
                                                   <p className="text-white/60 font-mono text-[10px] md:text-xs uppercase tracking-widest pl-4 border-l border-[#FF5000]">
                                                      {video.description}
                                                   </p>
                                                </div>
                                             </div>
                                          </motion.div>
                                       ))}
                                    </div>

                                    {visibleVideos < currentService.videos.length && (
                                       <div className="flex justify-center pt-20 pb-24">
                                          <button
                                             onClick={() => setVisibleVideos(prev => prev + 6)}
                                             className="group relative flex items-center gap-6 py-6 px-16 border border-black/10 transition-all duration-700 overflow-hidden"
                                          >
                                             <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.5em] group-hover:text-white transition-colors duration-500">SEE MORE</span>
                                             <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-full transition-all duration-700 ease-[0.16,1,0.3,1] bg-black" />
                                          </button>
                                       </div>
                                    )}
                                 </div>
                              ) : (
                                 /* DESKTOP VIEW - Restore Slider/Playlist */
                                 currentService.id === 'shorts' ? (
                                    <div className="w-full h-full grid grid-cols-3 gap-8 p-8 bg-transparent overflow-visible shadow-none">
                                       {currentService.videos.map((video: any) => (
                                          <div key={video.id} className="relative w-full h-full group overflow-hidden bg-transparent">
                                             <video
                                                src={video.src}
                                                className="w-full h-full object-cover"
                                                muted
                                                loop
                                                playsInline
                                                onMouseEnter={(e) => e.currentTarget.play()}
                                                onMouseLeave={(e) => {
                                                   e.currentTarget.pause();
                                                   e.currentTarget.currentTime = 0;
                                                }}
                                             />
                                             <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-8 bg-gradient-to-t from-black/90 via-transparent to-transparent">
                                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                   {video.title}
                                                </h3>
                                                <p className="text-xs font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 text-[#FF5000]">
                                                   {video.description}
                                                </p>
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 ) : (
                                    <div className="relative w-full h-full bg-[#050505]">
                                       {currentVideo && (
                                          <>
                                             <video
                                                key={currentVideo.src}
                                                src={currentVideo.src}
                                                className="w-full h-full object-cover opacity-80"
                                                autoPlay muted loop playsInline
                                             />
                                             <button
                                                onClick={handlePrev}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-4 text-white/50 bg-black/20 backdrop-blur-sm transition-all duration-300 rounded-full border border-white/10 hover:border-transparent hover:text-[#FF5000]"
                                             >
                                                <ChevronLeft size={32} />
                                             </button>
                                             <button
                                                onClick={handleNext}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-4 text-white/50 bg-black/20 backdrop-blur-sm transition-all duration-300 rounded-full border border-white/10 hover:border-transparent hover:text-[#FF5000]"
                                             >
                                                <ChevronRight size={32} />
                                             </button>
                                             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                             <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent" />
                                             <div className="absolute bottom-0 left-0 w-full p-16 z-10 flex justify-between items-end gap-8 pb-32">
                                                <motion.div
                                                   initial={{ opacity: 0, y: 20 }}
                                                   animate={{ opacity: 1, y: 0 }}
                                                   transition={{ delay: 0.2 }}
                                                   className="max-w-2xl text-left"
                                                >
                                                   <h2 className="text-6xl font-black text-white uppercase tracking-tighter mb-6 relative">
                                                      {currentVideo.title}
                                                   </h2>
                                                   <p className="text-white/70 font-mono text-base leading-relaxed pl-6 border-l-2 border-[#FF5000]">
                                                      {currentVideo.description}
                                                   </p>
                                                </motion.div>
                                                <div className="h-full max-h-[40vh] overflow-y-auto flex flex-col items-end gap-2 z-20 pr-4 no-scrollbar">
                                                   {currentService.videos?.map((vid: any, vIdx: number) => (
                                                      <button
                                                         key={vid.id}
                                                         onClick={() => setActiveVideo(vIdx)}
                                                         className={`group flex items-center gap-4 py-2 text-right transition-all duration-300 ${activeVideo === vIdx ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                                                      >
                                                         <span
                                                            className={`text-[10px] font-mono tracking-widest uppercase transition-colors duration-300 ${activeVideo === vIdx ? 'text-[#FF5000]' : 'text-white'}`}
                                                         >
                                                            {vid.title}
                                                         </span>
                                                         <div className={`w-1.5 h-1.5 transition-colors duration-300 ${activeVideo === vIdx ? 'bg-[#FF5000]' : 'bg-white'}`} />
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
                              /* Pinterest Style Grid for Photos/Digital */
                              <div className={`columns-1 gap-4 p-4 md:p-8 space-y-4 ${SERVICES[activeService].id === 'digital' ? 'md:columns-5' : 'md:columns-3'}`}>
                                 {SERVICES[activeService].images?.map((img, idx) => (
                                    <div
                                       key={idx}
                                       className="break-inside-avoid mb-4"
                                    >
                                       <img
                                          src={img}
                                          alt={`Gallery image ${idx + 1}`}
                                          loading="lazy"
                                          decoding="async"
                                          className={`w-full object-cover rounded-sm transition-opacity duration-300 hover:opacity-90 ${SERVICES[activeService].id === 'digital'
                                             ? 'aspect-square'
                                             : idx % 3 === 0 ? 'aspect-[3/4]' : idx % 3 === 1 ? 'aspect-[1/1]' : 'aspect-[9/16]'
                                             }`}
                                       />
                                    </div>
                                 ))}
                              </div>
                           )}
                        </motion.div>
                     </AnimatePresence>
                  </div>
               </>
            )}
         </div>


         {/* Uniform Footer CTA - Light Theme */}
         {(showAll || activeSection === 'cta') && (
            <div className="max-w-7xl w-full mx-auto px-10 md:px-6 flex flex-col items-center pt-12 pb-32 border-t" style={{ backgroundColor: bgColor, borderColor: txtColor === '#ffffff' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
               <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  onClick={onContactClick}
                  className="group relative flex items-center gap-6 py-6 px-16 border transition-all duration-700 overflow-hidden bg-black text-white"
                  style={{ borderColor: 'transparent' }}
               >
                  <span className="relative z-10 text-[12px] font-bold uppercase tracking-[0.6em] transition-transform duration-500 group-hover:translate-x-2">
                     {data?.cta || "SCHEDULE_CALL"}
                  </span>
                  <ArrowUpRight size={18} className="relative z-10 transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-1" />

                  {/* Hover Background (White) */}
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1] z-0" />

                  <span
                     className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 font-bold uppercase tracking-[0.6em] text-black"
                  >
                     {data?.cta || "SCHEDULE_CALL"}
                  </span>
               </motion.button>
            </div>
         )}
      </div>
   );
};
