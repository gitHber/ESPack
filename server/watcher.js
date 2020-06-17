require("colors");
const chokidar = require("chokidar");
const config = require("./config");
const { EventEmitter } = require("events");
const eventEmitter = new EventEmitter();

const watcher = chokidar.watch(config.watch, {
  ignored: /[\/\\]\./,
  persistent: true,
});

watcher
  .on("error", function (error) {
    eventEmitter.emit("error");
    console.error("Error happened".red, error);
  })
  .on("ready", function () {
    eventEmitter.emit("ready");
    console.log("Initial scan complete. Ready for changes.".yellow);
  })
  .on("raw", function (event, path, details) {
    // console.log("Raw event info:".green, event, path, details);
  })
  .on("add", function (path) {
    console.log(`[watcher] add: ${path}`.blue);
    eventEmitter.emit("add", {
      type: "add",
      path,
    });
    eventEmitter.emit("all", {
      type: "add",
      path,
    });
  })
  .on("addDir", function (path) {
    console.log(`[watcher] addDir: ${path}`.blue);
    eventEmitter.emit("addDir", {
      type: "addDir",
      path,
    });
    eventEmitter.emit("all", {
      type: "addDir",
      path,
    });
  })
  .on("change", function (path) {
    console.log(`[watcher] change: ${path}`.blue);
    eventEmitter.emit("change", {
      type: "change",
      path,
    });
    eventEmitter.emit("all", {
      type: "change",
      path,
    });
  })
  .on("unlink", function (path) {
    console.log(`[watcher] unlink: ${path}`.blue);
    eventEmitter.emit("unlink", {
      type: "unlink",
      path,
    });
    eventEmitter.emit("all", {
      type: "unlink",
      path,
    });
  })
  .on("unlinkDir", function (path) {
    console.log(`[watcher] unlinkDir: ${path}`.blue);
    eventEmitter.emit("unlinkDir", {
      type: "unlinkDir",
      path,
    });
    eventEmitter.emit("all", {
      type: "unlinkDir",
      path,
    });
  });
module.exports = { watcher, eventEmitter };
