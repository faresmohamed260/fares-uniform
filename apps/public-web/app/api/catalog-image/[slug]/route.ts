function fixtureSvg(slug: string) {
  const label = slug === "chef-jacket" ? "CJ" : slug === "school-polo" ? "SP" : "HS";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1000"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#dbe8e1"/><stop offset="1" stop-color="#f5efe3"/></linearGradient></defs><rect width="900" height="1000" fill="url(#g)"/><circle cx="690" cy="220" r="250" fill="#96b9a7" opacity=".28"/><path d="M290 250 405 180h90l115 70 145 110-85 145-88-54v365H318V451l-88 54-85-145z" fill="#123c34"/><path d="M450 190v625" stroke="#f3eee4" stroke-width="8" opacity=".42"/><text x="70" y="900" font-family="Arial" font-size="54" font-weight="700" fill="#123c34">${label}</text></svg>`;
}

function baseUrl() {
  const raw = process.env.ODOO_BASE_URL;
  if (!raw) throw new Error("ODOO_BASE_URL is required outside fixture mode");
  return raw.endsWith("/") ? raw : `${raw}/`;
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (process.env.FU_PUBLIC_PROVIDER === "fixture") return new Response(fixtureSvg(slug), { status: 200, headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=3600", "X-Content-Type-Options": "nosniff" } });
  const url = new URL(`fu/public/catalog/${encodeURIComponent(slug)}/image`, baseUrl());
  const upstream = await fetch(url, { cache: "no-store" });
  if (!upstream.ok) return new Response(null, { status: upstream.status });
  const type = upstream.headers.get("content-type") ?? "";
  if (!type.toLowerCase().startsWith("image/")) return new Response(null, { status: 502 });
  return new Response(await upstream.arrayBuffer(), { status: 200, headers: { "Content-Type": type, "Cache-Control": upstream.headers.get("cache-control") ?? "public, max-age=300", "X-Content-Type-Options": "nosniff" } });
}
