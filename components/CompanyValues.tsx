
import React, { useState, useEffect, useRef } from 'react';
import { useScroll, useVelocity, useAnimationFrame } from 'framer-motion';

const ScrollGlitchText: React.FC<{ text: string, className?: string }> = ({ text, className = "" }) => {
    const { scrollY } = useScroll();
    const velocity = useVelocity(scrollY);
    const [displayText, setDisplayText] = useState(text);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&[]{}<>";

    // Initial Reveal State
    const [revealed, setRevealed] = useState(false);
    const revealRef = useRef(0);

    useEffect(() => {
        // Simple initial reveal animation
        const interval = setInterval(() => {
            if (revealRef.current < text.length) {
                revealRef.current += 0.5;
            } else {
                setRevealed(true);
                clearInterval(interval);
            }
        }, 30);
        return () => clearInterval(interval);
    }, [text]);

    const chaosRef = useRef(0);
    const frameRef = useRef(0);

    useAnimationFrame(() => {
        if (!revealed) {
            // Handle Initial Reveal Logic in Animation Frame for smoothness with the same state
            const currentLen = Math.floor(revealRef.current);
            setDisplayText(
                text.split("").map((char, i) => {
                    if (char === " ") return " ";
                    if (i < currentLen) return char;
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join("")
            );
            return;
        }

        const currentVelocity = Math.abs(velocity.get()); // Get scroll velocity

        // 1. Calculate Target Chaos (Sensitivity)
        // High sensitivity: reaches max intensity at lower scroll speeds (e.g. 150)
        const targetChaos = Math.min(currentVelocity / 150, 1.0);

        // 2. Apply Momentum/Decay to Chaos
        // Fast Attack (reacts instantly to scroll)
        // Slow Decay (lingers "bien longtemps" after scroll stops)
        if (targetChaos > chaosRef.current) {
            chaosRef.current = targetChaos;
        } else {
            chaosRef.current *= 0.95; // Slow cool-down (retains 95% per frame)
        }

        // 3. Throttle Updates
        // Only update text every 4 frames (approx 15fps) so the eye can register the glyphs
        frameRef.current++;
        if (frameRef.current % 4 !== 0) return;

        // 4. Render Glitch
        if (chaosRef.current > 0.01) {
            const newText = text.split("").map((char) => {
                if (char === " ") return " ";
                // Probability of replacement based on current chaos intensity
                // At max chaos, 70% of characters will be glitched
                if (Math.random() < chaosRef.current * 0.7) {
                    return chars[Math.floor(Math.random() * chars.length)];
                }
                return char;
            }).join("");
            setDisplayText(newText);
        } else if (displayText !== text) {
            // Snap back to original text when stopped
            setDisplayText(text);
        }
    });

    return (
        <span className={className}>{displayText}</span>
    );
};

export const CompanyValues = () => {
    return (
        <section className="bg-black w-full py-64 md:py-80 flex justify-center items-center">
            <div className="text-center px-10 md:px-6">
                <div className="flex flex-col items-center gap-4">
                    <ScrollGlitchText
                        text="CONSTRUCTED ON 06 FOUNDATIONAL VALUES."
                        className="font-mono text-xs md:text-sm text-white tracking-[0.2em] uppercase"
                    />
                </div>
            </div>
        </section>
    );
};

