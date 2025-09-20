import Link from 'next/link';
import Image from 'next/image';

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
      className="block rounded-2xl border p-4"
      style={{
        background: 'color-mix(in srgb, var(--surface) 90%, var(--brand-700) 10%)',
        borderColor: 'var(--border)',
      }}
    >
      {cover_image_url ? (
        <div className="relative w-full h-40 mb-3 overflow-hidden rounded-xl">
          <Image
            src={cover_image_url}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            unoptimized
          />
        </div>
      ) : null}
      <h2 className="text-xl font-semibold leading-snug">{title}</h2>
      {excerpt ? (
        <p className="text-sm text-[var(--muted)] mt-1 line-clamp-3">{excerpt}</p>
      ) : null}
    </Link>
  );
}
