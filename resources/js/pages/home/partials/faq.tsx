import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus } from 'lucide-react';

const questions = [
    {
        question: 'Comment accéder aux cours sur Liberty Creativity School ?',
        reponse:
            'Créez un compte gratuit, parcourez notre catalogue de formations et achetez le cours de votre choix. Vous y accédez immédiatement depuis votre espace personnel, à vie.',
    },
    {
        question: 'Les cours sont-ils accessibles sur mobile ?',
        reponse:
            'Oui, la plateforme est entièrement responsive. Vous pouvez suivre vos formations depuis n’importe quel appareil : smartphone, tablette ou ordinateur, à n’importe quelle heure.',
    },
    {
        question: 'Comment devenir formateur sur Liberty Creativity School ?',
        reponse:
            'Soumettez votre candidature depuis la page "Devenir formateur". Notre équipe évalue votre profil et expertise. Une fois accepté, vous activez votre abonnement formateur et publiez vos cours.',
    },
    {
        question: 'Quel est le coût pour les formateurs ?',
        reponse:
            'Les formateurs paient un abonnement mensuel (Plan Pro) pour accéder à la publication de cours sans commission, ou choisissent le Plan Libre gratuit par commission. Les détails sont disponibles sur la page de tarification.',
    },
    {
        question: 'Quelle est la politique de remboursement ?',
        reponse:
            'Si vous n’êtes pas satisfait d’un cours dans les 7 jours suivant l’achat et que vous avez visionné moins de 30 % du contenu, vous pouvez demander un remboursement complet.',
    },
    {
        question: 'Les formations sont-elles certifiantes ?',
        reponse:
            'Oui, nos formations proposent une attestation de complétion officielle délivrée par Liberty Creativity School, validant les compétences acquises durant le parcours.',
    },
    {
        question: 'Puis-je interagir avec mon formateur ?',
        reponse:
            'Oui. Vous pouvez poser des questions via l’espace commentaires de chaque leçon, participer à des forums d’entraide ou échanger avec la communauté.',
    },
    {
        question: 'Comment les formateurs sont-ils sélectionnés ?',
        reponse:
            'Chaque candidature formateur est examinée par notre équipe. Nous vérifions les réalisations professionnelles et la qualité pédagogique des supports pour garantir le meilleur niveau d’apprentissage.',
    },
] as const;

export default function FAQ() {
    const [ouvert, setOuvert] = useState<number | null>(null);

    return (
        <section className="relative bg-muted/30 py-24 md:py-32 dark:bg-foreground/[0.02]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute bottom-0 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-foreground/[0.02] blur-[130px] dark:bg-foreground/[0.04]" />
            </div>

            <div className="relative mx-auto max-w-3xl px-6 md:px-8 lg:px-12">
                {/* en-tête */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-14 text-center"
                >
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/40 bg-brand-primary-soft px-4 py-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase backdrop-blur dark:bg-brand-primary-soft/20">
                        Questions fréquentes
                    </div>

                    <h2 className="mb-4 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                        Toutes vos questions, répondues
                    </h2>

                    <p className="mx-auto max-w-xl text-lg text-muted-foreground">
                        Étudiants ou formateurs, retrouvez les réponses aux questions les plus fréquentes sur les cours, les abonnements et le fonctionnement de la plateforme.
                    </p>
                </motion.div>

                {/* accordéon */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="flex flex-col gap-3"
                >
                    {questions.map((item, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm dark:border-border/50 dark:bg-background/50"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setOuvert(ouvert === index ? null : index)
                                }
                                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                                aria-expanded={ouvert === index}
                            >
                                <span className="text-sm font-semibold text-foreground md:text-base">
                                    {item.question}
                                </span>

                                <span
                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/40 bg-background/60 text-foreground/60 transition-transform duration-300 dark:border-border/50 dark:bg-background/40 ${
                                        ouvert === index ? 'rotate-45' : ''
                                    }`}
                                    aria-hidden="true"
                                >
                                    <Plus className="h-4 w-4" />
                                </span>
                            </button>

                            <AnimatePresence initial={false}>
                                {ouvert === index && (
                                    <motion.div
                                        key="content"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            ease: 'easeInOut',
                                        }}
                                    >
                                        <div className="border-t border-border/30 px-6 pt-4 pb-5 text-sm leading-relaxed text-muted-foreground">
                                            {item.reponse}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
