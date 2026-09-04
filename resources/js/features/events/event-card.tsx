import { Link, router } from '@inertiajs/react';
import {
    CalendarDays,
    Clock3,
    ExternalLink,
    MapPin,
    Radio,
    UserRound,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AcademyEvent } from '@/features/events/types';
import { cn } from '@/lib/utils';

type EventCardProps = {
    event: AcademyEvent;
    authenticated: boolean;
    compact?: boolean;
};

const formatDate = (value: string, timezone: string) =>
    new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: timezone,
    }).format(new Date(value));

const formatTime = (value: string, timezone: string) =>
    new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: timezone,
    }).format(new Date(value));

export function EventCard({
    event,
    authenticated,
    compact = false,
}: EventCardProps) {
    const register = () =>
        router.post(
            `/communaute/evenements/${event.id}/inscription`,
            {},
            {
                preserveScroll: true,
            },
        );

    const unregister = () =>
        router.delete(`/communaute/evenements/${event.id}/inscription`, {
            preserveScroll: true,
        });

    const cancel = () =>
        router.patch(
            `/communaute/evenements/${event.id}/cancel`,
            {},
            {
                preserveScroll: true,
            },
        );

    return (
        <article
            className={cn(
                'flex h-full flex-col rounded-[var(--academy-radius)] border border-border/60 bg-background/80 shadow-sm backdrop-blur-sm',
                compact ? 'p-4' : 'p-5 sm:p-6',
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase">
                        {event.meetingUrl !== null ||
                        event.location === null ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary-soft px-2.5 py-1 text-brand-secondary">
                                <Radio className="size-3.5" /> Live
                            </span>
                        ) : null}
                        {event.location ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                                <MapPin className="size-3.5" /> Sur place
                            </span>
                        ) : null}
                    </div>
                    <h2
                        className={cn(
                            'font-semibold tracking-tight text-foreground',
                            compact ? 'text-lg' : 'text-xl',
                        )}
                    >
                        {event.title}
                    </h2>
                </div>

                {event.isRegistered ? (
                    <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        Inscrit
                    </span>
                ) : null}
            </div>

            <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                {event.description}
            </p>

            <div className="mt-5 grid gap-2.5 text-sm text-foreground/75 sm:grid-cols-2">
                <div className="flex items-start gap-2.5">
                    <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="capitalize">
                        {formatDate(event.startsAt, event.timezone)}
                    </span>
                </div>
                <div className="flex items-start gap-2.5">
                    <Clock3 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>
                        {formatTime(event.startsAt, event.timezone)} –{' '}
                        {formatTime(event.endsAt, event.timezone)}
                    </span>
                </div>
                <div className="flex items-start gap-2.5">
                    <UserRound className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{event.creator.name}</span>
                </div>
                <div className="flex items-start gap-2.5">
                    <Users className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>
                        {event.capacity === null
                            ? `${event.registrationsCount} inscrit${event.registrationsCount > 1 ? 's' : ''}`
                            : `${event.spotsRemaining ?? 0} place${(event.spotsRemaining ?? 0) > 1 ? 's' : ''} restante${(event.spotsRemaining ?? 0) > 1 ? 's' : ''}`}
                    </span>
                </div>
                {event.location ? (
                    <div className="flex items-start gap-2.5 sm:col-span-2">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{event.location}</span>
                    </div>
                ) : null}
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                {event.meetingUrl ? (
                    <Button asChild className="rounded-full">
                        <a
                            href={event.meetingUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Rejoindre le live{' '}
                            <ExternalLink className="size-3.5" />
                        </a>
                    </Button>
                ) : !authenticated ? (
                    <Button asChild className="rounded-full">
                        <Link href="/login">Se connecter pour s’inscrire</Link>
                    </Button>
                ) : event.isRegistered ? (
                    <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={unregister}
                    >
                        Annuler mon inscription
                    </Button>
                ) : (
                    <Button
                        className="rounded-full"
                        onClick={register}
                        disabled={event.isFull}
                    >
                        {event.isFull ? 'Complet' : 'S’inscrire'}
                    </Button>
                )}

                {event.canManage ? (
                    <Button
                        variant="ghost"
                        className="rounded-full text-muted-foreground"
                        onClick={cancel}
                    >
                        Annuler l’événement
                    </Button>
                ) : null}
            </div>
        </article>
    );
}
