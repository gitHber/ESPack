if ("WebSocket" in window) {
  let ws = new WebSocket("ws://localhost:$$PORT");
  ws.onopen = function () {
    ws.send("Client ready.");
    console.log(`[espack connected.]`);
  };
  ws.onmessage = function (evt) {
    evt.data
      .text()
      .then((s) => JSON.parse(s))
      .then((data) => {
        switch (data.type) {
          case "change":
            if (/\.(tsx?|js)$/g.test(data.path)) {
              import(`/${data.path}?t=${Date.now()}`).then((m) => {
                console.log(`HMR: ${data.path}`);
              });
            }
            break;
          case "add":
          case "addDir":
          case "unlink":
          case "unlinkDir":
            break;
        }
      });
  };
  ws.onclose = function () {
    console.error("[espack socket closed!]");
  };
  ws.onerror = function () {
    console.error("[espack socket wrong!]");
  };
}
