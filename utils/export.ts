
export const generateAndDownloadHTML = () => {
  // This function builds a massive standalone HTML file representing the ENTIRE project.
  const htmlContent = `<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OPTICELEMENT - Full Technical Deployment</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: {
              sans: ['Space Grotesk', 'sans-serif'],
              mono: ['IBM Plex Mono', 'monospace'],
            },
            colors: {
              'tech-black': '#050505',
              'tech-gray': '#121212',
              'tech-accent': '#FF3300',
            },
          }
        }
      }
    </script>
    <style>
      body { background-color: #050505; color: #ffffff; overflow-x: hidden; scroll-behavior: smooth; }
      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-track { background: #050505; }
      ::-webkit-scrollbar-thumb { background: #222; }
      ::-webkit-scrollbar-thumb:hover { background: #FF3300; }
      .grain { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-image: url("https://grainy-gradients.vercel.app/noise.svg"); opacity: 0.04; pointer-events: none; z-index: 9999; }
      .dashed-border { border: 1px dashed rgba(255,255,255,0.1); }
    </style>
</head>
<body>
    <div class="grain"></div>
    <div id="root"></div>

    <!-- Standalone Scripts -->
    <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@^19.2.1",
        "react-dom": "https://esm.sh/react-dom@^19.2.1",
        "framer-motion": "https://esm.sh/framer-motion@^12.23.26",
        "lucide-react": "https://esm.sh/lucide-react@^0.559.0",
        "three": "https://esm.sh/three@0.171.0"
      }
    }
    </script>

    <script type="module">
        import React, { useState, useEffect, useRef } from 'react';
        import ReactDOM from 'react-dom';
        import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
        import { Menu, X, Play, Pause, Download, ArrowRight, ArrowUpRight, Database, Cpu, Globe, Activity, MoveDown, Plus } from 'lucide-react';

        // --- COMPONENTS ---

        const DashedContainer = ({ children, className = "", noBorderTop = false, noBorderBottom = false }) => (
          <div className={\`relative w-full max-w-7xl mx-auto px-6 \${className}\`}>
            {!noBorderTop && <div className="absolute top-0 left-6 right-6 h-px border-t border-dashed border-white/10" />}
            {!noBorderBottom && <div className="absolute bottom-0 left-6 right-6 h-px border-b border-dashed border-white/10" />}
            <div className="absolute top-0 left-6 -translate-x-1/2 -translate-y-1/2 text-white/30 font-mono text-[10px]">+</div>
            <div className="absolute top-0 right-6 translate-x-1/2 -translate-y-1/2 text-white/30 font-mono text-[10px]">+</div>
            <div className="relative z-10 py-20">{children}</div>
          </div>
        );

        const Navbar = () => {
          const [isOpen, setIsOpen] = useState(false);
          const items = ['HOME', 'ABOUT', 'PROCESS', 'WORKS', 'CONTACT'];
          return (
            <nav className="fixed top-0 left-0 w-full z-[100] flex justify-center pt-8 px-4 pointer-events-none">
              <div className="pointer-events-auto bg-black/80 backdrop-blur-md border border-white/10 px-6 py-4 flex items-center justify-between gap-16 w-full max-w-4xl">
                <div className="flex items-center gap-2">
                  <span className="text-tech-accent font-mono font-bold text-lg">[</span>
                  <span className="text-white font-mono font-bold text-sm tracking-tight">OE</span>
                  <span className="text-tech-accent font-mono font-bold text-lg">]</span>
                </div>
                <div className="hidden md:flex items-center gap-12">
                  {items.map(it => (
                    <a key={it} href={\`#\${it.toLowerCase()}\`} className="text-[11px] font-mono text-white/70 hover:text-white transition-all uppercase tracking-[0.2em] relative group">
                      {it}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-tech-accent group-hover:w-full transition-all duration-300" />
                    </a>
                  ))}
                </div>
                <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                  {isOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>
            </nav>
          );
        };

        const Hero = () => {
          const { scrollYProgress } = useScroll();
          const smooth = useSpring(scrollYProgress, { stiffness: 45, damping: 25 });
          const opacity = useTransform(smooth, [0, 0.1], [1, 0]);
          return (
            <section id="home" className="relative h-[200vh] bg-tech-black flex items-center justify-center">
              <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center p-12 text-center overflow-hidden">
                <motion.div style={{ opacity }} className="relative z-10">
                  <span className="text-tech-accent font-mono text-[10px] tracking-[2em] uppercase mb-8 block opacity-50">INITIALIZING_CORE</span>
                  <h1 className="text-7xl md:text-[10rem] font-light tracking-tighter text-white uppercase leading-[0.7] mb-8">
                    Visual<br/>Matter
                  </h1>
                  <div className="w-1 h-12 bg-white/20 mx-auto" />
                </motion.div>
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                  <div className="w-full h-full border border-dashed border-white/30 grid grid-cols-6 grid-rows-6">
                    {Array.from({length: 36}).map((_, i) => <div key={i} className="border border-dashed border-white/10" />)}
                  </div>
                </div>
              </div>
            </section>
          );
        };

        const VideoSection = () => {
          const videoRef = useRef(null);
          const [playing, setPlaying] = useState(true);
          const toggle = () => {
            if (videoRef.current) {
              playing ? videoRef.current.pause() : videoRef.current.play();
              setPlaying(!playing);
            }
          };
          return (
            <div className="relative group p-4 border border-dashed border-white/20">
               <div className="absolute -top-12 right-0">
                  <div className="px-4 py-2 border border-white/10 font-mono text-[9px] tracking-[0.3em] text-white/40 uppercase">BLOCK_LIVE_DEPLOYMENT</div>
               </div>
               <div className="aspect-video bg-black relative overflow-hidden flex items-center justify-center">
                  <video ref={videoRef} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80" onClick={toggle}>
                    <source src="https://lightcoral-hawk-369217.hostingersite.com/wp-content/uploads/2025/06/Video-Optic-element.mp4" type="video/mp4" />
                  </video>
                  <button onClick={toggle} className="absolute w-16 h-16 border border-white/20 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-sm hover:bg-white hover:text-black transition-all">
                    {playing ? <Pause size={20} /> : <Play size={20} className="ml-1" fill="currentColor" />}
                  </button>
                  <div className="absolute bottom-6 left-6 text-tech-accent font-bold uppercase text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">OPTICELEMENT</div>
               </div>
            </div>
          );
        };

        const Footer = () => (
          <footer className="bg-tech-black border-t border-white/10 py-32 text-center">
             <h2 className="text-6xl md:text-9xl font-light tracking-tighter mb-12">LET'S <span className="text-tech-accent">BUILD.</span></h2>
             <button className="bg-white text-black font-bold px-12 py-6 uppercase tracking-widest hover:bg-tech-accent hover:text-white transition-all">START PROJECT</button>
             <div className="mt-32 text-[10px] font-mono text-white/20 uppercase tracking-[0.5em]">© 2024 OE SYSTEMS // STANDALONE_BUILD_V1</div>
          </footer>
        );

        const App = () => (
          <div className="min-h-screen">
            <Navbar />
            <Hero />
            <DashedContainer>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                <div className="p-8 border border-white/10 hover:border-tech-accent transition-colors">
                  <div className="text-tech-accent font-mono text-xs mb-4">ROI (90d)</div>
                  <div className="text-5xl font-light tracking-tighter">340%</div>
                </div>
                <div className="p-8 border border-white/10 hover:border-tech-accent transition-colors">
                  <div className="text-tech-accent font-mono text-xs mb-4">VELOCITY</div>
                  <div className="text-5xl font-light tracking-tighter">2.5x</div>
                </div>
              </div>
              <VideoSection />
            </DashedContainer>
            <Footer />
          </div>
        );

        ReactDOM.createRoot(document.getElementById('root')).render(<App />);
    </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'BLOC.HTML';
  a.click();
  URL.revokeObjectURL(url);
};
