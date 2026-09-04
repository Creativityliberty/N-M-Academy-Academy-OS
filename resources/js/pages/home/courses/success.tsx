import { useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { usePoll } from '@inertiajs/react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import student from '@/routes/student';

export default function CoursePurchaseSuccess() {
    const { auth } = usePage().props;
    const isStudent = auth.user?.is_student ?? false;

    const { stop } = usePoll(3000, { only: ['auth'] }, { autoStart: !isStudent });

    useEffect(() => {
        if (isStudent) {
            stop();
            router.visit(student.dashboard());
        }
    }, [isStudent]);

    return (
        <>
            <Head title="Achat confirmé" />

            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-md space-y-6 text-center">
                    <div className="flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Paiement confirmé !
                        </h1>

                        {isStudent ? (
                            <p className="text-muted-foreground">
                                Votre accès est prêt. Redirection vers vos formations…
                            </p>
                        ) : (
                            <p className="text-muted-foreground">
                                Votre accès à la formation est en cours d'activation. Cela prend quelques secondes.
                            </p>
                        )}
                    </div>

                    {!isStudent && (
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Activation en cours…
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
