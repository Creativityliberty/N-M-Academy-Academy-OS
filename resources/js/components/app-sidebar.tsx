import { Link, usePage } from '@inertiajs/react';
import {
    Award,
    BarChart3,
    BrainCircuit,
    CalendarDays,
    CreditCard,
    FolderGit2,
    GraduationCap,
    LayoutGrid,
    MessagesSquare,
    PanelsTopLeft,
    Settings,
    Sparkles,
    Users,
    WalletCards,
    Factory,
    TowerControl,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import admin from '@/routes/admin';
import trainer from '@/routes/trainer';
import student from '@/routes/student';
import adminCourses from '@/actions/App/Http/Controllers/Admin/Courses/CourseController';
import adminPlans from '@/actions/App/Http/Controllers/Admin/Plans/PlanController';
import trainerCourses from '@/actions/App/Http/Controllers/Trainer/Courses/CourseController';
import studentCourses from '@/actions/App/Http/Controllers/Student/Courses/CourseController';

export function AppSidebar() {
    const props = usePage().props as any;
    const user = props.auth?.user;
    const features = props.academy?.features ?? {};
    const factoryEnabled = props.academy?.factoryEnabled ?? false;

    const dashboardHref = user?.is_admin
        ? admin.dashboard()
        : user?.is_trainer
          ? trainer.dashboard()
          : student.dashboard();

    const workspaceLabel = user?.is_admin
        ? 'Administration'
        : user?.is_trainer
          ? 'Studio formateur'
          : 'Mon apprentissage';

    const mainNavItems: NavItem[] = [
        {
            title:
                user?.is_student && !user?.is_admin && !user?.is_trainer
                    ? 'Accueil'
                    : 'Dashboard',
            href: dashboardHref,
            icon: LayoutGrid,
        },
        ...(features.tower && (user?.is_admin || user?.is_trainer)
            ? [
                  {
                      title: 'Mission Tower',
                      href: '/tower',
                      icon: TowerControl,
                  },
              ]
            : []),
        ...(features.community
            ? [
                  {
                      title: 'Communauté',
                      href: '/communaute/forum',
                      icon: MessagesSquare,
                  },
              ]
            : []),
        ...(features.events
            ? [
                  {
                      title: 'Événements',
                      href: '/communaute/evenements',
                      icon: CalendarDays,
                  },
              ]
            : []),
        ...(user?.is_admin
            ? [
                  {
                      title: 'Gestion des cours',
                      href: adminCourses.index(),
                      icon: FolderGit2,
                  },
                  {
                      title: 'Plans formateurs',
                      href: adminPlans.index(),
                      icon: CreditCard,
                  },
                  ...(features.ai
                      ? [
                            {
                                title: 'Academy AI',
                                href: '/trainer/academy-ai',
                                icon: Sparkles,
                            },
                        ]
                      : []),
                  ...(features.tutor
                      ? [
                            {
                                title: 'AI Tutor',
                                href: '/trainer/ai-tutor',
                                icon: BrainCircuit,
                            },
                        ]
                      : []),
                  ...(factoryEnabled
                      ? [
                            {
                                title: 'Academy Factory',
                                href: '/admin/factory',
                                icon: Factory,
                            },
                        ]
                      : []),
              ]
            : []),
        ...(user?.is_trainer
            ? [
                  ...(features.pages
                      ? [
                            {
                                title: 'Pages',
                                href: '/trainer/pages',
                                icon: PanelsTopLeft,
                            },
                        ]
                      : []),
                  ...(features.ai
                      ? [
                            {
                                title: 'Academy AI',
                                href: '/trainer/academy-ai',
                                icon: Sparkles,
                            },
                        ]
                      : []),
                  ...(features.tutor
                      ? [
                            {
                                title: 'AI Tutor',
                                href: '/trainer/ai-tutor',
                                icon: BrainCircuit,
                            },
                        ]
                      : []),
                  {
                      title: 'Formations',
                      href: trainerCourses.index(),
                      icon: FolderGit2,
                  },
                  {
                      title: 'Étudiants',
                      href: trainer.students.index(),
                      icon: Users,
                  },
                  ...(features.sales
                      ? [
                            {
                                title: 'Ventes',
                                href: trainer.sales.index(),
                                icon: WalletCards,
                            },
                        ]
                      : []),
                  {
                      title: 'Analytics',
                      href: trainer.analytics.index(),
                      icon: BarChart3,
                  },
                  {
                      title: 'Réglages',
                      href: trainer.stripeConnect.edit(),
                      icon: Settings,
                  },
              ]
            : []),
        ...(user?.is_student && !user?.is_admin && !user?.is_trainer
            ? [
                  {
                      title: 'Mes formations',
                      href: studentCourses.index(),
                      icon: GraduationCap,
                  },
                  ...(features.certificates
                      ? [
                            {
                                title: 'Mes certificats',
                                href: '/student/certificates',
                                icon: Award,
                            },
                        ]
                      : []),
                  ...(features.sales
                      ? [
                            {
                                title: 'Abonnements',
                                href: '/student/memberships',
                                icon: CreditCard,
                            },
                        ]
                      : []),
              ]
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="px-3 pt-3 pb-1">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="h-13 rounded-xl px-2.5 hover:bg-sidebar-accent/60 data-[state=open]:bg-sidebar-accent"
                        >
                            <Link href={dashboardHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-1 pt-3">
                <NavMain items={mainNavItems} label={workspaceLabel} />
            </SidebarContent>

            <SidebarFooter className="px-3 pb-3">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
