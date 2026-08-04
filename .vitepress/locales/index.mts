import zh from "./zh-CN.mjs";
import en from "./en-US.mjs";
import ja from "./ja-JP.mjs";
import vi from "./vi-VN.mjs";
import ru from "./ru-RU.mjs";
import { sidebars } from "./sidebar.mts";
import { rewrites } from "./rewrites.mts";

export { rewrites };

export const locales = {
  root: {
    label: "简体中文",
    lang: "zh-CN",
    link: "/",
    ...zh,
    themeConfig: {
      ...zh.themeConfig,
      sidebar: sidebars.root,
    },
  },
  en: {
    label: "English",
    lang: "en-US",
    link: "/en/",
    ...en,
    themeConfig: {
      ...en.themeConfig,
      sidebar: sidebars.en,
    },
  },
  ja: {
    label: "日本語",
    lang: "ja-JP",
    link: "/ja/",
    ...ja,
    themeConfig: {
      ...ja.themeConfig,
      sidebar: sidebars.ja,
    },
  },
  vi: {
    label: "Tiếng Việt",
    lang: "vi-VN",
    link: "/vi/",
    ...vi,
    themeConfig: {
      ...vi.themeConfig,
      sidebar: sidebars.vi,
    },
  },
  ru: {
    label: "Русский",
    lang: "ru-RU",
    link: "/ru/",
    ...ru,
    themeConfig: {
      ...ru.themeConfig,
      sidebar: sidebars.ru,
    },
  },
};
