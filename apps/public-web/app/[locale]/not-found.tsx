import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><span className="eyebrow">Fares Uniform · 404</span><h1>Page not found</h1><p>The requested public page is unavailable or has not been published.</p><p>الصفحة المطلوبة غير متاحة أو لم يتم نشرها.</p><Link className="primary-button" href="/en">Return home <span aria-hidden="true">↗</span></Link></main>;
}
