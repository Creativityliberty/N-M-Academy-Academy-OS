import React from 'react';
import { Head } from '@inertiajs/react';

export default function Terms() {
    return (
        <>
            <Head title="Mentions Légales - Liberty Creativity School" />
            
            <div className="relative min-h-screen pt-20">
                <div className="mx-auto max-w-4xl px-6 py-12 md:px-8">
                    <div className="border-b border-border/40 pb-6 mb-10">
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl mb-2">
                            Mentions Légales
                        </h1>
                        <p className="text-sm text-foreground/45">En vigueur le : 17 Juillet 2026</p>
                    </div>

                    <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground/80 space-y-6">
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Éditeur de la plateforme</h2>
                        <p>
                            La plateforme <strong>Liberty Creativity School</strong> est éditée par la société fictive <em>Nümtema SAS</em> au capital de 10 000 €, immatriculée au RCS de Paris sous le numéro 123 456 789.
                            <br />
                            Siège social : 12 rue de la Paix, 75002 Paris, France.
                            <br />
                            Directeur de la publication : Le Responsable Nümtema.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Hébergement du site</h2>
                        <p>
                            L'application et sa base de données sont hébergées par notre infrastructure de serveurs autonomes via l'outil de déploiement <strong>Coolify</strong> et notre fournisseur de serveurs dédiés.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Propriété intellectuelle</h2>
                        <p>
                            L'intégralité de la plateforme, incluant les logos, les chartes graphiques, l'architecture et les codes sources, est protégée par le droit d'auteur. Les contenus des formations (vidéos, audios de méditation) appartiennent exclusivement aux formateurs et ne peuvent faire l'objet d'aucune reproduction sans autorisation explicite de l'auteur.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Contact et réclamation</h2>
                        <p>
                            Pour toute demande légale ou signalement de contenu illicite, veuillez nous envoyer un courrier électronique à l'adresse de support : <strong>hello@libertycreativity.com</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
