/**
 * Default theme
 */

/**
 * Typography
 */

const systemSans =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

const systemMono =
  '"SF Mono", SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

const fontRules = {
  vars: {
    "system-mono": systemMono,
    "system-sans": systemSans,
  },
};

/**
 * Responsive
 */

const breakpoints = {
  // step ~14rem
  sm: "34rem", // 544px
  md: "48rem", // 768px
  lg: "62rem", // 992px
  xl: "75rem", // 1200px
};

const queryRules = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  touch: ".touch",
  root: "",
};

/**
 * Color palette
 */

const paletteSpec = {
  colors: {
    // H S L
    red: [0, 58, 60],
    blue: [207.3, 86.3, 57.06],
    green: [130.8, 50.39, 50.2],
    yellow: [45, 90, 62],
    gray: [210, 8, 71],
    violet: [255, 62, 62],
  },
  shades: [
    //   H     S      L
    [1, [-1, 20, 38]],
    [2, [-1.5, 15, 32]],
    [3, [-1, 10, 16]],
    [4, [-0.5, 5, 8]],
    [5, [0, 0, 0]],
    [6, [0.5, -5, -5]],
    [7, [1, -10, -10]],
    [8, [1.5, -15, -15]],
  ],
};

/**
 * Given a palette specification, generates a color palette from base named colors.
 *
 * Returns an object of the form
 * {
 *   green-100: colorValue,
 *   green-200: colorValue,
 *   ...
 * }
 *
 */
function generatePalette(paletteSpec) {
  const palette = {};
  const shades = paletteSpec.shades;

  // iterate over each color
  for (const colorName in paletteSpec.colors) {
    const baseColor = paletteSpec.colors[colorName];

    // iterate over each shade
    for (let i = 0; i < shades.length; i++) {
      const shadeColor = baseColor.slice();
      const diff = shades[i][1];

      // adjust H S L channels
      shadeColor[0] = Math.max(0, baseColor[0] + diff[0]); // Hue
      shadeColor[1] = Math.max(0, Math.min(100, baseColor[1] + diff[1])); // Saturation
      shadeColor[2] = Math.max(0, Math.min(100, baseColor[2] + diff[2])); // Lightness

      const shadeId = shades[i][0];
      palette[colorName + "-" + shadeId] =
        "hsl(" +
        shadeColor[0] +
        " " +
        shadeColor[1] +
        " " +
        shadeColor[2] +
        ")";
    }
  }
  return palette;
}

const palette = generatePalette(paletteSpec);

/**
 * Shadows
 */

const shadows = {
  "2xs": "0 1px rgb(0 0 0 / 0.05)",
  xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  sm: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
};

/**
 * Sizing
 */

const spacing = 0.25; // rem

const spacingRules = {
  vars: {
    xl: "10rem",
    sm: "1rem",
  },
  rules: [{ match: /(\d+)/, replace: ([, d]) => `${d * spacing}rem` }],
};

/**
 * Combined theme rules
 */

const theme = {
  queries: queryRules,
  palette: palette,
  vars: { ...palette },
  font: fontRules,
  padding: spacingRules,
  margin: spacingRules,
  height: spacingRules,
  width: spacingRules,
};

export default theme;
