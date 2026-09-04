import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    Check,
    CheckCircle2,
    CircleAlert,
    ExternalLink,
    FileText,
    Image as ImageIcon,
    Mic2,
    RefreshCw,
    ReceiptText,
    ListChecks,
    Sparkles,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Proposal = {
    id: number;
    targetType: string;
    targetId: number | null;
    status: 'generating' | 'pending' | 'accepted' | 'rejected';
    instruction: string | null;
    before: Record<string, unknown>;
    after: Record<string, unknown>;
    provider: string | null;
    model: string | null;
    createdAt: string | null;
};

type Props = {
    run: { id: number; brief: string; status: string; creationUrl: string; createdAt: string | null };
    course: {
        id: number;
        title: string;
        description: string;
        status: string;
        targetAudience: string | null;
        level: string | null;
        language: string | null;
        positioning: Record<string, string>;
        image: string | null;
        thumbnail: string | null;
        editUrl: string;
        assessmentCount: number;
        assessmentsUrl: string;
        assignmentCount: number;
        assignmentsUrl: string;
        completionUrl: string;
        completionCount: number;
        certificateCount: number;
        modules: Array<{
            id: number;
            title: string;
            description: string | null;
            objectives: string[];
            duration: number;
            minimumAccessRank: number;
            lessons: Array<{
                id: number;
                title: string;
                content: string | null;
                duration: number;
                type: string;
                audioUrl: string | null;
                pdfUrl: string | null;
                videoUrl: string | null;
            }>;
        }>;
    };
    offer: { id: number; name: string; amount: number; currency: string; billingType: string; isActive: boolean; editUrl: string } | null;
    page: { id: number; title: string; status: string; visibleSections: number; editUrl: string; previewUrl: string } | null;
    proposals: Proposal[];
    readiness: Array<{ key: string; label: string; ready: boolean }>;
    canPublish: boolean;
    pendingCount: number;
};

function targetKey(type: string, id?: number | null) {
    return `${type}:${id ?? 'root'}`;
}

function formatMoney(amount: number, currency: string) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount / 100);
}

function PayloadView({ value, depth = 0 }: { value: unknown; depth?: number }) {
    if (value === null || value === undefined || value === '') {
        return <span className="text-muted-foreground">—</span>;
    }
    if (typeof value === 'boolean') return <span>{value ? 'Oui' : 'Non'}</span>;
    if (typeof value === 'number') return <span>{value}</span>;
    if (typeof value === 'string') {
        if (/^https?:\/\//.test(value) && /\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(value)) {
            return <img src={value} alt="Aperçu candidat" className="max-h-64 w-full rounded-xl border border-border/50 object-cover" />;
        }
        if (/^https?:\/\//.test(value)) {
            return <a href={value} target="_blank" rel="noreferrer" className="break-all text-brand-primary underline underline-offset-4">{value}</a>;
        }
        return <p className="whitespace-pre-wrap text-sm leading-6">{value}</p>;
    }
    if (Array.isArray(value)) {
        if (value.length === 0) return <span className="text-muted-foreground">—</span>;
        return (
            <div className="space-y-2">
                {value.map((item, index) => (
                    <div key={index} className={depth < 2 ? 'rounded-lg border border-border/45 p-2.5' : ''}>
                        <PayloadView value={item} depth={depth + 1} />
                    </div>
                ))}
            </div>
        );
    }
    if (typeof value === 'object') {
        return (
            <dl className="space-y-2">
                {Object.entries(value as Record<string, unknown>).map(([key, item]) => (
                    <div key={key} className="grid gap-1 sm:grid-cols-[160px_1fr] sm:gap-3">
                        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{key.replaceAll('_', ' ')}</dt>
                        <dd><PayloadView value={item} depth={depth + 1} /></dd>
                    </div>
                ))}
            </dl>
        );
    }
    return null;
}

function ProposalPanel({ runId, proposal }: { runId: number; proposal: Proposal }) {
    return (
        <div className="mt-4 overflow-hidden rounded-xl border border-brand-primary/25 bg-brand-primary-soft/20">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 px-4 py-3">
                <div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">Proposition</Badge>
                        {proposal.provider && <span className="text-xs text-muted-foreground">{proposal.provider} · {proposal.model}</span>}
                    </div>
                    {proposal.instruction && <p className="mt-1 text-xs text-muted-foreground">{proposal.instruction}</p>}
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1.5 rounded-full" onClick={() => router.post(`/trainer/academy-ai/course-creation/${runId}/review/proposals/${proposal.id}/reject`, {}, { preserveScroll: true })}><X className="size-3.5" /> Refuser</Button>
                    <Button size="sm" className="gap-1.5 rounded-full" onClick={() => router.post(`/trainer/academy-ai/course-creation/${runId}/review/proposals/${proposal.id}/accept`, {}, { preserveScroll: true })}><Check className="size-3.5" /> Accepter</Button>
                </div>
            </div>
            <div className="grid gap-px bg-border/50 lg:grid-cols-2">
                <div className="bg-background p-4"><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avant</p><PayloadView value={proposal.before} /></div>
                <div className="bg-background p-4"><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-primary">Après</p><PayloadView value={proposal.after} /></div>
            </div>
        </div>
    );
}

function RegenerateControl({ runId, type, targetId, placeholder, disabled }: { runId: number; type: string; targetId?: number; placeholder: string; disabled?: boolean }) {
    const [instruction, setInstruction] = useState('');
    const [sending, setSending] = useState(false);

    return (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Input value={instruction} onChange={(event) => setInstruction(event.target.value)} placeholder={placeholder} disabled={disabled || sending} />
            <Button
                type="button"
                variant="outline"
                className="shrink-0 gap-2 rounded-full"
                disabled={disabled || sending || instruction.trim().length < 3}
                onClick={() => {
                    setSending(true);
                    router.post(`/trainer/academy-ai/course-creation/${runId}/review/proposals`, {
                        target_type: type,
                        target_id: targetId,
                        instruction,
                    }, {
                        preserveScroll: true,
                        onFinish: () => setSending(false),
                        onSuccess: () => setInstruction(''),
                    });
                }}
            >
                <RefreshCw className={`size-4 ${sending ? 'animate-spin' : ''}`} /> Régénérer
            </Button>
        </div>
    );
}

export default function CourseReview({ run, course, offer, page, proposals, readiness, canPublish, pendingCount }: Props) {
    const pending = useMemo(() => {
        const map = new Map<string, Proposal>();
        proposals.filter((proposal) => proposal.status === 'pending').forEach((proposal) => map.set(targetKey(proposal.targetType, proposal.targetId), proposal));
        return map;
    }, [proposals]);

    return (
        <>
            <Head title={`Review · ${course.title}`} />
            <div className="mx-auto w-full max-w-[1500px] space-y-7 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button variant="ghost" asChild className="gap-2 rounded-full"><Link href={run.creationUrl}><ArrowLeft className="size-4" /> One‑Brief</Link></Button>
                    <div className="flex items-center gap-2"><Badge variant="outline">M13.9 Review Center</Badge>{pendingCount > 0 && <Badge>{pendingCount} en attente</Badge>}</div>
                </div>

                <DashboardHero title="Course Review & Publish Center" description="Contrôlez ce que l’IA a construit. Chaque régénération devient une proposition avant/après que vous acceptez ou refusez explicitement." />

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="space-y-6">
                        <DashboardSection title="Positionnement" description="Audience, niveau, langue, promesse et angle restent éditables sans reconstruire le curriculum.">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-border/50 p-4"><p className="text-xs text-muted-foreground">Audience</p><p className="mt-1 font-medium">{course.targetAudience || '—'}</p></div>
                                <div className="rounded-xl border border-border/50 p-4"><p className="text-xs text-muted-foreground">Niveau / langue</p><p className="mt-1 font-medium">{course.level || '—'} · {course.language || '—'}</p></div>
                            </div>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">{Object.entries(course.positioning).map(([key,value]) => <div key={key} className="rounded-xl bg-bg-soft p-4"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{key.replaceAll('_',' ')}</p><p className="mt-1 text-sm leading-6">{value || '—'}</p></div>)}</div>
                            <RegenerateControl runId={run.id} type="course_positioning" targetId={course.id} placeholder="Ex : rends la promesse plus précise pour les freelances débutants" disabled={pending.has(targetKey('course_positioning', course.id))} />
                            {pending.get(targetKey('course_positioning', course.id)) && <ProposalPanel runId={run.id} proposal={pending.get(targetKey('course_positioning', course.id))!} />}
                        </DashboardSection>

                        <DashboardSection title="Cover & thumbnail" description="Les nouvelles images sont générées comme candidats et ne remplacent jamais l’ancienne avant Accept.">
                            <div className="grid gap-5 lg:grid-cols-2">
                                {(['cover','thumbnail'] as const).map((type) => {
                                    const url = type === 'cover' ? course.image : course.thumbnail;
                                    const proposal = pending.get(targetKey(type));
                                    return <div key={type} className="rounded-xl border border-border/55 p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><ImageIcon className="size-4 text-brand-primary" /><h3 className="font-semibold capitalize">{type}</h3></div>{url ? <Badge variant="outline">Actuelle</Badge> : <Badge variant="secondary">Absente</Badge>}</div>{url ? <img src={url} alt={`${type} actuelle`} className={`mt-4 w-full rounded-xl border border-border/40 object-cover ${type==='cover' ? 'aspect-video' : 'aspect-square'}`} /> : <div className={`mt-4 grid place-items-center rounded-xl bg-bg-soft text-sm text-muted-foreground ${type==='cover' ? 'aspect-video' : 'aspect-square'}`}>Aucune image</div>}<RegenerateControl runId={run.id} type={type} placeholder={type==='cover' ? 'Ex : éditorial premium, photographie cinématique, pas de texte' : 'Ex : sujet plus gros, contraste fort, minimal'} disabled={Boolean(proposal)} />{proposal && <ProposalPanel runId={run.id} proposal={proposal} />}</div>;
                                })}
                            </div>
                        </DashboardSection>

                        <DashboardSection title="Curriculum" description="Régénérez un module ou une seule leçon. Les accès, ordres et durées ne sont pas modifiés par ces propositions.">
                            <div className="space-y-5">
                                {course.modules.map((module, moduleIndex) => {
                                    const moduleProposal = pending.get(targetKey('module', module.id));
                                    return <div key={module.id} className="rounded-2xl border border-border/55 p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs text-muted-foreground">Module {moduleIndex + 1} · {module.duration} min · rank {module.minimumAccessRank}</p><h3 className="mt-1 text-lg font-semibold">{module.title}</h3>{module.description && <p className="mt-2 text-sm leading-6 text-muted-foreground">{module.description}</p>}</div><Badge variant="outline">{module.lessons.length} leçons</Badge></div><RegenerateControl runId={run.id} type="module" targetId={module.id} placeholder="Ex : clarifie les objectifs sans changer les leçons" disabled={Boolean(moduleProposal)} />{moduleProposal && <ProposalPanel runId={run.id} proposal={moduleProposal} />}
                                    <div className="mt-5 space-y-3">{module.lessons.map((lesson, lessonIndex) => { const lessonProposal=pending.get(targetKey('lesson',lesson.id)); const audioProposal=pending.get(targetKey('audio',lesson.id)); return <div key={lesson.id} className="rounded-xl bg-bg-soft p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs text-muted-foreground">Leçon {lessonIndex+1} · {lesson.duration} min · {lesson.type}</p><h4 className="mt-1 font-semibold">{lesson.title}</h4></div><div className="flex gap-2">{lesson.audioUrl ? <Badge variant="outline"><Mic2 className="mr-1 size-3" /> Audio ✓</Badge> : <Badge variant="secondary">Audio —</Badge>}</div></div><p className="mt-3 max-h-44 overflow-auto whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{lesson.content || 'Aucun contenu texte.'}</p><RegenerateControl runId={run.id} type="lesson" targetId={lesson.id} placeholder="Ex : ajoute un exemple concret et un exercice final" disabled={Boolean(lessonProposal)} />{lessonProposal && <ProposalPanel runId={run.id} proposal={lessonProposal} />}<RegenerateControl runId={run.id} type="audio" targetId={lesson.id} placeholder="Ex : voix pédagogique calme, rythme légèrement plus lent" disabled={Boolean(audioProposal)} />{audioProposal && <ProposalPanel runId={run.id} proposal={audioProposal} />}</div>; })}</div></div>;
                                })}
                            </div>
                        </DashboardSection>

                        <DashboardSection title="Assessments" description="Quiz et évaluations auto-corrigés M14.1. Ils restent informatifs pour la publication ; les règles de complétion arrivent en M14.3.">
                            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/55 p-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <ListChecks className="size-4 text-brand-primary" />
                                        <p className="font-semibold">{course.assessmentCount} assessment{course.assessmentCount === 1 ? '' : 's'}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">QCM simple/multiple et vrai-faux, score serveur et tentatives persistantes.</p>
                                </div>
                                <Button variant="outline" asChild className="rounded-full">
                                    <Link href={course.assessmentsUrl}>Gérer les quiz</Link>
                                </Button>
                            </div>
                        </DashboardSection>

                        <DashboardSection title="Assignments & projets" description="Travaux pratiques M14.2 avec rendus privés, rubric et revue humaine. Ils ne bloquent pas encore la publication ; les règles de complétion arrivent en M14.3.">
                            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/55 p-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <FileText className="size-4 text-brand-primary" />
                                        <p className="font-semibold">{course.assignmentCount} assignment{course.assignmentCount === 1 ? '' : 's'}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">Devoirs et projets avec soumissions versionnées, fichiers privés, rubric et feedback formateur.</p>
                                </div>
                                <Button variant="outline" asChild className="rounded-full">
                                    <Link href={course.assignmentsUrl}>Gérer les assignments</Link>
                                </Button>
                            </div>
                        </DashboardSection>

                        <DashboardSection title="Complétion & certificats" description="Reliez les leçons, quiz obligatoires et projets approuvés à une preuve de réussite vérifiable.">
                            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/55 p-4">
                                <div><p className="font-semibold">{course.completionCount} complétion(s) · {course.certificateCount} certificat(s)</p><p className="mt-1 text-sm text-muted-foreground">La configuration de complétion ne bloque pas la publication de la formation.</p></div>
                                <Button size="sm" variant="outline" asChild className="rounded-full"><Link href={course.completionUrl}>Configurer</Link></Button>
                            </div>
                        </DashboardSection>

                        <DashboardSection title="Offre" description="Le commerce reste M10. Le Review Center vérifie l’offre mais ne laisse pas l’IA modifier silencieusement un prix financier.">
                            {offer ? <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/55 p-4"><div><div className="flex items-center gap-2"><ReceiptText className="size-4 text-brand-primary" /><p className="font-semibold">{offer.name}</p></div><p className="mt-1 text-sm text-muted-foreground">{formatMoney(offer.amount, offer.currency)} · {offer.billingType}</p></div><Button variant="outline" asChild className="rounded-full"><Link href={offer.editUrl}>Ouvrir Sales</Link></Button></div> : <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">Aucune offre active. La publication restera bloquée.</div>}
                        </DashboardSection>

                        <DashboardSection title="Landing page" description="page.optimize produit une proposition structurée M11 ; Apply n’arrive qu’après votre acceptation.">
                            {page ? <><div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/55 p-4"><div><p className="font-semibold">{page.title}</p><p className="mt-1 text-sm text-muted-foreground">{page.status} · {page.visibleSections} sections visibles</p></div><div className="flex gap-2"><Button size="sm" variant="outline" asChild className="rounded-full"><Link href={page.previewUrl}><ExternalLink className="size-3.5" /> Preview</Link></Button><Button size="sm" variant="outline" asChild className="rounded-full"><Link href={page.editUrl}>Éditer</Link></Button></div></div><RegenerateControl runId={run.id} type="landing" targetId={page.id} placeholder="Ex : mets le curriculum avant le pricing et rends le hero plus direct" disabled={pending.has(targetKey('landing', page.id))} />{pending.get(targetKey('landing',page.id)) && <ProposalPanel runId={run.id} proposal={pending.get(targetKey('landing',page.id))!} />}</> : <p className="text-sm text-muted-foreground">Aucune landing n’a été générée pour ce run.</p>}
                        </DashboardSection>
                    </div>

                    <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
                        <section className="academy-panel rounded-2xl p-5"><div className="flex items-center gap-2"><Sparkles className="size-4 text-brand-primary" /><h2 className="font-semibold">Prêt à publier ?</h2></div><div className="mt-4 space-y-3">{readiness.map((item) => <div key={item.key} className="flex items-start gap-2 text-sm">{item.ready ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" /> : <CircleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />}<span className={item.ready ? '' : 'text-muted-foreground'}>{item.label}</span></div>)}</div><Button className="mt-5 w-full rounded-full" disabled={!canPublish} onClick={() => router.post(`/trainer/academy-ai/course-creation/${run.id}/review/publish`, {}, { preserveScroll: true })}>Publier la formation</Button><p className="mt-3 text-xs leading-5 text-muted-foreground">La publication passe par <code>PublishCourseAction</code>. Stripe n’est provisionné qu’à cet instant.</p></section>
                        <section className="academy-panel rounded-2xl p-5"><h3 className="font-semibold">Accès rapide</h3><div className="mt-3 grid gap-2"><Button variant="outline" asChild className="justify-start rounded-full"><Link href={course.editUrl}><BookOpen className="size-4" /> Éditeur du cours</Link></Button>{page && <Button variant="outline" asChild className="justify-start rounded-full"><Link href={page.editUrl}><ExternalLink className="size-4" /> Page Builder</Link></Button>}</div></section>
                    </aside>
                </div>
            </div>
        </>
    );
}

CourseReview.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/trainer/dashboard' },
        { title: 'Academy AI', href: '/trainer/academy-ai' },
        { title: 'One‑Brief', href: '/trainer/academy-ai/course-creation' },
        { title: 'Review Center', href: '#' },
    ],
};
