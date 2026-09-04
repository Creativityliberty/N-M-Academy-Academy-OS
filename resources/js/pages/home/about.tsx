import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { motion, type Variants } from 'framer-motion';
import {
    Heart,
    Sparkles,
    Lightbulb,
    GraduationCap,
    Users,
    ArrowRight,
    Globe,
} from 'lucide-react';

/* ── données ─────────────────────────────────────────────── */

const timeline = [
    {
        annee: '2023',
        titre: 'Naissance de Liberty Creativity School',
        description:
            "Fondée à Paris par une équipe de créatifs professionnels et d'experts du numérique, Liberty Creativity School naît d'une conviction : rendre la création numérique et les compétences web concrètes accessibles à tous.",
    },
    {
        annee: '2024',
        titre: 'Premiers formateurs',
        description:
            "Sélection et intégration de formateurs reconnus sur YouTube et dans l'écosystème du marketing digital. Lancement des premières masterclasses en montage vidéo et WordPress.",
    },
    {
        annee: '2025',
        titre: 'Croissance de la communauté',
        description:
            "Franchissement du cap des 5 000 étudiants actifs. Lancement des spécialisations en Intelligence Artificielle et en E-Commerce pour accompagner les créateurs africains et francophones.",
    },
    {
        annee: '2026',
        titre: 'Expansion internationale',
        description:
            "Déploiement auprès de la communauté francophone mondiale. Plus de 200 formateurs professionnels, 500 leçons disponibles et 10 000 étudiants formés dans 30 pays.",
    },
];

const equipe = [
    {
        initiales: 'LN',
        nom: 'Lionel Numtema',
        role: 'Fondateur & Directeur Vision',
        bio: 'Entrepreneur passionné de nouvelles technologies et d’apprentissage en ligne. Lionel guide le développement de la plateforme pour en faire le hub de la créativité.',
    },
    {
        initiales: 'FO',
        nom: 'Fabie Olliveaud',
        role: 'Co-fondatrice & Directrice Produit',
        bio: 'Créatrice digitale chevronnée. Fabie allie expertise technique et pédagogie pour concevoir des parcours d’apprentissage fluides et orientés résultats.',
    },
];

const valeurs = [
    {
        icon: Heart,
        titre: 'Accompagnement',
        description:
            "Chaque étudiant est unique. Nous concevons un environnement bienveillant avec une communauté active pour guider chacun vers son indépendance financière.",
    },
    {
        icon: Sparkles,
        titre: 'Pratique',
        description:
            "Nos cours ne se contentent pas d'expliquer : ils font faire. Apprenez en construisant de réels projets prêts pour le marché du travail.",
    },
    {
        icon: Lightbulb,
        titre: 'Innovation',
        description:
            "Les outils numériques évoluent constamment. Nous mettons continuellement à jour nos formations pour intégrer l'IA, le web moderne et le marketing de pointe.",
    },
    {
        icon: GraduationCap,
        titre: 'Résultats',
        description:
            "Notre but ultime est de vous aider à transformer votre talent en revenus. Chaque étape de la formation est pensée pour être monétisable.",
    },
];

/* ── variants ────────────────────────────────────────────── */

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease: 'easeOut' },
    },
};

const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

/* ── composant ───────────────────────────────────────────── */

export default function About() {
    return (
        <div className="relative min-h-screen bg-background">
            {/* ── Hero ───────────────────────────────────────────── */}
            <section className="relative overflow-hidden py-32 md:py-44">
                {/* background image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/images/about_studio.jpg"
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full object-cover opacity-15"
                    />
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
                </div>

                <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/40 bg-brand-primary-soft px-4 py-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase backdrop-blur dark:bg-brand-primary-soft/20">
                            Qui sommes-nous
                        </div>
                        <h1 className="mb-6 text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
                            Créer, innover,{' '}
                            <span className="text-primary">
                                transformer
                            </span>
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
                            Liberty Creativity School est la plateforme de référence dédiée à l'apprentissage de la création digitale, du développement web et du marketing de contenu, réunissant des professionnels du terrain pour former l'avenir de la création.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        className="mt-10 flex flex-wrap items-center justify-center gap-4"
                    >
                        <div className="flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-5 py-2.5 text-sm backdrop-blur">
                            <GraduationCap className="h-4 w-4 text-primary/70" />
                            <span className="font-semibold text-foreground">
                                10 000+
                            </span>
                            <span className="text-muted-foreground">
                                créateurs formés
                            </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-5 py-2.5 text-sm backdrop-blur">
                            <Users className="h-4 w-4 text-primary/70" />
                            <span className="font-semibold text-foreground">
                                50+
                            </span>
                            <span className="text-muted-foreground">
                                mentors actifs
                            </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-5 py-2.5 text-sm backdrop-blur">
                            <Globe className="h-4 w-4 text-primary/70" />
                            <span className="font-semibold text-foreground">
                                30+
                            </span>
                            <span className="text-muted-foreground">
                                pays représentés
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Histoire / Timeline ────────────────────────────── */}
            <section className="relative py-24 md:py-32 bg-bg-soft">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/2 right-0 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary/[0.2] blur-[160px] dark:bg-primary/[0.06]" />
                </div>

                <div className="relative mx-auto max-w-5xl px-4 md:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="mb-16 text-center"
                    >
                        <p className="mb-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                            Depuis 2023
                        </p>
                        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                            Notre histoire
                        </h2>
                    </motion.div>

                    {/* timeline verticale */}
                    <div className="relative">
                        {/* ligne centrale desktop */}
                        <div className="absolute top-0 left-1/2 hidden h-full w-px -translate-x-1/2 bg-border lg:block" />

                        <div className="flex flex-col gap-12">
                            {timeline.map((item, i) => (
                                <motion.div
                                    key={item.annee}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: '-60px' }}
                                    variants={fadeUp}
                                    className={`relative flex flex-col gap-4 lg:flex-row lg:gap-0 ${
                                        i % 2 === 0
                                            ? 'lg:flex-row'
                                            : 'lg:flex-row-reverse'
                                    }`}
                                >
                                    {/* contenu */}
                                    <div
                                        className={`lg:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:pl-12'}`}
                                    >
                                        <Card className="border-border/40 bg-background/60 backdrop-blur-sm dark:border-border/50 dark:bg-background/50">
                                            <CardContent className="p-6">
                                                <p className="mb-1 text-xs font-bold tracking-[0.2em] text-primary/80 uppercase">
                                                    {item.annee}
                                                </p>
                                                <h3 className="mb-2 text-lg font-semibold text-foreground">
                                                    {item.titre}
                                                </h3>
                                                <p className="text-sm leading-relaxed text-muted-foreground">
                                                    {item.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* nœud central */}
                                    <div className="hidden lg:flex lg:w-16 lg:shrink-0 lg:items-center lg:justify-center">
                                        <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary/45 bg-background text-xs font-bold text-primary">
                                            {String(i + 1).padStart(2, '0')}
                                        </div>
                                    </div>

                                    {/* espace vide côté opposé */}
                                    <div className="hidden lg:block lg:w-[calc(50%-2rem)]" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Équipe ─────────────────────────────────────────── */}
            <section className="relative py-24 md:py-32">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/2 left-0 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-foreground/[0.02] blur-[150px]" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 md:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="mb-16 text-center"
                    >
                        <p className="mb-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                            Les personnes derrière la plateforme
                        </p>
                        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                            Notre équipe
                        </h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        variants={stagger}
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-3xl mx-auto"
                    >
                        {equipe.map((membre) => (
                            <motion.div key={membre.nom} variants={fadeUp}>
                                <Card className="group h-full border-border/40 bg-background/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-border/60 hover:shadow-lg dark:border-border/50 dark:bg-background/50">
                                    <CardContent className="p-6">
                                        {/* avatar */}
                                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-lg font-semibold text-primary">
                                            {membre.initiales}
                                        </div>
                                        <h3 className="mb-1 font-semibold text-foreground">
                                            {membre.nom}
                                        </h3>
                                        <p className="mb-4 text-xs font-medium text-primary/85">
                                            {membre.role}
                                        </p>
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {membre.bio}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Valeurs ────────────────────────────────────────── */}
            <section className="relative py-24 md:py-32 bg-bg-soft">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.03] blur-[180px] dark:bg-primary/[0.07]" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 md:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="mb-16 text-center"
                    >
                        <p className="mb-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                            Ce qui nous guide
                        </p>
                        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                            Nos valeurs
                        </h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        variants={stagger}
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {valeurs.map((val) => {
                            const Icon = val.icon;
                            return (
                                <motion.div key={val.titre} variants={fadeUp}>
                                    <Card className="h-full border-border/40 bg-background/60 backdrop-blur-sm dark:border-border/50 dark:bg-background/50">
                                        <CardContent className="p-8">
                                            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                                                <Icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <h3 className="mb-3 text-lg font-semibold text-foreground">
                                                {val.titre}
                                            </h3>
                                            <p className="text-sm leading-relaxed text-muted-foreground">
                                                {val.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ── CTA ────────────────────────────────────────────── */}
            <section className="relative py-20 md:py-28">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="mx-auto max-w-3xl px-4 text-center md:px-6"
                >
                    <h2 className="mb-5 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                        Rejoignez la Liberty Creativity School
                    </h2>
                    <p className="mb-10 text-lg text-muted-foreground">
                        Que vous souhaitiez acquérir des compétences concrètes, partager votre expertise en tant que formateur ou poser une question, notre équipe est là pour vous guider.
                    </p>
                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                        <Button
                            size="lg"
                            className="gap-2 rounded-full px-8"
                            asChild
                        >
                            <Link href="/contact">
                                Nous contacter
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="gap-2 rounded-full border-border/40 bg-background/60 px-8 backdrop-blur hover:bg-background/80"
                            asChild
                        >
                            <Link href="/courses">
                                Voir les formations
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
