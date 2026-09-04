import { Head, Link, router } from '@inertiajs/react';
import { Award, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DashboardHero } from '@/components/dashboard-hero';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Primitive = { id: number; title: string; required: boolean };
type Certificate = { id: number; recipientName: string; verificationCode: string; issuedAt: string | null; revokedAt: string | null; revocationReason: string | null; verifyUrl: string };
type Props = {
    course: { id: number; title: string };
    policy: { requireAllAccessibleLessons: boolean; certificateEnabled: boolean; certificateTitle: string | null; issuerName: string | null };
    assessments: Primitive[];
    assignments: Primitive[];
    stats: { completionCount: number; certificateCount: number; activeCertificateCount: number };
    certificates: Certificate[];
};

export default function CompletionSettings({ course, policy, assessments, assignments, stats, certificates }: Props) {
    const [requireLessons, setRequireLessons] = useState(policy.requireAllAccessibleLessons);
    const [certificateEnabled, setCertificateEnabled] = useState(policy.certificateEnabled);
    const [certificateTitle, setCertificateTitle] = useState(policy.certificateTitle ?? '');
    const [issuerName, setIssuerName] = useState(policy.issuerName ?? '');
    const [assessmentIds, setAssessmentIds] = useState<number[]>(assessments.filter((item) => item.required).map((item) => item.id));
    const [assignmentIds, setAssignmentIds] = useState<number[]>(assignments.filter((item) => item.required).map((item) => item.id));
    const [revokeReasons, setRevokeReasons] = useState<Record<number, string>>({});

    const toggle = (id: number, values: number[], setter: (value: number[]) => void) => setter(values.includes(id) ? values.filter((value) => value !== id) : [...values, id]);
    const save = () => router.put(`/trainer/courses/${course.id}/completion`, {
        require_all_accessible_lessons: requireLessons,
        certificate_enabled: certificateEnabled,
        certificate_title: certificateTitle || null,
        issuer_name: issuerName || null,
        assessment_required_ids: assessmentIds,
        assignment_required_ids: assignmentIds,
    }, { preserveScroll: true });
    const active = useMemo(() => certificates.filter((certificate) => !certificate.revokedAt), [certificates]);

    return <>
        <Head title={`Complétion & certificats — ${course.title}`} />
        <div className="mx-auto w-full max-w-[1180px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <Link href={`/trainer/courses/${course.id}/edit`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Course Builder</Link>
            <DashboardHero eyebrow="Learning Primitives · M14.3" title="Complétion & certificats" description={`Définissez les preuves nécessaires pour terminer « ${course.title} » et délivrer un certificat vérifiable.`} />

            <div className="grid gap-4 sm:grid-cols-3">
                <div className="academy-surface rounded-2xl p-5"><p className="text-sm text-muted-foreground">Formations complétées</p><p className="mt-2 text-3xl font-semibold">{stats.completionCount}</p></div>
                <div className="academy-surface rounded-2xl p-5"><p className="text-sm text-muted-foreground">Certificats émis</p><p className="mt-2 text-3xl font-semibold">{stats.certificateCount}</p></div>
                <div className="academy-surface rounded-2xl p-5"><p className="text-sm text-muted-foreground">Certificats valides</p><p className="mt-2 text-3xl font-semibold">{stats.activeCertificateCount}</p></div>
            </div>

            <section className="academy-surface space-y-6 rounded-2xl p-5 sm:p-6">
                <div><h2 className="text-lg font-semibold">Règles de réussite</h2><p className="text-sm text-muted-foreground">Seules les preuves accessibles au tier de l’étudiant sont prises en compte.</p></div>
                <label className="flex items-start gap-3 rounded-xl border p-4"><input type="checkbox" className="mt-1" checked={requireLessons} onChange={(event) => setRequireLessons(event.target.checked)} /><span><strong>Leçons accessibles</strong><span className="block text-sm text-muted-foreground">Exiger toutes les leçons accessibles via le niveau d’accès de l’étudiant.</span></span></label>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div><h3 className="font-semibold">Évaluations obligatoires</h3><div className="mt-3 space-y-2">{assessments.length === 0 ? <p className="text-sm text-muted-foreground">Aucune évaluation active.</p> : assessments.map((item) => <label key={item.id} className="flex items-center gap-3 rounded-lg border p-3 text-sm"><input type="checkbox" checked={assessmentIds.includes(item.id)} onChange={() => toggle(item.id, assessmentIds, setAssessmentIds)} /><span>{item.title}</span></label>)}</div></div>
                    <div><h3 className="font-semibold">Assignments obligatoires</h3><div className="mt-3 space-y-2">{assignments.length === 0 ? <p className="text-sm text-muted-foreground">Aucun assignment actif.</p> : assignments.map((item) => <label key={item.id} className="flex items-center gap-3 rounded-lg border p-3 text-sm"><input type="checkbox" checked={assignmentIds.includes(item.id)} onChange={() => toggle(item.id, assignmentIds, setAssignmentIds)} /><span>{item.title}</span></label>)}</div></div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2"><div><Label>Titre du certificat</Label><Input value={certificateTitle} onChange={(event) => setCertificateTitle(event.target.value)} placeholder="Certificat de réussite" /></div><div><Label>Émetteur affiché</Label><Input value={issuerName} onChange={(event) => setIssuerName(event.target.value)} placeholder="Nom de l’Academy" /></div></div>
                <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={certificateEnabled} onChange={(event) => setCertificateEnabled(event.target.checked)} /> Émettre automatiquement un certificat après réussite</label>
                <Button type="button" onClick={save}><CheckCircle2 className="mr-2 size-4" />Enregistrer les règles</Button>
            </section>

            <section className="academy-surface rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-2"><Award className="size-5 text-brand-primary" /><h2 className="text-lg font-semibold">Certificats délivrés</h2></div>
                <div className="mt-4 space-y-3">{certificates.length === 0 ? <p className="text-sm text-muted-foreground">Aucun certificat émis pour le moment.</p> : certificates.map((certificate) => <div key={certificate.id} className="rounded-xl border p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-medium">{certificate.recipientName}</p><p className="text-xs text-muted-foreground">{certificate.verificationCode} · {certificate.revokedAt ? 'Révoqué' : 'Valide'}</p></div><Button asChild variant="outline" size="sm"><a href={certificate.verifyUrl} target="_blank" rel="noreferrer">Vérifier</a></Button></div>{certificate.revokedAt ? <p className="mt-3 text-sm text-destructive"><ShieldAlert className="mr-1 inline size-4" />{certificate.revocationReason}</p> : <div className="mt-3 flex gap-2"><Textarea value={revokeReasons[certificate.id] ?? ''} onChange={(event) => setRevokeReasons((current) => ({ ...current, [certificate.id]: event.target.value }))} placeholder="Motif obligatoire de révocation" /><Button variant="destructive" type="button" onClick={() => router.post(`/trainer/courses/${course.id}/certificates/${certificate.id}/revoke`, { revocation_reason: revokeReasons[certificate.id] ?? '' }, { preserveScroll: true })}>Révoquer</Button></div>}</div>)}</div>
                {active.length > 0 && <p className="mt-4 text-xs text-muted-foreground">Une révocation rend immédiatement le lien public invalide, sans supprimer l’historique.</p>}
            </section>
        </div>
    </>;
}
