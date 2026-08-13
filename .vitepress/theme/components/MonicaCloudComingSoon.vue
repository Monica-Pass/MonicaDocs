<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";
import StatusHero from "./StatusHero.vue";

const { lang } = useData();

const copy = {
  zh: {
    title: "正在火速开发中",
    description: "更完善的安全服务体验，即将抵达。",
    home: "返回首页",
    homePath: "/",
  },
  en: {
    title: "Under rapid development",
    description: "A more complete secure service experience is on its way.",
    home: "Back to home",
    homePath: "/en/",
  },
  ja: {
    title: "ただいま鋭意開発中です",
    description: "より充実した安全なサービス体験をまもなくお届けします。",
    home: "ホームへ戻る",
    homePath: "/ja/",
  },
  vi: {
    title: "Đang được phát triển khẩn trương",
    description: "Trải nghiệm dịch vụ bảo mật hoàn thiện hơn sắp ra mắt.",
    home: "Về trang chủ",
    homePath: "/vi/",
  },
  ru: {
    title: "Активно разрабатывается",
    description: "Более совершенный опыт безопасного сервиса уже на подходе.",
    home: "На главную",
    homePath: "/ru/",
  },
};

const currentCopy = computed(() => copy[lang.value.split("-")[0] as keyof typeof copy] ?? copy.zh);
</script>

<template>
  <StatusHero
    image-src="/themepng.png"
    image-alt="Monica-Cloud"
    heading="Monica-Cloud"
    :title="currentCopy.title"
    :description="currentCopy.description"
    :home-label="currentCopy.home"
    :home-path="currentCopy.homePath"
  />
</template>
