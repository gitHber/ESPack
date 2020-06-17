// node_modules 模块打包
const fs = require("fs");
const path = require("path");
const { rollup } = require("rollup");
const commonjs = require("@rollup/plugin-commonjsplugin-commonjs");
const { default: resolve } = require("@rollup/plugin-node-resolve");
const { default: replace } = require("@rollup/plugin-replace");

module.exports = async (ctx, next) => {
  if (ctx.path.startsWith("/@modules/")) {
    const filepath = path.resolve("." + ctx.path);
    if (!fs.existsSync(filepath)) {
      const bundle = await rollup({
        input: ctx.path.slice(10, -3),
        external: ["react", "react-dom"],
        plugins: [
          resolve({
            browser: true,
            dedupe: ["react", "react-dom"],
            mainFields: ["browser", "jsnext", "module", "main"],
          }),
          commonjs({
            namedExports: {
              react: [
                "Children",
                "Component",
                "Fragment",
                "Profiler",
                "PureComponent",
                "StrictMode",
                "Suspense",
                "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED",
                "cloneElement",
                "createContext",
                "createElement",
                "createFactory",
                "createRef",
                "forwardRef",
                "isValidElement",
                "lazy",
                "memo",
                "useCallback",
                "useContext",
                "useDebugValue",
                "useEffect",
                "useImperativeHandle",
                "useLayoutEffect",
                "useMemo",
                "useReducer",
                "useRef",
                "useState",
                "version",
              ],
              "react-dom": [
                "render",
                "findDOMNode",
                "unmountComponentAtNode",
                "createPortal",
                "flushSync",
                "hydrate",
                "unstable_batchedUpdates",
                "unstable_createPortal",
                "unstable_renderSubtreeIntoContainer",
                "version",
              ],
              "react-is": [
                "AsyncMode",
                "ConcurrentMode",
                "ContextConsumer",
                "ContextProvider",
                "Element",
                "ForwardRef",
                "Fragment",
                "Lazy",
                "Memo",
                "Portal",
                "Profiler",
                "StrictMode",
                "Suspense",
                "isAsyncMode",
                "isConcurrentMode",
                "isContextConsumer",
                "isContextProvider",
                "isElement",
                "isForwardRef",
                "isFragment",
                "isLazy",
                "isMemo",
                "isPortal",
                "isProfiler",
                "isStrictMode",
                "isSuspense",
                "isValidElementType",
                "typeOf",
              ],
            },
          }),
          replace({ "process.env.NODE_ENV": JSON.stringify("development") }),
        ],
      });

      await bundle.write({
        file: filepath,
        format: "esm",
        paths: {
          react: "/@modules/react.js",
          "react-dom": "/@modules/react-dom.js",
        },
      });
    }
  }
  await next();
};
