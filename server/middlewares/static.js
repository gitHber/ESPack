const fs = require("fs");
const path = require("path");
const hash = require("../utils/hash");
const transformJS = require("../utils/transformjs");

const ContentTypes = {
  ".html": "text/html;charset=UTF-8",
  ".css": "text/css;charset=UTF-8",
  ".js": "text/javascript;charset=UTF-8",
  ".ts": "text/javascript;charset=UTF-8",
  ".tsx": "text/javascript;charset=UTF-8",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/vnd.microsoft.icon",
};

module.exports = async (ctx, next) => {
  let ext = path.extname(ctx.path);
  if (ContentTypes[ext]) {
    const dir = path.resolve(
      "./",
      ctx.path === "/" ? "./index.html" : `.${ctx.path}`
    );
    let state = fs.statSync(dir);
    let content = fs.readFileSync(dir);
    if (ext === ".ts" || ext === ".tsx") {
      content = await transformJS(content.toString("utf8"), dir);
    }
    ctx.body = content;

    ctx.set("last-modified", state.mtime);
    ctx.set("etag", hash(content));
    ctx.set("Cache-Control", "no-cache");
  }

  await next();
  if (ContentTypes[ext] && !ctx.fresh) {
    ctx.set("content-type", ContentTypes[ext]);
  } else if (ctx.fresh) {
    ctx.status = 304;
    return;
  }
};
