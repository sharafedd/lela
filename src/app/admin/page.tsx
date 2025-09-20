'use client';

import { useState } from 'react';

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null);
    try {
      const body = {
        title,
        slug: slug || toSlug(title),
        excerpt: excerpt || null,
        content,
        coverImageUrl: cover || null,
        status,
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
      setTitle(''); setSlug(''); setExcerpt(''); setContent(''); setCover('');
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
    <main className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Admin · Create Story</h1>

      <form onSubmit={onSubmit} className="space-y-4">
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
        </div>

        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (!slug) setSlug(toSlug(e.target.value)); }}
            placeholder="My great story"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={slug}
            onChange={(e) => setSlug(toSlug(e.target.value))}
            placeholder="my-great-story"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Excerpt (short summary)</label>
          <textarea
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            placeholder="One or two lines about the story..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Cover image URL (optional)</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            placeholder="Write your story here..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-lg bg-black text-white px-4 py-2 disabled:opacity-60"
        >
          {loading ? 'Saving…' : 'Save story'}
        </button>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {result ? (
          <p className="text-sm text-green-700">
            Saved! View it at <a className="underline" href={result}>{result}</a>
          </p>
        ) : null}
      </form>
    </main>
  );
}
