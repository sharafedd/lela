'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/* eslint-disable @next/next/no-img-element */

type Story = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  status: 'draft' | 'published';
  created_at: string;
};

export default function AdminStoriesPage() {
  const [published, setPublished] = useState<Story[]>([]);
  const [drafts, setDrafts] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const adminSecret = localStorage.getItem('lela_admin_secret') || '';
      const headers: HeadersInit = { 'x-admin-secret': adminSecret };

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
    if (!adminSecret) return alert('Missing ADMIN secret. Set it in the Create page once.');
    const ok = confirm('Delete this story? This cannot be undone.');
    if (!ok) return;

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
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">My stories</h1>
          <p className="text-sm text-[var(--muted)]">Published and drafts, separated for clarity.</p>
        </div>
        <Link href="/admin" className="btn btn-primary">Create new</Link>
      </header>

      {err && <p className="text-sm text-red-400">{err}</p>}
      {loading && <p className="text-sm text-[var(--muted)]">Loading…</p>}

      {/* PUBLISHED */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Published</h2>
          <span className="text-xs text-[var(--muted)]">{published.length}</span>
        </div>

        {published.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No published stories yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {published.map((s) => (
              <Card key={s.id} story={s} deletable={true} onDelete={onDelete} />
            ))}
          </div>
        )}
      </section>

      {/* DRAFTS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Drafts</h2>
          <span className="text-xs text-[var(--muted)]">{drafts.length}</span>
        </div>

        {drafts.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No drafts yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {drafts.map((s) => (
              <Card key={s.id} story={s} deletable={true} onDelete={onDelete} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Card({
  story,
  deletable,
  onDelete,
}: {
  story: Story;
  deletable?: boolean;
  onDelete: (slug: string) => void;
}) {
  const cover = story.cover_image_url || '/placeholder-cover.jpg';
  const created = new Date(story.created_at).toLocaleDateString('en-GB');

  return (
    <div className="card hover-ring-brand overflow-hidden">
      <Link href={`/stories/${story.slug}`} className="block">
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[var(--border)]">
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
            <h3 className="text-base font-semibold">{story.title}</h3>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between p-3">
        <div className="text-xs text-[var(--muted)]">
          {story.status === 'published' ? 'Published' : 'Draft'} · {created}
        </div>

        {deletable && (
          <button
            onClick={() => onDelete(story.slug)}
            className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium"
            style={{
              background: 'color-mix(in srgb, #ef4444 18%, #000)',
              border: '1px solid color-mix(in srgb, #ef4444 40%, var(--border))',
              color: '#fecaca',
            }}
            title="Delete"
          >
            {/* bin icon */}
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path fill="currentColor" d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 6h2v9h-2V9Zm4 0h2v9h-2V9ZM6 9h2v9H6V9Z" />
            </svg>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
