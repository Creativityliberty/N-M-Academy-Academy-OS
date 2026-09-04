import {
    FileAudioIcon,
    FileTextIcon,
    AlignLeftIcon,
    Link2Icon,
    PlusIcon,
    Trash2Icon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MediaUpload } from '@/components/media-upload';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Lesson, LessonType, Module } from '@/types';

type Props = {
    modules: Module[];
    onAddModule: () => void;
    onRemoveModule: (mi: number) => void;
    onUpdateModule: (
        mi: number,
        field: 'title' | 'description' | 'duration' | 'minimum_access_rank',
        value: string | number,
    ) => void;
    onAddLesson: (mi: number) => void;
    onRemoveLesson: (mi: number, li: number) => void;
    onUpdateLesson: (
        mi: number,
        li: number,
        field: keyof Lesson,
        value: string | number | boolean | null,
    ) => void;
    onGenerateAudio?: (lesson: Lesson) => void;
    generatingAudioLessonId?: number | null;
};

const LESSON_TYPES: {
    value: LessonType;
    label: string;
    icon: React.ElementType;
}[] = [
    { value: 'text', label: 'Texte', icon: AlignLeftIcon },
    { value: 'video_url', label: 'Vidéo (URL)', icon: Link2Icon },
    { value: 'audio', label: 'Audio', icon: FileAudioIcon },
    { value: 'pdf', label: 'PDF', icon: FileTextIcon },
];

export function ModulesLessons({
    modules,
    onAddModule,
    onRemoveModule,
    onUpdateModule,
    onAddLesson,
    onRemoveLesson,
    onUpdateLesson,
    onGenerateAudio,
    generatingAudioLessonId,
}: Props) {
    return (
        <div className="space-y-4">
            {modules.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    Aucun module ajouté. Vous pouvez en ajouter maintenant ou
                    après la création.
                </p>
            )}

            {modules.map((mod, mi) => (
                <div
                    key={mi}
                    className="space-y-4 rounded-lg border border-border/60 bg-muted/30 p-4"
                >
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold">
                            Module {mi + 1}
                        </span>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveModule(mi)}
                        >
                            <Trash2Icon className="size-4 text-destructive" />
                        </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Titre *</Label>
                            <Input value={mod.title} onChange={(e) => onUpdateModule(mi, 'title', e.target.value)} placeholder="Ex : Les bases de la méditation" />
                        </div>
                        <div className="space-y-2">
                            <Label>Durée (min) *</Label>
                            <Input type="number" min={1} value={mod.duration} onChange={(e) => onUpdateModule(mi, 'duration', Number(e.target.value))} />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label>Description du module</Label>
                            <Textarea value={mod.description ?? ''} onChange={(e) => onUpdateModule(mi, 'description', e.target.value)} placeholder="Ce que ce module couvre et pourquoi il est important…" />
                        </div>
                        <div className="space-y-2">
                            <Label>Rang d’accès minimum</Label>
                            <Input type="number" min={0} max={1000} value={mod.minimum_access_rank ?? 0} onChange={(e) => onUpdateModule(mi, 'minimum_access_rank', Number(e.target.value))} />
                        </div>
                    </div>

                    <div className="space-y-3 pl-2">
                        {mod.lessons.map((lesson, li) => (
                            <LessonForm
                                key={li}
                                lesson={lesson}
                                moduleIndex={mi}
                                lessonIndex={li}
                                onUpdate={(field, value) =>
                                    onUpdateLesson(mi, li, field, value)
                                }
                                onRemove={() => onRemoveLesson(mi, li)}
                                onGenerateAudio={onGenerateAudio}
                                generatingAudio={lesson.id != null && generatingAudioLessonId === lesson.id}
                            />
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onAddLesson(mi)}
                        >
                            <PlusIcon className="mr-1 size-4" /> Ajouter une
                            leçon
                        </Button>
                    </div>
                </div>
            ))}

            <Button type="button" variant="outline" onClick={onAddModule}>
                <PlusIcon className="mr-2 size-4" /> Ajouter un module
            </Button>
        </div>
    );
}

function LessonForm({
    lesson,
    moduleIndex,
    lessonIndex,
    onUpdate,
    onRemove,
    onGenerateAudio,
    generatingAudio,
}: {
    lesson: Lesson;
    moduleIndex: number;
    lessonIndex: number;
    onUpdate: (
        field: keyof Lesson,
        value: string | number | boolean | null,
    ) => void;
    onRemove: () => void;
    onGenerateAudio?: (lesson: Lesson) => void;
    generatingAudio?: boolean;
}) {
    const type = lesson.type ?? 'text';

    return (
        <div className="space-y-3 rounded-md border border-border/40 bg-background/50 p-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                    Leçon {lessonIndex + 1}
                </span>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={onRemove}
                >
                    <Trash2Icon className="size-3.5 text-destructive" />
                </Button>
            </div>

            {/* Titre + durée + gratuit */}
            <div className="flex flex-wrap items-end gap-2">
                <div className="min-w-0 flex-1 space-y-1">
                    <Label className="text-xs">Titre *</Label>
                    <Input
                        value={lesson.title}
                        onChange={(e) => onUpdate('title', e.target.value)}
                        placeholder="Titre de la leçon"
                    />
                </div>
                <div className="w-24 space-y-1">
                    <Label className="text-xs">Min *</Label>
                    <Input
                        type="number"
                        min={1}
                        value={lesson.duration}
                        onChange={(e) =>
                            onUpdate('duration', Number(e.target.value))
                        }
                    />
                </div>
                <div className="flex items-center gap-1.5 pb-2">
                    <Checkbox
                        id={`free-${moduleIndex}-${lessonIndex}`}
                        checked={lesson.is_free}
                        onCheckedChange={(v) => onUpdate('is_free', !!v)}
                    />
                    <Label
                        htmlFor={`free-${moduleIndex}-${lessonIndex}`}
                        className="text-xs"
                    >
                        Gratuit
                    </Label>
                </div>
            </div>

            <div className="space-y-1">
                <Label className="text-xs">Contenu de la leçon</Label>
                <Textarea
                    value={lesson.content ?? ''}
                    onChange={(e) =>
                        onUpdate('content', e.target.value || null)
                    }
                    placeholder="Texte, explications, étapes, exercices… Academy AI pourra le générer ou le réécrire."
                    className="min-h-32 text-sm leading-relaxed"
                />
            </div>

            {onGenerateAudio && lesson.id && (lesson.content || lesson.transcript) && (
                <div className="flex flex-wrap items-center gap-2 rounded-md border border-border/40 bg-muted/20 p-2.5">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={generatingAudio}
                        onClick={() => onGenerateAudio(lesson)}
                    >
                        <FileAudioIcon className="mr-1.5 size-4" />
                        {generatingAudio
                            ? 'Génération audio…'
                            : lesson.audio_url
                              ? 'Régénérer la narration'
                              : 'Générer la narration audio'}
                    </Button>
                    {lesson.audio_url && (
                        <span className="text-xs text-muted-foreground">
                            Narration disponible
                        </span>
                    )}
                </div>
            )}

            {/* Type de contenu */}
            <div className="space-y-1">
                <Label className="text-xs">Type de contenu *</Label>
                <Select
                    value={type}
                    onValueChange={(v) => onUpdate('type', v as LessonType)}
                >
                    <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {LESSON_TYPES.map(({ value, label, icon: Icon }) => (
                            <SelectItem key={value} value={value}>
                                <span className="flex items-center gap-1.5">
                                    <Icon className="h-3.5 w-3.5" />
                                    {label}
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Contenu conditionnel selon le type */}
            {type === 'video_url' && (
                <div className="space-y-1">
                    <Label className="text-xs">URL de la vidéo</Label>
                    <Input
                        value={lesson.video_url ?? ''}
                        onChange={(e) =>
                            onUpdate('video_url', e.target.value || null)
                        }
                        placeholder="YouTube, Vimeo, DailyMotion, Loom…"
                        className="text-xs"
                    />
                </div>
            )}

            {type === 'video_url' && (
                <div className="space-y-1">
                    <Label className="text-xs">Transcription de la vidéo</Label>
                    <Textarea
                        value={lesson.transcript ?? ''}
                        onChange={(e) =>
                            onUpdate('transcript', e.target.value || null)
                        }
                        placeholder="Collez une transcription pour enrichir l’AI Tutor…"
                        className="min-h-28 text-xs leading-relaxed"
                    />
                </div>
            )}

            {type === 'audio' && (
                <div className="space-y-1">
                    <Label className="text-xs">Fichier audio</Label>
                    <MediaUpload
                        type="audio"
                        name={`modules[${moduleIndex}][lessons][${lessonIndex}][audio_file]`}
                        existingUrl={lesson.audio_url}
                    />
                </div>
            )}

            {type === 'pdf' && (
                <div className="space-y-1">
                    <Label className="text-xs">Fichier PDF</Label>
                    <MediaUpload
                        type="pdf"
                        name={`modules[${moduleIndex}][lessons][${lessonIndex}][pdf_file]`}
                        existingUrl={lesson.pdf_url}
                    />
                </div>
            )}
        </div>
    );
}
