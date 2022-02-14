const { cwd, readDir, readFile, stat } = Deno;
import Aqua from "https://deno.land/x/aqua/deploy.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import { renderFileToString } from "https://deno.land/x/dejs/mod.ts";
import { Marked } from "https://deno.land/x/markdown@v2.0.0/mod.ts";

const app = new Aqua();

// console.log("listen server http://localhost:3100")

interface DirTree {
  [name: string]: any;
}

app.get("/", async (req) => {
  const startDir = `./pages`;
  const dirTree: DirTree = {};

  for await (const dirEntry of readDir(startDir)) {
    if (dirEntry.isDirectory) {
      let files = [];
      for await (const file of readDir(path.join(startDir, dirEntry.name))) {
        const fileInfo = {
          name: file.name,
          info: await stat(path.join(startDir, dirEntry.name, file.name))
        }
        files.push(fileInfo);
      }
      dirTree[dirEntry.name] = files;
    }
  }

  const output = await renderFileToString(`./views/index.ejs`, {
    title: "home",
    body: dirTree
  });

  console.log(output);

  return {
    content: output,
    headers: {
      "Content-Type": "text/html"
    }
  };
});

app.get("/:category/:page", async (req) => {
  const category = req.parameters.category;
  const page = req.parameters.page;
  const filePath = `./pages/${category}/${page}.md`;

  const decoder = new TextDecoder("utf-8");
  const markdown = decoder.decode(await readFile(filePath));
  const markup = Marked.parse(markdown);

  const output = await renderFileToString(`./views/pagesBase.ejs`, {
    title: page,
    body: markup.content
  });
  
  return {
    content: output,
    headers: {
      "Content-Type": "text/html"
    }
  };
});
