import { CheckCircle2 } from 'lucide-react';

export type CourseLesson = {
    title: string;
    duration: string;
    free?: boolean;
};

export type CourseModule = {
    number: number;
    title: string;
    duration: string;
    lessons: CourseLesson[];
};

export type CourseTrainer = {
    initials: string;
    name: string;
    role: string;
    bio?: string;
    courseCount?: number;
    studentCount?: string;
};

export type CourseObjective = {
    icon: typeof CheckCircle2;
    title: string;
    description: string;
};

export type CourseReview = {
    initials: string;
    name: string;
    role: string;
    text: string;
    rating: number;
};

export type Course = {
    id: number;
    image: string;
    category: string;
    title: string;
    description: string;
    price: string;
    duration: string;
    language: string;
    studentCount: number;
    moduleCount: number;
    rating: number;
    featured?: boolean;
    benefits?: string[];
    modules?: CourseModule[];
    trainer?: CourseTrainer;
    objectives?: CourseObjective[];
    prerequisites?: string[];
    reviews?: CourseReview[];
};

export const allCourses: Course[] = [
    {
        id: 1,
        image: '/assets/images/course_montage_video.png',
        category: 'YouTube & Montage Vidéo',
        title: 'Maîtrisez le Montage Vidéo avec DaVinci Resolve',
        description:
            'Apprenez le montage vidéo professionnel de A à Z. Du dérushage aux effets spéciaux, en passant par l\'étalonnage couleur et le sound design.',
        price: '49 €',
        duration: '8h de contenu',
        language: 'Français',
        studentCount: 1248,
        moduleCount: 5,
        rating: 4.9,
        featured: true,
        benefits: [
            'Accès à vie',
            '8h de vidéos HD',
            'Fichiers de projet téléchargeables',
            'Exercices pratiques corrigés',
            'Attestation de complétion',
        ],
        modules: [
            {
                number: 1,
                title: 'Prise en main de DaVinci Resolve',
                duration: '1h 15 min',
                lessons: [
                    {
                        title: 'Installation et configuration de l\'interface',
                        duration: '15 min',
                        free: true,
                    },
                    {
                        title: 'Importer et organiser vos médias',
                        duration: '18 min',
                        free: true,
                    },
                    {
                        title: 'La timeline : découper, assembler, réordonner',
                        duration: '22 min',
                    },
                    {
                        title: 'Les raccourcis clavier essentiels',
                        duration: '20 min',
                    },
                ],
            },
            {
                number: 2,
                title: 'Techniques de montage avancé',
                duration: '1h 40 min',
                lessons: [
                    { title: 'Le J-cut et le L-cut', duration: '20 min' },
                    {
                        title: 'Transitions créatives et effets visuels',
                        duration: '25 min',
                    },
                    {
                        title: 'Gérer les multicams et angles de vue',
                        duration: '30 min',
                    },
                    {
                        title: 'Speed ramping et slow motion',
                        duration: '25 min',
                    },
                ],
            },
            {
                number: 3,
                title: 'Étalonnage couleur & Color Grading',
                duration: '1h 30 min',
                lessons: [
                    {
                        title: 'Comprendre les scopes et l\'exposition',
                        duration: '20 min',
                    },
                    {
                        title: 'Correction primaire : balance et contraste',
                        duration: '25 min',
                    },
                    {
                        title: 'Looks cinématographiques et LUTs',
                        duration: '25 min',
                    },
                    {
                        title: 'Power Windows et suivi de masques',
                        duration: '20 min',
                    },
                ],
            },
            {
                number: 4,
                title: 'Sound Design & Audio',
                duration: '1h 20 min',
                lessons: [
                    {
                        title: 'Nettoyage audio et réduction du bruit',
                        duration: '20 min',
                    },
                    {
                        title: 'Mixage voix-off et musique de fond',
                        duration: '25 min',
                    },
                    {
                        title: 'Effets sonores et ambiances',
                        duration: '20 min',
                    },
                    {
                        title: 'Master final et niveaux LUFS',
                        duration: '15 min',
                    },
                ],
            },
            {
                number: 5,
                title: 'Export & Publication',
                duration: '2h 15 min',
                lessons: [
                    {
                        title: 'Les formats d\'export pour YouTube, Instagram, TikTok',
                        duration: '25 min',
                    },
                    {
                        title: 'Créer des miniatures et des chapitres',
                        duration: '30 min',
                    },
                    {
                        title: 'Workflow complet : du rush au rendu final',
                        duration: '40 min',
                    },
                    {
                        title: 'Projet final : monter une vidéo complète',
                        duration: '40 min',
                    },
                ],
            },
        ],
        trainer: {
            initials: 'CL',
            name: 'Charles Light',
            role: 'Youtubeur & Monteur vidéo · 200K+ abonnés',
            bio: "Charles est créateur de contenu YouTube depuis 6 ans. Spécialisé en montage vidéo et storytelling visuel, il a formé plus de 3 000 élèves aux techniques professionnelles.",
            courseCount: 4,
            studentCount: '3 800+',
        },
        objectives: [
            {
                icon: CheckCircle2,
                title: 'Maîtriser DaVinci Resolve',
                description:
                    "Naviguer dans l'interface et utiliser tous les outils de montage essentiels.",
            },
            {
                icon: CheckCircle2,
                title: 'Créer un rendu professionnel',
                description:
                    "Appliquer l'étalonnage couleur, le sound design et les effets pour un rendu cinema.",
            },
            {
                icon: CheckCircle2,
                title: 'Optimiser votre workflow',
                description:
                    'Gagner du temps avec les raccourcis, templates et bonnes pratiques de montage.',
            },
            {
                icon: CheckCircle2,
                title: 'Publier sur toutes les plateformes',
                description:
                    'Exporter dans les bons formats pour YouTube, Instagram, TikTok et plus.',
            },
        ],
        prerequisites: [
            'Aucun prérequis',
            'Ouvert à tous, débutants bienvenus',
            'Un ordinateur avec DaVinci Resolve installé (gratuit)',
        ],
        reviews: [
            {
                initials: 'AM',
                name: 'Amélie M.',
                role: 'Créatrice YouTube — Paris',
                text: 'Ce cours m\'a permis de passer d\'un montage amateur à un rendu pro. Ma chaîne a explosé depuis !',
                rating: 5,
            },
            {
                initials: 'TC',
                name: 'Thomas C.',
                role: 'Freelance vidéo — Lyon',
                text: 'Simple, accessible et ultra complet. Sophie explique avec une clarté remarquable. Je recommande à 100 %.',
                rating: 5,
            },
            {
                initials: 'NB',
                name: 'Nathalie B.',
                role: 'Community Manager — Bordeaux',
                text: "J'avais essayé plusieurs tutos YouTube sans succès. Ce cours m'a vraiment donné les bases pour monter des vidéos de qualité.",
                rating: 4,
            },
        ],
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        category: 'WordPress & Web Design',
        title: 'Créer un Site WordPress Professionnel de A à Z',
        description:
            'Apprenez à installer, configurer et personnaliser WordPress pour créer un site vitrine ou un blog professionnel sans aucune ligne de code.',
        price: '45 €',
        duration: '9h de contenu',
        language: 'Français',
        studentCount: 876,
        moduleCount: 7,
        rating: 4.8,
        benefits: [
            'Accès à vie',
            '9h de vidéos',
            'Thème enfant offert',
            'Checklist SEO on-page',
            'Attestation de complétion',
        ],
        modules: [
            {
                number: 1,
                title: 'Installation & Hébergement',
                duration: '50 min',
                lessons: [
                    {
                        title: 'Choisir et configurer son hébergeur',
                        duration: '15 min',
                        free: true,
                    },
                    {
                        title: 'Installer WordPress en 1 clic',
                        duration: '12 min',
                        free: true,
                    },
                    {
                        title: 'Tour de l\'interface d\'administration',
                        duration: '23 min',
                    },
                ],
            },
            {
                number: 2,
                title: 'Thèmes & Personnalisation',
                duration: '1h 15 min',
                lessons: [
                    {
                        title: 'Choisir et installer un thème',
                        duration: '20 min',
                    },
                    {
                        title: 'Personnaliser avec le Full Site Editor',
                        duration: '25 min',
                    },
                    {
                        title: 'Créer un thème enfant pour les personnalisations',
                        duration: '30 min',
                    },
                ],
            },
            {
                number: 3,
                title: 'Pages, Articles & SEO',
                duration: '1h 30 min',
                lessons: [
                    {
                        title: 'Créer des pages et des articles optimisés',
                        duration: '25 min',
                    },
                    {
                        title: 'SEO on-page avec Yoast',
                        duration: '30 min',
                    },
                    {
                        title: 'Menus, widgets et sidebar',
                        duration: '35 min',
                    },
                ],
            },
        ],
        trainer: {
            initials: 'KM',
            name: 'Kiran Mehta',
            role: 'Développeur WordPress · Expert WooCommerce · 10+ ans d\'expérience',
            bio: "Kiran est développeur web senior et formateur WordPress depuis 2014. Il a créé plus de 200 sites professionnels et formé 5 000+ élèves au web design.",
            courseCount: 6,
            studentCount: '5 100+',
        },
        objectives: [
            {
                icon: CheckCircle2,
                title: 'Créer votre site de A à Z',
                description:
                    'Installer WordPress, choisir un thème et construire un site professionnel en toute autonomie.',
            },
            {
                icon: CheckCircle2,
                title: 'Optimiser pour le SEO',
                description:
                    "Configurer le référencement naturel pour apparaître dans les résultats Google.",
            },
            {
                icon: CheckCircle2,
                title: 'Sécuriser votre site',
                description:
                    'Mettre en place les bonnes pratiques de sécurité, sauvegardes et maintenance.',
            },
            {
                icon: CheckCircle2,
                title: 'Gérer en autonomie',
                description:
                    "Être autonome pour publier du contenu, gérer les mises à jour et résoudre les problèmes courants.",
            },
        ],
        prerequisites: [
            'Notions de base en informatique souhaitées',
            'Ouvert aux débutants motivés',
        ],
        reviews: [
            {
                initials: 'CL',
                name: 'Claire L.',
                role: 'Auto-entrepreneuse — Genève',
                text: "Kiran est un excellent pédagogue. J'ai créé mon site vitrine en une semaine et je reçois déjà des contacts.",
                rating: 5,
            },
            {
                initials: 'RB',
                name: 'Romain B.',
                role: 'Étudiant — Toulouse',
                text: "Sceptique au départ, j'ai été surpris par la clarté des explications. Mon portfolio est en ligne et je suis fier du résultat.",
                rating: 5,
            },
        ],
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=80',
        category: 'Bande Dessinée & Illustration',
        title: 'Dessiner sa Première BD : Du Storyboard à la Planche',
        description:
            'Maîtrisez les fondamentaux de la bande dessinée : scénarisation, mise en page, encrage et colorisation numérique sur tablette graphique.',
        price: '59 €',
        duration: '12h de contenu',
        language: 'Français',
        studentCount: 2105,
        moduleCount: 8,
        rating: 4.7,
        benefits: [
            'Accès à vie',
            '12h de vidéos pas-à-pas',
            'Brushes Procreate exclusifs',
            'Templates de planches PDF',
            'Attestation de complétion',
        ],
        modules: [
            {
                number: 1,
                title: 'Les fondamentaux de la BD',
                duration: '1h 30 min',
                lessons: [
                    {
                        title: 'Anatomie d\'une planche de BD',
                        duration: '20 min',
                        free: true,
                    },
                    {
                        title: 'Écrire un scénario et un storyboard',
                        duration: '30 min',
                        free: true,
                    },
                    { title: 'Le découpage narratif', duration: '40 min' },
                ],
            },
            {
                number: 2,
                title: 'Character Design',
                duration: '2h',
                lessons: [
                    { title: 'Créer un personnage expressif', duration: '45 min' },
                    {
                        title: 'Les proportions et les poses',
                        duration: '45 min',
                    },
                    { title: 'Model sheet et expressions faciales', duration: '30 min' },
                ],
            },
            {
                number: 3,
                title: 'Encrage & Colorisation Numérique',
                duration: '2h 30 min',
                lessons: [
                    {
                        title: 'Techniques d\'encrage sur Procreate',
                        duration: '50 min',
                    },
                    {
                        title: 'Flat colors et ombres portées',
                        duration: '50 min',
                    },
                    {
                        title: 'Lettrage et bulles de dialogue',
                        duration: '50 min',
                    },
                ],
            },
        ],
        trainer: {
            initials: 'ML',
            name: 'Marie-Laure Dubois',
            role: 'Illustratrice BD · Publiée chez Glénat & Delcourt · Formatrice tablette',
            bio: 'Marie-Laure est illustratrice professionnelle depuis 10 ans. Publiée chez les plus grands éditeurs de BD, elle forme les aspirants auteurs du storyboard à la publication.',
            courseCount: 5,
            studentCount: '6 200+',
        },
        objectives: [
            {
                icon: CheckCircle2,
                title: 'Maîtriser le storyboard',
                description:
                    "Apprendre le découpage narratif et la mise en page pour raconter une histoire en images.",
            },
            {
                icon: CheckCircle2,
                title: 'Créer vos personnages',
                description:
                    'Concevoir des personnages cohérents avec des expressions et des poses dynamiques.',
            },
            {
                icon: CheckCircle2,
                title: 'Encrer et coloriser',
                description:
                    'Réaliser un encrage propre et une colorisation numérique professionnelle sur tablette.',
            },
            {
                icon: CheckCircle2,
                title: 'Produire une planche complète',
                description:
                    'Assembler tous les éléments pour réaliser votre première planche de BD publiable.',
            },
        ],
        prerequisites: [
            'Aucun prérequis — tous niveaux bienvenus',
            'Tablette graphique recommandée (iPad + Procreate ou alternative)',
        ],
        reviews: [
            {
                initials: 'PE',
                name: 'Pierre E.',
                role: 'Passionné BD — Paris',
                text: "J'ai commencé sans aucune expérience. En 8 semaines, j'ai terminé mes 4 premières planches. Un rêve devenu réalité.",
                rating: 5,
            },
            {
                initials: 'FD',
                name: 'Florence D.',
                role: 'Graphiste — Nice',
                text: 'Les vidéos sont claires, progressives et bien filmées. Marie-Laure a un don pour rendre la BD accessible.',
                rating: 4,
            },
        ],
    },
    {
        id: 4,
        image: '/assets/images/course_ecommerce.png',
        category: 'E-Commerce & Marketing',
        title: 'Lancer sa Boutique en Ligne avec WooCommerce',
        description:
            'De l\'installation à la première vente : créez et gérez votre boutique e-commerce avec WooCommerce. Fiches produits, paiements et stratégie de lancement.',
        price: '39 €',
        duration: '7h de contenu',
        language: 'Français',
        studentCount: 632,
        moduleCount: 6,
        rating: 4.8,
        benefits: [
            'Accès à vie',
            '7h de contenu vidéo',
            'Templates de fiches produits',
            'Guide de copywriting e-commerce',
            'Attestation de complétion',
        ],
        modules: [
            {
                number: 1,
                title: 'Installer WooCommerce',
                duration: '55 min',
                lessons: [
                    {
                        title: 'Configuration initiale de WooCommerce',
                        duration: '20 min',
                        free: true,
                    },
                    {
                        title: 'Choisir son thème e-commerce',
                        duration: '15 min',
                        free: true,
                    },
                    {
                        title: 'Pages essentielles : panier, checkout, compte',
                        duration: '20 min',
                    },
                ],
            },
            {
                number: 2,
                title: 'Catalogue produits & SEO',
                duration: '1h 30 min',
                lessons: [
                    {
                        title: 'Créer des fiches produits percutantes',
                        duration: '30 min',
                    },
                    {
                        title: 'Photos produits et galeries',
                        duration: '25 min',
                    },
                    {
                        title: 'SEO e-commerce : mots-clés et méta-descriptions',
                        duration: '35 min',
                    },
                ],
            },
        ],
        trainer: {
            initials: 'VR',
            name: 'Valérie Renaud',
            role: 'Consultante E-Commerce & Copywriter · 15 ans d\'expérience',
            bio: 'Valérie est consultante en marketing digital depuis 15 ans. Elle accompagne les entrepreneurs dans la création de boutiques en ligne performantes et le copywriting de conversion.',
            courseCount: 3,
            studentCount: '2 100+',
        },
        objectives: [
            {
                icon: CheckCircle2,
                title: 'Créer votre boutique en ligne',
                description:
                    'Installer et configurer WooCommerce avec un design professionnel adapté à votre marque.',
            },
            {
                icon: CheckCircle2,
                title: 'Rédiger des fiches qui vendent',
                description:
                    "Utiliser les techniques de copywriting pour rédiger des descriptions produits persuasives.",
            },
            {
                icon: CheckCircle2,
                title: 'Configurer les paiements',
                description:
                    'Mettre en place Stripe, PayPal et les options de livraison pour vos clients.',
            },
            {
                icon: CheckCircle2,
                title: 'Lancer vos premières ventes',
                description:
                    "Définir une stratégie de lancement et attirer vos premiers clients avec le marketing digital.",
            },
        ],
        prerequisites: ['Site WordPress fonctionnel recommandé', 'Notions de base WordPress appréciées'],
        reviews: [
            {
                initials: 'HL',
                name: 'Hélène L.',
                role: 'Créatrice bijoux — Nantes',
                text: "J'ai lancé ma boutique en 2 semaines et fait mes premières ventes dès le premier mois. Merci Valérie !",
                rating: 5,
            },
            {
                initials: 'MD',
                name: 'Marc D.',
                role: 'Artisan — Strasbourg',
                text: 'Les techniques de copywriting m\'ont permis de doubler mon taux de conversion. Formation très concrète.',
                rating: 5,
            },
        ],
    },
    {
        id: 5,
        image: '/assets/images/course_design_ia.png',
        category: 'Design Graphique & IA',
        title: 'Design Graphique & Intelligence Artificielle Générative',
        description:
            "Explorez les outils d'IA générative (Midjourney, DALL·E, Firefly) pour accélérer votre processus créatif et produire des visuels professionnels.",
        price: '59 €',
        duration: '10h de contenu',
        language: 'Français',
        studentCount: 418,
        moduleCount: 7,
        rating: 4.9,
        benefits: [
            'Accès à vie',
            '10h de contenu vidéo',
            'Bibliothèque de prompts',
            'Templates Figma inclus',
            'Attestation de complétion',
        ],
        modules: [
            {
                number: 1,
                title: 'Introduction à l\'IA générative pour le design',
                duration: '1h 20 min',
                lessons: [
                    {
                        title: 'Panorama des outils IA pour designers',
                        duration: '25 min',
                        free: true,
                    },
                    {
                        title: 'Comprendre les prompts : structure et bonnes pratiques',
                        duration: '30 min',
                        free: true,
                    },
                    {
                        title: 'Les limites légales et éthiques de l\'IA',
                        duration: '25 min',
                    },
                ],
            },
            {
                number: 2,
                title: 'Midjourney & DALL·E en pratique',
                duration: '2h',
                lessons: [
                    {
                        title: 'Générer des concepts visuels avec Midjourney',
                        duration: '40 min',
                    },
                    {
                        title: 'Variantes, upscale et paramètres avancés',
                        duration: '40 min',
                    },
                    {
                        title: 'DALL·E : génération et édition d\'images',
                        duration: '40 min',
                    },
                ],
            },
        ],
        trainer: {
            initials: 'LN',
            name: 'Lionel Numtema',
            role: 'Directeur artistique · Spécialiste IA créative · Mentor expert',
            bio: "Lionel est directeur artistique et consultant en design graphique et IA. Il enseigne les méthodes de création hybrides mêlant graphisme traditionnel et technologies génératives.",
            courseCount: 4,
            studentCount: '4 200+',
        },
        objectives: [
            {
                icon: CheckCircle2,
                title: 'Maîtriser les outils IA',
                description:
                    "Utiliser Midjourney, DALL·E et Firefly pour générer des visuels de qualité professionnelle.",
            },
            {
                icon: CheckCircle2,
                title: 'Écrire des prompts efficaces',
                description:
                    'Structurer vos prompts pour obtenir des résultats précis et cohérents avec votre vision.',
            },
            {
                icon: CheckCircle2,
                title: 'Intégrer l\'IA dans votre workflow',
                description:
                    'Combiner IA générative et outils traditionnels (Figma, Photoshop) pour un workflow optimal.',
            },
            {
                icon: CheckCircle2,
                title: 'Créer des visuels uniques',
                description:
                    'Développer un style visuel personnel en utilisant l\'IA comme outil créatif, pas comme béquille.',
            },
        ],
        prerequisites: [
            'Notions de base en design graphique appréciées',
            'Ouvert à tous les profils créatifs',
        ],
        reviews: [
            {
                initials: 'SV',
                name: 'Sarah V.',
                role: 'Graphiste freelance — Montpellier',
                text: 'Cette formation a révolutionné ma façon de travailler. Je produis 3x plus vite sans sacrifier la qualité.',
                rating: 5,
            },
        ],
    },
    {
        id: 6,
        image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=800&q=80',
        category: 'Formations Certifiantes',
        title: 'Devenir Freelance Créatif : De l\'Idée au Premier Client',
        description:
            "Un parcours complet pour lancer votre activité de freelance créatif : positionnement, portfolio, prospection, tarification et gestion administrative.",
        price: '49 €',
        duration: '8h de contenu',
        language: 'Français',
        studentCount: 753,
        moduleCount: 6,
        rating: 4.8,
        benefits: [
            'Accès à vie',
            '8h de contenu vidéo',
            'Templates de devis & factures',
            'Guide de prospection complet',
            'Attestation de complétion',
        ],
        modules: [
            {
                number: 1,
                title: 'Se positionner sur le marché',
                duration: '1h',
                lessons: [
                    {
                        title: 'Identifier sa niche et sa proposition de valeur',
                        duration: '25 min',
                        free: true,
                    },
                    {
                        title: 'Analyser la concurrence et se différencier',
                        duration: '20 min',
                        free: true,
                    },
                    {
                        title: 'Définir ses tarifs : TJM vs forfait',
                        duration: '15 min',
                    },
                ],
            },
            {
                number: 2,
                title: 'Construire son portfolio en ligne',
                duration: '1h 30 min',
                lessons: [
                    {
                        title: 'Les plateformes portfolio : Behance, Dribbble, site perso',
                        duration: '30 min',
                    },
                    {
                        title: 'Rédiger des études de cas percutantes',
                        duration: '30 min',
                    },
                    {
                        title: 'Optimiser son profil LinkedIn',
                        duration: '30 min',
                    },
                ],
            },
        ],
        trainer: {
            initials: 'AB',
            name: 'Antoine Bourget',
            role: 'Consultant freelance · Formateur en entrepreneuriat créatif · 15 ans d\'expérience',
            bio: 'Antoine est consultant et formateur en entrepreneuriat créatif. Il a accompagné plus de 500 freelances dans le lancement de leur activité et la construction de leur marque personnelle.',
            courseCount: 7,
            studentCount: '4 400+',
        },
        objectives: [
            {
                icon: CheckCircle2,
                title: 'Définir votre positionnement',
                description:
                    'Identifier votre niche, vos forces et votre proposition de valeur unique sur le marché.',
            },
            {
                icon: CheckCircle2,
                title: 'Construire votre portfolio',
                description:
                    "Créer un portfolio en ligne convaincant qui attire vos clients idéaux.",
            },
            {
                icon: CheckCircle2,
                title: 'Prospecter efficacement',
                description:
                    'Trouver et convertir vos premiers clients grâce à des techniques de prospection ciblées.',
            },
            {
                icon: CheckCircle2,
                title: 'Gérer votre activité',
                description:
                    'Maîtriser les aspects administratifs, financiers et juridiques du freelancing.',
            },
        ],
        prerequisites: [
            'Ouvert à tous les profils créatifs',
            'Une compétence créative à vendre (design, vidéo, web, etc.)',
        ],
        reviews: [
            {
                initials: 'JM',
                name: 'Julien M.',
                role: 'Freelance vidéo — Rennes',
                text: "Antoine ne survend pas, il donne des conseils concrets. J'ai signé mon premier client un mois après la fin du cours.",
                rating: 5,
            },
            {
                initials: 'CB',
                name: 'Camille B.',
                role: 'Illustratrice — Marseille',
                text: "Un équilibre parfait entre stratégie et pratique. J'ai enfin osé me lancer en freelance grâce à cette formation.",
                rating: 5,
            },
        ],
    },
];
