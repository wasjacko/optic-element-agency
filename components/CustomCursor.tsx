import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isHovering, setIsHovering] = useState(false);

    // Add smooth springs for the cursor follow effect
    const springX = useSpring(mouseX, { stiffness: 1000, damping: 50, mass: 0.1 });
    const springY = useSpring(mouseY, { stiffness: 1000, damping: 50, mass: 0.1 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX - 10);
            mouseY.set(e.clientY - 10);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('cursor-pointer')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mouseover', handleMouseOver, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 w-5 h-5 pointer-events-none z-[9999] opacity-100 hidden md:flex items-center justify-center transform-gpu"
            style={{
                x: springX,
                y: springY,
                scale: isHovering ? 1.5 : 1
            }}
        >
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="var(--color-primary)">
                <path d="M45 0H55V45H100V55H55V100H45V55H0V45H45V0Z" />
            </svg>
        </motion.div>
    );
};
