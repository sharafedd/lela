import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import SiteFooter from '@/components/SiteFooter';
import MobileMenu from '@/components/MobileMenu';

export const metadata: Metadata = {
  title: 'Lela — Stories',
  description: 'Stories, beautifully told.',
  icons: { icon: '/lela-logo.png' },
};

/* --- inline icons (server-safe) --- */
function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M5.3 7.7a1 1 0 0 1 1.4 0L10 11l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z"/>
    </svg>
  );
}
function Bookmark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M6 2h12a1 1 0 0 1 1 1v18l-7-4-7 4V3a1 1 0 0 1 1-1z" />
    </svg>
  );
}
function PlusSquare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm6 4v4H7v2h4v4h2v-4h4v-2h-4V7h-2z"/>
    </svg>
  );
}
function Envelope(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2v.5l8 5 8-5V8l-8 5-8-5z"/>
    </svg>
  );
}
function Bell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm7-6V11a7 7 0 1 0-14 0v5L3 18v1h18v-1l-2-2z"/>
    </svg>
  );
}
function Crown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M5 17h14l-1 3H6l-1-3Zm0-9 4 4 3-6 3 6 4-4v8H5V8Z" />
    </svg>
  );
}
function Menu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
    </svg>
  );
}
function Close(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M6.7 6.7 12 12l5.3-5.3 1.4 1.4L13.4 13.4l5.3 5.3-1.4 1.4L12 14.8l-5.3 5.3-1.4-1.4 5.3-5.3-5.3-5.3 1.4-1.4z"/>
    </svg>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body id="top" suppressHydrationWarning>
        {/* Purple accent bar */}
        <div className="header-accent w-full" />

        <header className="sticky top-0 z-40 border-b border-[color-mix(in_srgb,var(--brand-700) 35%,var(--border))] bg-[color-mix(in_srgb,var(--surface) 75%,var(--brand-700) 25%)] backdrop-blur">
          <div className="shell py-3 flex items-center justify-between">
            {/* LEFT: logo + wordmark */}
            <Link href="/" className="group flex items-center gap-3">
              <div
                className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-2xl ring-1"
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
              <span
                className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-none tracking-tight"
                style={{ color: 'var(--brand)' }}
              >
                Lela
              </span>
            </Link>

            {/* DESKTOP: nav + icons */}
            <div className="hidden md:flex items-center gap-6">
              {/* main nav */}
              <nav className="flex items-center gap-6 text-sm text-[var(--muted)]">
                <Link href="/browse" className="inline-flex items-center gap-1 hover:text-white">
                  Browse <ChevronDown className="text-[var(--muted)]" />
                </Link>
                <Link href="/explore" className="hover:text-white">Explore</Link>
              </nav>

              {/* right icons */}
              <nav className="flex items-center gap-3">
                <Link href="/library" aria-label="Saved" className="p-2 rounded-md text-[var(--muted)] hover:text-white hover:bg-[color-mix(in_srgb,var(--surface) 75%,var(--brand-700) 25%)] border border-transparent hover:border-[var(--border)]">
                  <Bookmark />
                </Link>
                <Link href="/admin/stories" aria-label="Create" className="p-2 rounded-md text-[var(--muted)] hover:text-white hover:bg-[color-mix(in_srgb,var(--surface) 75%,var(--brand-700) 25%)] border border-transparent hover:border-[var(--border)]">
                  <PlusSquare />
                </Link>
                <span className="h-5 w-px bg-[var(--border)] mx-1" />
                <Link
                  href="/premium"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm"
                  style={{
                    background: 'color-mix(in srgb, var(--brand) 18%, #000)',
                    border: '1px solid color-mix(in srgb, var(--brand) 35%, var(--border))',
                    color: '#fbbf24',
                  }}
                >
                  <Crown style={{ color: '#f59e0b' }} />
                  <span className="font-semibold">TRY LELA <span className="font-extrabold">PREMIUM</span></span>
                  <span aria-hidden>👉</span>
                </Link>
                <span className="h-5 w-px bg-[var(--border)] mx-1" />
                <Link href="/inbox" aria-label="Messages" className="p-2 rounded-md text-[var(--muted)] hover:text-white hover:bg-[color-mix(in_srgb,var(--surface) 75%,var(--brand-700) 25%)] border border-transparent hover:border-[var(--border)]">
                  <Envelope />
                </Link>
                <Link href="/notifications" aria-label="Notifications" className="p-2 rounded-md text-[var(--muted)] hover:text-white hover:bg-[color-mix(in_srgb,var(--surface) 75%,var(--brand-700) 25%)] border border-transparent hover:border-[var(--border)]">
                  <Bell />
                </Link>
                <div className="flex items-center gap-1">
                  <div
                    className="h-8 w-8 rounded-full overflow-hidden ring-1 ring-[var(--border)] grid place-items-center"
                    style={{ background: 'color-mix(in srgb, var(--brand) 18%, #1a1a1f)', color: 'var(--brand)' }}
                    aria-label="User menu"
                  >
                    <span className="text-sm font-semibold">U</span>
                  </div>
                  <ChevronDown className="text-[var(--muted)]" />
                </div>
              </nav>
            </div>

            {/* Mobile Menu */}
            <MobileMenu />
          </div>

          {/* purple underline */}
          <div className="h-1 w-full bg-[var(--brand)]/90" />
        </header>

        <main className="shell py-8">{children}</main>

        <SiteFooter />
      </body>
    </html>
  );
}
