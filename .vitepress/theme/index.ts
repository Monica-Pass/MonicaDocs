import Teek from "vitepress-theme-teek";
import TeekLayoutProvider from "./components/TeekLayoutProvider.vue";
import EcosystemLanding from "./components/EcosystemLanding.vue";
import FriendLinks from "./components/FriendLinks.vue";
import MonicaCloudComingSoon from "./components/MonicaCloudComingSoon.vue";
import ReleaseDownload from "./components/ReleaseDownload.vue";
import { h } from "vue";

import "vitepress-theme-teek/index.css";
import "vitepress-theme-teek/theme-chalk/tk-code-block-mobile.css"; // 移动端代码块样式优化
import "vitepress-theme-teek/theme-chalk/tk-sidebar.css"; // 侧边栏优化
import "vitepress-theme-teek/theme-chalk/tk-nav.css"; // 导航栏优化
import "vitepress-theme-teek/theme-chalk/tk-aside.css"; // 右侧目栏录文字悬停和激活样式
import "vitepress-theme-teek/theme-chalk/tk-doc-h1-gradient.css"; // 一级标题渐变色
import "vitepress-theme-teek/theme-chalk/tk-table.css"; // 表格样式调整，去掉单元格之间的线条
import "vitepress-theme-teek/theme-chalk/tk-mark.css"; // <mark></mark> 样式
import "vitepress-theme-teek/theme-chalk/tk-blockquote.css"; // > 引用块样式
import "vitepress-theme-teek/theme-chalk/tk-index-rainbow.css"; // 首页图片彩虹动画
//import "vitepress-theme-teek/theme-chalk/tk-banner-desc-gradient.css"; // 博客风格 Banner 描述渐变样式
import "vitepress-theme-teek/theme-chalk/tk-home-card-hover.css"; // 首页卡片悬停效果
import "vitepress-theme-teek/theme-chalk/tk-fade-up-animation.css"; // 首次加载的动画效果
import "remixicon/fonts/remixicon.css";

import "./style.css";
import "./styles/code-bg.scss";
import "./styles/iframe.scss";

type LocaleCode = "zh-CN" | "en-US" | "ja-JP" | "ru-RU" | "vi-VN";

const localePreferenceKey = "monica-docs-locale-preference";
const supportedLocales: Array<{ code: LocaleCode; path: string; language: string }> = [
  { code: "zh-CN", path: "/", language: "zh" },
  { code: "en-US", path: "/en/", language: "en" },
  { code: "ja-JP", path: "/ja/", language: "ja" },
  { code: "ru-RU", path: "/ru/", language: "ru" },
  { code: "vi-VN", path: "/vi/", language: "vi" },
];

const getBasePath = () => {
  return "/MonicaDocs/";
};

const getLocalePath = (locale: LocaleCode) => {
  const target = supportedLocales.find((item) => item.code === locale) ?? supportedLocales[0];
  return target.path === "/" ? getBasePath() : `${getBasePath()}${target.path.slice(1)}`;
};

const getLocaleFromPath = (pathname: string) => {
  const normalizedPath = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return supportedLocales.find((locale) => normalizedPath === getLocalePath(locale.code))?.code;
};

const setupRootLocaleNavigation = () => {
  const selector = ".VPNavBarTranslations a, .VPNavBarExtra a";

  const isRootLocaleLink = (link: HTMLAnchorElement) =>
    link.textContent?.trim() === "简体中文" && link.origin === window.location.origin;

  const forceDocumentNavigation = (link: HTMLAnchorElement) => {
    if (!isRootLocaleLink(link)) return;

    link.target = "_self";

    if (link.pathname !== window.location.pathname || link.search !== window.location.search || link.hash !== window.location.hash) {
      window.location.assign(link.href);
    }
  };

  const normalizeRootLocaleLinks = () => {
    document.querySelectorAll<HTMLAnchorElement>(selector).forEach((link) => {
      if (isRootLocaleLink(link)) link.target = "_self";
    });
  };

  normalizeRootLocaleLinks();

  const observer = new MutationObserver(normalizeRootLocaleLinks);
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener(
    "click",
    (event) => {
      if (event.button !== 0 || event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) return;

      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest(selector);
      if (!(link instanceof HTMLAnchorElement)) return;

      const locale = getLocaleFromPath(link.pathname);
      if (locale) localStorage.setItem(localePreferenceKey, locale);
      if (!isRootLocaleLink(link)) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      setTimeout(() => forceDocumentNavigation(link), 0);
    },
    true
  );
};

const setupBrowserLocale = () => {
  const rootPath = getBasePath();
  const isDefaultLocaleEntry = window.location.pathname === rootPath || window.location.pathname === `${rootPath}index.html`;
  if (!isDefaultLocaleEntry) return;

  const storedLocale = localStorage.getItem(localePreferenceKey) as LocaleCode | null;
  const browserLocales = navigator.languages?.length ? navigator.languages : [navigator.language];
  const browserLocale = browserLocales
    .map((language) => language.toLowerCase().split("-")[0])
    .map((language) => supportedLocales.find((locale) => locale.language === language)?.code)
    .find((locale): locale is LocaleCode => Boolean(locale));
  const targetLocale = storedLocale && supportedLocales.some((locale) => locale.code === storedLocale) ? storedLocale : browserLocale;

  if (!targetLocale || getLocalePath(targetLocale) === rootPath) return;

  const target = new URL(getLocalePath(targetLocale), window.location.origin);
  target.search = window.location.search;
  target.hash = window.location.hash;
  window.location.replace(target.href);
};

const showConsoleNotice = () => {
  const noticeWindow = window as Window & { __monicaConsoleNoticeShown?: boolean };
  if (noticeWindow.__monicaConsoleNoticeShown) return;

  noticeWindow.__monicaConsoleNoticeShown = true;
  console.info(
    "%c实际内容以应用内为准\n%cMonicaTeam保留最终解释权",
    "font-size:12px;color:#3451b2;",
    "font-size:12px;color:#64748b;"
  );
};

export default {
  extends: Teek,
  Layout: () => h(TeekLayoutProvider),
  enhanceApp(ctx) {
    ctx.app.component("EcosystemLanding", EcosystemLanding);
    ctx.app.component("FriendLinks", FriendLinks);
    ctx.app.component("MonicaCloudComingSoon", MonicaCloudComingSoon);
    ctx.app.component("ReleaseDownload", ReleaseDownload);

    if (typeof window === "undefined") return;

    setupRootLocaleNavigation();
    setupBrowserLocale();
    showConsoleNotice();
  },
};
