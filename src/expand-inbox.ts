import { $$ } from "./utils";
import { log } from "./logger";

export function expandInboxRichText(): void {
  const inboxRoot = document.querySelector<HTMLElement>(".InboxFeed");
  if (!inboxRoot) {
    return;
  }

  for (const link of $$("[role='button']", inboxRoot).filter(
    (el) => !el.dataset.asanaExpanderClicked,
  ).filter((el) => /see more/i.test(el.textContent ?? ""))) {
    link.dataset.asanaExpanderClicked = "true";
    log("Expand Inbox", link);
    link.click();
  }
}
