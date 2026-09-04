import { Award, CheckCircle2, Download, ExternalLink, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Completion = {
    lessonsRequired: number;
    lessonsCompleted: number;
    assessmentsRequired: number;
    assessmentsPassed: number;
    assignmentsRequired: number;
    assignmentsApproved: number;
    completed: boolean;
    completedAt: string | null;
    certificateUrl: string | null;
    certificatePdfUrl: string | null;
    certificateShareEnabled: boolean;
    certificateVerificationCode: string | null;
};

export function CourseCompletionCard({ completion, courseTitle }: { completion: Completion; courseTitle: string }) {
    const remaining = [
        completion.lessonsCompleted < completion.lessonsRequired
            ? `${completion.lessonsRequired - completion.lessonsCompleted} leçon(s) à terminer`
            : null,
        completion.assessmentsPassed < completion.assessmentsRequired
            ? `${completion.assessmentsRequired - completion.assessmentsPassed} évaluation(s) à réussir`
            : null,
        completion.assignmentsApproved < completion.assignmentsRequired
            ? `${completion.assignmentsRequired - completion.assignmentsApproved} projet(s) à faire approuver`
            : null,
    ].filter(Boolean) as string[];

    const share = async () => {
        if (!completion.certificateUrl) return;
        if (navigator.share) {
            await navigator.share({
                title: `Certificat · ${courseTitle}`,
                text: `J’ai terminé ${courseTitle}.`,
                url: completion.certificateUrl,
            });
            return;
        }
        await navigator.clipboard.writeText(completion.certificateUrl);
    };

    return (
        <section className="rounded-[var(--radius)] border border-border/55 bg-card p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-brand-primary">Complétion de la formation</p>
                    <h2 className="mt-1 text-lg font-semibold">{completion.completed ? 'Formation terminée' : 'Encore à faire'}</h2>
                </div>
                {completion.completed ? <CheckCircle2 className="size-6 text-emerald-600" /> : null}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Metric label="Leçons" value={`${completion.lessonsCompleted}/${completion.lessonsRequired}`} />
                <Metric label="Évaluations" value={`${completion.assessmentsPassed}/${completion.assessmentsRequired}`} />
                <Metric label="Projets" value={`${completion.assignmentsApproved}/${completion.assignmentsRequired}`} />
            </div>

            {!completion.completed && remaining.length > 0 ? (
                <div className="mt-4 rounded-xl bg-muted/40 p-3">
                    <p className="text-sm font-medium">Encore à faire</p>
                    <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                        {remaining.map((item) => <li key={item}>○ {item}</li>)}
                    </ul>
                </div>
            ) : null}

            {completion.completed && (completion.certificateUrl || completion.certificatePdfUrl) ? (
                <div className="mt-4 rounded-xl border border-brand-primary/15 bg-brand-primary/5 p-4">
                    <div className="flex items-center gap-2">
                        <Award className="size-5 text-brand-primary" />
                        <p className="font-semibold">Certificat obtenu</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {completion.certificateUrl ? (
                            <Button asChild size="sm" variant="outline">
                                <a href={completion.certificateUrl} target="_blank" rel="noreferrer"><ExternalLink className="mr-2 size-4" />Vérifier</a>
                            </Button>
                        ) : null}
                        {completion.certificatePdfUrl ? (
                            <Button asChild size="sm" variant="outline">
                                <a href={completion.certificatePdfUrl}><Download className="mr-2 size-4" />Télécharger PDF</a>
                            </Button>
                        ) : null}
                        {completion.certificateShareEnabled && completion.certificateUrl ? (
                            <Button type="button" size="sm" variant="outline" onClick={() => void share()}><Share2 className="mr-2 size-4" />Partager</Button>
                        ) : null}
                    </div>
                </div>
            ) : null}
        </section>
    );
}

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 font-semibold">{value}</p>
        </div>
    );
}
