import type { MetadataRoute } from "next";

function origin() {
  const configured = process.env.PUBLIC_SITE_ORIGIN?.trim() || "https://faresuniform.uk";
  return configured.replace(/\/+$/, "");
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${origin()}/sitemap.xml`,
  };
}
