export const supportedLocales = [
  { code: "zh-CN", path: "/", language: "zh" },
  { code: "en-US", path: "/en/", language: "en" },
  { code: "ja-JP", path: "/ja/", language: "ja" },
  { code: "ru-RU", path: "/ru/", language: "ru" },
  { code: "vi-VN", path: "/vi/", language: "vi" },
];

export function normalizeBasePath(basePath = "/") {
  const value = String(basePath || "/");
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export function getLocalePath(locale, basePath = "/") {
  const base = normalizeBasePath(basePath);
  const target = supportedLocales.find((item) => item.code === locale) ?? supportedLocales[0];
  return target.path === "/" ? base : `${base}${target.path.slice(1)}`;
}

export function getLocaleFromPath(pathname, basePath = "/") {
  const normalizedPath = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return supportedLocales.find((locale) => normalizedPath === getLocalePath(locale.code, basePath))?.code;
}

export function getDefaultLocaleRelativePath(pathname, basePath = "/") {
  const base = normalizeBasePath(basePath);
  const baseWithoutTrailingSlash = base.slice(0, -1) || "/";

  if (pathname === baseWithoutTrailingSlash) return "";
  if (!pathname.startsWith(base)) return undefined;

  const relativePath = pathname.slice(base.length);
  const isLocalizedPath = supportedLocales.some((locale) => {
    if (locale.path === "/") return false;
    const prefix = locale.path.slice(1);
    return relativePath === prefix.slice(0, -1) || relativePath.startsWith(prefix);
  });

  return isLocalizedPath ? undefined : relativePath;
}

const getLanguageCode = (value) => String(value || "").trim().toLowerCase().replaceAll("_", "-").split("-")[0];

export function detectBrowserLocale(navigatorLike = globalThis.navigator) {
  if (!navigatorLike) return undefined;

  const languages = Array.isArray(navigatorLike.languages) && navigatorLike.languages.length
    ? navigatorLike.languages
    : [navigatorLike.language];

  for (const language of languages) {
    const languageCode = getLanguageCode(language);
    const match = supportedLocales.find((locale) => locale.language === languageCode);
    if (match) return match.code;
  }

  return undefined;
}

export function resolveInitialLocale(storedLocale, browserLocale) {
  const storedIsSupported = supportedLocales.some((locale) => locale.code === storedLocale);
  return browserLocale ?? (storedIsSupported ? storedLocale : undefined);
}
