import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

interface ContactPageProps {
   onBack: () => void;
}



export const ContactPage: React.FC<ContactPageProps & { data?: any, activeSection?: string }> = ({ onBack, data, activeSection }) => {
   useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
   }, []);
   // No need for external script for the booking iframe since it's hosted externally.
   const showAll = !activeSection;
   const bgColor = data?.backgroundColor || '#ffffff';
   const txtColor = data?.textColor || '#000000';
   const accentColor = data?.accentColor || '#EF5304';

   return (
      <div
         className="min-h-screen relative overflow-x-hidden pt-12 selection:bg-black selection:text-white"
         style={{ backgroundColor: bgColor, color: txtColor }}
      >
         <div className="max-w-7xl mx-auto px-10 md:px-6 pb-20">
            <motion.button
               onClick={onBack}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="mb-12 flex items-center gap-2 group hover:opacity-70 transition-opacity"
            >
               <ArrowLeft size={20} style={{ color: accentColor }} className="group-hover:-translate-x-1 transition-transform" />
               <span className="text-[11px] font-mono uppercase tracking-widest font-bold">Back to home</span>
            </motion.button>

            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-20 items-start`}>
               {/* Content side */}
               {(showAll || activeSection === 'intro') && (
                  <motion.div
                     initial={{ opacity: 0, x: -30 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.8 }}
                     className="space-y-12"
                  >
                     <div className="space-y-6">
                        <motion.span
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           className="text-[11px] font-mono uppercase tracking-[0.2em] font-bold block"
                           style={{ color: accentColor }}
                        >
                           // 15-30 MIN FREE DISCOVERY CALL
                        </motion.span>

                        <h1 className="text-[42px] xs:text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                           {data?.titleLine1 || "SCHEDULE"}<br />
                           <span className="whitespace-nowrap">{data?.titleLine2 || "A CALL"}</span>
                        </h1>

                        <p className="text-lg md:text-xl font-light max-w-xl leading-relaxed opacity-80" style={{ color: txtColor }}>
                           {data?.description || "Book a call with our team. This call is to learn more about your business and if Optic Element is a good fit to help you achieve your goals."}
                        </p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t" style={{ borderColor: txtColor === '#ffffff' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                        <div className="space-y-4">
                           <div className="flex items-center gap-3">
                              <Calendar size={24} strokeWidth={1.5} style={{ color: accentColor }} />
                              <span className="font-black text-sm uppercase tracking-wider">LOCK IN A DATE</span>
                           </div>
                           <p className="text-sm opacity-60 leading-relaxed" style={{ color: txtColor }}>
                              Find a time on our calendar to schedule your call today.
                           </p>
                        </div>

                        <div className="space-y-4">
                           <div className="flex items-center gap-3">
                              <Clock size={24} strokeWidth={1.5} style={{ color: accentColor }} />
                              <span className="font-black text-sm uppercase tracking-wider">SELECTION PROCESS</span>
                           </div>
                           <p className="text-sm opacity-60 leading-relaxed" style={{ color: txtColor }}>
                              We look forward to speaking to you soon to discuss your vision.
                           </p>
                        </div>
                     </div>
                  </motion.div>
               )}

               {/* Calendar side */}
               {(showAll || activeSection === 'calendar') && (
                  <motion.div
                     initial={{ opacity: 0, x: 30 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.8 }}
                     className="w-full h-full min-h-[1100px] md:min-h-[1200px] bg-white/5 rounded-2xl overflow-hidden border border-white/10"
                     onMouseEnter={() => window.dispatchEvent(new Event('force-hide-cursor'))}
                     onMouseLeave={() => window.dispatchEvent(new Event('force-show-cursor'))}
                  >
                     <iframe
                        src={data?.calendarUrl || "https://api.leadconnectorhq.com/widget/booking/cgeV18JSg30NhG1v1URd"}
                        style={{ width: '100%', height: '100%', border: 'none', minHeight: '1200px' }}
                        scrolling="no"
                        id="cgeV18JSg30NhG1v1URd_1772211767012"
                        title="Booking Calendar"
                     />
                  </motion.div>
               )}
            </div>
         </div>
      </div>
   );
};

