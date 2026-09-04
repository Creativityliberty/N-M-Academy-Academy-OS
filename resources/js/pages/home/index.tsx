import { Head } from '@inertiajs/react';
import { Hero } from './partials/hero';
import { Process } from './partials/process';
import { Services } from './partials/services';
import { Courses } from './partials/courses';
import { Chiffres } from './partials/chiffres';
import Testimonials from './partials/testimonials';
import FAQ from './partials/faq';
import { Cta } from './partials/cta';
import { Trainers } from './partials/trainers';

export default function Home() {
    return (
        <>
            <Head title="Home" />
            <Hero />
            <Services />
            <Process />
            <Courses />
            <Trainers />
            <Chiffres />
            <Testimonials />
            <FAQ />
            <Cta />
        </>
    );
}
