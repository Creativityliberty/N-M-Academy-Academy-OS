import { Head } from '@inertiajs/react';
import { Award, CheckCircle2, Copy, Download, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    certificate: {
        recipientName: string;
        courseTitle: string;
        issuerName: string;
        certificateTitle: string;
        verificationCode: string;
        issuedAt: string | null;
        revokedAt: string | null;
        revocationReason: string | null;
        valid: boolean;
        pdfUrl: string;
    };
};

export default function CertificateVerify({ certificate }: Props) {
    const copyLink = async () => navigator.clipboard.writeText(window.location.href);

    return <>
        <Head title={`Vérification — ${certificate.courseTitle}`} />
        <main className="min-h-screen bg-background px-4 py-12 sm:px-6">
            <div className="mx-auto max-w-3xl">
                <section className="academy-surface overflow-hidden rounded-[calc(var(--radius)*1.5)] border p-6 text-center shadow-sm sm:p-10">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary"><Award className="size-7" /></div>
                    <p className="mt-5 text-sm font-medium uppercase tracking-[0.18em] text-brand-primary">{certificate.issuerName}</p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{certificate.certificateTitle}</h1>
                    <p className="mt-7 text-sm text-muted-foreground">Ce certificat atteste que</p>
                    <p className="mt-2 text-2xl font-semibold">{certificate.recipientName}</p>
                    <p className="mt-5 text-sm text-muted-foreground">a satisfait aux exigences de la formation</p>
                    <p className="mt-2 text-xl font-semibold">{certificate.courseTitle}</p>

                    <div className={`mx-auto mt-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${certificate.valid ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-destructive/10 text-destructive'}`}>
                        {certificate.valid ? <CheckCircle2 className="size-4" /> : <ShieldX className="size-4" />}
                        {certificate.valid ? 'Certificat valide' : 'Certificat révoqué'}
                    </div>
                    {!certificate.valid && certificate.revocationReason && <p className="mx-auto mt-3 max-w-lg text-sm text-destructive">{certificate.revocationReason}</p>}

                    <div className="mt-8 rounded-xl bg-muted/45 p-4 text-left"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Code de vérification</p><p className="mt-1 break-all font-mono text-sm">{certificate.verificationCode}</p></div>
                    <div className="mt-6 flex flex-wrap justify-center gap-2"><Button asChild><a href={certificate.pdfUrl}><Download className="mr-2 size-4" />Télécharger le PDF</a></Button><Button type="button" variant="outline" onClick={() => void copyLink()}><Copy className="mr-2 size-4" />Copier le lien</Button></div>
                </section>
            </div>
        </main>
    </>;
}
