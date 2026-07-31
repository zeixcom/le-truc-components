import { createState, defineComponent } from "@zeix/le-truc";

export type ModuleTabgroupProps = {
  readonly selected: string;
};

declare global {
  interface HTMLElementTagNameMap {
    "module-tabgroup": HTMLElement & ModuleTabgroupProps;
  }
}

const getAriaControls = (element: HTMLElement) =>
  element.getAttribute("aria-controls") ?? "";

const getSelected = (
  tabs: HTMLElement[],
  isCurrent: (element: HTMLElement) => boolean,
  offset = 0,
) => {
  const currentIndex = tabs.findIndex(isCurrent);
  const newIndex = (currentIndex + offset + tabs.length) % tabs.length;
  // biome-ignore lint/style/noNonNullAssertion: newIndex is always within bounds — all() requires at least 2 tabs, and modulo keeps the index in [0, tabs.length).
  return getAriaControls(tabs[newIndex]!);
};

export default defineComponent<ModuleTabgroupProps>(
  "module-tabgroup",
  ({ all, expose, host, on, watch }) => {
    const tabs = all(
      'button[role="tab"]',
      'At least 2 tabs as children of a <[role="tablist"]> element are needed. Each tab must reference a unique id of a <[role="tabpanel"]> element.',
    );

    const isCurrentTab = (tab: HTMLButtonElement) =>
      host.selected === tab.getAttribute("aria-controls");

    // Private mutable state; expose as read-only via Memo so external code can't set it
    const selectedState = createState(
      getSelected(tabs.get(), (tab) => tab.ariaSelected === "true"),
    );

    expose({ selected: selectedState.get });

    on(tabs, "click", (_e, target) => {
      selectedState.set(getAriaControls(target));
    });
    on(tabs, "keyup", (e, target) => {
      const key = e.key;
      if (
        [
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "Home",
          "End",
        ].includes(key)
      ) {
        e.preventDefault();
        e.stopPropagation();
        const tabsList = tabs.get();
        const next =
          key === "Home"
            ? // biome-ignore lint/style/noNonNullAssertion: tabsList is always non-empty — all() requires at least 2 tabs.
              getAriaControls(tabsList[0]!)
            : key === "End"
              ? // biome-ignore lint/style/noNonNullAssertion: tabsList is always non-empty — all() requires at least 2 tabs.
                getAriaControls(tabsList[tabsList.length - 1]!)
              : getSelected(
                  tabsList,
                  (tab) => tab === target,
                  key === "ArrowLeft" || key === "ArrowUp" ? -1 : 1,
                );
        // biome-ignore lint/style/noNonNullAssertion: next was derived from tabsList itself, so a matching tab always exists.
        tabsList.filter((tab) => getAriaControls(tab) === next)[0]!.focus();
        selectedState.set(next);
      }
    });

    const panels = all(
      '[role="tabpanel"]',
      "At least 2 tabpanels are needed. Each tabpanel must have a unique id.",
    );
    watch("selected", () => {
      for (const tab of tabs.get()) {
        tab.ariaSelected = String(isCurrentTab(tab));
        tab.tabIndex = isCurrentTab(tab) ? 0 : -1;
      }
      for (const panel of panels.get()) {
        panel.hidden = host.selected !== panel.id;
      }
    });
  },
);
