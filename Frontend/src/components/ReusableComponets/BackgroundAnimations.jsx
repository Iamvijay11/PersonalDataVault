import React from "react";
import { useState, useEffect } from "react";

// FloatingShape Component (moved here as it's part of the background)
const FloatingShape = ({ delay, size, position }) => (
    <div
        className={`absolute ${size} bg-gray-600/20 rounded-full animate-bounce`}
        style={{
            top: position.top,
            left: position.left,
            animationDelay: `${delay}s`,
            animationDuration: "4s",
        }}
    />
);

// BackgroundParticles Component (moved here as it's part of the background)
const BackgroundParticles = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const initialParticles = [];
        for (let i = 0; i < 30; i++) {
            initialParticles.push({
                id: i,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.3 + 0.1,
            });
        }
        setParticles(initialParticles);
    }, []);

    useEffect(() => {
        const animateParticles = () => {
            setParticles((prev) =>
                prev.map((particle) => ({
                    ...particle,
                    x: particle.x + particle.speedX,
                    y: particle.y + particle.speedY,
                    x:
                        particle.x > window.innerWidth
                            ? 0
                            : particle.x < 0
                            ? window.innerWidth
                            : particle.x,
                    y:
                        particle.y > window.innerHeight
                            ? 0
                            : particle.y < 0
                            ? window.innerHeight
                            : particle.y,
                }))
            );
        };

        const interval = setInterval(animateParticles, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute rounded-full bg-gray-400 transition-all duration-1000 ease-out"
                    style={{
                        left: particle.x,
                        top: particle.y,
                        width: particle.size,
                        height: particle.size,
                        opacity: particle.opacity,
                        filter: "blur(0.5px)",
                    }}
                />
            ))}
        </div>
    );
};

// AnimatedGrid Component (moved here as it's part of the background)
const AnimatedGrid = () => (
    <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent transform -skew-y-12 animate-pulse" />
        <div className="grid grid-cols-20 gap-px h-full w-full">
            {Array.from({ length: 400 }).map((_, i) => (
                <div
                    key={i}
                    className="border border-gray-600/30 animate-pulse"
                    style={{
                        animationDelay: `${i * 0.05}s`,
                        animationDuration: "6s",
                    }}
                />
            ))}
        </div>
    </div>
);

// Main AnimatedBackground Component
const AnimatedBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <BackgroundParticles />
            <AnimatedGrid />

            <FloatingShape
                delay={0}
                size="w-20 h-20"
                position={{ top: "20%", left: "10%" }}
            />
            <FloatingShape
                delay={1}
                size="w-16 h-16"
                position={{ top: "60%", left: "80%" }}
            />
            <FloatingShape
                delay={2}
                size="w-24 h-24"
                position={{ top: "80%", left: "30%" }}
            />
            <FloatingShape
                delay={0.5}
                size="w-12 h-12"
                position={{ top: "30%", left: "70%" }}
            />
            <FloatingShape
                delay={1.5}
                size="w-18 h-18"
                position={{ top: "50%", left: "20%" }}
            />

            {/* Darker Gradient Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
            <div
                className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
            />

            {/* Subtle animated waves */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-500/5 to-blue-500/5 transform rotate-12 animate-pulse" />
                <div
                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-blue-500/5 to-cyan-500/5 transform -rotate-12 animate-pulse"
                    style={{ animationDelay: "2s" }}
                />
            </div>
        </div>
    );
};

export default AnimatedBackground;
