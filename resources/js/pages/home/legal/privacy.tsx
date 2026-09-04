import React from 'react';
import { Head } from '@inertiajs/react';

export default function Privacy() {
    return (
        <>
            <Head title="Politique de Confidentialité - Liberty Creativity School" />
            
            <div className="relative min-h-screen pt-20">
                <div className="mx-auto max-w-4xl px-6 py-12 md:px-8">
                    <div className="border-b border-border/40 pb-6 mb-10">
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl mb-2">
                            Politique de Confidentialité
                        </h1>
                        <p className="text-sm text-foreground/45">Dernière mise à jour : 17 Juillet 2026</p>
                    </div>

                    <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground/80 space-y-6">
                        <p>
                            Chez <strong>Liberty Creativity School</strong>, nous accordons une importance primordiale à la protection de vos données personnelles et au respect de votre vie privée. Cette politique de confidentialité détaille les informations que nous collectons, comment nous les utilisons et vos droits à cet égard.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Collecte des données personnelles</h2>
                        <p>
                            Nous collectons les informations nécessaires à votre inscription, à votre suivi de formation et au traitement de vos paiements. Ces informations incluent notamment :
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Votre nom complet et votre adresse e-mail.</li>
                            <li>Vos informations de profil (nom du formateur, biographie le cas échéant).</li>
                            <li>Vos historiques d'achats et de complétion de leçons.</li>
                            <li>Vos identifiants de facturation et de paiement de manière sécurisée via Stripe.</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Utilisation des données</h2>
                        <p>
                            Les données collectées sont utilisées pour :
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Gérer et valider votre compte utilisateur.</li>
                            <li>Vous fournir l'accès aux leçons et cours achetés (y compris en mode aperçu).</li>
                            <li>Assurer le suivi pédagogique des formations.</li>
                            <li>Traiter vos paiements Stripe de manière cryptée et sécurisée.</li>
                            <li>Vous envoyer des notifications de suivi ou des réponses à vos questions.</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Partage des données</h2>
                        <p>
                            Vos données ne sont jamais revendues à des tiers. Elles sont uniquement partagées avec nos partenaires indispensables au bon fonctionnement de la plateforme (Stripe pour le paiement sécurisé et notre hébergeur web). Les formateurs ont accès aux noms et progrès des étudiants inscrits à leurs cours.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Vos droits</h2>
                        <p>
                            Conformément aux réglementations européennes (RGPD), vous disposez d'un droit d'accès, de rectification, de portabilité et d'effacement de vos données personnelles. Vous pouvez exercer ce droit à tout moment en modifiant votre profil ou en nous contactant via notre adresse e-mail de support.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Contact</h2>
                        <p>
                            Pour toute question concernant la protection de vos données personnelles ou pour faire valoir vos droits, vous pouvez nous écrire à : <strong>hello@libertycreativity.com</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
