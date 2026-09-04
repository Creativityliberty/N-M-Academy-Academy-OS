export type Article = {
  id: number
  image: string
  categories: string[]
  titre: string
  description: string
  duree: string
  date: string
  featured?: boolean
}

export const allArticles: Article[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1400&q=80',
    categories: ['YouTube', 'Montage'],
    titre: 'Les 8 étapes pour lancer une chaîne YouTube rentable en 2025',
    description: 'Guide complet pour démarrer sur YouTube : de la niche au premier revenu. Stratégie de contenu, référencement, miniatures et monétisation décryptés pas à pas.',
    duree: '10 min',
    date: '3 juin 2025',
    featured: true,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    categories: ['WordPress', 'Web'],
    titre: 'Comment créer un site WordPress professionnel sans coder',
    description: 'Du choix de l\'hébergeur à la mise en ligne : les meilleurs thèmes, plugins essentiels et bonnes pratiques pour un site vitrine ou un blog performant.',
    duree: '8 min',
    date: '28 mai 2025',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=900&q=80',
    categories: ['Bande Dessinée', 'Art'],
    titre: 'Dessiner sa première planche de BD : guide du débutant',
    description: 'Storyboard, mise en page, encrage et colorisation numérique : toutes les étapes pour réaliser votre première planche de bande dessinée sur tablette.',
    duree: '6 min',
    date: '20 mai 2025',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80',
    categories: ['E-Commerce', 'Marketing'],
    titre: 'WooCommerce : lancer sa boutique en ligne de A à Z',
    description: 'Configuration de WooCommerce, rédaction de fiches produits persuasives, passerelles de paiement et stratégie de lancement pour votre première boutique.',
    duree: '11 min',
    date: '14 mai 2025',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=900&q=80',
    categories: ['Design', 'IA'],
    titre: 'Intelligence Artificielle et Design : les outils qui changent tout',
    description: 'Midjourney, DALL·E, Firefly : comment intégrer l\'IA générative dans votre workflow de design graphique pour gagner en créativité et en productivité.',
    duree: '9 min',
    date: '7 mai 2025',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=900&q=80',
    categories: ['SEO', 'Copywriting'],
    titre: 'SEO pour créateurs : les fondamentaux pour être trouvé sur Google',
    description: 'Recherche de mots-clés, structure de contenu, balisage et backlinks : les techniques SEO essentielles pour les créateurs de contenu indépendants.',
    duree: '14 min',
    date: '30 avr. 2025',
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=80',
    categories: ['Montage', 'Tutoriel'],
    titre: '5 techniques de montage pro à maîtriser sur DaVinci Resolve',
    description: 'Étalonnage couleur, cut dynamique, transitions fluides, sound design et export : les techniques indispensables pour un rendu professionnel.',
    duree: '5 min',
    date: '22 avr. 2025',
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=900&q=80',
    categories: ['Freelance', 'Carrière'],
    titre: 'Devenir freelance créatif : construire son portfolio et trouver ses premiers clients',
    description: 'Stratégies éprouvées pour se lancer en freelance : positionnement, portfolio en ligne, prospection et tarification de vos services créatifs.',
    duree: '7 min',
    date: '15 avr. 2025',
  },
]

export const trendingArticles = [
  { id: 1, titre: 'Monétiser YouTube : les 5 sources de revenus méconnues', categorie: 'YouTube' },
  { id: 5, titre: 'WordPress vs Webflow : quel outil choisir en 2025 ?', categorie: 'WordPress' },
  { id: 7, titre: 'Copywriting : la méthode AIDA pour vendre en ligne', categorie: 'E-Commerce' },
]

export type SidebarSection =
  | { type: 'item'; label: string; value: string }
  | { type: 'group'; label: string; items: { label: string; value: string }[] }

export const sidebarSections: SidebarSection[] = [
  { type: 'item', label: 'YouTube',           value: 'YouTube' },
  { type: 'item', label: 'WordPress',         value: 'WordPress' },
  {
    type: 'group',
    label: 'Création visuelle',
    items: [
      { label: 'Bande Dessinée',    value: 'Bande Dessinée' },
      { label: 'Design Graphique',  value: 'Design' },
      { label: 'Art & Illustration', value: 'Art' },
    ],
  },
  {
    type: 'group',
    label: 'Montage & Production',
    items: [
      { label: 'Montage Vidéo',     value: 'Montage' },
      { label: 'Tutoriels',         value: 'Tutoriel' },
    ],
  },
  {
    type: 'group',
    label: 'Business & Marketing',
    items: [
      { label: 'E-Commerce',        value: 'E-Commerce' },
      { label: 'SEO & Copywriting', value: 'SEO' },
      { label: 'Marketing Digital', value: 'Marketing' },
    ],
  },
  {
    type: 'group',
    label: 'Carrière',
    items: [
      { label: 'Freelance',         value: 'Freelance' },
      { label: 'Intelligence Artificielle', value: 'IA' },
    ],
  },
]
