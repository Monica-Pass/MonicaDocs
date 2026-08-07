<script setup lang="ts" name="TeekLayoutProvider">
import Teek from "vitepress-theme-teek";
import { en as teekEn, zhCn as teekZhCn } from "vitepress-theme-teek";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useData } from "vitepress";
import ArchivesDashboard from "./ArchivesDashboard.vue";
import ContributeChart from "./ContributeChart.vue";
import GitHubCommitsPanel from "./GitHubCommitsPanel.vue";
import NotFound from "./404.vue";

const storageKey = "monica-docs-custom-theme-color";
const radiusStorageKey = "monica-docs-cta-radius-v2";
const defaultColor = "#3451b2";
const defaultRadius = 25;
const customThemeName = "monica-custom";

const { isDark, lang } = useData();
const color = ref(defaultColor);
const radius = ref(defaultRadius);
const customColorActive = ref(false);
const previousThemeColor = ref("vp-primary");
let observer: MutationObserver | undefined;

const customThemeCopy = computed(() => {
  const labels: Record<string, { title: string; reset: string; hex: string; radiusTitle: string; radiusReset: string }> = {
    "zh-CN": { title: "自定义取色", reset: "恢复默认颜色", hex: "HEX 颜色", radiusTitle: "CTA 圆角", radiusReset: "恢复默认圆角" },
    "en-US": { title: "Custom color", reset: "Restore default color", hex: "HEX color", radiusTitle: "CTA radius", radiusReset: "Restore default radius" },
    "ja-JP": { title: "カスタムカラー", reset: "デフォルトの色に戻す", hex: "HEX カラー", radiusTitle: "CTA の角丸", radiusReset: "デフォルトに戻す" },
    "ru-RU": { title: "Свой цвет", reset: "Восстановить цвет по умолчанию", hex: "HEX-цвет", radiusTitle: "Скругление CTA", radiusReset: "Сбросить скругление" },
    "vi-VN": { title: "Mau tuy chinh", reset: "Khoi phuc mau mac dinh", hex: "Mau HEX", radiusTitle: "Bo tron CTA", radiusReset: "Khoi phuc mac dinh" },
  };

  return labels[lang.value] ?? labels["en-US"];
});

const normalizeHex = (value: string) => {
  const normalized = value.trim().replace(/^#?([\da-f]{6})$/i, "#$1");
  return /^#[\da-f]{6}$/i.test(normalized) ? normalized.toLowerCase() : undefined;
};

const mix = (hex: string, target: "#000000" | "#ffffff", amount: number) => {
  const source = hex.slice(1);
  const targetValue = target.slice(1);
  const channels = [0, 2, 4].map((offset) => {
    const from = Number.parseInt(source.slice(offset, offset + 2), 16);
    const to = Number.parseInt(targetValue.slice(offset, offset + 2), 16);
    return Math.round(from + (to - from) * amount).toString(16).padStart(2, "0");
  });

  return `#${channels.join("")}`;
};

const toSoftColor = (hex: string, opacity: number) => {
  const value = hex.slice(1);
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

const removeCustomColor = () => {
  const root = document.documentElement;
  [
    "--vp-c-brand-1", "--vp-c-brand-2", "--vp-c-brand-3", "--vp-c-brand-soft", "--tk-theme-color", "--tk-color-primary",
    "--tk-color-primary-light-3", "--tk-color-primary-light-5", "--tk-color-primary-light-8", "--tk-el-color-primary",
    "--tk-el-color-primary-light-3", "--tk-el-color-primary-light-5", "--tk-el-color-primary-light-8",
  ].forEach((property) => root.style.removeProperty(property));
};

const applyCustomColor = (value: string) => {
  const normalized = normalizeHex(value);
  if (!normalized) return;

  const root = document.documentElement;
  const activeThemeColor = root.getAttribute("theme-color");
  if (activeThemeColor && activeThemeColor !== customThemeName) previousThemeColor.value = activeThemeColor;
  const secondary = mix(normalized, isDark.value ? "#000000" : "#ffffff", 0.1);
  const tertiary = mix(normalized, isDark.value ? "#000000" : "#ffffff", 0.2);
  const light3 = mix(normalized, "#ffffff", 0.3);
  const light5 = mix(normalized, "#ffffff", 0.5);
  const light8 = mix(normalized, isDark.value ? "#000000" : "#ffffff", isDark.value ? 0.78 : 0.84);

  root.setAttribute("theme-color", customThemeName);
  root.style.setProperty("--vp-c-brand-1", normalized);
  root.style.setProperty("--vp-c-brand-2", secondary);
  root.style.setProperty("--vp-c-brand-3", tertiary);
  root.style.setProperty("--vp-c-brand-soft", toSoftColor(normalized, isDark.value ? 0.16 : 0.14));
  root.style.setProperty("--tk-theme-color", normalized);
  root.style.setProperty("--tk-color-primary", normalized);
  root.style.setProperty("--tk-color-primary-light-3", light3);
  root.style.setProperty("--tk-color-primary-light-5", light5);
  root.style.setProperty("--tk-color-primary-light-8", light8);
  root.style.setProperty("--tk-el-color-primary", normalized);
  root.style.setProperty("--tk-el-color-primary-light-3", light3);
  root.style.setProperty("--tk-el-color-primary-light-5", light5);
  root.style.setProperty("--tk-el-color-primary-light-8", light8);

  color.value = normalized;
  customColorActive.value = true;
  localStorage.setItem(storageKey, normalized);
};

const resetCustomColor = () => {
  removeCustomColor();
  document.documentElement.setAttribute("theme-color", previousThemeColor.value);
  localStorage.removeItem(storageKey);
  color.value = defaultColor;
  customColorActive.value = false;
};

const applyRadius = (value: number | string) => {
  const next = Math.min(30, Math.max(0, Number(value) || 0));
  radius.value = next;
  document.documentElement.style.setProperty("--monica-cta-radius", `${next}px`);
  localStorage.setItem(radiusStorageKey, String(next));
};

const resetRadius = () => {
  radius.value = defaultRadius;
  document.documentElement.style.setProperty("--monica-cta-radius", `${defaultRadius}px`);
  localStorage.removeItem(radiusStorageKey);
};

const themeEnhanceTranslations: Record<string, Record<string, any>> = {
  "zh-CN": {
    title: "布局增强",
    layoutSwitch: { title: "布局切换", helpDesc: "调整页面布局以适配不同的阅读习惯和屏幕环境。" },
    docLayoutMaxWidth: { title: "文档内容最大宽度", helpDesc: "调整文档内容区域的最大宽度。", helpTipTitle: "调整文档内容最大宽度", helpTipContent: "拖动滑块调整文档内容区域的最大宽度。" },
    pageLayoutMaxWidth: { title: "页面最大宽度", helpDesc: "调整页面区域的最大宽度。", helpTipTitle: "调整页面最大宽度", helpTipContent: "拖动滑块调整页面区域的最大宽度。" },
    themeColor: { title: "主题色板", label: "内置主题色板", tip: "选择页面使用的主题颜色。", primaryLabel: "品牌色", successLabel: "成功色", warningLabel: "警告色", dangerLabel: "危险色" },
    spotlight: { title: "聚光灯", helpDesc: "高亮鼠标悬停的行和元素。", onTipTitle: "开启", offTipTitle: "关闭", onHelpTipContent: "开启聚光灯。", offHelpTipContent: "关闭聚光灯。" },
    spotlightStyles: { title: "聚光灯样式", helpDesc: "调整聚光灯的显示位置。", asideTipTitle: "置于侧边", underTipTitle: "置于底部", asideHelpTipContent: "在侧边显示聚光线。", underHelpTipContent: "在底部显示聚光线。" },
  },
  "en-US": {
    title: "Theme enhancement",
    layoutSwitch: { title: "Layout switch", helpDesc: "Adjust the page layout for different reading habits and screen sizes." },
    docLayoutMaxWidth: { title: "Document max width", helpDesc: "Adjust the maximum width of the document content.", helpTipTitle: "Adjust document max width", helpTipContent: "Drag the slider to adjust the document content width." },
    pageLayoutMaxWidth: { title: "Page max width", helpDesc: "Adjust the maximum width of the page.", helpTipTitle: "Adjust page max width", helpTipContent: "Drag the slider to adjust the page width." },
    themeColor: { title: "Theme colors", label: "Built-in theme colors", tip: "Choose the theme color used by the page.", primaryLabel: "Brand", successLabel: "Success", warningLabel: "Warning", dangerLabel: "Danger" },
    spotlight: { title: "Spotlight", helpDesc: "Highlight the row and elements under the pointer.", onTipTitle: "On", offTipTitle: "Off", onHelpTipContent: "Enable spotlight.", offHelpTipContent: "Disable spotlight." },
    spotlightStyles: { title: "Spotlight style", helpDesc: "Choose where the spotlight is shown.", asideTipTitle: "Aside", underTipTitle: "Under", asideHelpTipContent: "Show the spotlight along the side.", underHelpTipContent: "Show the spotlight below the element." },
  },
  "ja-JP": {
    title: "テーマ拡張",
    layoutSwitch: { title: "レイアウト切替", helpDesc: "読書習慣や画面サイズに合わせてレイアウトを調整します。" },
    docLayoutMaxWidth: { title: "ドキュメント最大幅", helpDesc: "ドキュメント本文の最大幅を調整します。", helpTipTitle: "ドキュメント最大幅を調整", helpTipContent: "スライダーで本文の幅を調整します。" },
    pageLayoutMaxWidth: { title: "ページ最大幅", helpDesc: "ページ領域の最大幅を調整します。", helpTipTitle: "ページ最大幅を調整", helpTipContent: "スライダーでページの幅を調整します。" },
    themeColor: { title: "テーマカラー", label: "内蔵テーマカラー", tip: "ページで使用するテーマカラーを選択します。", primaryLabel: "ブランド", successLabel: "成功", warningLabel: "警告", dangerLabel: "危険" },
    spotlight: { title: "スポットライト", helpDesc: "ポインター下の行や要素を強調します。", onTipTitle: "オン", offTipTitle: "オフ", onHelpTipContent: "スポットライトを有効にします。", offHelpTipContent: "スポットライトを無効にします。" },
    spotlightStyles: { title: "スポットライトのスタイル", helpDesc: "表示位置を選択します。", asideTipTitle: "サイド", underTipTitle: "下部", asideHelpTipContent: "側面に表示します。", underHelpTipContent: "要素の下に表示します。" },
  },
  "ru-RU": {
    title: "Расширение темы",
    layoutSwitch: { title: "Смена макета", helpDesc: "Настройте макет под разные привычки чтения и размеры экрана." },
    docLayoutMaxWidth: { title: "Максимальная ширина документа", helpDesc: "Настройте максимальную ширину содержимого документа.", helpTipTitle: "Настроить ширину документа", helpTipContent: "Перетащите ползунок, чтобы изменить ширину содержимого." },
    pageLayoutMaxWidth: { title: "Максимальная ширина страницы", helpDesc: "Настройте максимальную ширину страницы.", helpTipTitle: "Настроить ширину страницы", helpTipContent: "Перетащите ползунок, чтобы изменить ширину страницы." },
    themeColor: { title: "Цвета темы", label: "Встроенные цвета темы", tip: "Выберите цвет темы страницы.", primaryLabel: "Бренд", successLabel: "Успех", warningLabel: "Предупреждение", dangerLabel: "Опасность" },
    spotlight: { title: "Подсветка", helpDesc: "Выделяет строку и элементы под указателем.", onTipTitle: "Вкл.", offTipTitle: "Выкл.", onHelpTipContent: "Включить подсветку.", offHelpTipContent: "Выключить подсветку." },
    spotlightStyles: { title: "Стиль подсветки", helpDesc: "Выберите положение подсветки.", asideTipTitle: "Сбоку", underTipTitle: "Снизу", asideHelpTipContent: "Показывать подсветку сбоку.", underHelpTipContent: "Показывать подсветку снизу элемента." },
  },
  "vi-VN": {
    title: "Tăng cường giao diện",
    layoutSwitch: { title: "Chuyển bố cục", helpDesc: "Điều chỉnh bố cục cho thói quen đọc và kích thước màn hình khác nhau." },
    docLayoutMaxWidth: { title: "Độ rộng tài liệu tối đa", helpDesc: "Điều chỉnh độ rộng tối đa của nội dung tài liệu.", helpTipTitle: "Điều chỉnh độ rộng tài liệu", helpTipContent: "Kéo thanh trượt để điều chỉnh độ rộng nội dung." },
    pageLayoutMaxWidth: { title: "Độ rộng trang tối đa", helpDesc: "Điều chỉnh độ rộng tối đa của trang.", helpTipTitle: "Điều chỉnh độ rộng trang", helpTipContent: "Kéo thanh trượt để điều chỉnh độ rộng trang." },
    themeColor: { title: "Màu giao diện", label: "Màu giao diện tích hợp", tip: "Chọn màu giao diện cho trang.", primaryLabel: "Thương hiệu", successLabel: "Thành công", warningLabel: "Cảnh báo", dangerLabel: "Nguy hiểm" },
    spotlight: { title: "Đèn chiếu", helpDesc: "Làm nổi bật hàng và phần tử dưới con trỏ.", onTipTitle: "Bật", offTipTitle: "Tắt", onHelpTipContent: "Bật đèn chiếu.", offHelpTipContent: "Tắt đèn chiếu." },
    spotlightStyles: { title: "Kiểu đèn chiếu", helpDesc: "Chọn vị trí hiển thị đèn chiếu.", asideTipTitle: "Bên cạnh", underTipTitle: "Bên dưới", asideHelpTipContent: "Hiển thị đèn chiếu bên cạnh.", underHelpTipContent: "Hiển thị đèn chiếu bên dưới phần tử." },
  },
};

const teekLocale = computed(() => {
  const base = lang.value === "zh-CN" ? teekZhCn : teekEn;
  const override = themeEnhanceTranslations[lang.value] ?? themeEnhanceTranslations["en-US"];
  const themeEnhance = base.tk.themeEnhance;

  return {
    ...base,
    lang: lang.value,
    tk: {
      ...base.tk,
      themeEnhance: {
        ...themeEnhance,
        ...override,
        layoutSwitch: { ...themeEnhance.layoutSwitch, ...override.layoutSwitch },
        docLayoutMaxWidth: { ...themeEnhance.docLayoutMaxWidth, ...override.docLayoutMaxWidth },
        pageLayoutMaxWidth: { ...themeEnhance.pageLayoutMaxWidth, ...override.pageLayoutMaxWidth },
        themeColor: { ...themeEnhance.themeColor, ...override.themeColor },
        spotlight: { ...themeEnhance.spotlight, ...override.spotlight },
        spotlightStyles: { ...themeEnhance.spotlightStyles, ...override.spotlightStyles },
      },
    },
  };
});

onMounted(() => {
  const storedColor = localStorage.getItem(storageKey);
  if (storedColor) applyCustomColor(storedColor);
  const storedRadius = localStorage.getItem(radiusStorageKey);
  if (storedRadius !== null) applyRadius(storedRadius);

  observer = new MutationObserver(() => {
    if (document.documentElement.getAttribute("theme-color") !== customThemeName && customColorActive.value) {
      customColorActive.value = false;
      localStorage.removeItem(storageKey);
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["theme-color"] });
});

onBeforeUnmount(() => observer?.disconnect());

watch(isDark, () => {
  if (customColorActive.value) applyCustomColor(color.value);
});
</script>

<template>
  <Teek.Layout :locale="teekLocale">
    <template #teek-archives-top-before>
      <GitHubCommitsPanel />
      <ContributeChart />
      <ArchivesDashboard />
    </template>

    <template #not-found>
      <NotFound />
    </template>

    <template #teek-theme-enhance-bottom>
      <section class="custom-theme-color">
        <div class="custom-theme-color__heading">
          <span><i class="ri-palette-line" aria-hidden="true" />{{ customThemeCopy.title }}</span>
          <button type="button" :title="customThemeCopy.reset" :aria-label="customThemeCopy.reset" @click="resetCustomColor">
            <i class="ri-refresh-line" aria-hidden="true" />
          </button>
        </div>
        <div class="custom-theme-color__controls">
          <label class="custom-theme-color__swatch" :aria-label="customThemeCopy.title">
            <input v-model="color" type="color" @input="applyCustomColor(color)" />
          </label>
          <label class="custom-theme-color__hex">
            <span class="sr-only">{{ customThemeCopy.hex }}</span>
            <input v-model="color" type="text" inputmode="text" maxlength="7" @change="applyCustomColor(color)" @blur="applyCustomColor(color)" />
          </label>
        </div>
      </section>
      <section class="custom-theme-radius">
        <div class="custom-theme-color__heading">
          <span><i class="ri-rounded-corner" aria-hidden="true" />{{ customThemeCopy.radiusTitle }}</span>
          <button type="button" :title="customThemeCopy.radiusReset" :aria-label="customThemeCopy.radiusReset" @click="resetRadius">
            <i class="ri-refresh-line" aria-hidden="true" />
          </button>
        </div>
        <div class="custom-theme-radius__controls">
          <input v-model.number="radius" type="range" min="0" max="30" step="1" :aria-label="customThemeCopy.radiusTitle" @input="applyRadius(radius)" />
          <output>{{ radius }}px</output>
        </div>
      </section>
    </template>
  </Teek.Layout>
</template>

<style lang="scss">
.tk-my.is-circle-bg {
  margin-bottom: 20px;

  .tk-my__avatar.circle-rotate {
    margin-top: 200px;
  }
}

.custom-theme-color,
.custom-theme-radius {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.custom-theme-radius__controls,
.custom-theme-color__heading,
.custom-theme-color__controls {
  display: flex;
  align-items: center;
}

.custom-theme-radius__controls {
  gap: 8px;
  margin-top: 8px;
}

.custom-theme-radius__controls input {
  min-width: 0;
  flex: 1;
  accent-color: var(--vp-c-brand-1);
}

.custom-theme-radius__controls output {
  min-width: 34px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  text-align: right;
}

.custom-theme-color__heading,
.custom-theme-color__controls {
  justify-content: space-between;
}

.custom-theme-color__heading {
  color: var(--vp-c-text-1);
  font-size: 12px;
  font-weight: 700;
}

.custom-theme-color__heading span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.custom-theme-color__heading button {
  display: inline-grid;
  width: 26px;
  height: 26px;
  place-items: center;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
}

.custom-theme-color__heading button:hover {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.custom-theme-color__controls {
  gap: 10px;
  margin-top: 8px;
}

.custom-theme-color__swatch {
  display: grid;
  width: 34px;
  height: 30px;
  place-items: center;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
}

.custom-theme-color__swatch input {
  width: 42px;
  height: 38px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.custom-theme-color__hex {
  flex: 1;
}

.custom-theme-color__hex input {
  box-sizing: border-box;
  width: 100%;
  height: 30px;
  padding: 0 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font: inherit;
}

.custom-theme-color__hex input:focus {
  border-color: var(--vp-c-brand-1);
  outline: 2px solid var(--vp-c-brand-soft);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
