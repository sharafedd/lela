// src/components/SiteFooter.tsx
import Link from 'next/link';
import Image from 'next/image';

function A({
  href,
  children,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const base = 'inline-flex items-center gap-2 hover:text-white transition-colors';
  const cls = `${base} ${className}`;
  return href.startsWith('http') ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
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
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M5 17h14l-1 3H6l-1-3Zm0-9 4 4 3-6 3 6 4-4v8H5V8Z" />
    </svg>
  );
}

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16">
      {/* Back to top (simple anchor; safe in Server Component) */}
      <a href="#top" className="block text-center font-semibold py-3 bg-[var(--brand)] text-white">
        Back to top
      </a>

      <div className="shell py-10">
        <div className="rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface) 92%, var(--brand-700) 8%)] p-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Navigation */}
            <Col title="Navigation">
              <li><A href="/popular">Popular</A></li>
              <li><A href="/recommendations">Recommendations</A></li>
              <li><A href="/trends">Trends</A></li>
              <li><A href="/calendar">Calendar</A></li>
              <li><A href="/store">Lela Store</A></li>
            </Col>

            {/* Our Socials (brand-colored icons from public/) */}
            <Col title="Our Socials">
              <li>
                <A href="/">
                  <Image src="/lela-logo.png" alt="" width={18} height={18} className="footer-icon" />
                  Lela
                </A>
              </li>
              <li>
                <A href="https://youtube.com">
                  <Image src="/icons/youtube.png" alt="" width={18} height={18} className="footer-icon" />
                  Youtube
                </A>
              </li>
              <li>
                <A href="https://about.facebook.com/meta/">
                  <Image src="/icons/meta.png" alt="" width={18} height={18} className="footer-icon" />
                  Meta
                </A>
              </li>
              <li>
                <A href="https://instagram.com">
                  <Image src="/icons/instagram.png" alt="" width={18} height={18} className="footer-icon" />
                  Instagram
                </A>
              </li>
              <li>
                <A href="https://tiktok.com">
                  <Image src="/icons/tiktok.png" alt="" width={18} height={18} className="footer-icon" />
                  Tiktok
                </A>
              </li>
              <li>
                <A href="https://x.com">
                  <Image src="/icons/x.png" alt="" width={18} height={18} className="footer-icon" />
                  X (Previously Twitter)
                </A>
              </li>
            </Col>

            {/* Lela */}
            <Col title="Lela">
              <li>
                <Link href="/premium" className="premium-cta" aria-label="Try Lela Premium">
                  <span className="premium-cta__crown" aria-hidden="true">
                    <Crown width={18} height={18} />
                  </span>
                  <span className="premium-cta__label">Try Lela Premium</span>
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

            {/* Account */}
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

      {/* Dark bottom bar as the very last element */}
      <div style={{ background: '#060608' }}>
        <div className="shell py-6 text-center text-sm text-[var(--muted)]">
          © {year} <span className="font-semibold text-white">LELA</span> Copyright | All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
