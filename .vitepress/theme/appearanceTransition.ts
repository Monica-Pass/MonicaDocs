const genshinEggStorageKey = "monica-docs-genshin-egg";
// The easter egg lands on the hosted Genshin start page; nothing warms it up
// because cross-origin cache partitioning makes iframe preloading useless.
const genshinEggUrl = "https://genshin.titlecan.cn/";

type ViewTransitionLike = { ready: Promise<void>; finished: Promise<void> };
type StartViewTransitionLike = (updateCallback: () => void | Promise<void>) => ViewTransitionLike;
type DocumentWithViewTransitions = Document & { startViewTransition?: StartViewTransitionLike };

const isGenshinEggEnabled = () => {
  try {
    return localStorage.getItem(genshinEggStorageKey) === "1";
  } catch {
    return false;
  }
};

/**
 * Teek's config provider injects its own "toggle-appearance" handler that
 * wraps the dark-mode swap in a View Transition, animating the circular
 * reveal from the click coordinates it receives. Intercepting the click here
 * and replaying it with button.click() would hand Teek a synthetic event
 * whose (0, 0) coordinates anchor the reveal to the top-left corner, so we
 * let the real click through untouched and only ride along:
 *
 * - tag the switch direction on <html> so CSS can stack the animated
 *   snapshot on top for both directions;
 * - while the genshin easter egg is on, jump as soon as the dark-to-light
 *   reveal is halfway through instead of waiting for it to finish.
 */
export const setupAppearanceTransition = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const doc = document as DocumentWithViewTransitions;
  let lastTransition: ViewTransitionLike | null = null;
  if (doc.startViewTransition) {
    const originalStart = doc.startViewTransition.bind(doc);
    doc.startViewTransition = (updateCallback) => {
      const transition = originalStart(updateCallback);
      lastTransition = transition;
      return transition;
    };
  }

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest?.(".VPSwitchAppearance") as HTMLButtonElement | null;
      if (!button) return;

      const toDark = !document.documentElement.classList.contains("dark");
      document.documentElement.setAttribute("data-monica-appearance", toDark ? "to-dark" : "to-light");
      if (toDark || !isGenshinEggEnabled()) return;

      // Teek starts its View Transition synchronously while dispatching this
      // same click, so by the next macrotask the wrapper above has seen it.
      const jumpToGenshin = () => window.location.assign(genshinEggUrl);
      const before = lastTransition;
      window.setTimeout(() => {
        const transition = lastTransition !== before ? lastTransition : null;
        if (transition) {
          // Teek's out-in reveal runs 300ms; leave when it is halfway.
          transition.ready
            .catch(() => {})
            .then(() => window.setTimeout(jumpToGenshin, 150));
        } else {
          window.setTimeout(jumpToGenshin, 225);
        }
      }, 0);
    },
    true,
  );
};
