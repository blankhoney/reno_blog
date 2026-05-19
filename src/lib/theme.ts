import type { Language } from "./i18n";

export const THEME_STORAGE_KEY = "reno-blog-theme";

export const THEME_PREFERENCES = ["system", "light", "dark"] as const;

export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export type ThemeOption = {
  value: ThemePreference;
  label: string;
};

const themeLabels: Record<Language, Record<ThemePreference, string>> = {
  zh: {
    system: "系统",
    light: "浅色",
    dark: "深色",
  },
  en: {
    system: "Auto",
    light: "Light",
    dark: "Dark",
  },
};

export function normalizeThemePreference(value: unknown): ThemePreference {
  return typeof value === "string" &&
    THEME_PREFERENCES.includes(value as ThemePreference)
    ? (value as ThemePreference)
    : "system";
}

export function getThemeOptions(language: Language): ThemeOption[] {
  return THEME_PREFERENCES.map((value) => ({
    value,
    label: themeLabels[language][value],
  }));
}

export function getThemeInitScript(): string {
  const storageKey = JSON.stringify(THEME_STORAGE_KEY);
  const preferences = JSON.stringify(THEME_PREFERENCES);

  return `
(() => {
  const storageKey = ${storageKey};
  const preferences = ${preferences};
  const mediaQuery = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

  function normalize(value) {
    return preferences.includes(value) ? value : "system";
  }

  function readPreference() {
    try {
      return normalize(window.localStorage.getItem(storageKey));
    } catch {
      return "system";
    }
  }

  function resolvePreference(preference) {
    return preference === "system" && mediaQuery?.matches
      ? "dark"
      : preference === "dark"
        ? "dark"
        : "light";
  }

  function updateControls(preference) {
    document.querySelectorAll("[data-theme-option]").forEach((control) => {
      const pressed = control.getAttribute("data-theme-option") === preference;
      control.setAttribute("aria-pressed", String(pressed));
    });
  }

  function applyTheme(preference) {
    const normalized = normalize(preference);
    const resolved = resolvePreference(normalized);
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themePreference = normalized;
    document.documentElement.style.colorScheme = resolved;
    updateControls(normalized);
  }

  function applyThemeToDocument(targetDocument, preference) {
    const normalized = normalize(preference);
    const resolved = resolvePreference(normalized);
    targetDocument.documentElement.dataset.theme = resolved;
    targetDocument.documentElement.dataset.themePreference = normalized;
    targetDocument.documentElement.style.colorScheme = resolved;
  }

  function setTheme(preference) {
    const normalized = normalize(preference);

    try {
      window.localStorage.setItem(storageKey, normalized);
    } catch {}

    applyTheme(normalized);
  }

  window.renoBlogSetTheme = setTheme;
  applyTheme(readPreference());

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(readPreference());
  });

  document.addEventListener("astro:before-swap", (event) => {
    applyThemeToDocument(event.newDocument, readPreference());
  });

  document.addEventListener("astro:after-swap", () => {
    applyTheme(readPreference());
  });

  document.addEventListener("click", (event) => {
    const target = event.target?.closest?.("[data-theme-option]");

    if (!target) {
      return;
    }

    setTheme(target.getAttribute("data-theme-option"));
  });

  mediaQuery?.addEventListener?.("change", () => {
    if (readPreference() === "system") {
      applyTheme("system");
    }
  });
})();
`.trim();
}
