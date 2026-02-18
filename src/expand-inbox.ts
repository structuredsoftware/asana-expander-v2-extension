import { $$ } from "./utils";
import { log } from "./logger";

export function expandInboxRichText(): void {
  const inboxRoot = document.querySelector<HTMLElement>(".InboxFeed");
  if (!inboxRoot) {
    return;
  }

  const showMoreElements = $$(".TruncatedRichText-expand", inboxRoot).filter(
    (el) => !el.dataset.asanaExpanderClicked,
  );

  if (showMoreElements.length === 0) {
    return;
  }

  for (const link of showMoreElements) {
    link.dataset.asanaExpanderClicked = "true";
    log("Expand Inbox", link);
    link.click();
  }
}
