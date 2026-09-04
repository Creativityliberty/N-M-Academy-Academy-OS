import React from 'react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';
import { useScroll } from './use-scroll';
import { Link, router, usePage } from '@inertiajs/react';
import type { Auth, User } from '@/types';
import { Button, buttonVariants } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { MenuToggleIcon } from './menu-toggle-icon';
import Logo from './logo';
import { login, logout, register, blog, about, contact } from '@/routes';
import publicCourses from '@/actions/App/Http/Controllers/Public/Courses/CourseController';
import becomeTrainer from '@/actions/App/Http/Controllers/Public/BecomeTrainer/TrainerPlanController';
import admin from '@/routes/admin';
import trainer from '@/routes/trainer';
import student from '@/routes/student';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';

const simpleLinks = [
    { label: 'Nos Formations', href: publicCourses.index.url() },
    { label: 'Devenir Formateur', href: becomeTrainer.index.url() },
    { label: 'Blog', href: blog.url() },
    { label: 'À propos', href: about.url() },
    { label: 'Contact', href: contact.url() },
];

function initials(name: string): string {
    return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function dashboardHrefFor(user: User): string {
    if (user.is_admin) return admin.dashboard.url();
    if (user.is_trainer) return trainer.dashboard.url();
    return student.dashboard.url();
}

/* ------------------------------------------------------------------ */
/* Petit dropdown avatar (desktop)                                     */
/* ------------------------------------------------------------------ */

function UserMenu({ user }: { user: User }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground ring-offset-background transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    {initials(user.name)}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="font-normal">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => router.post(logout.url())}
                    className="cursor-pointer text-destructive focus:text-destructive"
                >
                    Se déconnecter
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/* ------------------------------------------------------------------ */
/* Header                                                             */
/* ------------------------------------------------------------------ */

export function Header() {
    const [open, setOpen] = React.useState(false);
    const scrolled = useScroll(10);
    const { auth, canRegister } = usePage<{
        auth: Auth;
        canRegister?: boolean;
    }>().props;

    const hasRole = auth.user?.is_admin || auth.user?.is_trainer || auth.user?.is_student;

    React.useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    return (
        <header className="sticky top-0 z-50 w-full px-4 pt-4 lg:px-8">
            <div
                className={cn(
                    'mx-auto max-w-7xl rounded-full border transition-all duration-300 px-2 md:px-4',
                    {
                        'border-border bg-background/85 backdrop-blur-md shadow-lg shadow-primary/[0.02] dark:bg-background/40':
                            scrolled,
                        'border-border/20 bg-background/40 backdrop-blur-sm': !scrolled,
                    },
                )}
            >
                <nav className="flex h-12 w-full items-center justify-between px-2 lg:px-4">
                    {/* logo — gauche écran */}
                    <div className="flex items-center justify-start shrink-0 lg:w-[200px]">
                        <div className="rounded-md p-1.5 hover:bg-transparent">
                            <Link href="/">
                                <Logo className="h-6 w-auto" />
                            </Link>
                        </div>
                    </div>

                    {/* liens — centre flex */}
                    <div className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 flex-1">
                        {simpleLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="inline-flex h-9 items-center justify-center px-3 text-xs xl:text-sm font-medium text-foreground/70 transition-colors hover:text-foreground rounded-full hover:bg-muted/40"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* CTA — droite écran */}
                    <div className="hidden lg:flex items-center justify-end gap-2 shrink-0 lg:w-[250px]">
                        {auth.user ? (
                            hasRole ? (
                                <Button
                                    variant="secondary"
                                    className="shrink-0 rounded-full h-8 px-4 text-xs font-medium"
                                    asChild
                                >
                                    <Link href={dashboardHrefFor(auth.user)}>Dashboard</Link>
                                </Button>
                            ) : (
                                <UserMenu user={auth.user} />
                            )
                        ) : (
                            <>
                                <Button
                                    variant="secondary"
                                    className="shrink-0 rounded-full h-8 px-4 text-xs font-medium"
                                    asChild
                                >
                                    <Link href={login()}>Connexion</Link>
                                </Button>
                                {canRegister !== false && (
                                    <Button
                                        className="shrink-0 rounded-full h-8 px-4 text-xs font-medium"
                                        asChild
                                    >
                                        <Link href={register()}>S'inscrire</Link>
                                    </Button>
                                )}
                            </>
                        )}
                        <ThemeToggle />
                    </div>

                    {/* burger mobile */}
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setOpen(!open)}
                        className="ml-auto lg:hidden h-8 w-8 rounded-full"
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        aria-label="Toggle menu"
                    >
                        <MenuToggleIcon
                            open={open}
                            className="size-4"
                            duration={300}
                        />
                    </Button>
                </nav>

                <MobileMenu open={open} auth={auth} canRegister={canRegister} />
            </div>
        </header>
    );
}

/* ------------------------------------------------------------------ */
/* Menu mobile                                                        */
/* ------------------------------------------------------------------ */

function MobileMenu({
    open,
    auth,
    canRegister,
}: {
    open: boolean;
    auth: Auth;
    canRegister?: boolean;
}) {
    const hasRole = auth.user?.is_admin || auth.user?.is_trainer || auth.user?.is_student;

    if (!open || typeof window === 'undefined') return null;

    return createPortal(
        <div
            id="mobile-menu"
            className="fixed top-[80px] right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y border-border/30 bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/50 lg:hidden"
        >
            <div
                data-slot={open ? 'open' : 'closed'}
                className="flex size-full flex-col justify-between overflow-y-auto p-4 ease-out data-[slot=open]:animate-in data-[slot=open]:zoom-in-97"
            >
                <div className="flex flex-col gap-1">
                    {simpleLinks.map((link) => (
                        <a
                            key={link.label}
                            className={buttonVariants({
                                variant: 'ghost',
                                className: 'justify-start',
                            })}
                            href={link.href}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="flex flex-col gap-3 border-t border-border/30 pt-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-medium text-foreground/40">
                            Apparence
                        </span>
                        <ThemeToggle />
                    </div>

                    {auth.user ? (
                        hasRole ? (
                            <Button variant="secondary" className="w-full" asChild>
                                <Link href={dashboardHrefFor(auth.user)}>Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 rounded-md border border-border/40 px-3 py-2">
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                                        {initials(auth.user.name)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium">{auth.user.name}</p>
                                        <p className="truncate text-xs text-muted-foreground">{auth.user.email}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full text-destructive hover:text-destructive"
                                    onClick={() => router.post(logout.url())}
                                >
                                    Se déconnecter
                                </Button>
                            </>
                        )
                    ) : (
                        <>
                            <Button
                                variant="secondary"
                                className="w-full"
                                asChild
                            >
                                <Link href={login()}>Connexion</Link>
                            </Button>
                            {canRegister !== false && (
                                <Button className="w-full" asChild>
                                    <Link href={register()}>S'inscrire</Link>
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body,
    );
}
