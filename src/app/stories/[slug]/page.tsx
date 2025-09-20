import { supabasePublic } from '@/lib/supabasePublic';
import { notFound } from 'next/navigation';
import Image from 'next/image';

type RouteParams = { slug: string };

export default async function StoryPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;

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
        <div
          className="relative w-full my-6 overflow-hidden rounded-2xl"
          style={{ aspectRatio: '16 / 9' }} // keeps layout stable
        >
          <Image
            src={data.cover_image_url}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 960px"
            className="object-cover"
            unoptimized
          />
        </div>
      ) : null}

      <div className="whitespace-pre-wrap">{data.content}</div>
    </article>
  );
}
