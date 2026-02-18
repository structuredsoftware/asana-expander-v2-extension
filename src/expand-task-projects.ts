import { $$ } from "./utils";
import { log } from "./logger";

export function expandTaskProjects(): void {
  const projectsRoot = document.querySelector<HTMLElement>(".TaskProjects");
  if (!projectsRoot) {
    return;
  }

  const toggles = $$(".TaskProjectWithCustomPropertyRows-toggleButton", projectsRoot)
    .filter((el) => el.getAttribute("aria-label") === "Expand fields")
    .filter((el) => !el.dataset.asanaExpanderClicked);

  for (const toggle of toggles) {
    toggle.dataset.asanaExpanderClicked = "true";
    log("Expand Task Projects", toggle);
    toggle.click();
  }
}
