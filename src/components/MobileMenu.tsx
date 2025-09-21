'use client';

import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';

/* small inline icons */
function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
    </svg>
  );
}
function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M6.7 6.7 12 12l5.3-5.3 1.4 1.4L13.4 13.4l5.3 5.3-1.4 1.4L12 14.8l-5.3 5.3-1.4-1.4 5.3-5.3-5.3-5.3 1.4-1.4z"/>
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

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // ESC to close + click outside
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const el = panelRef.current;
      if (el && !el.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onDocClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onDocClick);
    };
  }, [open]);

  const itemCls =
    'px-3 py-2 rounded-lg hover:bg-[color-mix(in_srgb,var(--surface) 75%,var(--brand-700) 25%)]';

  return (
    <div className="md:hidden relative">
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[var(--text)]/90 hover:bg-[color-mix(in_srgb,var(--surface) 75%,var(--brand-700) 25%)] border border-transparent hover:border-[var(--border)]"
      >
        <MenuIcon />
        <span className="text-sm">Menu</span>
      </button>

      {open && (
        <div
          id="mobile-nav"
          ref={panelRef}
          className="absolute right-0 mt-2 w-[min(92vw,20rem)] rounded-xl border border-[var(--border)] p-3 shadow-xl"
          style={{ background: 'color-mix(in srgb, var(--surface) 85%, var(--brand-700) 15%)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--muted)]">Quick actions</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="p-1 rounded-md hover:bg-[color-mix(in_srgb,var(--surface) 75%,var(--brand-700) 25%)]"
            >
              <CloseIcon />
            </button>
          </div>

          <nav className="grid gap-2 text-[var(--text)]/90">
            <Link href="/browse" onClick={() => setOpen(false)} className={itemCls}>Browse</Link>
            <Link href="/explore" onClick={() => setOpen(false)} className={itemCls}>Explore</Link>
            <Link href="/library" onClick={() => setOpen(false)} className={itemCls}>Saved</Link>
            <Link href="/admin/stories" onClick={() => setOpen(false)} className={itemCls}>Create</Link>
            <Link href="/inbox" onClick={() => setOpen(false)} className={itemCls}>Messages</Link>
            <Link href="/notifications" onClick={() => setOpen(false)} className={itemCls}>Notifications</Link>

            <Link
              href="/premium"
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{
                background: 'color-mix(in srgb, var(--brand) 18%, #000)',
                border: '1px solid color-mix(in srgb, var(--brand) 35%, var(--border))',
                color: '#fbbf24',
              }}
            >
              <Crown style={{ color: '#f59e0b' }} />
              <span className="font-semibold">Try Lela Premium</span>
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
