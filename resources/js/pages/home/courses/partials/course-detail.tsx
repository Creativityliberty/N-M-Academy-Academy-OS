import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Clock,
    Users,
    Star,
    ChevronLeft,
    ArrowRight,
    CheckCircle2,
    PlayCircle,
    Lock,
    Share2,
    Copy,
    Check,
    MessageCircle,
    Facebook,
    BookOpen,
    Award,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Link, router, usePage } from '@inertiajs/react';
import type { Course } from '../types';

function StarRating({ rating, count }: { rating: number; count?: number }) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                    <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-foreground/10 text-foreground/10'}`}
                    />
                ))}
            </div>
            <span className="font-semibold text-white/60">
                {rating.toFixed(1)}
            </span>
            {count !== undefined && (
                <span className="text-sm text-white/60">
                    ({count.toLocaleString('fr-FR')} étudiants)
                </span>
            )}
        </div>
    );
}

function ShareButtons({ title }: { title: string }) {
    const [copied, setCopied] = useState(false);
    const url = typeof window !== 'undefined' ? window.location.href : '';

    const copyLink = async () => {
        await navigator.clipboard.writeText(url).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <a
                href={`https://wa.me/?text=${encodeURIComponent(title + ' — ' + url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-4 py-2 text-xs font-medium text-foreground/70 transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-600 dark:border-border/50"
            >
                <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-4 py-2 text-xs font-medium text-foreground/70 transition-colors hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-600 dark:border-border/50"
            >
                <Facebook className="h-4 w-4" /> Facebook
            </a>
            <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-4 py-2 text-xs font-medium text-foreground/70 transition-colors hover:border-border/70 hover:text-foreground dark:border-border/50"
            >
                {copied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                    <Copy className="h-4 w-4" />
                )}
                {copied ? 'Copié !' : 'Copier le lien'}
            </button>
        </div>
    );
}

export function CourseDetail({ course }: { course: Course }) {
    const [activeModule, setActiveModule] = useState('module-0');
    const [selectedOfferId, setSelectedOfferId] = useState<number | null>(
        () =>
            course.offers?.find((offer) => offer.is_default)?.id ??
            course.offers?.[0]?.id ??
            null,
    );
    const [coupon, setCoupon] = useState('');
    const { auth } = usePage().props;

    const offers = course.offers ?? [];
    const selectedOffer =
        offers.find((offer) => offer.id === selectedOfferId) ??
        offers.find((offer) => offer.is_default) ??
        offers[0];

    function handleCheckout() {
        const affiliate =
            typeof window !== 'undefined'
                ? new URLSearchParams(window.location.search).get('ref')
                : null;
        const payload = {
            course_id: course.id,
            offer_id: selectedOffer?.id ?? null,
            coupon: coupon || null,
            affiliate,
        };

        if (!auth.user) {
            const params = new URLSearchParams();

            if (selectedOffer?.id) {
                params.set('offer', String(selectedOffer.id));
            }

            if (coupon) {
                params.set('coupon', coupon);
            }

            if (affiliate) {
                params.set('ref', affiliate);
            }

            router.visit(`/courses/${course.id}/checkout?${params.toString()}`);

            return;
        }

        router.post('/courses/checkout', payload, { preserveScroll: true });
    }

    const objectives = course.objectives ?? [];
    const prerequisites = course.prerequisites ?? [];
    const reviews = course.reviews ?? [];
    const trainerCourseCount = course.trainer?.courseCount;
    const trainerStudentCount = course.trainer?.studentCount;

    const formatOfferPrice = (offer: NonNullable<Course['offers']>[number]) => {
        if (offer.billing_type === 'free' || offer.amount === 0) {
            return 'Gratuit';
        }

        const value = new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: offer.currency,
        }).format(offer.amount / 100);

        return offer.billing_type === 'subscription'
            ? `${value} / ${offer.interval === 'year' ? 'an' : 'mois'}`
            : value;
    };
    const minPrice = selectedOffer
        ? formatOfferPrice(selectedOffer)
        : course.price;
    const totalLessons =
        course.lessonCount ??
        course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) ??
        0;

    return (
        <div className="relative min-h-screen">
            {/* Hero */}
            <section className="relative h-[480px] overflow-hidden md:h-[560px]">
                <img
                    src={course.image}
                    alt={course.title}
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

                <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-between px-6 py-8 md:px-8 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Link
                            href="/courses"
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur transition-colors hover:bg-white/20"
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                            Retour aux formations
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase backdrop-blur">
                                {course.category}
                            </span>
                        </div>

                        <h1 className="mb-4 max-w-3xl text-3xl leading-tight font-semibold tracking-tight text-white md:text-5xl">
                            {course.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/75">
                            <StarRating
                                rating={course.rating}
                                count={course.studentCount}
                            />
                            <span className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-white/50" />
                                {course.duration} min
                            </span>
                            <span className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-white/50" />
                                {course.moduleCount} modules · {totalLessons}{' '}
                                leçons
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Quick stats */}
            <div className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-4 md:px-8 lg:px-12">
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                        <Clock className="h-4 w-4 text-primary/60" />
                        <span>{course.duration} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                        <Users className="h-4 w-4 text-primary/60" />
                        <span>
                            {course.studentCount.toLocaleString('fr-FR')}{' '}
                            étudiants
                        </span>
                    </div>
                    {minPrice && (
                        <div className="flex items-center gap-2 text-sm text-foreground/60">
                            <Award className="h-4 w-4 text-primary/60" />
                            <span>
                                À partir de{' '}
                                <strong className="text-foreground">
                                    {minPrice}
                                </strong>
                            </span>
                        </div>
                    )}
                    {course.trainer && (
                        <div className="flex items-center gap-2 text-sm text-foreground/60">
                            <Share2 className="h-4 w-4 text-primary/60" />
                            <span>
                                Animé par{' '}
                                <strong className="text-foreground">
                                    {course.trainer.name}
                                </strong>
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main content */}
            <div className="mx-auto max-w-7xl px-6 py-14 md:px-8 lg:px-12">
                <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
                    {/* Left column */}
                    <div className="min-w-0 flex-1 space-y-16">
                        {/* Description */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <p className="text-lg leading-relaxed text-foreground/70">
                                {course.description}
                            </p>
                        </motion.section>

                        {/* Objectives */}
                        {objectives && objectives.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="mb-8">
                                    <p className="mb-1 text-xs font-semibold tracking-[0.25em] text-foreground/40 uppercase">
                                        Ce que vous apprendrez
                                    </p>
                                    <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
                                        Objectifs de la formation
                                    </h2>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {objectives.map((obj) => (
                                        <Card
                                            key={obj.title}
                                            className="border-border/40 bg-background/60 backdrop-blur-sm dark:border-border/50 dark:bg-background/50"
                                        >
                                            <CardContent className="p-6">
                                                <CheckCircle2
                                                    className="mb-4 h-6 w-6 text-primary"
                                                    aria-hidden="true"
                                                />
                                                <h3 className="mb-2 font-semibold text-foreground">
                                                    {obj.title}
                                                </h3>
                                                <p className="text-sm leading-relaxed text-foreground/60">
                                                    {obj.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Curriculum */}
                        {course.modules && course.modules.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="mb-8">
                                    <p className="mb-1 text-xs font-semibold tracking-[0.25em] text-foreground/40 uppercase">
                                        Contenu du cours
                                    </p>
                                    <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
                                        Programme
                                    </h2>
                                </div>
                                <Accordion
                                    type="single"
                                    collapsible
                                    value={activeModule}
                                    onValueChange={setActiveModule}
                                >
                                    {course.modules.map((module, i) => (
                                        <AccordionItem
                                            key={module.id}
                                            value={`module-${i}`}
                                            className="mb-3 overflow-hidden rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm dark:border-border/50 dark:bg-background/50"
                                        >
                                            <AccordionTrigger className="px-6 py-5 hover:bg-muted/40 hover:no-underline">
                                                <div className="flex items-center gap-4 text-left">
                                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                                                        {module.order}
                                                    </span>
                                                    <div>
                                                        <p className="font-semibold text-foreground">
                                                            {module.title}
                                                        </p>
                                                        <p className="text-xs text-foreground/40">
                                                            {
                                                                module.lessons
                                                                    .length
                                                            }{' '}
                                                            leçons ·{' '}
                                                            {module.duration}{' '}
                                                            min
                                                        </p>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="divide-y divide-border/20 border-t border-border/30 px-6">
                                                    {module.lessons.map(
                                                        (lesson, j) => (
                                                            <div
                                                                key={j}
                                                                className="flex items-center gap-4 py-3 text-sm"
                                                            >
                                                                {lesson.free ? (
                                                                    <PlayCircle className="h-4 w-4 shrink-0 text-primary/60" />
                                                                ) : (
                                                                    <Lock className="h-4 w-4 shrink-0 text-foreground/20" />
                                                                )}
                                                                <span className="flex-1 text-foreground/70">
                                                                    {
                                                                        lesson.title
                                                                    }
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    {lesson.free && (
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="border-primary/30 text-[10px] text-primary"
                                                                        >
                                                                            Gratuit
                                                                        </Badge>
                                                                    )}
                                                                    <span className="shrink-0 text-xs text-foreground/40">
                                                                        {
                                                                            lesson.duration
                                                                        }{' '}
                                                                        min
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </motion.section>
                        )}

                        {/* Prerequisites */}
                        {prerequisites && prerequisites.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="mb-6">
                                    <p className="mb-1 text-xs font-semibold tracking-[0.25em] text-foreground/40 uppercase">
                                        Avant de commencer
                                    </p>
                                    <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
                                        Prérequis
                                    </h2>
                                </div>
                                <ul className="space-y-2">
                                    {prerequisites.map((req) => (
                                        <li
                                            key={req}
                                            className="flex items-start gap-3 text-sm text-foreground/70"
                                        >
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary/60" />
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </motion.section>
                        )}

                        {/* Instructor */}
                        {course.trainer && (
                            <motion.section
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="mb-8">
                                    <p className="mb-1 text-xs font-semibold tracking-[0.25em] text-foreground/40 uppercase">
                                        Votre guide
                                    </p>
                                    <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
                                        Le formateur
                                    </h2>
                                </div>
                                <Card className="border-border/40 bg-background/60 backdrop-blur-sm dark:border-border/50 dark:bg-background/50">
                                    <CardContent className="p-6">
                                        <div className="mb-4 flex items-center gap-4">
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                                                {course.trainer.initials}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">
                                                    {course.trainer.name}
                                                </p>
                                                <p className="text-xs text-foreground/50">
                                                    {course.trainer.role}
                                                </p>
                                                {(trainerCourseCount ||
                                                    trainerStudentCount) && (
                                                    <div className="mt-1 flex gap-3 text-xs text-foreground/40">
                                                        {trainerCourseCount && (
                                                            <span>
                                                                {
                                                                    trainerCourseCount
                                                                }{' '}
                                                                cours publiés
                                                            </span>
                                                        )}
                                                        {trainerStudentCount && (
                                                            <span>
                                                                {
                                                                    trainerStudentCount
                                                                }{' '}
                                                                étudiants
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {course.trainer.bio && (
                                            <p className="text-sm leading-relaxed text-foreground/60">
                                                {course.trainer.bio}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.section>
                        )}

                        {/* Reviews */}
                        {reviews && reviews.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="mb-8">
                                    <p className="mb-1 text-xs font-semibold tracking-[0.25em] text-foreground/40 uppercase">
                                        Retours d'expérience
                                    </p>
                                    <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
                                        Avis des étudiants
                                    </h2>
                                </div>
                                <div className="grid gap-5 md:grid-cols-2">
                                    {reviews.map((review) => (
                                        <Card
                                            key={review.name}
                                            className="border-border/40 bg-background/60 backdrop-blur-sm dark:border-border/50 dark:bg-background/50"
                                        >
                                            <CardContent className="p-6">
                                                <div className="mb-4 flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                                        {review.initials}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-foreground">
                                                            {review.name}
                                                        </p>
                                                        <p className="text-xs text-foreground/50">
                                                            {review.role}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mb-3 flex gap-0.5">
                                                    {Array.from(
                                                        { length: 5 },
                                                        (_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-foreground/10 text-foreground/10'}`}
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                                <p className="text-sm leading-relaxed text-foreground/70 italic">
                                                    "{review.text}"
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Share */}
                        <motion.section
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="mb-5">
                                <p className="mb-1 text-xs font-semibold tracking-[0.25em] text-foreground/40 uppercase">
                                    Partager
                                </p>
                                <h2 className="text-xl font-semibold text-foreground">
                                    Partager cette formation
                                </h2>
                            </div>
                            <ShareButtons title={course.title} />
                        </motion.section>
                    </div>

                    {/* Right column — sticky */}
                    <div className="hidden shrink-0 lg:block lg:w-80 xl:w-96">
                        <div className="sticky top-20 space-y-4">
                            <Card className="border-border/40 bg-background/70 backdrop-blur-md dark:border-border/50 dark:bg-background/60">
                                <CardContent className="p-6">
                                    <p className="mb-1 text-xs font-semibold tracking-[0.2em] text-foreground/40 uppercase">
                                        Accès complet
                                    </p>
                                    <p className="mb-5 text-3xl font-bold text-foreground">
                                        {minPrice}
                                    </p>

                                    {offers.length > 0 && (
                                        <div className="mb-5 space-y-2">
                                            {offers.map((offer) => (
                                                <button
                                                    key={offer.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedOfferId(
                                                            offer.id,
                                                        )
                                                    }
                                                    className={`w-full rounded-xl border p-3 text-left transition ${selectedOffer?.id === offer.id ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/40'}`}
                                                >
                                                    <div className="flex items-center justify-between gap-3">
                                                        <span className="text-sm font-medium text-foreground">
                                                            {offer.name}
                                                        </span>
                                                        <span className="text-sm font-semibold text-foreground">
                                                            {formatOfferPrice(
                                                                offer,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Niveau d'accès{' '}
                                                        {offer.access_rank}
                                                        {offer.trial_days > 0
                                                            ? ` · ${offer.trial_days} jours d'essai`
                                                            : ''}
                                                    </p>
                                                </button>
                                            ))}
                                            <Input
                                                value={coupon}
                                                onChange={(event) =>
                                                    setCoupon(
                                                        event.target.value.toUpperCase(),
                                                    )
                                                }
                                                placeholder="Code promo (optionnel)"
                                            />
                                        </div>
                                    )}

                                    {course.benefits &&
                                        course.benefits.length > 0 && (
                                            <ul className="mb-5 space-y-2">
                                                {course.benefits.map(
                                                    (benefit) => (
                                                        <li
                                                            key={benefit}
                                                            className="flex items-center gap-2 text-sm text-foreground/70"
                                                        >
                                                            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary/60" />
                                                            {benefit}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        )}

                                    {course.is_enrolled ? (
                                        <Button
                                            size="lg"
                                            className="w-full gap-2 rounded-full"
                                            asChild
                                        >
                                            <Link
                                                href={`/student/courses/${course.id}`}
                                            >
                                                Accéder au cours
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button
                                            size="lg"
                                            className="w-full gap-2 rounded-full"
                                            onClick={handleCheckout}
                                        >
                                            Accéder à la formation
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <p className="mt-3 text-center text-xs text-foreground/40">
                                        Paiement sécurisé · Accès immédiat
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border/40 bg-background/60 backdrop-blur-sm dark:border-border/50 dark:bg-background/50">
                                <CardContent className="p-5">
                                    <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-foreground/40 uppercase">
                                        Partager
                                    </p>
                                    <ShareButtons title={course.title} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sticky CTA */}
            <div className="sticky bottom-0 z-30 border-t border-border/40 bg-background/95 p-4 backdrop-blur-md lg:hidden">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs text-foreground/50">
                            À partir de
                        </p>
                        <p className="font-semibold text-foreground">
                            {minPrice ?? 'Gratuit'}
                        </p>
                    </div>
                    {course.is_enrolled ? (
                        <Button
                            size="lg"
                            className="gap-2 rounded-full px-8"
                            asChild
                        >
                            <Link href={`/student/courses/${course.id}`}>
                                Accéder <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            className="gap-2 rounded-full px-8"
                            onClick={handleCheckout}
                        >
                            Accéder <ArrowRight className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
