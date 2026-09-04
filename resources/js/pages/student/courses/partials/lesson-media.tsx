import { AlignLeft, Download, ExternalLink, FileText, Headphones, PlayCircle, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Lesson } from '@/types';

function toEmbedUrl(url: string): string | null {
    try {
        const u = new URL(url);
        const host = u.hostname.replace(/^www\./, '');

        if (host === 'youtube.com' || host === 'youtu.be') {
            const videoId =
                host === 'youtu.be'
                    ? u.pathname.slice(1)
                    : u.searchParams.get('v') ?? u.pathname.split('/').pop() ?? '';
            return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : null;
        }

        if (host === 'vimeo.com') {
            const videoId = u.pathname.replace(/^\//, '').split('/')[0];
            return `https://player.vimeo.com/video/${videoId}`;
        }

        if (host === 'dailymotion.com' || host === 'dai.ly') {
            const videoId =
                host === 'dai.ly'
                    ? u.pathname.slice(1)
                    : (u.pathname.split('/video/')[1] ?? '').split('_')[0];
            return videoId ? `https://www.dailymotion.com/embed/video/${videoId}` : null;
        }

        if (host === 'loom.com') {
            const id = u.pathname.split('/').pop();
            return id ? `https://www.loom.com/embed/${id}` : null;
        }

        if (host === 'streamable.com') {
            const id = u.pathname.replace('/e/', '').slice(1);
            return `https://streamable.com/e/${id}`;
        }

        if (host === 'wistia.com' || host === 'wi.st') {
            return url;
        }

        return url;
    } catch {
        return null;
    }
}

function EmptyState({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
    return (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/40 bg-muted/20 text-muted-foreground">
            <Icon className="h-8 w-8 opacity-40" />
            <p className="text-sm">{label}</p>
        </div>
    );
}

export function LessonMedia({ lesson }: { lesson: Lesson }) {
    const type = lesson.type ?? 'text';


    if (type === 'text') {
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <AlignLeft className="h-4 w-4 text-muted-foreground" />
                        <h1 className="text-lg font-bold">{lesson.title}</h1>
                    </div>
                    <Badge variant="secondary">Texte</Badge>
                </div>

                {lesson.audio_url && (
                    <div className="rounded-xl border border-border/40 bg-muted/20 p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                            <Headphones className="h-4 w-4 text-primary" />
                            Écouter la narration
                        </div>
                        <audio
                            src={lesson.audio_url}
                            controls
                            className="w-full"
                            controlsList="nodownload"
                        />
                    </div>
                )}
            </div>
        );
    }

    if (type === 'video_url') {
        const embedUrl = lesson.video_url ? toEmbedUrl(lesson.video_url) : null;

        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <h1 className="text-lg font-bold">{lesson.title}</h1>
                    </div>
                    <Badge variant="secondary">Vidéo</Badge>
                </div>

                {embedUrl ? (
                    <div className="overflow-hidden rounded-xl shadow-md">
                        <div className="relative aspect-video bg-zinc-950">
                            <iframe
                                src={embedUrl}
                                title={lesson.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                allowFullScreen
                                className="h-full w-full border-0"
                            />
                        </div>
                    </div>
                ) : (
                    <EmptyState icon={PlayCircle} label="Aucune vidéo disponible pour cette leçon" />
                )}
            </div>
        );
    }

    if (type === 'audio') {
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Headphones className="h-4 w-4 text-muted-foreground" />
                        <h1 className="text-lg font-bold">{lesson.title}</h1>
                    </div>
                    <Badge variant="secondary">Audio</Badge>
                </div>

                {lesson.audio_url ? (
                    <div className="rounded-xl border border-border/40 bg-muted/20 p-6">
                        <div className="mb-6 flex items-center justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                                <Headphones className="h-9 w-9 text-primary" />
                            </div>
                        </div>
                        <p className="mb-4 text-center text-sm font-medium text-muted-foreground">
                            {lesson.title}
                        </p>
                        <audio
                            src={lesson.audio_url}
                            controls
                            className="w-full"
                            controlsList="nodownload"
                        />
                    </div>
                ) : (
                    <EmptyState icon={Headphones} label="Aucun audio disponible pour cette leçon" />
                )}
            </div>
        );
    }

    if (type === 'pdf') {
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h1 className="text-lg font-bold">{lesson.title}</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">PDF</Badge>
                        {lesson.pdf_url && (
                            <>
                                <Button size="sm" variant="outline" asChild>
                                    <a href={lesson.pdf_url} target="_blank" rel="noreferrer">
                                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                                        Plein écran
                                    </a>
                                </Button>
                                <Button size="sm" variant="outline" asChild>
                                    <a href={lesson.pdf_url} download>
                                        <Download className="mr-1.5 h-3.5 w-3.5" />
                                        Télécharger
                                    </a>
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {lesson.pdf_url ? (
                    <div className="overflow-hidden rounded-xl border border-border/40 shadow-sm">
                        <iframe
                            src={lesson.pdf_url}
                            title={lesson.title}
                            className="h-[calc(100vh-16rem)] min-h-[540px] w-full border-0"
                        />
                    </div>
                ) : (
                    <EmptyState icon={FileText} label="Aucun PDF disponible pour cette leçon" />
                )}
            </div>
        );
    }

    return <EmptyState icon={FileText} label="Contenu non disponible" />;
}

export function getLessonTypeLabel(type: string | undefined): string {
    switch (type) {
        case 'text':      return 'Texte';
        case 'video_url': return 'Vidéo';
        case 'audio':     return 'Audio';
        case 'pdf':       return 'PDF';
        default:          return 'Contenu';
    }
}
