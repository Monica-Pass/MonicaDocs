import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fetchCommitSnapshot, resolveRepos, writeSnapshot } from "../scripts/fetch-github-commits.mjs";

const now = new Date("2026-11-01T12:00:00Z");
const commit = (sha, date = "2026-11-01T10:00:00Z", message = sha, login = "alice") => ({
  sha, author: { login }, commit: { author: { name: login, date }, committer: { name: login, date }, message },
});
const response = data => ({ ok: true, json: async () => data });

test("defaults to ten repositories and preserves explicit overrides", () => {
  const repos = resolveRepos({});
  assert.equal(repos.length, 10);
  assert.ok(repos.includes("Monica-Pass/MonicaDocs"));
  assert.deepEqual(resolveRepos({ GITHUB_COMMITS_REPO_OWNER: "x", GITHUB_COMMITS_REPO_NAME: "y" }), ["x/y"]);
  assert.deepEqual(resolveRepos({ GITHUB_COMMITS_REPOS: "a/b, c/d", GITHUB_COMMITS_REPO_NAME: "ignored" }), ["a/b", "c/d"]);
});

test("paginates, aggregates shared commits once and retains each project's recent commits", async () => {
  const requests = [];
  const firstPage = [commit("shared"), commit("automation", undefined, "chore: update github commit data", "github-actions[bot]"), ...Array.from({ length: 98 }, (_, i) => commit(`a${i}`, "2026-10-31T10:00:00Z"))];
  const fetcher = async url => {
    requests.push(url);
    if (url.includes("/a/one/")) return response(url.includes("page=2") ? [commit("newest", "2026-11-01T11:00:00Z")] : firstPage);
    return response([commit("shared"), commit("b", "2026-10-30T10:00:00Z")]);
  };
  const data = await fetchCommitSnapshot({ repos: ["a/one", "a/two"], now, fetcher });
  assert.equal(requests.length, 3);
  assert.equal(data.activity.at(-1).count, 2);
  assert.equal(data.activity.at(-2).count, 98);
  assert.equal(data.latest.filter(item => item.repo === "a/one").length, 10);
  assert.equal(data.latest.filter(item => item.sha === "shared").length, 2);
  assert.equal(data.latest[0].sha, "newest");
  assert.ok(!data.latest.some(item => item.sha === "automation"));
});

test("failed fetch leaves existing snapshot intact and unchanged data retains its timestamp", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "monica-commits-"));
  const file = path.join(dir, "snapshot.json");
  try {
    const snapshot = await fetchCommitSnapshot({ repos: ["a/one"], now, fetcher: async () => response([commit("ok")]) });
    assert.equal(writeSnapshot(snapshot, file), true);
    const original = fs.readFileSync(file, "utf8");
    assert.equal(writeSnapshot({ ...snapshot, generatedAt: "2026-11-01T13:00:00Z" }, file), false);
    assert.equal(fs.readFileSync(file, "utf8"), original);
    await assert.rejects(async () => {
      const result = await fetchCommitSnapshot({ repos: ["a/one", "a/two"], now, fetcher: async url => url.includes("/a/one/") ? response([]) : { ok: false, status: 403, statusText: "Forbidden", text: async () => "denied" } });
      writeSnapshot(result, file);
    }, /403 Forbidden/);
    assert.equal(fs.readFileSync(file, "utf8"), original);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
