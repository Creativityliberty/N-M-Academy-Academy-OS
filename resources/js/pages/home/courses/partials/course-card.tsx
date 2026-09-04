import { motion } from 'framer-motion'
import { Star, Clock, Users, ArrowRight } from 'lucide-react'
import type { Course } from '../types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@inertiajs/react'

export type { Course }


function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    className={`h-3 w-3 ${i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-foreground/10 text-foreground/10'}`}
                />
            ))}
            <span className="ml-1 text-xs font-medium text-foreground/60">{rating.toFixed(1)}</span>
        </div>
    )
}

export function CourseCard({ course, index }: { course: Course; index: number }) {
    const minPrice = course.price

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.06 }}
        >
            <Card className="group flex h-full flex-col overflow-hidden border-border/40 bg-background/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-border/60 hover:shadow-lg dark:border-border/50 dark:bg-background/50">
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={course.image}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20">
                            {course.category}
                        </Badge>
                    </div>

                    {course.trainer && (
                        <div className="absolute bottom-3 left-4 flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/80 text-[10px] font-bold text-primary-foreground">
                                {course.trainer.initials}
                            </div>
                            <span className="text-xs font-medium text-white/80">{course.trainer.name}</span>
                        </div>
                    )}
                </div>

                <CardContent className="flex flex-1 flex-col p-5">
                    <h3 className="mb-2 text-base leading-snug font-semibold text-foreground">
                        {course.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-foreground/60">
                        {course.description}
                    </p>

                    <div className="mb-4 space-y-2">
                        <StarRating rating={course.rating} />
                        <div className="flex items-center gap-4 text-xs text-foreground/50">
                            <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                                {course.duration}
                            </span>
                            <span className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" aria-hidden="true" />
                                {course.studentCount.toLocaleString('fr-FR')} étudiants
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        {minPrice ? (
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-foreground/40">À partir de</p>
                                <p className="text-sm font-semibold text-foreground">{minPrice}</p>
                            </div>
                        ) : (
                            <span className="text-sm text-foreground/40">Gratuit</span>
                        )}
                        <Button variant="secondary" size="sm" asChild>
                            <Link href={`/courses/${course.id}`}>
                                Voir le cours
                                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
