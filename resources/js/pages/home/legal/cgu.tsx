import React from 'react';
import { Head } from '@inertiajs/react';

export default function CGU() {
    return (
        <>
            <Head title="Conditions Générales d'Utilisation - Liberty Creativity School" />
            
            <div className="relative min-h-screen pt-20">
                <div className="mx-auto max-w-4xl px-6 py-12 md:px-8">
                    <div className="border-b border-border/40 pb-6 mb-10">
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl mb-2">
                            Conditions Générales d'Utilisation (CGU)
                        </h1>
                        <p className="text-sm text-foreground/45">Dernière mise à jour : 17 Juillet 2026</p>
                    </div>

                    <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground/80 space-y-6">
                        <p>
                            Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme <strong>Liberty Creativity School</strong>. En créant un compte ou en naviguant sur le site, vous acceptez sans réserve ces conditions.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Description des services</h2>
                        <p>
                            La plateforme propose un espace d'apprentissage en ligne composé de leçons gratuites et payantes, ainsi qu'un espace de création de contenu pour les formateurs certifiés. Les cours peuvent être consultés à tout moment via le compte étudiant de l'utilisateur.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Inscription et sécurité du compte</h2>
                        <p>
                            Pour utiliser nos services, vous devez créer un compte en fournissant des informations exactes et complètes. Vous êtes seul responsable du maintien de la confidentialité de vos identifiants de connexion. Toute utilisation suspecte de votre compte doit nous être signalée immédiatement.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Achat de formations & Remboursement</h2>
                        <p>
                            Les prix des cours sont fixés librement par les formateurs et affichés toutes taxes comprises. L'accès à la formation payante est débloqué immédiatement après validation du paiement par Stripe. Vous disposez d'un droit de rétractation de 14 jours, à condition de ne pas avoir complété plus de 20% des leçons payantes de la formation.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Propriété intellectuelle</h2>
                        <p>
                            Tous les contenus (vidéos, supports PDF, audios de sophrologie, textes et structures) présents sur le site sont la propriété exclusive de leurs auteurs respectifs (les formateurs) ou de la plateforme. Tout téléchargement non autorisé, revente ou diffusion publique est strictement interdit et passible de poursuites judiciaires.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Résiliation du compte</h2>
                        <p>
                            Vous pouvez supprimer votre compte à tout moment depuis votre tableau de bord. Liberty Creativity School se réserve le droit de suspendre ou supprimer tout compte d'utilisateur en cas de non-respect flagrant des présentes CGU.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
