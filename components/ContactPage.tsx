import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Sparkles, ArrowLeft } from 'lucide-react';

interface ContactPageProps {
   onBack: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
   useEffect(() => {
      const script = document.createElement('script');
      script.src = "https://link.coursecreator360.com/js/form_embed.js";
      script.type = "text/javascript";
      script.async = true;
      document.body.appendChild(script);

      return () => {
         document.body.removeChild(script);
      };
   }, []);

   return (
      <div className="bg-white text-black min-h-screen relative overflow-x-hidden pt-24 selection:bg-black selection:text-white">
         <div className="max-w-7xl mx-auto px-6 pt-24 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

               {/* Content side */}
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
                        className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FF5000] font-bold block"
                     >
                        // 15-30 MIN FREE DISCOVERY CALL
                     </motion.span>

                     <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                        SCHEDULE A<br />
                        CALL<br />
                        <span className="text-[#FF5000] italic">
                           WITH<br />
                           SANTIAGO
                        </span>
                     </h1>

                     <p className="text-lg md:text-xl font-light text-black/80 max-w-xl leading-relaxed">
                        Book a call with our team. This call is to learn more about your business and if Optic Element is a good fit to help you achieve your goals.
                     </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-gray-100">
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <Calendar size={24} strokeWidth={1.5} className="text-[#FF5000]" />
                           <span className="font-black text-sm uppercase tracking-wider text-black">LOCK IN A DATE</span>
                        </div>
                        <p className="text-sm text-black/60 leading-relaxed">
                           Find a time on Santiago's calendar to schedule your call today.
                        </p>
                     </div>

                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <Clock size={24} strokeWidth={1.5} className="text-[#FF5000]" />
                           <span className="font-black text-sm uppercase tracking-wider text-black">SELECTION PROCESS</span>
                        </div>
                        <p className="text-sm text-black/60 leading-relaxed">
                           We look forward to speaking to you soon to discuss your vision.
                        </p>
                     </div>
                  </div>
               </motion.div>

               {/* Iframe side */}
               <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="bg-white border border-gray-100 overflow-hidden min-h-[700px] relative shadow-sm"
               >
                  <iframe
                     src="https://link.coursecreator360.com/widget/booking/RlMrAimbZK24RJaAPTRd"
                     style={{ width: '100%', height: '100%', minHeight: '700px', border: 'none', overflow: 'hidden' }}
                     scrolling="no"
                     id="hXJBwsvLd5zqdlB4RsAG_1708144586889"
                  ></iframe>
               </motion.div>
            </div>
         </div>
      </div>
   );
};

