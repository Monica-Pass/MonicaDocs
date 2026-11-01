---
title: ブラウザ版 紹介
date: 2026-08-14 00:00:00
permalink: /ecosystem/BrowserReadme
---

# Monica for Browser

> Monica のブラウザ拡張機能：ウェブページでパスワードのスマート自動入力とクイックアクセスを実現します。  
> Browser · AutoFill · Extension

::: note 概要
Monica for Browser は Monica パスワードエコシステムにおけるブラウザ拡張機能です。ウェブページでのパスワード自動入力に焦点を当て、ローカル保管庫のログイン情報をブラウザで素早く利用できるようにします。
:::

---

## プロジェクトの位置づけ

- ウェブ上でのスマート自動入力
- ローカル保管庫のログイン情報へのクイックアクセス

## 現在の状態

- ブラウザ拡張機能 [Monica for Extension](https://github.com/Monica-Pass/Monica-for-Extension) は公開済みです。最新版は [GitHub Releases](https://github.com/Monica-Pass/Monica-for-Extension/releases) とリポジトリの README を参照してください。
- Chrome/Edge 128 以降に対応しています。Firefox 153 以降は別の未署名ビルドを使用し、恒久的なインストールには Mozilla の署名が必要です。[Firefox の説明](https://github.com/Monica-Pass/Monica-for-Extension/blob/main/docs/FIREFOX.md)を参照してください。
- 拡張機能は独自の暗号化ローカル保管庫を持ち、対応する同期方法で Android とデータを交換できます。制限は[同期互換性の説明](https://github.com/Monica-Pass/Monica-for-Extension/blob/main/docs/SYNC_COMPATIBILITY.md)を参照してください。

## エコシステムとの関係

- Monica：ローカル保管庫と認証情報管理を提供
- Monica for Browser：ブラウザでの入口と自動入力を担当
