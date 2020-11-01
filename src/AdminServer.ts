import express from "express";
import fs from "fs";
import path from "path";
import http from "http";
import os from "os";

import { Backup } from "./Backup";
import { AdminServerOptions } from "./interfaces";

const USER_CONFIG_FILE = path.resolve(os.homedir(), "jlg-backup.json");

export class AdminServer {
  options: AdminServerOptions = {
    port: 3000,

    local: path.resolve("D:\\_backup_local"),
    remote: path.resolve("D:\\_backup_remote"),
  };
  constructor(opts: Partial<AdminServerOptions> = {}) {
    try {
      const str = fs.readFileSync(USER_CONFIG_FILE, { encoding: "utf8" });
      const json = JSON.parse(str);
      this.options = { ...this.options, ...json };
    } catch (e) {}

    this.options = { ...this.options, ...opts };
    console.log("this.options: ", this.options);
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      const app = express();

      app.get("/", (req, res) => res.send("Hello World!"));

      const server = http.createServer(app);
      server.listen(this.options.port, () => {
        console.log(
          `Example app listening at http://localhost:${this.options.port}`
        );
        const backup = new Backup(this.options);
        backup.start();
        resolve();
      });
      server.on("error", (e) => {
        reject(e);
      });
    });
  }
}
