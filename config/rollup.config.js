import commonjsPlugin from "@rollup/plugin-commonjs";
import resolvePlugin from "@rollup/plugin-node-resolve";
import replacePlugin from "@rollup/plugin-replace";
import typescriptPlugin from "rollup-plugin-typescript";
import sourcemapsPlugin from "rollup-plugin-sourcemaps";
import htmlPlugin, { makeHtmlAttributes } from "@rollup/plugin-html";

import { resolve } from "path";

export default {
  input: resolve("src/index.tsx"),
  output: {
    file: "dist/bundle.js",
    format: "es",
  },
  plugins: [
    resolvePlugin({
      browser: true,
      dedupe: ["react", "react-dom"],
      mainFields: ["browser", "jsnext", "module", "main"],
    }),
    commonjsPlugin(),
    replacePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
    sourcemapsPlugin(),
    typescriptPlugin({
      exclude: "node_modules/**",
      typescript: require("typescript"),
    }),
    htmlPlugin({
      title: "espack demo",
      plublicPath: resolve("espack"),
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      ],
      template: ({ attributes, bundle, files, meta, publicPath, title }) => `
        <!DOCTYPE html>
        <html ${makeHtmlAttributes(attributes.html)}>
          <head>
            <link rel="icon" href="/favicon.ico" />
            ${meta
              .map(
                (item) =>
                  `<meta ${Object.entries(item)
                    .map((e) => `${e[0]}="${e[1]}"`)
                    .join(" ")}/>`
              )
              .join("\n")}
            <title>${title}</title>
          </head>
          <body>
            <div id="root"></div>
            <script src="bundle.js" type="module"></script>
          </body>
        </html>      
        `,
    }),
  ],
};
