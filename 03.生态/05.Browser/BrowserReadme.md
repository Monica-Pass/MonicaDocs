---
title: 浏览器版 介绍
date: 2026-08-14 00:00:00
permalink: /ecosystem/BrowserReadme
---

# Monica for Browser

> Monica 的浏览器端扩展：在网页中完成账号密码的智能自动填充与快捷访问。  
> Browser · AutoFill · Extension

::: note 摘要
Monica for Browser 是 Monica 密码库生态中的浏览器端扩展，聚焦网页场景下的密码自动填充，帮助你在浏览器里快速使用本地保险库中的登录凭据。
:::

---

## 项目定位

- 网页端智能自动填充
- 快捷访问本地保险库中的登录凭据

## 当前状态

- 浏览器扩展 [Monica for Extension](https://github.com/Monica-Pass/Monica-for-Extension) 已发布；请查看 [GitHub Releases](https://github.com/Monica-Pass/Monica-for-Extension/releases) 和仓库 README 获取最新版本。
- 支持 Chrome/Edge 128+。Firefox 153+ 使用独立的未签名构建；永久安装需要 Mozilla 签名，具体见 [Firefox 说明](https://github.com/Monica-Pass/Monica-for-Extension/blob/main/docs/FIREFOX.md)。
- 扩展拥有独立的加密本地保险库；与 Android 的数据可通过支持的同步方式交换，具体限制见 [同步兼容说明](https://github.com/Monica-Pass/Monica-for-Extension/blob/main/docs/SYNC_COMPATIBILITY.md)。

## 与生态的关系

- Monica：提供本地保险库与凭据管理
- Monica for Browser：负责浏览器场景的入口与自动填充
