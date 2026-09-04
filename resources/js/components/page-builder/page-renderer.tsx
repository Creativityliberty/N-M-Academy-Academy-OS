import { Link } from '@inertiajs/react';
import { Check, ChevronDown, Clock3, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Section = {
    id: number;
    type: string;
    variant: string;
    settings: Record<string, any>;
    data: Record<string, any>;
};

type Props = { sections: Section[]; editor?: boolean };

const money = (amount: number, currency = 'EUR') =>
    new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency.toUpperCase(),
    }).format(amount / 100);

export function PageRenderer({ sections, editor = false }: Props) {
    return (
        <div
            className={
                editor
                    ? 'overflow-hidden rounded-2xl border bg-background'
                    : 'bg-background'
            }
        >
            {sections.map((section) => (
                <SectionRenderer key={section.id} section={section} />
            ))}
        </div>
    );
}

function SectionRenderer({ section }: { section: Section }) {
    const s = section.settings ?? {};
    const course = section.data?.course;
    const wrap = 'mx-auto w-full max-w-6xl px-6 py-16 sm:py-20';

    if (section.type === 'hero') {
        return (
            <section className="border-b bg-gradient-to-b from-[var(--brand-primary-soft)]/60 to-background">
                <div
                    className={`${wrap} ${section.variant === 'centered' ? 'text-center' : ''}`}
                >
                    <div
                        className={
                            section.variant === 'split'
                                ? 'grid items-center gap-10 lg:grid-cols-2'
                                : ''
                        }
                    >
                        <div>
                            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
                                {s.headline ||
                                    course?.title ||
                                    'Votre prochaine transformation commence ici.'}
                            </h1>
                            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
                                {s.subheadline ||
                                    course?.description ||
                                    'Une expérience de formation claire, premium et entièrement à votre image.'}
                            </p>
                            <div
                                className={`mt-8 flex flex-wrap gap-3 ${section.variant === 'centered' ? 'justify-center' : ''}`}
                            >
                                {s.primary_label && (
                                    <Button asChild size="lg">
                                        <a href={s.primary_url || '#pricing'}>
                                            {s.primary_label}
                                        </a>
                                    </Button>
                                )}
                                {s.secondary_label && (
                                    <Button asChild size="lg" variant="outline">
                                        <a
                                            href={
                                                s.secondary_url || '#curriculum'
                                            }
                                        >
                                            {s.secondary_label}
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                        {section.variant === 'split' && (
                            <div className="academy-panel aspect-[4/3] rounded-[2rem] p-8">
                                <div className="flex h-full items-end rounded-[1.4rem] border bg-background/80 p-6">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Academy experience
                                        </p>
                                        <p className="mt-2 text-2xl font-semibold">
                                            {course?.title ||
                                                'Programme premium'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    if (section.type === 'features') {
        return (
            <section>
                <div className={wrap}>
                    <h2 className="text-3xl font-semibold">
                        {s.title || 'Pourquoi ce programme ?'}
                    </h2>
                    {s.description && (
                        <p className="mt-3 max-w-2xl text-muted-foreground">
                            {s.description}
                        </p>
                    )}
                    <div
                        className={`mt-8 ${section.variant === 'list' ? 'space-y-3' : 'grid gap-4 md:grid-cols-3'}`}
                    >
                        {(s.items || []).map((item: any, i: number) => (
                            <div
                                key={i}
                                className="academy-panel rounded-2xl p-5"
                            >
                                <Check className="size-5" />
                                <h3 className="mt-4 font-semibold">
                                    {typeof item === 'string'
                                        ? item
                                        : item.title}
                                </h3>
                                {typeof item !== 'string' &&
                                    item.description && (
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {item.description}
                                        </p>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (section.type === 'instructor') {
        return (
            <section className="border-y bg-muted/20">
                <div
                    className={`${wrap} grid gap-8 md:grid-cols-[180px_1fr] md:items-center`}
                >
                    <div className="aspect-square rounded-full border bg-background" />{' '}
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Votre formateur
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold">
                            {course?.trainer?.name || 'Formateur Academy'}
                        </h2>
                        <p className="mt-1 font-medium">
                            {course?.trainer?.title}
                        </p>
                        <p className="mt-4 max-w-2xl text-muted-foreground">
                            {course?.trainer?.bio ||
                                'Présentez ici l’expertise et la méthode du formateur.'}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (section.type === 'course') {
        return (
            <section>
                <div className={wrap}>
                    <div className="grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {s.title || 'La formation'}
                            </p>
                            <h2 className="mt-2 text-4xl font-semibold">
                                {course?.title || 'Sélectionnez une formation'}
                            </h2>
                            <p className="mt-5 text-muted-foreground">
                                {s.description || course?.description}
                            </p>
                        </div>
                        <div className="academy-panel rounded-2xl p-6">
                            <Clock3 className="size-5" />
                            <p className="mt-3 text-sm text-muted-foreground">
                                Durée estimée
                            </p>
                            <p className="text-2xl font-semibold">
                                {course?.duration
                                    ? `${course.duration} min`
                                    : '—'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (section.type === 'curriculum') {
        return (
            <section id="curriculum" className="bg-muted/20">
                <div className={wrap}>
                    <h2 className="text-3xl font-semibold">
                        {s.title || 'Programme'}
                    </h2>
                    <div className="mt-8 space-y-3">
                        {(course?.modules || []).map(
                            (module: any, index: number) => (
                                <details
                                    key={module.id}
                                    className="academy-panel rounded-2xl p-5"
                                    open={index === 0}
                                >
                                    <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                                        <span>
                                            {index + 1}. {module.title}
                                        </span>
                                        <ChevronDown className="size-4" />
                                    </summary>
                                    {s.show_lessons !== false && (
                                        <div className="mt-4 space-y-2 border-t pt-4">
                                            {module.lessons.map(
                                                (lesson: any) => (
                                                    <div
                                                        key={lesson.id}
                                                        className="flex items-center gap-3 text-sm text-muted-foreground"
                                                    >
                                                        <PlayCircle className="size-4" />
                                                        {lesson.title}
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </details>
                            ),
                        )}
                    </div>
                </div>
            </section>
        );
    }

    if (section.type === 'testimonials') {
        return (
            <section>
                <div className={wrap}>
                    <h2 className="text-3xl font-semibold">
                        {s.title || 'Ils en parlent'}
                    </h2>
                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        {(s.items || []).map((item: any, i: number) => (
                            <figure
                                key={i}
                                className="academy-panel rounded-2xl p-6"
                            >
                                <blockquote className="text-lg">
                                    “{item.quote || item}”
                                </blockquote>
                                {item.name && (
                                    <figcaption className="mt-4 text-sm text-muted-foreground">
                                        {item.name}
                                    </figcaption>
                                )}
                            </figure>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (section.type === 'pricing') {
        return (
            <section id="pricing" className="border-y bg-muted/20">
                <div className={wrap}>
                    <div className="text-center">
                        <h2 className="text-3xl font-semibold">
                            {s.title || 'Choisissez votre accès'}
                        </h2>
                        {s.description && (
                            <p className="mt-3 text-muted-foreground">
                                {s.description}
                            </p>
                        )}
                    </div>
                    <div className="mx-auto mt-9 grid max-w-4xl gap-4 md:grid-cols-3">
                        {(section.data?.offers || []).map((offer: any) => (
                            <div
                                key={offer.id}
                                className="academy-panel rounded-2xl p-6"
                            >
                                <h3 className="text-lg font-semibold">
                                    {offer.name}
                                </h3>
                                <p className="mt-4 text-3xl font-semibold">
                                    {offer.billing_type === 'free'
                                        ? 'Gratuit'
                                        : money(offer.amount, offer.currency)}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {offer.billing_type === 'subscription'
                                        ? `par ${offer.interval === 'year' ? 'an' : 'mois'}`
                                        : offer.billing_type === 'one_time'
                                          ? 'paiement unique'
                                          : 'accès gratuit'}
                                </p>
                                <Button asChild className="mt-6 w-full">
                                    <Link
                                        href={`/courses/${course?.id}/checkout?offer=${offer.id}`}
                                    >
                                        Choisir cette offre
                                    </Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (section.type === 'faq') {
        return (
            <section>
                <div className={`${wrap} max-w-4xl`}>
                    <h2 className="text-3xl font-semibold">
                        {s.title || 'Questions fréquentes'}
                    </h2>
                    <div className="mt-8 space-y-3">
                        {(s.items || []).map((item: any, i: number) => (
                            <details key={i} className="rounded-2xl border p-5">
                                <summary className="cursor-pointer font-medium">
                                    {item.question}
                                </summary>
                                <p className="mt-3 text-sm text-muted-foreground">
                                    {item.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (section.type === 'cta') {
        return (
            <section>
                <div className={`${wrap} text-center`}>
                    <div className="rounded-[2rem] bg-foreground px-6 py-14 text-background">
                        <h2 className="text-3xl font-semibold">
                            {s.title || 'Prêt à commencer ?'}
                        </h2>
                        {s.description && (
                            <p className="mx-auto mt-3 max-w-xl text-background/70">
                                {s.description}
                            </p>
                        )}
                        <Button
                            asChild
                            size="lg"
                            variant="secondary"
                            className="mt-7"
                        >
                            <a href={s.button_url || '#pricing'}>
                                {s.button_label || 'Découvrir les offres'}
                            </a>
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    if (section.type === 'footer') {
        return (
            <footer className="border-t">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <span>{s.tagline || 'Votre Academy.'}</span>
                    <div className="flex gap-4">
                        {(s.links || []).map((link: any, i: number) => (
                            <a key={i} href={link.url || '#'}>
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        );
    }

    return null;
}
