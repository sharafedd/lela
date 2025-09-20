import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Lela — Stories',
  description: 'A minimal, professional stories site powered by Supabase',
  icons: {
    icon: '/lela-logo.png', // browser tab icon
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900">
        <header className="border-b bg-white/80 backdrop-blur">
          <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/lela-logo.png"
                alt="Lela logo"
                width={32}
                height={32}
                className="rounded-md"
              />
              <span className="font-semibold tracking-tight text-lg">Lela</span>
            </Link>
            <nav className="text-sm text-neutral-500">
              <Link href="/" className="hover:text-neutral-900">Home</Link>
            </nav>
          </div>
        </header>
        <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
        <footer className="mt-16 border-t">
          <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-neutral-500 flex items-center justify-between">
            <span>© {new Date().getFullYear()} Lela</span>
            <Image
              src="/lela-logo.png"
              alt="Lela logo"
              width={20}
              height={20}
              className="opacity-70"
            />
          </div>
        </footer>
      </body>
    </html>
  );
}
