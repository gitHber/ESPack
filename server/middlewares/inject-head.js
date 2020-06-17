const fs = require("fs");
const path = require("path");

module.exports = (script) => async (ctx, next) => {
  if (ctx.path === "/" || ctx.path.endsWith(".html")) {
    const filepath = path.resolve(
      ctx.path === "/" ? "./index.html" : `.${ctx.path}`
    );
    let code = fs.readFileSync(filepath).toString("utf8");
    let index = code.indexOf("<head>");
    code =
      code.slice(0, index) +
      `
      <script type="module">
        ${script}
      </script>
    ` +
      code.slice(index);
    ctx.body = code;
  }
  await next();
};
