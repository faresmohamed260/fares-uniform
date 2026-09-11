import { NextResponse } from "next/server";

const allowed = new Set(["idempotency_key", "contact_name", "organization_name", "phone", "email", "message", "source_product_slug", "language", "source_url"]);

function baseUrl() {
  const raw = process.env.ODOO_BASE_URL;
  if (!raw) throw new Error("ODOO_BASE_URL is required outside fixture mode");
  return raw.endsWith("/") ? raw : `${raw}/`;
}

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  const record = body as Record<string, unknown>;
  if (Object.keys(record).some((key) => !allowed.has(key))) return NextResponse.json({ error: "unexpected_field" }, { status: 400 });
  if (typeof record.idempotency_key !== "string" || !record.idempotency_key.trim()) return NextResponse.json({ error: "idempotency_key_required" }, { status: 400 });
  const phone = typeof record.phone === "string" ? record.phone.trim() : "";
  const email = typeof record.email === "string" ? record.email.trim() : "";
  if (!phone && !email) return NextResponse.json({ error: "contact_required" }, { status: 400 });
  if (record.language !== "en" && record.language !== "ar") return NextResponse.json({ error: "invalid_language" }, { status: 400 });
  if (process.env.FU_PUBLIC_PROVIDER === "fixture") return NextResponse.json({ status: "accepted", reference: "FUQ-CI-0001" }, { status: 201 });
  const url = new URL("fu/public/enquiries", baseUrl());
  const upstream = await fetch(url, { method: "POST", cache: "no-store", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(record) });
  const payload = await upstream.json().catch(() => ({ error: "upstream_error" }));
  return NextResponse.json(payload, { status: upstream.status });
}
