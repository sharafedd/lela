import Link from 'next/link';

type Props = {
  slug: string;
  title: string;
  excerpt?: string | null;
  cover_image_url?: string | null;
};

export default function StoryCard({ slug, title, excerpt, cover_image_url }: Props) {
  return (
    <Link
      href={`/stories/${slug}`}
      className="block rounded-2xl border p-4 hover:shadow-lg transition bg-white"
    >
      {cover_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover_image_url}
          alt=""
          className="h-40 w-full object-cover rounded-xl mb-3"
        />
      ) : null}
      <h2 className="text-xl font-semibold leading-snug">{title}</h2>
      {excerpt ? (
        <p className="text-sm text-neutral-600 mt-1 line-clamp-3">{excerpt}</p>
      ) : null}
    </Link>
  );
}
