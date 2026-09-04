import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '@/types/navigation';

export type AcademyTheme = {
    preset: string;
    primary: string;
    primaryHover: string;
    primarySoft: string;
    primarySurface: string;
    secondary: string;
    accent: string;
    radius: string;
    density: string;
};

export type AcademyFeatures = {
    community: boolean;
    events: boolean;
    ai: boolean;
    tutor: boolean;
    sales: boolean;
    pages: boolean;
    mcp: boolean;
    tower: boolean;
};

export type AcademyBrand = {
    name: string;
    version: string;
    shortName: string;
    descriptor: string;
    logoUrl: string | null;
    features: AcademyFeatures;
    factoryEnabled: boolean;
    theme: AcademyTheme;
};

export type AppLayoutProps = {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
};

export type AppVariant = 'header' | 'sidebar';

export type FlashToast = {
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
};

export type AuthLayoutProps = {
    children?: ReactNode;
    name?: string;
    title?: string;
    description?: string;
};
