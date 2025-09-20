import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Lela — Stories',
  description: 'A minimal, professional stories site powered by Supabase',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900">
        <header className="border-b">
          <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight">Lela</Link>
            <nav className="text-sm text-neutral-500">
              <Link href="/" className="hover:text-neutral-900">Home</Link>
            </nav>
          </div>
        </header>
        <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
        <footer className="mt-16 border-t">
          <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-neutral-500">
            © {new Date().getFullYear()} Lela
          </div>
        </footer>
      </body>
    </html>
  );
}
