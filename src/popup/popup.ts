import browser from "webextension-polyfill";
import { DEFAULT_FEATURE_SETTINGS, FeatureSettings } from "../settings";

type FeatureKey = keyof FeatureSettings;

function getToggleElements(): HTMLInputElement[] {
  return Array.from(
    document.querySelectorAll<HTMLInputElement>("input[type='checkbox'][data-key]"),
  );
}

async function loadSettings(): Promise<FeatureSettings> {
  const stored = await browser.storage.sync.get(DEFAULT_FEATURE_SETTINGS);
  return {
    ...DEFAULT_FEATURE_SETTINGS,
    ...(stored as Partial<FeatureSettings>),
  };
}

function applySettings(settings: FeatureSettings): void {
  const popupRoot = document.querySelector<HTMLElement>(".popup");
  if (popupRoot) {
    popupRoot.classList.add("loading");
  }
  for (const input of getToggleElements()) {
    const key = input.dataset.key as FeatureKey | undefined;
    if (!key) {
      continue;
    }
    input.checked = settings[key];
  }
  if (popupRoot) {
    requestAnimationFrame(() => {
      popupRoot.classList.remove("loading");
    });
  }
}

async function handleToggleChange(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement | null;
  if (!input) {
    return;
  }
  const key = input.dataset.key as FeatureKey | undefined;
  if (!key) {
    return;
  }
  await browser.storage.sync.set({
    [key]: input.checked,
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const settings = await loadSettings();
  applySettings(settings);

  for (const input of getToggleElements()) {
    input.addEventListener("change", handleToggleChange);
  }
});
