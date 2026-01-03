import React from 'react';

// Placeholder WIP Component for Production Deployment
export const WorksPage: React.FC<any> = (props) => {
   return (
      <div className="bg-[#050505] min-h-screen text-white flex flex-col relative overflow-hidden">
         <div className="absolute top-0 w-full p-8 z-50">
            <div className="font-bold tracking-tighter text-2xl">OPTIC ELEMENT</div>
         </div>

         <div className="flex-grow flex flex-col items-center justify-center z-10 p-4 text-center">
            <div className="space-y-6">
               <span className="font-mono text-xs text-[#FF5000] tracking-[0.5em] block">
                // ARCHIVE_SYNCING
               </span>
               <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                  WORK IN<br />
                  <span className="text-white/20">PROGRESS</span>
               </h1>
               <p className="font-mono text-xs text-white/40 tracking-widest max-w-md mx-auto mt-8">
                  PROJECT DATABASE UPDATING...
               </p>
            </div>
         </div>

         <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
   );
};
