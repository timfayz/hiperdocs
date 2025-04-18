import dom from "../utils/retrov.js";
import acss from "../utils/acss.js";
import theme from "../styles/theme.js";

const page = [
  [
    "div.w-[80%].m-auto.p-20.max-w-[960px]",
    [
      "div.p-10.bg-[#fefefe].rounded-5px.brd-1px-solid-lightgrey",
      ["h1.fz-2rem", `Homepage`],
      ["a", { href: "/editor" }, "[Go to Editor]"],
    ],
  ],
];

dom.render(document.body, page);
acss.apply(theme);
