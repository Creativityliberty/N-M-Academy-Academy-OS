import React from 'react';
import { Head } from '@inertiajs/react';

export default function Cookies() {
    return (
        <>
            <Head title="Politique des Cookies - Liberty Creativity School" />
            
            <div className="relative min-h-screen pt-20">
                <div className="mx-auto max-w-4xl px-6 py-12 md:px-8">
                    <div className="border-b border-border/40 pb-6 mb-10">
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl mb-2">
                            Politique de Gestion des Cookies
                        </h1>
                        <p className="text-sm text-foreground/45">Dernière mise à jour : 17 Juillet 2026</p>
                    </div>

                    <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground/80 space-y-6">
                        <p>
                            Cette politique explique comment <strong>Liberty Creativity School</strong> utilise des traceurs et des cookies sur notre site afin de vous proposer une expérience d'apprentissage fluide et de sécuriser vos transactions.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Qu'est-ce qu'un cookie ?</h2>
                        <p>
                            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette ou smartphone) lors de votre visite sur un site internet. Il permet au site de se souvenir de vos choix (par exemple votre identifiant de connexion) pendant une durée de validité limitée.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Cookies utilisés sur la plateforme</h2>
                        <p>
                            Nous utilisons uniquement des cookies techniques essentiels et de confort :
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Cookies de Session (Essentiels)</strong> : Permettent de vous maintenir connecté à votre espace étudiant ou formateur tout au long de votre visite.</li>
                            <li><strong>Cookies de Préférences (Optionnels)</strong> : Retiennent des paramètres comme votre préférence de thème d'apparence (clair ou sombre).</li>
                            <li><strong>Cookies de Sécurité (Essentiels)</strong> : Nécessaires à la détection et la prévention des fraudes de paiement avec notre partenaire Stripe.</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Consentement et paramétrage</h2>
                        <p>
                            Les cookies essentiels requis pour le fonctionnement de la base de données et la sécurité des paiements Stripe ne nécessitent pas de consentement préalable. Vous pouvez désactiver l'ensemble des cookies dans les options de configuration de votre navigateur, cependant cela risquerait d'empêcher votre connexion au site et l'achat de cours.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
