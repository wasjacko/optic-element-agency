
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, LogOut, Save, FileText, Check, Loader2, ArrowLeft, Eye, Smartphone, Monitor, Trash2, ArrowUp, ArrowDown, Plus, GripVertical, RotateCcw, AlertCircle, ChevronRight, Undo2, Redo2, History } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { getCMSContent, saveCMSContent } from '../../src/utils/cms-client';

// Preview Components
import { Hero } from '../Hero';
import { Brands } from '../Brands';
import { VideoSection } from '../VideoSection';
import { Projects } from '../Projects';
import { ProcessSprint } from '../ProcessSprint';
import { MissingElements } from '../MissingElements';
import { Testimonials } from '../Testimonials';
import { About } from '../About';
import { ContactPage } from '../ContactPage';
import { ProcessPage } from '../ProcessPage';
import { WorksPage } from '../WorksPage';

import { Footer } from '../Footer';


export const Dashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { logout } = useAuth();

    // CMS State
    const [content, setContent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [status, setStatus] = useState<string>('');
    const [activePage, setActivePage] = useState<string>('home');
    const [activeSection, setActiveSection] = useState<string>('hero');
    const [previewKey, setPreviewKey] = useState(0);

    const [isDirty, setIsDirty] = useState(false);
    const [toasts, setToasts] = useState<{ id: string, message: string, type: 'success' | 'error' | 'info' }[]>([]);

    // Undo/Redo/History States
    const [undoStack, setUndoStack] = useState<{ content: any; label: string; timestamp: number }[]>([]);
    const [redoStack, setRedoStack] = useState<{ content: any; label: string; timestamp: number }[]>([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // Refs for history throttling/grouping
    const lastPushTimeRef = useRef<number>(0);
    const lastActiveFieldRef = useRef<string>('');

    const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    // Live Theme Preview
    useEffect(() => {
        if (content?.theme) {
            const root = document.documentElement;
            root.style.setProperty('--color-primary', content.theme.primary);
            root.style.setProperty('--color-bg', content.theme.background);
            root.style.setProperty('--color-text', content.theme.text);
        }
    }, [content]);

    useEffect(() => {
        setIsLoading(true);

        const fetchAll = async () => {
            const data = await getCMSContent();
            if (data) {
                const mergeDefaults = (obj: any, defaults: any) => {
                    const res = { ...defaults, ...(obj || {}) };
                    for (const key in defaults) {
                        if (res[key] === undefined || res[key] === '') {
                            res[key] = defaults[key];
                        }
                    }
                    return res;
                };

                data.hero = mergeDefaults(data.hero, {
                    title: "VISUAL MATTER", phase1: "BRANDS WE", phase1Highlight: "SERVE", phase2: "NOT ON", phase2Highlight: "THE MENU", cta: "VIEW OUR WORK"
                });

                data.brands = mergeDefaults(data.brands, {
                    title: "Brands We Serve",
                    items: [
                        "Investor Lift", "The Passionate Few", "LGC I Power",
                        "The Coffe Co", "Devotion To Dogs", "The Maverick Entrepreneur",
                        "Exhort Else", "Mindcore", "Minico Shibin", "Unbroken Fitness Solution"
                    ]
                });

                data.sprint = mergeDefaults(data.sprint, {
                    title: "S.P.R.I.N.T", subtitle: "// our proven system", cta: "OUR DETAILLED PROCESS", steps: [
                        { id: "01", title: "STRATEGY", first: "S", rest: "TRATEGY", detail: "Define the Vision" },
                        { id: "02", title: "PLAN", first: "P", rest: "LAN", detail: "Map Out the Content" },
                        { id: "03", title: "ROLE", first: "R", rest: "OLE", detail: "Lights, Camera, Action." },
                        { id: "04", title: "INITIATE", first: "I", rest: "NITIATE", detail: "Edit + Polish" },
                        { id: "05", title: "NOTIFY", first: "N", rest: "OTIFY", detail: "Get Your Input" },
                        { id: "06", title: "TAKEOFF", first: "T", rest: "AKEOFF", detail: "Launch & Celebrate" }
                    ]
                });

                data.testimonials = mergeDefaults(data.testimonials, {
                    title: "VIDEO TESTIMONIALS", reviewsTitle: "CLIENT REVIEWS", reels: [
                        { id: "R_01", title: "OMAR ELATTAR", src: "https://www.youtube.com/embed/YN9mu2kWyXM" },
                        { id: "R_06", title: "DR. MATT", src: "https://www.youtube.com/embed/OMHS_XLydHo" },
                        { id: "R_07", title: "EUGENE NEAL", src: "https://www.youtube.com/embed/AajktDSe9DM" },
                        { id: "R_02", title: "MATTHEW WELSH", src: "https://www.youtube.com/embed/OT2uVJQd5Tw" },
                        { id: "R_03", title: "DR. CLARENCE LEE JR.", src: "https://www.youtube.com/embed/FoHSS4KiluE" },
                        { id: "R_08", title: "BRETT", src: "/assets/brett.mp4" }
                    ]
                });

                data.video = mergeDefaults(data.video, { title: "Showreel", videoUrl: "https://lightcoral-hawk-369217.hostingersite.com/wp-content/uploads/2025/06/Video-Optic-element.mp4" });

                data.projects = mergeDefaults(data.projects, {
                    title: "PROJECTS", cta: "VIEW OUR WORK", videos: [
                        { title: "PROPERTY 06", subtitle: "NUMERO 0001", src: "/assets/property-06.mp4" },
                        { title: "THE ONE", subtitle: "NUMERO 0002", src: "/assets/the-one.mp4" },
                        { title: "SEASON TRAILER", subtitle: "NUMERO 0003", src: "/assets/season-trailer.mp4" },
                        { title: "PROPERTY 07", subtitle: "NUMERO 0004", src: "/assets/property-07.mp4" },
                        { title: "MAFIA BOSS", subtitle: "NUMERO 0005", src: "/assets/ex-mafia.mp4" }
                    ]
                });

                data.about = mergeDefaults(data.about, { title: "Who We Are", teamCta: "JOIN THE TEAM", videoUrl: "https://video.wixstatic.com/video/8fb0bb_3101935948d84d248cbb6453b7ba87e8/720p/mp4/file.mp4" });
                data.contact = mergeDefaults(data.contact, { titleLine1: "SCHEDULE A", titleLine2: "CALL", titleLine3: "WITH", titleLine4: "SANTIAGO", description: "Book a call with our team. This call is to learn more about your business and if Optic Element is a good fit to help you achieve your goals." });
                data.processPage = mergeDefaults(data.processPage, { title: "Our Process", subtitle: "Our strategy to get you leads with content" });

                data.worksPage = mergeDefaults(data.worksPage, { cta: "SCHEDULE_CALL" });
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
                        }
                    ];
                }

                if (!data.lab) data.lab = { title: "THE LAB", bookingTitle: "Project Details", bookingSubtitle: "Tell us about your shoot requirements." };

                setContent(data);
                setUndoStack([]);
                setRedoStack([]);
                lastPushTimeRef.current = 0;
                lastActiveFieldRef.current = '';
            }



            setIsLoading(false);
        };

        fetchAll();
    }, []);

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

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            // Save: Cmd+S or Ctrl+S
            if ((e.metaKey || e.ctrlKey) && key === 's') {
                e.preventDefault();
                handleSave();
            }
            // Undo: Cmd+Z or Ctrl+Z
            if ((e.metaKey || e.ctrlKey) && key === 'z' && !e.shiftKey) {
                e.preventDefault();
                handleUndo();
            }
            // Redo: Cmd+Shift+Z or Ctrl+Shift+Z or Cmd+Y or Ctrl+Y
            if ((e.metaKey || e.ctrlKey) && (key === 'y' || (key === 'z' && e.shiftKey))) {
                e.preventDefault();
                handleRedo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [content, isDirty, undoStack, redoStack]);

    const handleSave = async () => {
        if (!content) return;
        setIsSaving(true);
        setStatus('Saving...');

        // 1. Save to Backend
        const res = await saveCMSContent(content);

        if (res.success) {
            setStatus('Syncing...');
            const freshData = await getCMSContent();
            if (freshData) {
                setContent(freshData);
                setIsDirty(false);
                addToast('Changes saved successfully!', 'success');
            }
        } else {
            setStatus('Error Saving');
            addToast('Failed to save changes.', 'error');
        }

        setIsSaving(false);
        setTimeout(() => setStatus(''), 2000);
    };

    const handleReset = async () => {
        setIsResetting(true);
        const freshData = await getCMSContent();
        if (freshData) {
            setContent(freshData);
            setIsDirty(false);
            setUndoStack([]);
            setRedoStack([]);
            lastPushTimeRef.current = 0;
            lastActiveFieldRef.current = '';
            addToast('Edits reverted.', 'info');
        } else {
            addToast('Failed to reset.', 'error');
        }
        setIsResetting(false);
    };

    // Helper to format history label
    const getHistoryLabel = (section: string, field: string): string => {
        const sec = section.charAt(0).toUpperCase() + section.slice(1);
        const fld = field
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
        return `Edit ${sec} > ${fld}`;
    };

    const updateField = (section: string, field: string, value: any) => {
        setIsDirty(true);

        if (content) {
            const now = Date.now();
            const timeDiff = now - lastPushTimeRef.current;
            const fieldKey = `${section}.${field}`;

            // If a different field is edited or more than 1.5 seconds have elapsed, record state
            if (lastActiveFieldRef.current !== fieldKey || timeDiff > 1500) {
                const clonedContent = JSON.parse(JSON.stringify(content));
                const label = getHistoryLabel(section, field);
                
                setUndoStack(prev => {
                    const next = [...prev, { content: clonedContent, label, timestamp: now }];
                    if (next.length > 50) next.shift(); // Limit to 50 items
                    return next;
                });
                setRedoStack([]); // Clear redo stack on new action
                
                lastPushTimeRef.current = now;
                lastActiveFieldRef.current = fieldKey;
            }
        }

        setContent((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleUndo = () => {
        if (undoStack.length === 0) return;
        const currentCloned = JSON.parse(JSON.stringify(content));
        
        setUndoStack(prev => {
            const next = [...prev];
            const previousEntry = next.pop();
            
            if (previousEntry) {
                const label = previousEntry.label;
                setRedoStack(rPrev => [...rPrev, { content: currentCloned, label, timestamp: Date.now() }]);
                
                setContent(previousEntry.content);
                setIsDirty(true);
                addToast(`Undo: ${previousEntry.label}`, 'info');
                
                lastPushTimeRef.current = 0;
                lastActiveFieldRef.current = '';
            }
            return next;
        });
    };

    const handleRedo = () => {
        if (redoStack.length === 0) return;
        const currentCloned = JSON.parse(JSON.stringify(content));
        
        setRedoStack(prev => {
            const next = [...prev];
            const nextEntry = next.pop();
            
            if (nextEntry) {
                const label = nextEntry.label;
                setUndoStack(uPrev => [...uPrev, { content: currentCloned, label, timestamp: Date.now() }]);
                
                setContent(nextEntry.content);
                setIsDirty(true);
                addToast(`Redo: ${nextEntry.label}`, 'info');
                
                lastPushTimeRef.current = 0;
                lastActiveFieldRef.current = '';
            }
            return next;
        });
    };

    const handleRestoreHistory = (index: number) => {
        if (index < 0 || index >= undoStack.length) return;
        const currentCloned = JSON.parse(JSON.stringify(content));
        const targetEntry = undoStack[index];
        
        setRedoStack(prev => [...prev, { content: currentCloned, label: `Restore from history`, timestamp: Date.now() }]);
        setUndoStack(prev => prev.slice(0, index));
        
        setContent(targetEntry.content);
        setIsDirty(true);
        addToast(`Restored to: ${targetEntry.label}`, 'success');
        setIsHistoryOpen(false);

        lastPushTimeRef.current = 0;
        lastActiveFieldRef.current = '';
    };

    if (isLoading || !content) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4">
                <Loader2 className="animate-spin text-gray-400" size={24} />
                {!content && !isLoading && (
                    <div className="text-center">
                        <p className="text-sm font-bold text-red-600 uppercase tracking-widest">Initialization Failed</p>
                        <p className="text-xs text-gray-500 mt-1">Unable to load website content. Please check your connection or restart the API.</p>
                        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-black text-white text-[10px] font-bold uppercase rounded-sm">Retry Sync</button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="admin-theme min-h-screen bg-gray-50 text-gray-900 flex flex-col h-screen overflow-hidden">
            <style>{`
                @font-face {
                    font-family: 'CustomArial';
                    src: url('/assets/ArialCE.ttf') format('truetype');
                    font-weight: normal;
                    font-style: normal;
                }
                .admin-theme *:not(#preview-wrapper):not(#preview-wrapper *) {
                    font-family: 'CustomArial', sans-serif !important;
                }
            `}</style>
            {/* Top Navigation */}
            <header className="bg-white border-b border-gray-200 z-30 shrink-0">

                <div className="w-full px-10 md:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-4 overflow-x-auto custom-scrollbar">
                        <span className="font-bold text-lg tracking-tight mr-4 shrink-0">OPTIC ELEMENT</span>

                        <div className="flex items-center gap-1 shrink-0">
                            <NavTab active={activePage === 'home'} onClick={() => { setActivePage('home'); setActiveSection('hero'); }} label="Home" />
                            <NavTab active={activePage === 'about'} onClick={() => { setActivePage('about'); setActiveSection('header'); }} label="About" />
                            <NavTab active={activePage === 'process'} onClick={() => { setActivePage('process'); setActiveSection('header'); }} label="Process" />
                            <NavTab active={activePage === 'works'} onClick={() => { setActivePage('works'); setActiveSection('gallery'); }} label="Works" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                        <div className="flex items-center gap-2 relative">
                            {isDirty && (
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-full border border-orange-200"
                                >
                                    Unsaved Changes
                                </motion.div>
                            )}

                            {/* Undo Button */}
                            <button
                                type="button"
                                onClick={handleUndo}
                                disabled={undoStack.length === 0}
                                className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:hover:bg-white"
                                title="Undo (Cmd+Z)"
                            >
                                <Undo2 size={13} />
                                <span>Undo</span>
                            </button>

                            {/* Redo Button */}
                            <button
                                type="button"
                                onClick={handleRedo}
                                disabled={redoStack.length === 0}
                                className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:hover:bg-white"
                                title="Redo (Cmd+Shift+Z)"
                            >
                                <Redo2 size={13} />
                                <span>Redo</span>
                            </button>

                            {/* History Dropdown Trigger */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                                    className={`bg-white hover:bg-gray-100 text-gray-700 border ${isHistoryOpen ? 'border-black' : 'border-gray-200'} px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all`}
                                    title="View Edit History"
                                >
                                    <History size={13} />
                                    <span>History</span>
                                    {undoStack.length > 0 && (
                                        <span className="bg-gray-900 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                                            {undoStack.length}
                                        </span>
                                    )}
                                </button>

                                {/* Overlay to close dropdown on click outside */}
                                {isHistoryOpen && (
                                    <div 
                                        className="fixed inset-0 z-40 bg-transparent" 
                                        onClick={() => setIsHistoryOpen(false)} 
                                    />
                                )}

                                {/* Dropdown popover */}
                                {isHistoryOpen && (
                                    <div className="absolute right-0 top-10 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[350px]">
                                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Edit History</span>
                                            <button 
                                                type="button"
                                                onClick={() => setIsHistoryOpen(false)}
                                                className="text-xs font-bold text-gray-400 hover:text-black"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto divide-y divide-gray-50 custom-scrollbar max-h-[250px]">
                                            {undoStack.length === 0 ? (
                                                <div className="px-4 py-6 text-center text-xs text-gray-400">
                                                    No edit history yet.
                                                </div>
                                            ) : (
                                                [...undoStack].reverse().map((entry, revIdx) => {
                                                    const originalIdx = undoStack.length - 1 - revIdx;
                                                    const timeString = new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={entry.timestamp + '-' + originalIdx}
                                                            onClick={() => handleRestoreHistory(originalIdx)}
                                                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors flex flex-col gap-0.5 group"
                                                        >
                                                            <span className="text-xs font-medium text-gray-700 group-hover:text-black">{entry.label}</span>
                                                            <span className="text-[9px] text-gray-400">{timeString}</span>
                                                        </button>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Revert Changes Button */}
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={isResetting || isSaving || !isDirty}
                                className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-30"
                                title="Revert all changes to last saved version"
                            >
                                {isResetting ? <Loader2 size={13} className="animate-spin" /> : <RotateCcw size={13} />}
                                <span>{isResetting ? 'Resetting...' : 'Revert All'}</span>
                            </button>

                            {/* Save Button */}
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving || !isDirty}
                                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg active:scale-95 ${isDirty ? 'bg-black text-white shadow-black/20' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}`}
                            >
                                {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                        <div className="h-4 w-[1px] bg-gray-200 mx-2"></div>
                        <button onClick={() => { if (isDirty && !window.confirm('Unsaved changes will be lost. Log Out?')) return; logout(); }} className="text-xs font-medium text-gray-500 hover:text-black hover:underline px-2 py-1">Log Out</button>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">

                {/* LEFT: Editor Sidebar */}
                <div className="w-[500px] bg-gray-50 border-r border-gray-200 flex flex-col overflow-y-auto shrink-0 z-20">

                    {/* Navigation Tabs */}

                    {/* Navigation Tabs - Level 2: Home Sections (Only visible if Home is active) */}
                    {activePage === 'home' && (
                        <div className="border-b border-gray-200 bg-gray-50 p-2">
                            <div className="px-2 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Sections</div>
                            <div className="grid grid-cols-2 gap-2">
                                <SubNavTab active={activeSection === 'hero'} onClick={() => setActiveSection('hero')} label="Hero" />
                                <SubNavTab active={activeSection === 'brands'} onClick={() => setActiveSection('brands')} label="Brands" />
                                <SubNavTab active={activeSection === 'sprint'} onClick={() => setActiveSection('sprint')} label="Sprint" />
                                <SubNavTab active={activeSection === 'missingElements'} onClick={() => setActiveSection('missingElements')} label="Elements" />
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
                                <SubNavTab active={activeSection === 'calendar'} onClick={() => setActiveSection('calendar')} label="Calendar API" />
                            </div>
                        </div>
                    )}



                    {/* Breadcrumbs */}
                    <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] z-20">
                        <span className="text-black">{activePage}</span>
                        <ChevronRight size={10} className="text-gray-300" />
                        <span className="text-gray-900">{activeSection}</span>
                    </div>

                    {/* Edit Form */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                        {/* Dynamic Background Wrapper to match preview */}
                        <motion.div 
                            key={`${activePage}-${activeSection}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="min-h-full p-6 space-y-8 pb-32 transition-colors duration-500"
                            style={{ 
                                backgroundColor: '#f9fafb' 
                            }}
                        >
                            <div style={{ color: '#000000' }} className="space-y-8">

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
                                    <ColorInput label="Section Title Text" value={content.brands.titleColor} onChange={(v) => updateField('brands', 'titleColor', v)} />
                                    <ColorInput label="KPI Numbers" value={content.brands.kpiNumberColor} onChange={(v) => updateField('brands', 'kpiNumberColor', v)} />
                                    <ColorInput label="KPI Labels" value={content.brands.kpiLabelColor} onChange={(v) => updateField('brands', 'kpiLabelColor', v)} />
                                </div>

                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 mt-8">Brands Titles & Sections</h3>
                                <InputGroup label="Section Title" value={content.brands.title} onChange={(v) => updateField('brands', 'title', v)} />

                                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 block mb-3">Brand Logos</label>
                                    <ImageListManager 
                                        images={content.brands.logos || [
                                            "/assets/brands/brand_1.png", "/assets/brands/brand_2.png", 
                                            "/assets/brands/brand_3.png", "/assets/brands/brand_4.png", 
                                            "/assets/brands/brand_5.png", "/assets/brands/brand_6.png", 
                                            "/assets/brands/brand_7.png"
                                        ]} 
                                        onChange={(newLogos) => updateField('brands', 'logos', newLogos)} 
                                    />
                                </div>

                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-8 mb-4">KPIs</h3>
                                <div className="space-y-4">
                                    {(content.brands.kpis || [
                                        { number: 1050, prefix: "", suffix: "+", label: "PROJECTS", desc: "Delivered Globally" },
                                        { number: 4, prefix: "$", suffix: "M+", label: "CLIENT CASH COLLECTED", desc: "Creative Excellence" },
                                        { number: 3, prefix: "", suffix: "x", label: "CONVERSION RATE", desc: "Driven by Video" }
                                    ]).map((kpi: any, idx: number) => (
                                        <div key={idx} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                            <div className="text-[10px] font-bold uppercase text-gray-400 mb-3 flex items-center justify-between">
                                                <span>KPI {idx + 1}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                <InputGroup label="Number" value={String(kpi.number)} onChange={(v) => {
                                                    const newKpis = [...(content.brands.kpis || [
                                                        { number: 1050, prefix: "", suffix: "+", label: "PROJECTS", desc: "Delivered Globally" },
                                                        { number: 4, prefix: "$", suffix: "M+", label: "CLIENT CASH COLLECTED", desc: "Creative Excellence" },
                                                        { number: 3, prefix: "", suffix: "x", label: "CONVERSION RATE", desc: "Driven by Video" }
                                                    ])];
                                                    newKpis[idx].number = Number(v);
                                                    updateField('brands', 'kpis', newKpis);
                                                }} />
                                                <InputGroup label="Prefix (e.g. $)" value={kpi.prefix} onChange={(v) => {
                                                    const newKpis = [...(content.brands.kpis || [
                                                        { number: 1050, prefix: "", suffix: "+", label: "PROJECTS", desc: "Delivered Globally" },
                                                        { number: 4, prefix: "$", suffix: "M+", label: "CLIENT CASH COLLECTED", desc: "Creative Excellence" },
                                                        { number: 3, prefix: "", suffix: "x", label: "CONVERSION RATE", desc: "Driven by Video" }
                                                    ])];
                                                    newKpis[idx].prefix = v;
                                                    updateField('brands', 'kpis', newKpis);
                                                }} />
                                                <InputGroup label="Suffix (e.g. +)" value={kpi.suffix} onChange={(v) => {
                                                    const newKpis = [...(content.brands.kpis || [
                                                        { number: 1050, prefix: "", suffix: "+", label: "PROJECTS", desc: "Delivered Globally" },
                                                        { number: 4, prefix: "$", suffix: "M+", label: "CLIENT CASH COLLECTED", desc: "Creative Excellence" },
                                                        { number: 3, prefix: "", suffix: "x", label: "CONVERSION RATE", desc: "Driven by Video" }
                                                    ])];
                                                    newKpis[idx].suffix = v;
                                                    updateField('brands', 'kpis', newKpis);
                                                }} />
                                                <InputGroup label="Label" value={kpi.label} onChange={(v) => {
                                                    const newKpis = [...(content.brands.kpis || [
                                                        { number: 1050, prefix: "", suffix: "+", label: "PROJECTS", desc: "Delivered Globally" },
                                                        { number: 4, prefix: "$", suffix: "M+", label: "CLIENT CASH COLLECTED", desc: "Creative Excellence" },
                                                        { number: 3, prefix: "", suffix: "x", label: "CONVERSION RATE", desc: "Driven by Video" }
                                                    ])];
                                                    newKpis[idx].label = v;
                                                    updateField('brands', 'kpis', newKpis);
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activePage === 'home' && activeSection === 'works' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Projects Styling</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <ColorInput label="Background" value={content.projects?.backgroundColor} onChange={(v) => updateField('projects', 'backgroundColor', v)} />
                                    <ColorInput label="Section Title" value={content.projects?.titleColor} onChange={(v) => updateField('projects', 'titleColor', v)} />
                                    <ColorInput label="Text" value={content.projects?.textColor} onChange={(v) => updateField('projects', 'textColor', v)} />
                                    <ColorInput label="Accent" value={content.projects?.accentColor} onChange={(v) => updateField('projects', 'accentColor', v)} />
                                    <ColorInput label="Button Bg" value={content.projects?.ctaBg} onChange={(v) => updateField('projects', 'ctaBg', v)} />
                                    <ColorInput label="Button Text" value={content.projects?.ctaText} onChange={(v) => updateField('projects', 'ctaText', v)} />
                                </div>

                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 mt-8">Content</h3>
                                <InputGroup label="Section Title" value={content.projects?.title} onChange={(v) => updateField('projects', 'title', v)} />
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 mt-8">Projects Videos</h3>
                                <VideoListManager
                                    videos={content.projects?.videos || []}
                                    onChange={(v) => updateField('projects', 'videos', v)}
                                />
                                <InputGroup label="CTA Button Text" value={content.projects?.cta} onChange={(v) => updateField('projects', 'cta', v)} />
                            </div>
                        )}

                        {activePage === 'home' && activeSection === 'sprint' && content?.sprint && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300 pb-16">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Sprint Styling</h3>
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <ColorInput label="Background" value={content.sprint.backgroundColor} onChange={(v) => updateField('sprint', 'backgroundColor', v)} />
                                    <ColorInput label="Title Color" value={content.sprint.titleColor} onChange={(v) => updateField('sprint', 'titleColor', v)} />
                                    <ColorInput label="Subtitle Color" value={content.sprint.subtitleColor} onChange={(v) => updateField('sprint', 'subtitleColor', v)} />
                                    <ColorInput label="Text Color" value={content.sprint.textColor} onChange={(v) => updateField('sprint', 'textColor', v)} />
                                    <ColorInput label="Accent Indicator" value={content.sprint.accentColor} onChange={(v) => updateField('sprint', 'accentColor', v)} />
                                    <ColorInput label="Button Bg" value={content.sprint.ctaBg} onChange={(v) => updateField('sprint', 'ctaBg', v)} />
                                    <ColorInput label="Button Text" value={content.sprint.ctaText} onChange={(v) => updateField('sprint', 'ctaText', v)} />
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Sprint Configuration</h3>
                                <InputGroup label="Main Title" value={content.sprint.title} onChange={(v) => updateField('sprint', 'title', v)} />
                                <InputGroup label="Subtitle" value={content.sprint.subtitle} onChange={(v) => updateField('sprint', 'subtitle', v)} />
                                <InputGroup label="CTA Button Text" value={content.sprint.cta} onChange={(v) => updateField('sprint', 'cta', v)} />

                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-8 mb-4">Sprint Steps</h3>
                                <div className="space-y-4">
                                    {(content.sprint.steps || []).map((step: any, idx: number) => (
                                        <div key={idx} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                            <div className="text-[10px] font-bold uppercase text-gray-400 mb-3 flex items-center justify-between">
                                                <span>Step {idx + 1} - {step.id}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                <InputGroup label="Title (Full)" value={step.title} onChange={(v) => {
                                                    const newSteps = [...content.sprint.steps];
                                                    newSteps[idx].title = v;
                                                    updateField('sprint', 'steps', newSteps);
                                                }} />
                                                <InputGroup label="Letter Initial" value={step.first} onChange={(v) => {
                                                    const newSteps = [...content.sprint.steps];
                                                    newSteps[idx].first = v;
                                                    updateField('sprint', 'steps', newSteps);
                                                }} />
                                                <InputGroup label="Remaining Letters" value={step.rest} onChange={(v) => {
                                                    const newSteps = [...content.sprint.steps];
                                                    newSteps[idx].rest = v;
                                                    updateField('sprint', 'steps', newSteps);
                                                }} />
                                            </div>
                                            <InputGroup label="Description" value={step.detail} onChange={(v) => {
                                                const newSteps = [...content.sprint.steps];
                                                newSteps[idx].detail = v;
                                                updateField('sprint', 'steps', newSteps);
                                            }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activePage === 'home' && activeSection === 'missingElements' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300 pb-16">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Elements Styling</h3>
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <ColorInput label="Background" value={content.missingElements?.backgroundColor} onChange={(v) => updateField('missingElements', 'backgroundColor', v)} />
                                    <ColorInput label="Card Lines" value={content.missingElements?.cardBg} onChange={(v) => updateField('missingElements', 'cardBg', v)} />
                                    <ColorInput label="Accent" value={content.missingElements?.accentColor} onChange={(v) => updateField('missingElements', 'accentColor', v)} />
                                    <ColorInput label="Text" value={content.missingElements?.textColor} onChange={(v) => updateField('missingElements', 'textColor', v)} />
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Elements Editor</h3>
                                <div className="p-4 bg-gray-50 border border-gray-100 rounded text-sm text-gray-500 mb-4">
                                    Modify the elements grid.
                                </div>
                                <div className="space-y-6">
                                    {(content?.missingElements?.items || content?.missingElements || []).map((el: any, idx: number) => (
                                        <div key={idx} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm relative group">
                                            <div className="text-[10px] font-bold uppercase text-gray-400 mb-3 flex items-center justify-between">
                                                <span>Element {idx + 1}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                <InputGroup label="ID (e.g. 20)" value={el.id} onChange={(v) => {
                                                    const newElements = [...(content.missingElements?.items || content.missingElements || [])];
                                                    newElements[idx] = { ...newElements[idx], id: v };
                                                    updateField('missingElements', 'items', newElements);
                                                }} />
                                                <InputGroup label="Symbol (e.g. oE)" value={el.symbol} onChange={(v) => {
                                                    const newElements = [...(content.missingElements?.items || content.missingElements || [])];
                                                    newElements[idx] = { ...newElements[idx], symbol: v };
                                                    updateField('missingElements', 'items', newElements);
                                                }} />
                                                <InputGroup label="Name" value={el.name} onChange={(v) => {
                                                    const newElements = [...(content.missingElements?.items || content.missingElements || [])];
                                                    newElements[idx] = { ...newElements[idx], name: v };
                                                    updateField('missingElements', 'items', newElements);
                                                }} />
                                                <InputGroup label="Role" value={el.role} onChange={(v) => {
                                                    const newElements = [...(content.missingElements?.items || content.missingElements || [])];
                                                    newElements[idx] = { ...newElements[idx], role: v };
                                                    updateField('missingElements', 'items', newElements);
                                                }} />
                                            </div>
                                            <InputGroup label="Description" value={el.desc} onChange={(v) => {
                                                const newElements = [...(content.missingElements?.items || content.missingElements || [])];
                                                newElements[idx] = { ...newElements[idx], desc: v };
                                                updateField('missingElements', 'items', newElements);
                                            }} />
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            const currentEls = content?.missingElements?.items || content?.missingElements || [];
                                            const newElements = [...currentEls, { id: "00", symbol: "Xx", name: "New Element", role: "Role", desc: "Description here" }];
                                            updateField('missingElements', 'items', newElements);
                                        }}
                                        className="w-full py-3 bg-white border border-dashed border-gray-300 text-gray-500 text-xs font-bold rounded hover:bg-gray-50 hover:text-black hover:border-gray-400 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus size={14} /> Add Element
                                    </button>
                                </div>
                            </div>
                        )}

                        {activePage === 'home' && activeSection === 'testimonials' && content?.testimonials && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Testimonials Styling</h3>
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <ColorInput label="Background" value={content.testimonials?.backgroundColor} onChange={(v) => updateField('testimonials', 'backgroundColor', v)} />
                                    <ColorInput label="Text" value={content.testimonials?.titleColor} onChange={(v) => updateField('testimonials', 'titleColor', v)} />
                                    <ColorInput label="Accent Blur" value={content.testimonials?.accentColor} onChange={(v) => updateField('testimonials', 'accentColor', v)} />
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Testimonials Configuration</h3>
                                <InputGroup label="Main Title" value={content.testimonials.title} onChange={(v) => updateField('testimonials', 'title', v)} />
                                <InputGroup label="Reviews Subtitle" value={content.testimonials.reviewsTitle} onChange={(v) => updateField('testimonials', 'reviewsTitle', v)} />
                                
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 mt-8">Video Testimonials (Max 5)</h3>
                                <div className="p-4 bg-gray-50 border border-gray-100 rounded text-sm text-gray-500 mb-4">
                                    Manage the vertical video slider for testimonials.
                                </div>
                                <VideoListManager
                                    videos={content.testimonials.reels || []}
                                    onChange={(v) => {
                                        if (v.length > 5) {
                                            addToast("Maximum 5 testimonial videos allowed.", "info");
                                            return;
                                        }
                                        updateField('testimonials', 'reels', v);
                                    }}
                                />
                                <div className="p-4 bg-gray-50 border border-gray-100 rounded text-sm text-gray-500 mb-4">
                                    Manage the reviews displayed on the site directly.
                                </div>
                                <ReviewListManager
                                    reviews={content.testimonials.reviews || content.reviews || []}
                                    onChange={(v) => updateField('testimonials', 'reviews', v)}
                                />
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
                                            <ColorInput label="Accent" value={content?.about?.accentColor || '#EF5304'} onChange={(v) => updateField('about', 'accentColor', v)} />
                                        </div>

                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Header Configuration</h3>
                                        <InputGroup label="Page Title" value={content?.about?.title} onChange={(v) => updateField('about', 'title', v)} />
                                    </>
                                )}
                                {activeSection === 'team' && (
                                    <>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Team Grid</h3>
                                        <div className="p-4 bg-gray-50 border border-gray-100 rounded text-sm text-gray-500 mb-6">
                                            Manage your team members and the main quote here.
                                        </div>
                                        
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 mt-8">Styling</h3>
                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <ColorInput label="Background" value={content?.about?.teamBgColor || '#000000'} onChange={(v) => updateField('about', 'teamBgColor', v)} />
                                            <ColorInput label="Text Color" value={content?.about?.teamTextColor || '#ffffff'} onChange={(v) => updateField('about', 'teamTextColor', v)} />
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <InputGroup label="Section Title" value={content?.about?.teamTitle} onChange={(v) => updateField('about', 'teamTitle', v)} />
                                            <InputGroup label="Main Quote" value={content?.about?.teamQuote} onChange={(v) => updateField('about', 'teamQuote', v)} />
                                            <InputGroup label="Team CTA Button" value={content?.about?.teamCta} onChange={(v) => updateField('about', 'teamCta', v)} />
                                        </div>
                                        
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 mt-8">Team Members Roster</h3>
                                        <TeamListManager
                                            members={content?.about?.teamMembers || []}
                                            onChange={(v) => updateField('about', 'teamMembers', v)}
                                        />
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
                                            <ColorInput label="Accent" value={content?.processPage?.accentColor || '#EF5304'} onChange={(v) => updateField('processPage', 'accentColor', v)} />
                                        </div>

                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Header Configuration</h3>
                                        <InputGroup label="Page Title" value={content?.processPage?.title} onChange={(v) => updateField('processPage', 'title', v)} />
                                        <InputGroup label="Subtitle" value={content?.processPage?.subtitle} onChange={(v) => updateField('processPage', 'subtitle', v)} />
                                    </>
                                )}
                                {activeSection === 'timeline' && (
                                    <div className="p-4 bg-gray-50 border border-gray-100 rounded flex gap-4 text-sm text-gray-600 border-l-4 border-l-orange-500">
                                        <div className="mt-0.5"><AlertCircle size={16} /></div>
                                        <div>
                                            <p className="font-bold mb-1">Timeline is NOT customizable</p>
                                            <p>The timeline steps and their complex scroll animations are managed directly in the code to ensure optimal performance and visual stability.</p>
                                        </div>
                                    </div>
                                )}
                                {activeSection === 'cta' && (
                                    <>
                                        <div className="p-4 bg-gray-50 border border-gray-100 rounded text-sm text-gray-500 mb-6">
                                            The footer CTA redirects to the contact page. Customize the button wording below.
                                        </div>
                                        <InputGroup label="CTA Button Text" value={content?.processPage?.ctaText} onChange={(v) => updateField('processPage', 'ctaText', v)} />
                                    </>
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
                                            <ColorInput label="Accent" value={content?.worksPage?.accentColor || '#EF5304'} onChange={(v) => updateField('worksPage', 'accentColor', v)} />
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


                                        </div>
                                    </>
                                )}
                                {activeSection === 'cta' && (
                                    <>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Footer Styling</h3>
                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <ColorInput label="Footer Background" value={content?.worksPage?.footerBgColor || 'transparent'} onChange={(v) => updateField('worksPage', 'footerBgColor', v)} />
                                            <ColorInput label="Button Background" value={content?.worksPage?.ctaBgColor || '#000000'} onChange={(v) => updateField('worksPage', 'ctaBgColor', v)} />
                                            <ColorInput label="Button Text" value={content?.worksPage?.ctaTextColor || '#ffffff'} onChange={(v) => updateField('worksPage', 'ctaTextColor', v)} />
                                            <ColorInput label="Button Hover" value={content?.worksPage?.ctaHoverColor || '#EF5304'} onChange={(v) => updateField('worksPage', 'ctaHoverColor', v)} />
                                        </div>
                                        
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
                                            <ColorInput label="Accent" value={content?.contact?.accentColor || '#EF5304'} onChange={(v) => updateField('contact', 'accentColor', v)} />
                                        </div>

                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Intro Content</h3>
                                        <InputGroup label="Title Line 1" value={content?.contact?.titleLine1} onChange={(v) => updateField('contact', 'titleLine1', v)} />
                                        <InputGroup label="Title Line 2" value={content?.contact?.titleLine2} onChange={(v) => updateField('contact', 'titleLine2', v)} />
                                        <InputGroup label="Title Line 3 (Accent)" value={content?.contact?.titleLine3} onChange={(v) => updateField('contact', 'titleLine3', v)} />
                                        <InputGroup label="Title Line 4 (Accent)" value={content?.contact?.titleLine4} onChange={(v) => updateField('contact', 'titleLine4', v)} />
                                        <InputGroup label="Description" value={content?.contact?.description} onChange={(v) => updateField('contact', 'description', v)} />
                                    </>
                                )}
                                {activeSection === 'calendar' && (
                                    <>
                                        <div className="p-4 bg-gray-50 border border-gray-100 rounded text-sm text-gray-500 mb-6">
                                            The booking widget is embedded via an iframe. Drop your scheduling URL below (GoHighLevel, Calendly, Typeform, etc).
                                        </div>
                                        <InputGroup label="Calendar Booking URL" value={content?.contact?.calendarUrl} onChange={(v) => updateField('contact', 'calendarUrl', v)} />
                                    </>
                                )}
                            </div>
                        )}


                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* RIGHT: Live Preview or Tools */}
                <div className="flex-1 bg-[#F3F4F6] flex flex-col relative overflow-hidden items-center justify-center p-0 md:p-6 transition-all duration-500">
                    


                    {/* Preview Container */}
                        <div id="preview-wrapper" className="bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] overflow-hidden relative border border-gray-200 flex flex-col w-full h-full md:rounded-xl">
                            <div key={previewKey} className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar scroll-smooth" id="preview-container" style={{ fontFamily: "'Tactic Sans', system-ui, -apple-system, sans-serif" }}>
                                {activePage === 'home' && (
                                    <>
                                        {activeSection === 'hero' && (
                                            <div id="preview-hero" className="w-full min-h-full flex flex-col justify-center">
                                                <Hero data={content?.hero} theme={content?.theme} onContactClick={() => { }} onIntroComplete={() => { }} />
                                            </div>
                                        )}

                                        {activeSection === 'brands' && (
                                            <div id="preview-brands" className="w-full min-h-full bg-black flex flex-col justify-center">
                                                <Brands title={content?.brands?.title} data={content} />
                                            </div>
                                        )}

                                        {activeSection === 'video' && (
                                            <div id="preview-video" className="w-full min-h-full bg-black flex flex-col justify-center">
                                                <VideoSection data={content?.video} />
                                            </div>
                                        )}

                                        {activeSection === 'sprint' && (
                                            <div id="preview-sprint" className="w-full min-h-full bg-white flex flex-col justify-center">
                                                <ProcessSprint data={content?.sprint} />
                                            </div>
                                        )}

                                        {activeSection === 'missingElements' && (
                                            <div id="preview-missingElements" className="w-full min-h-full bg-white flex flex-col justify-center">
                                                <MissingElements data={content?.missingElements} />
                                            </div>
                                        )}

                                        {activeSection === 'works' && (
                                            <div id="preview-works" className="w-full min-h-full bg-white flex flex-col justify-center">
                                                <Projects title={content?.projects?.title} data={content} />
                                            </div>
                                        )}

                                        {activeSection === 'testimonials' && (
                                            <div id="preview-testimonials" className="w-full min-h-full bg-white flex flex-col justify-center">
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



                                {activePage === 'contact' && (
                                    <div id="preview-contact" className="opacity-100 w-full h-full">
                                        <div className="bg-white relative w-full h-full">
                                            <ContactPage onBack={() => { }} data={content?.contact} activeSection={activeSection} />
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                </div>

            </main >

            {/* Toast System */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 40, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={`px-6 py-3 rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] flex items-center gap-3 backdrop-blur-md border pointer-events-auto ${
                                toast.type === 'success' ? 'bg-black text-white border-white/10' :
                                toast.type === 'error' ? 'bg-red-600 text-white border-red-500' :
                                'bg-white text-black border-gray-200'
                            }`}
                        >
                            {toast.type === 'success' ? <Check size={16} className="text-green-400" /> : <AlertCircle size={16} />}
                            <span className="text-[11px] font-bold uppercase tracking-widest leading-none pt-0.5">{toast.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
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



const NavTab = ({ active, onClick, label, badge }: { active: boolean, onClick: () => void, label: string, badge?: number }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${active
            ? 'bg-black text-white'
            : 'text-gray-600 hover:bg-gray-100 hover:text-black'
            }`}
    >
        {label}
        {badge !== undefined && badge > 0 && (
            <span className="w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full text-[10px] font-bold animate-pulse">
                {badge > 9 ? '9+' : badge}
            </span>
        )}
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
                            <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Video Source (MP4 URL)</label>
                            <input className="w-full text-xs p-2 border border-gray-200 rounded font-mono text-gray-600 focus:border-black focus:ring-1 focus:ring-black outline-none" value={video.src} onChange={e => updateVideo(idx, 'src', e.target.value)} />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">YouTube Embed URL (Optional, overrides MP4 in modal)</label>
                            <input className="w-full text-xs p-2 border border-gray-200 rounded font-mono text-gray-600 focus:border-black focus:ring-1 focus:ring-black outline-none" value={video.youtubeUrl || ''} onChange={e => updateVideo(idx, 'youtubeUrl', e.target.value)} />
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

// ===================================
// REVIEW LIST MANAGER
// ===================================

const ReviewListManager = ({ reviews, onChange }: { reviews: any[], onChange: (v: any[]) => void }) => {
    // Hardcoded base reviews as default if empty
    const defaultReviews = [
        {
            id: "cfcd208495d565ef66e7dff9f98764da_1",
            author: "Kalvin Payne",
            avatar: "https://lh3.googleusercontent.com/a-/ALV-UjWP6ryeeN9rSTEVP8qA3wkFTs3cgwo6abjzNNte4Bg8BqJvzQdL=w64-h64-c-rp-mo-br100",
            rating: 5,
            text: "oE is always producing incredible content that is both engaging and conveys the exact brand on screen. Love seeing oE art!",
            date: "3 months ago"
        },
        {
            id: "cfcd208495d565ef66e7dff9f98764da_2",
            author: "Francine Dinh",
            avatar: "https://lh3.googleusercontent.com/a-/ALV-UjVyyU4fohKO-vijZcPQHM4wdWl98l1BmxFDnwuMAWTq9ow5RA57=w64-h64-c-rp-mo-br100",
            rating: 5,
            text: "Working with Optic Element has been one of the best decisions I’ve made for my business! Being someone new to video, they were very patient with me and helped me create content that brought in new eyes and clients...",
            date: "1 year ago"
        },
        {
            id: "cfcd208495d565ef66e7dff9f98764da_3",
            author: "SD Complete",
            avatar: "https://lh3.googleusercontent.com/a-/ALV-UjVzuCgF_SPj6UflJUt6jK5fwhveglA_qGSisFThP9zpDRm4zuk=w64-h64-c-rp-mo-br100",
            rating: 5,
            text: "I couldn’t be more happy with this epic team! My entire staff came into the studio to do videos for our website. Optic Elements CRUSHED It!!!! They really care about your finished product! Attention to details...",
            date: "1 year ago"
        },
        {
            id: "cfcd208495d565ef66e7dff9f98764da_4",
            author: "Spencer Vann",
            avatar: "https://lh3.googleusercontent.com/a-/ALV-UjVc7WUAgnOQBaqK-Fk_VkZ9eyppcvhNVVRy3NvdkSNwZaka1Z9i=w64-h64-c-rp-mo-br100",
            rating: 5,
            text: "I had the privilege to work with Santiago and the team at Optic Element for about a year as they created hundreds of pieces of content for my business. They did a phenomenal job, both from final results...",
            date: "1 year ago"
        },
        {
            id: "cfcd208495d565ef66e7dff9f98764da_5",
            author: "Dharimar Vazquez",
            avatar: "https://lh3.googleusercontent.com/a-/ALV-UjWAFYaWwrPG-Jq1vJUQanX0SoWaVBAg7DEpWDjSM0B_hmVoKQ8=w64-h64-c-rp-mo-br100",
            rating: 5,
            text: "Absolutely LOVE the oE Culture and Team!",
            date: "1 year ago"
        },
        {
            id: "cfcd208495d565ef66e7dff9f98764da_6",
            author: "Jesus Salazar",
            avatar: "https://lh3.googleusercontent.com/a-/ALV-UjXeam_PHtzxzI5Ou2SHRPI0UAvpQ9Uc2omlVfM8IHGKVIXw0z4=w64-h64-c-rp-mo-br100",
            rating: 5,
            text: "They helped me grow my real estate business entirely! Santiago, Cesar, Ryan, Dez and the rest of the team helped me grow my community on social media and really engage with my target audience.",
            date: "1 year ago"
        }
    ];

    const currentReviews = reviews?.length > 0 ? reviews : defaultReviews;

    const addReview = () => {
        onChange([...currentReviews, {
            id: Date.now().toString(),
            author: "New Client",
            avatar: "https://lh3.googleusercontent.com/a-/ALV-UjWP6ryeeN9rSTEVP8qA3wkFTs3cgwo6abjzNNte4Bg8BqJvzQdL=w64-h64-c-rp-mo-br100",
            rating: 5,
            text: "Amazing experience! The videos are top tier.",
            date: "1 day ago"
        }]);
    };

    const removeReview = (index: number) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        const newReviews = [...currentReviews];
        newReviews.splice(index, 1);
        onChange(newReviews);
    };

    const updateReview = (index: number, field: string, value: string | number) => {
        const newReviews = [...currentReviews];
        newReviews[index] = { ...newReviews[index], [field]: value };
        onChange(newReviews);
    };

    const moveReview = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === currentReviews.length - 1) return;

        const newReviews = [...currentReviews];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newReviews[index], newReviews[targetIndex]] = [newReviews[targetIndex], newReviews[index]];
        onChange(newReviews);
    };

    return (
        <div className="space-y-4">
            {currentReviews.map((review, idx) => (
                <div key={review.id || idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg relative group transition-all hover:bg-white hover:shadow-md hover:border-gray-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-2">
                            <div className="flex flex-col justify-center gap-1 mr-2 text-gray-400">
                                <button onClick={() => moveReview(idx, 'up')} disabled={idx === 0} className="hover:text-black disabled:opacity-20"><ArrowUp size={14} /></button>
                                <button onClick={() => moveReview(idx, 'down')} disabled={idx === currentReviews.length - 1} className="hover:text-black disabled:opacity-20"><ArrowDown size={14} /></button>
                            </div>
                            <span className="font-mono text-xs text-gray-400 font-bold pt-1">#{idx + 1}</span>
                            <h5 className="font-bold text-sm text-black pt-0.5">{review.author || 'Unnamed'}</h5>
                        </div>
                        <button
                            onClick={() => removeReview(idx)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-all"
                            title="Delete Review"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 pl-8">
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Author Name</label>
                            <input className="w-full text-xs p-2 border border-gray-200 rounded focus:border-black focus:ring-1 focus:ring-black outline-none" value={review.author} onChange={e => updateReview(idx, 'author', e.target.value)} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Avatar URL (Google Maps profile pic)</label>
                            <input className="w-full text-xs p-2 border border-gray-200 rounded font-mono text-gray-600 focus:border-black focus:ring-1 focus:ring-black outline-none" value={review.avatar} onChange={e => updateReview(idx, 'avatar', e.target.value)} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Review Text</label>
                            <textarea rows={3} className="w-full text-xs p-2 border border-gray-200 rounded focus:border-black focus:ring-1 focus:ring-black outline-none resize-none" value={review.text} onChange={e => updateReview(idx, 'text', e.target.value)} />
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={addReview} className="w-full py-3 bg-white border border-dashed border-gray-300 text-gray-500 text-xs font-bold rounded hover:bg-gray-50 hover:text-black hover:border-gray-400 transition-all flex items-center justify-center gap-2">
                <Plus size={16} /> Add Review
            </button>
        </div>
    );
};

// ===================================
// TEAM LIST MANAGER
// ===================================

const TeamListManager = ({ members, onChange }: { members: any[], onChange: (v: any[]) => void }) => {
    // Make sure we have a reference to the default TEAM_MEMBERS in case they want a starting point or if it's empty
    const defaultMembers = [
        { name: "Santiago", role: "CEO", img: "/santi-web-photo.png" },
        { name: "Deedee", role: "Relationship Success Manager", img: "/deedee%202025%20headshot.png" },
        { name: "Dez", role: "Client Success manager", img: "/dez%202025%20headshot.png" },
        { name: "Rob", role: "CMO", img: "/rob-headshot-2025.png" },
        { name: "Nick", role: "Creative lead", img: "/nick-2025-v2.png" },
        { name: "Ryan", role: "Videographer/Editor", img: "/ryan%202025%20headshot.png" }
    ];

    const currentMembers = members?.length > 0 ? members : defaultMembers;

    const addMember = () => {
        onChange([...currentMembers, {
            id: Date.now().toString(),
            name: "New Member",
            role: "Role",
            img: "/santi-web-photo.png"
        }]);
    };

    const removeMember = (index: number) => {
        if (!window.confirm('Are you sure you want to delete this team member?')) return;
        const newMembers = [...currentMembers];
        newMembers.splice(index, 1);
        onChange(newMembers);
    };

    const updateMember = (index: number, field: string, value: string) => {
        const newMembers = [...currentMembers];
        newMembers[index] = { ...newMembers[index], [field]: value };
        onChange(newMembers);
    };

    const moveMember = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === currentMembers.length - 1) return;

        const newMembers = [...currentMembers];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newMembers[index], newMembers[targetIndex]] = [newMembers[targetIndex], newMembers[index]];
        onChange(newMembers);
    };

    return (
        <div className="space-y-4">
            {currentMembers.map((member, idx) => (
                <div key={member.name + idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg relative group transition-all hover:bg-white hover:shadow-md hover:border-gray-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-2">
                            <div className="flex flex-col justify-center gap-1 mr-2 text-gray-400">
                                <button onClick={() => moveMember(idx, 'up')} disabled={idx === 0} className="hover:text-black disabled:opacity-20"><ArrowUp size={14} /></button>
                                <button onClick={() => moveMember(idx, 'down')} disabled={idx === currentMembers.length - 1} className="hover:text-black disabled:opacity-20"><ArrowDown size={14} /></button>
                            </div>
                            <span className="font-mono text-xs text-gray-400 font-bold pt-1">#{idx + 1}</span>
                            <h5 className="font-bold text-sm text-black pt-0.5">{member.name || 'Unnamed'}</h5>
                        </div>
                        <button
                            onClick={() => removeMember(idx)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-all"
                            title="Delete Member"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 pl-8">
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Name</label>
                            <input className="w-full text-xs p-2 border border-gray-200 rounded focus:border-black focus:ring-1 focus:ring-black outline-none" value={member.name} onChange={e => updateMember(idx, 'name', e.target.value)} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Role</label>
                            <input className="w-full text-xs p-2 border border-gray-200 rounded focus:border-black focus:ring-1 focus:ring-black outline-none" value={member.role} onChange={e => updateMember(idx, 'role', e.target.value)} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Headshot Image URL</label>
                            <input className="w-full text-xs p-2 border border-gray-200 rounded font-mono text-gray-600 focus:border-black focus:ring-1 focus:ring-black outline-none" value={member.img} onChange={e => updateMember(idx, 'img', e.target.value)} />
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={addMember} className="w-full py-3 bg-white border border-dashed border-gray-300 text-gray-500 text-xs font-bold rounded hover:bg-gray-50 hover:text-black hover:border-gray-400 transition-all flex items-center justify-center gap-2">
                <Plus size={16} /> Add Team Member
            </button>
        </div>
    );
};
