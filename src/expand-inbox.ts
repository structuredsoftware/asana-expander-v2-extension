import { log } from "./logger";

function $$(selector: string, scope: ParentNode = document): HTMLElement[] {
  return Array.from(scope.querySelectorAll<HTMLElement>(selector));
}

export function expandInbox(): void {
  const inboxRoot = document.querySelector(".InboxFeed");
  if (!inboxRoot) {
    return;
  }

  const showMoreElements = $$(".TruncatedRichText-expand", inboxRoot)
    .filter((el) => {
      const text = el.textContent?.trim();
      return text === "See more";
    })
    .filter((el) => !el.dataset.asanaExpanderClicked);

  if (showMoreElements.length === 0) {
    return;
  }

  for (const link of showMoreElements) {
    link.dataset.asanaExpanderClicked = "true";
    log("Expand Inbox", link);
    link.click();
  }
}
