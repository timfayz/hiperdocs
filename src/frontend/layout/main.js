import RV from "../utils/retrov";
import acss from "../utils/acss.js";
import theme from "../styles/theme.js";

const main = [
  [
    "div.w-[80%].m-auto.p-20.max-w-[960px]",
    [
      "div.c-darkslategray.fz-2rem.p-10.bg-[#f9f9f9].rounded-5px.brd-1px-solid-lightgrey",
      "Hello world!",
    ],
  ],
];

renderMain(document.body);
acss.run(theme);

export function renderMain(node) {
  RV.render(node, main);
}
