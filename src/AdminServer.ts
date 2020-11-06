import express from "express";
import serveIndex from "serve-index";
import fs from "fs";
import path from "path";
import http from "http";
import WebSocket from "ws";

import { BackupWebSocket } from "./BackupWebSocket";
import { ws } from "./ws";

import { Backup, USER_CONFIG_FILE } from "./Backup";
import { BackupOptions } from "./interfaces";

export class AdminServer {
  options: BackupOptions = {
    $schema: "",
    sh: path.resolve("C:\\Program Files\\Git\\bin\\sh.exe"),
    intervalInSecond: 3600,
    local: "",
    remote: "",
    git: {},
    port: 55555,
  };
  constructor(opts: Partial<BackupOptions> = {}) {
    console.log("USER_CONFIG_FILE: ", USER_CONFIG_FILE);
    try {
      const str = fs.readFileSync(USER_CONFIG_FILE, { encoding: "utf8" });
      const json = JSON.parse(str) as Partial<BackupOptions>;
      delete json.$schema;
      this.options = { ...this.options, ...json };
    } catch (e) {
      console.log("e: ", e);
    }

    this.options = { ...this.options, ...opts };
    console.log("this.options: ", this.options);
  }

  start(): Promise<void> {
    const app = express();
    const server = http.createServer(app);
    const backupWs = new BackupWebSocket(server);

    const backup = new Backup(this.options);
    backup.backupWs = backupWs;
    app.use("/ws", ws(backup));

    const www = path.resolve(__dirname, "../static");
    app.use(express.static(www));
    app.use(serveIndex(www, { icons: true }));

    return new Promise((resolve, reject) => {
      server.listen(this.options.port, () => {
        console.log(
          `Example app listening at http://localhost:${this.options.port}`
        );
        backup.start();
        resolve();
      });
      server.on("error", (e) => {
        reject(e);
      });
    });
  }
}
