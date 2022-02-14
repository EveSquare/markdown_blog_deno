/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { h, jsx, serve } from "https://deno.land/x/sift@0.4.3/mod.ts";
import { Marked } from "https://deno.land/x/markdown@v2.0.0/mod.ts";
const { cwd, stdout, copy } = Deno;


const App = () => (
  <div>
    <h1>Hello world!</h1>
  </div>
);

const Head = () => (
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>evesq doc</title>
    <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css" />
  </head>
)

const Page = (props) => (
  <div>
    <Head />
    <main dangerouslySetInnerHTML={{__html: props.body}} ></main>
  </div>
)

const NotFound = () => (
  <div>
    <h1>Page not found</h1>
  </div>
);

serve({
  "/": () => jsx(<App />),
  "/:category/:page": async (request, params) => {
    const category = params.category;
    const page = params.page;
    const filePath = `${cwd()}/pages/${category}/${page}.md`;

    const decoder = new TextDecoder("utf-8");
    const markdown = decoder.decode(await Deno.readFile(filePath));
    const markup = Marked.parse(markdown);

    return jsx(
    <Page 
      body={markup.content}
    />,
    {
      headers: new Headers(<meta charset="UTF-8" />),
    }
    )
  },
  404: () => jsx(<NotFound />, { status: 404 }),
});