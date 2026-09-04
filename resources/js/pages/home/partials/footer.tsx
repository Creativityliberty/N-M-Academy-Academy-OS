import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react';
import {
    SiFacebook,
    SiGithub,
    SiInstagram,
    SiX,
} from '@icons-pack/react-simple-icons';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, usePage } from '@inertiajs/react';
import Logo from './logo';

const footerLinks = [
    {
        title: 'Formations',
        links: [
            { label: 'YouTube', href: '/courses?category=YouTube' },
            { label: 'WordPress', href: '/courses?category=WordPress' },
            {
                label: 'Bande Dessinée',
                href: '/courses?category=Bande%20Dessin%C3%A9e',
            },
            { label: 'E-Commerce', href: '/courses?category=E-Commerce' },
        ],
    },
    {
        title: 'Plateforme',
        links: [
            { label: 'Comment ça marche', href: '/comment-ca-marche' },
            { label: 'Devenir formateur', href: '/become-trainer' },
            { label: 'Tarifs', href: '/tarifs' },
            { label: 'Blog', href: '/blog' },
        ],
    },
    {
        title: 'Communauté',
        links: [
            { label: 'Forum', href: '/communaute/forum' },
            { label: 'Événements', href: '/communaute/evenements' },
            { label: 'Témoignages', href: '/#testimonials' },
            { label: 'Newsletter', href: '#newsletter' },
        ],
    },
    {
        title: 'Légal',
        links: [
            { label: 'Confidentialité', href: '/legal/confidentialite' },
            { label: 'CGU', href: '/legal/cgu' },
            { label: 'Cookies', href: '/legal/cookies' },
            { label: 'Mentions légales', href: '/legal/mentions-legales' },
        ],
    },
];

const socialLinks = [
    { icon: SiX, label: 'Twitter', href: '#' },
    { icon: SiFacebook, label: 'Facebook', href: '#' },
    { icon: SiInstagram, label: 'Instagram', href: '#' },
    { icon: SiGithub, label: 'GitHub', href: '#' },
];

export function Footer() {
    const { academy } = usePage().props;
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer
            aria-labelledby="footer-heading"
            className="relative z-20 w-full border-t border-border bg-card/90 backdrop-blur-xl"
        >
            <h2 id="footer-heading" className="sr-only">
                Site footer
            </h2>

            {/* Main Footer Content */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
                    {/* Brand & Newsletter */}
                    <div className="lg:col-span-2">
                        <div className="mb-4 inline-flex items-center gap-3">
                            <Logo />
                        </div>

                        <p className="mb-4 max-w-md text-sm text-muted-foreground">
                            {academy?.name || 'NÜM Academy'} est votre plateforme de formation
                            premium, personnalisable et conçue pour réunir
                            apprentissage, communauté et activité dans une même
                            expérience.
                        </p>

                        {/* Newsletter */}
                        <div className="mb-4" id="newsletter">
                            <p className="mb-2 text-sm font-medium text-foreground">
                                Rejoignez notre newsletter créative
                            </p>
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Votre adresse email"
                                    className="h-10 rounded-xl border-border/60 bg-background/60 backdrop-blur placeholder:text-muted-foreground"
                                />
                                <Button
                                    size="sm"
                                    className="h-10 rounded-xl border border-border/60 bg-primary/90 px-4 text-primary-foreground shadow-sm hover:bg-primary"
                                    aria-label="Subscribe"
                                >
                                    <Mail className="h-4 w-4" aria-hidden />
                                </Button>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                                <span>Plateforme et communauté internationale</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                                <span>Contact WhatsApp disponible</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                                <span>hello@libertycreativity.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="grid grid-cols-2 gap-8 md:contents">
                        {footerLinks.map((section) => (
                            <div key={section.title}>
                                <h4 className="mb-4 text-sm font-semibold text-foreground/90">
                                    {section.title}
                                </h4>
                                <ul className="space-y-2.5">
                                    {section.links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="my-8 h-px bg-border/70" />

                {/* Bottom Bar */}
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    {/* Social Links */}
                    <div className="flex gap-2">
                        {socialLinks.map((social) => (
                            <Button
                                key={social.label}
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9 rounded-full border border-border/60 bg-background/50 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                                aria-label={social.label}
                            >
                                <social.icon className="h-4 w-4" aria-hidden />
                            </Button>
                        ))}
                    </div>

                    {/* Copyright */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                            © 2026 {academy?.name || 'NÜM Academy'}. Tous droits réservés.
                        </span>
                        <Badge variant="outline" className="text-xs">
                            {academy?.version || 'v1.6.1'}
                        </Badge>
                    </div>

                    {/* Scroll to Top */}
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 rounded-full border-border/60"
                        onClick={scrollToTop}
                        aria-label="Scroll to top"
                    >
                        <ArrowUp className="h-4 w-4" aria-hidden />
                    </Button>
                </div>
            </div>
        </footer>
    );
}
