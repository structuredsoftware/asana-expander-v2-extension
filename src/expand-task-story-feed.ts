import { $$ } from "./utils";
import { log } from "./logger";

export function expandTaskStoryFeed(): void {
  const storyFeed = document.querySelector<HTMLElement>(".TaskStoryFeed");
  if (!storyFeed) {
    return;
  }
  for (const link of $$(".TaskStoryFeed-expandLink", storyFeed).filter(
    (el) => !el.dataset.asanaExpanderClicked,
  ).filter((el) => !el.textContent?.includes("Hide earlier comments"))) {
    log("Expand Story Feed", link);
    link.dataset.asanaExpanderClicked = "true";
    link.click();
  }
}
