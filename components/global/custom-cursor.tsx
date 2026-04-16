"use client";

import { useEffect, useState } from "react";

export const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updateCursor = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        // Hide cursor when it leaves the window
        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener("mousemove", updateCursor);
        document.body.addEventListener("mouseleave", handleMouseLeave);
        document.body.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", updateCursor);
            document.body.removeEventListener("mouseleave", handleMouseLeave);
            document.body.removeEventListener("mouseenter", handleMouseEnter);
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div
            // Exact spec: 8x8, 90% white, difference blend mode, pointer-events ignored
            className="fixed top-0 left-0 w-2 h-2 bg-white/[0.9] rounded-full pointer-events-none z-[9999] mix-blend-difference transition-[width,height] duration-200"
            style={{
                // Using transform for maximum performance rather than left/top
                transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
            }}
        />
    );
};