module.exports = function ({ types: t }) {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const { prefix, suffix } = state.opts;
        if (!prefix) {
          throw path.buildCodeFrameError(
            "babel-plugin-import-to-relative config prefix is required!"
          );
        }
        if (!/^(\.|\/)/g.test(prefix)) {
          throw path.buildCodeFrameError(
            "babel-plugin-import-to-relative config prefix must start . or /!"
          );
        }
        const sourcePath = path.get("source");
        const sourceName = sourcePath.node.value;
        if (/^(\.|\/)/g.test(sourceName)) {
          return;
        }
        sourcePath.replaceWith(t.stringLiteral(prefix + sourceName + suffix));
      },
    },
  };
};
