<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase } from "vitepress";

type LocaleKey = "zh" | "en" | "ja" | "ru" | "vi";
type CardKey = "android" | "ios" | "windows";
type CardConfig = {
  key: CardKey;
  accent: string;
  href: string;
};
type CardCopy = {
  title: string;
  kicker: string;
  description: string;
};

type EcosystemCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  primaryCta: string;
  secondaryCta: string;
  metrics: Array<{ value: string; label: string }>;
  cards: Record<CardKey, CardCopy>;
  principlesTitle: string;
  readMore: string;
  principles: Array<{ title: string; description: string }>;
};

const { page } = useData();

function resolveLocale(relativePath: string): LocaleKey {
  const match = relativePath.match(/^(en|ja|ru|vi)\//);
  return match ? (match[1] as LocaleKey) : "zh";
}

const localeKey = computed(() => resolveLocale(page.value.relativePath));
const localePrefix = computed(() => (localeKey.value === "zh" ? "" : `/${localeKey.value}`));
const pageLink = (path: string) => withBase(`${localePrefix.value}${path}`);

const cardConfigs: Record<CardKey, CardConfig> = {
  android: { key: "android", accent: "#23b3a4", href: "/ecosystem/AndroidReadme" },
  ios: { key: "ios", accent: "#4f8cff", href: "/ecosystem/iOSReadme" },
  windows: { key: "windows", accent: "#f0a32f", href: "/ecosystem/WindowsReadme" },
};

const cardOrder: CardKey[] = ["android", "ios", "windows"];

const copy: Record<LocaleKey, EcosystemCopy> = {
  zh: {
    eyebrow: "Monica Ecosystem",
    title: "一个本地优先的密码管理生态",
    lead: "从 Android、iOS 到 Windows，Monica 把安全、可迁移和跨端协作放在同一张地图上。这里是所有客户端与技术路线的入口。",
    primaryCta: "查看 Android 客户端",
    secondaryCta: "阅读技术文档",
    metrics: [
      { value: "3", label: "客户端方向" },
      { value: "Local", label: "本地优先" },
      { value: "MDBX", label: "数据加密" },
    ],
    cards: {
      android: {
        title: "Monica for Android",
        kicker: "Android",
        description: "聚合 Bitwarden 同步能力与 KeePass 数据兼容，面向日常高频密码管理。",
      },
      ios: {
        title: "Monica for iOS",
        kicker: "iOS",
        description: "围绕本地保险库、恢复性和系统体验，规划 iPhone 上的安全密码管理。",
      },
      windows: {
        title: "Monica by Avalonia",
        kicker: "跨桌面平台",
        description: "Monica 密码库的桌面端实现。",
      },
    },
    principlesTitle: "设计原则",
    readMore: "查看详情",
    principles: [
      { title: "本地可控", description: "核心数据优先掌握在用户设备中，减少对单一云端的依赖。" },
      { title: "开放迁移", description: "兼容成熟密码库生态，加密数据提供基于硬件的安全隔离边界。" },
      { title: "跨端一致", description: "不同平台保留原生体验，同时提供本地安全与同步模型。" },
    ],
  },
  en: {
    eyebrow: "Monica Ecosystem",
    title: "A local-first password ecosystem",
    lead: "From Android and iOS to Windows, Monica connects security, portability, and cross-device workflows in one map. This is the gateway to every client and technical track.",
    primaryCta: "Explore Android",
    secondaryCta: "Read the docs",
    metrics: [
      { value: "3", label: "Client tracks" },
      { value: "Local", label: "First by design" },
      { value: "MDBX", label: "Data encryption" },
    ],
    cards: {
      android: {
        title: "Monica for Android",
        kicker: "Android",
        description: "Combines Bitwarden-style sync with KeePass data compatibility for everyday password workflows.",
      },
      ios: {
        title: "Monica for iOS",
        kicker: "iOS",
        description: "Plans a secure iPhone experience around local vaults, recoverability, and native platform behavior.",
      },
      windows: {
        title: "Monica by Avalonia",
        kicker: "Cross-desktop platform",
        description: "The desktop implementation of the Monica password vault.",
      },
    },
    principlesTitle: "Design Principles",
    readMore: "Read more",
    principles: [
      { title: "Local control", description: "Core vault data stays primarily under the user's control on their own devices." },
      { title: "Open migration", description: "Compatibility with mature vault ecosystems keeps importing and leaving humane." },
      { title: "Cross-platform consistency", description: "Each client feels native while sharing one security and sync model." },
    ],
  },
  ja: {
    eyebrow: "Monica Ecosystem",
    title: "ローカルファーストのパスワード管理エコシステム",
    lead: "Android、iOS、Windows をつなぎ、安全性、移行性、クロスデバイス運用を一枚の地図にまとめます。ここが各クライアントと技術文書への入口です。",
    primaryCta: "Android を見る",
    secondaryCta: "技術文書を読む",
    metrics: [
      { value: "3", label: "クライアント" },
      { value: "Local", label: "ローカル優先" },
      { value: "MDBX", label: "データ暗号化" },
    ],
    cards: {
      android: {
        title: "Monica for Android",
        kicker: "Android",
        description: "Bitwarden 風の同期と KeePass データ互換性を組み合わせ、日常的なパスワード管理を支えます。",
      },
      ios: {
        title: "Monica for iOS",
        kicker: "iOS",
        description: "ローカル保管庫、復旧性、ネイティブ体験を軸に iPhone 向けの安全な管理体験を設計します。",
      },
      windows: {
        title: "Monica by Avalonia",
        kicker: "クロスデスクトッププラットフォーム",
        description: "Monica パスワード保管庫のデスクトップ実装。",
      },
    },
    principlesTitle: "設計原則",
    readMore: "詳しく見る",
    principles: [
      { title: "ローカル制御", description: "中核データはユーザー自身の端末で管理できることを優先します。" },
      { title: "開かれた移行", description: "成熟したパスワード管理エコシステムとの互換性を重視します。" },
      { title: "クロス端末の一貫性", description: "各端末の自然な体験と共通の安全モデルを両立します。" },
    ],
  },
  ru: {
    eyebrow: "Monica Ecosystem",
    title: "Локальная экосистема управления паролями",
    lead: "Android, iOS и Windows объединяются вокруг безопасности, переносимости данных и понятных рабочих процессов. Здесь собраны входы во все клиенты и технические направления.",
    primaryCta: "Открыть Android",
    secondaryCta: "Читать документацию",
    metrics: [
      { value: "3", label: "Клиента" },
      { value: "Local", label: "Локальный подход" },
      { value: "MDBX", label: "Шифрование данных" },
    ],
    cards: {
      android: {
        title: "Monica for Android",
        kicker: "Android",
        description: "Сочетает синхронизацию в стиле Bitwarden и совместимость с данными KeePass для ежедневной работы.",
      },
      ios: {
        title: "Monica for iOS",
        kicker: "iOS",
        description: "Проектирует безопасный опыт на iPhone вокруг локального хранилища, восстановления и нативного поведения.",
      },
      windows: {
        title: "Monica by Avalonia",
        kicker: "Кроссплатформенная настольная платформа",
        description: "Настольная реализация хранилища паролей Monica.",
      },
    },
    principlesTitle: "Принципы",
    readMore: "Подробнее",
    principles: [
      { title: "Локальный контроль", description: "Основные данные остаются под контролем пользователя на его устройствах." },
      { title: "Открытая миграция", description: "Совместимость с зрелыми экосистемами делает перенос данных спокойнее." },
      { title: "Единая модель", description: "Клиенты остаются нативными, но разделяют общую модель безопасности и синхронизации." },
    ],
  },
  vi: {
    eyebrow: "Monica Ecosystem",
    title: "Hệ sinh thái mật khẩu ưu tiên cục bộ",
    lead: "Từ Android, iOS đến Windows, Monica kết nối bảo mật, khả năng di chuyển dữ liệu và quy trình đa thiết bị trong cùng một bản đồ.",
    primaryCta: "Xem Android",
    secondaryCta: "Đọc tài liệu",
    metrics: [
      { value: "3", label: "Hướng client" },
      { value: "Local", label: "Ưu tiên cục bộ" },
      { value: "MDBX", label: "Mã hóa dữ liệu" },
    ],
    cards: {
      android: {
        title: "Monica for Android",
        kicker: "Android",
        description: "Kết hợp đồng bộ kiểu Bitwarden với khả năng tương thích dữ liệu KeePass cho nhu cầu hằng ngày.",
      },
      ios: {
        title: "Monica for iOS",
        kicker: "iOS",
        description: "Định hình trải nghiệm iPhone an toàn quanh kho cục bộ, khả năng khôi phục và hành vi gốc của nền tảng.",
      },
      windows: {
        title: "Monica by Avalonia",
        kicker: "Nền tảng đa desktop",
        description: "Bản triển khai desktop của kho mật khẩu Monica.",
      },
    },
    principlesTitle: "Nguyên tắc thiết kế",
    readMore: "Xem thêm",
    principles: [
      { title: "Kiểm soát cục bộ", description: "Dữ liệu lõi ưu tiên nằm dưới quyền kiểm soát của người dùng trên thiết bị riêng." },
      { title: "Di chuyển mở", description: "Tương thích với các hệ sinh thái trưởng thành để việc nhập và rời đi nhẹ nhàng hơn." },
      { title: "Nhất quán đa nền tảng", description: "Mỗi client vẫn tự nhiên trên nền tảng của mình nhưng chia sẻ cùng mô hình bảo mật." },
    ],
  },
};

const currentCopy = computed(() => copy[localeKey.value]);
const cards = computed(() =>
  cardOrder.map((key) => ({
    ...cardConfigs[key],
    ...currentCopy.value.cards[key],
  })),
);
</script>

<template>
  <section class="ecosystem-landing" aria-labelledby="ecosystem-title">
    <header class="ecosystem-hero">
      <p class="ecosystem-hero__eyebrow">{{ currentCopy.eyebrow }}</p>
      <h1 id="ecosystem-title">{{ currentCopy.title }}</h1>
      <p class="ecosystem-hero__lead">{{ currentCopy.lead }}</p>
      <div class="ecosystem-hero__actions">
        <a class="ecosystem-button ecosystem-button--primary" :href="pageLink('/ecosystem/AndroidReadme')">
          {{ currentCopy.primaryCta }}
        </a>
        <a class="ecosystem-button ecosystem-button--ghost" :href="pageLink('/reference/catalogue')">
          {{ currentCopy.secondaryCta }}
        </a>
      </div>
    </header>

    <div class="ecosystem-metrics" aria-label="Ecosystem summary">
      <div v-for="metric in currentCopy.metrics" :key="metric.label" class="ecosystem-metric">
        <strong>{{ metric.value }}</strong>
        <span>{{ metric.label }}</span>
      </div>
    </div>

    <div class="ecosystem-cards">
      <a
        v-for="card in cards"
        :key="card.key"
        class="ecosystem-card"
        :href="pageLink(card.href)"
        :style="{ '--card-accent': card.accent }"
      >
        <div class="ecosystem-card__meta">
          <span class="ecosystem-card__kicker">{{ card.kicker }}</span>
        </div>
        <h2>{{ card.title }}</h2>
        <p>{{ card.description }}</p>
        <span class="ecosystem-card__arrow">{{ currentCopy.readMore }}</span>
      </a>
    </div>

    <section class="ecosystem-principles" :aria-label="currentCopy.principlesTitle">
      <h2>{{ currentCopy.principlesTitle }}</h2>
      <div class="ecosystem-principles__grid">
        <article v-for="principle in currentCopy.principles" :key="principle.title">
          <h3>{{ principle.title }}</h3>
          <p>{{ principle.description }}</p>
        </article>
      </div>
    </section>
  </section>
</template>

<style>
.ecosystem-landing {
  --ecosystem-accent: var(--vp-c-brand-1);
  --ecosystem-border: var(--vp-c-divider);
  --ecosystem-muted: var(--vp-c-text-2);
  --ecosystem-radius: 8px;
  --ecosystem-button-radius: var(--monica-cta-radius);
  display: grid;
  gap: 40px;
  max-width: 960px;
  margin: 16px auto 72px;
  color: var(--vp-c-text-1);
}

.ecosystem-hero {
  display: grid;
  gap: 18px;
  max-width: 720px;
  align-items: start;
  padding: 12px 0 28px;
  border-bottom: 1px solid var(--ecosystem-border);
}

.ecosystem-hero__eyebrow {
  color: var(--ecosystem-accent);
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1.4;
}

.ecosystem-hero h1 {
  max-width: 18ch;
  font-size: clamp(2.15rem, 4vw, 3.35rem);
  line-height: 1.12;
}

.ecosystem-hero__lead {
  max-width: 640px;
  color: var(--ecosystem-muted);
  font-size: 1.08rem;
  line-height: 1.75;
}

.ecosystem-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
}

.ecosystem-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  border-radius: var(--ecosystem-button-radius);
  padding: 0 14px;
  font-weight: 600;
  transition: background-color 160ms ease, border-color 160ms ease;
}

.ecosystem-button--primary {
  color: var(--vp-c-white);
  background: var(--vp-c-brand-3);
}

.ecosystem-button--ghost {
  border-color: var(--ecosystem-border);
}

.ecosystem-button:hover,
.ecosystem-card:hover {
  translate: none;
}

.ecosystem-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-block: 1px solid var(--ecosystem-border);
}

.ecosystem-metric {
  display: grid;
  gap: 6px;
  padding: 16px 20px;
}

.ecosystem-metric + .ecosystem-metric {
  border-inline-start: 1px solid var(--ecosystem-border);
}

.ecosystem-metric strong {
  font-size: 1.35rem;
}

.ecosystem-metric span {
  color: var(--ecosystem-muted);
  font-size: 0.82rem;
}

.ecosystem-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border: 1px solid var(--ecosystem-border);
  border-radius: var(--ecosystem-radius);
  overflow: hidden;
}

.ecosystem-card {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  min-height: 260px;
  padding: 24px;
  border-top: 3px solid var(--card-accent);
}

.ecosystem-card + .ecosystem-card {
  border-inline-start: 1px solid var(--ecosystem-border);
}

.ecosystem-card:hover {
  border-color: var(--card-accent);
  background: var(--vp-c-bg-soft);
}

.ecosystem-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.ecosystem-card__kicker {
  color: var(--ecosystem-muted);
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.4;
}

.ecosystem-card h2 {
  margin: 22px 0 0;
  color: var(--vp-c-text-1);
  font-size: 1.3rem;
  line-height: 1.25;
}

.ecosystem-card p {
  margin-top: 10px;
  color: var(--ecosystem-muted);
  font-size: 0.95rem;
  line-height: 1.7;
}

.ecosystem-card__arrow {
  margin-top: 24px;
  color: var(--vp-c-brand-1);
  font-size: 0.9rem;
  font-weight: 600;
}

.ecosystem-principles {
  display: grid;
  gap: 24px;
}

.ecosystem-principles h2 {
  font-size: 1.55rem;
  line-height: 1.25;
}

.ecosystem-principles__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--ecosystem-border);
}

.ecosystem-principles article {
  padding: 20px 20px 0 0;
}

.ecosystem-principles article + article {
  padding-left: 20px;
  border-inline-start: 1px solid var(--ecosystem-border);
}

.ecosystem-principles h3 {
  font-size: 1rem;
}

.ecosystem-principles p {
  color: var(--ecosystem-muted);
  font-size: 0.92rem;
  line-height: 1.65;
}

@media (prefers-reduced-motion: no-preference) {
  .ecosystem-hero {
    animation: eco-enter 0.42s ease both;
  }

  .ecosystem-metrics {
    animation: eco-enter 0.42s 0.08s ease both;
  }

  .ecosystem-cards {
    animation: eco-enter 0.42s 0.16s ease both;
  }

  .ecosystem-principles {
    animation: eco-enter 0.42s 0.24s ease both;
  }
}

@keyframes eco-enter {
  from {
    opacity: 0;
    translate: 0 14px;
  }
}

/* 视口小于内容最大宽度时，两侧留白，避免内容贴住屏幕边缘 */
@media (max-width: 960px) {
  .ecosystem-landing {
    padding-inline: 20px;
  }
}

@media (max-width: 640px) {
  .ecosystem-landing {
    gap: 28px;
    margin-top: 0;
  }

  .ecosystem-hero {
    padding-bottom: 24px;
  }

  .ecosystem-hero__actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .ecosystem-metrics,
  .ecosystem-cards,
  .ecosystem-principles__grid {
    grid-template-columns: 1fr;
  }

  .ecosystem-metric + .ecosystem-metric {
    border-top: 1px solid var(--ecosystem-border);
    border-inline-start: 0;
  }

  .ecosystem-card,
  .ecosystem-card + .ecosystem-card {
    min-height: 0;
    border-inline-start: 0;
    border-top: 3px solid var(--card-accent);
  }

  .ecosystem-card:first-child {
    border-top: 3px solid var(--card-accent);
  }

  .ecosystem-principles article,
  .ecosystem-principles article + article {
    padding: 18px 0 0;
    border-inline-start: 0;
  }

  .ecosystem-principles article + article {
    border-top: 1px solid var(--ecosystem-border);
  }
}
</style>