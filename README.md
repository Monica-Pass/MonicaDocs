# MonicaDocs

MonicaDocs 是 [Monica](https://github.com/Monica-Pass/Monica) 的独立文档站源码。
站点使用 `VitePress` 和 `vitepress-theme-teek` 构建，提供简体中文、英文、日文、
俄文和越南文文档，并包含产品指南、配置参考与生态内容。

## 技术栈

- [VitePress](https://vitepress.dev/)
- TypeScript、Vue 和 Sass
- ECharts
- GitHub Pages

## 环境要求

- Node.js 20 或更高版本
- npm

## 快速开始

```bash
npm ci
npm run docs:dev
```

开发服务器默认监听 `http://localhost:5173/MonicaDocs/`。如果文档站部署到不同的
GitHub Pages 路径，请同步更新 `.vitepress/config.mts` 中的 `base` 配置。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run docs:dev` | 启动本地开发服务器并启用热更新。 |
| `npm run docs:build` | 生成生产构建产物。 |
| `npm run docs:preview` | 本地预览生产构建产物。 |

构建产物位于 `.vitepress/dist/`，不应手动编辑。

## 目录结构

```text
.
├── .vitepress/              VitePress 配置、主题、组件与多语言导航
├── 01.指南/                 简体中文指南
├── 02.配置/                 简体中文配置与参考文档
├── 03.生态/                 简体中文生态内容
├── en/                      英文文档
├── ja/                      日文文档
├── ru/                      俄文文档
├── vi/                      越南文文档
├── public/                  静态资源和生成的数据
├── scripts/                 文档数据更新脚本
├── index.md                 简体中文首页
└── personal.md              赞助者鸣谢页面
```

## 文档维护

- 新增中文内容时，请放入 `01.指南`、`02.配置` 或 `03.生态` 的对应目录。
- 多语言页面应保持与中文页面一致的路由与内容层级。
- 多语言导航、编辑链接和重写规则位于 `.vitepress/locales/`。
- 主题组件和样式位于 `.vitepress/theme/`。
- 请勿提交 `.vitepress/dist/`、`.vitepress/cache/` 或 `node_modules/`。

## 自动化数据同步

- Monica Commit 数据由 `update-github-commits.yml` 获取，并写入
  `public/github-commits.json`。该工作流需要
  `MONICA_SOURCE_REPO_TOKEN` Secret，对 `Monica-Pass/Monica` 具有
  `Contents: Read` 权限。
- 爱发电赞助者名单由原 `Monica` 仓库更新。原仓库使用爱发电密钥获取数据，
  再提交本文档仓库的 `personal.md`；本文档仓库不保存爱发电密钥。

## 部署

GitHub Pages 工作流构建 `.vitepress/dist/` 并部署静态站点。推送到 `main` 分支后，
请在仓库设置中将 Pages 的部署来源设为 GitHub Actions。

## 许可证

本仓库以 [GNU General Public License v3.0](LICENSE) 发布，与 Monica 主项目
保持一致。除非文件另有声明，复制、修改和分发时请遵守 GPL-3.0 的条款。
