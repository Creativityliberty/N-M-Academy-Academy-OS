import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, FileText, FolderKanban, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type RubricItem = { id?: number; criterion: string; description?: string | null; maxPoints: number };
type Submission = {
    id: number; student: { id: number; name: string | null }; version: number; status: string;
    textContent: string | null; linkUrl: string | null; rubricScores: Record<string, number>;
    scorePercent: number | null; feedback: string | null; files: Array<{ id: number; name: string; url: string }>;
};
type Assignment = {
    id: number; title: string; instructions: string; kind: 'assignment'|'project'; deliverableType: 'text'|'link'|'file'|'mixed';
    moduleId: number | null; lessonId: number | null; isEnabled: boolean; rubric: RubricItem[]; submissions: Submission[];
};
type Props = {
    course: { id: number; title: string };
    modules: Array<{ id: number; title: string; lessons: Array<{ id: number; title: string }> }>;
    assignments: Assignment[];
};

function ReviewForm({ courseId, assignment, submission }: { courseId: number; assignment: Assignment; submission: Submission }) {
    const [feedback, setFeedback] = useState('');
    const [scores, setScores] = useState<Record<string, number>>(() => Object.fromEntries(assignment.rubric.map((item) => [String(item.id), submission.rubricScores[String(item.id)] ?? 0])));
    const submit = (decision: 'approved'|'changes_requested') => router.post(`/trainer/courses/${courseId}/assignments/${assignment.id}/submissions/${submission.id}/review`, { decision, feedback, rubric_scores: scores }, { preserveScroll: true });
    if (submission.status !== 'submitted') return <p className="text-xs text-muted-foreground">{submission.status} {submission.scorePercent !== null ? `· ${submission.scorePercent}%` : ''}</p>;
    return <div className="mt-3 space-y-3 rounded-xl bg-bg-soft p-3">
        <div className="grid gap-2 sm:grid-cols-2">{assignment.rubric.map((item) => <label key={item.id} className="text-xs"><span className="block font-medium">{item.criterion} / {item.maxPoints}</span><Input type="number" min={0} max={item.maxPoints} value={scores[String(item.id)] ?? 0} onChange={(e) => setScores((prev) => ({ ...prev, [String(item.id)]: Number(e.target.value) || 0 }))} /></label>)}</div>
        <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Feedback au participant…" />
        <div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => submit('changes_requested')}>Demander des corrections</Button><Button size="sm" onClick={() => submit('approved')}><CheckCircle2 className="size-4" /> Approuver</Button></div>
    </div>;
}

export default function AssignmentWorkspace({ course, modules, assignments }: Props) {
    const form = useForm({ title: '', instructions: '', kind: 'project', deliverable_type: 'mixed', module_id: modules[0]?.id ?? null, lesson_id: null as number|null, is_enabled: true, rubric: [{ criterion: 'Qualité du livrable', description: 'Le résultat répond clairement à la consigne.', max_points: 10 }] });
    const addRubric = () => form.setData('rubric', [...form.data.rubric, { criterion: '', description: '', max_points: 10 }]);
    const generate = () => router.post('/trainer/academy-ai/runs', { capability: 'assignment.generate', prompt: `Crée un projet pratique pour la formation ${course.title}.`, input: { course_id: course.id, module_id: form.data.module_id } });
    return <><Head title={`Assignments · ${course.title}`} /><div className="mx-auto w-full max-w-[1480px] space-y-7 px-4 py-6 sm:px-6 lg:px-8">
        <Button variant="ghost" asChild className="rounded-full"><Link href={`/trainer/courses/${course.id}/edit`}><ArrowLeft className="size-4" /> Formation</Link></Button>
        <DashboardHero title="Assignments & projets" description="Définissez un livrable observable, une rubric claire et révisez humainement chaque version de rendu." />
        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <DashboardSection title="Créer" description="L’IA peut authorer la consigne et la rubric, mais elle ne note jamais les travaux étudiants.">
                <div className="space-y-4">
                    <Button variant="outline" onClick={generate}><Sparkles className="size-4" /> Générer avec Academy AI</Button>
                    <div><Label>Titre</Label><Input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} /></div>
                    <div><Label>Consignes</Label><Textarea className="min-h-36" value={form.data.instructions} onChange={(e) => form.setData('instructions', e.target.value)} /></div>
                    <div className="grid gap-3 sm:grid-cols-2"><div><Label>Type</Label><select className="h-10 w-full rounded-md border bg-background px-3" value={form.data.kind} onChange={(e) => form.setData('kind', e.target.value)}><option value="assignment">Devoir</option><option value="project">Projet</option></select></div><div><Label>Rendu</Label><select className="h-10 w-full rounded-md border bg-background px-3" value={form.data.deliverable_type} onChange={(e) => form.setData('deliverable_type', e.target.value)}><option value="text">Texte</option><option value="link">Lien</option><option value="file">Fichier</option><option value="mixed">Mixte</option></select></div></div>
                    <div><Label>Module</Label><select className="h-10 w-full rounded-md border bg-background px-3" value={form.data.module_id ?? ''} onChange={(e) => form.setData('module_id', e.target.value ? Number(e.target.value) : null)}><option value="">Formation entière</option>{modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}</select></div>
                    <div className="space-y-2"><div className="flex items-center justify-between"><Label>Rubric</Label><Button type="button" size="sm" variant="ghost" onClick={addRubric}>+ Critère</Button></div>{form.data.rubric.map((item, index) => <div key={index} className="grid gap-2 rounded-xl border p-3 sm:grid-cols-[1fr_100px]"><Input placeholder="Critère" value={item.criterion} onChange={(e) => { const next=[...form.data.rubric]; next[index]={...item,criterion:e.target.value}; form.setData('rubric',next); }} /><Input type="number" min={1} value={item.max_points} onChange={(e) => { const next=[...form.data.rubric]; next[index]={...item,max_points:Number(e.target.value)||1}; form.setData('rubric',next); }} /></div>)}</div>
                    <Button onClick={() => form.post(`/trainer/courses/${course.id}/assignments`)} disabled={form.processing}>Créer l’assignment</Button>
                </div>
            </DashboardSection>
            <DashboardSection title="Travaux & revues" description="Les fichiers sont privés et chaque nouvelle soumission crée une version immuable.">
                <div className="space-y-4">{assignments.length === 0 && <p className="text-sm text-muted-foreground">Aucun assignment pour le moment.</p>}{assignments.map((assignment) => <article key={assignment.id} className="rounded-2xl border p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2"><FolderKanban className="size-4 text-brand-primary" /><h3 className="font-semibold">{assignment.title}</h3></div><p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{assignment.instructions}</p></div><Badge variant="outline">{assignment.kind}</Badge></div><div className="mt-4 space-y-3">{assignment.submissions.length===0 ? <p className="text-xs text-muted-foreground">Aucun rendu.</p> : assignment.submissions.map((submission) => <div key={submission.id} className="rounded-xl border border-border/55 p-3"><div className="flex flex-wrap justify-between gap-2"><p className="text-sm font-medium">{submission.student.name ?? `Étudiant #${submission.student.id}`} · v{submission.version}</p><Badge>{submission.status}</Badge></div>{submission.textContent && <p className="mt-2 whitespace-pre-wrap text-sm">{submission.textContent}</p>}{submission.linkUrl && <a href={submission.linkUrl} target="_blank" rel="noreferrer" className="mt-2 block text-sm underline">{submission.linkUrl}</a>}<div className="mt-2 flex flex-wrap gap-2">{submission.files.map((file) => <Button key={file.id} size="sm" variant="outline" asChild><a href={file.url}><FileText className="size-3.5" /> {file.name}</a></Button>)}</div><ReviewForm courseId={course.id} assignment={assignment} submission={submission} /></div>)}</div></article>)}</div>
            </DashboardSection>
        </div>
    </div></>;
}
