import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, PlayCircle, Award, Sparkles, BookOpen, Layers, CheckCircle, Flame, Star, Send, TrendingUp, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const steps = [
    {
        number: '01',
        icon: Search,
        title: 'Trouvez votre formation',
        description:
            'Parcourez notre catalogue de cours en YouTube, WordPress, Bande Dessinée, Animation 2D et E-Commerce.',
    },
    {
        number: '02',
        icon: UserPlus,
        title: 'Rejoignez la plateforme',
        description:
            'Créez votre compte gratuitement pour débloquer votre accès immédiat et suivre votre progression pas-à-pas.',
    },
    {
        number: '03',
        icon: PlayCircle,
        title: 'Apprenez par la pratique',
        description:
            'Suivez des cours structurés sous forme de modules vidéo et réalisez des projets concrets avec l’aide de formateurs.',
    },
    {
        number: '04',
        icon: Award,
        title: 'Monétisez vos compétences',
        description:
            'Validez votre certificat de complétion de fin d’études et commencez à proposer vos services en Freelance ou à l’international.',
    },
] as const;

export function Process() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeStep, setActiveStep] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            const stepIndex = Math.min(
                Math.floor(latest * steps.length),
                steps.length - 1
            );
            setActiveStep(stepIndex);
        });
        return () => unsubscribe();
    }, [scrollYProgress]);

    return (
        <section ref={containerRef} className="relative bg-background">
            <div className="relative mx-auto max-w-7xl px-6 md:px-8 lg:px-12 py-24 md:py-32">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-20 text-center"
                >
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/40 bg-brand-primary-soft px-4 py-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase backdrop-blur dark:border-border/60 dark:bg-brand-primary-soft/20">
                        Comment ça marche
                    </div>

                    <h2 className="mb-4 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                        Un parcours simple et orienté résultats
                    </h2>

                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        En quelques étapes, accédez à des cours dispensés par des professionnels en activité et transformez votre passion créative en métier.
                    </p>
                </motion.div>

                {/* Sticky layout */}
                <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-24 items-start">
                    
                    {/* Left Panel: Steps list */}
                    <div className="relative flex gap-8 md:gap-12">
                        {/* Vertical Progress line */}
                        <div className="relative w-1 shrink-0 bg-muted rounded-full min-h-[500px]">
                            <motion.div 
                                className="absolute top-0 w-full bg-primary rounded-full origin-top"
                                style={{ 
                                    scaleY: scrollYProgress,
                                    height: '100%' 
                                }}
                            />
                        </div>

                        {/* Steps text items */}
                        <div className="flex flex-col gap-24 py-12">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isActive = activeStep === index;

                                return (
                                    <motion.div
                                        key={step.number}
                                        initial={{ opacity: 0.3 }}
                                        animate={{ opacity: isActive ? 1 : 0.2 }}
                                        transition={{ duration: 0.4 }}
                                        className="relative flex flex-col gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-colors duration-300 ${isActive ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border/50 bg-muted/30 text-muted-foreground'}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <span className="text-sm font-bold text-primary tracking-widest">
                                                {step.number}
                                            </span>
                                        </div>

                                        <h3 className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {step.title}
                                        </h3>

                                        <p className="text-base leading-relaxed text-muted-foreground max-w-md">
                                            {step.description}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Panel: Premium Interactive Photoshop/Framer mockups */}
                    <div className="sticky top-24 hidden lg:flex h-[520px] w-full items-center justify-center rounded-3xl border border-border/40 bg-muted/20 backdrop-blur-sm dark:border-border/50 dark:bg-muted/5 p-6 overflow-hidden shadow-2xl">
                        
                        <AnimatePresence mode="wait">
                            {activeStep === 0 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, rotate: 2 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative w-full max-w-md flex flex-col gap-4 p-6 rounded-2xl bg-background border border-border shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                                >
                                    {/* Netflix-style / SaaS card search mock */}
                                    <div className="flex items-center justify-between border-b pb-3 mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-red-400" />
                                            <div className="h-3 w-3 rounded-full bg-yellow-400" />
                                            <div className="h-3 w-3 rounded-full bg-green-400" />
                                        </div>
                                        <span className="text-xs font-semibold text-muted-foreground">libertyschool.com/catalogue</span>
                                    </div>
                                    <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-muted/30">
                                        <Search className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-foreground/80">Rechercher "Montage vidéo YouTube"...</span>
                                    </div>

                                    {/* Fake courses grid list */}
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3 p-2 border rounded-xl bg-primary/5 border-primary/20">
                                            <div className="h-12 w-16 bg-red-100 dark:bg-red-950/40 rounded-lg flex items-center justify-center text-red-500 font-bold text-xs">YT</div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold">YouTube & Premiere Pro</p>
                                                <p className="text-[10px] text-muted-foreground">Par Charles Light</p>
                                            </div>
                                            <span className="text-xs font-bold text-primary">Gratuit</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-2 border rounded-xl bg-background hover:bg-muted/10 transition-colors">
                                            <div className="h-12 w-16 bg-blue-100 dark:bg-blue-950/40 rounded-lg flex items-center justify-center text-blue-500 font-bold text-xs">WP</div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold">WordPress de Zéro</p>
                                                <p className="text-[10px] text-muted-foreground">Par Lionel Numtema</p>
                                            </div>
                                            <span className="text-xs font-bold text-primary">Gratuit</span>
                                        </div>
                                    </div>

                                    {/* Floating tags */}
                                    <motion.div 
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                        className="absolute -top-6 -right-6 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg"
                                    >
                                        <Flame className="h-3.5 w-3.5" />
                                        <span>+50 Cours</span>
                                    </motion.div>
                                </motion.div>
                            )}

                            {activeStep === 1 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, rotate: -2 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative w-full max-w-sm p-6 rounded-2xl bg-background border border-border shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col gap-4"
                                >
                                    {/* Register Form Visual */}
                                    <h3 className="text-lg font-bold tracking-tight">Créer un compte</h3>
                                    <div className="flex flex-col gap-2">
                                        <div className="h-8 w-full bg-muted/40 rounded-lg border border-border/60 px-3 flex items-center text-xs text-muted-foreground">lionel@numtema.com</div>
                                        <div className="h-8 w-full bg-muted/40 rounded-lg border border-border/60 px-3 flex items-center text-xs text-muted-foreground">••••••••••••••••</div>
                                    </div>
                                    <button className="h-10 w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-lg text-xs shadow-md shadow-primary/20 flex items-center justify-center gap-2">
                                        <span>S'inscrire gratuitement</span>
                                        <UserPlus className="h-3.5 w-3.5" />
                                    </button>

                                    {/* Success notification pop up overlay */}
                                    <motion.div 
                                        initial={{ opacity: 0, y: 30, scale: 0.8 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ delay: 0.2, type: 'spring' }}
                                        className="absolute -bottom-6 -right-6 p-4 rounded-xl bg-emerald-500 text-white border border-emerald-400 shadow-xl flex items-center gap-3"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                                            <Check className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">Compte validé !</p>
                                            <p className="text-[10px] text-white/80">Accès débloqué à 100%</p>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}

                            {activeStep === 2 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -15 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative w-full max-w-md rounded-2xl border border-border bg-background p-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                                >
                                    {/* Video Player Mock */}
                                    <div className="relative aspect-video rounded-xl bg-zinc-950 overflow-hidden flex items-center justify-center group">
                                        {/* Background fake video image thumbnail */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/60 to-purple-900/40 opacity-70" />
                                        <PlayCircle className="h-16 w-16 text-white drop-shadow-md z-10 cursor-pointer hover:scale-110 transition-transform" />
                                        
                                        {/* Player HUD controls */}
                                        <div className="absolute bottom-3 inset-x-3 flex flex-col gap-2 z-10">
                                            <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: "75%" }}
                                                    transition={{ duration: 2, ease: "easeInOut" }}
                                                    className="h-full bg-primary" 
                                                />
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] text-white/95 font-semibold">
                                                <span>14:20 / 18:45</span>
                                                <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> Module 3</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-bold">Projet créatif de fin d'étude</h4>
                                            <p className="text-xs text-muted-foreground">Envoyer au mentor pour correction</p>
                                        </div>
                                        <button className="p-2 rounded-xl bg-muted/80 border border-border/40 hover:bg-muted text-foreground/80"><Send className="h-4 w-4" /></button>
                                    </div>
                                </motion.div>
                            )}

                            {activeStep === 3 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, rotate: 3 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative w-full max-w-sm flex flex-col gap-6"
                                >
                                    {/* Certificate Visual Card */}
                                    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 text-white border border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden">
                                        {/* Shiny holographic effect overlay */}
                                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
                                        
                                        <div className="flex justify-between items-start">
                                            <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center"><Award className="h-5 w-5 text-yellow-400" /></div>
                                            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Liberty Certif</span>
                                        </div>

                                        <div className="my-6">
                                            <p className="text-xs text-zinc-400">CERTIFICAT DE COMPLÉTION</p>
                                            <h4 className="text-xl font-bold tracking-tight mt-1 text-white">Lionel Numtema</h4>
                                            <p className="text-[10px] text-zinc-500 mt-1">Spécialisation Design Graphique & IA</p>
                                        </div>

                                        <div className="border-t border-zinc-800/80 pt-4 flex justify-between items-center text-[10px] text-zinc-400">
                                            <span>ID: LCS-2026-889</span>
                                            <span className="text-emerald-400 font-bold">100% Validé</span>
                                        </div>
                                    </div>

                                    {/* Stripe Earnings visual popping up */}
                                    <motion.div 
                                        initial={{ opacity: 0, x: -30, y: 20 }}
                                        animate={{ opacity: 1, x: 0, y: 0 }}
                                        transition={{ delay: 0.3, type: 'spring' }}
                                        className="self-end -mt-8 mr-4 p-4 rounded-xl bg-background border border-border/80 shadow-lg flex items-center gap-3 w-48"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-500">
                                            <TrendingUp className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground">Revenus Freelance</p>
                                            <p className="text-sm font-bold text-foreground">+ 1 250 €</p>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
