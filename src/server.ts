import app from "./app";
import config from "./config";
import { initDB } from "./db";

function main() {
  initDB();
  app.listen(config.port, () => {
    console.log("app is running  on ", config.port);
  });
}

main();
