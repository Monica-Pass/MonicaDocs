<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase } from "vitepress";

type LocaleKey = "zh" | "en" | "ja" | "ru" | "vi";
type CardKey = "android" | "ios" | "windows" | "cloud" | "browser";
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
const pageLink = (path: string) => withBase(`${localePrefix.value}${path}.html`);

const cardConfigs: Record<CardKey, CardConfig> = {
  android: { key: "android", accent: "#23b3a4", href: "/ecosystem/AndroidReadme" },
  ios: { key: "ios", accent: "#4f8cff", href: "/ecosystem/iOSReadme" },
  windows: { key: "windows", accent: "#f0a32f", href: "/ecosystem/WindowsReadme" },
  cloud: { key: "cloud", accent: "#8b5cf6", href: "/ecosystem/MonicaCloudReadme" },
  browser: { key: "browser", accent: "#16a34a", href: "/ecosystem/BrowserReadme" },
};

const cardOrder: CardKey[] = ["android", "ios", "windows", "cloud", "browser"];

const copy: Record<LocaleKey, EcosystemCopy> = {
  zh: {
    eyebrow: "Monica Ecosystem",
    title: "一个本地优先的密码管理生态",
    lead: "从 Android、iOS 到 Windows，Monica 把安全、可迁移和跨端协作放在同一张地图上。这里是所有客户端与技术路线的入口。",
    primaryCta: "查看 Android 客户端",
    secondaryCta: "阅读技术文档",
    metrics: [
      { value: "5", label: "生态方向" },
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
        description: "围绕本地保险库、恢复性和系统体验，在 iPhone 上开发安全密码管理，目前处于开发与真机验收阶段。",
      },
      windows: {
        title: "Monica by Avalonia",
        kicker: "跨桌面平台",
        description: "Monica 密码库的桌面端实现。",
      },
      cloud: {
        title: "Monica Cloud",
        kicker: "Cloud",
        description: "面向跨设备安全同步、备份与恢复的云端服务方向，当前处于规划与开发阶段。",
      },
      browser: {
        title: "Monica for Extension",
        kicker: "Browser",
        description: "浏览器端扩展，在网页中完成账号密码的智能自动填充与快捷访问。",
      },
    },
    principlesTitle: "设计原则",
    readMore: "查看详情",
    principles: [
      { title: "本地可控", description: "核心数据优先掌握在用户设备中，减少对单一云端的依赖。" },
      { title: "开放迁移", description: "兼容成熟密码库生态，让数据迁移更自由。" },
      { title: "跨端一致", description: "各平台结合自身特点，围绕本地优先的方向持续探索。" },
    ],
  },
  en: {
    eyebrow: "Monica Ecosystem",
    title: "A local-first password ecosystem",
    lead: "From Android and iOS to Windows, Monica connects security, portability, and cross-device workflows in one map. This is the gateway to every client and technical track.",
    primaryCta: "Explore Android",
    secondaryCta: "Read the docs",
    metrics: [
      { value: "5", label: "Ecosystem tracks" },
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
        description: "An iPhone client focused on local vaults and native behavior, currently in development and device testing.",
      },
      windows: {
        title: "Monica by Avalonia",
        kicker: "Cross-desktop platform",
        description: "The desktop implementation of the Monica password vault.",
      },
      cloud: {
        title: "Monica Cloud",
        kicker: "Cloud",
        description: "A cloud service track for secure cross-device sync, backup, and recovery — currently under development.",
      },
      browser: {
        title: "Monica for Extension",
        kicker: "Browser",
        description: "A browser extension for smart autofill and quick access to your credentials across the web.",
      },
    },
    principlesTitle: "Design Principles",
    readMore: "Read more",
    principles: [
      { title: "Local control", description: "Core vault data stays primarily under the user's control on their own devices." },
      { title: "Open migration", description: "Compatibility with mature vault ecosystems keeps importing and leaving humane." },
      { title: "Cross-platform consistency", description: "Each client follows a local-first direction while respecting its platform." },
    ],
  },
  ja: {
    eyebrow: "Monica Ecosystem",
    title: "ローカルファーストのパスワード管理エコシステム",
    lead: "Android、iOS、Windows をつなぎ、安全性、移行性、クロスデバイス運用を一枚の地図にまとめます。ここが各クライアントと技術文書への入口です。",
    primaryCta: "Android を見る",
    secondaryCta: "技術文書を読む",
    metrics: [
      { value: "5", label: "エコシステム" },
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
        description: "ローカル保管庫とネイティブ体験を重視した iPhone クライアント。開発と実機検証が進行中です。",
      },
      windows: {
        title: "Monica by Avalonia",
        kicker: "クロスデスクトッププラットフォーム",
        description: "Monica パスワード保管庫のデスクトップ実装。",
      },
      cloud: {
        title: "Monica Cloud",
        kicker: "Cloud",
        description: "端末間の安全な同期・バックアップ・復旧を目指すクラウドサービス。現在開発中です。",
      },
      browser: {
        title: "Monica for Extension",
        kicker: "Browser",
        description: "ウェブページでパスワードのスマート自動入力とクイックアクセスを実現するブラウザ拡張機能。",
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
      { value: "5", label: "Экосистема" },
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
        description: "Клиент для iPhone с локальным хранилищем находится в разработке и проходит проверку на устройствах.",
      },
      windows: {
        title: "Monica by Avalonia",
        kicker: "Кроссплатформенная настольная платформа",
        description: "Настольная реализация хранилища паролей Monica.",
      },
      cloud: {
        title: "Monica Cloud",
        kicker: "Cloud",
        description: "Облачный сервис для безопасной синхронизации, резервного копирования и восстановления между устройствами. В разработке.",
      },
      browser: {
        title: "Monica for Extension",
        kicker: "Browser",
        description: "Браузерное расширение для умного автозаполнения и быстрого доступа к учётным данным в вебе.",
      },
    },
    principlesTitle: "Принципы",
    readMore: "Подробнее",
    principles: [
      { title: "Локальный контроль", description: "Основные данные остаются под контролем пользователя на его устройствах." },
      { title: "Открытая миграция", description: "Совместимость с зрелыми экосистемами делает перенос данных спокойнее." },
      { title: "Единая модель", description: "Каждый клиент развивается с учётом своей платформы и локального подхода." },
    ],
  },
  vi: {
    eyebrow: "Monica Ecosystem",
    title: "Hệ sinh thái mật khẩu ưu tiên cục bộ",
    lead: "Từ Android, iOS đến Windows, Monica kết nối bảo mật, khả năng di chuyển dữ liệu và quy trình đa thiết bị trong cùng một bản đồ.",
    primaryCta: "Xem Android",
    secondaryCta: "Đọc tài liệu",
    metrics: [
      { value: "5", label: "Hệ sinh thái" },
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
        description: "Ứng dụng iPhone ưu tiên kho cục bộ, đang phát triển và kiểm thử trên thiết bị.",
      },
      windows: {
        title: "Monica by Avalonia",
        kicker: "Nền tảng đa desktop",
        description: "Bản triển khai desktop của kho mật khẩu Monica.",
      },
      cloud: {
        title: "Monica Cloud",
        kicker: "Cloud",
        description: "Dịch vụ đám mây cho đồng bộ, sao lưu và khôi phục an toàn giữa các thiết bị — đang trong quá trình phát triển.",
      },
      browser: {
        title: "Monica for Extension",
        kicker: "Browser",
        description: "Tiện ích mở rộng trình duyệt giúp tự động điền và truy cập nhanh mật khẩu trên web.",
      },
    },
    principlesTitle: "Nguyên tắc thiết kế",
    readMore: "Xem thêm",
    principles: [
      { title: "Kiểm soát cục bộ", description: "Dữ liệu lõi ưu tiên nằm dưới quyền kiểm soát của người dùng trên thiết bị riêng." },
      { title: "Di chuyển mở", description: "Tương thích với các hệ sinh thái trưởng thành để việc nhập và rời đi nhẹ nhàng hơn." },
      { title: "Nhất quán đa nền tảng", description: "Mỗi ứng dụng theo hướng ưu tiên cục bộ và phù hợp với nền tảng của mình." },
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

const labels = {
  zh: { collection: "探索 Monica", products: "为不同场景而生", productIntro: "选择适合你的平台，了解每个项目的功能与进展。", principles: "共同的方向", note: "各项目的功能与进度可能不同，请以详情页为准。", status: ["持续维护", "开发中", "早期开发", "规划与开发", "已发布"] },
  en: { collection: "Explore Monica", products: "Made for different moments", productIntro: "Find your platform and explore each project's capabilities and progress.", principles: "A shared direction", note: "Features and progress vary by project. See each page for details.", status: ["Maintained", "In development", "Early development", "Planning & development", "Released"] },
  ja: { collection: "Monica を探す", products: "さまざまな場面に", productIntro: "プラットフォームを選び、各プロジェクトの機能と進捗をご覧ください。", principles: "共通の方向性", note: "機能と進捗はプロジェクトによって異なります。詳細ページをご確認ください。", status: ["継続メンテナンス", "開発中", "開発初期", "企画・開発中", "リリース済み"] },
  ru: { collection: "Откройте Monica", products: "Для разных задач", productIntro: "Выберите платформу и узнайте о возможностях и состоянии каждого проекта.", principles: "Общее направление", note: "Возможности и этапы разработки различаются. Подробности — на страницах проектов.", status: ["Поддерживается", "В разработке", "Ранняя разработка", "Планирование и разработка", "Выпущено"] },
  vi: { collection: "Khám phá Monica", products: "Cho từng nhu cầu", productIntro: "Chọn nền tảng và tìm hiểu tính năng cũng như tiến độ của từng dự án.", principles: "Định hướng chung", note: "Tính năng và tiến độ khác nhau giữa các dự án. Xem trang chi tiết để biết thêm.", status: ["Đang duy trì", "Đang phát triển", "Giai đoạn đầu", "Lên kế hoạch và phát triển", "Đã phát hành"] },
} satisfies Record<LocaleKey, { collection: string; products: string; productIntro: string; principles: string; note: string; status: string[] }>;
const relatedProjects = [
  { name: "Mdbx", url: "https://github.com/Monica-Pass/Mdbx" },
  { name: "Monica CLI", url: "https://github.com/Monica-Pass/Monica-cli" },
  { name: "Monica F-Droid", url: "https://github.com/Monica-Pass/Monica-Fdroid" },
  { name: "Monica Docs", url: "https://github.com/Monica-Pass/MonicaDocs" },
  { name: "Monica CE (fork)", url: "https://github.com/Monica-Pass/Monica-CE" },
];
const relatedHeading: Record<LocaleKey, string> = {
  zh: "相关开源项目", en: "Related open-source projects", ja: "関連オープンソースプロジェクト",
  ru: "Связанные проекты с открытым кодом", vi: "Các dự án mã nguồn mở liên quan",
};
const currentLabels = computed(() => labels[localeKey.value]);
const icons: Record<CardKey, string> = { android: "ri-android-line", ios: "ri-apple-line", windows: "ri-computer-line", cloud: "ri-cloud-line", browser: "ri-window-line" };
</script>

<template>
  <section class="eco" aria-labelledby="ecosystem-title">
    <header class="eco-hero">
      <div class="eco-hero__main">
        <p class="eco-eyebrow"><span class="eco-eyebrow__line" />{{ currentCopy.eyebrow }}</p>
        <h1 id="ecosystem-title">{{ currentCopy.title }}</h1>
        <p class="eco-hero__lead">{{ currentCopy.lead }}</p>
        <div class="eco-actions">
          <a class="eco-button eco-button--primary" :href="pageLink('/ecosystem/AndroidReadme')">{{ currentCopy.primaryCta }} <i class="ri-arrow-right-up-line" aria-hidden="true" /></a>
          <a class="eco-button eco-button--secondary" :href="pageLink('/reference/catalogue')">{{ currentCopy.secondaryCta }} <i class="ri-arrow-right-line" aria-hidden="true" /></a>
        </div>
      </div>
      <div class="eco-hero__aside" aria-hidden="true">
        <div class="eco-hero__aside-top"><span>MONICA / ECOSYSTEM</span><span>01—05</span></div>
        <div class="eco-hero__number">05<span>.</span></div>
        <div class="eco-hero__aside-bottom"><span>{{ currentCopy.metrics[0].label }}</span><i class="ri-grid-line" /></div>
      </div>
    </header>

    <section class="eco-products" aria-labelledby="eco-products-title">
      <div class="eco-section-heading">
        <div><p class="eco-section-index">01 / {{ currentLabels.collection }}</p><h2 id="eco-products-title">{{ currentLabels.products }}</h2><p>{{ currentLabels.productIntro }}</p></div>
        <span class="eco-section-count" aria-hidden="true">01 — 05</span>
      </div>
      <div class="eco-grid">
        <a v-for="(card, index) in cards" :key="card.key" class="eco-card" :class="{ 'eco-card--featured': index === 0 }" :href="pageLink(card.href)" :style="{ '--eco-card-accent': card.accent, '--eco-delay': `${index * 55}ms` }">
          <div class="eco-card__top"><span class="eco-card__icon"><i :class="icons[card.key]" aria-hidden="true" /></span><span class="eco-card__index">0{{ index + 1 }}</span></div>
          <div class="eco-card__body"><div class="eco-card__meta"><span>{{ card.kicker }}</span><span class="eco-card__status">{{ currentLabels.status[index] }}</span></div><h3>{{ card.title }}</h3><p>{{ card.description }}</p></div>
          <div class="eco-card__footer"><span>{{ currentCopy.readMore }}</span><i class="ri-arrow-right-up-line" aria-hidden="true" /></div>
        </a>
      </div>
      <p class="eco-note"><i class="ri-information-line" aria-hidden="true" /> {{ currentLabels.note }}</p>
    </section>

    <section class="eco-related" aria-labelledby="eco-related-title">
      <div class="eco-section-heading"><div><p class="eco-section-index">GITHUB / MONICA-PASS</p><h2 id="eco-related-title">{{ relatedHeading[localeKey] }}</h2></div></div>
      <div class="eco-related__links"><a v-for="project in relatedProjects" :key="project.url" :href="project.url" target="_blank" rel="noopener noreferrer">{{ project.name }} <i class="ri-arrow-right-up-line" aria-hidden="true" /></a></div>
    </section>
    <section class="eco-principles" aria-labelledby="eco-principles-title">
      <div class="eco-section-heading"><div><p class="eco-section-index">02 / PRINCIPLES</p><h2 id="eco-principles-title">{{ currentLabels.principles }}</h2></div></div>
      <div class="eco-principles__grid"><article v-for="(principle, index) in currentCopy.principles" :key="principle.title"><span class="eco-principles__number">0{{ index + 1 }}</span><h3>{{ principle.title }}</h3><p>{{ principle.description }}</p></article></div>
    </section>
  </section>
</template>

<style scoped>
.eco { max-width: 1120px; margin: 16px auto 96px; color: var(--vp-c-text-1); }
.eco h1, .eco h2, .eco h3, .eco p { margin: 0; padding: 0; border: 0; }
.eco a { text-decoration: none; }
.eco-hero { display: grid; grid-template-columns: minmax(0, 1fr) 250px; min-height: 360px; border: 1px solid var(--vp-c-divider); border-radius: 8px; overflow: hidden; background: var(--vp-c-bg-soft); }
.eco-hero__main { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; padding: clamp(28px, 5vw, 58px); }
.eco-eyebrow, .eco-section-index { color: var(--vp-c-brand-1); font-size: 12px; font-weight: 750; letter-spacing: .1em; text-transform: uppercase; }
.eco-eyebrow { display: flex; align-items: center; gap: 10px; }
.eco-eyebrow__line { width: 24px; height: 2px; background: var(--vp-c-brand-1); }
.eco-hero h1 { max-width: 17ch; margin-top: 20px; font-size: clamp(32px, 4.2vw, 52px); line-height: 1.14; letter-spacing: -.035em; }
.eco-hero__lead { max-width: 650px; margin-top: 20px !important; color: var(--vp-c-text-2); font-size: 16px; line-height: 1.8; }
.eco-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
.eco-button { display: inline-flex; align-items: center; justify-content: center; gap: 12px; min-height: 44px; padding: 10px 16px; border: 1px solid transparent; border-radius: 8px; font-size: 14px; font-weight: 650; }
.eco-button--primary { color: var(--vp-c-white); background: var(--vp-c-brand-3); }
.eco-button--secondary { color: var(--vp-c-text-1); border-color: var(--vp-c-divider); background: var(--vp-c-bg); }
.eco-hero__aside { display: flex; flex-direction: column; justify-content: space-between; padding: 28px; border-left: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); background: var(--vp-c-bg); }
.eco-hero__aside-top, .eco-hero__aside-bottom { display: flex; align-items: center; justify-content: space-between; gap: 10px; font-size: 10px; font-weight: 700; letter-spacing: .08em; }
.eco-hero__aside-bottom { font-size: 12px; letter-spacing: 0; }
.eco-hero__aside-bottom i { color: var(--vp-c-brand-1); font-size: 21px; }
.eco-hero__number { color: var(--vp-c-text-1); font-size: clamp(72px, 9vw, 110px); font-weight: 750; line-height: 1; letter-spacing: -.09em; }
.eco-hero__number span { color: var(--vp-c-brand-1); }
.eco-products, .eco-principles, .eco-related { margin-top: 76px; }
.eco-related__links { display: flex; flex-wrap: wrap; gap: 10px; }
.eco-related__links a { padding: 10px 14px; border: 1px solid var(--vp-c-divider); border-radius: 8px; color: var(--vp-c-brand-1); font-size: 14px; font-weight: 650; }
.eco-section-heading { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 26px; }
.eco-section-heading h2 { margin-top: 10px; font-size: clamp(25px, 3vw, 34px); line-height: 1.3; letter-spacing: -.025em; }
.eco-section-heading div > p:last-child:not(.eco-section-index) { margin-top: 9px; color: var(--vp-c-text-2); line-height: 1.7; }
.eco-section-count, .eco-card__index, .eco-principles__number { color: var(--vp-c-text-3); font-family: var(--vp-font-family-mono); font-size: 12px; font-weight: 650; }
.eco-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.eco-card { display: flex; flex-direction: column; min-width: 0; min-height: 270px; padding: 24px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg); color: var(--vp-c-text-1); }
.eco-card--featured { grid-column: span 2; background: var(--vp-c-bg-soft); }
.eco-card__top, .eco-card__footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.eco-card__icon { display: grid; place-items: center; width: 46px; height: 46px; border: 1px solid var(--vp-c-divider); border-radius: 8px; color: var(--eco-card-accent); background: var(--vp-c-bg); font-size: 23px; }
.eco-card__body { flex: 1; margin-top: 24px; }
.eco-card__meta { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; color: var(--vp-c-text-2); font-size: 12px; font-weight: 650; }
.eco-card__status { padding: 2px 7px; border-radius: 4px; color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); font-size: 11px; }
.eco-card__status--paused { color: var(--vp-c-text-2); background: var(--vp-c-default-soft); }
.eco-card h3 { margin-top: 10px; font-size: 20px; line-height: 1.35; overflow-wrap: anywhere; }
.eco-card__body p { max-width: 540px; margin-top: 10px; color: var(--vp-c-text-2); font-size: 14px; line-height: 1.7; }
.eco-card__footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--vp-c-divider); color: var(--vp-c-brand-1); font-size: 13px; font-weight: 700; }
.eco-card__footer i { font-size: 18px; }
.eco-note { display: flex; gap: 7px; margin-top: 14px !important; color: var(--vp-c-text-3); font-size: 12px; line-height: 1.6; }
.eco-principles__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-soft); }
.eco-principles article { min-width: 0; padding: 25px; }
.eco-principles article + article { border-left: 1px solid var(--vp-c-divider); }
.eco-principles h3 { margin-top: 24px; font-size: 16px; }
.eco-principles article p { margin-top: 9px; color: var(--vp-c-text-2); font-size: 14px; line-height: 1.7; }
.eco a:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 3px; }
@media (prefers-reduced-motion: no-preference) {
  .eco-hero { animation: eco-appear .5s ease both; }
  .eco-card { animation: eco-appear .45s ease both; animation-delay: var(--eco-delay); transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease; }
  .eco-button { transition: transform .2s ease, background-color .2s ease; }
  .eco-card__icon, .eco-card__footer i { transition: transform .2s ease; }
  @media (hover: hover) {
    .eco-card:hover { transform: translateY(-4px); border-color: var(--eco-card-accent); box-shadow: 0 10px 24px var(--vp-c-default-soft); }
    .eco-card:hover .eco-card__icon { transform: scale(1.06); }
    .eco-card:hover .eco-card__footer i { transform: translate(3px, -3px); }
    .eco-button:hover { transform: translateY(-2px); }
  }
}
@keyframes eco-appear { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 850px) { .eco-hero { grid-template-columns: minmax(0, 1fr) 180px; } .eco-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 600px) {
  .eco { min-width: 0; margin: 10px 16px 64px; }
  .eco-hero { grid-template-columns: minmax(0, 1fr); min-height: 0; }
  .eco-hero__main { min-width: 0; padding: 26px 20px; }
  .eco-hero h1 { max-width: none; margin-top: 16px; font-size: clamp(28px, 8vw, 36px); line-height: 1.2; overflow-wrap: anywhere; }
  .eco-hero__lead { margin-top: 14px !important; font-size: 14px; line-height: 1.7; }
  .eco-actions { width: 100%; margin-top: 22px; }
  .eco-button { flex: 1 1 auto; min-width: 0; text-align: center; }
  .eco-hero__aside { flex-direction: row; align-items: center; gap: 16px; padding: 15px 20px; border-top: 1px solid var(--vp-c-divider); border-left: 0; }
  .eco-hero__aside-top { display: none; }
  .eco-hero__number { font-size: 40px; }
  .eco-hero__aside-bottom { flex: 1; min-width: 0; }
  .eco-products, .eco-principles, .eco-related { margin-top: 44px; }
  .eco-section-heading { margin-bottom: 20px; }
  .eco-section-heading h2 { font-size: 25px; overflow-wrap: anywhere; }
  .eco-section-heading div > p:last-child:not(.eco-section-index) { font-size: 14px; }
  .eco-grid, .eco-principles__grid { grid-template-columns: minmax(0, 1fr); }
  .eco-grid { gap: 10px; }
  .eco-card--featured { grid-column: auto; }
  .eco-card { display: grid; grid-template-columns: 42px minmax(0, 1fr); align-content: start; gap: 0 14px; min-height: 0; padding: 18px; }
  .eco-card__top { align-self: start; flex-direction: column; gap: 12px; }
  .eco-card__icon { width: 42px; height: 42px; font-size: 21px; }
  .eco-card__body { min-width: 0; margin-top: 0; }
  .eco-card h3 { margin-top: 8px; font-size: 18px; }
  .eco-card__body p { margin-top: 7px; }
  .eco-card__footer { grid-column: 2; margin-top: 16px; padding-top: 12px; }
  .eco-principles article { padding: 20px; }
  .eco-principles h3 { margin-top: 12px; }
  .eco-principles article + article { border-top: 1px solid var(--vp-c-divider); border-left: 0; }
  .eco-section-count { display: none; }
}
@media (max-width: 360px) {
  .eco { margin-inline: 10px; }
  .eco-actions { flex-direction: column; }
  .eco-button { width: 100%; }
  .eco-card { gap: 0 10px; padding: 16px; }
}
</style>
