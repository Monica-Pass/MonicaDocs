<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase } from "vitepress";

type LocaleKey = "zh" | "en" | "ja" | "ru" | "vi";

type LinkItem = {
  name: string;
  desc: Record<LocaleKey, string>;
  href: string;
  avatar?: string;
};

type FriendLinksCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  open: string;
  noteTitle: string;
  noteDesc: string;
  githubCta: string;
};

const { page } = useData();

function resolveLocale(relativePath: string): LocaleKey {
  const match = relativePath.match(/^(en|ja|ru|vi)\//);
  return match ? (match[1] as LocaleKey) : "zh";
}

const localeKey = computed(() => resolveLocale(page.value.relativePath));

const githubIssuesUrl = "https://github.com/Monica-Pass/MonicaDocs/issues";

const links: LinkItem[] = [
  {
    name: "Monica Steam",
    desc: {
      zh: "独立、原生、面向 Steam 的 Android 客户端。",
      en: "An independent, native, Steam-oriented Android client.",
      ja: "Steam に特化した独立・ネイティブの Android クライアント。",
      ru: "Независимый нативный Android-клиент, ориентированный на Steam.",
      vi: "Ứng dụng Android độc lập, nguyên bản, hướng tới Steam.",
    },
    href: "https://monica-steam.github.io/",
    avatar: "/friends/monica_steam.png",
  },
];

const copy: Record<LocaleKey, FriendLinksCopy> = {
  zh: {
    eyebrow: "Friend Links",
    title: "友链",
    lead: "Monica 相关站点与朋友们的链接，欢迎交换友链。",
    open: "访问 ↗",
    noteTitle: "申请友链",
    noteDesc: "欢迎与本站互换友链。可在 GitHub 上发起 Issue 或 PR，附上站点名称与链接即可。",
    githubCta: "前往 GitHub 提交 →",
  },
  en: {
    eyebrow: "Friend Links",
    title: "Friend Links",
    lead: "Links to Monica-related sites and friends. Exchanges are welcome.",
    open: "Visit ↗",
    noteTitle: "Link exchange",
    noteDesc: "Feel free to exchange links with us. Open an issue or PR on GitHub with your site name and URL.",
    githubCta: "Open an issue on GitHub →",
  },
  ja: {
    eyebrow: "Friend Links",
    title: "リンク",
    lead: "Monica 関連サイトや仲間のリンク集です。相互リンク大歓迎。",
    open: "開く ↗",
    noteTitle: "相互リンク",
    noteDesc: "相互リンクを歓迎します。サイト名と URL を添えて、GitHub で Issue または PR をお送りください。",
    githubCta: "GitHub で送信 →",
  },
  ru: {
    eyebrow: "Friend Links",
    title: "Дружеские ссылки",
    lead: "Ссылки на сайты, связанные с Monica, и друзей. Обмен ссылками приветствуется.",
    open: "Открыть ↗",
    noteTitle: "Обмен ссылками",
    noteDesc: "Приглашаем обменяться ссылками. Откройте issue или PR на GitHub, указав название и адрес сайта.",
    githubCta: "Открыть issue на GitHub →",
  },
  vi: {
    eyebrow: "Friend Links",
    title: "Liên kết bạn bè",
    lead: "Liên kết đến các trang liên quan đến Monica và bạn bè. Hoan nghênh trao đổi liên kết.",
    open: "Mở ↗",
    noteTitle: "Trao đổi liên kết",
    noteDesc: "Hoan nghênh trao đổi liên kết. Hãy mở issue hoặc PR trên GitHub kèm tên và địa chỉ trang web.",
    githubCta: "Mở issue trên GitHub →",
  },
};

const currentCopy = computed(() => copy[localeKey.value]);
</script>

<template>
  <section class="friend-links" aria-labelledby="friend-links-title">
    <header class="friend-links__hero">
      <p class="friend-links__eyebrow">{{ currentCopy.eyebrow }}</p>
      <h1 id="friend-links-title">{{ currentCopy.title }}</h1>
      <p class="friend-links__lead">{{ currentCopy.lead }}</p>
    </header>

    <div class="friend-links__grid">
      <a
        v-for="link in links"
        :key="link.href"
        class="friend-card"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          v-if="link.avatar"
          class="friend-card__avatar"
          :src="withBase(link.avatar)"
          alt=""
          loading="lazy"
        />
        <span v-else class="friend-card__avatar friend-card__avatar--fallback">{{ link.name.charAt(0) }}</span>
        <div class="friend-card__body">
          <h2>{{ link.name }}</h2>
          <p>{{ link.desc[localeKey] }}</p>
        </div>
        <span class="friend-card__arrow">{{ currentCopy.open }}</span>
      </a>
    </div>

    <section class="friend-links__note" :aria-label="currentCopy.noteTitle">
      <h2>{{ currentCopy.noteTitle }}</h2>
      <p>{{ currentCopy.noteDesc }}</p>
      <a class="friend-links__cta" :href="githubIssuesUrl" target="_blank" rel="noopener noreferrer">
        {{ currentCopy.githubCta }}
      </a>
    </section>
  </section>
</template>

<style>
.friend-links {
  display: grid;
  gap: 32px;
  max-width: 960px;
  margin: 16px auto 72px;
  color: var(--vp-c-text-1);
}

.friend-links__hero {
  display: grid;
  gap: 14px;
  padding: 12px 0 24px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.friend-links__eyebrow {
  color: var(--vp-c-brand-1);
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1.4;
}

.friend-links__hero h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.15;
}

.friend-links__lead {
  max-width: 640px;
  color: var(--vp-c-text-2);
  font-size: 1.05rem;
  line-height: 1.75;
}

.friend-links__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.friend-card {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  column-gap: 14px;
  align-items: start;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  transition: translate 160ms ease, border-color 160ms ease, background-color 160ms ease;
}

.friend-card:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  translate: 0 -2px;
}

.friend-card:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.friend-card__avatar {
  grid-row: 1 / span 2;
  width: 48px;
  height: 48px;
  border-radius: 8px;
}

.friend-card__avatar--fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-white);
  background: var(--vp-c-brand-1);
  font-weight: 700;
}

.friend-card__body h2 {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.3;
}

.friend-card__body p {
  margin-top: 6px;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.6;
}

.friend-card__arrow {
  grid-column: 2;
  margin-top: 4px;
  color: var(--vp-c-brand-1);
  font-size: 0.85rem;
  font-weight: 600;
}

.friend-links__note {
  padding-top: 20px;
  border-top: 1px solid var(--vp-c-divider);
}

.friend-links__note h2 {
  font-size: 1.2rem;
}

.friend-links__note p {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.7;
}

.friend-links__cta {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  margin-top: 12px;
  padding: 0 14px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: var(--monica-cta-radius, 25px);
  color: var(--vp-c-brand-1);
  font-size: 0.9rem;
  font-weight: 600;
  transition: background-color 160ms ease, color 160ms ease;
}

.friend-links__cta:hover {
  color: var(--vp-c-white);
  background: var(--vp-c-brand-1);
}
</style>
