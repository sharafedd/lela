'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

function toSlug(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
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

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('lela_admin_secret') : null;
    if (saved) setAdminSecret(saved);
  }, []);
  useEffect(() => {
    if (adminSecret) localStorage.setItem('lela_admin_secret', adminSecret);
  }, [adminSecret]);
  useEffect(() => {
    if (!slug && title) setSlug(toSlug(title));
  }, [title, slug]);

  const titleCount = useMemo(() => title.trim().length, [title]);
  const excerptCount = useMemo(() => excerpt.trim().length, [excerpt]);

  const submit = async (publish: boolean) => {
    setLoading(true); setError(null); setResult(null);
    try {
      const body = {
        title,
        slug: slug || toSlug(title),
        excerpt: excerpt || null,
        content,
        coverImageUrl: cover || null,
        status: publish ? 'published' : 'draft',
      };
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': adminSecret },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save');
      setResult(`/stories/${json.slug}`);
      setTitle(''); setSlug(''); setExcerpt(''); setContent(''); setCover(''); setStatus('draft');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Image src="/lela-logo.png" alt="Lela" width={56} height={56} className="rounded-lg" />
        <div>
          <h1 className="text-3xl font-semibold">Admin · Create Story</h1>
          <p className="text-sm text-[var(--muted)]">Write, preview, and publish stories to <span style={{ color: 'var(--brand)' }}>Lela</span>.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Form card */}
        <section className="section hover-ring-brand">
          <form onSubmit={(e) => { e.preventDefault(); submit(status === 'published'); }} className="p-5 space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--muted)]">Admin Secret</label>
              <input
                type="password"
                required
                className="mt-1 w-full rounded-lg border px-3 py-2 placeholder:text-[var(--muted)]"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                placeholder="Enter the ADMIN_SECRET"
              />
              <p className="text-xs text-[var(--muted)] mt-1">Stored locally in your browser (not sent anywhere until you save).</p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-[var(--muted)]">Title</label>
                <span className="text-xs text-[var(--muted)]">{titleCount}/120</span>
              </div>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 placeholder:text-[var(--muted)]"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 120))}
                placeholder="My great story"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--muted)]">Slug</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 placeholder:text-[var(--muted)]"
                value={slug}
                onChange={(e) => setSlug(toSlug(e.target.value))}
                placeholder="my-great-story"
              />
              <p className="text-xs text-[var(--muted)] mt-1">
                URL will be <code className="text-neutral-300">/stories/{slug || toSlug(title) || 'your-slug'}</code>
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-[var(--muted)]">Excerpt (short summary)</label>
                <span className="text-xs text-[var(--muted)]">{excerptCount}/240</span>
              </div>
              <textarea
                className="mt-1 w-full rounded-lg border px-3 py-2 placeholder:text-[var(--muted)]"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value.slice(0, 240))}
                rows={2}
                placeholder="One or two lines about the story..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--muted)]">Cover image URL (optional)</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 placeholder:text-[var(--muted)]"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                placeholder="https://..."
              />
              {cover ? <Image src={cover} alt="" className="mt-2 h-36 w-full object-cover rounded-lg border" /> : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--muted)]">Content</label>
              <textarea
                className="mt-1 w-full rounded-lg border px-3 py-2 min-h-[320px] placeholder:text-[var(--muted)]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your story here..."
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-[var(--muted)]">Status</label>
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
                <button type="button" onClick={() => submit(false)} disabled={loading} className="btn btn-ghost disabled:opacity-60">
                  {loading ? 'Saving…' : 'Save Draft'}
                </button>
                <button type="button" onClick={() => submit(true)} disabled={loading} className="btn btn-primary disabled:opacity-60">
                  {loading ? 'Publishing…' : 'Publish'}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {result && (
              <p className="text-sm text-emerald-400">
                Saved! View it at <a className="underline" href={result}>{result}</a>
              </p>
            )}
          </form>
        </section>

        {/* Right: Preview (dark) */}
        <aside className="space-y-6">
          <div className="section p-4 hover-ring-brand">
            <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-2">Card Preview (Landing)</p>
            <div className="rounded-xl border p-3 bg-[var(--surface-2)]">
              {cover ? (
                <Image src={cover} alt="" className="h-40 w-full object-cover rounded-lg mb-3" />
              ) : (
                <div className="h-40 w-full rounded-lg bg-neutral-900 grid place-items-center mb-3 text-neutral-500 text-sm">
                  No cover
                </div>
              )}
              <h2 className="text-lg font-semibold leading-snug">{title || 'Story title'}</h2>
              <p className="text-sm text-[var(--muted)] mt-1 line-clamp-3">{excerpt || 'Short summary will appear here.'}</p>
            </div>
          </div>

          <div className="section p-5 hover-ring-brand">
            <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-2">Full Page Preview</p>
            <article className="prose max-w-none">
              <h1>{title || 'Story title'}</h1>
              <p className="text-sm text-[var(--muted)]">By Admin · {new Date().toLocaleDateString('en-GB')}</p>
              {cover ? <Image src={cover} alt="" className="w-full rounded-2xl my-6" /> : null}
              <div className="whitespace-pre-wrap">{content || 'Start writing your story to see it here…'}</div>
            </article>
          </div>
        </aside>
      </div>
    </div>
  );
}
