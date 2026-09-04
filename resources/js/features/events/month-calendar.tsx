import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { AcademyEvent } from '@/features/events/types';
import { cn } from '@/lib/utils';

type MonthCalendarProps = {
    events: AcademyEvent[];
};

const weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const dateKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const eventDateKey = (event: AcademyEvent) => {
    const parts = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: event.timezone,
    }).formatToParts(new Date(event.startsAt));
    const values = Object.fromEntries(
        parts.map((part) => [part.type, part.value]),
    );

    return `${values.year}-${values.month}-${values.day}`;
};

const sameDay = (a: Date, b: Date) => dateKey(a) === dateKey(b);

export function MonthCalendar({ events }: MonthCalendarProps) {
    const [cursor, setCursor] = useState(() => {
        const firstEvent = events[0]?.startsAt;
        const base = firstEvent ? new Date(firstEvent) : new Date();

        return new Date(base.getFullYear(), base.getMonth(), 1);
    });

    const days = useMemo(() => {
        const year = cursor.getFullYear();
        const month = cursor.getMonth();
        const first = new Date(year, month, 1);
        const mondayOffset = (first.getDay() + 6) % 7;
        const start = new Date(year, month, 1 - mondayOffset);

        return Array.from({ length: 42 }, (_, index) => {
            const date = new Date(start);
            date.setDate(start.getDate() + index);

            return date;
        });
    }, [cursor]);

    const monthLabel = new Intl.DateTimeFormat('fr-FR', {
        month: 'long',
        year: 'numeric',
    }).format(cursor);

    return (
        <section className="rounded-[var(--academy-radius)] border border-border/60 bg-background/80 p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                        Calendrier
                    </p>
                    <h2 className="mt-1 text-lg font-semibold capitalize">
                        {monthLabel}
                    </h2>
                </div>
                <div className="flex gap-1">
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                            setCursor(
                                new Date(
                                    cursor.getFullYear(),
                                    cursor.getMonth() - 1,
                                    1,
                                ),
                            )
                        }
                        aria-label="Mois précédent"
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                            setCursor(
                                new Date(
                                    cursor.getFullYear(),
                                    cursor.getMonth() + 1,
                                    1,
                                ),
                            )
                        }
                        aria-label="Mois suivant"
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
                {weekdays.map((weekday) => (
                    <div
                        key={weekday}
                        className="py-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase"
                    >
                        {weekday}
                    </div>
                ))}
                {days.map((date) => {
                    const eventCount = events.filter(
                        (event) => eventDateKey(event) === dateKey(date),
                    ).length;
                    const isCurrentMonth =
                        date.getMonth() === cursor.getMonth();
                    const isToday = sameDay(date, new Date());

                    return (
                        <div
                            key={date.toISOString()}
                            className={cn(
                                'relative flex aspect-square items-center justify-center rounded-xl text-xs transition-colors',
                                isCurrentMonth
                                    ? 'text-foreground'
                                    : 'text-muted-foreground/35',
                                eventCount > 0 &&
                                    'bg-brand-primary-soft font-semibold text-brand-secondary',
                                isToday && 'ring-1 ring-primary/40',
                            )}
                            title={
                                eventCount > 0
                                    ? `${eventCount} événement${eventCount > 1 ? 's' : ''}`
                                    : undefined
                            }
                        >
                            {date.getDate()}
                            {eventCount > 0 ? (
                                <span className="absolute bottom-1 size-1 rounded-full bg-primary" />
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
