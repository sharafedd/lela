import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Lela — Stories',
  description: 'Stories, beautifully told.',
  icons: { icon: '/lela-logo.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Purple accent bar */}
        <div className="header-accent w-full" />

        <header className="sticky top-0 z-40 border-b border-[color-mix(in_srgb,var(--brand-700) 35%,var(--border))] bg-[color-mix(in_srgb,var(--surface) 75%,var(--brand-700) 25%)] backdrop-blur">
          <div className="shell py-3 flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3">
              {/* Square logo box (always centered) */}
              <div
                className="relative h-14 w-14 rounded-2xl ring-1"
                style={{ boxShadow: '0 0 0 1px color-mix(in srgb, var(--brand) 40%, transparent)' }}
              >
                <Image
                  src="/lela-logo.png"
                  alt="Lela"
                  fill
                  sizes="56px"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Wordmark (no extra vertical space) */}
              <span
                className="text-3xl lg:text-4xl font-semibold leading-none tracking-tight"
                style={{ color: 'var(--brand)' }}
              >
                Lela
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-[var(--muted)]">
              <Link href="/" className="relative hover:text-white">
                Home
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[var(--brand-500)] opacity-0 group-hover:opacity-100 transition" />
              </Link>
              <Link href="/admin" className="relative hover:text-white">
                Admin
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[var(--brand-500)] opacity-0 group-hover:opacity-100 transition" />
              </Link>
            </nav>
          </div>
        </header>

        <main className="shell py-8">{children}</main>

        <footer className="mt-16 border-t border-[color-mix(in_srgb,var(--brand-700) 25%,var(--border))]">
          <div className="shell py-8 text-sm text-[var(--muted)] flex items-center justify-between">
            <span>© {new Date().getFullYear()} Lela</span>
            <Image src="/lela-logo.png" alt="Lela" width={32} height={32} className="opacity-80" />
          </div>
        </footer>
      </body>
    </html>
  );
}
