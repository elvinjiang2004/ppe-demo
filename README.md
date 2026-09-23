# Personal Projects Explorer

A static, no-build collection of interactive modules for my personal economics
research. MathJax 4 is vendored locally so mathematical typesetting works
offline. The layout and organization follow Mechanism Design Explorer.

**Live site:** https://elvinjiang2004.github.io/ppe-demo/

## Open the site

Open `index.html` in a modern browser. It is the project menu and requires no
installation, local server, or internet connection.

The available module is located at:

    bilateral-trade/lying-cost/index.html

Explicit `index.html` paths are used so navigation works through `file://`.

## Current menu

The menu currently contains one category:

- **Bilateral Trade**
  - [Bilateral Trade with a Lying Cost](bilateral-trade/lying-cost/index.html)

The module explores my September 2026 paper with the same title. The
[paper PDF](assets/papers/Bilateral_Trade_with_a_Lying_Cost.pdf) is included
locally for offline reading.

## Files

- `index.html` — project menu.
- `about.html` — About page, linked from the menu header.
- `bilateral-trade/lying-cost/` — module page, economic model, charts, and controls.
- `styles.css` — ordered entry point for the focused stylesheets in `css/`.
- `css/` — theme, shared page/control styling, chart layouts, and responsive rules.
- `assets/mathjax/` — vendored MathJax 4 TeX-to-SVG build and offline assets.
- `assets/papers/Bilateral_Trade_with_a_Lying_Cost.pdf` — the module's source paper.
- `js/mathjax-config.js` — shared local MathJax configuration.
- `js/mathjax-runtime.js` — shared initial and dynamic MathJax lifecycle.
- `js/math-utils.js` — shared numeric helpers.
- `js/svg-utils.js` — SVG drawing and sampled-field rendering helpers.
- `js/bilateral-trade-visuals.js` — shared chart frames, colors, and probe
  interactions.
- `js/chart-viewport.js` — responsive chart padding.
- `js/trade-demo-style.js` — chart-edge hover behavior.
- `js/components.js` — shared page-header and footer components.
