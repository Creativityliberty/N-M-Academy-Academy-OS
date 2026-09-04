import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

export function Cta() {
    return (
        <section className="relative overflow-hidden py-24 md:py-32 bg-background">
            <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
                <div className="relative isolate overflow-hidden bg-brand-secondary rounded-[40px] px-6 py-20 text-center shadow-2xl sm:px-16 md:py-28">
                    {/* Background decorations */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 blur-[120px]" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary/10 blur-[120px]" />
                    </div>

                    <div className="mx-auto max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
                            Prêt à booster ta <span className="text-brand-primary underline decoration-brand-primary underline-offset-8">carrière</span> ?
                        </h2>
                        
                        <p className="mx-auto mt-6 text-lg leading-relaxed text-gray-300">
                            Rejoins des milliers d'étudiants et commence ton apprentissage dès aujourd'hui. Développe des compétences demandées sur le marché.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button size="lg" className="w-full sm:w-auto rounded-full bg-primary text-primary-foreground hover:bg-brand-primary-hover" asChild>
                                <Link href="/register">
                                    Créer mon compte gratuitement
                                </Link>
                            </Button>
                            <Button variant="ghost" size="lg" className="w-full sm:w-auto text-white hover:bg-white/10 rounded-full group gap-2" asChild>
                                <Link href="/courses">
                                    Explorer le catalogue
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
