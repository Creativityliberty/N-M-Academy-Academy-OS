import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Check, HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const pricingPlans = [
    {
        name: "Apprenant",
        price: "À la carte",
        period: "par formation",
        description: "Achetez uniquement les formations qui vous intéressent, sans engagement ni abonnement récurrent.",
        ctaText: "Découvrir les cours",
        ctaHref: "/courses",
        popular: false,
        features: [
            "Accès illimité et à vie",
            "Mode aperçu gratuit (leçons offertes)",
            "Supports audios, vidéos & PDF téléchargeables",
            "Échanges directs avec les formateurs dans l'espace cours",
            "Attestation de complétion officielle",
            "Garantie satisfait ou remboursé 14 jours"
        ]
    },
    {
        name: "Formateur - Plan Pro",
        price: "29 €",
        period: "par mois",
        description: "Pour les professionnels et formateurs souhaitant optimiser leurs gains avec 0% de commission.",
        ctaText: "Rejoindre en tant que Pro",
        ctaHref: "/become-trainer",
        popular: true,
        features: [
            "0% de commission sur vos ventes",
            "Hébergement vidéo illimité de vos cours",
            "Outils de création complets (modules, leçons)",
            "Accès aux statistiques de ventes détaillées",
            "Intégration et paiement direct via Stripe Connect",
            "Support technique prioritaire 7j/7"
        ]
    },
    {
        name: "Formateur - Plan Libre",
        price: "Gratuit",
        period: "à vie",
        description: "Démarrez sereinement sans frais fixes. Nous prélevons une simple commission sur vos ventes.",
        ctaText: "Démarrez gratuitement",
        ctaHref: "/become-trainer",
        popular: false,
        features: [
            "15% de commission sur vos ventes",
            "Hébergement vidéo illimité de vos cours",
            "Outils de création complets",
            "Paiements Stripe Connect automatisés",
            "Support technique standard sous 48h",
            "Sans engagement, résiliable à tout moment"
        ]
    }
];

const faqs = [
    {
        q: "Comment fonctionne le mode aperçu gratuit ?",
        a: "Chaque formation dispose de leçons désignées gratuites par le formateur. Vous pouvez vous inscrire et suivre ces leçons immédiatement sans sortir votre carte de crédit."
    },
    {
        q: "Y a-t-il des frais cachés ou d'inscription ?",
        a: "Non. Pour les apprenants, vous ne payez que le prix affiché de la formation. Pour les formateurs, vous choisissez entre un plan gratuit à la commission ou un forfait mensuel sans engagement."
    },
    {
        q: "Comment sont gérés les paiements et la facturation ?",
        a: "Tous nos paiements sont traités de manière sécurisée par Stripe. Vous recevez une facture par e-mail immédiatement après chaque transaction."
    },
    {
        q: "Puis-je changer de plan formateur à tout moment ?",
        a: "Tout à fait. Vous pouvez passer du plan Libre au plan Pro (ou inversement) à tout moment depuis votre tableau de bord sans frais de résiliation."
    }
];

export default function Pricing() {
    return (
        <>
            <Head title="Tarifs transparents - Liberty Creativity School" />
            
            <div className="relative min-h-screen pt-20 bg-background text-foreground">
                {/* Background Decor */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/3 left-1/3 h-[420px] w-[420px] rounded-full bg-primary/[0.025] blur-[140px] dark:bg-primary/[0.05]" />
                </div>

                <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 lg:px-12">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/40 bg-brand-primary-soft px-4 py-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase backdrop-blur dark:bg-brand-primary-soft/20">
                            Tarifs transparents
                        </div>
                        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl mb-6">
                            Des formules claires, adaptées à chacun
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Que vous soyez apprenant ou formateur, nous croyons en une tarification juste et sans engagement pour développer vos compétences.
                        </p>
                    </div>

                    {/* Pricing Cards Grid */}
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto mb-24">
                        {pricingPlans.map((plan, idx) => (
                            <Card 
                                key={idx} 
                                className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border ${plan.popular ? 'border-primary bg-primary/[0.02] shadow-lg dark:bg-primary/[0.03]' : 'border-border/40 bg-background/50'} p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-4 right-4">
                                        <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground uppercase">
                                            Recommandé
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                                    <div className="mb-4 flex items-baseline gap-1">
                                        <span className="text-4xl font-bold tracking-tight text-foreground">{plan.price}</span>
                                        <span className="text-sm font-medium text-foreground/50">{plan.period}</span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-muted-foreground mb-6">{plan.description}</p>
                                    <hr className="border-border/30 mb-6" />
                                    <ul className="space-y-3.5 mb-8">
                                        {plan.features.map((feat, fidx) => (
                                            <li key={fidx} className="flex items-start gap-2.5 text-sm text-foreground/75">
                                                <Check className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Button 
                                    className={`w-full rounded-full ${plan.popular ? '' : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'}`}
                                    asChild
                                >
                                    <Link href={plan.ctaHref}>
                                        {plan.ctaText}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </Card>
                        ))}
                    </div>

                    {/* FAQ section */}
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-semibold text-foreground text-center mb-12 flex items-center justify-center gap-2">
                            <HelpCircle className="h-7 w-7 text-primary" /> Questions fréquentes sur les tarifs
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-2">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="rounded-2xl border border-border/40 bg-background/50 p-6 backdrop-blur-sm dark:bg-background/40">
                                    <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
