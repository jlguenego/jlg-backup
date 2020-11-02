import express from "express";
import serveIndex from "serve-index";
import fs from "fs";
import path from "path";
import http from "http";
import os from "os";

import { ws } from "./ws";

import { Backup } from "./Backup";
import { AdminServerOptions, BackupOptions } from "./interfaces";

const USER_CONFIG_FILE = path.resolve(os.homedir(), "jlg-backup.json");

export class AdminServer {
  options: AdminServerOptions = {
    port: 3000,
    intervalInSecond: 3600,
  };
  constructor(opts: Partial<AdminServerOptions> = {}) {
    try {
      const str = fs.readFileSync(USER_CONFIG_FILE, { encoding: "utf8" });
      const json = JSON.parse(str) as AdminServerOptions;
      delete json.$schema;
      this.options = { ...this.options, ...json };
    } catch (e) {}

    this.options = { ...this.options, ...opts };
    console.log("this.options: ", this.options);
  }

  start(): Promise<void> {
    const backup = new Backup(this.options);
    backup.start();

    return new Promise((resolve, reject) => {
      const app = express();
      const www = "./static";

      app.use("/ws", ws(backup));

      app.use(express.static(www));
      app.use(serveIndex(www, { icons: true }));

      const server = http.createServer(app);
      server.listen(this.options.port, () => {
        console.log(
          `Example app listening at http://localhost:${this.options.port}`
        );
        resolve();
      });
      server.on("error", (e) => {
        reject(e);
      });
    });
  }
}
