<script setup lang="ts">
import { ref } from "vue";
import { useRouter, withBase } from "vitepress";

const props = withDefaults(
  defineProps<{
    imageSrc: string;
    imageAlt: string;
    heading: string;
    title: string;
    description: string;
    homeLabel: string;
    homePath?: string;
    headingSize?: "lg" | "md";
  }>(),
  {
    homePath: "/",
    headingSize: "md",
  }
);

const router = useRouter();
const ns = "status-hero";
const imageFailed = ref(false);

const handleGoHome = () => {
  router.go(withBase(props.homePath));
};
</script>

<template>
  <main :class="[ns, 'flx-center']" :aria-labelledby="`${ns}-title`">
    <div :class="`${ns}__avatar-wrapper`">
      <img
        v-if="!imageFailed"
        :src="withBase(imageSrc)"
        :class="`${ns}__img`"
        :alt="imageAlt"
        @error="imageFailed = true"
      />
      <span v-else :class="`${ns}__img-fallback`" role="img" :aria-label="imageAlt">
        {{ imageAlt.charAt(0) }}
      </span>
    </div>

    <div :class="[`${ns}__detail`, 'flx-column']">
      <h1
        :id="`${ns}-title`"
        :class="[`${ns}__heading`, `${ns}__heading--${headingSize}`, 'glitch-text']"
      >
        {{ heading }}
      </h1>
      <h4>{{ title }}</h4>
      <p :class="`${ns}__tip`">{{ description }}</p>

      <button class="acgn-btn" type="button" @click="handleGoHome">
        <span>{{ homeLabel }}</span>
      </button>
    </div>
  </main>
</template>

<style scoped lang="scss">
$namespace: status-hero;

.#{$namespace} {
  display: flex;
  width: 100%;
  min-height: calc(100vh - var(--vp-nav-height));
  padding: 48px 24px;
  align-items: center;
  justify-content: center;
  gap: 80px;
  animation: statusHeroFadeIn 0.6s cubic-bezier(0.25, 1, 0.5, 1) both;

  &__avatar-wrapper {
    position: relative;
    animation: floating 3.5s ease-in-out infinite;
  }

  &__img,
  &__img-fallback {
    width: min(380px, 34vw);
  }

  &__img {
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 8px 24px rgba(84, 211, 194, 0.15));
  }

  &__img-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    border-radius: 8px;
    background: linear-gradient(135deg, rgba(84, 211, 194, 0.16), rgba(161, 196, 253, 0.16));
    color: var(--vp-c-text-3);
    font-size: 64px;
    font-weight: 700;
  }

  &__detail {
    display: flex;
    flex-direction: column;
    justify-content: center;

    h4 {
      margin: 16px 0 6px;
      color: var(--vp-c-text-1);
      font-size: 20px;
      font-weight: 600;
    }
  }

  &__heading {
    margin: 0;
    background: linear-gradient(135deg, #54d3c2 0%, #a1c4fd 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: "Arial Rounded MT Bold", "Segoe UI Rounded", "Nunito", sans-serif;
    line-height: 1.05;
  }

  &__heading--lg {
    font-family: "Arial Black", Gadget, sans-serif;
    font-size: 88px;
    font-weight: 900;
    line-height: 1;
  }

  &__heading--md {
    font-size: 58px;
    font-weight: 700;
  }

  &__tip {
    margin: 0 0 28px;
    color: var(--vp-c-text-2);
    font-size: 14px;
    font-style: italic;
  }

  .acgn-btn {
    position: relative;
    width: 130px;
    height: 38px;
    overflow: hidden;
    border: 0;
    border-radius: 4px;
    background: #54d3c2;
    box-shadow: 0 4px 12px rgba(84, 211, 194, 0.3);
    color: #171a21;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;

    span {
      position: relative;
      z-index: 2;
    }

    &::before {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      content: "";
      transition: all 0.5s ease;
    }

    &:hover {
      background: #6fe0d0;
      box-shadow: 0 6px 18px rgba(84, 211, 194, 0.4);
      transform: translateY(-2px);

      &::before {
        left: 100%;
      }
    }

    &:focus-visible {
      outline: 2px solid var(--vp-c-brand-1);
      outline-offset: 4px;
    }

    &:active {
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
    padding: 40px 24px;
    text-align: center;

    &__img,
    &__img-fallback {
      width: min(260px, 70vw);
    }

    &__detail {
      align-items: center;

      h4 {
        font-size: 18px;
      }
    }

    &__heading--lg {
      font-size: 72px;
    }

    &__heading--md {
      font-size: 42px;
    }
  }
}

@keyframes floating {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-12px);
  }
}

@keyframes statusHeroFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
