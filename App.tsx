import React, { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';

import { ContactPage } from './components/ContactPage';
import { About } from './components/About';
import { Navbar } from './components/Navbar';
import { PerspectiveGrid } from './components/PerspectiveGrid';
import { Projects } from './components/Projects';
import { VideoSection } from './components/VideoSection';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Brands } from './components/Brands';

function App() {
  const [showContact, setShowContact] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Scroll to top when switching pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [showContact, showAbout]);

  const handleHomeClick = () => {
    setShowContact(false);
    setShowAbout(false);
  };

  const handleContactClick = () => {
    setShowContact(true);
    setShowAbout(false);
  };

  const handleAboutClick = () => {
    setShowAbout(true);
    setShowContact(false);
  };

  const pageTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.4, ease: "easeInOut" }
  };

  return (
    <div className={`selection:bg-tech-accent selection:text-white ${showContact ? 'bg-white' : 'bg-tech-black'}`}>
      <Navbar onContactClick={handleContactClick} onHomeClick={handleHomeClick} onAboutClick={handleAboutClick} />

      <AnimatePresence mode="wait">
        {showContact ? (
          <motion.div
            key="contact"
            {...(pageTransition as any)}
            className="min-h-screen"
          >
            <ContactPage onBack={handleHomeClick} />
            <Footer />
          </motion.div>
        ) : showAbout ? (
          <motion.div
            key="about"
            {...(pageTransition as any)}
            className="min-h-screen"
          >
            <About onContactClick={handleContactClick} onHomeClick={handleHomeClick} />
            <Footer />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            {...(pageTransition as any)}
            className="min-h-screen text-white font-sans font-light"
          >
            <div className="relative z-20">
              <Hero />
              <Brands />
              <VideoSection />
              <PerspectiveGrid />
              <Projects />
              <Footer />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;