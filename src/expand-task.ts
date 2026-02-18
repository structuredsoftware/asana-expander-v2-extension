import { log } from "./logger";

function $$(
  selector: string,
  scope: ParentNode = document,
): HTMLElement[] {
  return Array.from(scope.querySelectorAll<HTMLElement>(selector));
}

export function expandStoryFeed(): void {
  for (const link of $$(".TaskStoryFeed-expandLink").filter(
    (el) => !el.dataset.asanaExpanderClicked,
  )) {
    log("Expand Story Feed", link);
    link.dataset.asanaExpanderClicked = "true";
    link.click();
  }
}

export function expandRichText(): void {
  for (const link of $$(".TruncatedRichText--truncated").filter(
    (el) => !el.dataset.asanaExpanderClicked,
  )) {
    log("Expand Rich Text", link);
    link.dataset.asanaExpanderClicked = "true";
    link.click();
  }
}
