import { useRef, useState } from 'react';
import { useFileUpload } from '@/hooks/use-file-upload';
import { Alert, AlertDescription, AlertTitle } from '@/components/reui/alert';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    CircleAlertIcon,
    CloudUploadIcon,
    FileAudioIcon,
    FileTextIcon,
    UploadIcon,
    XIcon,
} from 'lucide-react';

type MediaType = 'audio' | 'pdf';

interface MediaUploadProps {
    name: string;
    type: MediaType;
    existingUrl?: string | null;
    className?: string;
}

const CONFIG = {
    audio: {
        accept: 'audio/mp3,audio/wav,audio/ogg,audio/aac,audio/m4a,audio/opus,audio/*',
        maxSize: 100 * 1024 * 1024,
        hint: 'MP3, WAV, OGG, AAC — 100 Mo max',
        Icon: FileAudioIcon,
        label: 'Fichier audio',
    },
    pdf: {
        accept: 'application/pdf',
        maxSize: 50 * 1024 * 1024,
        hint: 'PDF — 50 Mo max',
        Icon: FileTextIcon,
        label: 'Fichier PDF',
    },
} as const;

export function MediaUpload({ name, type, existingUrl, className }: MediaUploadProps) {
    const config = CONFIG[type];
    const existingName = existingUrl ? decodeURIComponent(existingUrl.split('/').pop() ?? '') : null;

    const [fileName, setFileName] = useState<string | null>(existingName);
    const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(
        type === 'audio' ? (existingUrl ?? null) : null,
    );
    const [hasFile, setHasFile] = useState(!!existingUrl);

    const nativeInputRef = useRef<HTMLInputElement>(null);

    const [{ isDragging, errors }, { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps }] =
        useFileUpload({
            maxFiles: 1,
            maxSize: config.maxSize,
            accept: config.accept,
            multiple: false,
            onFilesChange: (files) => {
                if (files.length > 0 && files[0].file instanceof File) {
                    const file = files[0].file;
                    const dt = new DataTransfer();
                    dt.items.add(file);

                    if (nativeInputRef.current) {
                        nativeInputRef.current.files = dt.files;
                    }

                    setFileName(file.name);
                    setHasFile(true);

                    if (type === 'audio') {
                        setAudioPreviewUrl(URL.createObjectURL(file));
                    }
                }
            },
        });

    const remove = () => {
        setFileName(null);
        setHasFile(false);
        setAudioPreviewUrl(null);

        if (nativeInputRef.current) {
            nativeInputRef.current.value = '';
        }
    };

    const { Icon } = config;

    return (
        <div className={cn('w-full space-y-3', className)}>
            <input {...getInputProps()} className="sr-only" />
            <input
                type="file"
                name={name}
                ref={nativeInputRef}
                accept={config.accept}
                className="sr-only"
                tabIndex={-1}
                aria-hidden
            />

            <div
                className={cn(
                    'group relative overflow-hidden rounded-xl border transition-all duration-200',
                    isDragging
                        ? 'border-dashed border-primary bg-primary/5'
                        : hasFile
                          ? 'border-border bg-background hover:border-primary/50'
                          : 'border-dashed border-muted-foreground/25 bg-muted/30 hover:border-primary hover:bg-primary/5',
                )}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {hasFile ? (
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="size-5 text-primary" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{fileName}</p>
                            {type === 'audio' && audioPreviewUrl && (
                                <audio
                                    src={audioPreviewUrl}
                                    controls
                                    className="mt-2 h-8 w-full"
                                />
                            )}
                            {type === 'pdf' && existingUrl && !nativeInputRef.current?.files?.length && (
                                <a
                                    href={existingUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-0.5 block text-xs text-primary hover:underline"
                                >
                                    Voir le fichier actuel
                                </a>
                            )}
                        </div>

                        <div className="flex shrink-0 gap-2">
                            <Button type="button" onClick={openFileDialog} size="sm" variant="outline">
                                <UploadIcon className="mr-1 size-3.5" />
                                Changer
                            </Button>
                            <Button type="button" onClick={remove} size="sm" variant="destructive">
                                <XIcon className="size-3.5" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="flex cursor-pointer flex-col items-center justify-center gap-3 p-6 text-center"
                        onClick={openFileDialog}
                    >
                        <div className="rounded-full bg-primary/10 p-3">
                            <CloudUploadIcon className="size-6 text-primary" />
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium">
                                Glisser-déposer ou cliquer pour sélectionner
                            </p>
                            <p className="text-xs text-muted-foreground">{config.hint}</p>
                        </div>

                        <Button type="button" variant="outline" size="sm">
                            <Icon className="mr-1 size-3.5" />
                            {config.label}
                        </Button>
                    </div>
                )}
            </div>

            {errors.length > 0 && (
                <Alert variant="destructive">
                    <CircleAlertIcon />
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>
                        {errors.map((error, i) => (
                            <p key={i}>{error}</p>
                        ))}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
