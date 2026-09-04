import { useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { usePoll } from '@inertiajs/react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import trainer from '@/routes/trainer';

export default function BecomeTrainerSuccess() {
    const { auth } = usePage().props;
    const isTrainer = auth.user?.is_trainer ?? false;

    const { stop } = usePoll(3000, { only: ['auth'] }, { autoStart: !isTrainer });

    useEffect(() => {
        if (isTrainer) {
            stop();
            router.visit(trainer.dashboard());
        }
    }, [isTrainer]);

    return (
        <>
            <Head title="Inscription confirmée" />

            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-md space-y-6 text-center">
                    <div className="flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            Paiement confirmé !
                        </h1>

                        {isTrainer ? (
                            <p className="text-foreground/60">
                                Votre espace formateur est prêt. Redirection en cours…
                            </p>
                        ) : (
                            <p className="text-foreground/60">
                                Votre accès formateur est en cours d'activation. Cela prend quelques secondes.
                            </p>
                        )}
                    </div>

                    {!isTrainer && (
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Activation en cours…
                        </div>
                    )}

                    {!auth.user && (
                        <Button asChild className="rounded-full px-8">
                            <Link href="/login">Se connecter</Link>
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
}
