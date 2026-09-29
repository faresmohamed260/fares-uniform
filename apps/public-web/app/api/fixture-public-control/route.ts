import { revalidateTag } from "next/cache";
import {
  publicCacheFixtureState,
  resetPublicCacheFixture,
  setPublicCacheFixtureAvailable,
} from "@/lib/public-cache-fixture";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function allowed() {
  return process.env.FU_PUBLIC_PROVIDER === "cache-fixture";
}

export async function GET() {
  if (!allowed()) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(publicCacheFixtureState(), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!allowed()) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const body = (await request.json().catch(() => null)) as { available?: unknown; reset?: unknown } | null;
  if (!body || (body.available !== undefined && typeof body.available !== "boolean") || (body.reset !== undefined && typeof body.reset !== "boolean")) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  if (body.reset) {
    resetPublicCacheFixture();
    revalidateTag("fares-public-v2", { expire: 0 });
    revalidateTag("fares-public-catalog-v1", { expire: 0 });
  }
  if (typeof body.available === "boolean") setPublicCacheFixtureAvailable(body.available);
  return NextResponse.json(publicCacheFixtureState(), { headers: { "Cache-Control": "no-store" } });
}
