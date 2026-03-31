import { $$ } from "./utils";
import { log } from "./logger";

export function expandTaskProjects(): void {
  const projectsRoot = document.querySelector<HTMLElement>(".TaskProjects");
  const taskPane = document.querySelector<HTMLElement>(".TaskPane");
  if (!projectsRoot && !taskPane) {
    return;
  }

  const projectToggles = projectsRoot
    ? $$(".TaskProjectWithCustomPropertyRows-toggleButton", projectsRoot)
        .filter((el) => el.getAttribute("aria-label") === "Expand fields")
        .filter((el) => !el.dataset.asanaExpanderClicked)
    : [];
  const loadMoreToggles = $$(".TaskPaneFields-loadMore", taskPane ?? document)
    .filter((el) => !el.dataset.asanaExpanderClicked)
    .filter((el) => el.textContent?.includes("Show inherited fields"));

  for (const toggle of projectToggles) {
    toggle.dataset.asanaExpanderClicked = "true";
    log("Expand Task Projects", toggle);
    toggle.click();
  }

  for (const toggle of loadMoreToggles) {
    toggle.dataset.asanaExpanderClicked = "true";
    log("Expand Task Project Fields", toggle);
    toggle.click();
    toggle.blur();
  }

  const customFieldToggles = projectsRoot
    ? $$(".TaskPaneFields-showMoreCustomFields", projectsRoot).filter(
        (el) => !el.dataset.asanaExpanderClicked,
      )
        .filter((el) => !el.textContent?.includes("Hide custom fields"))
    : [];

  for (const toggle of customFieldToggles) {
    toggle.dataset.asanaExpanderClicked = "true";
    log("Expand Task Project Custom Fields", toggle);
    toggle.click();
    toggle.blur();
  }
}
