<script setup lang="ts">
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';

const { lang, frontmatter } = useData();
const copy: Record<string, { eyebrow: string; title: string; description: string; primary: string; secondary: string; note: string; section: string; sectionTitle: string; sectionText: string; security: string; securityTitle: string; securityText: string; explore: string; cloud: string; screen: string }> = {
  'zh-CN': { eyebrow: '本地优先的密码管理器', title: '把数字生活，\n安心交给自己。', description: '密码、验证码和私密信息，都有一个妥善安放的地方。Monica 以本地优先和开源设计，让安全回归你的掌控。', primary: '下载 Monica', secondary: '探索 Monica 生态', note: '开源 · 本地优先 · 为 Android 而设计', section: 'EVERYDAY ESSENTIALS', sectionTitle: '重要的，都放在一起。', sectionText: '从日常登录到私密资料，让安全管理自然融入每一天。', security: 'BUILT FOR PRIVACY', securityTitle: '你的数据，\n由你做主。', securityText: '本地加密保护你的保险箱。需要时，你也可以自主选择使用 Bitwarden 或 WebDAV 进行同步与备份。', explore: '了解安全与使用指南', cloud: 'Monica Cloud · 开发中', screen: 'Monica 应用界面' },
  'en-US': { eyebrow: 'A local-first password manager', title: 'Your digital life,\nin your hands.', description: 'A thoughtful home for your passwords, verification codes, and private information. Open source and local-first, Monica puts you in control.', primary: 'Download Monica', secondary: 'Explore the ecosystem', note: 'Open source · Local-first · Made for Android', section: 'EVERYDAY ESSENTIALS', sectionTitle: 'Everything important, together.', sectionText: 'From everyday sign-ins to private information, make security part of your routine.', security: 'BUILT FOR PRIVACY', securityTitle: 'Your data.\nYour choice.', securityText: 'Local encryption protects your vault. When you need it, choose Bitwarden or WebDAV for synchronization and backup.', explore: 'Explore the guide', cloud: 'Monica Cloud · Coming soon', screen: 'Monica app interface' },
  'ja-JP': { eyebrow: 'ローカルファーストのパスワード管理', title: 'デジタルの暮らしを、\n自分の手に。', description: 'パスワード、認証コード、プライベートな情報をひとつの場所に。オープンソースの Monica が、大切なデータの管理を支えます。', primary: 'Monica をダウンロード', secondary: 'エコシステムを見る', note: 'オープンソース · ローカル優先 · Android 向け', section: 'EVERYDAY ESSENTIALS', sectionTitle: '大切なものを、ひとつに。', sectionText: '毎日のログインからプライベートな情報まで、安全な管理をもっと身近に。', security: 'BUILT FOR PRIVACY', securityTitle: 'あなたのデータは、\nあなたのもの。', securityText: 'ローカル暗号化で保管庫を保護。必要に応じて Bitwarden や WebDAV による同期・バックアップを選べます。', explore: 'ガイドを見る', cloud: 'Monica Cloud · 開発中', screen: 'Monica のアプリ画面' },
  'ru-RU': { eyebrow: 'Локальный менеджер паролей', title: 'Ваша цифровая жизнь —\nв ваших руках.', description: 'Пароли, коды подтверждения и личные данные в одном месте. Monica с открытым исходным кодом помогает вам контролировать свои данные.', primary: 'Скачать Monica', secondary: 'Экосистема Monica', note: 'Открытый код · Локально · Для Android', section: 'EVERYDAY ESSENTIALS', sectionTitle: 'Всё важное — вместе.', sectionText: 'От ежедневного входа в аккаунты до личных заметок: безопасность становится привычной.', security: 'BUILT FOR PRIVACY', securityTitle: 'Ваши данные.\nВаш выбор.', securityText: 'Локальное шифрование защищает хранилище. При необходимости вы можете выбрать Bitwarden или WebDAV для синхронизации и резервного копирования.', explore: 'Открыть руководство', cloud: 'Monica Cloud · В разработке', screen: 'Интерфейс приложения Monica' },
  'vi-VN': { eyebrow: 'Trình quản lý mật khẩu ưu tiên cục bộ', title: 'Cuộc sống số,\ntrong tay bạn.', description: 'Một nơi dành cho mật khẩu, mã xác thực và thông tin riêng tư. Monica mã nguồn mở giúp bạn chủ động kiểm soát dữ liệu của mình.', primary: 'Tải Monica', secondary: 'Khám phá hệ sinh thái', note: 'Mã nguồn mở · Ưu tiên cục bộ · Dành cho Android', section: 'EVERYDAY ESSENTIALS', sectionTitle: 'Mọi điều quan trọng, cùng một nơi.', sectionText: 'Từ đăng nhập hàng ngày đến thông tin riêng tư, bảo mật trở nên thật tự nhiên.', security: 'BUILT FOR PRIVACY', securityTitle: 'Dữ liệu của bạn.\nLựa chọn của bạn.', securityText: 'Mã hóa cục bộ bảo vệ kho dữ liệu. Khi cần, bạn có thể chọn Bitwarden hoặc WebDAV để đồng bộ và sao lưu.', explore: 'Xem hướng dẫn', cloud: 'Monica Cloud · Đang phát triển', screen: 'Giao diện ứng dụng Monica' },
};
const t = computed(() => copy[lang.value] || copy['en-US']);
const prefix = computed(() => ({ 'zh-CN': '', 'en-US': '/en', 'ja-JP': '/ja', 'ru-RU': '/ru', 'vi-VN': '/vi' }[lang.value] ?? '/en'));
const screenshot = computed(() => ({ 'zh-CN': 'cn', 'en-US': 'en', 'ja-JP': 'ja', 'ru-RU': 'ru', 'vi-VN': 'vi' }[lang.value] ?? 'en'));
const icons = ['ri-key-2-line', 'ri-timer-line', 'ri-bank-card-line', 'ri-palette-line', 'ri-shield-keyhole-line', 'ri-cloud-off-line'];
</script>

<template>
  <div class="monica-home">
    <section class="mh-hero mh-wrap">
      <div class="mh-intro">
        <div class="mh-eyebrow"><span class="mh-dot"></span>{{ t.eyebrow }}</div>
        <h1>{{ t.title }}</h1>
        <p class="mh-description">{{ t.description }}</p>
        <div class="mh-actions">
          <a class="mh-button mh-button-primary" :href="withBase(`${prefix}/download.html`)">{{ t.primary }} <i class="ri-arrow-right-line" aria-hidden="true"></i></a>
          <a class="mh-button mh-button-secondary" :href="withBase(`${prefix}/ecosystem.html`)">{{ t.secondary }} <i class="ri-arrow-right-up-line" aria-hidden="true"></i></a>
        </div>
        <p class="mh-note"><i class="ri-shield-check-line" aria-hidden="true"></i> {{ t.note }}</p>
      </div>
      <div class="mh-art" aria-hidden="true">
        <div class="mh-art-grid"></div>
        <span class="mh-orbit mh-orbit-one"></span><span class="mh-orbit mh-orbit-two"></span>
        <div class="mh-art-label">YOUR PRIVATE SPACE <span>✳</span></div>
        <div class="mh-phone"><img :src="withBase(`/Overview/${screenshot}/GeneratorPage.jpg`)" :alt="t.screen" /></div>
        <div class="mh-floating mh-floating-lock"><i class="ri-lock-2-fill"></i></div>
        <div class="mh-floating mh-floating-key"><i class="ri-key-2-line"></i></div>
        <div class="mh-art-caption"><span>MONICA PASS</span><span>01 / 03</span></div>
      </div>
    </section>
    <div class="mh-strip"><div class="mh-wrap mh-strip-inner"><span><i class="ri-lock-password-line"></i> AES-256</span><span><i class="ri-smartphone-line"></i> Android Keystore</span><span><i class="ri-code-s-slash-line"></i> Open Source</span><span><i class="ri-fingerprint-line"></i> Local First</span></div></div>
    <section class="mh-features mh-wrap">
      <div class="mh-section-heading"><div><p class="mh-kicker">{{ t.section }} <span>— 01</span></p><h2>{{ t.sectionTitle }}</h2></div><p>{{ t.sectionText }}</p></div>
      <div class="mh-feature-grid"><article v-for="(feature, index) in frontmatter.landingFeatures" :key="feature.title" class="mh-feature"><div class="mh-feature-top"><span class="mh-feature-icon"><i :class="icons[index]" aria-hidden="true"></i></span><span class="mh-number">0{{ index + 1 }}</span></div><h3>{{ feature.title }}</h3><p>{{ feature.details }}</p></article></div>
    </section>
    <section class="mh-security mh-wrap"><div class="mh-security-panel"><div class="mh-security-symbol" aria-hidden="true"><div><i class="ri-shield-keyhole-line"></i></div><span>PRIVATE BY DESIGN</span></div><div class="mh-security-copy"><p class="mh-kicker">{{ t.security }} <span>— 02</span></p><h2>{{ t.securityTitle }}</h2><p>{{ t.securityText }}</p><a :href="withBase(`${prefix}/guide/intro.html`)">{{ t.explore }} <i class="ri-arrow-right-line"></i></a></div></div></section>
    <div class="mh-bottom mh-wrap"><span>MONICA PASS <span class="mh-bottom-star">✳</span></span><a :href="withBase('/login')">{{ t.cloud }} <i class="ri-arrow-right-up-line"></i></a></div>
  </div>
</template>

<style scoped>
.monica-home{--mh-ink:var(--vp-c-text-1);--mh-muted:var(--vp-c-text-2);color:var(--mh-ink);overflow:hidden}.mh-wrap{width:min(1200px,calc(100% - 64px));margin:0 auto}.mh-hero{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:48px;min-height:640px;padding:66px 0 74px}.mh-eyebrow,.mh-kicker{font-size:12px;letter-spacing:.14em;font-weight:750;text-transform:uppercase;color:var(--vp-c-brand-1)}.mh-eyebrow{display:inline-flex;align-items:center;gap:9px;padding:8px 12px;background:var(--vp-c-brand-soft);border-radius:30px;letter-spacing:.04em}.mh-dot{width:7px;height:7px;border-radius:50%;background:var(--vp-c-brand-1)}.mh-intro h1,.mh-security h2{white-space:pre-line}.mh-intro h1{font-size:clamp(43px,5vw,68px);line-height:1.16;letter-spacing:-.055em;font-weight:750;margin:26px 0 22px}.mh-description{max-width:510px;font-size:17px;line-height:1.9;color:var(--mh-muted)}.mh-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:32px}.mh-button{display:inline-flex;align-items:center;gap:22px;min-height:52px;padding:0 21px;border-radius:var(--monica-cta-radius);font-weight:700;font-size:14px;transition:transform .2s,background .2s}.mh-button:hover{transform:translateY(-2px)}.mh-button-primary{background:var(--vp-c-brand-3);color:white}.mh-button-primary:hover{background:var(--vp-c-brand-2);color:white}.mh-button-secondary{border:1px solid var(--vp-c-divider);background:var(--vp-c-bg);color:var(--mh-ink)}.mh-button-secondary:hover{border-color:var(--vp-c-brand-1);color:var(--vp-c-brand-1)}.mh-note{margin-top:29px;color:var(--mh-muted);font-size:12px}.mh-note i{color:var(--vp-c-brand-1);font-size:16px;vertical-align:middle;margin-right:5px}.mh-art{height:500px;position:relative;overflow:hidden;border-radius:16px;background:#e5ebf9;color:#5267a5}.mh-art-grid{position:absolute;inset:0;background-image:linear-gradient(#6577a61a 1px,transparent 1px),linear-gradient(90deg,#6577a61a 1px,transparent 1px);background-size:36px 36px;mask-image:linear-gradient(to bottom,black,transparent)}.mh-orbit{position:absolute;border:1px solid #aebce0;border-radius:50%;width:420px;height:420px;left:50%;top:50%;transform:translate(-50%,-50%)}.mh-orbit-two{width:330px;height:330px}.mh-art-label,.mh-art-caption{position:absolute;left:28px;right:28px;display:flex;justify-content:space-between;font-size:10px;font-weight:800;letter-spacing:.15em}.mh-art-label{top:25px}.mh-art-label span{font-size:20px}.mh-art-caption{bottom:24px}.mh-phone{position:absolute;left:50%;top:50%;width:195px;transform:translate(-50%,-49%) rotate(-4deg);padding:6px;background:#202942;border:1px solid #4a5874;border-radius:25px;box-shadow:0 26px 50px #51628c55;overflow:hidden}.mh-phone img{display:block;width:100%;border-radius:19px}.mh-floating{position:absolute;display:grid;place-items:center;width:58px;height:58px;background:#fff;border-radius:18px;box-shadow:0 14px 32px #667aa12c;font-size:25px}.mh-floating-lock{top:105px;right:75px;color:#5874c6;transform:rotate(10deg)}.mh-floating-key{bottom:94px;left:70px;color:#8a70c6;transform:rotate(-10deg)}.mh-strip{border-block:1px solid var(--vp-c-divider)}.mh-strip-inner{display:flex;justify-content:space-between;gap:20px;padding:23px 0;color:var(--mh-muted);font-size:12px;font-weight:700;letter-spacing:.04em}.mh-strip i{margin-right:8px;font-size:17px;color:var(--vp-c-brand-1);vertical-align:middle}.mh-features{padding:110px 0}.mh-section-heading{display:flex;align-items:end;justify-content:space-between;gap:40px;margin-bottom:40px}.mh-kicker span{color:var(--mh-muted);margin-left:8px}.mh-section-heading h2,.mh-security h2{font-size:clamp(30px,3vw,42px);line-height:1.25;letter-spacing:-.04em;font-weight:750;margin-top:14px}.mh-section-heading>p{max-width:340px;color:var(--mh-muted);font-size:15px;line-height:1.8}.mh-feature-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.mh-feature{min-height:215px;padding:26px;border:1px solid var(--vp-c-divider);border-radius:12px;background:var(--vp-c-bg-soft)}.mh-feature-top{display:flex;justify-content:space-between;align-items:start}.mh-feature-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:12px;background:var(--vp-c-brand-soft);color:var(--vp-c-brand-1);font-size:21px}.mh-number{font-size:11px;color:var(--mh-muted);font-weight:700}.mh-feature h3{font-size:17px;font-weight:700;margin:24px 0 9px}.mh-feature p{font-size:13px;line-height:1.75;color:var(--mh-muted)}.mh-security{padding-bottom:80px}.mh-security-panel{display:grid;grid-template-columns:1fr 1fr;min-height:340px;background:var(--vp-c-bg-soft);border:1px solid var(--vp-c-divider);border-radius:16px;overflow:hidden}.mh-security-symbol{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;background:var(--vp-c-brand-soft);color:var(--vp-c-brand-1)}.mh-security-symbol div{display:grid;place-items:center;width:125px;height:125px;border:1px solid currentColor;border-radius:50%;font-size:54px}.mh-security-symbol span{font-size:10px;font-weight:800;letter-spacing:.18em}.mh-security-copy{padding:60px}.mh-security-copy>p:not(.mh-kicker){margin-top:18px;color:var(--mh-muted);font-size:15px;line-height:1.8}.mh-security-copy a{display:inline-block;margin-top:25px;color:var(--vp-c-brand-1);font-size:14px;font-weight:700}.mh-security-copy a i{margin-left:8px}.mh-bottom{display:flex;justify-content:space-between;gap:20px;padding:0 0 55px;color:var(--mh-muted);font-size:11px;font-weight:750;letter-spacing:.12em}.mh-bottom a{letter-spacing:0;font-size:13px}.mh-bottom-star{color:var(--vp-c-brand-1);font-size:16px;margin-left:6px}:global(.dark) .mh-art{background:#242e46;color:#bdcaec}:global(.dark) .mh-art-grid{opacity:.4}:global(.dark) .mh-orbit{border-color:#607196}:global(.dark) .mh-floating{background:#35415e}:global(.dark) .mh-floating-lock{color:#a9bafa}:global(.dark) .mh-floating-key{color:#d1baf8}@media(max-width:900px){.mh-hero{gap:30px;min-height:auto}.mh-art{height:430px}.mh-phone{width:165px}.mh-floating-lock{right:30px}.mh-floating-key{left:30px}.mh-feature-grid{grid-template-columns:repeat(2,1fr)}.mh-security-copy{padding:42px}}@media(max-width:640px){.mh-wrap{width:calc(100% - 40px)}.mh-hero{grid-template-columns:1fr;padding:48px 0 40px;gap:38px}.mh-intro h1{font-size:40px}.mh-description{font-size:15px}.mh-art{height:390px}.mh-strip-inner{display:grid;grid-template-columns:1fr 1fr;gap:15px}.mh-features{padding:75px 0}.mh-section-heading{display:block}.mh-section-heading>p{margin-top:15px}.mh-feature-grid{grid-template-columns:1fr}.mh-feature{min-height:0}.mh-security-panel{grid-template-columns:1fr}.mh-security-symbol{min-height:220px}.mh-security-copy{padding:32px}.mh-bottom{padding-bottom:35px}}@media(prefers-reduced-motion:reduce){.mh-button{transition:none}.mh-button:hover{transform:none}}

@media (max-width: 320px) {
  .mh-intro h1 { font-size: clamp(26px, 10vw, 38px); overflow-wrap: anywhere; }
  .mh-intro, .mh-security-copy { min-width: 0; }
  .mh-button { max-width: 100%; min-width: 0; }
}

/* Motion stays subtle, and is only enabled when the visitor permits it. */
@media (prefers-reduced-motion: no-preference) {
  .mh-intro > * {
    animation: mh-enter 650ms cubic-bezier(.2, .7, .2, 1) both;
  }
  .mh-intro h1 { animation-delay: 80ms; }
  .mh-description { animation-delay: 160ms; }
  .mh-actions { animation-delay: 240ms; }
  .mh-note { animation-delay: 320ms; }
  .mh-art { animation: mh-enter 800ms 120ms cubic-bezier(.2, .7, .2, 1) both; }
  .mh-phone { animation: mh-phone-float 7s ease-in-out infinite; }
  .mh-floating-lock { animation: mh-lock-float 6s ease-in-out infinite; }
  .mh-floating-key { animation: mh-key-float 7s ease-in-out infinite; }
  .mh-feature { transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease; }
  .mh-feature-icon { transition: transform 220ms ease; }
  .mh-button i, .mh-security-copy a i { transition: transform 220ms ease; display: inline-block; }

  @media (hover: hover) {
    .mh-feature:hover { transform: translateY(-5px); border-color: var(--vp-c-brand-1); box-shadow: 0 14px 30px var(--vp-c-brand-soft); }
    .mh-feature:hover .mh-feature-icon { transform: scale(1.08) rotate(-4deg); }
    .mh-button:hover i, .mh-security-copy a:hover i { transform: translateX(4px); }
  }
}

@keyframes mh-enter {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes mh-phone-float {
  0%, 100% { transform: translate(-50%, -49%) rotate(-4deg); }
  50% { transform: translate(-50%, calc(-49% - 9px)) rotate(-2deg); }
}
@keyframes mh-lock-float {
  0%, 100% { transform: translateY(0) rotate(10deg); }
  50% { transform: translateY(-9px) rotate(6deg); }
}
@keyframes mh-key-float {
  0%, 100% { transform: translateY(0) rotate(-10deg); }
  50% { transform: translateY(8px) rotate(-6deg); }
}
</style>
