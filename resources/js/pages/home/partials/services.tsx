import { motion, useMotionValue, useTransform, animate, type PanInfo } from 'framer-motion';
import {
    Video,
    Globe,
    PenTool,
    ShoppingBag,
    Palette,
    GraduationCap,
    ArrowLeft,
    ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const services = [
    {
        icon: Video,
        title: 'YouTube & Montage Vidéo',
        description:
            'Construisez une identité forte, produisez du contenu de qualité et monétisez durablement votre audience.',
        href: '/courses?category=YouTube',
        color: 'from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20',
        iconColor: 'text-red-500',
    },
    {
        icon: Globe,
        title: 'WordPress & Web-Design',
        description:
            'Apprenez à maîtriser WordPress, Elementor et les meilleures extensions pour lancer des sites web professionnels sans coder.',
        href: '/courses?category=WordPress',
        color: 'from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20',
        iconColor: 'text-blue-500',
    },
    {
        icon: PenTool,
        title: 'Bande Dessinée & Illustration',
        description:
            'Découvrez les bases du dessin, du storyboard à la création finale de vos planches de BD et illustrations numériques.',
        href: '/courses?category=Bande%20Dessin%C3%A9e',
        color: 'from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20',
        iconColor: 'text-purple-500',
    },
    {
        icon: ShoppingBag,
        title: 'E-Commerce & Marketing',
        description:
            'Maîtrisez les leviers indispensables du commerce en ligne, de la recherche de produits au copywriting persuasif.',
        href: '/courses?category=E-Commerce',
        color: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20',
        iconColor: 'text-emerald-500',
    },
    {
        icon: Palette,
        title: 'Design Graphique & AI',
        description:
            'Intégrez les outils d’intelligence artificielle dans votre processus de création graphique et de design visuel.',
        href: '/courses',
        color: 'from-amber-500/10 to-yellow-500/10 dark:from-amber-500/20 dark:to-yellow-500/20',
        iconColor: 'text-amber-500',
    },
    {
        icon: GraduationCap,
        title: 'Formations Certifiantes',
        description:
            'Des parcours pédagogiques structurés conçus par des experts pour valider vos compétences par une certification.',
        href: '/courses',
        color: 'from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/20 dark:to-violet-500/20',
        iconColor: 'text-indigo-500',
    },
] as const;

export function Services() {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [maxDrag, setMaxDrag] = useState(0);
    const dragX = useMotionValue(0);

    const updateMaxDrag = () => {
        if (carouselRef.current) {
            const scrollWidth = carouselRef.current.scrollWidth;
            const clientWidth = carouselRef.current.clientWidth;
            setMaxDrag(Math.min(0, clientWidth - scrollWidth));
        }
    };

    useEffect(() => {
        updateMaxDrag();
        window.addEventListener('resize', updateMaxDrag);
        return () => window.removeEventListener('resize', updateMaxDrag);
    }, []);

    const handleDragEnd = (event: any, info: PanInfo) => {
        const velocityFactor = 0.2;
        const targetX = dragX.get() + info.velocity.x * velocityFactor;
        const boundedX = Math.max(maxDrag, Math.min(0, targetX));
        
        animate(dragX, boundedX, {
            type: 'spring',
            stiffness: 300,
            damping: 30,
        });
    };

    const slide = (direction: 'left' | 'right') => {
        if (!carouselRef.current) return;
        const clientWidth = carouselRef.current.clientWidth;
        const step = clientWidth * 0.75;
        const currentX = dragX.get();
        const targetX = direction === 'left' ? currentX + step : currentX - step;
        const boundedX = Math.max(maxDrag, Math.min(0, targetX));

        animate(dragX, boundedX, {
            type: 'spring',
            stiffness: 150,
            damping: 20,
        });
    };

    return (
        <section className="relative py-24 md:py-32 bg-bg-soft overflow-hidden">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/[0.04] blur-[140px] dark:bg-primary/[0.08]" />
                <div className="absolute bottom-0 left-1/4 h-[350px] w-[350px] rounded-full bg-brand-primary-soft/30 blur-[120px] dark:bg-primary/[0.04]" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
                <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div className="max-w-2xl">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/40 bg-brand-primary-soft px-4 py-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase backdrop-blur dark:border-border/60 dark:bg-brand-primary-soft/20">
                            Nos Formations
                        </div>

                        <h2 className="mb-4 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                            Des compétences concrètes pour l'avenir
                        </h2>

                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Glissez à travers notre catalogue de catégories conçues par des formateurs professionnels pour propulser vos projets créatifs et techniques.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full border-border/40 hover:bg-background/80 active:scale-95 transition-transform"
                            onClick={() => slide('left')}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full border-border/40 hover:bg-background/80 active:scale-95 transition-transform"
                            onClick={() => slide('right')}
                        >
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <div 
                    ref={carouselRef}
                    className="relative cursor-grab active:cursor-grabbing select-none"
                    style={{ overflow: 'visible' }}
                >
                    <motion.div
                        drag="x"
                        dragConstraints={{ left: maxDrag, right: 0 }}
                        style={{ x: dragX }}
                        onDragEnd={handleDragEnd}
                        className="flex gap-6 w-max py-4 px-2"
                    >
                        {services.map((service, index) => {
                            const Icon = service.icon;

                            return (
                                <motion.div
                                    key={service.title}
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.08 }}
                                    className="w-[280px] sm:w-[320px] shrink-0"
                                >
                                    <Link href={service.href} className="block h-full">
                                        <Card className="group relative h-full border-border/40 bg-background/70 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(28,51,153,0.08)] dark:hover:shadow-[0_20px_50px_rgba(75,104,255,0.12)] overflow-hidden dark:border-border/50 dark:bg-background/40">
                                            <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r \${service.color}`} />
                                            
                                            <CardContent className="p-8">
                                                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br \${service.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner`}>
                                                    <Icon
                                                        className={`h-7 w-7 \${service.iconColor}`}
                                                        aria-hidden="true"
                                                    />
                                                </div>

                                                <h3 className="mb-3 text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                                                    {service.title}
                                                </h3>

                                                <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-muted-foreground/90 transition-colors">
                                                    {service.description}
                                                </p>

                                                <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <span>Explorer la catégorie</span>
                                                    <ArrowRight className="h-3.5 w-3.5 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
