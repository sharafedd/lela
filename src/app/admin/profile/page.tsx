'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/* Types */
type Story = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  status: 'draft' | 'published';
  created_at: string;
};

/* Small icons */
function ArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M14 7l-5 5 5 5 1.4-1.4L11.8 12l3.6-3.6L14 7z"/>
    </svg>
  );
}
function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M10 7l5 5-5 5-1.4-1.4L12.2 12 8.6 8.4 10 7z"/>
    </svg>
  );
}
function Trash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 6h2v9h-2V9Zm4 0h2v9h-2V9ZM6 9h2v9H6V9Z" />
    </svg>
  );
}
function Pencil(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25ZM20.7 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z"/>
    </svg>
  );
}

export default function AdminProfilePage() {
  const [published, setPublished] = useState<Story[]>([]);
  const [drafts, setDrafts] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const adminSecret = typeof window !== 'undefined' ? localStorage.getItem('lela_admin_secret') || '' : '';
      const headers: HeadersInit = adminSecret ? { 'x-admin-secret': adminSecret } : {};

      const [pubRes, draftRes] = await Promise.all([
        fetch('/api/stories?status=published', { headers, cache: 'no-store' }),
        fetch('/api/stories?status=draft', { headers, cache: 'no-store' }),
      ]);

      const pubJson = await pubRes.json();
      const draftJson = await draftRes.json();
      if (!pubRes.ok) throw new Error(pubJson.error || 'Failed loading published');
      if (!draftRes.ok) throw new Error(draftJson.error || 'Failed loading drafts');

      setPublished(pubJson.stories as Story[]);
      setDrafts(draftJson.stories as Story[]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onDelete(slug: string) {
    const adminSecret = localStorage.getItem('lela_admin_secret') || '';
    if (!adminSecret) return alert('Missing ADMIN secret. Save it once from the Create page.');
    if (!confirm('Delete this story? This cannot be undone.')) return;

    const res = await fetch(`/api/stories/${slug}`, {
      method: 'DELETE',
      headers: { 'x-admin-secret': adminSecret },
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j.error || 'Failed to delete');
      return;
    }
    await load();
  }

  return (
    <div className="space-y-10">
      {/* Profile header */}
      <section className="section p-5 flex items-center gap-4">
        <div
          className="h-14 w-14 rounded-full ring-1 ring-[var(--border)] grid place-items-center shrink-0"
          style={{ background: 'color-mix(in srgb, var(--brand) 18%, #1a1a1f)', color: 'var(--brand)' }}
          aria-label="Admin avatar"
        >
          <span className="text-lg font-semibold">A</span>
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold leading-tight">Admin</h1>
          <p className="text-sm text-[var(--muted)] truncate">admin@example.com • “Writing the web’s favorite stories.”</p>
        </div>
        <div className="ml-auto">
          <Link href="/admin" className="btn btn-primary">Create story</Link>
        </div>
      </section>

      {err && <p className="text-sm text-red-400">{err}</p>}
      {loading && <p className="text-sm text-[var(--muted)]">Loading…</p>}

      {/* Published carousel */}
      <CarouselSection
        title="Published"
        count={published.length}
        stories={published}
        onDelete={onDelete}
        emptyHint="No published stories yet."
      />

      {/* Drafts carousel */}
      <CarouselSection
        title="Drafts"
        count={drafts.length}
        stories={drafts}
        onDelete={onDelete}
        emptyHint="No drafts yet."
      />

      <div className="text-right">
        <Link href="/admin/stories" className="text-sm underline" style={{ color: 'var(--brand-400)' }}>
          View all stories →
        </Link>
      </div>

      {/* Hide scrollbars + helpers */}
      <style jsx global>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

/* ===== Components ===== */

function CarouselSection({
  title,
  count,
  stories,
  onDelete,
  emptyHint,
}: {
  title: string;
  count: number;
  stories: Story[];
  onDelete: (slug: string) => void;
  emptyHint: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Center the middle card on mount/update
  const hasStories = stories.length > 0;
  useEffect(() => {
    const el = trackRef.current;
    if (!el || !hasStories) return;
    // center content
    el.scrollTo({ left: Math.max(0, (el.scrollWidth - el.clientWidth) / 2), behavior: 'instant' as ScrollBehavior });
  }, [hasStories]);

  const scrollBy = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const dx = Math.round(el.clientWidth * 0.9) * dir;
    el.scrollBy({ left: dx, behavior: 'smooth' });
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <h2 className="text-xl font-semibold">{title}</h2>
          <span className="text-xs text-[var(--muted)]">{count}</span>
        </div>

        {stories.length > 0 && (
          <div className="hidden sm:flex items-center gap-2">
            <button
              aria-label="Scroll left"
              onClick={() => scrollBy(-1)}
              className="p-2 rounded-md border border-[var(--border)] hover:bg-[color-mix(in_srgb,var(--surface) 75%,var(--brand-700) 25%)]"
            >
              <ArrowLeft />
            </button>
            <button
              aria-label="Scroll right"
              onClick={() => scrollBy(1)}
              className="p-2 rounded-md border border-[var(--border)] hover:bg-[color-mix(in_srgb,var(--surface) 75%,var(--brand-700) 25%)]"
            >
              <ArrowRight />
            </button>
          </div>
        )}
      </div>

      {stories.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">{emptyHint}</p>
      ) : (
        <div className="relative">
          {/* Edge fades (darker) */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0a0a0d]/90 to-transparent rounded-l-xl" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0a0a0d]/90 to-transparent rounded-r-xl" />

          {/* Track */}
          <div
            ref={trackRef}
            className="scrollbar-hide overflow-x-auto scroll-smooth snap-x snap-mandatory -mx-3 px-3 py-2"
            style={{ scrollPaddingLeft: 24, scrollPaddingRight: 24 }}
          >
            <div className="flex gap-4 justify-center">
              {stories.map((s) => (
                <StoryCard key={s.id} story={s} onDelete={onDelete} />
              ))}
            </div>
          </div>

          {/* Floating arrow buttons (mobile too) */}
          <button
            aria-label="Scroll left"
            onClick={() => scrollBy(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface) 80%,var(--brand-700) 20%)] hover:bg-[color-mix(in_srgb,var(--surface) 70%,var(--brand-700) 30%)] shadow-md"
          >
            <ArrowLeft />
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scrollBy(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface) 80%,var(--brand-700) 20%)] hover:bg-[color-mix(in_srgb,var(--surface) 70%,var(--brand-700) 30%)] shadow-md"
          >
            <ArrowRight />
          </button>
        </div>
      )}
    </section>
  );
}

function StoryCard({ story, onDelete }: { story: Story; onDelete: (slug: string) => void }) {
  const cover = story.cover_image_url || '/placeholder-cover.jpg';
  const created = new Date(story.created_at).toLocaleDateString('en-GB');

  return (
    <div
      className="relative snap-start shrink-0 w-72 md:w-80 card hover-ring-brand overflow-hidden transition-transform duration-200 ease-out hover:scale-[1.03] hover:z-10"
      style={{ willChange: 'transform' }}
    >
      <Link href={`/stories/${story.slug}`} className="block">
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[var(--border)]">
          <Image
            src={cover}
            alt={story.title || 'Story cover'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 288px, 320px"
            unoptimized
          />
        </div>
      </Link>

      <div className="p-3 space-y-2">
        <Link href={`/stories/${story.slug}`} className="block">
          <h3 className="text-base font-semibold leading-snug line-clamp-2">{story.title}</h3>
        </Link>

        <div className="flex items-center justify-between">
          <div className="text-xs text-[var(--muted)]">
            {story.status === 'published' ? 'Published' : 'Draft'} · {created}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/admin/stories/${story.slug}/edit`}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium border border-[var(--border)] hover:bg-[color-mix(in_srgb,var(--surface) 75%,var(--brand-700) 25%)]"
              title="Edit"
              aria-label={`Edit ${story.title}`}
            >
              <Pencil />
              Edit
            </Link>

            <button
              onClick={() => onDelete(story.slug)}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium"
              style={{
                background: 'color-mix(in srgb, #ef4444 18%, #000)',
                border: '1px solid color-mix(in srgb, #ef4444 40%, var(--border))',
                color: '#fecaca',
              }}
              title="Delete"
              aria-label={`Delete ${story.title}`}
            >
              <Trash />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
