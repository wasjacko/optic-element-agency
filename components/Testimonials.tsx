
import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo, useInView } from 'framer-motion';
import { Instagram, ChevronLeft, ChevronRight, Play } from 'lucide-react';

const REELS = [
    { id: "R_01", client: "OMAR ELATTAR", url: "/assets/testimonial-omar.mp4", instagram: "https://www.instagram.com/omar_therockstar/", thumbnailTime: 0.5 },
    { id: "R_02", client: "MATTHEW WELSH", url: "/assets/testimonial-matthew.mp4", thumbnailTime: 1.0 },
    { id: "R_03", client: "DR. CLARENCE LEE JR.", url: "/assets/testimonial-clarence.mp4", instagram: "https://www.instagram.com/drclarenceleejr/" },
    { id: "R_06", client: "DR. MATT", url: "/assets/testimonial-matt.mp4", thumbnailTime: 1.0 },
    { id: "R_07", client: "EUGENE NEAL", url: "/assets/eugene-neal.mp4", thumbnailTime: 0.5 },
    { id: "R_08", client: "BRETT", url: "/assets/brett.mp4", thumbnailTime: 1.0 }
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
                opacity: Math.abs(offset) >= 3 ? 0 : 1 // Support up to 5 visible items
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
                    poster={reel.url.replace(/\.(mp4|mov)/, '.jpg')}
                    loop
                    muted
                    playsInline
                    preload="metadata"
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
                        <h3 className="text-3xl font-black text-white uppercase leading-tight font-sans tracking-tight drop-shadow-lg break-words break-all whitespace-normal">
                            {reel.client}
                        </h3>
                        <div className="flex items-center gap-3">
                            <span className="h-[1px] w-8 bg-[#FF5000]"></span>
                            <span className="text-[10px] text-gray-300 uppercase tracking-[0.2em] font-ocr">WATCH VIDEO</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Carousel3D = ({ items }: { items: typeof REELS }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = Next, -1 = Prev

    const handleNext = () => {
        setDirection(1);
        setActiveIndex(prev => (prev + 1) % items.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setActiveIndex(prev => (prev - 1 + items.length) % items.length);
    };

    const getSlot = (i: number) => (i - activeIndex + items.length) % items.length;

    const sortedItems = [...items].sort((a, b) => {
        const slotA = getSlot(items.indexOf(a));
        const slotB = getSlot(items.indexOf(b));
        if (slotA === 0) return 1;
        if (slotB === 0) return -1;
        if (direction === 1) return slotA - slotB;
        else return slotB - slotA;
    });

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center overflow-visible">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                <div className="w-full max-w-[720px] flex justify-between px-4">
                    <button onClick={handlePrev} className="bg-white text-black w-14 h-14 flex items-center justify-center shadow-xl pointer-events-auto hover:scale-110 transition-transform cursor-pointer border border-gray-100">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={handleNext} className="bg-white text-black w-14 h-14 flex items-center justify-center shadow-xl pointer-events-auto hover:scale-110 transition-transform cursor-pointer border border-gray-100">
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
                {items.map((item, index) => {
                    const originalIndex = items.indexOf(item);
                    const slot = (originalIndex - activeIndex + items.length) % items.length;

                    // Map items to a symmetric range [-2, -1, 0, 1, 2]
                    let positionIndex = slot;
                    if (slot > items.length / 2) positionIndex = slot - items.length;

                    const x = positionIndex * 180; // Serré (était 280)
                    const zIndex = 50 - Math.abs(positionIndex) * 10;
                    const scale = 1 - Math.abs(positionIndex) * 0.15;
                    const opacity = 1 - Math.abs(positionIndex) * 0.1; // Plus d'opacité (était 0.3)
                    const rotateY = positionIndex * -25;

                    const isVisible = Math.abs(positionIndex) <= 2;

                    return (
                        <motion.div
                            key={item.id}
                            className="absolute will-change-transform"
                            initial={false}
                            animate={{
                                x,
                                scale: isVisible ? scale : 0.5,
                                zIndex: isVisible ? zIndex : -1,
                                opacity: isVisible ? opacity : 0,
                                rotateY: 0,
                                filter: Math.abs(positionIndex) > 0 ? "blur(1px)" : "blur(0px)"
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 90,
                                damping: 25,
                                mass: 1,
                                opacity: { duration: 0.2 } // Fade out quickly
                            }}
                            style={{
                                width: '280px',
                                height: '500px',
                                pointerEvents: isVisible ? 'auto' : 'none'
                            }}
                        >
                            <ReelCoverflowCard
                                reel={item}
                                isActive={positionIndex === 0}
                                offset={positionIndex}
                                onClick={() => {
                                    if (positionIndex === 1) handleNext();
                                    if (positionIndex === -1) handlePrev();
                                    if (positionIndex === 2) handleNext(); // Jump 2
                                    if (positionIndex === -2) handlePrev(); // Jump 2
                                }}
                            />
                        </motion.div>
                    );
                })}
            </div>
        </div>
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
        <div ref={containerRef} className="relative w-full h-full bg-neutral-900 overflow-hidden">
            {/* Brackets */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/70 z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/70 z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/70 z-20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/70 z-20 pointer-events-none" />

            <video
                ref={videoRef}
                src={reel.url}
                poster={reel.url.replace(/\.(mp4|mov)/, '.jpg')}
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            <div className="absolute inset-0 flex flex-col justify-end p-5 pointer-events-none">
                <div className="space-y-3">
                    <h3 className="text-3xl font-black text-white uppercase leading-tight font-sans drop-shadow-lg tracking-tight break-words break-all whitespace-normal">
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

const FlatVideoCarousel = ({ items }: { items: typeof REELS }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const ITEMS_PER_VIEW = 3; // On desktop

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % Math.ceil(items.length - ITEMS_PER_VIEW + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + Math.ceil(items.length - ITEMS_PER_VIEW + 1)) % Math.ceil(items.length - ITEMS_PER_VIEW + 1));
    };

    return (
        <div className="relative w-full">
            {/* Desktop View */}
            <div className="hidden md:block relative w-full max-w-5xl mx-auto px-12">
                {/* Prev Arrow */}
                <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:scale-110 transition-all rounded-full"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Next Arrow */}
                <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:scale-110 transition-all rounded-full"
                >
                    <ChevronRight size={24} />
                </button>

                <div className="py-10 overflow-visible">
                    <motion.div
                        className="flex gap-6"
                        animate={{ x: `calc(-${currentIndex * (100 / ITEMS_PER_VIEW)}% - ${currentIndex * (24 / ITEMS_PER_VIEW)}px)` }}
                        transition={{ type: "spring", stiffness: 90, damping: 20, mass: 1 }}
                    >
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="w-[calc(33.333%-16px)] shrink-0 aspect-[9/16] transition-shadow duration-500 overflow-hidden"
                            >
                                <MobileReelCard reel={item} />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Mobile Swipe View */}
            <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide py-10 gap-4 -mx-8 px-8 w-[calc(100%+4rem)]" style={{ scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}>
                <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="w-[75vw] sm:w-[50vw] flex-shrink-0 snap-center relative aspect-[9/16] overflow-hidden"
                    >
                        <MobileReelCard reel={item} />
                    </div>
                ))}
            </div>
        </div>
    );
};

// Updated GoogleReviewCard for Light Mode
const GoogleReviewCard = ({ review }: { review: typeof BASE_REVIEWS[0] }) => {
    return (
        <div className="bg-white pt-10 pb-4 px-10 md:px-6 flex flex-col items-center relative text-center h-full w-full max-w-[350px] mx-auto mt-10 rounded-none">
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
    const [visibleReviews, setVisibleReviews] = useState(3);
    const [isMobile, setIsMobile] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const ITEMS_PER_VIEW = 4;

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % Math.ceil(activeReviews.length / ITEMS_PER_VIEW));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + Math.ceil(activeReviews.length / ITEMS_PER_VIEW)) % Math.ceil(activeReviews.length / ITEMS_PER_VIEW));
    };

    const loadMore = () => {
        setVisibleReviews(prev => Math.min(prev + 3, 9, activeReviews.length));
    };

    const showLess = () => {
        setVisibleReviews(3);
    };

    return (
        <section id="testimonials" className="relative z-10 w-full bg-white pt-16 sm:pt-24 pb-12 md:pt-16 md:pb-32 border-t border-black/[0.05] overflow-hidden">
            {/* Light Mode Glow (Subtle) */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] blur-[120px] rounded-full pointer-events-none opacity-40 mix-blend-multiply bg-[#FF5000]/10" />

            <div className="w-full px-8 md:px-4 max-w-[1600px] mx-auto relative z-10">

                {/* Section Header */}
                <div className="flex flex-col items-center mt-4 md:mt-8 mb-16 text-center px-10 md:px-6">
                    <h2 className="font-sans font-black tracking-widest text-2xl md:text-4xl uppercase leading-none whitespace-nowrap text-black drop-shadow-sm">
                        {data?.title || "VIDEO TESTIMONIALS"}
                    </h2>
                </div>

                {/* Content Section */}
                <div className="mb-20">
                    {!isMobile ? (
                        <Carousel3D items={activeReels} />
                    ) : (
                        <FlatVideoCarousel items={activeReels} />
                    )}
                </div>

                {/* Google Testimonials Header & Nav */}
                <div className="border-t border-black/[0.05] pt-12 pb-16 relative">
                    <div className="flex justify-center mb-6">
                        <h3 className="text-black font-ocr text-xs tracking-[0.2em] uppercase font-bold text-center">
                            {data?.reviewsTitle || "CLIENT REVIEWS"}
                        </h3>
                    </div>

                    {!isMobile ? (
                        /* DESKTOP SLIDER */
                        <div className="relative w-full px-12">
                            <button
                                onClick={prevSlide}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:scale-110 transition-all rounded-none"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <button
                                onClick={nextSlide}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:scale-110 transition-all rounded-none"
                            >
                                <ChevronRight size={20} />
                            </button>

                            <div className="overflow-hidden py-10 -my-10">
                                <motion.div
                                    className="flex"
                                    animate={{ x: `-${currentIndex * 100}%` }}
                                    transition={{ type: "spring", stiffness: 90, damping: 20, mass: 1 }}
                                >
                                    {activeReviews.map((review: any, i: number) => (
                                        <motion.div
                                            key={review.id}
                                            className="min-w-full md:min-w-[25%] px-3 shrink-0"
                                        >
                                            <GoogleReviewCard review={review} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    ) : (
                        /* MOBILE GRID / VERTICAL */
                        <>
                            <div className="relative w-full px-0 py-10 mt-6 flex flex-col gap-16 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 max-w-6xl mx-auto">
                                {activeReviews.slice(0, visibleReviews).map((review: any) => (
                                    <div key={review.id} className="w-full">
                                        <GoogleReviewCard review={review} />
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center gap-4 mt-6">
                                {visibleReviews < Math.min(activeReviews.length, 9) && (
                                    <button
                                        onClick={loadMore}
                                        className="group relative px-6 py-3 bg-white/5 hover:bg-black transition-all duration-500 overflow-hidden border border-black/10 hover:border-black text-black hover:text-white"
                                    >
                                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black transition-colors" />
                                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black transition-colors" />
                                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black transition-colors" />
                                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black transition-colors" />
                                        <span className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] whitespace-nowrap">SEE MORE</span>
                                    </button>
                                )}

                                {visibleReviews > 3 && (
                                    <button
                                        onClick={showLess}
                                        className="group relative px-6 py-3 bg-white/5 hover:bg-black transition-all duration-500 overflow-hidden border border-black/10 hover:border-black text-black hover:text-white"
                                    >
                                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black transition-colors" />
                                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black transition-colors" />
                                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black transition-colors" />
                                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black transition-colors" />
                                        <span className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] whitespace-nowrap">SEE LESS</span>
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};
