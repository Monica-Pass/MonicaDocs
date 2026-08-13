<p align="center">
  <b><a href="README.en.md">English</a></b>
  &nbsp;·&nbsp;
  <b>简体中文</b>
</p>

<p align="center">
  <img src="./assets/readme/hero.svg" width="100%" alt="Monica Docs: local-first Android password vault documentation">
</p>

<p align="center">
  <a href="https://monica-pass.github.io/MonicaDocs/">浏览文档</a>
  &nbsp;·&nbsp;
  <a href="https://github.com/Monica-Pass/Monica">Monica Android</a>
  &nbsp;·&nbsp;
  <a href="https://github.com/Monica-Pass/Monica/releases">下载 Releases</a>
</p>

# MonicaDocs

MonicaDocs 是 [Monica](https://github.com/Monica-Pass/Monica) 的独立文档站源码。  
Monica 是一款开源、以本地存储优先的 Android 密码管理器，用于管理密码、TOTP 验证码、银行卡与加密便签；  
文档站提供简体中文、English、日本語、Русский和Tiếng Việt内容。  

## 本地运行文档站

环境要求：Node.js 20+ 与 npm。

```bash
npm ci
npm run docs:dev
```

开发服务器默认地址为 `http://localhost:5173/MonicaDocs/`。发布到不同 GitHub Pages 路径时，请同步调整 `.vitepress/config.mts` 的 `base`。

| 命令 | 用途 |
| --- | --- |
| `npm run docs:dev` | 启动本地开发服务器并启用热更新。 |
| `npm run docs:build` | 生成生产构建产物。 |
| `npm run docs:preview` | 本地预览生产构建产物。 |

## 维护说明

- 简体中文内容位于 `01.指南`、`02.配置` 和 `03.生态`；其他语言位于 `en`、`ja`、`ru` 与 `vi`。
- 多语言导航、编辑链接与重写规则位于 `.vitepress/locales/`；主题组件和样式位于 `.vitepress/theme/`。
- GitHub Pages 在推送到 `main` 后通过 Actions 构建 `.vitepress/dist/` 并部署。
- `update-github-commits.yml` 定时更新 `public/github-commits.json`，需要具备 `Contents: Read` 权限的 `MONICA_SOURCE_REPO_TOKEN`。

## 致谢
- [Monica](https://github.com/Monica-Pass/Monica)

- [VitePress](https://github.com/vuejs/vitepress)
- [Teek](https://github.com/Kele-Bingtang/vitepress-theme-teek)

## 许可证

本仓库以 [GNU General Public License v3.0](./LICENSE) 发布，与 Monica 主项目保持一致。除非文件另有声明，复制、修改和分发时请遵守 GPL-3.0 条款。
