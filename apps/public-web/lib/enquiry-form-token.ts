import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const TOKEN_TTL_MS = 2 * 60 * 60 * 1000;
const FUTURE_SKEW_MS = 5 * 60 * 1000;
const FIXTURE_SECRET = "phase10-fixture-enquiry-form-secret-not-production";

function secret() {
  const configured = process.env.FU_ENQUIRY_FORM_SECRET?.trim();
  if (configured) return configured;
  if (process.env.FU_PUBLIC_PROVIDER === "fixture") return FIXTURE_SECRET;
  throw new Error("FU_ENQUIRY_FORM_SECRET is required outside fixture mode");
}

function signature(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createEnquiryFormToken(now = Date.now()) {
  const issued = now.toString(36);
  const nonce = randomBytes(16).toString("base64url");
  const payload = `${issued}.${nonce}`;
  return `${payload}.${signature(payload)}`;
}

export function verifyEnquiryFormToken(token: string | null, now = Date.now()) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [issuedRaw, nonce, supplied] = parts;
  if (!issuedRaw || !nonce || !supplied) return false;

  const issued = Number.parseInt(issuedRaw, 36);
  if (!Number.isSafeInteger(issued)) return false;
  if (issued > now + FUTURE_SKEW_MS || now - issued > TOKEN_TTL_MS) return false;

  const expected = signature(`${issuedRaw}.${nonce}`);
  let suppliedBytes: Buffer;
  let expectedBytes: Buffer;
  try {
    suppliedBytes = Buffer.from(supplied, "base64url");
    expectedBytes = Buffer.from(expected, "base64url");
  } catch {
    return false;
  }
  if (suppliedBytes.length !== expectedBytes.length) return false;
  return timingSafeEqual(suppliedBytes, expectedBytes);
}

export function enquiryRateKey(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}
