import { Footer } from '@/pages/home/partials/footer';
import { Header } from '@/pages/home/partials/header';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-svh flex-col bg-bg-page text-foreground">
            <Header />

            <main className="flex-1">{children}</main>

            <Footer />
        </div>
    );
}
