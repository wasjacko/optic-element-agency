
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, ArrowLeft, ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const REELS = [
    { id: "R_01", client: "omar_therockstar", url: "https://video.wixstatic.com/video/8fb0bb_26cfc458c0054812a82383379cb29c79/720p/mp4/file.mp4", instagram: "https://www.instagram.com/omar_therockstar/" },
    { id: "R_02", client: "PERSONAE 2", url: "https://video.wixstatic.com/video/8fb0bb_d6e089eee8c1427b867ec8d101a46274/720p/mp4/file.mp4" },
    { id: "R_03", client: "DR. CLARENCE LEE JR.", url: "https://video.wixstatic.com/video/8fb0bb_bbef9fb4c4564d3181bc316e6496109b/720p/mp4/file.mp4", instagram: "https://www.instagram.com/drclarenceleejr/" }
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

const ReelCard: React.FC<{ reel: typeof REELS[0] }> = ({ reel }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => { });
            setIsPlaying(true);
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const content = (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative group bg-gray-100 border border-black/[0.05] overflow-hidden cursor-pointer"
        >
            <div className="aspect-[9/16] relative">
                <video
                    ref={videoRef}
                    src={reel.url}
                    loop muted playsInline
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                />
                <div className="absolute inset-0 flex items-end justify-start p-8">
                    <div className="bg-white py-3 px-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                        <div className="font-mono text-[10px] md:text-[11px] text-black tracking-[0.4em] font-black uppercase whitespace-nowrap flex items-center gap-3">
                            {reel.client}
                            {reel.instagram && <Instagram size={13} className="text-black/40 group-hover:text-[#FF5000] transition-colors" />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (reel.instagram) {
        return (
            <a href={reel.instagram} target="_blank" rel="noopener noreferrer" className="block outline-none">
                {content}
            </a>
        );
    }

    return content;
};

// Updated GoogleReviewCard to completely match the NEW image reference
// Center alignment, floating avatar, google icon on avatar, etc.
const GoogleReviewCard = ({ review }: { review: typeof BASE_REVIEWS[0] }) => {
    return (
        <div className="bg-white pt-12 pb-8 px-6 flex flex-col items-center relative text-center h-full w-full max-w-[400px] mx-auto border border-gray-200 mt-10">
            {/* Floating Header: Avatar + Google Icon */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[80px] h-[80px]">
                <div className="w-full h-full rounded-full p-1 bg-white shadow-sm relative">
                    <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-full h-full rounded-full object-cover"
                    />
                    {/* Google G Icon Button Absolute */}
                    <div className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm p-1">
                        <img
                            src="https://cdn.trustindex.io/assets/platform/Google/icon.svg"
                            alt="Google"
                            className="w-full h-full"
                        />
                    </div>
                </div>
            </div>

            {/* Name */}
            <div className="mt-4 mb-3">
                <h4 className="font-bold text-base text-black leading-tight font-sans">
                    {review.author}
                </h4>
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-4 justify-center">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FFC107" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                ))}
            </div>

            {/* Body Text */}
            <div className="mb-6 flex-grow">
                <p className="text-black/80 text-sm leading-relaxed font-sans font-medium">
                    {review.text}
                </p>
            </div>
        </div>
    );
}

export const Testimonials: React.FC = () => {
    // 4 Items per view based on reference image
    const ITEMS_PER_VIEW = 4;
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % Math.ceil(GOOGLE_REVIEWS.length / ITEMS_PER_VIEW));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + Math.ceil(GOOGLE_REVIEWS.length / ITEMS_PER_VIEW)) % Math.ceil(GOOGLE_REVIEWS.length / ITEMS_PER_VIEW));
    };

    return (
        <section className="relative z-10 w-full bg-white py-40 border-t border-black/[0.05]">
            <div className="w-full px-6 max-w-[1600px] mx-auto">
                {/* Tactical Section Header */}
                <div className="flex flex-col items-center mb-24 text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative inline-block"
                    >
                        <h2 className="text-black font-mono text-xs md:text-sm tracking-[1em] uppercase font-black relative z-10">
                            VIDEO TESTIMONIALS
                        </h2>
                        <div className="absolute -bottom-4 left-0 w-full h-[3px] bg-[#FF5000]" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto px-6 mb-32">
                    {REELS.map((reel, i) => (
                        <motion.div
                            key={reel.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <ReelCard reel={reel} />
                        </motion.div>
                    ))}
                </div>

                {/* Google Testimonials Header & Nav */}
                <div className="border-t border-black/[0.05] pt-20 relative">
                    <div className="flex justify-center mb-12">
                        <h3 className="text-black font-mono text-xs tracking-[0.2em] uppercase font-bold text-center">
                            CLIENT REVIEWS
                        </h3>
                    </div>

                    {/* Slider Container with side arrows */}
                    <div className="relative w-full px-12">
                        {/* Prev Arrow */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:scale-110 transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {/* Next Arrow */}
                        <button
                            onClick={nextSlide}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:scale-110 transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>

                        <div className="overflow-hidden py-10 -my-10">
                            <motion.div
                                className="flex"
                                animate={{ x: `-${currentIndex * 100}%` }}
                                transition={{ type: "spring", stiffness: 90, damping: 20, mass: 1 }}
                            >
                                {GOOGLE_REVIEWS.map((review, i) => (
                                    <motion.div
                                        key={review.id}
                                        // 4 items per view logic: 100% / 4 = 25%.
                                        className="min-w-full md:min-w-[25%] px-3 shrink-0"
                                    >
                                        <GoogleReviewCard review={review} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
