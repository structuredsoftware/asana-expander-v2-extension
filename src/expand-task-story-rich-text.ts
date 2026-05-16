import { $$ } from "./utils";
import { log } from "./logger";

export function expandTaskStoryRichText(): void {
  const storyFeed = document.querySelector<HTMLElement>(".TaskPane-feed");
  if (!storyFeed) {
    return;
  }
  for (const link of $$("[role='button']", storyFeed).filter(
    (el) => !el.dataset.asanaExpanderClicked,
  ).filter((el) => /see more/i.test(el.textContent ?? ""))) {
    log("Expand Rich Text", link);
    link.dataset.asanaExpanderClicked = "true";
    link.click();
  }
}
