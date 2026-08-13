import { defineConfig } from "vitepress";
import { teekConfig } from "./teekConfig";
import shared from "./locales/shared.mjs";
import { locales, rewrites } from "./locales/index.mts";

export default defineConfig({
  extends: teekConfig,
  base: "/MonicaDocs/",

  srcExclude: ["**/README.md", "**/README.en.md", "**/CLAUDE.md"],

  ...shared,

  rewrites,

  locales,
});
