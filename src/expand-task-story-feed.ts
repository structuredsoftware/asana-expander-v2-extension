import { $$ } from "./utils";
import { log } from "./logger";

export function expandTaskStoryFeed(): void {
  const storyFeed = document.querySelector<HTMLElement>(".TaskStoryFeed");
  if (!storyFeed) {
    return;
  }
  for (const link of $$(".TaskStoryFeed-expandLink", storyFeed).filter(
    (el) => !el.dataset.asanaExpanderClicked,
  )) {
    log("Expand Story Feed", link);
    link.dataset.asanaExpanderClicked = "true";
    link.click();
  }
}
