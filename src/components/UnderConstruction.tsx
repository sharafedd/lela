/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';

export default function UnderConstruction({ title }: { title: string }) {
  return (
    <section className="min-h-[50vh] grid place-items-center">
      <div className="w-full max-w-2xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-semibold mb-3">{title}</h1>

        <p className="text-[var(--muted)] mb-5">
          We’re finishing this section to make it great. Check back soon—
          <Link href="/notifications" className="underline" style={{ color: 'var(--brand)' }}>
            turn on notifications
          </Link>
          .
        </p>

        {/* Intrinsic-size gif — no cropping, no background */}
        <img
          src="/underconstruction.gif"
          alt="Under construction"
          className="w-full max-w-[280px] h-auto mx-auto rounded-2xl border border-[var(--border)] shadow-lg"
          loading="eager"
        />

        <p className="mt-3 text-xs text-[var(--muted)]">
          (Temporary placeholder while we build the real thing.)
        </p>
      </div>
    </section>
  );
}
