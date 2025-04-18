// MIT License (c) Timur Fayzrakhmanov.
// tim.fayzrakhmanov@gmail.com (github.com/timfayz)

/**
 * Public API:
 * - apply: Shortcut for emitting and attaching CSS to the document's <head>.
 * - getClassListFrom: Extracts a class list from an element.
 * - emitCssFromClassList: Emits CSS for a given class list.
 * - attachCssToDocument: Attaches CSS to the document (default) or node.
 */

export default {
  apply,
  emitCssFromClassList,
  attachCssToDocument,
  getClassListFrom,
};

export function apply(theme = false) {
  const list = getClassListFrom(document.body);
  const css = emitCssFromClassList(list, theme);
  attachCssToDocument(css);
}

const classShortcuts = {
  // TODO allow multiple values
  block: { property: ["display"], value: "block" },
  inline: { property: ["display"], value: "inline" },
  hidden: { property: ["display"], value: "hidden" },
  flex: { property: ["display"], value: "flex" },
  wrap: { property: ["flex-wrap"], value: "wrap" },
  "flex-wrap": { property: ["flex-wrap"], value: "wrap" },
  break: { property: ["flex-basis"], value: "100%" },
};

const propertyShortcuts = {
  // Layout
  // ----------
  dsp: ["display"],
  vsb: ["visibility"],
  pos: ["position"],
  t: ["top"],
  b: ["bottom"],
  l: ["left"],
  r: ["right"],

  // Grid
  // ----------
  flex: ["flex"],

  // Spacing
  // ----------
  p: ["padding"],
  "p-t": ["padding-top"],
  "p-b": ["padding-bottom"],
  "p-l": ["padding-left"],
  "p-r": ["padding-right"],
  "p-tb": ["padding-top", "padding-bottom"],
  "p-lr": ["padding-left", "padding-right"],

  m: ["margin"],
  "m-t": ["margin-top"],
  "m-b": ["margin-bottom"],
  "m-l": ["margin-left"],
  "m-r": ["margin-right"],
  "m-tb": ["margin-top", "margin-bottom"],
  "m-lr": ["margin-left", "margin-right"],

  // Sizing
  // ----------
  w: ["width"],
  "min-w": ["min-width"],
  "max-w": ["max-width"],

  h: ["height"],
  "min-h": ["min-height"],
  "max-h": ["max-height"],

  // Typography
  // ----------
  c: ["color"],
  fz: ["font-size"],
  fs: ["font-style"],
  font: ["font-family"],

  // Background
  // ----------
  bg: ["background"],

  // Border
  // ----------
  brd: ["border"],
  rounded: ["border-radius"],
  "brd-r": ["border-right-style"],
};

// Dynamically generated map of allowed (p-, m-, w-) class words
const classWordsAllowed = {};
objectKeysToWordList(propertyShortcuts)
  .keys()
  .reduce((acc, key) => {
    acc[key] = true;
    return acc;
  }, classWordsAllowed);

function objectKeysToWordList(object) {
  const arr = [];
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    arr.push(...key.split("-"));
  }
  return new Set(arr);
}

export function emitCssFromClassList(classNames, theme = false) {
  const ast = {};
  const classes = Array.isArray(classNames) ? classNames : [...classNames];
  for (let i = 0; i < classes.length; i++) {
    const className = classes[i];
    const node = parseClassName(className, theme);
    if (!node) continue;
    ast[className] = node;
  }

  if (theme) {
    return renderCss(ast, theme);
  } else {
    return renderCss(ast, { queries: { root: "" } });
  }
}

/**
 * Parses a class-like string (e.g., 'mobile@hover:first-child::c-blue').
 *
 * Returns an object with the following structure:
 * {
 *   mediaQuery='mobile'
 *   className='c-blue'
 *   pseudoClass='hover'
 *   pseudoElement='first-child'
 *   property=['color']
 *   value='blue'
 * }
 */
function parseClassName(className, theme) {
  const [, mediaQuery, pseudoClass, classPayload, rawValue] = className.match(
    /^([a-z]+@)?((?:[a-z]+:)*)([^[]*)(?:\[(.*)\])?$/
  );

  if (!classPayload) return null;
  const node = {};

  const shortcut = classShortcuts[classPayload];
  if (shortcut) {
    Object.assign(node, shortcut);
    node.className = classPayload;
  } else {
    const words = classPayload.split("-");
    let i = 0;
    for (; i < words.length && classWordsAllowed[words[i]]; i++) {}
    if (i === 0 || i == words.length) return null;

    const propertyWords = words.slice(0, i).join("-");
    node.property = propertyShortcuts[propertyWords];
    if (!node.property) return null;

    if (rawValue) {
      node.value = rawValue;
    } else {
      const valueWords = words.slice(i);
      node.value = parseClassValue(valueWords, node.property, theme);
      if (!node.value) node.value = valueWords.join(" ");
    }
    node.className = classPayload;
  }

  node.mediaQuery = mediaQuery ? mediaQuery.slice(0, -1) : "root";
  if (pseudoClass) node.pseudoClass = pseudoClass.slice(0, -1);

  return node;
}

function parseClassValue(valueWords, property, theme) {
  const value = valueWords.join("-");

  const valFromVars = theme.vars?.[value];
  if (valFromVars) return valFromVars;

  const baseProperty = property[0].split("-", 1)[0];

  const propertyTheme = theme[baseProperty];
  if (!propertyTheme) return null;

  const valFromPropVars = propertyTheme.vars?.[value];
  if (valFromPropVars) return valFromPropVars;

  const rules = propertyTheme.rules;
  if (!rules) return null;

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    const match = value.match(rule.match);
    if (match) return rule.replace(match);
  }

  return null;
}

function renderCss(ast, theme) {
  const mediaQueries = theme["queries"] ?? { root: "" };
  const queryStringToCss = {};

  const queryList = Object.values(mediaQueries);
  for (let i = 0; i < queryList.length; i++) {
    const query = queryList[i];
    queryStringToCss[query] = [];
  }

  for (const className in ast) {
    const node = ast[className];
    const queryString = mediaQueries[node.mediaQuery];
    const target = queryStringToCss[queryString];
    if (target === undefined) continue; // ignore node with non-defined query

    // special case: .class-based media query
    if (queryString.startsWith(".")) {
      target.push(queryString + " ");
    }

    // class name
    target.push("." + CSS.escape(className));
    if (node.pseudoClass) target.push(":" + node.pseudoClass);
    target.push("{");

    // properties
    const value = node.value;
    for (let i = 0; i < node.property.length; i++) {
      target.push(node.property[i] + ":" + value + ";");
    }

    // end
    target.push("}\n");
  }
  return renderWithinQueries(queryStringToCss);
}

function renderWithinQueries(queryStringToCss) {
  const result = [];
  for (const queryString in queryStringToCss) {
    const css = queryStringToCss[queryString];
    if (css.length == 0) continue;

    const cssRendered = css.join("");
    if (queryString === "" || queryString.startsWith(".")) {
      result.push(cssRendered);
    } else {
      result.push(queryString + "{\n");
      result.push(cssRendered);
      result.push("}\n\n");
    }
  }
  return result.join("");
}

export function attachCssToDocument(css, target = false) {
  const styleEl = document.createElement("style");
  styleEl.textContent = css;
  if (target) {
    target.appendChild(styleEl);
  } else {
    document.head.appendChild(styleEl);
  }
}

export function getClassListFrom(node, includeSelf = true) {
  const classSet = new Set();
  if (includeSelf) {
    const self = node.classList;
    for (let i = 0; i < self.length; i++) {
      classSet.add(self[i]);
    }
  }
  const elements = node.getElementsByTagName("*");
  for (let i = 0; i < elements.length; i++) {
    const elm = elements[i];
    const elmClassList = elm.classList;
    if (elmClassList.length == 0) continue;
    for (let i = 0; i < elmClassList.length; i++) {
      classSet.add(elmClassList[i]);
    }
  }
  return classSet;
}

// console.time("getClassListFrom");
// for (let i = 0; i < 1_000_000; i++) {
//   const x = getClassListFrom(document.body);
// }
// console.timeEnd("getClassListFrom");
