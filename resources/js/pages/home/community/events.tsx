import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/features/events/event-card';
import type { EventsPageProps } from '@/features/events/types';

export default function Events() {
    const { events } = usePage<EventsPageProps>().props;

    return (
        <>
            <Head title="Événements & ateliers" />

            <div className="relative min-h-screen pt-20">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-primary/[0.025] blur-[140px] dark:bg-primary/[0.04]" />
                </div>

                <div className="relative mx-auto max-w-6xl px-5 py-12 sm:px-6 md:py-16 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                            Les prochains rendez-vous de l’académie
                        </h1>
                        <p className="mt-5 text-base leading-7 text-muted-foreground md:text-lg">
                            Workshops, masterclasses et rencontres : retrouvez
                            les prochains temps forts animés par les formateurs
                            de la communauté.
                        </p>
                    </div>

                    {events.length > 0 ? (
                        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2">
                            {events.map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    authenticated={false}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-dashed border-border/60 bg-background/60 px-6 py-16 text-center backdrop-blur-sm">
                            <CalendarDays className="mx-auto size-9 text-muted-foreground/45" />
                            <h2 className="mt-4 text-lg font-semibold">
                                Aucun événement à venir
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Les prochains ateliers apparaîtront ici dès leur
                                publication.
                            </p>
                            <Button
                                asChild
                                variant="outline"
                                className="mt-6 rounded-full"
                            >
                                <Link href="/communaute/forum">
                                    Découvrir la communauté{' '}
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
