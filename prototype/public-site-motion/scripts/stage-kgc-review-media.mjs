import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const assets = [
  ["1-7KJddf0GBi48waU0zOfb_qQpF7FApmm", "kgc/review/kindergarten-summer.png", "kindergarten-summer.png", 1567756, "c479be57cc8ffa0ed170c8453420f99cb4d9fa3969a53141b81730e9830a1e35"],
  ["1I5xEnC_plLnTwVnqBdrcja9l9lkSpVDa", "kgc/review/primary-summer.png", "primary-summer.png", 1566281, "df47288be770489c702ff4de298556e74e0233abaa042f2355ef634cb4bcaa8e"],
  ["1le12chTbBteOrrVIxy0D3hWUsGioY-xC", "kgc/review/middle-summer.png", "middle-summer.png", 1576808, "9d87d962941f1ff921c448405382ccbde661a64b874d8f262407cb25e54ed1a1"],
  ["1x69utNsIog_mDU1KV-BrZ7yrIhDAyGwV", "kgc/review/high-summer.png", "high-summer.png", 1590254, "c7a38596770d069f41a27c0d2f6dfb9f8f877a7a82e7b001b892d198183a8fbb"],
  ["17z5LpOTT0-RqoxvKoa82LEb3E6SA3G1c", "kgc/review/high-summer-polo-front.png", "high-summer-polo-front.png", 2069587, "38b26d959b98331d6944fcbcfaa84b418ac39d7cb24743752cc7357893dcb587"],
  ["14oTbQ4pyLzxu-2LKs6eZamSqQiasHozV", "kgc/review/high-summer-polo-back.png", "high-summer-polo-back.png", 1887466, "a38bffa2cadfd20bee2cf948a8f4f86b3d4f4d185a262577a9f3f2139709a5b7"],
];

const outputDir = path.join(process.cwd(), "public", "review-media", "kgc");
const artifactDir = path.join(process.cwd(), "artifacts");
await mkdir(artifactDir, { recursive: true });

const provenance = [];
for (const [driveId, objectKey, fileName, expectedBytes, expectedSha256] of assets) {
  const bytes = await readFile(path.join(outputDir, fileName));
  if (bytes.length !== expectedBytes) {
    throw new Error(`Unexpected byte size for ${fileName}: expected ${expectedBytes}, got ${bytes.length}.`);
  }
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (digest !== expectedSha256) {
    throw new Error(`SHA-256 mismatch for ${fileName}: expected ${expectedSha256}, got ${digest}.`);
  }

  provenance.push({
    driveId,
    objectKey,
    fileName,
    bytes: bytes.length,
    sha256: digest,
  });
  console.log(`Verified ${fileName} (${bytes.length} bytes, sha256:${digest}).`);
}

await writeFile(
  path.join(artifactDir, "kgc-review-media-provenance.json"),
  JSON.stringify({
    source: "private Cloudflare R2 via D-054 hosted review staging",
    bucket: "fares-uniform-media-private",
    assets: provenance,
  }, null, 2) + "\n",
);
