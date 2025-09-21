'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get('next') || '/admin';
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Login failed');

      router.replace(next);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="shell py-16">
      <div className="mx-auto max-w-md">
        <div className="section p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative h-12 w-12 rounded-2xl overflow-hidden">
              <Image src="/lela-logo.png" alt="Lela" fill sizes="48px" className="object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Lela Admin</h1>
              <p className="text-sm text-[var(--muted)]">Sign in to manage stories</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--muted)]">Admin Secret</label>
              <input
                type="password"
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter ADMIN_SECRET"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-60">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            {err && <p className="text-sm text-red-400">{err}</p>}
          </form>

          <p className="mt-4 text-xs text-[var(--muted)]">
            Your session is stored as a secure cookie for 8 hours.
          </p>
        </div>
      </div>
    </main>
  );
}
