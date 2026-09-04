import { Link } from '@inertiajs/react';
import {
    Check,
    ChevronDown,
    Clock3,
    PlayCircle,
    BookOpen,
    Users,
    Award,
    Copy,
    MessageCircle,
    Facebook,
    Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClipboard } from '@/hooks/use-clipboard';

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

/* ──── Share Buttons (reusable) ──── */
function ShareButtons({ title }: { title: string }) {
    const { isCopied, copy } = useClipboard();
    const url = typeof window !== 'undefined' ? window.location.href : '';

    const copyLink = () => {
        copy(url);
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <a
                href={`https://wa.me/?text=${encodeURIComponent(title + ' — ' + url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-4 py-2 text-xs font-medium text-foreground/70 transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-600"
            >
                <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-4 py-2 text-xs font-medium text-foreground/70 transition-colors hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-600"
            >
                <Facebook className="h-4 w-4" /> Facebook
            </a>
            <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-4 py-2 text-xs font-medium text-foreground/70 transition-colors hover:border-border/70 hover:text-foreground"
            >
                {isCopied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                    <Copy className="h-4 w-4" />
                )}
                {isCopied ? 'Copié !' : 'Copier le lien'}
            </button>
        </div>
    );
}

/* ──── Stats Bar (reusable) ──── */
function StatsBadges({ course }: { course: any }) {
    return (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {course.duration != null && (
                <span className="flex items-center gap-1.5">
                    <Clock3 className="size-4 text-primary/60" />
                    {course.duration} min
                </span>
            )}
            {(course.module_count != null || course.lesson_count != null) && (
                <span className="flex items-center gap-1.5">
                    <BookOpen className="size-4 text-primary/60" />
                    {course.module_count ?? 0} modules · {course.lesson_count ?? 0} leçons
                </span>
            )}
            {course.student_count != null && (
                <span className="flex items-center gap-1.5">
                    <Users className="size-4 text-primary/60" />
                    {course.student_count.toLocaleString('fr-FR')} étudiants
                </span>
            )}
            {course.min_price != null && course.min_price > 0 && (
                <span className="flex items-center gap-1.5">
                    <Award className="size-4 text-primary/60" />
                    À partir de{' '}
                    <strong className="text-foreground">
                        {money(course.min_price, course.min_currency)}
                    </strong>
                </span>
            )}
        </div>
    );
}

/* ──── Trainer Avatar (reusable) ──── */
function TrainerAvatar({
    trainer,
    size = 'md',
}: {
    trainer: any;
    size?: 'sm' | 'md' | 'lg';
}) {
    const dims = size === 'lg' ? 'h-28 w-28 text-3xl' : size === 'md' ? 'h-20 w-20 text-xl' : 'h-10 w-10 text-xs';

    if (trainer?.avatar) {
        return (
            <img
                src={trainer.avatar}
                alt={trainer.name}
                className={`${dims} rounded-full border-2 border-primary/20 object-cover`}
            />
        );
    }

    return (
        <div
            className={`${dims} flex items-center justify-center rounded-full border-2 border-primary/20 bg-gradient-to-br from-primary/20 to-primary/40 font-bold text-primary`}
        >
            {trainer?.initials || '?'}
        </div>
    );
}

/* ──── Main Renderer ──── */
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

    /* ──────────── HERO ──────────── */
    if (section.type === 'hero') {
        const hasBanner = !!course?.image;

        // Cinematic banner hero (when course image exists)
        if (hasBanner) {
            return (
                <section className="relative overflow-hidden">
                    {/* 16:9 banner background */}
                    <div className="relative aspect-video max-h-[560px] w-full">
                        <img
                            src={course.image}
                            alt={course.title || s.headline || ''}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-10">
                            {course.category && (
                                <span className="mb-3 inline-block w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase backdrop-blur">
                                    {course.category}
                                </span>
                            )}
                            <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                                {s.headline || course?.title || 'Votre prochaine transformation commence ici.'}
                            </h1>
                            <p className="mt-4 max-w-2xl text-lg text-white/75">
                                {s.subheadline || course?.description || ''}
                            </p>
                            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
                                {course.duration != null && (
                                    <span className="flex items-center gap-1.5">
                                        <Clock3 className="size-4 text-white/50" />
                                        {course.duration} min
                                    </span>
                                )}
                                {(course.module_count != null || course.lesson_count != null) && (
                                    <span className="flex items-center gap-1.5">
                                        <BookOpen className="size-4 text-white/50" />
                                        {course.module_count ?? 0} modules · {course.lesson_count ?? 0} leçons
                                    </span>
                                )}
                                {course.student_count != null && (
                                    <span className="flex items-center gap-1.5">
                                        <Users className="size-4 text-white/50" />
                                        {course.student_count.toLocaleString('fr-FR')} étudiants
                                    </span>
                                )}
                            </div>
                            <div className="mt-7 flex flex-wrap gap-3">
                                {s.primary_label && (
                                    <Button asChild size="lg">
                                        <a href={s.primary_url || '#pricing'}>
                                            {s.primary_label}
                                        </a>
                                    </Button>
                                )}
                                {s.secondary_label && (
                                    <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                        <a href={s.secondary_url || '#curriculum'}>
                                            {s.secondary_label}
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            );
        }

        // Fallback: gradient hero without banner
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
                            {course?.category && (
                                <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase">
                                    {course.category}
                                </span>
                            )}
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
                            {course && (
                                <div className="mt-4">
                                    <StatsBadges course={course} />
                                </div>
                            )}
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

    /* ──────────── FEATURES ──────────── */
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

    /* ──────────── INSTRUCTOR ──────────── */
    if (section.type === 'instructor') {
        return (
            <section className="border-y bg-muted/20">
                <div
                    className={`${wrap} grid gap-8 md:grid-cols-[180px_1fr] md:items-center`}
                >
                    <TrainerAvatar trainer={course?.trainer} size="lg" />
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
                                'Présentez ici l\u2019expertise et la méthode du formateur.'}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    /* ──────────── COURSE ──────────── */
    if (section.type === 'course') {
        return (
            <section>
                <div className={wrap}>
                    {/* 16:9 Banner */}
                    {course?.image && (
                        <div className="mb-8 overflow-hidden rounded-2xl">
                            <img
                                src={course.image}
                                alt={course.title || s.title || ''}
                                className="aspect-video w-full object-cover"
                            />
                        </div>
                    )}

                    {/* Category badge */}
                    {course?.category && (
                        <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase">
                            {course.category}
                        </span>
                    )}

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

                            {/* Trainer snippet */}
                            {course?.trainer && (
                                <div className="mt-6 flex items-center gap-3">
                                    <TrainerAvatar trainer={course.trainer} size="sm" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Animé par {course.trainer.name}
                                        </p>
                                        {course.trainer.title && (
                                            <p className="text-xs text-muted-foreground">
                                                {course.trainer.title}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Share buttons */}
                            {course?.title && (
                                <div className="mt-6">
                                    <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Partager</p>
                                    <ShareButtons title={course.title} />
                                </div>
                            )}
                        </div>

                        {/* Right sidebar stats card */}
                        <div className="space-y-4">
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
                            {(course?.module_count != null || course?.lesson_count != null) && (
                                <div className="academy-panel rounded-2xl p-6">
                                    <BookOpen className="size-5" />
                                    <p className="mt-3 text-sm text-muted-foreground">
                                        Contenu
                                    </p>
                                    <p className="text-2xl font-semibold">
                                        {course.module_count ?? 0} modules
                                    </p>
                                    <p className="text-lg text-muted-foreground">
                                        {course.lesson_count ?? 0} leçons
                                    </p>
                                </div>
                            )}
                            {course?.min_price != null && course.min_price > 0 && (
                                <div className="academy-panel rounded-2xl p-6">
                                    <Award className="size-5" />
                                    <p className="mt-3 text-sm text-muted-foreground">
                                        À partir de
                                    </p>
                                    <p className="text-2xl font-semibold">
                                        {money(course.min_price, course.min_currency)}
                                    </p>
                                </div>
                            )}
                            {course?.student_count != null && (
                                <div className="academy-panel rounded-2xl p-6">
                                    <Users className="size-5" />
                                    <p className="mt-3 text-sm text-muted-foreground">
                                        Communauté
                                    </p>
                                    <p className="text-2xl font-semibold">
                                        {course.student_count.toLocaleString('fr-FR')} étudiants
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    /* ──────────── CURRICULUM ──────────── */
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
                                        <span className="flex items-center gap-3">
                                            <span className="text-xs font-normal text-muted-foreground">
                                                {module.lessons?.length ?? 0} leçons
                                                {module.duration ? ` · ${module.duration} min` : ''}
                                            </span>
                                            <ChevronDown className="size-4" />
                                        </span>
                                    </summary>
                                    {s.show_lessons !== false && (
                                        <div className="mt-4 space-y-2 border-t pt-4">
                                            {module.lessons.map(
                                                (lesson: any) => (
                                                    <div
                                                        key={lesson.id}
                                                        className="flex items-center justify-between gap-3 text-sm text-muted-foreground"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            {lesson.is_free ? (
                                                                <PlayCircle className="size-4 text-emerald-500" />
                                                            ) : (
                                                                <Lock className="size-4 text-muted-foreground/50" />
                                                            )}
                                                            <span>{lesson.title}</span>
                                                            {lesson.is_free && (
                                                                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                                                                    Gratuit
                                                                </span>
                                                            )}
                                                        </span>
                                                        {lesson.duration != null && lesson.duration > 0 && (
                                                            <span className="shrink-0 text-xs">
                                                                {lesson.duration} min
                                                            </span>
                                                        )}
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

    /* ──────────── TESTIMONIALS ──────────── */
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
                                    &ldquo;{item.quote || item}&rdquo;
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

    /* ──────────── PRICING ──────────── */
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

    /* ──────────── FAQ ──────────── */
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

    /* ──────────── CTA ──────────── */
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

    /* ──────────── FOOTER ──────────── */
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
