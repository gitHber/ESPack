require("colors");
const { eventEmitter } = require("./watcher");
const http = require("http");
const WebSocket = require("ws");
const Koa = require("koa");

const staticPlugin = require("./middlewares/static");
const modulePlugin = require("./middlewares/module");
const espackPlugin = require("./middlewares/espack");
const injectHeadPlugin = require("./middlewares/inject-head");

const config = require("./config");
const { getIPAddress, objectToBuffer } = require("./utils/util");
// 清空@modules
// fs.rmdirSync(path.resolve("./@modules"), { recursive: true });

const app = new Koa();

app.use(modulePlugin);
app.use(staticPlugin);
app.use(espackPlugin);
app.use(
  injectHeadPlugin(`
    import "/espack/hmr.js";
    window.__DEV__ = true;
    window.process = {
      env: {NODE_ENV: "development", BASE_URL: "/"}
    }
  `)
);
app.use(async (ctx, next) => {
  await next();
});

app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

const httpServer = http.createServer(app.callback());

// websocket
const wss = new WebSocket.Server({ server: httpServer });
wss.on("connection", function (ws) {
  console.log(
    "--------------- WS Connected Client. ---------------".white.bgGreen
  );
  eventEmitter.on("all", function (msg) {
    ws.send(objectToBuffer(msg));
  });
  ws.on("message", function (message) {
    console.log(`received: ${message}`.green);
  });
});

console.log(
  `
  espack v0.0.1

  Dev server running at:
  > Local:    ${`http://localhost:${config.port}/`.green}
  > Network:  ${`http://${getIPAddress()}:${config.port}/`.green}
  `
);
httpServer.listen(config.port);
