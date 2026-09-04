import { motion, useMotionValue, useSpring, useInView, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    CheckCircle2,
    TrendingUp,
    Users,
    Shield,
    Zap,
    Globe,
    HeartHandshake,
    Check,
    Lock,
    Sparkles,
    BarChart3,
    Compass,
    Sliders,
    HelpCircle,
} from 'lucide-react';
import { Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BecomeTrainerHeader } from './partials/become-trainer-header';
import { TrainerCard, type TrainerProfile } from './partials/trainer-card';
import type { Plan } from '@/types';
import { useRef, useEffect, useState } from 'react';

// Composant de compteur animé
function Counter({ value }: { value: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const numericPart = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    const nonNumericPart = value.replace(/[0-9]/g, '');
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { damping: 40, stiffness: 85 });
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) motionValue.set(numericPart);
    }, [isInView, motionValue, numericPart]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                const formatted = Math.floor(latest).toLocaleString();
                ref.current.textContent = `${formatted}${nonNumericPart}`;
            }
        });
    }, [springValue, nonNumericPart]);

    return <span ref={ref}>0{nonNumericPart}</span>;
}

// Carte interactive avec effet de halo (Spotlight)
function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative overflow-hidden rounded-3xl border border-border/40 bg-background/50 backdrop-blur-md transition-all duration-300 dark:border-border/10 dark:bg-foreground/[0.015] ${className}`}
        >
            {isHovered && (
                <div
                    className="pointer-events-none absolute -inset-px transition-opacity duration-350"
                    style={{
                        background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(28, 51, 153, 0.08), transparent 85%)`,
                    }}
                />
            )}
            {isHovered && (
                <div
                    className="pointer-events-none absolute -inset-px transition-opacity duration-350 z-10"
                    style={{
                        background: `radial-gradient(120px circle at ${coords.x}px ${coords.y}px, rgba(75, 104, 255, 0.12), transparent 85%)`,
                    }}
                />
            )}
            <div className="relative z-20 h-full w-full">{children}</div>
        </div>
    );
}

const benefits = [
    {
        id: 0,
        icon: TrendingUp,
        title: 'Développez votre activité',
        description:
            "Publiez vos cours et touchez des milliers d'apprenants motivés partout dans le monde francophone.",
        visual: {
            title: "Vos Statistiques d'audience",
            metric: "+324% étudiants",
            icon: BarChart3,
            color: "from-orange-500/20 to-amber-500/20 text-orange-500",
            bgGradient: "from-orange-500 to-amber-500"
        }
    },
    {
        id: 1,
        icon: Users,
        title: 'Une communauté engagée',
        description:
            'Rejoignez une plateforme dédiée à la créativité avec des étudiants réellement investis dans leur montée en compétences.',
        visual: {
            title: "Membres actifs du Hub",
            metric: "4 200+ Actifs",
            icon: Sparkles,
            color: "from-blue-500/20 to-indigo-500/20 text-blue-500",
            bgGradient: "from-blue-500 to-indigo-500"
        }
    },
    {
        id: 2,
        icon: Shield,
        title: 'Plateforme sécurisée',
        description:
            'Vos contenus sont protégés, vos paiements sécurisés et votre profil mis en valeur auprès des bons apprenants.',
        visual: {
            title: "Sécurité & Cryptage",
            metric: "Stripe Connecté",
            icon: Lock,
            color: "from-emerald-500/20 to-teal-500/20 text-emerald-500",
            bgGradient: "from-emerald-500 to-teal-500"
        }
    },
    {
        id: 3,
        icon: Zap,
        title: 'Outils simples et puissants',
        description:
            'Créez et gérez vos formations facilement depuis votre dashboard dédié, sans compétence technique.',
        visual: {
            title: "Éditeur de Cours Drag-n-Drop",
            metric: "100% Modulaire",
            icon: Sliders,
            color: "from-purple-500/20 to-pink-500/20 text-purple-500",
            bgGradient: "from-purple-500 to-pink-500"
        }
    },
    {
        id: 4,
        icon: Globe,
        title: 'Visibilité internationale',
        description:
            'Votre profil et vos cours sont référencés et promus auprès de notre communauté en constante croissance.',
        visual: {
            title: "Audience Francophone",
            metric: "Monde Entier",
            icon: Compass,
            color: "from-cyan-500/20 to-blue-500/20 text-cyan-500",
            bgGradient: "from-cyan-500 to-blue-500"
        }
    },
    {
        id: 5,
        icon: HeartHandshake,
        title: 'Support dédié',
        description:
            'Notre équipe vous accompagne à chaque étape : onboarding, création de cours et développement de votre audience.',
        visual: {
            title: "Accompagnement 24/7",
            metric: "Réponse < 2h",
            icon: HelpCircle,
            color: "from-rose-500/20 to-red-500/20 text-rose-500",
            bgGradient: "from-rose-500 to-red-500"
        }
    },
];

const steps = [
    {
        number: '01',
        title: 'Choisissez votre plan',
        description:
            'Sélectionnez l\'abonnement qui correspond à votre activité et cliquez sur "Choisir ce plan".',
    },
    {
        number: '02',
        title: 'Paiement sécurisé via Stripe',
        description:
            'Vous êtes redirigé sur Stripe pour saisir vos informations de paiement en toute sécurité.',
    },
    {
        number: '03',
        title: 'Réception de vos accès',
        description:
            'Dès le paiement confirmé, vous recevez un email avec vos identifiants pour accéder à votre espace.',
    },
    {
        number: '04',
        title: 'Publiez et développez',
        description:
            'Publiez vos formations, accueillez vos premiers étudiants et développez votre activité sur Liberty Creativity School.',
    },
];

const featuredTrainers: TrainerProfile[] = [
    {
        initials: 'LN',
        name: 'Lionel Numtema',
        specialty: 'Design Graphique · IA',
        bio: 'Directeur artistique et expert IA, Lionel enseigne la fusion créative des outils IA et du design traditionnel.',
        courseCount: 4,
        studentCount: '4 200+',
        rating: 4.9,
    },
];

export default function BecomeTrainer() {
    const { auth, plans } = usePage<{ plans: Plan[] }>().props;
    const [activeTab, setActiveTab] = useState(0);

    // Auto-rotate tabs every 6 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTab((prev) => (prev + 1) % benefits.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    function handleCheckout(slug: string) {
        if (!auth.user) {
            router.visit(`/become-trainer/checkout/${slug}`);
            return;
        }
        router.post('/become-trainer/checkout', { plan_slug: slug });
    }

    return (
        <div className="relative min-h-screen">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/[0.03] blur-[150px] dark:bg-primary/[0.06]" />
            </div>

            <div className="relative w-full px-6 py-10 md:px-10 lg:px-16 max-w-7xl mx-auto">
                {/* Header */}
                <BecomeTrainerHeader />

                {/* Stats (Bento-style with anim) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-24 grid gap-6 sm:grid-cols-3"
                >
                    {[
                        {
                            value: '10 000+',
                            label: 'Étudiants actifs',
                            detail: 'Communauté internationale',
                        },
                        {
                            value: '200+',
                            label: 'Formateurs certifiés',
                            detail: 'Experts du digital',
                        },
                        {
                            value: '4.8/5',
                            label: 'Note moyenne',
                            detail: 'Satisfaction étudiants',
                        },
                    ].map((stat, i) => (
                        <SpotlightCard key={stat.label}>
                            <div className="p-8 text-center flex flex-col justify-between h-full">
                                <div className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                                    <Counter value={stat.value} />
                                </div>
                                <div className="mt-3 text-sm font-semibold text-foreground/80">
                                    {stat.label}
                                </div>
                                <div className="mt-2 text-[10px] tracking-[0.2em] text-primary font-bold uppercase">
                                    {stat.detail}
                                </div>
                            </div>
                        </SpotlightCard>
                    ))}
                </motion.div>

                {/* Dynamic Tabs Benefits Section (Framer style) */}
                <section className="mb-28">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-14"
                    >
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/40 bg-brand-primary-soft px-4 py-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase backdrop-blur dark:bg-brand-primary-soft/20">
                            Pourquoi nous rejoindre
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl leading-tight">
                            Les avantages d'enseigner sur Liberty Creativity School
                        </h2>
                    </motion.div>

                    {/* Layout Split: Left vertical list, Right visual box */}
                    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] items-center">
                        
                        {/* Left List of Tabs */}
                        <div className="flex flex-col gap-3">
                            {benefits.map((benefit, i) => {
                                const Icon = benefit.icon;
                                const isActive = activeTab === benefit.id;

                                return (
                                    <div
                                        key={benefit.title}
                                        onClick={() => setActiveTab(benefit.id)}
                                        className={`relative cursor-pointer rounded-2xl p-5 border transition-all duration-300 flex items-start gap-4 ${isActive ? 'bg-background/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border-border/70 dark:bg-muted/10' : 'bg-transparent border-transparent opacity-60 hover:opacity-90'}`}
                                    >
                                        {/* Slider marker for Framer effect */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTabGlow"
                                                className="absolute inset-0 bg-primary/[0.015] dark:bg-white/[0.01] rounded-2xl -z-10"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}

                                        <div className={`p-3 rounded-xl border ${isActive ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted/40 text-muted-foreground border-border/40'}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <h3 className={`font-bold text-base transition-colors ${isActive ? 'text-foreground' : 'text-foreground/80'}`}>
                                                {benefit.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed max-w-lg">
                                                {benefit.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right Panel: Premium Interactive Panel matching selected tab */}
                        <div className="h-[420px] w-full rounded-3xl border border-border/40 bg-muted/20 backdrop-blur-sm dark:border-border/10 dark:bg-muted/5 flex items-center justify-center p-8 overflow-hidden shadow-2xl relative">
                            {/* Colorful glow based on selected tab */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                                <motion.div 
                                    className="h-80 w-80 rounded-full blur-[80px] bg-primary"
                                    animate={{
                                        scale: [1, 1.15, 1],
                                        opacity: [0.3, 0.45, 0.3]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                />
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -15 }}
                                    transition={{ duration: 0.35, ease: 'easeOut' }}
                                    className="relative z-10 w-full max-w-xs p-8 rounded-2xl bg-background border border-border shadow-xl flex flex-col justify-between aspect-square"
                                >
                                    {/* Card Header */}
                                    <div className="flex items-center justify-between border-b pb-3 mb-2">
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                                            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                                            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                                        </div>
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Dashboard</span>
                                    </div>

                                    {/* Middle Icon Frame */}
                                    <div className="my-auto flex flex-col items-center gap-4">
                                        <div className={`p-5 rounded-2xl bg-gradient-to-br ${benefits[activeTab].visual.bgGradient.split(' ')[0]} ${benefits[activeTab].visual.bgGradient.split(' ')[1]} text-white shadow-lg`}>
                                            {(() => {
                                                const VisualIcon = benefits[activeTab].visual.icon;
                                                return <VisualIcon className="h-10 w-10" />;
                                            })()}
                                        </div>
                                        
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-bold shadow-sm">
                                            {benefits[activeTab].visual.metric}
                                        </span>
                                    </div>

                                    {/* Footer */}
                                    <div className="text-center mt-2">
                                        <h4 className="text-sm font-bold text-foreground">
                                            {benefits[activeTab].visual.title}
                                        </h4>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">
                                            Liberty Creativity Space
                                        </p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                    </div>
                </section>

                {/* How it works */}
                <section className="mb-24 rounded-3xl border border-border/40 bg-muted/20 p-8 md:p-12 dark:border-border/10 dark:bg-foreground/[0.015] overflow-hidden relative">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/2 left-1/4 h-[300px] w-[300px] rounded-full bg-primary/[0.02] blur-[120px]" />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-14 text-center"
                    >
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/40 bg-brand-primary-soft px-4 py-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase backdrop-blur dark:bg-brand-primary-soft/20">
                            Comment rejoindre
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                            4 étapes pour démarrer
                        </h2>
                    </motion.div>

                    <div className="relative grid gap-8 lg:grid-cols-4">
                        <div className="absolute top-[2.6rem] right-0 left-0 hidden h-px bg-border/40 lg:block" />
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                className="relative flex flex-col items-center text-center lg:items-start lg:text-left group"
                            >
                                <div className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border/40 bg-background shadow-sm dark:border-border/10 transition-transform duration-500 group-hover:scale-105 group-hover:border-primary/40">
                                    <span className="text-2xl font-black text-primary/20 group-hover:text-primary/30 transition-colors">
                                        {step.number}
                                    </span>
                                    <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-md">
                                        {i + 1}
                                    </span>
                                </div>
                                <h3 className="mb-3 font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Plans (Stripe / Apple style cards) */}
                <section id="plans" className="mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-14 text-center"
                    >
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/40 bg-brand-primary-soft px-4 py-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase backdrop-blur dark:bg-brand-primary-soft/20">
                            Tarifs formateurs
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                            Choisissez votre plan
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-muted-foreground text-base">
                            Tous les plans incluent l'accès à notre plateforme,
                            vos outils de création de cours et notre support.
                            Sans engagement, résiliable à tout moment.
                        </p>
                    </motion.div>

                    <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
                        {plans.map((plan, i) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                className="h-full"
                            >
                                <div
                                    className={`relative h-full rounded-3xl border flex flex-col justify-between overflow-hidden p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${plan.highlight ? 'border-primary bg-primary/[0.02] dark:border-primary/50 dark:bg-primary/[0.04]' : 'border-border/40 bg-background/50 dark:border-border/10 dark:bg-foreground/[0.015]'}`}
                                >
                                    {plan.highlight && (
                                        <div className="absolute top-0 right-0">
                                            <span className="rounded-bl-2xl bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">
                                                Recommandé
                                            </span>
                                        </div>
                                    )}
                                    
                                    <div>
                                        <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-4">
                                            {plan.name}
                                        </p>
                                        <div className="mb-6 flex items-end gap-1">
                                            <span className="text-5xl font-black text-foreground">
                                                {plan.formatted_price}
                                            </span>
                                            <span className="mb-1.5 text-xs font-semibold text-muted-foreground uppercase">
                                                / {plan.interval_label}
                                            </span>
                                        </div>
                                        
                                        <div className="h-px bg-border/40 my-6" />

                                        <ul className="mb-8 space-y-4">
                                            {plan.features.map((feature) => (
                                                <li
                                                    key={feature}
                                                    className="flex items-start gap-3 text-sm text-foreground/80 leading-snug"
                                                >
                                                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><Check className="h-3 w-3 text-primary" /></div>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <Button
                                        className="w-full rounded-2xl h-11 text-sm font-bold tracking-wide transition-all shadow-md shadow-primary/5 active:scale-95"
                                        variant={plan.highlight ? 'default' : 'outline'}
                                        onClick={() => handleCheckout(plan.slug)}
                                    >
                                        Choisir ce plan
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Featured trainers */}
                <section className="mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/40 bg-brand-primary-soft px-4 py-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase backdrop-blur dark:bg-brand-primary-soft/20">
                            Nos formateurs
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                            Ils ont rejoint Liberty Creativity School
                        </h2>
                    </motion.div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {featuredTrainers.map((trainer, i) => (
                            <TrainerCard
                                key={trainer.name}
                                trainer={trainer}
                                index={i}
                            />
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="rounded-3xl border border-border/40 bg-background/50 px-8 py-16 text-center backdrop-blur-md md:px-20 dark:border-border/10 dark:bg-foreground/[0.01]"
                >
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/40 bg-brand-primary-soft px-4 py-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase backdrop-blur dark:bg-brand-primary-soft/20">
                        Prêt à vous lancer ?
                    </div>
                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl max-w-xl mx-auto leading-tight">
                        Rejoignez nos formateurs dès aujourd'hui
                    </h2>
                    <p className="mx-auto mb-10 max-w-lg text-muted-foreground text-base leading-relaxed">
                        Soumettez votre candidature en moins de 5 minutes. Notre
                        équipe vous répond sous 48h pour valider votre profil et
                        vous accompagner dans vos premiers pas.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button
                            size="lg"
                            className="group gap-2 rounded-full px-8 text-sm font-bold tracking-widest uppercase shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-95 transition-all"
                            onClick={() =>
                                document
                                    .getElementById('plans')
                                    ?.scrollIntoView({ behavior: 'smooth' })
                            }
                        >
                            Choisir mon abonnement
                            <ArrowRight
                                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                aria-hidden="true"
                            />
                        </Button>
                        <Button
                            size="lg"
                            variant="secondary"
                            className="rounded-full px-8 text-sm font-semibold hover:bg-background/80 transition-colors"
                            asChild
                        >
                            <Link href="/contact">Nous contacter</Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
