import { $$ } from "./utils";
import { log } from "./logger";

export function expandTaskStoryRichText(): void {
  const storyFeed = document.querySelector<HTMLElement>(".TaskStoryFeed");
  if (!storyFeed) {
    return;
  }
  for (const link of $$(".TruncatedRichText--truncated", storyFeed).filter(
    (el) => !el.dataset.asanaExpanderClicked,
  )) {
    log("Expand Rich Text", link);
    link.dataset.asanaExpanderClicked = "true";
    link.click();
  }
}
