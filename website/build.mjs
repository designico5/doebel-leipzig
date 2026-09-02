import { cpSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
const rootFiles = [
  "_headers",
  "_redirects",
  "404.html",
  "altbausanierung-leipzig.html",
  "datenschutz.html",
  "favicon.svg",
  "fussbodenheizung-leipzig.html",
  "heizungsbau-leipzig.html",
  "impressum.html",
  "index.html",
  "kaeltetechnik-leipzig.html",
  "kuehlnotdienst-leipzig.html",
  "llms.txt",
  "lueftungsbau-leipzig.html",
  "og.jpg",
  "robots.txt",
  "sitemap.xml",
];
const directories = ["css", "img", "js"];

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const file of rootFiles) cpSync(join(root, file), join(dist, file));
for (const directory of directories) {
  cpSync(join(root, directory), join(dist, directory), { recursive: true });
}

const countFiles = (directory) => readdirSync(directory).reduce((total, entry) => {
  const target = join(directory, entry);
  return total + (statSync(target).isDirectory() ? countFiles(target) : 1);
}, 0);

console.log(`Static production build: ${countFiles(dist)} files → dist/`);
