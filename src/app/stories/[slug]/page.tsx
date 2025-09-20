import { supabasePublic } from '@/lib/supabasePublic';
import { notFound } from 'next/navigation';

export default async function StoryPage({ params }: { params: { slug: string } }) {
  const supabase = supabasePublic();
  const { data, error } = await supabase
    .from('stories')
    .select('id, title, content, cover_image_url, created_at, author, status')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return notFound();

  return (
    <article className="prose prose-neutral max-w-none">
      <h1>{data.title}</h1>
      <p className="text-sm text-neutral-500">
        By {data.author ?? 'Admin'} · {new Date(data.created_at).toLocaleDateString()}
      </p>
      {data.cover_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.cover_image_url} alt="" className="w-full rounded-2xl my-6" />
      ) : null}
      <div className="whitespace-pre-wrap">{data.content}</div>
    </article>
  );
}
