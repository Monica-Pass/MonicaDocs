<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";
import StatusHero from "./StatusHero.vue";

const { lang } = useData();

const copy = {
  zh: {
    title: "你似乎迷失在了未知的世界线... 🗺️",
    description: "当前页面不存在或已被物理抹除",
    home: "返回主界面",
    homePath: "/",
  },
  en: {
    title: "You seem to have wandered into an unknown timeline... 🗺️",
    description: "This page does not exist or has been physically erased.",
    home: "Back to home",
    homePath: "/en/",
  },
  ja: {
    title: "未知の世界線に迷い込んだようです... 🗺️",
    description: "このページは存在しないか、物理的に消去されました。",
    home: "ホームへ戻る",
    homePath: "/ja/",
  },
  vi: {
    title: "Bạn dường như đã lạc vào một dòng thời gian chưa biết... 🗺️",
    description: "Trang này không tồn tại hoặc đã bị xóa khỏi thực tại.",
    home: "Về trang chủ",
    homePath: "/vi/",
  },
  ru: {
    title: "Похоже, вы забрели в неизвестную временную линию... 🗺️",
    description: "Эта страница не существует или была физически стёрта.",
    home: "На главную",
    homePath: "/ru/",
  },
};

const currentCopy = computed(() => copy[lang.value.split("-")[0] as keyof typeof copy] ?? copy.zh);
</script>

<template>
  <StatusHero
    image-src="/404_NotFound.png"
    image-alt="404 Not Found"
    heading="404"
    heading-size="lg"
    :title="currentCopy.title"
    :description="currentCopy.description"
    :home-label="currentCopy.home"
    :home-path="currentCopy.homePath"
  />
</template>
