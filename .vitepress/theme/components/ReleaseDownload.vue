<script lang="ts">
import MarkdownIt from "markdown-it";

type LocaleKey = "zh" | "en" | "ja" | "ru" | "vi";

type ReleaseAsset = {
  name: string;
  size: number;
  downloadCount: number;
  url: string;
  contentType: string;
};

type Release = {
  tag: string;
  name: string;
  publishedAt: string;
  htmlUrl: string;
  assets: ReleaseAsset[];
  body: string;
};

type RepoEntry = {
  id: string;
  owner: string;
  repo: string;
  url: string;
  platform: string;
  releases: Release[];
};

type ReleasesData = {
  updatedAt: string;
  repos: RepoEntry[];
};

type LocaleText = {
  title: string;
  kicker: string;
  description: string;
  updated: string;
  loading: string;
  unavailable: string;
  noData: string;
  retry: string;
  latest: string;
  download: string;
  viewOnGitHub: string;
  published: string;
  changelog: string;
  noAssets: string;
  assets: string;
  downloads: string;
  statRepos: string;
  repoLabels: Record<string, string>;
};
const SHARED_REPO_LABELS: Record<string, string> = {
  android: "Monica for Android",
  ios: "Monica for iOS",
  windows: "Monica by Avalonia",
  browser: "Monica for Browser",
};
const SUPPORTED_LOCALES = new Set<LocaleKey>(["zh", "en", "ja", "vi", "ru"]);
const CHECKSUM_PATTERN = /\.(sha256|sha1|sha512|md5|asc|sig|sum|txt)$/i;
const DEBUG_ASSET_PATTERN = /\b(debug|test|staging)\b|\.pdb|mapping|proguard|symbols|sources|-dbg/i;
const INSTALLER_EXT_PATTERN = /\.(apk|aab|ipa|exe|msi|msix|dmg|pkg|deb|rpm|appimage|crx|xapk)$/i;
const PREFERRED_ARCH_PATTERN = /(arm64|aarch64|x64|x86_64|amd64|universal|fat)/i;
type DeviceArch = "arm64" | "arm" | "x64" | "x86";
const ASSET_ARCH_RULES: Array<[RegExp, DeviceArch]> = [
  [/arm64|aarch64|armv8/i, "arm64"],
  [/x86_64|x64|amd64/i, "x64"],
  [/i686|i386|\bx86\b/i, "x86"],
  [/armeabi|armv7|armhf/i, "arm"],
];
function detectDeviceArch(): DeviceArch | null {
  if (typeof navigator === "undefined") return null;
  const probe = `${navigator.userAgent} ${navigator.platform}`;
  for (const [pattern, arch] of ASSET_ARCH_RULES) {
    if (pattern.test(probe)) return arch;
  }
  return null;
}
function mapUaDataToArch(architecture?: string, bitness?: string): DeviceArch | null {
  const arch = architecture?.toLowerCase();
  const bits = bitness === "64" ? "64" : bitness === "32" ? "32" : "";
  if (arch === "arm") return bits === "32" ? "arm" : "arm64";
  if (arch === "x86") return bits === "32" ? "x86" : "x64";
  return null;
}
function assetMatchesArch(name: string, arch: DeviceArch): boolean {
  for (const [pattern, ruleArch] of ASSET_ARCH_RULES) {
    if (pattern.test(name)) return ruleArch === arch;
  }
  return false;
}

const md = new MarkdownIt({ html: false, linkify: true });
const SAFE_HREF_PATTERN = /^(https?:)?\/\/|^#|^\//i;

function isSafeHref(href: string): boolean {
  return SAFE_HREF_PATTERN.test(href.trim());
}

const defaultLinkOpen = md.renderer.rules.link_open;
md.renderer.rules.link_open = (tokens, idx, options, _env, self) => {
  const href = tokens[idx].attrGet("href") ?? "";
  if (isSafeHref(href)) {
    tokens[idx].attrSet("rel", "noopener noreferrer nofollow");
  } else {
    tokens[idx].attrSet("href", "#");
    tokens[idx].attrSet("aria-disabled", "true");
  }
  return defaultLinkOpen ? defaultLinkOpen(tokens, idx, options, _env, self) : self.renderToken(tokens, idx, options);
};

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  const digits = index === 0 ? 0 : value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(digits)} ${units[index]}`;
}

function formatCount(count: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale).format(count || 0);
  } catch {
    return String(count || 0);
  }
}
function formatDate(value: string, locale: string, withTime = false): string {
  if (!value) return "";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  };
  return new Intl.DateTimeFormat(locale, options).format(new Date(value));
}

function pickPrimaryAsset(release: Release | null, userArch: DeviceArch | null = null): ReleaseAsset | null {
  if (!release?.assets?.length) return null;
  const usable = release.assets.filter(
    (asset) => asset.url && !CHECKSUM_PATTERN.test(asset.name) && !DEBUG_ASSET_PATTERN.test(asset.name)
  );
  if (!usable.length) {
    return release.assets.find((asset) => asset.url) ?? release.assets[0] ?? null;
  }
  const installers = usable.filter((asset) => INSTALLER_EXT_PATTERN.test(asset.name));
  const pool = installers.length ? installers : usable;
  if (userArch) {
    const matched = pool.filter((asset) => assetMatchesArch(asset.name, userArch));
    if (matched.length) {
      return matched.reduce((max, asset) => (asset.size > max.size ? asset : max));
    }
  }
  const preferred = pool.filter((asset) => PREFERRED_ARCH_PATTERN.test(asset.name));
  const finalPool = preferred.length ? preferred : pool;
  return finalPool.reduce((max, asset) => (asset.size > max.size ? asset : max));
}

function repoPlatformIcon(repo: RepoEntry): string {
  const lower = repo.id.toLowerCase();
  if (lower.includes("ios")) return "ri-apple-fill";
  if (lower.includes("browser") || lower.includes("extension")) return "ri-global-line";
  if (lower.includes("avalonia") || lower.includes("window")) return "ri-windows-fill";
  if (lower.includes("android")) return "ri-android-fill";
  return "ri-key-2-fill";
}

function renderMarkdown(source: string): string {
  return md.render(source || "");
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseReleasesData(input: unknown): ReleasesData | null {
  if (!isRecord(input) || !Array.isArray(input.repos)) return null;

  const repos: RepoEntry[] = [];
  for (const entry of input.repos) {
    if (!isRecord(entry)) continue;

    const releases: Release[] = [];
    if (Array.isArray(entry.releases)) {
      for (const item of entry.releases) {
        if (!isRecord(item) || typeof item.tag !== "string") continue;

        const assets: ReleaseAsset[] = [];
        if (Array.isArray(item.assets)) {
          for (const asset of item.assets) {
            if (!isRecord(asset) || typeof asset.name !== "string" || typeof asset.url !== "string") continue;
            assets.push({
              name: asset.name,
              size: typeof asset.size === "number" ? asset.size : 0,
              downloadCount: typeof asset.downloadCount === "number" ? asset.downloadCount : 0,
              url: asset.url,
              contentType: typeof asset.contentType === "string" ? asset.contentType : "",
            });
          }
        }

        releases.push({
          tag: item.tag,
          name: typeof item.name === "string" ? item.name : item.tag,
          body: typeof item.body === "string" ? item.body : "",
          publishedAt: typeof item.publishedAt === "string" ? item.publishedAt : "",
          htmlUrl: typeof item.htmlUrl === "string" ? item.htmlUrl : "",
          assets,
        });
      }
    }

    if (typeof entry.id !== "string" || !entry.id) continue;
    repos.push({
      id: entry.id,
      owner: typeof entry.owner === "string" ? entry.owner : "",
      repo: typeof entry.repo === "string" ? entry.repo : "",
      url: typeof entry.url === "string" ? entry.url : "",
      platform: typeof entry.platform === "string" ? entry.platform : "",
      releases,
    });
  }

  return { updatedAt: typeof input.updatedAt === "string" ? input.updatedAt : "", repos };
}

const releaseUtils = {
  formatBytes,
  formatCount,
  formatDate,
  pickPrimaryAsset,
  repoPlatformIcon,
  renderMarkdown,
};
</script>

<script setup lang="ts" name="ReleaseDownload">
import { computed, onMounted, ref, shallowRef } from "vue";
import { useData, withBase } from "vitepress";
const { formatBytes, formatCount, formatDate, pickPrimaryAsset, repoPlatformIcon, renderMarkdown } = releaseUtils;
const data = shallowRef<ReleasesData | null>(null);
const loading = ref(true);
const failed = ref(false);
const activeRepoId = ref<string | null>(null);
const { lang } = useData();

const localeText: Record<LocaleKey, LocaleText> = {
  zh: {
    title: "下载",
    kicker: "Release",
    description: "从 GitHub Releases 获取最新版本与安装包，自动同步各平台更新日志。",
    updated: "更新于",
    loading: "正在加载发布信息...",
    unavailable: "发布数据暂不可用。",
    noData: "暂无发布数据。",
    retry: "重试",
    latest: "最新版本",
    download: "下载",
    viewOnGitHub: "在 GitHub 上查看",
    published: "发布于",
    changelog: "更新日志",
    noAssets: "该版本无可用安装包",
    assets: "安装包",
    downloads: "次下载",
    statRepos: "平台",
    repoLabels: SHARED_REPO_LABELS,
  },
  en: {
    title: "Download",
    kicker: "Release",
    description: "Get the latest builds from GitHub Releases, with changelogs synced for every platform.",
    updated: "Updated",
    loading: "Loading releases...",
    unavailable: "Release data is unavailable.",
    noData: "No release data yet.",
    retry: "Retry",
    latest: "Latest",
    download: "Download",
    viewOnGitHub: "View on GitHub",
    published: "Published",
    changelog: "Changelog",
    noAssets: "No assets for this release",
    assets: "Assets",
    downloads: "downloads",
    statRepos: "Platforms",
    repoLabels: SHARED_REPO_LABELS,
  },
  ja: {
    title: "ダウンロード",
    kicker: "リリース",
    description: "GitHub Releases から最新版と各プラットフォームの更新履歴を自動取得できます。",
    updated: "更新",
    loading: "リリース情報を読み込み中...",
    unavailable: "リリースデータを利用できません。",
    noData: "リリースデータはまだありません。",
    retry: "再試行",
    latest: "最新バージョン",
    download: "ダウンロード",
    viewOnGitHub: "GitHub で見る",
    published: "公開日",
    changelog: "更新履歴",
    noAssets: "このリリースにアセットはありません",
    assets: "アセット",
    downloads: "ダウンロード",
    statRepos: "プラットフォーム",
    repoLabels: SHARED_REPO_LABELS,
  },
  ru: {
    title: "Скачать",
    kicker: "Релиз",
    description: "Получайте последние сборки из GitHub Releases с журналами изменений для всех платформ.",
    updated: "Обновлено",
    loading: "Загрузка релизов...",
    unavailable: "Данные релизов недоступны.",
    noData: "Данных о релизах пока нет.",
    retry: "Повторить",
    latest: "Последняя версия",
    download: "Скачать",
    viewOnGitHub: "Смотреть на GitHub",
    published: "Опубликовано",
    changelog: "Журнал изменений",
    noAssets: "В этом релизе нет файлов",
    assets: "Файлы",
    downloads: "загрузок",
    statRepos: "Платформ",
    repoLabels: SHARED_REPO_LABELS,
  },
  vi: {
    title: "Tải xuống",
    kicker: "Phát hành",
    description: "Tải các bản phát hành mới nhất từ GitHub Releases kèm nhật ký thay đổi của từng nền tảng.",
    updated: "Cập nhật",
    loading: "Đang tải bản phát hành...",
    unavailable: "Dữ liệu bản phát hành không khả dụng.",
    noData: "Chưa có dữ liệu bản phát hành.",
    retry: "Thử lại",
    latest: "Phiên bản mới nhất",
    download: "Tải xuống",
    viewOnGitHub: "Xem trên GitHub",
    published: "Đăng lúc",
    changelog: "Nhật ký thay đổi",
    noAssets: "Không có tệp cho bản phát hành này",
    assets: "Tệp",
    downloads: "lượt tải",
    statRepos: "Nền tảng",
    repoLabels: SHARED_REPO_LABELS,
  },
};

const localeKey = computed<LocaleKey>(() => {
  const primary = lang.value.split("-")[0].toLowerCase();
  return SUPPORTED_LOCALES.has(primary as LocaleKey) ? (primary as LocaleKey) : "en";
});

const text = computed(() => localeText[localeKey.value]);
const dateLocale = computed(() => lang.value || "en-US");

const repos = computed(() => data.value?.repos ?? []);
const activeRepo = computed(
  () => repos.value.find((repo) => repo.id === activeRepoId.value) ?? repos.value[0] ?? null
);
const latestRelease = computed(() => activeRepo.value?.releases?.[0] ?? null);
const olderReleases = computed(() => activeRepo.value?.releases?.slice(1) ?? []);
const deviceArch = ref<DeviceArch | null>(detectDeviceArch());
if (typeof navigator !== "undefined") {
  const navWithHints = navigator as Navigator & {
    userAgentData?: {
      getHighEntropyValues(hints: string[]): Promise<{ architecture?: string; bitness?: string }>;
    };
  };
  navWithHints.userAgentData
    ?.getHighEntropyValues(["architecture", "bitness"])
    .then(({ architecture, bitness }) => {
      const refined = mapUaDataToArch(architecture, bitness);
      if (refined) deviceArch.value = refined;
    })
    .catch(() => {
    });
}
const primaryAsset = computed(() => pickPrimaryAsset(latestRelease.value, deviceArch.value));
const latestTag = computed(() => {
  const latest = repos.value.flatMap((repo) => repo.releases).reduce<Release | null>(
    (max, release) => (!max || release.publishedAt > max.publishedAt ? release : max),
    null
  );
  return latest?.tag ?? "--";
});

function repoLabel(repo: RepoEntry): string {
  const labels = text.value.repoLabels;
  return labels[repo.id] || labels[repo.platform] || repo.repo;
}

async function load() {
  loading.value = true;
  failed.value = false;
  try {
    const response = await fetch(withBase("/github-releases.json"));
    if (!response.ok) throw new Error(`Failed to load GitHub releases: ${response.status}`);
    const parsed = parseReleasesData(await response.json());
    if (!parsed) {
      failed.value = true;
      console.error("GitHub releases data has an unexpected shape");
    }
    data.value = parsed;
    const repos = data.value?.repos ?? [];
    if (repos.length) {
      const isValid = repos.some((repo) => repo.id === activeRepoId.value);
      if (!isValid) activeRepoId.value = repos[0].id;
    }
  } catch (error) {
    failed.value = true;
    console.error(error);
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <section class="release-download" aria-labelledby="release-download-title">
    <header class="rd-header">
      <div class="rd-header__main">
        <span class="rd-kicker">{{ text.kicker }}</span>
        <h1 id="release-download-title">{{ text.title }}</h1>
        <p class="rd-desc">{{ text.description }}</p>
        <p v-if="data?.updatedAt" class="rd-updated">{{ text.updated }} {{ formatDate(data.updatedAt, dateLocale, true) }}</p>
      </div>

      <dl class="rd-stats" aria-label="Release statistics">
        <div>
          <i class="rd-stat__icon ri-stack-line" aria-hidden="true"></i>
          <dt>{{ text.statRepos }}</dt>
          <dd>{{ repos.length }}</dd>
        </div>
        <div>
          <i class="rd-stat__icon ri-fire-line" aria-hidden="true"></i>
          <dt>{{ text.latest }}</dt>
          <dd>{{ latestTag }}</dd>
        </div>
      </dl>
    </header>

    <div class="rd-content">
      <div v-if="loading" class="rd-state">{{ text.loading }}</div>

      <div v-else-if="failed || !data" class="rd-state">
        <p>{{ text.unavailable }}</p>
        <button type="button" class="rd-retry" @click="load">{{ text.retry }}</button>
      </div>

      <template v-else>
        <div v-if="!repos.length" class="rd-state">{{ text.noData }}</div>

        <template v-else>
          <div class="rd-tabs" role="tablist" aria-label="Repository">
            <button
              v-for="repo in repos"
              :key="repo.id"
              type="button"
              role="tab"
              class="rd-tab"
              :class="{ 'is-active': activeRepo?.id === repo.id }"
              :aria-selected="activeRepo?.id === repo.id"
              @click="activeRepoId = repo.id"
            >
              <i
                class="rd-tab__icon"
                :class="repoPlatformIcon(repo)"
                aria-hidden="true"
              />
              {{ repoLabel(repo) }}
            </button>
          </div>

          <div role="tabpanel">
            <div v-if="activeRepo && !activeRepo.releases.length" class="rd-state">{{ text.noData }}</div>

            <template v-else>
              <div v-if="latestRelease" class="rd-hero">
                <span class="rd-badge">{{ text.latest }}</span>
                <div class="rd-hero-tag">{{ latestRelease.tag }}</div>
                <div class="rd-hero-name">{{ latestRelease.name }}</div>
                <div class="rd-hero-meta">
                  <span>{{ text.published }} {{ formatDate(latestRelease.publishedAt, dateLocale) }}</span>
                  <span v-if="primaryAsset?.downloadCount">· {{ formatCount(primaryAsset.downloadCount, dateLocale) }} {{ text.downloads }}</span>
                </div>
                <div class="rd-hero-actions">
                  <a v-if="primaryAsset" class="rd-cta" :href="primaryAsset.url">
                    <i class="ri-download-2-line" aria-hidden="true"></i>
                    <span>{{ text.download }}</span>
                    <small>{{ formatBytes(primaryAsset.size) }}</small>
                  </a>
                  <a v-else class="rd-cta" :href="latestRelease.htmlUrl" target="_blank" rel="noreferrer noopener">
                    <i class="ri-external-link-line" aria-hidden="true"></i>
                    <span>{{ text.viewOnGitHub }}</span>
                  </a>
                  <a class="rd-gh" :href="latestRelease.htmlUrl" target="_blank" rel="noreferrer noopener">
                    <i class="ri-external-link-line" aria-hidden="true"></i>
                    {{ text.viewOnGitHub }}
                  </a>
                </div>

                <div v-if="latestRelease.body" class="rd-hero-body">
                  <div class="rd-assets-label">{{ text.changelog }}</div>
                  <div class="rd-markdown" v-html="renderMarkdown(latestRelease.body)" />
                </div>
              </div>

              <div v-if="olderReleases.length" class="rd-list">
                <details v-for="release in olderReleases" :key="release.tag" class="rd-release">
                  <summary>
                    <span class="rd-release-tag">{{ release.tag }}</span>
                    <span class="rd-release-name">{{ release.name }}</span>
                    <span class="rd-release-date">{{ formatDate(release.publishedAt, dateLocale) }}</span>
                    <i class="ri-arrow-right-s-line rd-caret" aria-hidden="true"></i>
                  </summary>
                  <div class="rd-release-body">
                    <div class="rd-markdown" v-html="renderMarkdown(release.body)" />
                    <div v-if="release.assets.length" class="rd-assets">
                      <div class="rd-assets-label">{{ text.assets }}</div>
                      <a v-for="asset in release.assets" :key="asset.name" class="rd-asset" :href="asset.url">
                        <i class="ri-download-2-line rd-asset__icon" aria-hidden="true"></i>
                        <span class="rd-asset__meta">
                          <span class="rd-asset__name">{{ asset.name }}</span>
                          <span class="rd-asset__desc">
                            {{ formatBytes(asset.size) }}
                            <template v-if="asset.downloadCount">· {{ formatCount(asset.downloadCount, dateLocale) }} {{ text.downloads }}</template>
                          </span>
                        </span>
                        <i class="ri-external-link-line rd-asset__go" aria-hidden="true"></i>
                      </a>
                    </div>
                    <div v-else class="rd-no-assets">{{ text.noAssets }}</div>
                  </div>
                </details>
              </div>
            </template>
          </div>
        </template>
      </template>
    </div>
  </section>
</template>

<style scoped>
.release-download {
  margin: 24px auto 28px;
  width: min(100%, 1120px);
  animation: rd-fade-in 0.4s ease-out both;
}

:global(.VPDoc .vp-doc) {
  padding-top: 0 !important;
}

@keyframes rd-fade-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.rd-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 22px;
  align-items: end;
  margin-bottom: 18px;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: linear-gradient(135deg, var(--vp-c-bg-soft), var(--vp-c-bg));
}

.rd-kicker {
  display: block;
  margin-bottom: 8px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
}

.rd-header h1 {
  margin: 0;
  border: 0;
  padding: 0;
  font-size: 30px;
  line-height: 1.2;
}

.rd-desc {
  margin: 10px 0 0;
  max-width: 620px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.rd-updated {
  margin: 8px 0 0;
  color: var(--vp-c-text-3);
  font-size: 12.5px;
  line-height: 1.5;
}
.rd-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(92px, 1fr));
  gap: 10px;
  margin: 0;
}

.rd-stats div {
  display: flex;
  flex-direction: column;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.rd-stats dd,
.rd-stats dt {
  margin: 0;
}

.rd-stat__icon {
  order: -2;
  align-self: flex-start;
  margin-bottom: 6px;
  color: var(--vp-c-brand-1);
  font-size: 17px;
  line-height: 1;
}

.rd-stats dd {
  order: -1;
  color: var(--vp-c-text-1);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
}

.rd-stats dt {
  margin-top: 2px;
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-weight: 400;
}
.rd-content {
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.rd-state {
  padding: 26px 0;
  color: var(--vp-c-text-2);
  text-align: center;
}

.rd-state p {
  margin: 0 0 12px;
}

.rd-retry {
  padding: 6px 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--monica-cta-radius, 25px);
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

.rd-retry:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-alt);
}

.rd-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.rd-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 15.5px;
  cursor: pointer;
}

.rd-tab:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-alt);
}

.rd-tab.is-active {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
  font-weight: 600;
}

.rd-tab__icon {
  font-size: 15px;
  line-height: 1;
}

.rd-hero {
  display: grid;
  gap: 10px;
  margin-bottom: 16px;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.rd-badge {
  width: max-content;
  padding: 3px 12px;
  border-radius: 999px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  animation: rd-pulse 2.4s ease-out infinite;
}

@keyframes rd-pulse {
  0% {
    box-shadow: 0 0 0 0 var(--vp-c-brand-soft);
  }
  70% {
    box-shadow: 0 0 0 7px transparent;
  }
  100% {
    box-shadow: 0 0 0 0 transparent;
  }
}

.rd-hero-tag {
  font-family: var(--vp-font-family-mono);
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
}

.rd-hero-name {
  color: var(--vp-c-text-2);
  font-size: 18px;
}

.rd-hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  color: var(--vp-c-text-3);
  font-size: 14px;
}

.rd-hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
}

.rd-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 24px;
  border-radius: var(--monica-cta-radius, 25px);
  color: var(--vp-c-white);
  background: var(--vp-c-brand-3);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
}

.rd-cta:hover {
  color: var(--vp-c-white);
  background: var(--vp-c-brand-2);
  text-decoration: none;
}

.rd-cta i {
  font-size: 16px;
  line-height: 1;
}

.rd-cta small {
  font-weight: 400;
  opacity: 0.85;
}

.rd-gh {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 11px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--monica-cta-radius, 25px);
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  font-size: 15px;
  text-decoration: none;
}

.rd-gh:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.rd-gh:hover i {
  color: var(--vp-c-brand-1);
}

.rd-hero-body {
  margin-top: 6px;
  padding-top: 14px;
  border-top: 1px solid var(--vp-c-divider);
}

.rd-list {
  display: grid;
  gap: 10px;
}

.rd-release {
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.rd-release > summary {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  list-style: none;
  cursor: pointer;
}

.rd-release > summary::-webkit-details-marker {
  display: none;
}

.rd-release > summary:hover {
  background: var(--vp-c-bg-alt);
}

.rd-release-tag {
  font-family: var(--vp-font-family-mono);
  font-size: 14.5px;
  font-weight: 600;
}

.rd-release-name {
  overflow: hidden;
  color: var(--vp-c-text-2);
  font-size: 14.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rd-release-date {
  margin-left: auto;
  color: var(--vp-c-text-3);
  font-size: 13px;
  white-space: nowrap;
}

.rd-caret {
  margin-left: 2px;
  color: var(--vp-c-text-3);
  font-size: 16px;
  line-height: 1;
}

.rd-release[open] > summary .rd-caret {
  transform: rotate(90deg);
}

.rd-release-body {
  padding: 4px 18px 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.rd-release[open] .rd-release-body {
  animation: rd-slide-in 0.25s ease both;
}

@keyframes rd-slide-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.rd-markdown :deep(h3) {
  margin: 14px 0 6px;
  border: 0;
  font-size: 14px;
  font-weight: 600;
}

.rd-markdown :deep(h3:first-child) {
  margin-top: 14px;
}

.rd-markdown :deep(ul),
.rd-markdown :deep(ol) {
  margin: 0;
  padding-left: 20px;
}

.rd-markdown :deep(li) {
  margin: 3px 0;
  color: var(--vp-c-text-2);
  font-size: 14.5px;
}

.rd-markdown :deep(p) {
  margin: 8px 0;
  color: var(--vp-c-text-2);
  font-size: 14.5px;
}

.rd-markdown :deep(a) {
  color: var(--vp-c-brand-1);
}

.rd-markdown :deep(code) {
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
}

.rd-markdown :deep(pre) {
  margin: 10px 0 0;
  padding: 12px;
  overflow-x: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
}

.rd-markdown :deep(pre code) {
  padding: 0;
  background: transparent;
  font-size: 12.5px;
}

.rd-markdown :deep(blockquote) {
  margin: 10px 0;
  padding-left: 14px;
  border-left: 3px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.rd-assets {
  margin-top: 16px;
}

.rd-assets-label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.rd-asset {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
  padding: 11px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.rd-asset:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-alt);
  text-decoration: none;
}

.rd-asset__icon {
  flex: 0 0 auto;
  color: var(--vp-c-brand-1);
  font-size: 18px;
  line-height: 1;
}

.rd-asset__meta {
  min-width: 0;
  flex: 1 1 auto;
}

.rd-asset__name {
  display: block;
  overflow: hidden;
  font-family: var(--vp-font-family-mono);
  font-size: 13.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rd-asset__desc {
  display: block;
  margin-top: 2px;
  color: var(--vp-c-text-3);
  font-size: 13px;
}

.rd-asset__go {
  flex: 0 0 auto;
  color: var(--vp-c-text-3);
  font-size: 14px;
  line-height: 1;
}

.rd-no-assets {
  margin-top: 6px;
  padding: 12px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-3);
  font-size: 13px;
  text-align: center;
}

@media (max-width: 900px) {
  .rd-header {
    grid-template-columns: 1fr;
    align-items: start;
  }
}

@media (max-width: 640px) {
  .release-download {
    width: auto;
    margin: 12px 16px 28px;
  }

  .rd-header {
    padding: 18px;
  }

  .rd-header h1 {
    font-size: 24px;
  }
  .rd-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .rd-stats div {
    padding: 10px;
  }

  .rd-stat__icon {
    margin-bottom: 4px;
    font-size: 15px;
  }

  .rd-stats dd {
    font-size: 16px;
  }

  .rd-content {
    padding: 12px;
  }

  .rd-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  .rd-tab {
    flex: 0 0 auto;
    padding: 8px 12px;
    font-size: 14.5px;
  }

  .rd-hero {
    padding: 14px;
  }

  .rd-hero-tag {
    font-size: 24px;
  }

  .rd-hero-name {
    font-size: 15px;
  }

  .rd-hero-meta {
    font-size: 13px;
  }

  .rd-hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .rd-cta,
  .rd-gh {
    justify-content: center;
    padding: 10px 20px;
  }

  .rd-release > summary {
    flex-wrap: wrap;
    padding: 10px 12px;
  }

  .rd-release-date {
    width: 100%;
    margin-left: 0;
  }

  .rd-asset {
    padding: 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .release-download,
  .rd-badge,
  .rd-release[open] .rd-release-body {
    animation: none !important;
  }
}
</style>
