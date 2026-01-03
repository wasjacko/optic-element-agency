import React, { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';

import { ContactPage } from './components/ContactPage';
import { About } from './components/About';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Brands } from './components/Brands';
import { VideoSection } from './components/VideoSection';
import { PerspectiveGrid } from './components/PerspectiveGrid';
import { Projects } from './components/Projects';
import { Footer } from './components/Footer';
import { WorksPage } from './components/WorksPage';
import { Testimonials } from './components/Testimonials';

function App() {
  const [showContact, setShowContact] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showWorks, setShowWorks] = useState(false);

  // Scroll to top when switching pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [showContact, showAbout, showWorks]);

  const handleHomeClick = () => {
    setShowContact(false);
    setShowAbout(false);
    setShowWorks(false);
  };

  const handleContactClick = () => {
    setShowContact(true);
    setShowAbout(false);
    setShowWorks(false);
  };

  const handleAboutClick = () => {
    setShowAbout(true);
    setShowContact(false);
    setShowWorks(false);
  };

  const handleWorksClick = () => {
    setShowWorks(true);
    setShowAbout(false);
    setShowContact(false);
  };

  const pageTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.4, ease: "easeInOut" }
  };

  return (
    <div className="selection:bg-black selection:text-white bg-[#050505] min-h-screen">
      <Navbar
        onContactClick={handleContactClick}
        onHomeClick={handleHomeClick}
        onAboutClick={handleAboutClick}
        onWorksClick={handleWorksClick}
      />

      <AnimatePresence mode="wait">
        {showContact ? (
          <motion.div
            key="contact"
            {...(pageTransition as any)}
            className="min-h-screen"
          >
            <ContactPage onBack={handleHomeClick} />
            <Footer onContactClick={handleContactClick} />
          </motion.div>
        ) : showAbout ? (
          <motion.div
            key="about"
            {...(pageTransition as any)}
            className="min-h-screen"
          >
            <About onContactClick={handleContactClick} onHomeClick={handleHomeClick} />
            <Footer onContactClick={handleContactClick} />
          </motion.div>
        ) : showWorks ? (
          <motion.div
            key="works"
            {...(pageTransition as any)}
            className="min-h-screen"
          >
            <WorksPage onContactClick={handleContactClick} />
            <Footer onContactClick={handleContactClick} />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            {...(pageTransition as any)}
            className="min-h-screen text-white font-sans font-light"
          >
            <div className="relative z-20 flex flex-col">
              <Hero onContactClick={handleContactClick} />
              <Brands />
              <VideoSection />
              <PerspectiveGrid />
              <Projects onWorksClick={handleWorksClick} />
              <Testimonials />
              <Footer onContactClick={handleContactClick} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;