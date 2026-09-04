import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Home, RefreshCw, ServerCrash, ShieldX } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    status: 403 | 404 | 500 | 503;
};

type ErrorConfig = {
    title: string;
    description: string;
    icon: LucideIcon;
};

const errors: Record<number, ErrorConfig> = {
    403: {
        title: 'Accès interdit',
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
        icon: ShieldX,
    },
    404: {
        title: 'Page introuvable',
        description: "La page que vous recherchez n'existe pas ou a été déplacée.",
        icon: AlertTriangle,
    },
    500: {
        title: 'Erreur serveur',
        description: "Une erreur inattendue s'est produite. Nos équipes ont été notifiées.",
        icon: ServerCrash,
    },
    503: {
        title: 'Service indisponible',
        description: 'Le service est temporairement indisponible. Veuillez réessayer dans quelques instants.',
        icon: RefreshCw,
    },
};

export default function ErrorPage({ status }: Props) {
    const error = errors[status] ?? errors[500];
    const Icon = error.icon;

    return (
        <>
            <Head title={`${status} — ${error.title}`} />

            <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
                {/* Decorative background blob */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                    <div className="h-[40rem] w-[40rem] rounded-full bg-muted/40 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-md text-center">
                    {/* Big status number */}
                    <p className="select-none text-[9rem] font-black leading-none tracking-tighter text-muted-foreground/10">
                        {status}
                    </p>

                    {/* Icon badge */}
                    <div className="mx-auto -mt-8 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-background shadow-sm">
                        <Icon className="h-8 w-8 text-foreground/70" />
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        {error.title}
                    </h1>

                    {/* Description */}
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                        {error.description}
                    </p>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                        <Button asChild>
                            <Link href="/">
                                <Home className="h-4 w-4" />
                                Retourner à l'accueil
                            </Link>
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Page précédente
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
