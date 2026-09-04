import { Head } from '@inertiajs/react';
import { PageRenderer } from '@/components/page-builder/page-renderer';

type Props = {
    page: {
        title: string;
        metaTitle?: string | null;
        metaDescription?: string | null;
    };
    sections: any[];
    preview: boolean;
};
export default function AcademyPageShow({ page, sections, preview }: Props) {
    return (
        <>
            <Head title={page.metaTitle || page.title}>
                {page.metaDescription && (
                    <meta name="description" content={page.metaDescription} />
                )}
            </Head>
            {preview && (
                <div className="sticky top-0 z-50 border-b bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-900">
                    Aperçu brouillon — cette version n’est pas publique.
                </div>
            )}
            <PageRenderer sections={sections} />
        </>
    );
}
