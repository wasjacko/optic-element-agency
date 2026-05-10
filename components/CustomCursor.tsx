import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const isForceHiddenRef = useRef(false);

    // Add smooth springs for the cursor follow effect
    const springX = useSpring(mouseX, { stiffness: 1000, damping: 50, mass: 0.1 });
    const springY = useSpring(mouseY, { stiffness: 1000, damping: 50, mass: 0.1 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX - 10);
            mouseY.set(e.clientY - 10);
            if (!isVisible && !isForceHiddenRef.current) setIsVisible(true);

            // Active hit-testing bypasses browser deferred hover states
            const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
            if (target) {
                if (target.tagName === 'A' ||
                    target.tagName === 'BUTTON' ||
                    target.closest('a') ||
                    target.closest('button') ||
                    target.classList.contains('cursor-pointer')) {
                    setIsHovering(true);
                } else {
                    setIsHovering(false);
                }
            }
        };

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.relatedTarget === null) {
                setIsVisible(false);
            }
        };

        const forceHide = () => {
            isForceHiddenRef.current = true;
            setIsVisible(false);
        };
        const forceShow = () => {
            isForceHiddenRef.current = false;
            setIsVisible(true);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('force-hide-cursor', forceHide);
        window.addEventListener('force-show-cursor', forceShow);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('force-hide-cursor', forceHide);
            window.removeEventListener('force-show-cursor', forceShow);
        };
    }, [isVisible]);

    return (
        <motion.div
            className="fixed top-0 left-0 w-5 h-5 pointer-events-none z-[9999] hidden md:flex items-center justify-center transform-gpu transition-opacity duration-200"
            style={{
                x: springX,
                y: springY,
                scale: isHovering ? 1.5 : 1,
                opacity: isVisible ? 1 : 0
            }}
        >
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="var(--color-primary)">
                <path d="M45 0H55V45H100V55H55V100H45V55H0V45H45V0Z" />
            </svg>
        </motion.div>
    );
};
