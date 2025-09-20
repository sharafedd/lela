import { supabasePublic } from '@/lib/supabasePublic';
import { notFound } from 'next/navigation';

type RouteParams = { slug: string };

export default async function StoryPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params; // ✅ await params before using it

  const supabase = supabasePublic();
  const { data, error } = await supabase
    .from('stories')
    .select('id, title, content, cover_image_url, created_at, author, status')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return notFound();

  const dateStr = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(data.created_at));

  return (
    <article className="prose max-w-none">
      <h1>{data.title}</h1>
      <p className="text-sm text-[var(--muted)]">
        By {data.author ?? 'Admin'} · {dateStr}
      </p>
      {data.cover_image_url ? (
        <img src={data.cover_image_url} alt="" className="w-full rounded-2xl my-6" />
      ) : null}
      <div className="whitespace-pre-wrap">{data.content}</div>
    </article>
  );
}
