import test from "node:test";
import assert from "node:assert/strict";
import { fetchReleases } from "../scripts/fetch-github-releases.mjs";

test("paginates, filters drafts, retains prereleases and limits sorted results", async () => {
  const previousFetch = globalThis.fetch;
  const item = (i, extra = {}) => ({
    tag_name: `v${i}`, published_at: `2026-01-${String(i).padStart(2, "0")}T00:00:00Z`,
    assets: [], ...extra,
  });
  const pages = [
    [item(1), item(2, { prerelease: true }), ...Array.from({ length: 98 }, (_, i) => item(i + 1, { draft: true }))],
    Array.from({ length: 10 }, (_, i) => item(i + 3)),
  ];
  let requests = 0;
  globalThis.fetch = async () => ({ ok: true, json: async () => pages[requests++] });
  try {
    const releases = await fetchReleases({ owner: "owner", repo: "repo" });
    assert.equal(requests, 2);
    assert.equal(releases.length, 10);
    assert.deepEqual(releases.map((release) => release.tag), Array.from({ length: 10 }, (_, i) => `v${12 - i}`));
    assert.equal(releases.at(-1).prerelease, false);
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test("preserves prerelease status and skips drafts", async () => {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: true, json: async () => [
    { tag_name: "v1", published_at: "2026-01-01", prerelease: true },
    { tag_name: "draft", draft: true },
  ] });
  try {
    const releases = await fetchReleases({ owner: "owner", repo: "repo" });
    assert.equal(releases.length, 1);
    assert.equal(releases[0].prerelease, true);
  } finally {
    globalThis.fetch = previousFetch;
  }
});
