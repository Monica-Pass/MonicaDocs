import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const outputFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public/github-commits.json");
const defaultRepos = [
  "Monica", "Mdbx", "Monica-by-Avalonia", "Monica-for-iOS", "Monica-Cloud",
  "Monica-for-Extension", "MonicaDocs", "Monica-CE", "Monica-Fdroid", "Monica-cli",
].map(name => `Monica-Pass/${name}`);
const ignoredAutomationMessages = new Set([
  "chore: update github commit data", "chore: update github release data", "Update contributor flag SVG",
]);

export function resolveRepos(env = process.env) {
  if (env.GITHUB_COMMITS_REPOS) return env.GITHUB_COMMITS_REPOS.split(",").map(value => value.trim()).filter(Boolean);
  if (env.GITHUB_COMMITS_REPO_OWNER || env.GITHUB_COMMITS_REPO_NAME) {
    return [`${env.GITHUB_COMMITS_REPO_OWNER || "Monica-Pass"}/${env.GITHUB_COMMITS_REPO_NAME || "Monica"}`];
  }
  return defaultRepos;
}

export async function fetchCommitSnapshot({ repos = resolveRepos(), now = new Date(), fetcher = fetch, token = process.env.GITHUB_TOKEN, apiBase = "https://api.github.com" } = {}) {
  if (!repos.length || repos.some(repo => !/^[\w.-]+\/[\w.-]+$/.test(repo))) throw new Error("Invalid GitHub repository list");
  const today = startOfUtcDay(now);
  const from = addDays(today, -364);
  const until = addDays(today, 1);
  const activity = createActivityRange(from, today);
  const activityByDate = new Map(activity.map(day => [day.date, day]));
  const seenByDate = new Set();
  const latest = [];
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "MonicaDocs-GitHub-Commits-Updater", "X-GitHub-Api-Version": "2022-11-28" };
  if (token) headers.Authorization = `Bearer ${token}`;

  for (const repo of repos) {
    const repoLatest = [];
    for (let page = 1; ; page += 1) {
      const params = new URLSearchParams({ per_page: "100", page: String(page), since: from.toISOString(), until: until.toISOString() });
      const response = await fetcher(`${apiBase}/repos/${repo}/commits?${params}`, { headers });
      if (!response.ok) throw new Error(`GitHub API request failed for ${repo}: ${response.status} ${response.statusText}\n${await response.text()}`);
      const commits = await response.json();
      if (!Array.isArray(commits)) throw new Error(`Invalid commit response for ${repo}`);
      for (const commit of commits) {
        if (shouldIgnoreCommit(commit)) continue;
        const date = commit.commit?.author?.date || commit.commit?.committer?.date || "";
        const timestamp = Date.parse(date);
        const dayKey = Number.isFinite(timestamp) ? new Date(timestamp).toISOString().slice(0, 10) : "";
        const activityKey = `${dayKey}:${commit.sha}`;
        if (activityByDate.has(dayKey) && commit.sha && !seenByDate.has(activityKey)) {
          activityByDate.get(dayKey).count += 1;
          seenByDate.add(activityKey);
        }
        repoLatest.push(toLatestCommit(commit, repo));
      }
      if (commits.length < 100) break;
    }
    repoLatest.sort(compareCommits);
    latest.push(...repoLatest.slice(0, 10));
  }
  latest.sort(compareCommits);
  const label = repos.length === 1 ? repos[0] : "Monica-Pass";
  return { repo: label, repoUrl: `https://github.com/${label}`, repos, generatedAt: now.toISOString(), range: { from: formatDate(from), to: formatDate(today) }, activity, latest };
}

export function writeSnapshot(data, file = outputFile) {
  let existing;
  try { existing = JSON.parse(fs.readFileSync(file, "utf8")); } catch (error) { if (error.code !== "ENOENT" && !(error instanceof SyntaxError)) throw error; }
  if (existing) {
    const { generatedAt: _old, ...previous } = existing;
    const { generatedAt: _new, ...next } = data;
    if (JSON.stringify(previous) === JSON.stringify(next)) return false;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  try {
    fs.writeFileSync(temporary, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    fs.renameSync(temporary, file);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
  return true;
}

function compareCommits(a, b) { return b.date.localeCompare(a.date) || a.repo.localeCompare(b.repo) || a.sha.localeCompare(b.sha); }

function toLatestCommit(commit, repo) {
  const sha = commit.sha || "";
  const author = commit.author || commit.commit?.author || {};
  const commitAuthor = commit.commit?.author || {};
  return {
    sha, shortSha: sha.slice(0, 7), repo,
    message: firstLine(commit.commit?.message || ""),
    authorName: author.login || commitAuthor.name || "Unknown",
    authorAvatar: author.avatar_url || "",
    date: commitAuthor.date || commit.commit?.committer?.date || "",
    url: commit.html_url || `https://github.com/${repo}/commit/${sha}`,
  };
}
function shouldIgnoreCommit(commit) {
  const message = firstLine(commit.commit?.message || "").trim();
  return ignoredAutomationMessages.has(message) && [commit.author?.login, commit.committer?.login, commit.commit?.committer?.name].includes("github-actions[bot]");
}
function firstLine(value) { return value.split(/\r?\n/, 1)[0]; }
function createActivityRange(start, end) {
  const days = [];
  for (let date = new Date(start); date <= end; date = addDays(date, 1)) days.push({ date: formatDate(date), count: 0 });
  return days;
}
function startOfUtcDay(value) { return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate())); }
function addDays(value, days) { const date = new Date(value); date.setUTCDate(date.getUTCDate() + days); return date; }
function formatDate(value) { return value.toISOString().slice(0, 10); }

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const data = await fetchCommitSnapshot();
    console.log(writeSnapshot(data) ? `Wrote GitHub commit data to ${outputFile}` : "GitHub commit data unchanged.");
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
