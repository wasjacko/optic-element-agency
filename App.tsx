import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Brands } from './components/Brands';
import { Projects } from './components/Projects';
import { Testimonials } from './components/Testimonials';
import { About } from './components/About';
import { ContactPage } from './components/ContactPage';
import { Footer } from './components/Footer';
import { WorksPage } from './components/WorksPage';
import { ProcessPage } from './components/ProcessPage';
import { DataMetrics } from './components/DataMetrics';
import { VideoSection } from './components/VideoSection';
import { ProcessSprint } from './components/ProcessSprint';

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

  const handleCloseContact = () => {
    // Return to previous or home? Defaulting to home for simplicity or back to where they were?
    // User requested "Pages", so Home is a safe fallback for general close.
    navigateTo('home');
  };

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
            <ProcessPage onContactClick={handleContactClick} />
            <Footer onContactClick={handleContactClick} />
          </motion.div>
        )}

        {/* 2. CONTACT PAGE */}
        {activePage === 'contact' && (
          <motion.div key="contact" {...pageTransition} className="pt-20">
            <ContactPage onBack={handleHomeClick} />
          </motion.div>
        )}

        {/* 3. ABOUT PAGE */}
        {activePage === 'about' && (
          <motion.div key="about" {...pageTransition} className="pt-24">
            <About onContactClick={handleContactClick} />
            <Footer onContactClick={handleContactClick} />
          </motion.div>
        )}

        {/* 4. WORKS PAGE */}
        {activePage === 'work' && (
          <motion.div key="work" {...pageTransition} className="pt-24">
            <WorksPage onContactClick={handleContactClick} />
            <Footer onContactClick={handleContactClick} />
          </motion.div>
        )}

        {/* 5. HOME PAGE (Default) */}
        {activePage === 'home' && (
          <motion.div key="home" {...pageTransition}>
            <div id="home">
              <Hero onContactClick={handleContactClick} onIntroComplete={() => setIntroCompleted(true)} />
            </div>
            <Brands />
            <VideoSection />
            <ProcessSprint />
            <Projects />
            <DataMetrics />
            <Testimonials />
            <Footer onContactClick={handleContactClick} />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}