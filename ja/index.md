---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Monica Pass"
  text: "安全 · ローカル · オープンソース"
  tagline: "Monicaはオープンソースのローカルファーストなパスワードマネージャーです。パスワード、2FA認証コード、暗号化メモを管理し、すべてのデータはクラウドを経由せず、お使いのローカルデバイスのみに完全に保存されます。"
  image:
    src: /themepng.png
    alt: Monica アプリのアイコン
  actions:
    - theme: brand
      text: Monica-cloud へ移動
      link: /ja/login
    - theme: alt
      text: Monica エコシステムを見る
      link: /ja/ecosystem.html

features:
  - title: パスワード管理
    details: 自動入力と複数フィールドの保存をサポート。高強度のAES-256暗号化を採用し、データがローカルデバイスのみに存在することを保証します。
    icon: <i class="ri-key-2-fill"></i>
  - title: 2FA 認証器
    details: QRコードスキャン対応のTOTP認証器を内蔵。コードの有効期限が切れる前に自動でカウントダウンし、ワンタップでコピーできます。
    icon: <i class="ri-timer-2-fill"></i>
  - title: カード ＆ メモ
    details: 銀行カード、身分証明書、プライベートメモを安全に保存。すべての機密情報を完全に自分でコントロールできます。
    icon: <i class="ri-bank-card-fill"></i>
  - title: Material Design 3
    details: GoogleのMaterial Design 3設計ガイドラインに厳格に準拠。ダイナミックカラー構成とダークモードに対応し、純粋で広告のないUIを提供します。
    icon: <i class="ri-palette-fill"></i>
  - title: ハードウェア級 Keystore
    details: 暗号化キーはAndroidシステムのKeystore (TEE) によって保護され、暗号化データにハードウェアベースの安全な隔離境界を提供します。
    icon: <i class="ri-shield-keyhole-fill"></i>
  - title: ゼロナレッジアーキテクチャ
    details: デフォルトで完全にオフラインで動作し、ネットワーク権限を必要としません。開発者であってもあなたのデータに一切アクセスできないことを保証します。
    icon: <i class="ri-cloud-off-fill"></i>
---
