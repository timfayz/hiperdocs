import fs from "node:fs/promises";

const args = process.argv.slice(2);

// clean
await fs.rm("./out", { recursive: true, force: true });

// build client
if (args.includes("--client")) {
  await Bun.build({
    entrypoints: ["./src/frontend/index.html"],
    outdir: "./out/frontend",
    target: "browser",
    minify: true,
  });
  console.log("client built!");
}

// build server
if (args.includes("--server")) {
  await Bun.build({
    entrypoints: ["./src/server/main.ts"],
    target: "bun",
    outdir: "./out",
  });
  // await Bun.$`bun build --compile src/server/main.ts --outfile ./build/server`;
  console.log("server built!");
}

if (args.includes("--docker")) {
  await Bun.$`nerdctl build -t hiperdocs .`;
}
