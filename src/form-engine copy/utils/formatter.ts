// ─── Formatters (display → store) ────────────────────────────────────────────

/** Strip commas/spaces → plain integer string */
export function parseCurrency(value: unknown): number {
  const str = String(value).replace(/[^\d]/g, "");
  return str ? Number(str) : 0;
}

/** Format number as Persian locale currency string */
export function formatCurrency(value: unknown): string {
  const n = Number(String(value).replace(/[^\d]/g, ""));
  if (isNaN(n)) return "";
  return n.toLocaleString("fa-IR");
}

/** Pascal-case text */
export function formatTitleCase(value: unknown): string {
  return String(value)
    .toLowerCase()
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

/** Trim whitespace */
export function formatTrim(value: unknown): string {
  return String(value).trim();
}

/** Uppercase */
export function formatUpperCase(value: unknown): string {
  return String(value).toUpperCase();
}

/** Lowercase */
export function formatLowerCase(value: unknown): string {
  return String(value).toLowerCase();
}

/** Registry of named formatters */
export const formatterRegistry: Record<string, (v: unknown) => unknown> = {
  currency: formatCurrency,
  titleCase: formatTitleCase,
  trim: formatTrim,
  upper: formatUpperCase,
  lower: formatLowerCase,
};

/** Registry of named parsers */
export const parserRegistry: Record<string, (v: unknown) => unknown> = {
  currency: parseCurrency,
  number: (v) => Number(v),
  string: (v) => String(v),
};

export function applyFormatter(
  value: unknown,
  formatter: string | ((v: unknown) => unknown),
): unknown {
  if (typeof formatter === "function") return formatter(value);
  const fn = formatterRegistry[formatter];
  return fn ? fn(value) : value;
}

export function applyParser(
  value: unknown,
  parser: string | ((v: unknown) => unknown),
): unknown {
  if (typeof parser === "function") return parser(value);
  const fn = parserRegistry[parser as string];
  return fn ? fn(value) : value;
}
