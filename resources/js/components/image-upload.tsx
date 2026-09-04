import { useRef, useState } from 'react';
import { useFileUpload } from '@/hooks/use-file-upload';
import { Alert, AlertDescription, AlertTitle } from '@/components/reui/alert';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    ImageIcon,
    UploadIcon,
    XIcon,
    CloudUploadIcon,
    CircleAlertIcon,
} from 'lucide-react';

interface ImageUploadProps {
    name: string;
    existingUrl?: string | null;
    maxSize?: number;
    accept?: string;
    className?: string;
}

export function ImageUpload({
    name,
    existingUrl,
    maxSize = 5 * 1024 * 1024,
    accept = 'image/jpeg,image/jpg,image/png,image/webp',
    className,
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(existingUrl ?? null);
    const [imageLoading, setImageLoading] = useState(!!existingUrl);

    const nativeInputRef = useRef<HTMLInputElement>(null);

    const [
        { isDragging, errors },
        {
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            openFileDialog,
            getInputProps,
        },
    ] = useFileUpload({
        maxFiles: 1,
        maxSize,
        accept,
        multiple: false,
        onFilesChange: (files) => {
            if (files.length > 0 && files[0].file instanceof File) {
                const dt = new DataTransfer();
                dt.items.add(files[0].file);

                if (nativeInputRef.current) {
                    nativeInputRef.current.files = dt.files;
                }

                setPreview(files[0].preview ?? null);
                setImageLoading(true);
            }
        },
    });

    const remove = () => {
        setPreview(null);
        setImageLoading(false);

        if (nativeInputRef.current) {
            nativeInputRef.current.value = '';
        }
    };

    return (
        <div className={cn('w-full space-y-3', className)}>
            {/* Input du hook — gère la sélection, sans name */}
            <input {...getInputProps()} className="sr-only" />

            {/* Input natif soumis avec le formulaire */}
            <input
                type="file"
                name={name}
                ref={nativeInputRef}
                accept={accept}
                className="sr-only"
                tabIndex={-1}
                aria-hidden
            />

            <div
                className={cn(
                    'group relative h-[180px] overflow-hidden rounded-xl border transition-all duration-200 sm:h-[200px] md:h-[220px]',
                    isDragging
                        ? 'border-dashed border-primary bg-primary/5'
                        : preview
                          ? 'border-border bg-background hover:border-primary/50'
                          : 'border-dashed border-muted-foreground/25 bg-muted/30 hover:border-primary hover:bg-primary/5',
                )}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {preview ? (
                    <div className="relative h-full w-full">
                        {imageLoading && (
                            <div className="absolute inset-0 z-10 flex animate-pulse items-center justify-center bg-muted">
                                <ImageIcon className="size-5 text-muted-foreground" />
                            </div>
                        )}

                        <img
                            src={preview}
                            alt="Aperçu"
                            className={cn(
                                'h-full w-full object-cover transition-opacity duration-300',
                                imageLoading ? 'opacity-0' : 'opacity-100',
                            )}
                            onLoad={() => setImageLoading(false)}
                            onError={() => setImageLoading(false)}
                        />

                        <div className="absolute inset-0 bg-black/0 transition-all duration-200 group-hover:bg-black/40" />

                        <div className="absolute inset-0 z-20 flex items-center justify-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <Button
                                type="button"
                                onClick={openFileDialog}
                                size="sm"
                                variant="outline"
                            >
                                <UploadIcon className="mr-1 size-3.5" />
                                Changer
                            </Button>

                            <Button
                                type="button"
                                onClick={remove}
                                size="sm"
                                variant="destructive"
                            >
                                <XIcon className="mr-1 size-3.5" />
                                Supprimer
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 p-6 text-center"
                        onClick={openFileDialog}
                    >
                        <div className="rounded-full bg-primary/10 p-3">
                            <CloudUploadIcon className="size-6 text-primary" />
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium">
                                Glisser-déposer ou cliquer pour sélectionner
                            </p>
                            <p className="text-xs text-muted-foreground">
                                JPG, PNG, WebP — 5 Mo max
                            </p>
                        </div>

                        <Button type="button" variant="outline" size="sm">
                            <ImageIcon className="mr-1 size-3.5" />
                            Parcourir
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
