import browser from "webextension-polyfill";
import { expandInboxRichText } from "./expand-inbox";
import { expandTaskStoryFeed } from "./expand-task-story-feed";
import { expandTaskStoryRichText } from "./expand-task-story-rich-text";
import { log } from "./logger";

interface ExtensionMessage {
  message: string;
}

function isExtensionMessage(value: unknown): value is ExtensionMessage {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof (value as { message?: unknown }).message === "string"
  );
}

type AnyWindow = Window & {
  asanaExpanderInboxObserver?: MutationObserver;
  asanaExpanderTaskObserver?: MutationObserver;
  asanaExpanderInboxRootObserver?: MutationObserver;
  asanaExpanderTaskRootObserver?: MutationObserver;
  asanaExpanderLastUrl?: string;
  asanaExpanderHistoryPatched?: boolean;
};

const INBOX_SELECTOR = ".InboxFeed";
const TASK_PANE_SELECTOR = ".TaskPane";

function isInboxUrl(): boolean {
  const url = String(window.location);
  return url.includes("/inbox/");
}

function isTaskUrl(): boolean {
  const url = String(window.location);
  return url.includes("/task/") || url.includes("/item/");
}

function ensureInboxObserver(): void {
  const anyWindow = window as AnyWindow;
  const inboxRoot = document.querySelector<HTMLElement>(INBOX_SELECTOR);

  if (!inboxRoot) {
    if (anyWindow.asanaExpanderInboxObserver) {
      anyWindow.asanaExpanderInboxObserver.disconnect();
      delete anyWindow.asanaExpanderInboxObserver;
    }
    if (!anyWindow.asanaExpanderInboxRootObserver) {
      const rootObserver = new MutationObserver(() => {
        const foundRoot = document.querySelector<HTMLElement>(INBOX_SELECTOR);
        if (!foundRoot) {
          return;
        }
        rootObserver.disconnect();
        delete anyWindow.asanaExpanderInboxRootObserver;
        ensureInboxObserver();
      });
      rootObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
      anyWindow.asanaExpanderInboxRootObserver = rootObserver;
    }
    return;
  }

  if (anyWindow.asanaExpanderInboxRootObserver) {
    anyWindow.asanaExpanderInboxRootObserver.disconnect();
    delete anyWindow.asanaExpanderInboxRootObserver;
  }

  if (anyWindow.asanaExpanderInboxObserver) {
    return;
  }

  let debounceHandle: number | undefined;
  const observer = new MutationObserver(() => {
    if (debounceHandle !== undefined) {
      window.clearTimeout(debounceHandle);
    }
    debounceHandle = window.setTimeout(() => {
      expandInboxRichText();
    }, 250);
  });
  observer.observe(inboxRoot, {
    childList: true,
    subtree: true,
  });
  anyWindow.asanaExpanderInboxObserver = observer;
}

function ensureTaskObserver(): void {
  const anyWindow = window as AnyWindow;
  const taskPane = document.querySelector<HTMLElement>(TASK_PANE_SELECTOR);

  if (!taskPane) {
    if (anyWindow.asanaExpanderTaskObserver) {
      anyWindow.asanaExpanderTaskObserver.disconnect();
      delete anyWindow.asanaExpanderTaskObserver;
    }
    if (!anyWindow.asanaExpanderTaskRootObserver) {
      const rootObserver = new MutationObserver(() => {
        const foundRoot = document.querySelector<HTMLElement>(TASK_PANE_SELECTOR);
        if (!foundRoot) {
          return;
        }
        rootObserver.disconnect();
        delete anyWindow.asanaExpanderTaskRootObserver;
        ensureTaskObserver();
      });
      rootObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
      anyWindow.asanaExpanderTaskRootObserver = rootObserver;
    }
    return;
  }

  if (anyWindow.asanaExpanderTaskRootObserver) {
    anyWindow.asanaExpanderTaskRootObserver.disconnect();
    delete anyWindow.asanaExpanderTaskRootObserver;
  }

  if (anyWindow.asanaExpanderTaskObserver) {
    return;
  }

  let debounceHandle: number | undefined;
  const observer = new MutationObserver(() => {
    if (isInboxUrl()) {
      return;
    }
    if (debounceHandle !== undefined) {
      window.clearTimeout(debounceHandle);
    }
    debounceHandle = window.setTimeout(() => {
      expandTaskStoryFeed();
      expandTaskStoryRichText();
    }, 250);
  });
  observer.observe(taskPane, {
    childList: true,
    subtree: true,
  });
  anyWindow.asanaExpanderTaskObserver = observer;
}

function expandTaskPaneWithObserver(): void {
  expandTaskStoryFeed();
  expandTaskStoryRichText();
  ensureTaskObserver();
}

function handleUrlChange(): void {
  const anyWindow = window as AnyWindow;
  const isInbox = isInboxUrl();
  const isTask = isTaskUrl();

  if (isInbox) {
    log("Expand Inbox");
    expandInboxRichText();

    ensureInboxObserver();
  } else if (anyWindow.asanaExpanderInboxObserver) {
    anyWindow.asanaExpanderInboxObserver.disconnect();
    delete anyWindow.asanaExpanderInboxObserver;
  }

  if (isTask) {
    expandTaskPaneWithObserver();
  } else if (anyWindow.asanaExpanderTaskObserver) {
    anyWindow.asanaExpanderTaskObserver.disconnect();
    delete anyWindow.asanaExpanderTaskObserver;
  }
}

function handlePotentialUrlChange(): void {
  const anyWindow = window as AnyWindow;
  const currentUrl = String(window.location);
  if (anyWindow.asanaExpanderLastUrl === currentUrl) {
    return;
  }
  anyWindow.asanaExpanderLastUrl = currentUrl;
  handleUrlChange();
}

function installHistoryHooks(): void {
  const anyWindow = window as AnyWindow;
  if (anyWindow.asanaExpanderHistoryPatched) {
    return;
  }
  anyWindow.asanaExpanderHistoryPatched = true;

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (this: History, ...args: any[]) {
    const result = originalPushState.apply(this, args as any);
    window.dispatchEvent(new Event("asana-expander-urlchange"));
    return result;
  } as typeof history.pushState;

  history.replaceState = function (this: History, ...args: any[]) {
    const result = originalReplaceState.apply(this, args as any);
    window.dispatchEvent(new Event("asana-expander-urlchange"));
    return result;
  } as typeof history.replaceState;

  window.addEventListener("popstate", handlePotentialUrlChange);
  window.addEventListener("hashchange", handlePotentialUrlChange);
  window.addEventListener("asana-expander-urlchange", handlePotentialUrlChange);
}

installHistoryHooks();
handlePotentialUrlChange();

browser.runtime.onMessage.addListener(async request => {
  if (!isExtensionMessage(request)) {
    return;
  }

  if (request.message === "url-changed") {
    handlePotentialUrlChange();
  }
});
