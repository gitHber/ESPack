// 对ts, js, tsx文件的处理
const { transformAsync } = require("@babel/core");
const path = require("path");

module.exports = async function (originCode, filename) {
  const { code } = await transformAsync(originCode, {
    caller: {
      name: "compiler",
      supportsStaticESM: true,
    },
    sourceMaps: "inline",
    root: path.resolve(),
    filename: filename,
    babelrc: true,
    // presets: ["@babel/preset-typescript"],
  });
  return code;
};
