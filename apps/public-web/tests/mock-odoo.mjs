import http from "node:http";

const port = Number(process.env.MOCK_ODOO_PORT || 4188);
let failing = false;
const counts = new Map();

const work = {
  en: {
    organization: { slug: "harbor-house", name: "Harbor House", sector: "Hospitality" },
    program: { slug: "service-program", title: "Service team program", summary: "Synthetic public work used for cache resilience proof." },
  },
  ar: {
    organization: { slug: "harbor-house", name: "هاربور هاوس", sector: "الضيافة" },
    program: { slug: "service-program", title: "برنامج فريق الخدمة", summary: "محتوى صناعي لإثبات مرونة التخزين المؤقت للموقع العام." },
  },
};

const catalog = {
  en: [
    { slug: "chef-jacket", name: "Chef Jacket", summary: "Synthetic hospitality garment.", sector: "Hospitality", image_url: null },
  ],
  ar: [
    { slug: "chef-jacket", name: "جاكيت شيف", summary: "قطعة ضيافة صناعية للاختبار.", sector: "الضيافة", image_url: null },
  ],
};

function project(lang) {
  const base = work[lang];
  return {
    organization: base.organization,
    program: {
      ...base.program,
      brief: base.program.summary,
      visual_skin: { accent: "#163A5F", accent_secondary: "#A84646", motif: "synthetic-line" },
    },
    cohorts: [
      { slug: "front-desk", label: lang === "ar" ? "الاستقبال" : "Front desk", tagline: "", order: 0 },
    ],
    looks: [
      { slug: "service", label: lang === "ar" ? "طقم الخدمة" : "Service set", cohorts: ["front-desk"], garments: ["chef-jacket"], order: 0 },
    ],
    garments: [
      { slug: "chef-jacket", name: lang === "ar" ? "جاكيت شيف" : "Chef Jacket", category: lang === "ar" ? "جاكيت" : "Jacket", inspection_mode: "flat", media: [] },
    ],
    media: [],
  };
}

function json(res, status, value) {
  const body = JSON.stringify(value);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);

  if (url.pathname === "/__control/fail") {
    failing = url.searchParams.get("enabled") === "1";
    return json(res, 200, { failing });
  }
  if (url.pathname === "/__control/reset") {
    failing = false;
    counts.clear();
    return json(res, 200, { ok: true });
  }
  if (url.pathname === "/__control/stats") {
    return json(res, 200, { failing, counts: Object.fromEntries(counts) });
  }

  counts.set(url.pathname, (counts.get(url.pathname) || 0) + 1);
  if (failing) return json(res, 503, { error: "synthetic_upstream_outage" });

  const lang = url.searchParams.get("lang") === "ar" ? "ar" : "en";
  if (url.pathname === "/fu/public/v2/home") return json(res, 200, { featured_work: [work[lang]] });
  if (url.pathname === "/fu/public/v2/work") return json(res, 200, { items: [work[lang]] });
  if (url.pathname === "/fu/public/v2/work/harbor-house/service-program") return json(res, 200, project(lang));
  if (url.pathname === "/fu/public/catalog") return json(res, 200, { items: catalog[lang] });
  if (url.pathname === "/fu/public/catalog/chef-jacket") return json(res, 200, catalog[lang][0]);
  return json(res, 404, { error: "not_found" });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`mock-odoo-ready:${port}`);
});

for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
