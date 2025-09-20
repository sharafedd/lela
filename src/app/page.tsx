import { supabasePublic } from '@/lib/supabasePublic';
import StoryCard from '@/components/StoryCard';

export default async function Home() {
  const supabase = supabasePublic();
  const { data: stories, error } = await supabase
    .from('stories')
    .select('id, title, slug, excerpt, cover_image_url, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) console.error(error);

  return (
    <main>
      <h1 className="text-3xl font-bold mb-6">Stories</h1>
      {!stories || stories.length === 0 ? (
        <p className="text-neutral-600">No stories yet. Check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((s) => (
            <StoryCard
              key={s.id}
              slug={s.slug}
              title={s.title}
              excerpt={s.excerpt}
              cover_image_url={s.cover_image_url}
            />
          ))}
        </div>
      )}
    </main>
  );
}
