import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, PlayCircle, ArrowRight, BookOpen, Copy, Check, MessageCircle, Facebook } from 'lucide-react'
import { Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { allCourses } from './courses-data'

type Props = { courseId: number }

type CheckoutData = {
    firstName: string
    lastName: string
    email: string
    price: string
}

function ShareButtons({ title }: { title: string }) {
    const [copied, setCopied] = useState(false)
    const url = typeof window !== 'undefined' ? window.location.origin + '/courses' : ''

    const copyLink = async () => {
        await navigator.clipboard.writeText(url).catch(() => {})
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
            <a
                href={`https://wa.me/?text=${encodeURIComponent('Je viens de rejoindre la formation : ' + title + ' — ' + url)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-4 py-2 text-xs font-medium text-foreground/70 transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-600 dark:border-border/50"
            >
                <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-4 py-2 text-xs font-medium text-foreground/70 transition-colors hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-600 dark:border-border/50"
            >
                <Facebook className="h-4 w-4" /> Facebook
            </a>
            <button
                type="button" onClick={copyLink}
                className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-4 py-2 text-xs font-medium text-foreground/70 transition-colors hover:border-border/70 hover:text-foreground dark:border-border/50"
            >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copié !' : 'Copier le lien'}
            </button>
        </div>
    )
}

export default function CourseConfirmationPage({ courseId }: Props) {
    const course = allCourses.find((c) => c.id === courseId)
    const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)

    useEffect(() => {
        const stored = sessionStorage.getItem(`checkout_${courseId}`)
        if (stored) {
            try { setCheckoutData(JSON.parse(stored)) } catch { /* fallback */ }
        }
    }, [courseId])

    const data: CheckoutData = checkoutData ?? {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@email.com',
        price: course?.price ?? '',
    }

    if (!course) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
                <p className="text-lg font-medium text-foreground/60">Formation introuvable</p>
                <Button asChild variant="outline" className="rounded-full">
                    <Link href="/courses">Retour aux formations</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen pb-20">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/[0.04] blur-[160px] dark:bg-emerald-500/[0.07]" />
                <div className="absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-primary/[0.03] blur-[140px] dark:bg-primary/[0.05]" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-8 lg:px-12">

                {/* Success header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-14 text-center">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
                        className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border-4 border-emerald-500/20 bg-emerald-500/10"
                    >
                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                    </motion.div>
                    <h1 className="mb-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                        Accès confirmé !
                    </h1>
                    <p className="mx-auto max-w-md text-foreground/60">
                        Bienvenue dans la formation,{' '}
                        <span className="font-medium text-foreground">{data.firstName}</span> ! Votre accès a été envoyé à{' '}
                        <span className="font-medium text-foreground">{data.email}</span>.
                    </p>
                </motion.div>

                <div className="flex flex-col items-start gap-10 lg:flex-row">

                    {/* Access card */}
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="w-full lg:max-w-md">
                        <div className="overflow-hidden rounded-3xl border border-border/40 bg-background shadow-2xl shadow-black/10 dark:border-border/50 dark:shadow-black/30">
                            <div className="relative h-52 overflow-hidden">
                                <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                                <div className="absolute top-4 left-4">
                                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                                        {course.category}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <span className="rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 text-[11px] font-semibold text-emerald-300 backdrop-blur">
                                        {data.price}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-base font-semibold leading-snug text-white md:text-lg">{course.title}</h3>
                                </div>
                            </div>

                            <div className="px-6 py-5">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-foreground/40">Titulaire</p>
                                        <p className="mt-1 font-semibold text-foreground">{data.firstName} {data.lastName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-foreground/40">Prix</p>
                                        <p className="mt-1 font-semibold text-foreground">{data.price}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-foreground/40">Durée</p>
                                        <p className="mt-1 flex items-center gap-1.5 font-medium text-foreground">
                                            <BookOpen className="h-3.5 w-3.5 text-primary/60" />{course.duration}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-foreground/40">Formateur</p>
                                        <p className="mt-1 font-medium text-foreground">{course.trainer?.name ?? '—'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative mx-0 border-t-2 border-dashed border-border/40">
                                <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background ring-2 ring-border/30" />
                                <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background ring-2 ring-border/30" />
                            </div>

                            <div className="flex items-center justify-between gap-4 px-6 py-5">
                                <div>
                                    <p className="mb-1 text-xs uppercase tracking-widest text-foreground/40">Accès</p>
                                    <p className="font-mono text-sm font-bold tracking-widest text-foreground">
                                        PMND-{String(courseId).padStart(3, '0')}-{String(Date.now()).slice(-6)}
                                    </p>
                                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-500">
                                        <CheckCircle2 className="h-3.5 w-3.5" />Accès illimité à vie
                                    </p>
                                </div>
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                                    <PlayCircle className="h-8 w-8 text-primary" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Actions */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex w-full flex-1 flex-col gap-6">
                        <div>
                            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-foreground/40">Commencer maintenant</p>
                            <div className="flex flex-col gap-3">
                                <Button size="lg" className="w-full justify-start gap-3 rounded-full" asChild>
                                    <Link href={`/dashboard/courses/${courseId}`}>
                                        <PlayCircle className="h-5 w-5" />
                                        Accéder à ma formation
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="w-full justify-start gap-3 rounded-full border-border/40 bg-background/60 backdrop-blur-sm dark:border-border/50" asChild>
                                    <Link href="/courses">
                                        <BookOpen className="h-5 w-5" />
                                        Explorer d'autres formations
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border/40 bg-background/60 p-5 backdrop-blur-sm dark:border-border/50 dark:bg-background/50">
                            <p className="mb-3 text-sm font-semibold text-foreground">Pour bien démarrer</p>
                            <ul className="space-y-2 text-sm text-foreground/60">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                                    Un email de confirmation et d'accès vous a été envoyé
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                                    Pratiquez régulièrement, même 10 minutes par jour font la différence
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                                    Rejoignez la communauté pour partager votre progression
                                </li>
                            </ul>
                        </div>

                        <div>
                            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-foreground/40">Partager avec vos proches</p>
                            <ShareButtons title={course.title} />
                        </div>

                        <div className="pt-2">
                            <Button variant="ghost" className="gap-2 rounded-full text-foreground/60 hover:text-foreground" asChild>
                                <Link href="/courses">
                                    Voir toutes les formations
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
