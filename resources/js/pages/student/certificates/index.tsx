import { Head } from '@inertiajs/react';
import { Award, Download, ExternalLink, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Certificate = {
    id: number;
    courseTitle: string;
    certificateTitle: string;
    issuerName: string;
    verificationCode: string;
    issuedAt: string | null;
    revokedAt: string | null;
    verifyUrl: string | null;
    pdfUrl: string | null;
};

type Props = {
    certificates: Certificate[];
    publicVerificationEnabled: boolean;
    pdfDownloadEnabled: boolean;
    sharingEnabled: boolean;
};

export default function CertificatesIndex({ certificates, publicVerificationEnabled, pdfDownloadEnabled, sharingEnabled }: Props) {
    const share = async (certificate: Certificate) => {
        if (!certificate.verifyUrl) return;
        if (navigator.share) {
            await navigator.share({ title: certificate.certificateTitle, text: certificate.courseTitle, url: certificate.verifyUrl });
            return;
        }
        await navigator.clipboard.writeText(certificate.verifyUrl);
    };

    return <>
        <Head title="Mes certificats" />
        <div className="mx-auto w-full max-w-[1100px] space-y-6 px-4 py-7 sm:px-6 lg:px-8">
            <div><p className="text-sm font-medium text-brand-primary">Réussites</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Mes certificats</h1><p className="mt-2 text-sm text-muted-foreground">Retrouvez les preuves de réussite délivrées par vos formations.</p></div>
            {certificates.length === 0 ? <div className="academy-surface rounded-2xl p-8 text-center"><Award className="mx-auto size-9 text-muted-foreground" /><p className="mt-3 font-medium">Aucun certificat pour le moment</p><p className="mt-1 text-sm text-muted-foreground">Ils apparaîtront ici dès qu’une formation répondra à toutes ses règles de complétion.</p></div> : <div className="grid gap-4 md:grid-cols-2">{certificates.map((certificate) => <article key={certificate.id} className="academy-surface rounded-2xl p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium uppercase tracking-wide text-brand-primary">{certificate.certificateTitle}</p><h2 className="mt-1 text-lg font-semibold">{certificate.courseTitle}</h2><p className="mt-1 text-sm text-muted-foreground">{certificate.issuerName}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${certificate.revokedAt ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'}`}>{certificate.revokedAt ? 'Révoqué' : 'Valide'}</span></div><p className="mt-4 font-mono text-xs text-muted-foreground">{certificate.verificationCode}</p><div className="mt-4 flex flex-wrap gap-2">{publicVerificationEnabled && certificate.verifyUrl ? <Button asChild size="sm" variant="outline"><a href={certificate.verifyUrl} target="_blank" rel="noreferrer"><ExternalLink className="mr-2 size-4" />Vérifier</a></Button> : null}{pdfDownloadEnabled && certificate.pdfUrl ? <Button asChild size="sm" variant="outline"><a href={certificate.pdfUrl}><Download className="mr-2 size-4" />PDF</a></Button> : null}{sharingEnabled && certificate.verifyUrl ? <Button type="button" size="sm" variant="outline" onClick={() => void share(certificate)}><Share2 className="mr-2 size-4" />Partager</Button> : null}</div></article>)}</div>}
        </div>
    </>;
}
