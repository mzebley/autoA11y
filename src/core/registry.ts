type PatternInit = (rootOrEl?: ParentNode | Element) => void;

const patterns: Record<string, { selector: string; init: PatternInit }> = {};

export function registerPattern(name: string, selector: string, init: PatternInit) {
  patterns[name] = { selector, init };
}

export function initAllPatterns(root: ParentNode = document) {
  for (const key in patterns) {
    const { selector, init } = patterns[key];
    root.querySelectorAll(selector).forEach(el => init(el as Element));
  }
}