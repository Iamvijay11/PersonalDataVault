useEffect(() => {
    const particles = [];
    for (let i = 0; i < 30; i++) {
        particles.push({
            id: i,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.3 + 0.1,
        });
    }
    setBackgroundParticles(particles);
}, []);

// Animate background particles
useEffect(() => {
    const animateParticles = () => {
        setBackgroundParticles((prev) =>
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

const BackgroundParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {backgroundParticles.map((particle) => (
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
