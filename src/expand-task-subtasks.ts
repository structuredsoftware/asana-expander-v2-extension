import { $$ } from "./utils";
import { log } from "./logger";

export function expandTaskSubtasks(): void {
  const subtasksGrid = document.querySelector<HTMLElement>(
    ".TaskPaneSubtasks-grid",
  );
  if (!subtasksGrid) {
    return;
  }

  const loadMoreLinks = $$(".SubtaskGrid-loadMore", subtasksGrid).filter(
    (el) => !el.dataset.asanaExpanderClicked,
  );

  for (const link of loadMoreLinks) {
    link.dataset.asanaExpanderClicked = "true";
    log("Expand Task Subtasks", link);
    link.click();
  }
}
