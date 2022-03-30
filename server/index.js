const storage = require("./storage");
const config = require("./config");
const server = require("./server");
const port = process.env.PORT || config.port;

async function init() {
  await storage.init();
  server.listen(port, () => {
    console.log(`Emptyjar is listening on port ${port}`);
  });
}

init();
