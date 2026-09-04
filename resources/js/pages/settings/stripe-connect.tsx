import { Head, router, usePage } from '@inertiajs/react';
import trainer from '@/routes/trainer';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import StripeConnectController from '@/actions/App/Http/Controllers/Trainer/StripeConnectController';
import { CheckCircle2Icon, AlertCircleIcon, ExternalLinkIcon } from 'lucide-react';

type PageProps = {
    has_account: boolean;
    stripe_onboarding_completed: boolean;
};

export default function StripeConnect() {
    const { has_account, stripe_onboarding_completed } = usePage<PageProps>().props;

    const isActive = has_account && stripe_onboarding_completed;
    const isPaused = has_account && !stripe_onboarding_completed;
    const isNew    = !has_account;

    function handleDisconnect() {
        router.delete(StripeConnectController.disconnect.url(), { preserveScroll: true });
    }

    return (
        <>
            <Head title="Stripe Connect" />

            <div className="space-y-6">
                <Heading
                    title="Stripe Connect"
                    description="Connectez votre compte Stripe pour recevoir vos revenus directement."
                />

                <Separator />

                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground">Statut</span>
                        {isActive && (
                            <Badge className="gap-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" variant="outline">
                                <CheckCircle2Icon className="size-3.5" />
                                Connecté et actif
                            </Badge>
                        )}
                        {isPaused && (
                            <Badge className="gap-1.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" variant="outline">
                                <AlertCircleIcon className="size-3.5" />
                                Déconnecté — compte existant
                            </Badge>
                        )}
                        {isNew && (
                            <Badge className="gap-1.5 bg-muted text-muted-foreground" variant="outline">
                                <AlertCircleIcon className="size-3.5" />
                                Non connecté
                            </Badge>
                        )}
                    </div>

                    {isNew && (
                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Connectez votre compte Stripe pour recevoir les paiements de vos formations. Stripe vous guidera étape par étape — aucune information technique requise.
                            </p>
                            <Button asChild>
                                <a href={StripeConnectController.onboard.url()}>
                                    <ExternalLinkIcon className="mr-2 size-4" />
                                    Connecter mon compte Stripe
                                </a>
                            </Button>
                        </div>
                    )}

                    {isPaused && (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Votre compte Stripe existe déjà. Cliquez ci-dessous pour le reconnecter — aucune information à ressaisir.
                            </p>
                            <Button asChild>
                                <a href={StripeConnectController.onboard.url()}>
                                    <ExternalLinkIcon className="mr-2 size-4" />
                                    Reconnecter mon compte Stripe
                                </a>
                            </Button>
                        </div>
                    )}

                    {isActive && (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Votre compte Stripe est actif. Les paiements vous seront reversés automatiquement selon le calendrier Stripe.
                            </p>
                            <Button variant="destructive" onClick={handleDisconnect}>
                                Déconnecter Stripe
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

StripeConnect.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: trainer.dashboard() },
        { title: 'Stripe Connect', href: trainer.stripeConnect.edit() },
    ],
};
