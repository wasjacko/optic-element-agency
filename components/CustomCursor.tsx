
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e: MouseEvent) => {
            if ((e.target as HTMLElement).tagName === 'A' ||
                (e.target as HTMLElement).tagName === 'BUTTON' ||
                (e.target as HTMLElement).closest('a') ||
                (e.target as HTMLElement).closest('button')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 w-5 h-5 pointer-events-none z-[9999] opacity-100 flex items-center justify-center"
            animate={{
                x: position.x - 10,
                y: position.y - 10,
                scale: isHovering ? 1.5 : 1
            }}
            transition={{ duration: 0 }}
        >
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="#FF5000">
                <path d="M45 0H55V45H100V55H55V100H45V55H0V45H45V0Z" />
            </svg>
        </motion.div>
    );
};
