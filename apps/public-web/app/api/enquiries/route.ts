import { NextResponse } from "next/server";

const allowed = new Set(["idempotency_key", "contact_name", "organization_name", "phone", "email", "sector", "message", "source_product_slug", "language"]);

const limits = {
  idempotency_key: 120,
  contact_name: 120,
  organization_name: 160,
  phone: 60,
  email: 254,
  sector: 120,
  message: 4000,
  source_product_slug: 120,
} as const;

type TextKey = keyof typeof limits;

type EnquiryPayload = {
  idempotency_key: string;
  contact_name: string;
  organization_name: string;
  phone: string;
  email: string;
  sector: string;
  message: string;
  source_product_slug: string;
  language: "en" | "ar";
};

type ValidationResult =
  | { ok: true; payload: EnquiryPayload }
  | { ok: false; error: string };

function baseUrl() {
  const raw = process.env.ODOO_BASE_URL;
  if (!raw) throw new Error("ODOO_BASE_URL is required outside fixture mode");
  return raw.endsWith("/") ? raw : `${raw}/`;
}

function text(record: Record<string, unknown>, key: TextKey, required = false): string | null {
  const raw = record[key] ?? "";
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (value.length > limits[key]) return null;
  if (required && !value) return null;
  return value;
}

function validate(body: unknown): ValidationResult {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { ok: false, error: "invalid_payload" };
  const record = body as Record<string, unknown>;
  if (Object.keys(record).some((key) => !allowed.has(key))) return { ok: false, error: "unexpected_field" };

  const idempotency_key = text(record, "idempotency_key", true);
  const contact_name = text(record, "contact_name", true);
  const organization_name = text(record, "organization_name", true);
  const phone = text(record, "phone");
  const email = text(record, "email");
  const sector = text(record, "sector", true);
  const message = text(record, "message", true);
  const source_product_slug = text(record, "source_product_slug");
  if (idempotency_key === null || contact_name === null || organization_name === null || phone === null || email === null || sector === null || message === null || source_product_slug === null) {
    return { ok: false, error: "invalid_field" };
  }
  if (!phone && !email) return { ok: false, error: "contact_required" };
  if (record.language !== "en" && record.language !== "ar") return { ok: false, error: "invalid_language" };

  return {
    ok: true,
    payload: {
      idempotency_key,
      contact_name,
      organization_name,
      phone,
      email,
      sector,
      message,
      source_product_slug,
      language: record.language,
    },
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const validation = validate(body);
  if (!validation.ok) return NextResponse.json({ error: validation.error }, { status: 400 });

  if (process.env.FU_PUBLIC_PROVIDER === "fixture") {
    return NextResponse.json({ status: "accepted", reference: "FUQ-CI-0001" }, { status: 201 });
  }

  const url = new URL("fu/public/enquiries", baseUrl());
  const upstream = await fetch(url, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(validation.payload),
  });
  const payload = await upstream.json().catch(() => ({ error: "upstream_error" }));
  return NextResponse.json(payload, { status: upstream.status });
}
