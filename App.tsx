import React, { useState, useEffect, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';

// --- Lazy Loaded Components for Performance Optimization ---
const Brands = React.lazy(() => import('./components/Brands').then(module => ({ default: module.Brands })));
const Projects = React.lazy(() => import('./components/Projects').then(module => ({ default: module.Projects })));
const Testimonials = React.lazy(() => import('./components/Testimonials').then(module => ({ default: module.Testimonials })));
const About = React.lazy(() => import('./components/About').then(module => ({ default: module.About })));
const ContactPage = React.lazy(() => import('./components/ContactPage').then(module => ({ default: module.ContactPage })));
const Footer = React.lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));
const WorksPage = React.lazy(() => import('./components/WorksPage').then(module => ({ default: module.WorksPage })));
const ProcessPage = React.lazy(() => import('./components/ProcessPage').then(module => ({ default: module.ProcessPage })));
const DataMetrics = React.lazy(() => import('./components/DataMetrics').then(module => ({ default: module.DataMetrics })));
const VideoSection = React.lazy(() => import('./components/VideoSection').then(module => ({ default: module.VideoSection })));
const ProcessSprint = React.lazy(() => import('./components/ProcessSprint').then(module => ({ default: module.ProcessSprint })));

type Page = 'home' | 'about' | 'work' | 'process' | 'contact';

export default function App() {
  const [activePage, setActivePage] = useState<Page>('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [introCompleted, setIntroCompleted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // -- Navigation Handlers --

  const navigateTo = (page: Page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleContactClick = () => navigateTo('contact');
  const handleProcessClick = () => navigateTo('process');
  const handleHomeClick = () => navigateTo('home');
  const handleAboutClick = () => navigateTo('about');
  const handleWorksClick = () => navigateTo('work');

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: "easeInOut" as const }
  };

  return (
    <div className="bg-black min-h-screen text-white selection:bg-[#FF5000] selection:text-white">
      <Navbar
        onContactClick={handleContactClick}
        onProcessClick={handleProcessClick}
        onHomeClick={handleHomeClick}
        onAboutClick={handleAboutClick}
        onWorksClick={handleWorksClick}
        isScrolled={isScrolled}
        introCompleted={introCompleted}
        activePage={activePage}
      />

      {/* EXCLUSIVE PAGE ROUTING */}
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
              <ProcessSprint />
              <Projects />
              <DataMetrics />
              <Testimonials />
              <Footer onContactClick={handleContactClick} />
            </Suspense>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}