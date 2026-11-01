---
title: Browser Introduction
date: 2026-08-14 00:00:00
permalink: /ecosystem/BrowserReadme
---

# Monica for Browser

> Monica's browser extension: smart autofill and quick access to your credentials on the web.  
> Browser · AutoFill · Extension

::: note Summary
Monica for Browser is the browser extension in the Monica password ecosystem. It focuses on password autofill on web pages, letting you quickly use the login credentials in your local vault while browsing.
:::

---

## Project positioning

- Smart autofill on the web
- Quick access to login credentials in your local vault

## Current status

- The [Monica for Extension](https://github.com/Monica-Pass/Monica-for-Extension) browser extension has published releases; see [GitHub Releases](https://github.com/Monica-Pass/Monica-for-Extension/releases) and the repository README for the latest version.
- Chrome/Edge 128+ are supported. Firefox 153+ uses a separate unsigned build; permanent installation requires Mozilla signing. See the [Firefox instructions](https://github.com/Monica-Pass/Monica-for-Extension/blob/main/docs/FIREFOX.md).
- The extension has its own encrypted local vault; data can be exchanged with Android through supported sync methods, subject to the [sync compatibility limits](https://github.com/Monica-Pass/Monica-for-Extension/blob/main/docs/SYNC_COMPATIBILITY.md).

## Relationship to the ecosystem

- Monica: provides the local vault and credential management
- Monica for Browser: handles the browser entry point and autofill
