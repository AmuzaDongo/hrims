import { Link } from '@inertiajs/react';
import { LayoutDashboard, Users, Building2, Package, Calendar, Wallet, Flag, ScrollText, Library, School, Train, Paperclip } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
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
import { dashboard } from '@/routes';
import activities from '@/routes/activities';
import assessmentCategories from '@/routes/assessment-categories';
import departments from '@/routes/departments';
import markingCenters from '@/routes/marking-centers';
import papers from '@/routes/papers';
import scripts from '@/routes/scripts';
import type { NavItem } from '@/types';
import employees from '@/wayfinder/routes/employees';
import positions from '@/wayfinder/routes/positions';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'Employees',
        href: employees.index(),
        icon: Users,
    },
    {
        title: 'Activities',
        href: activities.index(),
        icon: Calendar,
    },
    {
        title: 'Departments',
        href: departments.index(),
        icon: Package,
    },
    {
        title: 'Positions',
        href: positions.index(),
        icon: Building2,
    },
    {
        title: 'Assessment Categories',
        href: assessmentCategories.index(),
        icon: Train,
    },
    {
        title: 'Reports',
        href: positions.index(),
        icon: Flag,
    },
    {
        title: 'Marking Centers',
        href: markingCenters.index(),
        icon: Paperclip,
    },
    {
        title: 'Papers',
        href: papers.index(),
        icon: Paperclip,
    },
    {
        title: 'Scripts',
        href: scripts.index(),
        icon: ScrollText,
    },
    {
        title: 'Libraries',
        href: positions.index(),
        icon: Library,
    },
    {
        title: 'Checking Rooms',
        href: positions.index(),
        icon: School,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Messages',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Wallet,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
