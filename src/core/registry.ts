type PatternInit = (element: Element) => void;

interface PatternDefinition {
  selector: string;
  init: PatternInit;
  initialized: WeakSet<Element>;
}

const patterns: Record<string, PatternDefinition> = {};

export function registerPattern(name: string, selector: string, init: PatternInit) {
  patterns[name] = {
    selector,
    init,
    initialized: new WeakSet<Element>()
  };
}

function collectMatches(def: PatternDefinition, root: ParentNode | Element): Element[] {
  const nodes: Element[] = [];
  if (root instanceof Element && root.matches(def.selector)) {
    nodes.push(root);
  }
  nodes.push(...Array.from((root as ParentNode).querySelectorAll(def.selector)));
  return nodes;
}

function hydrate(def: PatternDefinition, root: ParentNode | Element) {
  const nodes = collectMatches(def, root);
  for (const node of nodes) {
    if (def.initialized.has(node)) continue;
    def.init(node);
    def.initialized.add(node);
  }
}

export function initPattern(name: string, root: ParentNode | Element = document) {
  const def = patterns[name];
  if (typeof def === "undefined") return;
  hydrate(def, root);
}

export function initPatterns(names: string[], root: ParentNode | Element = document) {
  names.forEach(name => initPattern(name, root));
}

export function initNode(node: Element) {
  for (const name in patterns) {
    hydrate(patterns[name], node);
  }
}

export function initAllPatterns(root: ParentNode | Element = document) {
  for (const name in patterns) {
    hydrate(patterns[name], root);
  }
}
