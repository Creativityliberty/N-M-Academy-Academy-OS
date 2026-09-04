import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
    Sparkles,
    BookOpen,
    UserCheck,
    GraduationCap,
    Video,
    Users,
    CheckCircle,
    ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const studentSteps = [
    {
        icon: UserCheck,
        title: '1. Créez votre compte',
        desc: 'Inscrivez-vous gratuitement et accédez immédiatement à notre mode aperçu pour essayer les premières leçons gratuitement.',
    },
    {
        icon: BookOpen,
        title: '2. Choisissez vos cours',
        desc: 'Explorez nos cours thématiques (YouTube, WordPress, Bande Dessinée, E-Commerce) et sélectionnez celui qui résonne avec votre projet créatif.',
    },
    {
        icon: Video,
        title: '3. Apprenez à votre rythme',
        desc: 'Suivez des leçons vidéo HD, téléchargez des guides de pratique et suivez des exercices concrets conçus pour vous faire progresser dans la vie réelle.',
    },
    {
        icon: GraduationCap,
        title: '4. Validez votre certificat',
        desc: "Validez chaque étape de votre progression et recevez une attestation officielle de complétion de fin d'études signée par votre enseignant.",
    },
];

const trainerSteps = [
    {
        icon: Sparkles,
        title: '1. Postulez en ligne',
        desc: 'Soumettez votre candidature avec vos réalisations. Une fois validé, vous accédez à votre plan de formateur dédié.',
    },
    {
        icon: Users,
        title: '2. Créez vos programmes',
        desc: 'Ajoutez vos cours, organisez vos leçons par modules clairs, intégrez des quiz et uploadez vos supports audios, vidéos ou PDF.',
    },
    {
        icon: CheckCircle,
        title: '3. Animez votre communauté',
        desc: 'Répondez aux questions des étudiants, proposez des ateliers en direct et suivez la progression de vos apprenants.',
    },
    {
        icon: ShieldCheck,
        title: '4. Soyez rémunéré équitablement',
        desc: "Bénéficiez d'un système de redistribution transparent et percevez directement vos gains via notre intégration Stripe sécurisée.",
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' },
    },
};

export default function HowItWorks() {
    return (
        <>
            <Head title="Comment ça marche - Liberty Creativity School" />

            <div className="relative min-h-screen bg-background pt-20 text-foreground">
                {/* Background Decor */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-primary/[0.03] blur-[130px] dark:bg-primary/[0.05]" />
                </div>

                <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 lg:px-12">
                    {/* Header */}
                    <div className="mx-auto mb-20 max-w-3xl text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/40 bg-brand-primary-soft px-4 py-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase backdrop-blur dark:bg-brand-primary-soft/20">
                            Le concept
                        </div>
                        <h1 className="mb-6 text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                            Comment fonctionne notre école ?
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Liberty Creativity School est une plateforme
                            d'apprentissage moderne qui connecte des formateurs
                            qualifiés et professionnels avec des personnes
                            souhaitant acquérir des compétences concrètes dans
                            les métiers de la création.
                        </p>
                    </div>

                    {/* Student Section */}
                    <div className="mb-24">
                        <h2 className="mb-12 text-center text-3xl font-semibold text-foreground">
                            Vous êtes apprenant
                        </h2>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
                        >
                            {studentSteps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/40 bg-background/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border/60 hover:shadow-md dark:border-border/50 dark:bg-background/40"
                                >
                                    <div>
                                        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <step.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold text-foreground">
                                            {step.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {step.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Trainer Section */}
                    <div className="mb-24">
                        <h2 className="mb-12 text-center text-3xl font-semibold text-foreground">
                            Vous êtes formateur / professionnel
                        </h2>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
                        >
                            {trainerSteps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/40 bg-background/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border/60 hover:shadow-md dark:border-border/50 dark:bg-background/40"
                                >
                                    <div>
                                        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/15 text-primary">
                                            <step.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold text-foreground">
                                            {step.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {step.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* CTA Section */}
                    <div className="mx-auto max-w-4xl rounded-3xl border border-border/40 bg-background/60 p-8 text-center shadow-md backdrop-blur-sm md:p-12">
                        <h3 className="mb-4 text-2xl font-semibold text-foreground">
                            Prêt à commencer votre apprentissage ?
                        </h3>
                        <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
                            Rejoignez dès aujourd'hui des milliers d'étudiants
                            engagés sur la voie du succès et de l'acquisition de
                            compétences réelles.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Button
                                size="lg"
                                className="rounded-full px-8"
                                asChild
                            >
                                <Link href="/courses">Découvrir les cours</Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="rounded-full border-border/40 bg-background/60 px-8"
                                asChild
                            >
                                <Link href="/become-trainer">
                                    Devenir formateur
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
