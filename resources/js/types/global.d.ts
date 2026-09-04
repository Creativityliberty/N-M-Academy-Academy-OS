import type { Auth } from '@/types/auth';
import type { AcademyBrand } from '@/types/ui';

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            academy: AcademyBrand;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
