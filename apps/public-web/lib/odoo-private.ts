function requiredEnv(name: "ODOO_BASE_URL" | "ODOO_DB_NAME") {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required outside fixture mode`);
  return value;
}

export function odooPrivateUrl(path: string) {
  const base = requiredEnv("ODOO_BASE_URL");
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return new URL(path.replace(/^\/+/, ""), normalizedBase);
}

export function odooPrivateFetch(input: string | URL, init: RequestInit = {}) {
  const url = typeof input === "string" ? odooPrivateUrl(input) : input;
  const headers = new Headers(init.headers);
  headers.set("X-Odoo-Database", requiredEnv("ODOO_DB_NAME"));
  return fetch(url, { ...init, headers });
}
