import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Clock, Users, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, usePage } from '@inertiajs/react';
import type { Course } from '../courses/types';


function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    className={`h-3 w-3 ${i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-foreground/10 text-foreground/10'}`}
                />
            ))}
            <span className="ml-1 text-xs font-medium text-foreground/60">
                {rating.toFixed(1)}
            </span>
        </div>
    );
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};

export function Courses() {
    const { featuredCourses } = usePage<{ featuredCourses: Course[] }>().props;

    if (!featuredCourses?.length) return null;

    const featured = featuredCourses[0];
    const others = featuredCourses.slice(1, 5);

    return (
        <section className="relative py-24 md:py-32">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-0 h-[440px] w-[440px] -translate-y-1/2 rounded-full bg-foreground/[0.025] blur-[150px] dark:bg-foreground/[0.04]" />
                <div className="absolute top-1/4 right-0 h-[360px] w-[360px] rounded-full bg-primary/[0.02] blur-[140px] dark:bg-primary/[0.04]" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-14 flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left"
                >
                    <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/40 bg-secondary px-4 py-2 text-xs font-semibold tracking-[0.25em] text-secondary-foreground uppercase backdrop-blur dark:border-border/60 dark:bg-secondary">
                            Formations phares
                        </div>
                        <h2 className="mb-4 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                            Les formations les plus appréciées
                        </h2>
                        <p className="max-w-xl text-lg text-foreground/60">
                            YouTube, WordPress, Bande Dessinée, E-Commerce — découvrez
                            nos formations les mieux notées, animées par des
                            formateurs certifiés et passionnés.
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        className="shrink-0 rounded-full"
                        asChild
                    >
                        <Link href="/courses" preserveState prefetch>
                            Voir toutes les formations
                            <ArrowRight
                                className="ml-2 h-4 w-4"
                                aria-hidden="true"
                            />
                        </Link>
                    </Button>
                </motion.div>

                {/* Featured course */}
                <motion.article
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    className="mb-5 overflow-hidden rounded-3xl border border-border/40 bg-background/70 backdrop-blur-sm dark:border-border/50 dark:bg-background/50"
                >
                    <div className="grid lg:grid-cols-[1.5fr_1fr]">
                        {/* Image */}
                        <div className="group relative min-h-[300px] overflow-hidden lg:min-h-[420px] bg-[#030206] flex items-center justify-center">
                            <img
                                src={featured.image}
                                alt={featured.title}
                                className="absolute inset-0 h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/10 dark:to-background/20" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent lg:hidden" />

                            <div className="absolute top-5 left-5">
                                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-white uppercase backdrop-blur">
                                    {featured.category}
                                </span>
                            </div>
                            <div className="absolute top-5 right-5">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/20 px-3 py-1 text-[11px] font-semibold text-primary backdrop-blur">
                                    <Sparkles
                                        className="h-3 w-3"
                                        aria-hidden="true"
                                    />
                                    À la une
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col justify-between gap-6 p-7 md:p-10">
                            <div>
                                <div className="mb-4 flex flex-wrap items-center gap-2">
                                    <span className="flex items-center gap-1 text-xs text-foreground/40">
                                        <Clock className="h-3.5 w-3.5" />
                                        {featured.duration} min
                                    </span>
                                </div>

                                <h3 className="mb-3 text-2xl leading-tight font-semibold tracking-tight text-foreground md:text-3xl">
                                    {featured.title}
                                </h3>

                                <p className="mb-5 text-sm leading-relaxed text-foreground/60 md:text-base">
                                    {featured.description}
                                </p>

                                {featured.trainer && (
                                    <div className="mb-5 flex items-center gap-2.5">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                            {featured.trainer.initials}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {featured.trainer.name}
                                            </p>
                                            <p className="text-xs text-foreground/40">
                                                {featured.trainer.role
                                                    ?.split('·')[0]
                                                    .trim()}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-2 flex items-center gap-4 text-xs text-foreground/50">
                                    <StarRating rating={featured.rating} />
                                    <span className="flex items-center gap-1">
                                        <Users className="h-3.5 w-3.5" />
                                        {featured.studentCount.toLocaleString(
                                            'fr-FR',
                                        )}{' '}
                                        étudiants
                                    </span>
                                </div>
                            </div>

                            {/* Price + CTA */}
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs tracking-wider text-foreground/40 uppercase">
                                        À partir de
                                    </p>
                                    <p className="text-xl font-semibold text-foreground">
                                        {featured.price}
                                    </p>
                                </div>
                                <Button className="rounded-full" asChild>
                                    <Link href={`/courses/${featured.id}`}>
                                        Voir la formation
                                        <ArrowRight
                                            className="ml-2 h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.article>

                {/* 3 other courses */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ staggerChildren: 0.1 }}
                    className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {others.map((course) => (
                        <motion.article
                            key={course.id}
                            variants={itemVariants}
                            className="group overflow-hidden rounded-2xl border border-border/40 bg-background/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-border/60 hover:shadow-md dark:border-border/50 dark:bg-background/50"
                        >
                            <div className="relative aspect-video w-full overflow-hidden">
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                                <div className="absolute top-3 left-3">
                                    <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.15em] text-white/90 uppercase backdrop-blur">
                                        {course.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="mb-2 line-clamp-2 text-sm leading-snug font-semibold text-foreground">
                                    {course.title}
                                </h3>
                                <p className="mb-5 text-xs leading-relaxed text-foreground/60">
                                    {course.description}
                                </p>
                                <div className="mb-3">
                                    <StarRating rating={course.rating} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] tracking-wider text-foreground/40 uppercase">
                                            À partir de
                                        </p>
                                        <p className="text-sm font-semibold text-foreground">
                                            {course.price}
                                        </p>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="rounded-full text-xs"
                                        asChild
                                    >
                                        <Link href={`/courses/${course.id}`}>
                                            Voir
                                            <ArrowRight
                                                className="ml-1 h-3.5 w-3.5"
                                                aria-hidden="true"
                                            />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
