import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE, isValidSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function toSlug(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function authorized(req: Request): Promise<boolean> {
  // Prefer signed cookie session
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (isValidSession(token)) return true;

  // Back-compat header (optional)
  const headerSecret = req.headers.get('x-admin-secret');
  if (headerSecret && process.env.ADMIN_SECRET && headerSecret === process.env.ADMIN_SECRET) {
    return true;
  }
  return false;
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse and validate JSON (no `any`)
  const raw = await req.json().catch(() => null);
  if (!raw || typeof raw !== 'object') {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const obj = raw as Record<string, unknown>;

  const title = typeof obj.title === 'string' ? obj.title : undefined;
  const content = typeof obj.content === 'string' ? obj.content : undefined;
  if (!title || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const slugInput = typeof obj.slug === 'string' ? obj.slug : undefined;
  const excerpt = typeof obj.excerpt === 'string' ? obj.excerpt : null;
  const coverImageUrl =
    typeof obj.coverImageUrl === 'string' && obj.coverImageUrl.trim() !== ''
      ? obj.coverImageUrl
      : null;
  const status = obj.status === 'published' ? 'published' : 'draft';

  const slug = slugInput ? toSlug(slugInput) : toSlug(title);

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
