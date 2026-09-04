import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Clock, ArrowRight, Check, User, Mail, Phone, Globe, Building2 } from 'lucide-react'
import { Link, router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { allCourses } from './courses-data'
import { cn } from '@/lib/utils'

type Props = { courseId: number }

type FormData = {
    firstName: string
    lastName: string
    email: string
    phone: string
    country: string
    city: string
}

function Steps({ current }: { current: 1 | 2 }) {
    const steps = ['Informations', 'Confirmation']
    return (
        <div className="flex items-center gap-2">
            {steps.map((label, i) => {
                const step = i + 1
                const done = step < current
                const active = step === current
                return (
                    <div key={label} className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <span className={cn('flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold', done || active ? 'bg-primary text-primary-foreground' : 'bg-foreground/10 text-foreground/40')}>
                                {done ? <Check className="h-3.5 w-3.5" /> : step}
                            </span>
                            <span className={cn('hidden text-xs font-medium sm:inline', active ? 'text-foreground' : 'text-foreground/40')}>
                                {label}
                            </span>
                        </div>
                        {i < steps.length - 1 && <div className="h-px w-6 bg-border/40 sm:w-10" />}
                    </div>
                )
            })}
        </div>
    )
}

function Field({
    label, icon: Icon, id, type = 'text', placeholder, value, onChange, required, error,
}: {
    label: string; icon?: React.ElementType; id: string; type?: string
    placeholder?: string; value: string; onChange: (v: string) => void; required?: boolean; error?: string
}) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id} className="text-sm font-medium text-foreground/80">
                {label}{required && <span className="ml-1 text-primary">*</span>}
            </Label>
            <div className="relative">
                {Icon && <Icon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-foreground/35" />}
                <Input
                    id={id} type={type} placeholder={placeholder} value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={cn('border-border/40 bg-background/60 backdrop-blur-sm placeholder:text-foreground/30 focus-visible:border-primary/40 dark:border-border/50 dark:bg-background/50', Icon && 'pl-9', error && 'border-rose-500/60')}
                />
            </div>
            {error && <p className="text-xs text-rose-500">{error}</p>}
        </div>
    )
}

export default function CheckoutPage({ courseId }: Props) {
    const course = allCourses.find((c) => c.id === courseId)
    const [form, setForm] = useState<FormData>({ firstName: '', lastName: '', email: '', phone: '', country: '', city: '' })
    const [cgv, setCgv] = useState(false)
    const [errors, setErrors] = useState<Partial<FormData>>({})
    const [submitted, setSubmitted] = useState(false)

    if (!course) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
                <p className="text-lg font-medium text-foreground/60">Formation introuvable</p>
                <Button asChild variant="outline" className="rounded-full">
                    <Link href="/courses"><ChevronLeft className="mr-1 h-4 w-4" />Retour aux formations</Link>
                </Button>
            </div>
        )
    }

    const set = (key: keyof FormData) => (v: string) => setForm((prev) => ({ ...prev, [key]: v }))

    const validate = () => {
        const e: Partial<FormData> = {}
        if (!form.firstName.trim()) e.firstName = 'Prénom requis'
        if (!form.lastName.trim()) e.lastName = 'Nom requis'
        if (!form.email.trim()) e.email = 'Email requis'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide'
        if (!form.phone.trim()) e.phone = 'Téléphone requis'
        if (!form.country.trim()) e.country = 'Pays requis'
        if (!form.city.trim()) e.city = 'Ville requise'
        return e
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }
        if (!cgv) { setSubmitted(true); return }
        sessionStorage.setItem(`checkout_${courseId}`, JSON.stringify({ ...form, price: course.price, courseId }))
        router.visit(`/courses/${courseId}/confirmation`)
    }

    return (
        <div className="relative min-h-screen">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-primary/[0.03] blur-[160px] dark:bg-primary/[0.06]" />
            </div>

            {/* Mini hero */}
            <div className="relative overflow-hidden border-b border-border/40">
                <div className="absolute inset-0">
                    <img src={course.image} alt="" className="h-full w-full object-cover" aria-hidden="true" />
                    <div className="absolute inset-0 bg-background/92 backdrop-blur-md dark:bg-background/95" />
                </div>
                <div className="relative mx-auto max-w-7xl px-6 py-8 md:px-8 lg:px-12">
                    <div className="mb-6 flex items-center justify-between">
                        <Link href={`/courses/${courseId}`} className="inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground">
                            <ChevronLeft className="h-4 w-4" />Retour à la formation
                        </Link>
                        <Steps current={1} />
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                            <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-foreground/40">{course.category}</p>
                            <h1 className="text-lg font-semibold text-foreground md:text-xl">{course.title}</h1>
                            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground/50">
                                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}</span>
                                {course.trainer && <span>{course.trainer.name}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="relative mx-auto max-w-7xl px-6 py-12 md:px-8 lg:px-12">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="min-w-0 flex-1 space-y-8">
                            <Card className="border-border/40 bg-background/60 backdrop-blur-sm dark:border-border/50 dark:bg-background/50">
                                <CardContent className="p-6">
                                    <div className="mb-6">
                                        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-foreground/40">Vos informations</p>
                                        <h2 className="text-lg font-semibold text-foreground">Informations personnelles</h2>
                                    </div>
                                    <div className="space-y-5">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <Field label="Prénom" icon={User} id="firstName" placeholder="Jean" value={form.firstName} onChange={set('firstName')} required error={errors.firstName} />
                                            <Field label="Nom" id="lastName" placeholder="Dupont" value={form.lastName} onChange={set('lastName')} required error={errors.lastName} />
                                        </div>
                                        <Field label="Adresse email" icon={Mail} id="email" type="email" placeholder="jean.dupont@email.com" value={form.email} onChange={set('email')} required error={errors.email} />
                                        <Field label="Téléphone" icon={Phone} id="phone" type="tel" placeholder="+33 6 00 00 00 00" value={form.phone} onChange={set('phone')} required error={errors.phone} />
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <Field label="Pays" icon={Globe} id="country" placeholder="France" value={form.country} onChange={set('country')} required error={errors.country} />
                                            <Field label="Ville" icon={Building2} id="city" placeholder="Paris" value={form.city} onChange={set('city')} required error={errors.city} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/40 bg-background/60 backdrop-blur-sm dark:border-border/50 dark:bg-background/50">
                                <CardContent className="p-6">
                                    <label className="flex cursor-pointer items-start gap-3">
                                        <span
                                            onClick={() => setCgv(!cgv)}
                                            className={cn('mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors', cgv ? 'border-primary bg-primary' : submitted && !cgv ? 'border-rose-500 bg-background' : 'border-border/60 bg-background')}
                                            role="checkbox" aria-checked={cgv} tabIndex={0} onKeyDown={(e) => e.key === ' ' && setCgv(!cgv)}
                                        >
                                            {cgv && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                                        </span>
                                        <span className="text-sm leading-relaxed text-foreground/70">
                                            J'accepte les{' '}
                                            <a href="#" className="underline underline-offset-2 hover:text-foreground">conditions générales de vente</a>{' '}
                                            et la{' '}
                                            <a href="#" className="underline underline-offset-2 hover:text-foreground">politique de confidentialité</a>.
                                        </span>
                                    </label>
                                    {submitted && !cgv && (
                                        <p className="mt-2 pl-7 text-xs text-rose-500">Vous devez accepter les conditions pour continuer</p>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Summary sidebar */}
                        <div className="hidden shrink-0 lg:block lg:w-80 xl:w-96">
                            <div className="sticky top-20">
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                                    <Card className="overflow-hidden border-border/40 bg-background/70 backdrop-blur-md dark:border-border/50 dark:bg-background/60">
                                        <div className="relative h-40 overflow-hidden">
                                            <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                            <div className="absolute bottom-3 left-4 right-4">
                                                <p className="text-xs font-medium text-white/70">{course.category}</p>
                                                <p className="line-clamp-2 text-sm font-semibold text-white">{course.title}</p>
                                            </div>
                                        </div>
                                        <CardContent className="p-6">
                                            <div className="mb-5 space-y-2 text-sm text-foreground/60">
                                                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary/60" />{course.duration}</div>
                                                {course.trainer && <div className="text-xs">{course.trainer.name}</div>}
                                            </div>
                                            <div className="mb-5 border-t border-dashed border-border/40" />
                                            <div className="mb-6 flex items-center justify-between">
                                                <span className="text-sm font-semibold text-foreground">Total</span>
                                                <span className="text-lg font-bold text-foreground">{course.price}</span>
                                            </div>
                                            <Button type="submit" size="lg" className="w-full gap-2 rounded-full">
                                                Confirmer l'accès<ArrowRight className="h-4 w-4" />
                                            </Button>
                                            <p className="mt-3 text-center text-xs text-foreground/40">Accès immédiat après confirmation</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile CTA */}
                    <div className="sticky bottom-0 z-30 mt-8 border-t border-border/40 bg-background/95 p-4 backdrop-blur-md lg:hidden">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs text-foreground/50">Total</p>
                                <p className="font-semibold text-foreground">{course.price}</p>
                            </div>
                            <Button type="submit" size="lg" className="gap-2 rounded-full px-8">
                                Confirmer<ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
