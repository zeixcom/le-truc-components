import {
  asString,
  createTask,
  dangerouslyBindInnerHTML,
  defineComponent,
  observedAttributes,
  schedule,
} from "@zeix/le-truc";
import {
  fetchWithCache,
  isRecursiveURL,
  isValidURL,
} from "../../_common/fetchWithCache";

export type ModuleLazyloadProps = {
  /** URL of the HTML fragment to fetch and inject. Setting a new value re-fetches. */
  src: string;
};

declare global {
  interface HTMLElementTagNameMap {
    "module-lazyload": HTMLElement & ModuleLazyloadProps;
  }
}

/**
 * Fetches an HTML fragment from `src` and injects it into a `.content`
 * descendant, showing loading, error, and stale (dimmed, mid-refetch)
 * states via `card-callout`/`.loading`/`.error` descendants. Guards against
 * invalid and recursive URLs (a fragment pointing back at its own page) and
 * caches fetched fragments; after the first successful load, subsequent
 * loads smooth-scroll to the fragment's first heading. Injected markup is
 * sanitized unless the host has an `allow-scripts` attribute, which permits
 * `<script>` execution — use only with trusted content.
 * @attribute {boolean} [allow-scripts=false] - When present, allows `<script>` elements in the fetched fragment to execute. Read once at connect time.
 * @demo {https://zeixcom.github.io/le-truc/examples.html#module-lazyload} Interactive preview and usage examples
 */
export default defineComponent<ModuleLazyloadProps>(
  "module-lazyload",
  ({ expose, first, host, watch }) => {
    const contentEl = first(".content", "Needed to display content.");

    const content = createTask<string>(async (_prev, abort) => {
      const url = host.src;
      if (!url) throw new Error("No URL provided");
      if (!isValidURL(url)) throw new Error("Invalid URL");
      if (isRecursiveURL(url, host)) throw new Error("Recursive URL detected");
      try {
        const { content: fetched } = await fetchWithCache(url, abort);
        return fetched;
      } catch (e) {
        throw new Error(`Failed to fetch content for "${url}": ${String(e)}`);
      }
    });

    const { ok: setHTML } = dangerouslyBindInnerHTML(contentEl, {
      allowScripts: host.hasAttribute("allow-scripts"),
    });

    expose({ src: asString() });

    // Skip the scroll-to-heading on the very first load, so the page
    // doesn't jump on initial mount — only on subsequent src changes.
    let hasLoaded = false;
    // Distinct key from `contentEl` (used by dangerouslyBindInnerHTML above)
    // so this scroll task doesn't clobber the pending innerHTML write.
    const scrollTask = {};

    const callout = first(
      "card-callout",
      "Needed to display loading state and error messages.",
    );
    const loading = first(".loading", "Needed to display loading state.");
    const errorEl = first(".error", "Needed to display error messages.");
    watch(content, {
      ok: (content) => {
        callout.hidden = true;
        loading.hidden = true;
        contentEl.hidden = false;
        setHTML(content);

        if (hasLoaded) {
          schedule(scrollTask, () => {
            contentEl
              .querySelector("h1, h2, h3, h4, h5, h6")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }
        hasLoaded = true;
      },
      nil: () => {
        callout.hidden = false;
        loading.hidden = false;
        contentEl.hidden = true;
      },
      stale: () => {
        contentEl.style.setProperty("opacity", "var(--opacity-dimmed)");
        return () => {
          contentEl.style.removeProperty("opacity");
        };
      },
      err: (error) => {
        callout.hidden = false;
        callout.classList.add("danger");
        loading.hidden = true;
        errorEl.hidden = false;
        errorEl.textContent = error.message;
        contentEl.hidden = true;
        return () => {
          callout.classList.remove("danger");
          errorEl.hidden = true;
          errorEl.textContent = "";
        };
      },
    });
  },
  [observedAttributes(["src"])],
);
