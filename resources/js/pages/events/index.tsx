import { Head, useForm, usePage } from '@inertiajs/react';
import { CalendarPlus, Clock3 } from 'lucide-react';
import { DashboardHero } from '@/components/dashboard-hero';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EventCard } from '@/features/events/event-card';
import { MonthCalendar } from '@/features/events/month-calendar';
import type { EventsPageProps } from '@/features/events/types';

export default function EventsIndex() {
    const { events, canCreate } = usePage<EventsPageProps>().props;
    const timezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Paris';
    const form = useForm({
        title: '',
        description: '',
        starts_at: '',
        ends_at: '',
        timezone,
        meeting_url: '',
        location: '',
        capacity: '',
        reminder_minutes: '60',
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post('/communaute/evenements', {
            preserveScroll: true,
            onSuccess: () =>
                form.reset(
                    'title',
                    'description',
                    'starts_at',
                    'ends_at',
                    'meeting_url',
                    'location',
                    'capacity',
                ),
        });
    };

    const myEvents = events.filter((event) => event.isRegistered);

    return (
        <>
            <Head title="Événements" />

            <div className="mx-auto w-full max-w-[1480px] space-y-6 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title="Événements"
                    description="Planifiez les prochains rendez-vous, inscrivez-vous aux lives et retrouvez les liens de connexion au même endroit que vos formations."
                />

                <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
                    <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
                        <MonthCalendar events={events} />

                        <section className="rounded-[var(--academy-radius)] border border-border/60 bg-background/80 p-4 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="rounded-xl bg-brand-primary-soft p-2 text-brand-secondary">
                                    <Clock3 className="size-4" />
                                </div>
                                <div>
                                    <h2 className="font-semibold">
                                        Mes inscriptions
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {myEvents.length > 0
                                            ? `${myEvents.length} événement${myEvents.length > 1 ? 's' : ''} à venir.`
                                            : 'Aucune inscription à venir.'}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </aside>

                    <main className="min-w-0 space-y-6">
                        {canCreate ? (
                            <section className="rounded-[var(--academy-radius)] border border-border/60 bg-background/80 p-5 shadow-sm sm:p-6">
                                <div className="mb-5 flex items-start gap-3">
                                    <div className="rounded-xl bg-brand-primary-soft p-2.5 text-brand-secondary">
                                        <CalendarPlus className="size-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            Créer un événement
                                        </h2>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Un lien live ou un lieu suffit. Le
                                            rappel est envoyé automatiquement
                                            aux inscrits.
                                        </p>
                                    </div>
                                </div>

                                <form
                                    onSubmit={submit}
                                    className="grid gap-4 sm:grid-cols-2"
                                >
                                    <div className="sm:col-span-2">
                                        <Input
                                            value={form.data.title}
                                            onChange={(event) =>
                                                form.setData(
                                                    'title',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Titre de l’événement"
                                            required
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Textarea
                                            value={form.data.description}
                                            onChange={(event) =>
                                                form.setData(
                                                    'description',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Ce que les participants vont apprendre ou faire…"
                                            rows={4}
                                            required
                                        />
                                    </div>
                                    <label className="space-y-1.5 text-sm font-medium">
                                        <span>Début</span>
                                        <Input
                                            type="datetime-local"
                                            value={form.data.starts_at}
                                            onChange={(event) =>
                                                form.setData(
                                                    'starts_at',
                                                    event.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </label>
                                    <label className="space-y-1.5 text-sm font-medium">
                                        <span>Fin</span>
                                        <Input
                                            type="datetime-local"
                                            value={form.data.ends_at}
                                            onChange={(event) =>
                                                form.setData(
                                                    'ends_at',
                                                    event.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </label>
                                    <label className="space-y-1.5 text-sm font-medium">
                                        <span>Lien live</span>
                                        <Input
                                            type="url"
                                            value={form.data.meeting_url}
                                            onChange={(event) =>
                                                form.setData(
                                                    'meeting_url',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="https://meet.google.com/..."
                                        />
                                    </label>
                                    <label className="space-y-1.5 text-sm font-medium">
                                        <span>Lieu</span>
                                        <Input
                                            value={form.data.location}
                                            onChange={(event) =>
                                                form.setData(
                                                    'location',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Paris, salle, adresse…"
                                        />
                                    </label>
                                    <label className="space-y-1.5 text-sm font-medium">
                                        <span>Capacité</span>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={form.data.capacity}
                                            onChange={(event) =>
                                                form.setData(
                                                    'capacity',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Illimitée"
                                        />
                                    </label>
                                    <label className="space-y-1.5 text-sm font-medium">
                                        <span>Rappel avant le début</span>
                                        <select
                                            value={form.data.reminder_minutes}
                                            onChange={(event) =>
                                                form.setData(
                                                    'reminder_minutes',
                                                    event.target.value,
                                                )
                                            }
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                                        >
                                            <option value="0">
                                                Aucun rappel
                                            </option>
                                            <option value="30">
                                                30 minutes
                                            </option>
                                            <option value="60">1 heure</option>
                                            <option value="1440">
                                                24 heures
                                            </option>
                                        </select>
                                    </label>
                                    <input
                                        type="hidden"
                                        value={form.data.timezone}
                                        readOnly
                                    />
                                    <div className="flex items-center justify-between gap-3 sm:col-span-2">
                                        <p className="text-xs text-muted-foreground">
                                            Fuseau : {form.data.timezone}
                                        </p>
                                        <Button
                                            type="submit"
                                            className="rounded-full"
                                            disabled={form.processing}
                                        >
                                            Publier l’événement
                                        </Button>
                                    </div>
                                </form>
                            </section>
                        ) : null}

                        <section>
                            <div className="mb-4 flex items-end justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                                        Agenda
                                    </p>
                                    <h2 className="mt-1 text-xl font-semibold">
                                        Prochains rendez-vous
                                    </h2>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {events.length} à venir
                                </span>
                            </div>

                            {events.length > 0 ? (
                                <div className="grid gap-5 lg:grid-cols-2">
                                    {events.map((event) => (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            authenticated
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-[var(--academy-radius)] border border-dashed border-border/60 bg-background/70 px-6 py-14 text-center">
                                    <CalendarPlus className="mx-auto size-8 text-muted-foreground/45" />
                                    <h3 className="mt-4 font-semibold">
                                        Aucun événement à venir
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Le prochain rendez-vous apparaîtra ici
                                        dès sa publication.
                                    </p>
                                </div>
                            )}
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}
