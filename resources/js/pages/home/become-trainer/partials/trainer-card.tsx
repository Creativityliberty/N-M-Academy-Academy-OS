import { motion } from 'framer-motion'
import { Star, Users, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export type TrainerProfile = {
    initials: string
    name: string
    specialty: string
    bio: string
    courseCount: number
    studentCount: string
    rating: number
}

export function TrainerCard({ trainer, index }: { trainer: TrainerProfile; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
        >
            <Card className="h-full border-border/40 bg-background/60 backdrop-blur-sm dark:border-border/50 dark:bg-background/50">
                <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
                            {trainer.initials}
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">{trainer.name}</p>
                            <p className="text-xs text-foreground/50">{trainer.specialty}</p>
                        </div>
                    </div>

                    <p className="mb-4 text-sm leading-relaxed text-foreground/60 line-clamp-3">{trainer.bio}</p>

                    <div className="flex items-center gap-4 text-xs text-foreground/50">
                        <span className="flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5 text-primary/60" />
                            {trainer.courseCount} cours
                        </span>
                        <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-primary/60" />
                            {trainer.studentCount} étudiants
                        </span>
                        <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {trainer.rating.toFixed(1)}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
