
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, LogOut, Save, FileText, Check, Loader2, ArrowLeft, Eye, Smartphone, Monitor, Trash2, ArrowUp, ArrowDown, Plus, GripVertical } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { getCMSContent, saveCMSContent } from '../../src/utils/cms-client';

// Preview Components
import { Hero } from '../Hero';
import { Brands } from '../Brands';
import { VideoSection } from '../VideoSection';
import { Projects } from '../Projects';
import { ProcessSprint } from '../ProcessSprint';
import { Testimonials } from '../Testimonials';
import { About } from '../About';
import { ContactPage } from '../ContactPage';
import { ProcessPage } from '../ProcessPage';
import { WorksPage } from '../WorksPage';
import { TheLab } from '../TheLab';
import { Footer } from '../Footer';
import { BookingsManager } from './BookingsManager';

export const Dashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { logout } = useAuth();

    // CMS State
    const [content, setContent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<string>('');
    const [activePage, setActivePage] = useState<string>('home');
    const [activeSection, setActiveSection] = useState<string>('hero');
    const [previewKey, setPreviewKey] = useState(0);

    // Live Theme Preview
    useEffect(() => {
        if (content?.theme) {
            const root = document.documentElement;
            root.style.setProperty('--color-primary', content.theme.primary);
            root.style.setProperty('--color-bg', content.theme.background);
            root.style.setProperty('--color-text', content.theme.text);
        }
    }, [content]);

    // Fetch on mount
    useEffect(() => {
        setIsLoading(true);
        getCMSContent().then(data => {
            if (data) {
                // Ensure brands object exists with defaults if missing
                if (!data.brands) {
                    data.brands = {
                        title: "Brands We Serve",
                        items: [
                            "Investor Lift", "The Passionate Few", "LGC I Power",
                            "The Coffe Co", "Devotion To Dogs", "The Maverick Entrepreneur",
                            "Exhort Else", "Mindcore", "Minico Shibin", "Unbroken Fitness Solution"
                        ],
                        backgroundColor: "#0d0d0d",
                        titleColor: "#ff7300",
                        brandColor: "#ffffff"
                    };
                }

                // Ensure Sprint object exists
                if (!data.sprint) {
                    data.sprint = {
                        title: "S.P.R.I.N.T",
                        subtitle: "// our proven system",
                        cta: "OUR DETAILLED PROCESS",
                        steps: [
                            { id: "01", title: "STRATEGY", first: "S", rest: "TRATEGY", detail: "Define the Vision" },
                            { id: "02", title: "PLAN", first: "P", rest: "LAN", detail: "Map Out the Content" },
                            { id: "03", title: "ROLE", first: "R", rest: "OLE", detail: "Lights, Camera, Action." },
                            { id: "04", title: "INITIATE", first: "I", rest: "NITIATE", detail: "Edit + Polish" },
                            { id: "05", title: "NOTIFY", first: "N", rest: "OTIFY", detail: "Get Your Input" },
                            { id: "06", title: "TAKEOFF", first: "T", rest: "AKEOFF", detail: "Launch & Celebrate" }
                        ]
                    };
                }

                if (!data.testimonials) {
                    data.testimonials = {
                        title: "VIDEO TESTIMONIALS",
                        reviewsTitle: "CLIENT REVIEWS"
                    };
                }

                // Ensure Video object exists
                if (!data.video) {
                    data.video = {
                        title: "Showreel",
                        backgroundColor: "#000000",
                        accentColor: "#FF5000",
                        videoUrl: "https://lightcoral-hawk-369217.hostingersite.com/wp-content/uploads/2025/06/Video-Optic-element.mp4"
                    };
                }

                // Default Data for Pages
                // Default Data for Pages
                if (!data.about) data.about = { title: "Who We Are", teamCta: "JOIN_THE_TEAM", videoUrl: "https://video.wixstatic.com/video/8fb0bb_3101935948d84d248cbb6453b7ba87e8/720p/mp4/file.mp4" };
                else if (!data.about.videoUrl) data.about.videoUrl = "https://video.wixstatic.com/video/8fb0bb_3101935948d84d248cbb6453b7ba87e8/720p/mp4/file.mp4";

                if (!data.contact) data.contact = { titleLine1: "SCHEDULE A", titleLine2: "CALL", titleLine3: "WITH", titleLine4: "SANTIAGO", description: "Book a call with our team. This call is to learn more about your business and if Optic Element is a good fit to help you achieve your goals." };
                if (!data.processPage) data.processPage = { title: "Our Process", subtitle: "Our strategy to get you leads with content" };

                if (!data.worksPage) data.worksPage = { cta: "SCHEDULE_CALL" };
                // Initialize default services for Works Page if missing
                if (!data.worksPage.services) {
                    data.worksPage.services = [
                        {
                            id: 'brand',
                            label: 'Brand Videos',
                            type: 'video',
                            description: 'Cinematic storytelling that elevates brand identity.',
                            videos: [
                                { id: 'lgcy-recruitment', title: 'LGCY RECRUITMENT', description: 'Cinematic storytelling.', src: 'https://video.wixstatic.com/video/8fb0bb_b9a25be31bc34c65970d07346fe1f732/1080p/mp4/file.mp4' },
                                { id: 'koffee', title: 'KOFFEE CO.', description: 'Premium commercial production.', src: 'https://video.wixstatic.com/video/8fb0bb_4722b88e8b614accaadc3be3ba825bf7/1080p/mp4/file.mp4' },
                                { id: 'rv-promo', title: 'RV PROMO', description: 'Dynamic promotional content.', src: 'https://video.wixstatic.com/video/8fb0bb_b2dfc21f1d514060ab32a9e3004397bc/1080p/mp4/file.mp4' },
                                { id: 'inflatable', title: 'INFLATABLE WORLD', description: 'High-energy promotional coverage.', src: 'https://video.wixstatic.com/video/8fb0bb_63f55faeec1442bf9076e87309bfdd83/1080p/mp4/file.mp4' },
                                { id: 'lgcy-mexico', title: 'LGCY MEXICO', description: 'Documentary-style storytelling.', src: 'https://video.wixstatic.com/video/8fb0bb_39fde8faf82540bc99862c5301f897be/1080p/mp4/file.mp4' },
                                { id: 'mexico-build', title: 'MEXICO BUILD', description: 'Impactful narrative.', src: 'https://video.wixstatic.com/video/8fb0bb_37ccb7c01fb5468d9465985f791cef9f/1080p/mp4/file.mp4' },
                                { id: 'masters-hype', title: 'MASTERS HYPE', description: 'Fast-paced, high-impact edit.', src: 'https://video.wixstatic.com/video/8fb0bb_2345e2ed454a472bacf9f6fee9b690d9/1080p/mp4/file.mp4' }
                            ]
                        },
                        {
                            id: 'shorts',
                            label: 'Short Videos',
                            type: 'video',
                            description: 'High-impact short-form content.',
                            videos: [
                                { id: 'investor-lift', title: 'INVESTOR LIFT', description: 'DOMINICAN REPUBLIC TRIP', src: 'https://video.wixstatic.com/video/8fb0bb_27627ec09f7e4a349e6efcaa71d751f4/480p/mp4/file.mp4' },
                                { id: 'passionate-few', title: 'PASSIONATE FEW', description: 'MEXICO HOUSE BUILD TRIP', src: 'https://video.wixstatic.com/video/8fb0bb_70e8af86cad140fab13cad5b7aa60fbe/1080p/mp4/file.mp4' },
                                { id: 'dasfleet', title: 'DASFLEET', description: 'LUX CAR CLUB PROMO', src: 'https://video.wixstatic.com/video/8fb0bb_6a9b9f18c9d549c5a9203f05f19f8c26/1080p/mp4/file.mp4' }
                            ]
                        },
                        {
                            id: 'photo', label: 'Photography', type: 'image', description: 'High-end visual assets.', images: []
                        },
                        {
                            id: 'digital', label: 'Digital Assets', type: 'image', description: 'Strategic motion graphics.', images: []
                        }
                    ];
                }

                if (!data.lab) data.lab = { title: "THE LAB", bookingTitle: "Project Details", bookingSubtitle: "Tell us about your shoot requirements." };

                setContent(data);
            }
            setIsLoading(false);
        });
    }, []);

    // Auto-scroll to active section in preview
    useEffect(() => {
        const element = document.getElementById(`preview-${activeSection}`);
        const container = document.getElementById('preview-container');
        if (element && container) {
            container.scrollTo({
                top: element.offsetTop,
                behavior: 'smooth'
            });
        }
    }, [activeSection, content]);

    const handleSave = async () => {
        if (!content) return;
        setIsSaving(true);
        setStatus('Saving...');

        // 1. Save to Backend
        const res = await saveCMSContent(content);

        if (res.success) {
            setStatus('Syncing...');
            // 2. Verify Persistence by Re-fetching (Bypassing potential local state drifts)
            const freshData = await getCMSContent();
            if (freshData) {
                setContent(freshData);
                // Status will be set after delay to be visible
            }
        } else {
            setStatus('Error Saving');
        }

        // Artificial delay for better UX perception
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSaving(false);

        if (res.success) {
            setStatus('Saved & Verified');
        }

        setTimeout(() => setStatus(''), 3000);
    };

    const updateField = (section: string, field: string, value: any) => {
        setContent((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" size={24} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col h-screen overflow-hidden" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>

            {/* Top Navigation */}
            <header className="bg-white border-b border-gray-200 z-30 shrink-0">

                <div className="w-full px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-lg tracking-tight">OPTIC ELEMENT</span>
                        <div className="h-4 w-[1px] bg-gray-300 mx-2"></div>
                        <span className="text-sm text-gray-500">Content Manager</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {status && (
                            <div className={`text-xs flex items-center gap-2 ${status === 'Error' ? 'text-red-600' : 'text-green-600'}`}>
                                {status === 'Saved' && <Check size={14} />}
                                {status}
                            </div>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <div className="h-4 w-[1px] bg-gray-200"></div>
                        <button onClick={() => { logout(); onBack(); }} className="text-xs font-medium text-gray-500 hover:text-black">Exit</button>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">

                {/* LEFT: Editor Sidebar */}
                <div className="w-[320px] bg-gray-50 border-r border-gray-200 flex flex-col overflow-y-auto shrink-0 z-20">

                    {/* Navigation Tabs */}
                    {/* Navigation Tabs - Level 1: Pages */}
                    <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
                        <div className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Select Page</div>
                        <div className="flex flex-col px-2 pb-2 gap-1">
                            <NavTab active={activePage === 'home'} onClick={() => { setActivePage('home'); setActiveSection('hero'); }} label="Home" />
                            <NavTab active={activePage === 'about'} onClick={() => { setActivePage('about'); setActiveSection('header'); }} label="About" />
                            <NavTab active={activePage === 'process'} onClick={() => { setActivePage('process'); setActiveSection('header'); }} label="Process" />
                            <NavTab active={activePage === 'works'} onClick={() => { setActivePage('works'); setActiveSection('gallery'); }} label="Works" />
                            <NavTab active={activePage === 'bookings'} onClick={() => { setActivePage('bookings'); setActiveSection('bookings'); }} label="Bookings" />
                            <NavTab active={activePage === 'contact'} onClick={() => { setActivePage('contact'); setActiveSection('intro'); }} label="Contact" />
                        </div>
                    </div>

                    {/* Navigation Tabs - Level 2: Home Sections (Only visible if Home is active) */}
                    {activePage === 'home' && (
                        <div className="border-b border-gray-200 bg-gray-50 p-2">
                            <div className="px-2 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Sections</div>
                            <div className="grid grid-cols-2 gap-2">
                                <SubNavTab active={activeSection === 'hero'} onClick={() => setActiveSection('hero')} label="Hero" />
                                <SubNavTab active={activeSection === 'brands'} onClick={() => setActiveSection('brands')} label="Brands" />
                                <SubNavTab active={activeSection === 'video'} onClick={() => setActiveSection('video')} label="Video" />
                                <SubNavTab active={activeSection === 'sprint'} onClick={() => setActiveSection('sprint')} label="Sprint" />
                                <SubNavTab active={activeSection === 'works'} onClick={() => setActiveSection('works')} label="Projects" />
                                <SubNavTab active={activeSection === 'testimonials'} onClick={() => setActiveSection('testimonials')} label="Reviews" />
                            </div>
                        </div>
                    )}
                    {activePage === 'about' && (
                        <div className="border-b border-gray-200 bg-gray-50 p-2">
                            <div className="px-2 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Sections</div>
                            <div className="grid grid-cols-2 gap-2">
                                <SubNavTab active={activeSection === 'header'} onClick={() => setActiveSection('header')} label="Header" />
                                <SubNavTab active={activeSection === 'video'} onClick={() => setActiveSection('video')} label="Team Video" />
                                <SubNavTab active={activeSection === 'team'} onClick={() => setActiveSection('team')} label="Team Grid" />
                                <SubNavTab active={activeSection === 'diffs'} onClick={() => setActiveSection('diffs')} label="Differentiators" />
                            </div>
                        </div>
                    )}
                    {activePage === 'process' && (
                        <div className="border-b border-gray-200 bg-gray-50 p-2">
                            <div className="px-2 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Sections</div>
                            <div className="grid grid-cols-2 gap-2">
                                <SubNavTab active={activeSection === 'header'} onClick={() => setActiveSection('header')} label="Header" />
                                <SubNavTab active={activeSection === 'timeline'} onClick={() => setActiveSection('timeline')} label="Timeline" />
                                <SubNavTab active={activeSection === 'cta'} onClick={() => setActiveSection('cta')} label="Footer CTA" />
                            </div>
                        </div>
                    )}
                    {activePage === 'works' && (
                        <div className="border-b border-gray-200 bg-gray-50 p-2">
                            <div className="px-2 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Sections</div>
                            <div className="grid grid-cols-2 gap-2">
                                <SubNavTab active={activeSection === 'gallery'} onClick={() => setActiveSection('gallery')} label="Gallery" />
                                <SubNavTab active={activeSection === 'cta'} onClick={() => setActiveSection('cta')} label="Footer CTA" />
                            </div>
                        </div>
                    )}
                    {activePage === 'contact' && (
                        <div className="border-b border-gray-200 bg-gray-50 p-2">
                            <div className="px-2 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Sections</div>
                            <div className="grid grid-cols-2 gap-2">
                                <SubNavTab active={activeSection === 'intro'} onClick={() => setActiveSection('intro')} label="Intro" />
                            </div>
                        </div>
                    )}

                    {/* Edit Form */}
                    <div className="p-6 space-y-8 pb-32">
                        {/* --- HOME SECTIONS --- */}
                        {activePage === 'home' && activeSection === 'hero' && content?.hero && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Hero Styling</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <ColorInput label="Background" value={content.hero.backgroundColor} onChange={(v) => updateField('hero', 'backgroundColor', v)} />
                                    <ColorInput label="Main Text" value={content.hero.textColor} onChange={(v) => updateField('hero', 'textColor', v)} />
                                    <ColorInput label="Highlights" value={content.hero.highlightColor} onChange={(v) => updateField('hero', 'highlightColor', v)} />
                                    <ColorInput label="Button BG" value={content.hero.ctaBg} onChange={(v) => updateField('hero', 'ctaBg', v)} />
                                    <ColorInput label="Button Text" value={content.hero.ctaText} onChange={(v) => updateField('hero', 'ctaText', v)} />
                                </div>

                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 mt-8">Content</h3>
                                <InputGroup label="Headline Phase 1" value={content.hero.phase1} onChange={(v) => updateField('hero', 'phase1', v)} />
                                <InputGroup label="Highlight 1" value={content.hero.phase1Highlight} onChange={(v) => updateField('hero', 'phase1Highlight', v)} />
                                <InputGroup label="Headline Phase 2" value={content.hero.phase2} onChange={(v) => updateField('hero', 'phase2', v)} />
                                <InputGroup label="Highlight 2" value={content.hero.phase2Highlight} onChange={(v) => updateField('hero', 'phase2Highlight', v)} />
                                <InputGroup label="CTA Button Text" value={content.hero.cta} onChange={(v) => updateField('hero', 'cta', v)} />
                            </div>
                        )}

                        {activePage === 'home' && activeSection === 'video' && content?.video && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Video Styling</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <ColorInput label="Background" value={content.video.backgroundColor} onChange={(v) => updateField('video', 'backgroundColor', v)} />
                                    <ColorInput label="Accent / Play" value={content.video.accentColor} onChange={(v) => updateField('video', 'accentColor', v)} />
                                </div>

                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 mt-8">Content</h3>
                                <InputGroup label="Section Title" value={content.video.title} onChange={(v) => updateField('video', 'title', v)} />
                                <InputGroup label="Video URL (MP4)" value={content.video.videoUrl} onChange={(v) => updateField('video', 'videoUrl', v)} />
                            </div>
                        )}

                        {activePage === 'home' && activeSection === 'brands' && content?.brands && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Brands Styling</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <ColorInput label="Background" value={content.brands.backgroundColor} onChange={(v) => updateField('brands', 'backgroundColor', v)} />
                                    <ColorInput label="Title Text" value={content.brands.titleColor} onChange={(v) => updateField('brands', 'titleColor', v)} />
                                    <ColorInput label="Brand Names" value={content.brands.brandColor} onChange={(v) => updateField('brands', 'brandColor', v)} />
                                </div>

                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 mt-8">Content</h3>
                                <InputGroup label="Section Title" value={content.brands.title} onChange={(v) => updateField('brands', 'title', v)} />
                                <div className="group">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 transition-colors group-focus-within:text-black">Brand Names (One per line)</label>
                                    <textarea
                                        rows={8}
                                        value={Array.isArray(content.brands.items) ? content.brands.items.join('\n') : ''}
                                        onChange={(e) => updateField('brands', 'items', e.target.value.split('\n'))}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-gray-300 resize-none font-medium custom-scrollbar"
                                        placeholder="Google&#10;Nike&#10;Apple..."
                                    />
                                </div>
                            </div>
                        )}

                        {activePage === 'home' && activeSection === 'works' && content?.works && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Works Styling</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <ColorInput label="Background" value={content.works.backgroundColor} onChange={(v) => updateField('works', 'backgroundColor', v)} />
                                    <ColorInput label="Section Title" value={content.works.titleColor} onChange={(v) => updateField('works', 'titleColor', v)} />
                                    <ColorInput label="Card Titles" value={content.works.cardTitleColor} onChange={(v) => updateField('works', 'cardTitleColor', v)} />
                                </div>

                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 mt-8">Content</h3>
                                <InputGroup label="Section Title" value={content.works.title} onChange={(v) => updateField('works', 'title', v)} />
                            </div>
                        )}

                        {activePage === 'home' && activeSection === 'sprint' && content?.sprint && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Sprint Configuration</h3>
                                <InputGroup label="Main Title" value={content.sprint.title} onChange={(v) => updateField('sprint', 'title', v)} />
                                <InputGroup label="Subtitle" value={content.sprint.subtitle} onChange={(v) => updateField('sprint', 'subtitle', v)} />
                                <InputGroup label="CTA Button Text" value={content.sprint.cta} onChange={(v) => updateField('sprint', 'cta', v)} />
                            </div>
                        )}

                        {activePage === 'home' && activeSection === 'testimonials' && content?.testimonials && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Testimonials Configuration</h3>
                                <InputGroup label="Main Title" value={content.testimonials.title} onChange={(v) => updateField('testimonials', 'title', v)} />
                                <InputGroup label="Reviews Subtitle" value={content.testimonials.reviewsTitle} onChange={(v) => updateField('testimonials', 'reviewsTitle', v)} />
                            </div>
                        )}

                        {/* --- ABOUT PAGE --- */}
                        {activePage === 'about' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                {activeSection === 'header' && (
                                    <>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Page Styling</h3>
                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <ColorInput label="Background" value={content?.about?.backgroundColor || '#ffffff'} onChange={(v) => updateField('about', 'backgroundColor', v)} />
                                            <ColorInput label="Main Text" value={content?.about?.textColor || '#000000'} onChange={(v) => updateField('about', 'textColor', v)} />
                                            <ColorInput label="Accent" value={content?.about?.accentColor || '#FF5000'} onChange={(v) => updateField('about', 'accentColor', v)} />
                                        </div>

                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Header Configuration</h3>
                                        <InputGroup label="Page Title" value={content?.about?.title} onChange={(v) => updateField('about', 'title', v)} />
                                    </>
                                )}
                                {activeSection === 'team' && (
                                    <>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Team Grid</h3>
                                        <div className="p-4 bg-gray-50 border border-gray-100 rounded text-sm text-gray-500">
                                            Team members are currently managed via code. You can update the "Join The Team" button text below.
                                        </div>
                                        <InputGroup label="Team CTA Button" value={content?.about?.teamCta} onChange={(v) => updateField('about', 'teamCta', v)} />
                                    </>
                                )}
                                {activeSection === 'video' && (
                                    <>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Team Video Configuration</h3>
                                        <InputGroup label="Video URL (MP4)" value={content?.about?.videoUrl} onChange={(v) => updateField('about', 'videoUrl', v)} />
                                    </>
                                )}
                                {activeSection === 'diffs' && (
                                    <div className="p-4 bg-gray-50 border border-gray-100 rounded text-sm text-gray-500">
                                        Differentiator cards are statically defined for layout stability.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- PROCESS PAGE --- */}
                        {activePage === 'process' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                {activeSection === 'header' && (
                                    <>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Page Styling</h3>
                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <ColorInput label="Background" value={content?.processPage?.backgroundColor || '#000000'} onChange={(v) => updateField('processPage', 'backgroundColor', v)} />
                                            <ColorInput label="Main Text" value={content?.processPage?.textColor || '#ffffff'} onChange={(v) => updateField('processPage', 'textColor', v)} />
                                            <ColorInput label="Accent" value={content?.processPage?.accentColor || '#FF5000'} onChange={(v) => updateField('processPage', 'accentColor', v)} />
                                        </div>

                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Header Configuration</h3>
                                        <InputGroup label="Page Title" value={content?.processPage?.title} onChange={(v) => updateField('processPage', 'title', v)} />
                                        <InputGroup label="Subtitle" value={content?.processPage?.subtitle} onChange={(v) => updateField('processPage', 'subtitle', v)} />
                                    </>
                                )}
                                {activeSection === 'timeline' && (
                                    <div className="p-4 bg-gray-50 border border-gray-100 rounded text-sm text-gray-500">
                                        Process timeline steps are managed in code to ensure correct animation sequences.
                                    </div>
                                )}
                                {activeSection === 'cta' && (
                                    <div className="p-4 bg-gray-50 border border-gray-100 rounded text-sm text-gray-500">
                                        The footer CTA redirects to the contact page.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- WORKS PAGE --- */}
                        {activePage === 'works' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                {activeSection === 'gallery' && (
                                    <>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Page Styling</h3>
                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <ColorInput label="Background" value={content?.worksPage?.backgroundColor || '#ffffff'} onChange={(v) => updateField('worksPage', 'backgroundColor', v)} />
                                            <ColorInput label="Main Text" value={content?.worksPage?.textColor || '#000000'} onChange={(v) => updateField('worksPage', 'textColor', v)} />
                                            <ColorInput label="Accent" value={content?.worksPage?.accentColor || '#FF5000'} onChange={(v) => updateField('worksPage', 'accentColor', v)} />
                                        </div>
                                        {/* SERVICES MANAGEMENT */}
                                        <div className="space-y-8 mt-12 pt-8 border-t border-gray-200">
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-6">Services Content</h3>

                                            {/* Brand Videos */}
                                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                                    <h4 className="text-sm font-bold uppercase">Brand Videos</h4>
                                                    <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5 rounded">VIDEO</span>
                                                </div>
                                                <div className="p-4 space-y-6">
                                                    <ServiceInfoManager
                                                        service={content?.worksPage?.services?.find((s: any) => s.id === 'brand')}
                                                        onChange={(updated) => {
                                                            const services = [...(content?.worksPage?.services || [])];
                                                            const idx = services.findIndex(s => s.id === 'brand');
                                                            if (idx !== -1) {
                                                                services[idx] = { ...services[idx], ...updated };
                                                                updateField('worksPage', 'services', services);
                                                            }
                                                        }}
                                                    />
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-2">Videos List</label>
                                                        <VideoListManager
                                                            videos={content?.worksPage?.services?.find((s: any) => s.id === 'brand')?.videos || []}
                                                            onChange={(newVideos) => {
                                                                const services = [...(content?.worksPage?.services || [])];
                                                                const brandIndex = services.findIndex(s => s.id === 'brand');
                                                                if (brandIndex !== -1) {
                                                                    services[brandIndex] = { ...services[brandIndex], videos: newVideos };
                                                                    updateField('worksPage', 'services', services);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Short Videos */}
                                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                                    <h4 className="text-sm font-bold uppercase">Short Videos</h4>
                                                    <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5 rounded">VIDEO</span>
                                                </div>
                                                <div className="p-4 space-y-6">
                                                    <ServiceInfoManager
                                                        service={content?.worksPage?.services?.find((s: any) => s.id === 'shorts')}
                                                        onChange={(updated) => {
                                                            const services = [...(content?.worksPage?.services || [])];
                                                            const idx = services.findIndex(s => s.id === 'shorts');
                                                            if (idx !== -1) {
                                                                services[idx] = { ...services[idx], ...updated };
                                                                updateField('worksPage', 'services', services);
                                                            }
                                                        }}
                                                    />
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-2">Videos List</label>
                                                        <VideoListManager
                                                            videos={content?.worksPage?.services?.find((s: any) => s.id === 'shorts')?.videos || []}
                                                            onChange={(newVideos) => {
                                                                const services = [...(content?.worksPage?.services || [])];
                                                                const shortsIndex = services.findIndex(s => s.id === 'shorts');
                                                                if (shortsIndex !== -1) {
                                                                    services[shortsIndex] = { ...services[shortsIndex], videos: newVideos };
                                                                    updateField('worksPage', 'services', services);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Photography */}
                                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                                    <h4 className="text-sm font-bold uppercase">Photography</h4>
                                                    <span className="text-[10px] font-mono bg-gray-200 text-black px-2 py-0.5 rounded">IMAGE</span>
                                                </div>
                                                <div className="p-4 space-y-6">
                                                    <ServiceInfoManager
                                                        service={content?.worksPage?.services?.find((s: any) => s.id === 'photo')}
                                                        onChange={(updated) => {
                                                            const services = [...(content?.worksPage?.services || [])];
                                                            const idx = services.findIndex(s => s.id === 'photo');
                                                            if (idx !== -1) {
                                                                services[idx] = { ...services[idx], ...updated };
                                                                updateField('worksPage', 'services', services);
                                                            }
                                                        }}
                                                    />
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-2">Gallery Images</label>
                                                        <ImageListManager
                                                            images={content?.worksPage?.services?.find((s: any) => s.id === 'photo')?.images || []}
                                                            onChange={(newImages) => {
                                                                const services = [...(content?.worksPage?.services || [])];
                                                                const idx = services.findIndex(s => s.id === 'photo');
                                                                if (idx !== -1) {
                                                                    services[idx] = { ...services[idx], images: newImages };
                                                                    updateField('worksPage', 'services', services);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Digital Assets */}
                                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                                    <h4 className="text-sm font-bold uppercase">Digital Assets</h4>
                                                    <span className="text-[10px] font-mono bg-gray-200 text-black px-2 py-0.5 rounded">IMAGE</span>
                                                </div>
                                                <div className="p-4 space-y-6">
                                                    <ServiceInfoManager
                                                        service={content?.worksPage?.services?.find((s: any) => s.id === 'digital')}
                                                        onChange={(updated) => {
                                                            const services = [...(content?.worksPage?.services || [])];
                                                            const idx = services.findIndex(s => s.id === 'digital');
                                                            if (idx !== -1) {
                                                                services[idx] = { ...services[idx], ...updated };
                                                                updateField('worksPage', 'services', services);
                                                            }
                                                        }}
                                                    />
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-2">Assets Images</label>
                                                        <ImageListManager
                                                            images={content?.worksPage?.services?.find((s: any) => s.id === 'digital')?.images || []}
                                                            onChange={(newImages) => {
                                                                const services = [...(content?.worksPage?.services || [])];
                                                                const idx = services.findIndex(s => s.id === 'digital');
                                                                if (idx !== -1) {
                                                                    services[idx] = { ...services[idx], images: newImages };
                                                                    updateField('worksPage', 'services', services);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </>
                                )}
                                {activeSection === 'cta' && (
                                    <>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Footer Configuration</h3>
                                        <InputGroup label="Footer CTA" value={content?.worksPage?.cta} onChange={(v) => updateField('worksPage', 'cta', v)} />
                                    </>
                                )}
                            </div>
                        )}

                        {/* --- CONTACT PAGE --- */}
                        {activePage === 'contact' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                {activeSection === 'intro' && (
                                    <>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Page Styling</h3>
                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <ColorInput label="Background" value={content?.contact?.backgroundColor || '#ffffff'} onChange={(v) => updateField('contact', 'backgroundColor', v)} />
                                            <ColorInput label="Main Text" value={content?.contact?.textColor || '#000000'} onChange={(v) => updateField('contact', 'textColor', v)} />
                                            <ColorInput label="Accent" value={content?.contact?.accentColor || '#FF5000'} onChange={(v) => updateField('contact', 'accentColor', v)} />
                                        </div>

                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Intro Content</h3>
                                        <InputGroup label="Title Line 1" value={content?.contact?.titleLine1} onChange={(v) => updateField('contact', 'titleLine1', v)} />
                                        <InputGroup label="Title Line 2" value={content?.contact?.titleLine2} onChange={(v) => updateField('contact', 'titleLine2', v)} />
                                        <InputGroup label="Title Line 3 (Accent)" value={content?.contact?.titleLine3} onChange={(v) => updateField('contact', 'titleLine3', v)} />
                                        <InputGroup label="Title Line 4 (Accent)" value={content?.contact?.titleLine4} onChange={(v) => updateField('contact', 'titleLine4', v)} />
                                        <InputGroup label="Description" value={content?.contact?.description} onChange={(v) => updateField('contact', 'description', v)} />
                                    </>
                                )}
                                {activeSection === 'form' && (
                                    <div className="p-4 bg-gray-50 border border-gray-100 rounded text-sm text-gray-500">
                                        The booking widget is embedded via an iframe.
                                    </div>
                                )}
                            </div>
                        )}

                        {activePage === 'lab' && content?.lab && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">The Lab Page Configuration</h3>
                                <InputGroup label="Page Title" value={content.lab.title} onChange={(v) => updateField('lab', 'title', v)} />
                                <InputGroup label="Booking Title" value={content.lab.bookingTitle} onChange={(v) => updateField('lab', 'bookingTitle', v)} />
                                <InputGroup label="Booking Subtitle" value={content.lab.bookingSubtitle} onChange={(v) => updateField('lab', 'bookingSubtitle', v)} />
                            </div>
                        )}

                        {activePage === 'bookings' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Booking Management</h3>
                                    <p className="text-sm text-gray-600">
                                        Use the interface on the right to view, accept, or reject studio booking requests.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Live Preview or Tools */}
                <div className="flex-1 bg-[#F3F4F6] flex flex-col relative overflow-hidden items-center justify-center p-8">

                    {activePage === 'bookings' ? (
                        <div className="w-full h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-y-auto custom-scrollbar">
                            <BookingsManager />
                        </div>
                    ) : (
                        /* Preview Container */
                        <div className="bg-white shadow-2xl relative overflow-hidden w-full h-full rounded-xl border border-gray-200">
                            <div key={previewKey} className="w-full h-full overflow-y-auto custom-scrollbar scroll-smooth" id="preview-container" style={{ fontFamily: "'Tactic Sans', system-ui, -apple-system, sans-serif" }}>
                                {activePage === 'home' && (
                                    <>
                                        {activeSection === 'hero' && (
                                            <div id="preview-hero" className="w-full h-full">
                                                <Hero data={content?.hero} theme={content?.theme} onContactClick={() => { }} onIntroComplete={() => { }} />
                                            </div>
                                        )}

                                        {activeSection === 'brands' && (
                                            <div id="preview-brands" className="w-full h-full bg-black flex items-center justify-center">
                                                <Brands title={content?.brands?.title} data={content} />
                                            </div>
                                        )}

                                        {activeSection === 'video' && (
                                            <div id="preview-video" className="w-full h-full bg-black flex items-center justify-center">
                                                <VideoSection data={content?.video} />
                                            </div>
                                        )}

                                        {activeSection === 'sprint' && (
                                            <div id="preview-sprint" className="w-full h-full bg-white flex items-center justify-center">
                                                <ProcessSprint data={content?.sprint} />
                                            </div>
                                        )}

                                        {activeSection === 'works' && (
                                            <div id="preview-works" className="w-full h-full bg-white">
                                                <Projects title={content?.works?.title} data={content} />
                                            </div>
                                        )}

                                        {activeSection === 'testimonials' && (
                                            <div id="preview-testimonials" className="w-full h-full bg-white">
                                                <Testimonials data={content?.testimonials} />
                                            </div>
                                        )}
                                    </>
                                )}

                                {activePage === 'about' && (
                                    <div id="preview-about" className="opacity-100 w-full h-full">
                                        <div className="bg-white relative w-full h-full">
                                            <About onContactClick={() => { }} data={content?.about} activeSection={activeSection} />
                                        </div>
                                    </div>
                                )}

                                {activePage === 'process' && (
                                    <div id="preview-processPage" className="opacity-100 w-full h-full">
                                        <div className="bg-black relative w-full h-full">
                                            <ProcessPage onContactClick={() => { }} data={content?.processPage} activeSection={activeSection} />
                                        </div>
                                    </div>
                                )}

                                {activePage === 'works' && (
                                    <div id="preview-worksPage" className="opacity-100 w-full h-full">
                                        <div className="bg-white relative w-full h-full">
                                            <WorksPage onContactClick={() => { }} data={content?.worksPage} activeSection={activeSection} />
                                        </div>
                                    </div>
                                )}

                                {activePage === 'bookings' && (
                                    <div id="preview-bookings" className="opacity-100 w-full h-full overflow-y-auto bg-gray-50">
                                        <BookingsManager />
                                    </div>
                                )}

                                {activePage === 'lab' && (
                                    <div id="preview-lab" className="opacity-100 w-full h-full">
                                        <div className="bg-white relative w-full h-full">
                                            <TheLab onContactClick={() => { }} data={content?.lab} />
                                            <div className="pointer-events-none opacity-50"><Footer onContactClick={() => { }} /></div>
                                        </div>
                                    </div>
                                )}

                                {activePage === 'contact' && (
                                    <div id="preview-contact" className="opacity-100 w-full h-full">
                                        <div className="bg-white relative w-full h-full">
                                            <ContactPage onBack={() => { }} data={content?.contact} activeSection={activeSection} />
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    )}
                </div>

            </main >
        </div >
    );
};

const ColorInput = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
    <div className="group">
        <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
        <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded border border-gray-300 shadow-sm shrink-0 overflow-hidden">
                <input
                    type="color"
                    value={value && value.startsWith('#') ? value : '#000000'}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                />
            </div>
            <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-400"
                placeholder="#000000"
            />
        </div>
    </div>
);

const InputGroup = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
    <div className="group">
        <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
        <textarea
            rows={value?.length > 50 ? 3 : 1}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-400 resize-none"
            placeholder="..."
        />
    </div>
);



const NavTab = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
    <button
        onClick={onClick}
        className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${active
            ? 'bg-black text-white'
            : 'text-gray-600 hover:bg-gray-100 hover:text-black'
            }`}
    >
        {label}
    </button>
);

const SubNavTab = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
    <button
        onClick={onClick}
        className={`w-full text-center px-3 py-1.5 rounded border text-xs font-medium transition-colors ${active
            ? 'bg-white border-black text-black shadow-sm'
            : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
    >
        {label}
    </button>
);

// --- Helper Components ---


const ServiceInfoManager = ({ service, onChange }: { service: any, onChange: (v: any) => void }) => {
    if (!service) return null;
    return (
        <div className="grid grid-cols-1 gap-4">
            <InputGroup label="Tab Label" value={service.label} onChange={(v) => onChange({ label: v })} />
            <div className="group">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Section Description</label>
                <textarea
                    rows={2}
                    value={service.description || ''}
                    onChange={(e) => onChange({ description: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-400 resize-none"
                />
            </div>
        </div>
    );
};

const ImageListManager = ({ images, onChange }: { images: string[], onChange: (v: string[]) => void }) => {
    const addImage = () => {
        onChange([...images, 'https://static.wixstatic.com/media/8fb0bb_0a3dd121529446a6be4f1dd429d55660~mv2.jpg/v1/fill/w_800,h_600,q_90/placeholder.jpg']);
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onChange(newImages);
    };

    const updateImage = (index: number, value: string) => {
        const newImages = [...images];
        newImages[index] = value;
        onChange(newImages);
    };

    const moveImage = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === images.length - 1) return;

        const newImages = [...images];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
        onChange(newImages);
    };

    return (
        <div className="space-y-3">
            {images.map((img, idx) => (
                <div key={idx} className="flex gap-2 items-start group bg-gray-50 p-2 rounded border border-gray-100 hover:border-gray-300 transition-colors">
                    <div className="flex flex-col gap-1 mt-1">
                        <button
                            onClick={() => moveImage(idx, 'up')}
                            disabled={idx === 0}
                            className="text-gray-400 hover:text-black disabled:opacity-20"
                        >
                            <ArrowUp size={12} />
                        </button>
                        <button
                            onClick={() => moveImage(idx, 'down')}
                            disabled={idx === images.length - 1}
                            className="text-gray-400 hover:text-black disabled:opacity-20"
                        >
                            <ArrowDown size={12} />
                        </button>
                    </div>

                    <div className="w-16 h-12 rounded border border-gray-200 overflow-hidden bg-gray-100 flex-shrink-0 relative group/img">
                        <img src={img} className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                        <div className="absolute inset-0 bg-black/10 group-hover/img:bg-transparent pointer-events-none" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <input
                            className="w-full text-xs p-2 border border-white bg-transparent focus:bg-white focus:border-gray-200 rounded font-mono text-gray-600 focus:text-black outline-none transition-all truncate hover:bg-white"
                            value={img}
                            onChange={e => updateImage(idx, e.target.value)}
                            placeholder="Image URL"
                        />
                    </div>

                    <button
                        onClick={() => removeImage(idx)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all ml-1"
                        title="Remove Image"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ))}
            <button onClick={addImage} className="w-full py-3 bg-white border border-dashed border-gray-300 text-gray-500 text-xs font-bold rounded hover:bg-gray-50 hover:text-black hover:border-gray-400 transition-all mt-2 flex items-center justify-center gap-2">
                <Plus size={14} /> Add Image
            </button>
        </div>
    );
};

const VideoListManager = ({ videos, onChange }: { videos: any[], onChange: (v: any[]) => void }) => {
    const addVideo = () => {
        onChange([...videos, { id: Date.now().toString(), title: "New Video", description: "Description", src: "" }]);
    };

    const removeVideo = (index: number) => {
        if (!window.confirm('Are you sure you want to delete this video?')) return;
        const newVideos = [...videos];
        newVideos.splice(index, 1);
        onChange(newVideos);
    };

    const updateVideo = (index: number, field: string, value: string) => {
        const newVideos = [...videos];
        newVideos[index] = { ...newVideos[index], [field]: value };
        onChange(newVideos);
    };

    const moveVideo = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === videos.length - 1) return;

        const newVideos = [...videos];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newVideos[index], newVideos[targetIndex]] = [newVideos[targetIndex], newVideos[index]];
        onChange(newVideos);
    };

    return (
        <div className="space-y-4">
            {videos.map((video, idx) => (
                <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg relative group transition-all hover:bg-white hover:shadow-md hover:border-gray-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-2">
                            <div className="flex flex-col justify-center gap-1 mr-2 text-gray-400">
                                <button onClick={() => moveVideo(idx, 'up')} disabled={idx === 0} className="hover:text-black disabled:opacity-20"><ArrowUp size={14} /></button>
                                <button onClick={() => moveVideo(idx, 'down')} disabled={idx === videos.length - 1} className="hover:text-black disabled:opacity-20"><ArrowDown size={14} /></button>
                            </div>
                            <span className="font-mono text-xs text-gray-400 font-bold pt-1">#{idx + 1}</span>
                            <h5 className="font-bold text-sm text-black pt-0.5">{video.title || 'Untitled Video'}</h5>
                        </div>
                        <button
                            onClick={() => removeVideo(idx)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-all"
                            title="Delete Video"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 pl-8">
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Title</label>
                            <input className="w-full text-xs p-2 border border-gray-200 rounded focus:border-black focus:ring-1 focus:ring-black outline-none" value={video.title} onChange={e => updateVideo(idx, 'title', e.target.value)} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Description</label>
                            <input className="w-full text-xs p-2 border border-gray-200 rounded focus:border-black focus:ring-1 focus:ring-black outline-none" value={video.description} onChange={e => updateVideo(idx, 'description', e.target.value)} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Video Source (MP4 URL)</label>
                            <input className="w-full text-xs p-2 border border-gray-200 rounded font-mono text-gray-600 focus:border-black focus:ring-1 focus:ring-black outline-none" value={video.src} onChange={e => updateVideo(idx, 'src', e.target.value)} />
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={addVideo} className="w-full py-3 bg-black text-white text-xs font-bold rounded shadow-lg hover:bg-gray-900 hover:scale-[1.01] transition-all flex items-center justify-center gap-2">
                <Plus size={16} /> Add Video
            </button>
        </div>
    );
};
