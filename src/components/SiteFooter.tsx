import Link from 'next/link';

function A({ href, children }: { href: string; children: React.ReactNode }) {
  const cls = 'hover:text-white transition-colors';
  return href.startsWith('http')
    ? <a href={href} target="_blank" rel="noreferrer" className={cls}>{children}</a>
    : <Link href={href} className={cls}>{children}</Link>;
}

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ul className="space-y-2 text-[var(--text)]/85">{children}</ul>
    </div>
  );
}

function Crown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...props}>
      <path fill="currentColor" d="M5 17h14l-1 3H6l-1-3Zm0-9 4 4 3-6 3 6 4-4v8H5V8Z" />
    </svg>
  );
}

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16">
      {/* Back to top bar (CSS smooth scroll) */}
      <a href="#top" className="block text-center font-semibold py-3 bg-[var(--brand)] text-white">
        Back to top
      </a>

      {/* Link grid */}
      <div className="shell py-10">
        <div className="rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface) 92%, var(--brand-700) 8%)] p-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Col title="Navigation">
              <li><A href="/popular">Popular</A></li>
              <li><A href="/recommendations">Recommendations</A></li>
              <li><A href="/trends">Trends</A></li>
              <li><A href="/calendar">Calendar</A></li>
              <li><A href="/store">Lela Store</A></li>
            </Col>
            <Col title="Our Socials">
              <li><A href="/">Lela</A></li>
              <li><A href="https://youtube.com">Youtube</A></li>
              <li><A href="https://about.facebook.com/meta/">Meta</A></li>
              <li><A href="https://instagram.com">Instagram</A></li>
              <li><A href="https://tiktok.com">Tiktok</A></li>
              <li><A href="https://x.com">X (Previously Twitter)</A></li>
            </Col>
            <Col title="Lela">
              <li>
                <Link
                  href="/premium"
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md transition"
                  style={{
                    background: 'color-mix(in srgb, var(--brand) 18%, #000)',
                    border: '1px solid color-mix(in srgb, var(--brand) 35%, var(--border))',
                    color: '#fbbf24',
                  }}
                >
                  <Crown style={{ color: '#f59e0b' }} />
                  <span>Try Lela Premium</span>
                </Link>
              </li>
              <li><A href="/about">About</A></li>
              <li><A href="/help">Help</A></li>
              <li><A href="/terms">Terms &amp; Conditions</A></li>
              <li><A href="/privacy">Privacy Policy</A></li>
              <li><A href="/copyright">Copyright Policy</A></li>
              <li><A href="/ad-choices">AD Choices</A></li>
              <li><A href="/payment-policy">Payment Policy</A></li>
              <li><A href="/accessibility">Accessibility</A></li>
              <li><A href="/careers">Careers</A></li>
            </Col>
            <Col title="Account">
              <li><A href="/library">Library</A></li>
              <li><A href="/lists">Lists</A></li>
              <li><A href="/history">History</A></li>
              <li><A href="/admin/stories">My Stories</A></li>
              <li><A href="/admin/profile">My Account</A></li>
              <li><A href="/notifications">Notifications</A></li>
              <li><A href="/inbox">Inbox</A></li>
              <li><A href="/api/admin/logout">Log Out</A></li>
            </Col>
          </div>
        </div>
      </div>

      {/* Final, full-bleed darkest block */}
      <div className="bg-[#050507]">
        <div className="shell py-8 text-center text-sm text-[var(--muted)]">
          © {year} <span className="font-semibold text-white">LELA</span> Copyright | All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
