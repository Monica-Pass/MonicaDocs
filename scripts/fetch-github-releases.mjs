import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(__dirname, "..");
const outputDir = path.join(docsRoot, "public");
const outputFile = path.join(outputDir, "github-releases.json");

const DEFAULT_REPOS = [
  { id: "android", owner: "Monica-Pass", repo: "Monica", platform: "android", tagPrefix: "v" },
  { id: "ios", owner: "Monica-Pass", repo: "Monica-for-iOS", platform: "ios" },
  { id: "windows", owner: "Monica-Pass", repo: "Monica-by-Avalonia", platform: "windows" },
  { id: "browser", owner: "Monica-Pass", repo: "Monica-for-Extension", platform: "browser" },
  { id: "cli", owner: "Monica-Pass", repo: "Monica-cli", platform: "cli" },
];

const API_BASE = process.env.GITHUB_API_BASE || "https://api.github.com";
const perRepoLimit = Number(process.env.GITHUB_RELEASES_PER_REPO ?? "10");
const includePrerelease = process.env.GITHUB_RELEASES_INCLUDE_PRERELEASE !== "false";

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "MonicaDocs-GitHub-Releases-Updater",
  "X-GitHub-Api-Version": "2022-11-28",
};
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

function resolveRepos() {
  const override = process.env.GITHUB_RELEASES_REPOS;
  if (!override) return DEFAULT_REPOS;

  return override
    .split(",")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const [owner, repo] = pair.split("/");
      const lower = repo.toLowerCase();
      let platform = "android";
      if (lower.includes("ios")) platform = "ios";
      else if (lower.includes("avalonia") || lower.includes("windows")) platform = "windows";
      else if (lower.includes("extension") || lower.includes("browser")) platform = "browser";
      else if (lower.includes("cli")) platform = "cli";
      return { id: repo, owner, repo, platform };
    });
}

async function fetchJson(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}\n${body}`);
  }
  return response.json();
}

export async function fetchReleases(repo) {
  const releases = [];
  for (let page = 1; releases.length < perRepoLimit; page += 1) {
    const params = new URLSearchParams({ per_page: "100", page: String(page) });
    const list = await fetchJson(`${API_BASE}/repos/${repo.owner}/${repo.repo}/releases?${params}`);

    for (const item of list) {
      if (item.draft) continue;
      if (item.prerelease && !includePrerelease) continue;
      if (repo.tagPrefix && !String(item.tag_name || "").toLowerCase().startsWith(repo.tagPrefix.toLowerCase())) continue;

      releases.push({
        tag: item.tag_name || "",
        prerelease: item.prerelease === true,
        name: item.name || item.tag_name || "",
        body: item.body || "",
        publishedAt: item.published_at || item.created_at || "",
        htmlUrl: item.html_url || "",
        assets: (item.assets || []).map((asset) => ({
          name: asset.name || "",
          size: asset.size || 0,
          downloadCount: asset.download_count || 0,
          url: asset.browser_download_url || "",
          contentType: asset.content_type || "",
        })),
      });
    }

    if (list.length < 100) break;
  }

  releases.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  return releases.slice(0, perRepoLimit);
}

async function main() {
  const repos = resolveRepos();
  const data = { updatedAt: new Date().toISOString(), repos: [] };

  let failed = false;
  for (const repo of repos) {
    try {
      const releases = await fetchReleases(repo);
      data.repos.push({
        id: repo.id,
        owner: repo.owner,
        repo: repo.repo,
        url: `https://github.com/${repo.owner}/${repo.repo}`,
        platform: repo.platform,
        releases,
      });
      console.log(`[ok] ${repo.owner}/${repo.repo}: ${releases.length} releases`);
    } catch (error) {
      failed = true;
      console.error(`[error] Failed to process ${repo.owner}/${repo.repo}: ${error.message}`);
    }
  }

  if (failed) throw new Error("Release sync failed; existing snapshot was preserved.");
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Wrote GitHub release data to ${path.relative(process.cwd(), outputFile)}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await main();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
