import React, { useState, useEffect, Suspense, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// --- Shared Components (Synchronous) ---
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Dashboard } from './components/admin/Dashboard';
import { LoginPage } from './components/admin/LoginPage';
import { AuthProvider, useAuth } from './components/auth/AuthContext';
import { getCMSContent } from './src/utils/cms-client';
import homeContent from './src/data/homeContent.json';

// --- Lazy Components ---
const factories = {
  Brands: () => import('./components/Brands').then(module => ({ default: module.Brands })),
  Projects: () => import('./components/Projects').then(module => ({ default: module.Projects })),
  Testimonials: () => import('./components/Testimonials').then(module => ({ default: module.Testimonials })),
  MissingElements: () => import('./components/MissingElements').then(module => ({ default: module.MissingElements })),
  ProcessSprint: () => import('./components/ProcessSprint').then(module => ({ default: module.ProcessSprint })),
  WorksPage: () => import('./components/WorksPage').then(module => ({ default: module.WorksPage })),
  About: () => import('./components/About').then(module => ({ default: module.About })),
  TheLab: () => import('./components/TheLab').then(module => ({ default: module.TheLab })),
  ProcessPage: () => import('./components/ProcessPage').then(module => ({ default: module.ProcessPage })),
  ContactPage: () => import('./components/ContactPage').then(module => ({ default: module.ContactPage })),
  Footer: () => import('./components/Footer').then(module => ({ default: module.Footer })),
};

const Brands = React.lazy(factories.Brands);
const Projects = React.lazy(factories.Projects);
const Testimonials = React.lazy(factories.Testimonials);
const MissingElements = React.lazy(factories.MissingElements);
const ProcessSprint = React.lazy(factories.ProcessSprint);
const WorksPage = React.lazy(factories.WorksPage);
const About = React.lazy(factories.About);
const TheLab = React.lazy(factories.TheLab);
const ProcessPage = React.lazy(factories.ProcessPage);
const ContactPage = React.lazy(factories.ContactPage);
const Footer = React.lazy(factories.Footer);

// --- Utilities ---
const LazySection = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<div className="h-[200px] w-full flex items-center justify-center bg-[#050505] text-white/20 font-mono text-[10px] uppercase tracking-widest">Preloading Section...</div>}>
      {children}
    </Suspense>
  );
};

const updateTheme = (theme: any) => {
  if (!theme) return;
  const root = document.documentElement;
  root.style.setProperty('--color-primary', theme.primary || '#EF5304');
  root.style.setProperty('--color-bg', theme.background || '#050505');
  root.style.setProperty('--color-text', theme.text || '#FFFFFF');
  root.style.setProperty('--color-accent', theme.accent || '#000000');
};

type Page = 'home' | 'about' | 'work' | 'process' | 'contact' | 'lab' | 'admin';

const AdminRoute = ({ onBack }: { onBack: () => void }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="h-screen flex items-center justify-center bg-black font-mono text-white tracking-[0.3em]">SECURE_AUTH_INIT</div>;
  return isAuthenticated ? <Dashboard onBack={onBack} /> : <LoginPage />;
};

function App() {
  const [activePage, setActivePage] = useState<Page>(() => {
    const hash = window.location.hash.replace('#', '');
    const path = window.location.pathname.replace('/', '');
    const requestedPage = hash || path;
    return (['home', 'about', 'work', 'process', 'contact', 'lab', 'admin'].includes(requestedPage) ? requestedPage : 'home') as Page;
  });
  const [introCompleted, setIntroCompleted] = useState(false);
  const [cmsContent, setCmsContent] = useState<any>(homeContent);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    updateTheme(homeContent.theme);
    const loadCMS = async () => {
      try {
        const data = await getCMSContent();
        if (data) {
          setCmsContent(data);
          updateTheme(data.theme);
        }
      } catch (err) {
        console.warn("CMS fallback active");
      }
    };
    loadCMS();

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (page: Page) => {
    setActivePage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo(0, 0);
  };

  const handleHomeClick = () => navigateTo('home');
  const handleAboutClick = () => navigateTo('about');
  const handleWorksClick = () => navigateTo('work');
  const handleLabClick = () => navigateTo('lab');
  const handleProcessClick = () => navigateTo('process');
  const handleContactClick = () => navigateTo('contact');

  const pageTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.6, ease: "easeOut" as any }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen text-white bg-[#050505]" style={{ backgroundColor: 'var(--color-bg)' }}>
        {activePage !== 'admin' && <CustomCursor />}
        {activePage !== 'admin' && (
          <Navbar
            activePage={activePage}
            onHomeClick={handleHomeClick}
            onAboutClick={handleAboutClick}
            onWorksClick={handleWorksClick}
            onProcessClick={handleProcessClick}
            onLabClick={handleLabClick}
            onContactClick={handleContactClick}
            isScrolled={isScrolled}
            introCompleted={introCompleted}
          />
        )}

        <AnimatePresence mode="wait">
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
              <div className={`transition-opacity duration-1000 ${introCompleted ? 'opacity-100' : 'opacity-0'}`}>
                <LazySection><Brands title={cmsContent.brands?.title} data={cmsContent} /></LazySection>
                <LazySection><ProcessSprint data={cmsContent.sprint} /></LazySection>
                <LazySection><MissingElements data={cmsContent.missingElements} /></LazySection>
                <LazySection><Projects data={cmsContent} title={cmsContent.projects?.title} onWorksClick={handleWorksClick} /></LazySection>
                <LazySection><Testimonials data={cmsContent.testimonials} /></LazySection>
                <LazySection><Footer onContactClick={handleContactClick} /></LazySection>
              </div>
            </motion.div>
          )}

          {activePage === 'about' && (
            <motion.div key="about" {...pageTransition}>
              <About data={cmsContent.about} onContactClick={handleContactClick} />
            </motion.div>
          )}

          {activePage === 'work' && (
            <motion.div key="work" {...pageTransition}>
              <WorksPage data={cmsContent.worksPage} onContactClick={handleContactClick} />
            </motion.div>
          )}

          {activePage === 'process' && (
            <motion.div key="process" {...pageTransition}>
              <ProcessPage data={cmsContent.processPage} onContactClick={handleContactClick} />
            </motion.div>
          )}

          {activePage === 'lab' && (
            <motion.div key="lab" {...pageTransition}>
              <TheLab data={cmsContent.lab} onContactClick={handleContactClick} />
            </motion.div>
          )}

          {activePage === 'contact' && (
            <motion.div key="contact" {...pageTransition}>
              <ContactPage data={cmsContent.contact} onBack={handleHomeClick} />
            </motion.div>
          )}

          {activePage === 'admin' && (
            <motion.div key="admin" {...pageTransition} className="admin-side">
              <AdminRoute onBack={handleHomeClick} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthProvider>
  );
}

export default App;