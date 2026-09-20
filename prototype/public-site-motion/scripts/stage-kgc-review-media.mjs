import { createHash, createSign } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const assets = [
  ["1-7KJddf0GBi48waU0zOfb_qQpF7FApmm", "kindergarten-summer.png"],
  ["1I5xEnC_plLnTwVnqBdrcja9l9lkSpVDa", "primary-summer.png"],
  ["1le12chTbBteOrrVIxy0D3hWUsGioY-xC", "middle-summer.png"],
  ["1x69utNsIog_mDU1KV-BrZ7yrIhDAyGwV", "high-summer.png"],
  ["17z5LpOTT0-RqoxvKoa82LEb3E6SA3G1c", "high-summer-polo-front.png"],
  ["14oTbQ4pyLzxu-2LKs6eZamSqQiasHozV", "high-summer-polo-back.png"],
];

const rawCredentials = process.env.PHASE9_KGC_REVIEW_GOOGLE_CREDENTIALS;
if (!rawCredentials) {
  throw new Error("PHASE9_KGC_REVIEW_GOOGLE_CREDENTIALS is required for private D-053 KGC review media staging.");
}

let credentials;
try {
  credentials = JSON.parse(rawCredentials);
} catch {
  throw new Error("PHASE9_KGC_REVIEW_GOOGLE_CREDENTIALS must contain valid service-account JSON.");
}

if (!credentials.client_email || !credentials.private_key) {
  throw new Error("Review credentials must include client_email and private_key.");
}

const tokenUri = credentials.token_uri || "https://oauth2.googleapis.com/token";
const now = Math.floor(Date.now() / 1000);
const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
const header = encode({ alg: "RS256", typ: "JWT" });
const claims = encode({
  iss: credentials.client_email,
  scope: "https://www.googleapis.com/auth/drive.readonly",
  aud: tokenUri,
  iat: now,
  exp: now + 3600,
});
const unsigned = `${header}.${claims}`;
const signer = createSign("RSA-SHA256");
signer.update(unsigned);
signer.end();
const assertion = `${unsigned}.${signer.sign(credentials.private_key).toString("base64url")}`;

const tokenResponse = await fetch(tokenUri, {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  }),
});
if (!tokenResponse.ok) {
  throw new Error(`Google OAuth token request failed with HTTP ${tokenResponse.status}.`);
}
const tokenPayload = await tokenResponse.json();
if (!tokenPayload.access_token) {
  throw new Error("Google OAuth response did not contain an access token.");
}

const outputDir = path.join(process.cwd(), "public", "review-media", "kgc");
const artifactDir = path.join(process.cwd(), "artifacts");
await mkdir(outputDir, { recursive: true });
await mkdir(artifactDir, { recursive: true });

const provenance = [];
for (const [fileId, fileName] of assets) {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`, {
    headers: { authorization: `Bearer ${tokenPayload.access_token}` },
  });
  if (!response.ok) {
    throw new Error(`Drive download failed for ${fileName} with HTTP ${response.status}.`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) {
    throw new Error(`Drive returned non-image content for ${fileName}: ${contentType || "unknown"}.`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 100_000 || bytes.length > 10_000_000) {
    throw new Error(`Unexpected byte size for ${fileName}: ${bytes.length}.`);
  }

  const digest = createHash("sha256").update(bytes).digest("hex");
  await writeFile(path.join(outputDir, fileName), bytes);
  provenance.push({ fileId, fileName, bytes: bytes.length, sha256: digest });
  console.log(`Staged ${fileName} (${bytes.length} bytes, sha256:${digest}).`);
}

await writeFile(
  path.join(artifactDir, "kgc-review-media-provenance.json"),
  JSON.stringify({ source: "private Google Drive via D-053 review-only runner staging", assets: provenance }, null, 2) + "\n",
);
