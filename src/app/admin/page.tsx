'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [cover, setCover] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [adminSecret, setAdminSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load/save admin secret so you don't retype it
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('lela_admin_secret') : null;
    if (saved) setAdminSecret(saved);
  }, []);
  useEffect(() => {
    if (adminSecret) localStorage.setItem('lela_admin_secret', adminSecret);
  }, [adminSecret]);

  // Auto-slug when typing title (but allow manual edits)
  useEffect(() => {
    if (!slug && title) setSlug(toSlug(title));
  }, [title, slug]);

  const titleCount = useMemo(() => title.trim().length, [title]);
  const excerptCount = useMemo(() => excerpt.trim().length, [excerpt]);

  const submitWithStatus = async (override?: 'draft' | 'published') => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const body = {
        title,
        slug: slug || toSlug(title),
        excerpt: excerpt || null,
        content,
        coverImageUrl: cover || null,
        status: override ?? status,
      };
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret,
        },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save');
      setResult(`/stories/${json.slug}`);
      // reset minimal (keep adminSecret)
      setTitle('');
      setSlug('');
      setExcerpt('');
      setContent('');
      setCover('');
      setStatus('draft');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Image src="/lela-logo.png" alt="Lela logo" width={32} height={32} className="rounded-md" />
          <div>
            <h1 className="text-2xl font-semibold">Admin · Create Story</h1>
            <p className="text-sm text-neutral-500">Write, preview, and publish stories to Lela</p>
          </div>
        </div>
      </div>

      {/* Grid: form + preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <section className="rounded-2xl border bg-white">
          <form
            onSubmit={(e) => { e.preventDefault(); submitWithStatus(); }}
            className="p-5 space-y-5"
          >
            {/* Admin secret */}
            <div>
              <label className="block text-sm font-medium">Admin Secret</label>
              <input
                type="password"
                required
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                placeholder="Enter the ADMIN_SECRET"
              />
              <p className="text-xs text-neutral-500 mt-1">Stored locally in your browser (not sent anywhere until you save).</p>
            </div>

            {/* Title + count */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">Title</label>
                <span className="text-xs text-neutral-500">{titleCount}/120</span>
              </div>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 120))}
                placeholder="My great story"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium">Slug</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={slug}
                onChange={(e) => setSlug(toSlug(e.target.value))}
                placeholder="my-great-story"
              />
              <p className="text-xs text-neutral-500 mt-1">URL will be <code>/stories/{slug || toSlug(title) || 'your-slug'}</code></p>
            </div>

            {/* Excerpt + count */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">Excerpt (short summary)</label>
                <span className="text-xs text-neutral-500">{excerptCount}/240</span>
              </div>
              <textarea
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value.slice(0, 240))}
                rows={2}
                placeholder="One or two lines about the story..."
              />
            </div>

            {/* Cover URL with small preview */}
            <div>
              <label className="block text-sm font-medium">Cover image URL (optional)</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                placeholder="https://..."
              />
              {cover ? (
                <div className="mt-2">
                  <img src={cover} alt="" className="h-32 w-full object-cover rounded-lg border" />
                </div>
              ) : null}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium">Content</label>
              <textarea
                className="mt-1 w-full rounded-lg border px-3 py-2 min-h-[320px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your story here..."
                required
              />
            </div>

            {/* Status + actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Status</label>
                <select
                  className="rounded-lg border px-3 py-2"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => submitWithStatus('draft')}
                  className="rounded-lg border px-4 py-2 text-sm disabled:opacity-60"
                >
                  {loading ? 'Saving…' : 'Save Draft'}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => submitWithStatus('published')}
                  className="rounded-lg bg-black text-white px-4 py-2 text-sm disabled:opacity-60"
                >
                  {loading ? 'Publishing…' : 'Publish'}
                </button>
              </div>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {result ? (
              <p className="text-sm text-green-700">
                Saved! View it at{' '}
                <a className="underline" href={result}>
                  {result}
                </a>
              </p>
            ) : null}
          </form>
        </section>

        {/* Right: Live Preview */}
        <aside className="lg:sticky lg:top-6 h-fit">
          <div className="rounded-2xl border bg-white overflow-hidden">
            {/* Card preview */}
            <div className="p-4 border-b">
              <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">
                Card Preview (Landing)
              </p>
              <div className="rounded-xl border p-3 bg-white">
                {cover ? (
                  <img src={cover} alt="" className="h-40 w-full object-cover rounded-lg mb-3" />
                ) : (
                  <div className="h-40 w-full rounded-lg bg-neutral-100 grid place-items-center mb-3 text-neutral-400 text-sm">
                    No cover
                  </div>
                )}
                <h2 className="text-lg font-semibold leading-snug">
                  {title || 'Story title'}
                </h2>
                <p className="text-sm text-neutral-600 mt-1 line-clamp-3">
                  {excerpt || 'Short summary will appear here.'}
                </p>
              </div>
            </div>

            {/* Full page preview */}
            <div className="p-5">
              <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">
                Full Page Preview
              </p>
              <article className="prose prose-neutral max-w-none">
                <h1>{title || 'Story title'}</h1>
                <p className="text-sm text-neutral-500">By Admin · {new Date().toLocaleDateString()}</p>
                {cover ? <img src={cover} alt="" className="w-full rounded-2xl my-6" /> : null}
                <div className="whitespace-pre-wrap">{content || 'Start writing your story to see it here…'}</div>
              </article>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
