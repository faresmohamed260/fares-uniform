import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found">
      <span className="kicker">404</span>
      <h1>Nothing fabricated here.</h1>
      <p>This design review only exposes routes backed by the current truthful review content.</p>
      <Link className="button button-dark" href="/en">Return home <span aria-hidden="true">↗</span></Link>
    </main>
  );
}
