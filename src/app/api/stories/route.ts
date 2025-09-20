import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(req: Request) {
  const secret = req.headers.get('x-admin-secret');
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const title: string | undefined = body.title;
  const content: string | undefined = body.content;
  if (!title || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const slug = body.slug ? toSlug(body.slug) : toSlug(title);
  const excerpt = body.excerpt ?? null;
  const coverImageUrl = body.coverImageUrl ?? null;
  const status = body.status === 'published' ? 'published' : 'draft';

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from('stories')
    .upsert(
      {
        title,
        slug,
        excerpt,
        content,
        cover_image_url: coverImageUrl,
        status,
      },
      { onConflict: 'slug' }
    )
    .select('id, slug')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data!.id, slug: data!.slug }, { status: 201 });
}
