import { $$ } from "./utils";
import { log } from "./logger";

export function expandTaskActivityUpdates(): void {
  const storyFeed = document.querySelector<HTMLElement>(".TaskStoryFeed");
  if (!storyFeed) {
    return;
  }

  const links = $$(".TaskStoryFeed-expandMiniStoriesLink", storyFeed).filter(
    (el) => !el.dataset.asanaExpanderClicked,
  );

  for (const link of links) {
    link.dataset.asanaExpanderClicked = "true";
    log("Expand Task Activity Updates", link);
    link.click();
  }
}
