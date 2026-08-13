---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Monica Pass"
  text: "Secure. Local. Open Source."
  tagline: "Monica is an open-source local password manager. Manage passwords, 2FA, and secure notes with all data stored entirely on your local device."
  image:
    src: /themepng.png
    alt: Monica App Icon
  actions:
    - theme: brand
      text: Go to Monica-cloud
      link: /en/login
    - theme: alt
      text: Explore the Monica ecosystem
      link: /en/ecosystem.html
    - theme: alt
      text: Download Monica
      link: /en/download.html

features:
  - title: Password Manager
    details: Supports auto-fill and multi-field storage. Protected by AES-256 encryption, ensuring data only exists on your local device.
    icon: <i class="ri-key-2-fill"></i>
  - title: 2FA Authenticator
    details: Built-in TOTP authenticator with QR code scanning. Supports automatic copying of the next code before expiration.
    icon: <i class="ri-timer-2-fill"></i>
  - title: Cards & Notes
    details: Securely store bank cards, ID photos, and private notes. Keep everything under your full control.
    icon: <i class="ri-bank-card-fill"></i>
  - title: Material Design 3
    details: Follows Google Material Design 3 guidelines. Features dynamic color themes and dark mode with a clean, ad-free interface.
    icon: <i class="ri-palette-fill"></i>
  - title: Hardware-Level Keystore
    details: Keys are protected by the Android Keystore System (TEE) to provide a hardware-based security boundary for your encrypted data.
    icon: <i class="ri-shield-keyhole-fill"></i>
  - title: Zero-Knowledge Architecture
    details: Operates fully offline by default without requiring network permissions, ensuring that even developers cannot access your data.
    icon: <i class="ri-cloud-off-fill"></i>
---
