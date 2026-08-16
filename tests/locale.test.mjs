import test from "node:test";
import assert from "node:assert/strict";

import {
  detectBrowserLocale,
  getDefaultLocaleRelativePath,
  getLocaleFromPath,
  getLocalePath,
  normalizeBasePath,
  resolveInitialLocale,
} from "../.vitepress/theme/locale.mjs";

test("normalizes deployment base paths and builds locale URLs", () => {
  assert.equal(normalizeBasePath("MonicaDocs"), "/MonicaDocs/");
  assert.equal(getLocalePath("en-US", "/MonicaDocs/"), "/MonicaDocs/en/");
  assert.equal(getLocalePath("zh-CN", "/"), "/");
  assert.equal(getLocaleFromPath("/MonicaDocs/ja", "/MonicaDocs/"), "ja-JP");
  assert.equal(getDefaultLocaleRelativePath("/MonicaDocs", "/MonicaDocs/"), "");
  assert.equal(getDefaultLocaleRelativePath("/MonicaDocs/guide/intro.html", "/MonicaDocs/"), "guide/intro.html");
  assert.equal(getDefaultLocaleRelativePath("/MonicaDocs/en/guide/intro.html", "/MonicaDocs/"), undefined);
});

test("matches the first supported browser language", () => {
  assert.equal(
    detectBrowserLocale({ languages: ["fr-FR", "ja-JP", "en-US"], language: "fr-FR" }),
    "ja-JP",
  );
  assert.equal(detectBrowserLocale({ languages: ["zh_Hant-TW"], language: "en-US" }), "zh-CN");
  assert.equal(detectBrowserLocale({ languages: [], language: "ru-RU" }), "ru-RU");
  assert.equal(detectBrowserLocale({ languages: ["fr-FR"], language: "fr-FR" }), undefined);
});

test("prefers a supported browser language over a saved preference", () => {
  assert.equal(resolveInitialLocale("en-US", "ja-JP"), "ja-JP");
  assert.equal(resolveInitialLocale("en-US", undefined), "en-US");
  assert.equal(resolveInitialLocale("unsupported", "ja-JP"), "ja-JP");
  assert.equal(resolveInitialLocale(null, undefined), undefined);
});
