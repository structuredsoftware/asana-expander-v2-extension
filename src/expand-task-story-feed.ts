import { $$ } from "./utils";
import { log } from "./logger";

export function expandTaskStoryFeed(): void {
  const storyFeed = document.querySelector<HTMLElement>(".TaskPane-feed");
  if (!storyFeed) {
    return;
  }
  for (const link of $$("[role='button'][aria-expanded='false']", storyFeed).filter(
    (el) => !el.dataset.asanaExpanderClicked,
  ).filter((el) => /\d+ more comments?/i.test(el.textContent ?? ""))) {
    log("Expand Story Feed", link);
    link.dataset.asanaExpanderClicked = "true";
    link.click();
  }
}
