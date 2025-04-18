function replaceAttr(selector: string, src: string) {
  return new HTMLRewriter().on(selector, {
    element(el) {
      el.setAttribute("src", src);
    },
  });
}

async function generateTemplate(input: string, output: string, href: string) {
  const target = await Bun.file(input).text();
  Bun.write(output, replaceAttr("body > script", href).transform(target));
}

console.log(process.cwd());

generateTemplate(
  "./src/frontend/pages/home.html",
  "./src/frontend/pages/editor.html",
  "../components/editor.js"
);
