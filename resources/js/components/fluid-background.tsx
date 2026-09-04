import { useEffect, useRef } from 'react';

interface FluidBackgroundProps {
    primaryColor?: string; // e.g. 'rgba(28, 51, 153, 0.15)'
    secondaryColor?: string; // e.g. 'rgba(247, 114, 28, 0.1)'
}

export function FluidBackground({
    primaryColor = 'rgba(28, 51, 153, 0.12)',
    secondaryColor = 'rgba(247, 114, 28, 0.08)'
}: FluidBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        // Resize handler
        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        // Mouse interaction
        const mouse = {
            x: width / 2,
            y: height / 2,
            targetX: width / 2,
            targetY: height / 2,
            radius: 180,
            active: false
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.targetX = e.clientX;
            mouse.targetY = e.clientY;
            mouse.active = true;
        };

        const handleMouseLeave = () => {
            mouse.active = false;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        // Wave lines definition
        const waves = [
            { y: height * 0.4, length: 0.0015, amplitude: 70, speed: 0.008, phase: 0, color: primaryColor },
            { y: height * 0.5, length: 0.002, amplitude: 50, speed: 0.012, phase: Math.PI / 3, color: secondaryColor },
            { y: height * 0.6, length: 0.001, amplitude: 90, speed: 0.006, phase: Math.PI / 1.5, color: primaryColor }
        ];

        // Bubble particles
        const particles: Array<{
            x: number;
            y: number;
            radius: number;
            vx: number;
            vy: number;
            alpha: number;
            color: string;
        }> = [];

        for (let i = 0; i < 25; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 20 + 10,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                alpha: Math.random() * 0.3 + 0.1,
                color: Math.random() > 0.5 ? primaryColor : secondaryColor
            });
        }

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Interpolate mouse position
            mouse.x += (mouse.targetX - mouse.x) * 0.08;
            mouse.y += (mouse.targetY - mouse.y) * 0.08;

            // Draw fluid waves
            waves.forEach((wave) => {
                wave.phase += wave.speed;
                ctx.beginPath();
                ctx.fillStyle = wave.color;

                ctx.moveTo(0, height);
                for (let x = 0; x <= width; x += 10) {
                    // Base wave calculation
                    let yOffset = Math.sin(x * wave.length + wave.phase) * wave.amplitude;

                    // Mouse interaction effect: push fluid on hover
                    if (mouse.active) {
                        const dx = x - mouse.x;
                        const distY = wave.y - mouse.y;
                        const distance = Math.sqrt(dx * dx + distY * distY);
                        if (distance < mouse.radius) {
                            const force = (mouse.radius - distance) / mouse.radius;
                            yOffset += force * 40 * (distY > 0 ? 1 : -1);
                        }
                    }

                    ctx.lineTo(x, wave.y + yOffset);
                }
                ctx.lineTo(width, height);
                ctx.closePath();
                ctx.fill();
            });

            // Draw and update interactive liquid bubbles
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;

                // Wall collision
                if (p.x < -p.radius) p.x = width + p.radius;
                if (p.x > width + p.radius) p.x = -p.radius;
                if (p.y < -p.radius) p.y = height + p.radius;
                if (p.y > height + p.radius) p.y = -p.radius;

                // Mouse gravity attraction
                if (mouse.active) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius * 1.5) {
                        p.x += dx * 0.003;
                        p.y += dy * 0.003;
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, [primaryColor, secondaryColor]);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-60 transition-opacity duration-1000"
        />
    );
}
