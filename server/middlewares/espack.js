const fs = require("fs");
const path = require("path");
const config = require("../config");

module.exports = async (ctx, next) => {
  if (ctx.path.startsWith("/espack")) {
    // 处理hmr
    const filepath = path.resolve(`.${ctx.path}`);
    let code = fs.readFileSync(filepath).toString("utf8");
    ctx.body = code.replace("$$PORT", config.port);
  }
  await next();
};
