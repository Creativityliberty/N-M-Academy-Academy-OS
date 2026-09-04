import { ThinkingOrb } from 'thinking-orbs';
import { cn } from '@/lib/utils';

export type ThinkingOrbVisualState =
    | 'working'
    | 'searching'
    | 'solving'
    | 'listening'
    | 'connecting'
    | 'weaving'
    | 'composing'
    | 'breathing'
    | 'shaping';

type Props = {
    state: ThinkingOrbVisualState;
    size?: number;
    label?: string;
    className?: string;
};

export function ThinkingOrbVisual({
    state,
    size = 64,
    label,
    className,
}: Props) {
    const validSize = size > 128 ? 128 : size;

    return (
        <span
            className={cn('inline-grid shrink-0 place-items-center', className)}
            data-orb-provider="thinking-orbs"
            data-orb-state={state}
            aria-hidden={label ? undefined : true}
        >
            <ThinkingOrb
                state={state}
                size={validSize}
                theme="auto"
                aria-label={label}
            />
        </span>
    );
}

import { useEffect, useRef } from 'react';

export function CosmicOrbCanvas({ className, size = 320 }: { className?: string; size?: number }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationFrameId: number;
        const dpr = window.devicePixelRatio || 2;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);

        const radius = (size / 2) * 0.78;
        const centerX = size / 2;
        const centerY = size / 2;

        const pointCount = 95;
        const points: Array<{ origX: number; origY: number; origZ: number }> = [];

        for (let i = 0; i < pointCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / pointCount);
            const theta = Math.sqrt(pointCount * Math.PI) * phi;
            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(phi);

            points.push({ origX: x, origY: y, origZ: z });
        }

        let rotX = 0.2;
        let rotY = 0;

        const render = (time: number) => {
            rotY += 0.005;
            rotX = 0.2 + Math.sin(time * 0.0006) * 0.12;

            ctx.clearRect(0, 0, size, size);

            // 1. Soft glowing outer atmosphere
            const outerGlow = ctx.createRadialGradient(
                centerX,
                centerY,
                radius * 0.2,
                centerX,
                centerY,
                radius * 1.25,
            );
            outerGlow.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
            outerGlow.addColorStop(0.5, 'rgba(16, 185, 129, 0.09)');
            outerGlow.addColorStop(0.85, 'rgba(217, 119, 6, 0.03)');
            outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = outerGlow;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 1.25, 0, Math.PI * 2);
            ctx.fill();

            // 2. Translucent glass sphere backplate
            const sphereBody = ctx.createRadialGradient(
                centerX - radius * 0.35,
                centerY - radius * 0.35,
                radius * 0.05,
                centerX,
                centerY,
                radius,
            );
            sphereBody.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            sphereBody.addColorStop(0.3, 'rgba(240, 250, 255, 0.7)');
            sphereBody.addColorStop(0.7, 'rgba(210, 242, 232, 0.35)');
            sphereBody.addColorStop(1, 'rgba(170, 215, 205, 0.15)');
            ctx.fillStyle = sphereBody;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();

            // 3. Rotate 3D points
            const cosX = Math.cos(rotX);
            const sinX = Math.sin(rotX);
            const cosY = Math.cos(rotY);
            const sinY = Math.sin(rotY);

            const projectedPoints = points.map((pt) => {
                const x1 = pt.origX * cosY - pt.origZ * sinY;
                const z1 = pt.origZ * cosY + pt.origX * sinY;

                const y2 = pt.origY * cosX - z1 * sinX;
                const z2 = z1 * cosX + pt.origY * sinX;

                const scale = (z2 + radius * 2.2) / (radius * 3.2);

                return {
                    x: centerX + x1,
                    y: centerY + y2,
                    z: z2,
                    scale: Math.max(0.35, scale),
                    alpha: (z2 + radius) / (radius * 2),
                };
            });

            // 4. Draw interconnected filaments
            const maxDistance = radius * 0.68;
            for (let i = 0; i < projectedPoints.length; i++) {
                for (let j = i + 1; j < projectedPoints.length; j++) {
                    const p1 = projectedPoints[i];
                    const p2 = projectedPoints[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dz = p1.z - p2.z;
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < maxDistance) {
                        const lineAlpha = (1 - dist / maxDistance) * 0.45 * Math.min(p1.alpha, p2.alpha);
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);

                        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                        grad.addColorStop(0, `rgba(14, 165, 233, ${lineAlpha})`);
                        grad.addColorStop(0.6, `rgba(16, 185, 129, ${lineAlpha * 1.25})`);
                        grad.addColorStop(1, `rgba(245, 158, 11, ${lineAlpha * 0.8})`);

                        ctx.strokeStyle = grad;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            // 5. Draw glowing nodes
            projectedPoints.forEach((pt) => {
                const nodeRadius = 1.6 * pt.scale;
                const opacity = Math.min(1, Math.max(0.18, pt.alpha));

                ctx.beginPath();
                ctx.arc(pt.x, pt.y, nodeRadius * 2.8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(56, 189, 248, ${opacity * 0.4})`;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(pt.x, pt.y, nodeRadius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(16, 185, 129, ${opacity * 0.95})`;
                ctx.fill();
            });

            // 6. Delicate glass rim highlight
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius + 1, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(14, 165, 233, 0.2)';
            ctx.lineWidth = 1;
            ctx.stroke();

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [size]);

    return (
        <div className={`relative inline-flex items-center justify-center ${className || ''}`}>
            <canvas
                ref={canvasRef}
                style={{ width: `${size}px`, height: `${size}px` }}
                className="pointer-events-none drop-shadow-[0_16px_40px_rgba(16,185,129,0.18)]"
            />
        </div>
    );
}
