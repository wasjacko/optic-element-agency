import React, { useState, useEffect, Suspense } from 'react';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Dashboard } from './components/admin/Dashboard';
import { LoginPage } from './components/admin/LoginPage';
import { AuthProvider, useAuth } from './components/auth/AuthContext';
import { getCMSContent } from './src/utils/cms-client';

import defaultContent from './src/data/homeContent.json';

// --- Theme Initialization ---
const updateTheme = (theme: any) => {
  if (!theme) return;
  const root = document.documentElement;
  root.style.setProperty('--color-primary', theme.primary || '#FF5000');
  root.style.setProperty('--color-bg', theme.background || '#050505');
  root.style.setProperty('--color-text', theme.text || '#FFFFFF');
  root.style.setProperty('--color-accent', theme.accent || '#000000');
};


// --- Loading Factories for Preloading ---
const factories = {
  Brands: () => import('./components/Brands').then(module => ({ default: module.Brands })),
  VideoSection: () => import('./components/VideoSection').then(module => ({ default: module.VideoSection })),
  Projects: () => import('./components/Projects').then(module => ({ default: module.Projects })),
  Testimonials: () => import('./components/Testimonials').then(module => ({ default: module.Testimonials })),
  About: () => import('./components/About').then(module => ({ default: module.About })),
  ContactPage: () => import('./components/ContactPage').then(module => ({ default: module.ContactPage })),
  Footer: () => import('./components/Footer').then(module => ({ default: module.Footer })),
  WorksPage: () => import('./components/WorksPage').then(module => ({ default: module.WorksPage })),
  ProcessPage: () => import('./components/ProcessPage').then(module => ({ default: module.ProcessPage })),
  DataMetrics: () => import('./components/DataMetrics').then(module => ({ default: module.DataMetrics })),
  CompanyValues: () => import('./components/CompanyValues').then(module => ({ default: module.CompanyValues })),
  ProcessSprint: () => import('./components/ProcessSprint').then(module => ({ default: module.ProcessSprint })),
  TheLab: () => import('./components/TheLab').then(module => ({ default: module.TheLab })),
  MissingElements: () => import('./components/MissingElements').then(module => ({ default: module.MissingElements })),
};

const Brands = React.lazy(factories.Brands);
const VideoSection = React.lazy(factories.VideoSection);
const Projects = React.lazy(factories.Projects);
const Testimonials = React.lazy(factories.Testimonials);
const About = React.lazy(factories.About);
const ContactPage = React.lazy(factories.ContactPage);
const Footer = React.lazy(factories.Footer);
const WorksPage = React.lazy(factories.WorksPage);
const ProcessPage = React.lazy(factories.ProcessPage);
const DataMetrics = React.lazy(factories.DataMetrics);
const CompanyValues = React.lazy(factories.CompanyValues);
const ProcessSprint = React.lazy(factories.ProcessSprint);
const TheLab = React.lazy(factories.TheLab);
const MissingElements = React.lazy(factories.MissingElements);

type Page = 'home' | 'about' | 'work' | 'process' | 'contact' | 'lab' | 'admin';

// -- Admin Guard Wrapper --
const AdminRoute: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { isAuthenticated, isLoading, logout } = useAuth();

  // Force logout when leaving the Admin View
  useEffect(() => {
    return () => {
      logout();
    };
  }, []);

  if (isLoading) return <div className="bg-black h-screen w-full" />;
  if (!isAuthenticated) return <LoginPage />;
  return <Dashboard onBack={onBack} />;
};

export default function App() {
  const [activePage, setActivePage] = useState<Page>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1);
      if (['about', 'work', 'process', 'contact', 'lab', 'admin'].includes(hash)) {
        return hash as Page;
      }
    }
    return 'home';
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const [introCompleted, setIntroCompleted] = useState(false);

  const handlePreload = (page: string) => {
    if (page === 'about') factories.About();
    if (page === 'work') factories.WorksPage();
    if (page === 'process') factories.ProcessPage();
    if (page === 'lab') factories.TheLab();
    if (page === 'contact') factories.ContactPage();
  };

  useEffect(() => {
    updateTheme(defaultContent.theme);
  }, []); // homeContent update should trigger HMR which re-runs this modulule, but React might keep state.
  // Actually, standard HMR for JSON might not trigger component re-render unless the import itself changes.
  // We can trust Vite HMR to reload the module or update the object.

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (['about', 'work', 'process', 'contact', 'lab', 'admin'].includes(hash)) {
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


  // CMS State
  const [cmsContent, setCmsContent] = useState<any>(defaultContent);

  // Fetch CMS Data
  useEffect(() => {
    getCMSContent().then(data => {
      if (data) {
        console.log("Loaded CMS Content:", data);
        setCmsContent(data);
      }
    });
  }, []);

  // Update Theme when Content Changes
  useEffect(() => {
    if (cmsContent?.theme) {
      updateTheme(cmsContent.theme);
    }
  }, [cmsContent]);

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
    <AuthProvider>
      <div className="min-h-screen text-white selection:bg-[var(--color-primary)] selection:text-white cursor-none" style={{ backgroundColor: 'var(--color-bg)' }}>
        <CustomCursor />
        <Navbar
          onContactClick={handleContactClick}
          onProcessClick={handleProcessClick}
          onPreload={handlePreload}
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
            {activePage === 'admin' && (
              <motion.div key="admin" {...pageTransition} className="z-[9999] relative">
                <AdminRoute onBack={handleHomeClick} />
              </motion.div>
            )}

            {activePage === 'process' && (
              <motion.div key="process" {...pageTransition} className="pt-20">
                <Suspense fallback={<div className="h-screen bg-black" />}>
                  <ProcessPage onContactClick={handleContactClick} data={cmsContent.processPage} />
                  <Footer onContactClick={handleContactClick} />
                </Suspense>
              </motion.div>
            )}

            {/* 1.5. THE LAB PAGE */}
            {activePage === 'lab' && (
              <motion.div key="lab" {...pageTransition} className="pt-20">
                <Suspense fallback={<div className="h-screen bg-black" />}>
                  <TheLab onContactClick={handleContactClick} data={cmsContent.lab} />
                  <Footer onContactClick={handleContactClick} />
                </Suspense>
              </motion.div>
            )}

            {/* 2. CONTACT PAGE */}
            {activePage === 'contact' && (
              <motion.div key="contact" {...pageTransition} className="pt-20">
                <Suspense fallback={<div className="h-screen bg-black" />}>
                  <ContactPage onBack={handleHomeClick} data={cmsContent.contact} />
                </Suspense>
              </motion.div>
            )}

            {/* 3. ABOUT PAGE */}
            {activePage === 'about' && (
              <motion.div key="about" {...pageTransition}>
                <Suspense fallback={<div className="h-screen bg-black" />}>
                  <About onContactClick={handleContactClick} data={cmsContent.about} />
                  <Footer onContactClick={handleContactClick} />
                </Suspense>
              </motion.div>
            )}

            {/* 4. WORKS PAGE */}
            {activePage === 'work' && (
              <motion.div key="work" {...pageTransition} className="pt-24">
                <Suspense fallback={<div className="h-screen bg-black" />}>
                  <WorksPage onContactClick={handleContactClick} data={cmsContent.worksPage} />
                  <Footer onContactClick={handleContactClick} />
                </Suspense>
              </motion.div>
            )}

            {/* 5. HOME PAGE (Default) */}
            {activePage === 'home' && (
              <motion.div key="home" {...pageTransition}>
                <div id="home">
                  <Hero
                    data={cmsContent.hero}
                    theme={cmsContent.theme}
                    onContactClick={handleContactClick}
                    onIntroComplete={() => setIntroCompleted(true)}
                  />
                </div>
                <Suspense fallback={<div className="h-screen bg-black" />}>
                  <div className="bg-white">
                    <Brands title={cmsContent.brands?.title} data={cmsContent} />
                    <MissingElements />

                    <ProcessSprint onProcessClick={handleProcessClick} data={cmsContent.sprint} />
                    <Projects onWorksClick={handleWorksClick} title={cmsContent.works?.title} data={cmsContent} />

                    <Testimonials data={cmsContent.testimonials} />
                    <Footer onContactClick={handleContactClick} />
                  </div>
                </Suspense>
              </motion.div>
            )}

          </AnimatePresence>
        </LayoutGroup>

        {/* Local Content Editor (Removed) */}
        {/* <LocalAdmin /> */}
      </div>
    </AuthProvider>
  );
}