import type { DefaultTheme } from "vitepress";

export type SidebarText = {
  guide: string;
  intro: string;
  overview: string;
  quickstart: string;
  policies: string;
  privacy: string;
  terms: string;
  reference: string;
  catalogue: string;
  commonDocs: string;
  webdav: string;
  storage: string;
  autofill: string;
  mdbx: string;
  mdbxSpecs: string;
  mdbxIndex: string;
  mdbxAgent: string;
  mdbxProduct: string;
  mdbxStorage: string;
  mdbxSecurity: string;
  mdbxRoadmap: string;
  mdbxSqlite: string;
  mdbxTasks: string;
  mdbxCompletion: string;
  cli: string;
};

const localizedPath = (locale: string, path: string) => `/${locale ? `${locale}/` : ""}${path}`;

export const createSidebar = (locale: string, text: SidebarText): DefaultTheme.Sidebar => ({
  [localizedPath(locale, "guide/")]: [
    {
      text: text.guide,
      items: [
        { text: text.intro, link: localizedPath(locale, "guide/intro") },
        { text: text.overview, link: localizedPath(locale, "guide/overview") },
        { text: text.quickstart, link: localizedPath(locale, "guide/quickstart") },
      ],
    },
    {
      text: text.policies,
      items: [
        { text: text.privacy, link: localizedPath(locale, "guide/privacy") },
        { text: text.terms, link: localizedPath(locale, "guide/terms") },
      ],
    },
  ],
  [localizedPath(locale, "reference/")]: [
    {
      text: text.reference,
      items: [{ text: text.catalogue, link: localizedPath(locale, "reference/catalogue") }],
    },
    {
      text: text.commonDocs,
      items: [
        { text: text.webdav, link: localizedPath(locale, "reference/webdav-backup-specification") },
        { text: text.storage, link: localizedPath(locale, "reference/android-storage-security") },
        { text: text.autofill, link: localizedPath(locale, "reference/autofill") },
      ],
    },
    {
      text: text.mdbx,
      items: [
        { text: text.mdbxSpecs, link: localizedPath(locale, "reference/mdbx-specs") },
        { text: text.mdbxIndex, link: localizedPath(locale, "reference/mdbx-spec-index") },
        { text: text.mdbxAgent, link: localizedPath(locale, "reference/mdbx-agent-rules") },
        { text: text.mdbxProduct, link: localizedPath(locale, "reference/mdbx-product-spec") },
        { text: text.mdbxStorage, link: localizedPath(locale, "reference/mdbx-storage-sync-spec") },
        { text: text.mdbxSecurity, link: localizedPath(locale, "reference/mdbx-security-spec") },
        { text: text.mdbxRoadmap, link: localizedPath(locale, "reference/mdbx-roadmap-acceptance") },
        { text: text.mdbxSqlite, link: localizedPath(locale, "reference/mdbx-sqlite-schema-v1") },
        { text: text.mdbxTasks, link: localizedPath(locale, "reference/mdbx-task-breakdown") },
        { text: text.mdbxCompletion, link: localizedPath(locale, "reference/mdbx-implementation-completion-plan") },
        { text: text.cli, link: localizedPath(locale, "reference/monica-pass-cli-development") },
      ],
    },
  ],
});

const sidebarText: Record<"root" | "en" | "ja" | "ru" | "vi", SidebarText> = {
  root: {
    guide: "指南",
    intro: "项目介绍",
    overview: "界面介绍",
    quickstart: "快速开始",
    policies: "政策与条款",
    privacy: "隐私权政策",
    terms: "应用服务条款",
    reference: "文档",
    catalogue: "文档地图",
    commonDocs: "相关文档",
    webdav: "WebDAV 备份格式规范",
    storage: "本地存储与加密技术文档",
    autofill: "自动填充与保底机制",
    mdbx: "Mdbx 相关",
    mdbxSpecs: "MDBX 规范文档导航",
    mdbxIndex: "MDBX 规范索引",
    mdbxAgent: "MDBX 执行模型规则",
    mdbxProduct: "MDBX 产品规范",
    mdbxStorage: "MDBX 存储与同步规范",
    mdbxSecurity: "MDBX 安全规范",
    mdbxRoadmap: "MDBX 路线图与验收规范",
    mdbxSqlite: "MDBX SQLite 初版 Schema 规范",
    mdbxTasks: "MDBX 低端模型任务拆分清单",
    mdbxCompletion: "MDBX 实现补完计划",
    cli: "Monica Pass CLI 开发文档",
  },
  en: {
    guide: "Guide",
    intro: "Project Introduction",
    overview: "Interface Overview",
    quickstart: "Quick Start",
    policies: "Policies & Terms",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    reference: "Docs",
    catalogue: "Documentation Map",
    commonDocs: "Related Docs",
    webdav: "WebDAV Backup Format Specification",
    storage: "Local Storage & Encryption Tech Doc",
    autofill: "Autofill Modes & Fallback Mechanics",
    mdbx: "MDBX Specifications",
    mdbxSpecs: "MDBX Spec Navigation",
    mdbxIndex: "MDBX Spec Index",
    mdbxAgent: "MDBX Agent Rules",
    mdbxProduct: "MDBX Product Spec",
    mdbxStorage: "MDBX Storage & Sync Spec",
    mdbxSecurity: "MDBX Security Spec",
    mdbxRoadmap: "MDBX Roadmap & Acceptance Spec",
    mdbxSqlite: "MDBX SQLite Schema v1",
    mdbxTasks: "MDBX Task Breakdown",
    mdbxCompletion: "MDBX Implementation Completion Plan",
    cli: "Monica Pass CLI Development",
  },
  ja: {
    guide: "ガイド",
    intro: "プロジェクト紹介",
    overview: "機能総覧",
    quickstart: "クイックスタート",
    policies: "ポリシーと規約",
    privacy: "プライバシーポリシー",
    terms: "利用規約",
    reference: "ドキュメント",
    catalogue: "ドキュメントマップ",
    commonDocs: "関連ドキュメント",
    webdav: "WebDAV バックアップ形式仕様",
    storage: "ローカル保存と暗号化技術ドキュメント",
    autofill: "自動入力モードとフォールバック",
    mdbx: "MDBX 仕様",
    mdbxSpecs: "MDBX 仕様ナビゲーション",
    mdbxIndex: "MDBX 仕様インデックス",
    mdbxAgent: "MDBX Agent ルール",
    mdbxProduct: "MDBX 製品仕様",
    mdbxStorage: "MDBX 保存・同期仕様",
    mdbxSecurity: "MDBX セキュリティ仕様",
    mdbxRoadmap: "MDBX ロードマップと受け入れ基準",
    mdbxSqlite: "MDBX SQLite Schema v1",
    mdbxTasks: "MDBX タスク分解",
    mdbxCompletion: "MDBX 実装補完計画",
    cli: "Monica Pass CLI 開発文書",
  },
  ru: {
    guide: "Руководство",
    intro: "О проекте",
    overview: "Обзор интерфейса",
    quickstart: "Быстрый старт",
    policies: "Политики и условия",
    privacy: "Политика конфиденциальности",
    terms: "Условия использования",
    reference: "Документация",
    catalogue: "Карта документации",
    commonDocs: "Общие технические документы",
    webdav: "Спецификация резервного копирования WebDAV",
    storage: "Локальное хранение и шифрование",
    autofill: "Автозаполнение и резервные механизмы",
    mdbx: "Спецификации MDBX",
    mdbxSpecs: "Навигация по спецификациям MDBX",
    mdbxIndex: "Индекс спецификаций MDBX",
    mdbxAgent: "Правила исполнения MDBX Agent",
    mdbxProduct: "Спецификация продукта MDBX",
    mdbxStorage: "Хранение и синхронизация MDBX",
    mdbxSecurity: "Безопасность MDBX",
    mdbxRoadmap: "Дорожная карта MDBX",
    mdbxSqlite: "MDBX SQLite Schema v1",
    mdbxTasks: "Декомпозиция задач MDBX",
    mdbxCompletion: "План завершения MDBX",
    cli: "Разработка Monica Pass CLI",
  },
  vi: {
    guide: "Hướng dẫn",
    intro: "Giới thiệu dự án",
    overview: "Tổng quan giao diện",
    quickstart: "Khởi động nhanh",
    policies: "Chính sách & Điều khoản",
    privacy: "Chính sách quyền riêng tư",
    terms: "Điều khoản dịch vụ",
    reference: "Tài liệu",
    catalogue: "Bản đồ tài liệu",
    commonDocs: "Tài liệu kỹ thuật chung",
    webdav: "Đặc tả sao lưu WebDAV",
    storage: "Lưu trữ cục bộ & mã hóa",
    autofill: "Tự điền và dự phòng",
    mdbx: "Bộ đặc tả MDBX",
    mdbxSpecs: "Điều hướng đặc tả MDBX",
    mdbxIndex: "Chỉ mục đặc tả MDBX",
    mdbxAgent: "Quy tắc thực thi MDBX Agent",
    mdbxProduct: "Đặc tả sản phẩm MDBX",
    mdbxStorage: "Lưu trữ & đồng bộ MDBX",
    mdbxSecurity: "Bảo mật MDBX",
    mdbxRoadmap: "Lộ trình MDBX",
    mdbxSqlite: "MDBX SQLite Schema v1",
    mdbxTasks: "Phân rã tác vụ MDBX",
    mdbxCompletion: "Kế hoạch hoàn thiện MDBX",
    cli: "Phát triển Monica Pass CLI",
  },
};

export const sidebars = {
  root: createSidebar("", sidebarText.root),
  en: createSidebar("en", sidebarText.en),
  ja: createSidebar("ja", sidebarText.ja),
  ru: createSidebar("ru", sidebarText.ru),
  vi: createSidebar("vi", sidebarText.vi),
};
