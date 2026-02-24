
import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo, useInView } from 'framer-motion';
import { Instagram, ChevronLeft, ChevronRight, Play } from 'lucide-react';

const REELS = [
    { id: "R_01", client: "omar_therockstar", url: "https://video.wixstatic.com/video/8fb0bb_26cfc458c0054812a82383379cb29c79/720p/mp4/file.mp4", instagram: "https://www.instagram.com/omar_therockstar/", thumbnailTime: 0.5 },
    { id: "R_02", client: "PERSONAE 2", url: "https://video.wixstatic.com/video/8fb0bb_d6e089eee8c1427b867ec8d101a46274/720p/mp4/file.mp4", thumbnailTime: 1.0 },
    { id: "R_04", client: "LGCY", url: "https://video.wixstatic.com/video/8fb0bb_b9a25be31bc34c65970d07346fe1f732/1080p/mp4/file.mp4", thumbnailTime: 2.0 },
    { id: "R_03", client: "DR. CLARENCE LEE JR.", url: "https://video.wixstatic.com/video/8fb0bb_bbef9fb4c4564d3181bc316e6496109b/720p/mp4/file.mp4", instagram: "https://www.instagram.com/drclarenceleejr/" },
    { id: "R_05", client: "KOFFEE CO.", url: "https://video.wixstatic.com/video/8fb0bb_4722b88e8b614accaadc3be3ba825bf7/1080p/mp4/file.mp4" }
];

const BASE_REVIEWS = [
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

// Ensure we have enough reviews for 4 pages of 4 items if needed, or just enough for the slider
const GOOGLE_REVIEWS = [
    ...BASE_REVIEWS,
    ...BASE_REVIEWS
].map((r, i) => ({ ...r, id: `${r.id}_${i}` }));



const ReelCoverflowCard = ({ reel, isActive, onClick, offset }: { reel: any, isActive: boolean, onClick: () => void, offset: number }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isActive && videoRef.current) {
            videoRef.current.play().catch(() => { });
        } else if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [isActive]);

    return (

        <motion.div
            className="absolute overflow-hidden cursor-pointer bg-neutral-900 border border-white/10 shadow-2xl"
            initial={false}
            animate={{
                scale: isActive ? 1.0 : 0.85,
                zIndex: isActive ? 10 : 5 - Math.abs(offset),
                rotateY: offset * -15, // Rotate cards inward
                opacity: Math.abs(offset) >= 2 ? 0 : 1 // Hide edge cards (buffer)
            }}
            transition={{ type: "spring", stiffness: 80, damping: 30, mass: 1.5 }}
            style={{
                width: '100%',
                height: '100%',
                transformStyle: 'preserve-3d',
                perspective: '1000px'
            }}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative w-full h-full">
                {/* Video / Thumbnail */}
                <video
                    ref={videoRef}
                    src={reel.url}
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                />

                {/* Overlay Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`} />

                {/* Active State Details */}
                <div className={`absolute inset-0 flex flex-col justify-between p-8 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex justify-between items-start">
                        <div className="bg-white/10 backdrop-blur-md px-3 py-1 border border-white/20">
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Play</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-3xl font-black text-white uppercase leading-none font-sans tracking-tight drop-shadow-lg">
                            {reel.client}
                        </h3>
                        <div className="flex items-center gap-3">
                            <span className="h-[1px] w-8 bg-[#FF5000]"></span>
                            <span className="text-[10px] text-gray-300 uppercase tracking-[0.2em] font-ocr">Watch Reel</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const MobileReelCard = ({ reel }: { reel: any }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { amount: 0.6 });

    useEffect(() => {
        if (isInView && videoRef.current) {
            videoRef.current.play().catch(() => { });
        } else if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [isInView]);

    return (
        <div ref={containerRef} className="relative w-full h-full bg-neutral-900 overflow-hidden rounded-xl border border-white/10">
            <video
                ref={videoRef}
                src={reel.url}
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            <div className="absolute inset-0 flex flex-col justify-between p-5 pointer-events-none">
                <div className="flex justify-between items-start">
                    <div className="bg-white/10 backdrop-blur-md px-3 py-1 border border-white/20 rounded-sm">
                        <span className="text-[9px] font-bold text-white uppercase tracking-widest">Reel</span>
                    </div>
                </div>
                <div className="space-y-3">
                    <h3 className="text-3xl font-black text-white uppercase leading-none font-sans drop-shadow-lg tracking-tight">
                        {reel.client}
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="h-[2px] w-8 bg-[#FF5000]"></span>
                        <span className="text-[10px] text-gray-300 uppercase tracking-[0.2em] font-ocr font-bold">Watch</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Carousel3D = ({ items }: { items: typeof REELS }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = Next, -1 = Prev
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNext = () => {
        setDirection(1);
        setActiveIndex(prev => (prev + 1) % 5);
    };

    const handlePrev = () => {
        setDirection(-1);
        setActiveIndex(prev => (prev - 1 + 5) % 5);
    };

    // Sort items for rendering based on layout direction
    // Logic: The "Crossing" card (moving across the back) must be rendered FIRST (Bottom of Stack).
    // The Active card is rendered LAST (Top).

    // Scan Slots:
    // Slot 0: Active (Top)
    // Slot 1: Right
    // Slot 2: Left

    // If Next (1): Left->Right (Slot 2->1) is crossing. But wait.
    // Transition: Old Left (Slot 2) becomes New Right (Slot 1).
    // So the card currently in "Slot 1" (New State) came from Left. It is the crossing card.
    // So if Direction=1, Slot 1 should be Bottom. Order: [1, 2, 0].

    // If Prev (-1): Right->Left (Slot 1->2) is crossing.
    // Transition: Old Right (Slot 1) becomes New Left (Slot 2).
    // So the card currently in "Slot 2" (New State) came from Right. It is the crossing card.
    // So if Direction=-1, Slot 2 should be Bottom. Order: [2, 1, 0].

    const getSlot = (i: number) => (i - activeIndex + 5) % 5;

    const sortedItems = [...items].sort((a, b) => {
        const slotA = getSlot(items.indexOf(a));
        const slotB = getSlot(items.indexOf(b));

        if (slotA === 0) return 1; // 0 always top
        if (slotB === 0) return -1;

        if (direction === 1) {
            // Next: 1 is bottom (came from cross), 2 is middle
            // Sort: 1, 2. (1 < 2).
            // return slotA - slotB; -> if A=1, B=2 -> -1 (A first). Correct.
            return slotA - slotB;
        } else {
            // Prev: 2 is bottom (came from cross), 1 is middle
            // Sort: 2, 1. (2 < 1? No, 2 first).
            // return slotB - slotA; -> if A=2, B=1 -> -1 (A first). Correct.
            return slotB - slotA;
        }
    });

    if (isMobile) {
        return (
            <div className="w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-8 sm:px-12 py-10 gap-6 h-auto" style={{ scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}>
                <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
                {items.map((item, i) => (
                    <div
                        key={item.id}
                        className="w-[85vw] sm:w-[50vw] flex-shrink-0 snap-center relative aspect-[9/16] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-transform duration-300"
                    >
                        <MobileReelCard reel={item} />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center overflow-visible">
            {/* Arrows Container - Constrained Width to be close to cards */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                <div className="w-full max-w-[850px] flex justify-between px-2 md:px-4">
                    <button onClick={handlePrev} className="bg-white/80 backdrop-blur-sm md:bg-white text-black w-10 h-10 md:w-14 md:h-14 flex items-center justify-center shadow-xl pointer-events-auto hover:scale-110 transition-transform cursor-pointer border border-gray-100/50">
                        <ChevronLeft size={20} className="md:w-[24px]" />
                    </button>
                    <button onClick={handleNext} className="bg-white/80 backdrop-blur-sm md:bg-white text-black w-10 h-10 md:w-14 md:h-14 flex items-center justify-center shadow-xl pointer-events-auto hover:scale-110 transition-transform cursor-pointer border border-gray-100/50">
                        <ChevronRight size={20} className="md:w-[24px]" />
                    </button>
                </div>
            </div>

            {/* Cards Container */}
            <div className="relative w-full max-w-5xl h-full flex items-center justify-center perspective-[1000px]">
                {sortedItems.map((item) => {
                    const originalIndex = items.indexOf(item);
                    const slot = getSlot(originalIndex);

                    // Define props based on slot
                    let x = 0;
                    let zIndex = 0;
                    let scale = 1;
                    let opacity = 1;

                    if (slot === 0) { // Center
                        x = 0; zIndex = 50; scale = isMobile ? 0.95 : 1;
                    } else if (slot === 1) { // Near Right
                        x = isMobile ? 120 : 240; zIndex = 30; scale = isMobile ? 0.8 : 0.85;
                    } else if (slot === 2) { // Far Right
                        x = isMobile ? 220 : 450; zIndex = 10; scale = isMobile ? 0.65 : 0.7;
                    } else if (slot === 3) { // Far Left
                        x = isMobile ? -220 : -450; zIndex = 10; scale = isMobile ? 0.65 : 0.7;
                    } else { // Near Left (Slot 4)
                        x = isMobile ? -120 : -240; zIndex = 30; scale = isMobile ? 0.8 : 0.85;
                    }

                    return (
                        <motion.div
                            key={item.id}
                            className="absolute will-change-transform backface-hidden"
                            animate={{
                                x,
                                scale,
                                zIndex,
                                opacity,
                                rotateY: 0
                            }}
                            transition={{ type: "spring", stiffness: 60, damping: 20 }}
                            style={{
                                width: isMobile ? '280px' : '320px',
                                height: isMobile ? '500px' : '570px',
                                left: isMobile ? 'calc(50% - 140px)' : 'calc(50% - 160px)',
                                transform: 'translateZ(0)'
                            }}
                        >
                            <ReelCoverflowCard
                                reel={item}
                                isActive={slot === 0}
                                offset={0}
                                onClick={() => {
                                    if (slot === 1) handleNext();
                                    if (slot === 2) handlePrev();
                                }}
                            />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// Updated GoogleReviewCard for Light Mode
const GoogleReviewCard = ({ review }: { review: typeof BASE_REVIEWS[0] }) => {
    return (
        <div className="bg-white pt-10 pb-4 px-10 md:px-6 flex flex-col items-center relative text-center h-full w-full max-w-[350px] mx-auto border border-gray-200 mt-10 shadow-lg rounded-none">
            {/* Floating Header: Avatar + Google Icon */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[80px] h-[80px]">
                <div className="w-full h-full rounded-full p-1 bg-white border border-gray-100 shadow-sm relative">
                    <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-full h-full rounded-full object-cover"
                    />
                    {/* Google G Icon Button Absolute */}
                    <div className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg p-1">
                        <img
                            src="https://cdn.trustindex.io/assets/platform/Google/icon.svg"
                            alt="Google"
                            className="w-full h-full"
                        />
                    </div>
                </div>
            </div>

            {/* Name */}
            <div className="mt-2 mb-1">
                <h4 className="font-bold text-sm text-black leading-tight uppercase tracking-[0.1em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {review.author}
                </h4>
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-2 justify-center">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FFC107" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                ))}
            </div>

            {/* Body Text */}
            <div className="mb-2 flex-grow flex flex-col justify-center">
                <p className="text-gray-600 text-sm leading-relaxed font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {review.text}
                </p>
            </div>
        </div>
    );
}

export const Testimonials: React.FC<{ data?: any }> = ({ data }) => {
    const activeReels = data?.reels || REELS;
    const activeReviews = data?.reviews || GOOGLE_REVIEWS;
    const [currentIndex, setCurrentIndex] = useState(0);
    const ITEMS_PER_VIEW = 4;



    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % Math.ceil(activeReviews.length / ITEMS_PER_VIEW));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + Math.ceil(activeReviews.length / ITEMS_PER_VIEW)) % Math.ceil(activeReviews.length / ITEMS_PER_VIEW));
    };

    return (
        <section id="testimonials" className="relative z-10 w-full bg-white py-12 md:py-16 border-t border-black/[0.05] overflow-hidden">
            {/* Light Mode Glow (Subtle) */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] blur-[120px] rounded-full pointer-events-none opacity-40 mix-blend-multiply bg-[#FF5000]/10" />

            <div className="w-full px-8 md:px-4 max-w-[1600px] mx-auto relative z-10">

                {/* Section Header */}
                <div className="flex flex-col items-center mb-16 text-center px-10 md:px-6">
                    <h2 className="font-sans font-black tracking-widest text-2xl md:text-4xl uppercase leading-none whitespace-nowrap text-black drop-shadow-sm">
                        {data?.title || "VIDEO TESTIMONIALS"}
                    </h2>
                </div>

                {/* 3D Carousel Section */}
                <div className="mb-20">
                    <Carousel3D items={activeReels} />
                </div>

                {/* Google Testimonials Header & Nav */}
                <div className="border-t border-black/[0.05] pt-12 pb-16 relative">
                    <div className="flex justify-center mb-6">
                        <h3 className="text-black font-ocr text-xs tracking-[0.2em] uppercase font-bold text-center">
                            {data?.reviewsTitle || "CLIENT REVIEWS"}
                        </h3>
                    </div>

                    {/* Slider Container with side arrows (Desktop) / Horizontal Scroll (Mobile) */}
                    <div className="relative w-full px-0 md:px-12">
                        {/* Prev Arrow (Desktop Only) */}
                        <button
                            onClick={prevSlide}
                            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white shadow-lg border border-gray-100 items-center justify-center text-gray-400 hover:text-black hover:scale-110 transition-all rounded-none"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {/* Next Arrow (Desktop Only) */}
                        <button
                            onClick={nextSlide}
                            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white shadow-lg border border-gray-100 items-center justify-center text-gray-400 hover:text-black hover:scale-110 transition-all rounded-none"
                        >
                            <ChevronRight size={20} />
                        </button>

                        {/* Desktop Slider View */}
                        <div className="hidden md:block overflow-hidden py-10 -my-10">
                            <motion.div
                                className="flex"
                                animate={{ x: `-${currentIndex * 100}%` }}
                                transition={{ type: "spring", stiffness: 90, damping: 20, mass: 1 }}
                            >
                                {activeReviews.map((review: any) => (
                                    <motion.div
                                        key={review.id}
                                        className="min-w-[25%] px-3 shrink-0"
                                    >
                                        <GoogleReviewCard review={review} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Mobile Swipe View */}
                        <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide py-10 gap-4 px-6 w-full" style={{ scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}>
                            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
                            {activeReviews.map((review: any) => (
                                <div key={review.id} className="w-[85vw] flex-shrink-0 snap-center pt-2">
                                    <GoogleReviewCard review={review} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
