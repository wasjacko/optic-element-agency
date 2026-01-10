import React, { useState, useEffect, Suspense } from 'react';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';


// --- Lazy Loaded Components for Performance Optimization ---
const Brands = React.lazy(() => import('./components/Brands').then(module => ({ default: module.Brands })));
const VideoSection = React.lazy(() => import('./components/VideoSection').then(module => ({ default: module.VideoSection })));
const Projects = React.lazy(() => import('./components/Projects').then(module => ({ default: module.Projects })));
const Testimonials = React.lazy(() => import('./components/Testimonials').then(module => ({ default: module.Testimonials })));
const About = React.lazy(() => import('./components/About').then(module => ({ default: module.About })));

const ContactPage = React.lazy(() => import('./components/ContactPage').then(module => ({ default: module.ContactPage })));
const Footer = React.lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));
const WorksPage = React.lazy(() => import('./components/WorksPage').then(module => ({ default: module.WorksPage })));
const ProcessPage = React.lazy(() => import('./components/ProcessPage').then(module => ({ default: module.ProcessPage })));
const DataMetrics = React.lazy(() => import('./components/DataMetrics').then(module => ({ default: module.DataMetrics })));

const ProcessSprint = React.lazy(() => import('./components/ProcessSprint').then(module => ({ default: module.ProcessSprint })));
const TheLab = React.lazy(() => import('./components/TheLab').then(module => ({ default: module.TheLab })));

type Page = 'home' | 'about' | 'work' | 'process' | 'contact' | 'lab';

export default function App() {
  const [activePage, setActivePage] = useState<Page>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1);
      if (['about', 'work', 'process', 'contact', 'lab'].includes(hash)) {
        return hash as Page;
      }
    }
    return 'home';
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const [introCompleted, setIntroCompleted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (['about', 'work', 'process', 'contact', 'lab'].includes(hash)) {
        setActivePage(hash as Page);
      } else {
        setActivePage('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // -- Navigation Handlers --

  const navigateTo = (page: Page) => {
    setActivePage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleContactClick = () => navigateTo('contact');
  const handleProcessClick = () => navigateTo('process');
  const handleHomeClick = () => navigateTo('home');
  const handleAboutClick = () => navigateTo('about');
  const handleWorksClick = () => navigateTo('work');
  const handleLabClick = () => navigateTo('lab');

  const pageTransition = {
    initial: { opacity: 0, y: 10, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -10, filter: "blur(10px)" },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
  };

  return (
    <div className="bg-black min-h-screen text-white selection:bg-[#FF5000] selection:text-white">
      <Navbar
        onContactClick={handleContactClick}
        onProcessClick={handleProcessClick}
        onHomeClick={handleHomeClick}
        onAboutClick={handleAboutClick}
        onWorksClick={handleWorksClick}
        onLabClick={handleLabClick}
        isScrolled={isScrolled}
        introCompleted={introCompleted}
        activePage={activePage}
      />

      {/* EXCLUSIVE PAGE ROUTING */}
      <LayoutGroup>
        <AnimatePresence mode="wait">

          {/* 1. PROCESS PAGE */}
          {activePage === 'process' && (
            <motion.div key="process" {...pageTransition} className="pt-20">
              <Suspense fallback={<div className="h-screen bg-black" />}>
                <ProcessPage onContactClick={handleContactClick} />
                <Footer onContactClick={handleContactClick} />
              </Suspense>
            </motion.div>
          )}

          {/* 1.5. THE LAB PAGE */}
          {activePage === 'lab' && (
            <motion.div key="lab" {...pageTransition} className="pt-20">
              <Suspense fallback={<div className="h-screen bg-black" />}>
                <TheLab onContactClick={handleContactClick} />
                <Footer onContactClick={handleContactClick} />
              </Suspense>
            </motion.div>
          )}

          {/* 2. CONTACT PAGE */}
          {activePage === 'contact' && (
            <motion.div key="contact" {...pageTransition} className="pt-20">
              <Suspense fallback={<div className="h-screen bg-black" />}>
                <ContactPage onBack={handleHomeClick} />
              </Suspense>
            </motion.div>
          )}

          {/* 3. ABOUT PAGE */}
          {activePage === 'about' && (
            <motion.div key="about" {...pageTransition} className="pt-24">
              <Suspense fallback={<div className="h-screen bg-black" />}>
                <About onContactClick={handleContactClick} />
                <Footer onContactClick={handleContactClick} />
              </Suspense>
            </motion.div>
          )}

          {/* 4. WORKS PAGE */}
          {activePage === 'work' && (
            <motion.div key="work" {...pageTransition} className="pt-24">
              <Suspense fallback={<div className="h-screen bg-black" />}>
                <WorksPage onContactClick={handleContactClick} />
                <Footer onContactClick={handleContactClick} />
              </Suspense>
            </motion.div>
          )}

          {/* 5. HOME PAGE (Default) */}
          {activePage === 'home' && (
            <motion.div key="home" {...pageTransition}>
              <div id="home">
                <Hero onContactClick={handleContactClick} onIntroComplete={() => setIntroCompleted(true)} />
              </div>
              {/* Lazy Load Below-Fold Content */}
              <Suspense fallback={<div className="h-20" />}>
                <Brands />
                <VideoSection />
                <ProcessSprint onProcessClick={handleProcessClick} />
                <Projects onWorksClick={handleWorksClick} />
                <DataMetrics />
                <Testimonials />
                <Footer onContactClick={handleContactClick} />
              </Suspense>
            </motion.div>
          )}

        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}