import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const avis = [
    {
        initiales: 'SM',
        nom: 'Sophie M.',
        role: 'Étudiante',
        entreprise: 'Cours YouTube & Montage',
        contenu:
            "Grâce aux cours de montage vidéo sur Liberty Creativity School, j'ai lancé ma chaîne YouTube et atteint 5 000 abonnés en trois mois. La qualité des formateurs est vraiment remarquable.",
    },
    {
        initiales: 'KD',
        nom: 'Karim D.',
        role: 'Formateur expert',
        entreprise: 'Développeur WordPress',
        contenu:
            "J'ai rejoint Liberty Creativity School comme formateur et en quelques semaines, j'ai pu toucher des centaines d'apprenants motivés. La plateforme est intuitive et l'équipe très réactive.",
    },
    {
        initiales: 'AL',
        nom: 'Amélie L.',
        role: 'Étudiante',
        entreprise: 'Programme Bande Dessinée',
        contenu:
            "Le cours sur la création de BD m'a permis de publier ma première planche en ligne. Je me sens plus confiante dans mon trait et ma narration visuelle depuis que je pratique.",
    },
    {
        initiales: 'YB',
        nom: 'Youssef B.',
        role: 'Formateur',
        entreprise: 'Expert E-Commerce',
        contenu:
            "L'abonnement formateur est vraiment accessible et me permet de me concentrer sur ce que j'aime : enseigner. Mes revenus ont progressé régulièrement chaque mois.",
    },
    {
        initiales: 'CN',
        nom: 'Céline N.',
        role: 'Étudiante',
        entreprise: 'Design Graphique & AI',
        contenu:
            "J'accède à mes cours quand je veux, depuis mon téléphone ou mon ordinateur. C'est exactement ce dont j'avais besoin pour progresser en design graphique à mon rythme.",
    },
    {
        initiales: 'MB',
        nom: 'Marie-Claire B.',
        role: 'Formatrice',
        entreprise: 'Copywriter certifiée',
        contenu:
            "Publier mes formations sur Liberty Creativity School m'a permis de développer ma clientèle en ligne sans contrainte technique. Le support est disponible et la communauté est bienveillante.",
    },
] as const;

const avisLoop = [...avis, ...avis];

export default function Testimonials() {
    return (
        <section className="relative overflow-hidden py-24 md:py-32">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-1/3 h-[400px] w-[400px] rounded-full bg-primary/[0.03] blur-[140px] dark:bg-primary/[0.05]" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
                <div className="mb-16 text-center">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/40 bg-brand-primary-soft px-4 py-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase backdrop-blur dark:bg-brand-primary-soft/20">
                        Ils témoignent
                    </div>

                    <h2 className="mb-4 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                        Étudiants et formateurs nous font confiance
                    </h2>

                    <p className="mx-auto max-w-xl text-lg text-muted-foreground">
                        Des apprenants qui montent en compétences, des formateurs
                        qui développent leur activité. Découvrez leurs
                        expériences sur Liberty Creativity School.
                    </p>
                </div>
            </div>

            <div className="relative overflow-hidden">
                <motion.div
                    className="flex w-max gap-5 px-6 md:px-8 lg:px-12"
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{
                        duration: 30,
                        ease: 'linear',
                        repeat: Infinity,
                    }}
                >
                    {avisLoop.map((temoignage, index) => (
                        <div
                            key={`${temoignage.nom}-${index}`}
                            className="flex min-h-[260px] w-[320px] shrink-0 flex-col gap-5 rounded-2xl border border-border/40 bg-background/60 p-7 backdrop-blur-sm dark:border-border/50 dark:bg-background/50"
                        >
                            <Quote
                                className="h-7 w-7 text-primary/40"
                                aria-hidden="true"
                            />

                            <p className="flex-1 text-sm leading-relaxed text-foreground/70">
                                {temoignage.contenu}
                            </p>

                            <div className="flex items-center gap-3 border-t border-border/30 pt-5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                    {temoignage.initiales}
                                </div>

                                <div>
                                    <div className="text-sm font-semibold text-foreground">
                                        {temoignage.nom}
                                    </div>

                                    <div className="text-xs text-foreground/50">
                                        {temoignage.role} ·{' '}
                                        {temoignage.entreprise}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
