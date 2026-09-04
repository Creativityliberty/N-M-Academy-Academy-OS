import { motion, useMotionValue, useSpring, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Composant pour animer les chiffres de 0 à X
function Counter({ value, direction = "up" }: { value: string; direction?: "up" | "down" }) {
    const ref = useRef<HTMLSpanElement>(null);
    
    // Extraire uniquement les chiffres pour l'animation
    const numericPart = parseInt(value.replace(/[^0-9]/g, ''), 10);
    const nonNumericPart = value.replace(/[0-9]/g, ''); // Récupérer les %, +, k
    
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 40,
        stiffness: 80,
    });
    
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(numericPart);
        }
    }, [isInView, motionValue, numericPart]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                // Formater le nombre
                const formatted = Math.floor(latest).toLocaleString();
                ref.current.textContent = `${formatted}${nonNumericPart}`;
            }
        });
    }, [springValue, nonNumericPart]);

    return <span ref={ref}>0{nonNumericPart}</span>;
}

// Effet de lumière de carte interactif style Framer
function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setCoords({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative overflow-hidden rounded-3xl border border-border/40 bg-background/50 backdrop-blur-md transition-all duration-300 dark:border-border/10 dark:bg-foreground/[0.015] ${className}`}
        >
            {/* Spotlight Glow */}
            {isHovered && (
                <div
                    className="pointer-events-none absolute -inset-px transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(28, 51, 153, 0.08), transparent 80%)`,
                    }}
                />
            )}
            {isHovered && (
                <div
                    className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
                    style={{
                        background: `radial-gradient(120px circle at ${coords.x}px ${coords.y}px, rgba(75, 104, 255, 0.15), transparent 80%)`,
                    }}
                />
            )}
            <div className="relative z-20 h-full w-full">{children}</div>
        </div>
    );
}

const stats = [
    {
        value: '500+',
        label: 'Cours disponibles',
        detail: 'YouTube, WordPress, BD, E-Commerce...',
        gridClass: 'lg:col-span-2',
    },
    {
        value: '200+',
        label: 'Formateurs experts',
        detail: 'Professionnels du web et créateurs',
        gridClass: 'lg:col-span-1',
    },
    {
        value: '10k+',
        label: 'Étudiants actifs',
        detail: 'Communauté internationale engagée',
        gridClass: 'lg:col-span-1',
    },
    {
        value: '4.8/5',
        label: 'Note moyenne',
        detail: 'Satisfaction des apprenants',
        gridClass: 'lg:col-span-1',
    },
    {
        value: '30+',
        label: 'Thématiques couvertes',
        detail: 'Montage, SEO, No-code, Copywriting...',
        gridClass: 'lg:col-span-1',
    },
    {
        value: '100%',
        label: 'Accès illimité',
        detail: 'Cours disponibles à vie après achat',
        gridClass: 'lg:col-span-3',
    },
] as const;

export function Chiffres() {
    return (
        <section className="relative overflow-hidden bg-muted/20 py-24 md:py-32 dark:bg-background">
            {/* Blends décoratifs flous en arrière-plan */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/4 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary/[0.02] blur-[150px] dark:bg-primary/[0.05]" />
                <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-brand-primary-soft/30 blur-[130px] dark:bg-primary/[0.02]" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
                {/* En-tête */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-20 text-center"
                >
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/40 bg-brand-primary-soft px-4 py-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase backdrop-blur dark:bg-brand-primary-soft/20">
                        En chiffres
                    </div>

                    <h2 className="mb-4 text-3xl font-semibold tracking-tight text-foreground md:text-5xl max-w-3xl mx-auto leading-tight">
                        Une communauté mondiale de créateurs en pleine croissance
                    </h2>

                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
                        Des mentors passionnés, des apprenants motivés et des contenus de qualité réunis sur une seule plateforme dédiée à l'apprentissage pratique.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            className={stat.gridClass}
                        >
                            <SpotlightCard className="h-full">
                                <div className="p-8 md:p-10 flex flex-col justify-between h-full">
                                    <div>
                                        <div className="text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl bg-clip-text bg-gradient-to-br from-foreground to-foreground/75">
                                            <Counter value={stat.value} />
                                        </div>

                                        <h3 className="mt-4 text-lg md:text-xl font-semibold text-foreground">
                                            {stat.label}
                                        </h3>
                                    </div>

                                    <div className="mt-8 text-xs font-bold tracking-[0.2em] text-primary uppercase">
                                        {stat.detail}
                                    </div>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
