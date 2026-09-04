import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { FluidBackground } from '@/components/fluid-background';

export function Hero() {
    const marqueeItems = [
        "Intelligence Artificielle",
        "Marketing Digital",
        "Création d'Avatar",
        "Développement Web",
        "Montage Vidéo",
        "Copywriting",
        "Design Graphique",
        "E-commerce"
    ];

    return (
        <section
            className="relative pt-20 pb-28 overflow-hidden bg-background min-h-[90vh] flex flex-col justify-center"
            role="region"
            aria-label="Hero Liberty Creativity School"
        >
            {/* Interactive Liquid Fluid Background */}
            <FluidBackground />

            {/* Subtle radial overlay for glassmorphism and focus */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0)_0%,var(--background)_80%)]" />

            <div className="relative z-20 mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-12">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="flex flex-col items-center"
                    >
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/50 px-4 py-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase backdrop-blur-md shadow-sm dark:border-border/60">
                            <Sparkles className="h-4 w-4 text-brand-accent animate-pulse" aria-hidden="true" />
                            Nouvelle École Créative
                        </div>

                        <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-foreground mb-8 leading-[1.05] max-w-5xl">
                            Apprends des compétences <span className="text-primary bg-clip-text">concrètes</span> avec des mentors experts.
                        </h1>

                        <p className="text-lg md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl font-light">
                            Des cours immersifs de haute qualité conçus pour transformer vos passions en métiers du numérique, à votre propre rythme.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto min-w-[220px] h-14 text-base rounded-full shadow-lg hover:shadow-primary/20 transition-all duration-300 group gap-2" asChild>
                                <Link href="/courses">
                                    Parcourir les cours
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[220px] h-14 text-base rounded-full border-border/65 bg-background/30 backdrop-blur-md hover:bg-background/80 transition-all duration-300" asChild>
                                <Link href="/register">
                                    Commencer maintenant
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Categories Marquee */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="w-full overflow-hidden flex whitespace-nowrap mt-10 border-t border-b border-border/30 bg-background/10 py-5 backdrop-blur-[2px]"
                >
                    <div className="flex animate-marquee min-w-max items-center gap-12 md:gap-24 opacity-75">
                        {/* First set */}
                        {marqueeItems.map((item, idx) => (
                            <div key={`set1-${idx}`} className="flex items-center gap-3">
                                <span className={`font-bold text-xl md:text-2xl tracking-widest uppercase ${idx % 2 === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                                    {item}
                                </span>
                            </div>
                        ))}

                        {/* Duplicated set for seamless loop */}
                        {marqueeItems.map((item, idx) => (
                            <div key={`set2-${idx}`} className="flex items-center gap-3">
                                <span className={`font-bold text-xl md:text-2xl tracking-widest uppercase ${idx % 2 === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
