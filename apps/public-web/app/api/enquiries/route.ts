import { enquiryRateKey, verifyEnquiryFormToken } from "@/lib/enquiry-form-token";
import { odooPrivateFetch, odooPrivateUrl } from "@/lib/odoo-private";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

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

const MAX_BODY_BYTES = 16 * 1024;
const UPSTREAM_TIMEOUT_MS = 8_000;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 5;

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

type RateEntry = { startedAt: number; count: number };
const rateEntries = new Map<string, RateEntry>();

function publicJson(error: string, status: number, headers: HeadersInit = {}) {
  return NextResponse.json(
    { error },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...headers,
      },
    },
  );
}

function acceptedJson(reference: string, status: 200 | 201) {
  return NextResponse.json(
    { status: "accepted", reference },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

function logPublicFailure(event: string, status: number) {
  console.warn(`[public-enquiry] event=${event} status=${status}`);
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

function requestIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

function consumeRate(request: Request, now = Date.now()) {
  const key = enquiryRateKey(requestIp(request));
  for (const [entryKey, entry] of rateEntries) {
    if (now - entry.startedAt >= RATE_WINDOW_MS) rateEntries.delete(entryKey);
  }

  const current = rateEntries.get(key);
  if (!current || now - current.startedAt >= RATE_WINDOW_MS) {
    rateEntries.set(key, { startedAt: now, count: 1 });
    return { limited: false, retryAfter: 0 };
  }
  if (current.count >= RATE_LIMIT) {
    return {
      limited: true,
      retryAfter: Math.max(1, Math.ceil((current.startedAt + RATE_WINDOW_MS - now) / 1000)),
    };
  }
  current.count += 1;
  return { limited: false, retryAfter: 0 };
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

async function readBoundedJson(request: Request): Promise<
  | { ok: true; value: unknown }
  | { ok: false; error: "request_too_large" | "invalid_json" }
> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return { ok: false, error: "request_too_large" };
  }
  if (!request.body) return { ok: false, error: "invalid_json" };

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  let raw = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) {
        await reader.cancel();
        return { ok: false, error: "request_too_large" };
      }
      raw += decoder.decode(value, { stream: true });
    }
    raw += decoder.decode();
    return { ok: true, value: JSON.parse(raw) };
  } catch {
    return { ok: false, error: "invalid_json" };
  }
}

function fixtureSimulation(request: Request) {
  if (process.env.FU_PUBLIC_PROVIDER !== "fixture") return null;
  const scenario = request.headers.get("x-fares-ci-upstream");
  if (scenario === "timeout") {
    logPublicFailure("upstream_timeout", 504);
    return publicJson("service_timeout", 504);
  }
  if (scenario === "unavailable") {
    logPublicFailure("upstream_unavailable", 503);
    return publicJson("service_unavailable", 503);
  }
  return null;
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return publicJson("unsupported_media_type", 415);
  }

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return publicJson("request_too_large", 413);
  }

  if (!sameOrigin(request) || !verifyEnquiryFormToken(request.headers.get("x-fares-enquiry-token"))) {
    return publicJson("request_forbidden", 403);
  }

  const rate = consumeRate(request);
  if (rate.limited) {
    logPublicFailure("rate_limited", 429);
    return publicJson("rate_limited", 429, { "Retry-After": String(rate.retryAfter) });
  }

  const parsed = await readBoundedJson(request);
  if (!parsed.ok) {
    return publicJson(parsed.error, parsed.error === "request_too_large" ? 413 : 400);
  }

  const validation = validate(parsed.value);
  if (!validation.ok) return publicJson("invalid_request", 400);

  const simulated = fixtureSimulation(request);
  if (simulated) return simulated;

  if (process.env.FU_PUBLIC_PROVIDER === "fixture") {
    return acceptedJson("FUQ-CI-0001", 201);
  }

  const url = odooPrivateUrl("/fu/public/enquiries");
  try {
    const upstream = await odooPrivateFetch(url, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(validation.payload),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (upstream.status === 409) return publicJson("idempotency_conflict", 409);
    if (upstream.status >= 400 && upstream.status < 500) return publicJson("invalid_request", 400);
    if (!upstream.ok) {
      logPublicFailure("upstream_unavailable", 503);
      return publicJson("service_unavailable", 503);
    }

    const payload = await upstream.json().catch(() => null) as
      | { status?: unknown; reference?: unknown }
      | null;
    if (
      !payload ||
      payload.status !== "accepted" ||
      typeof payload.reference !== "string" ||
      !payload.reference
    ) {
      logPublicFailure("upstream_invalid_response", 503);
      return publicJson("service_unavailable", 503);
    }
    return acceptedJson(payload.reference, upstream.status === 200 ? 200 : 201);
  } catch (error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      logPublicFailure("upstream_timeout", 504);
      return publicJson("service_timeout", 504);
    }
    logPublicFailure("upstream_unavailable", 503);
    return publicJson("service_unavailable", 503);
  }
}
