import fs from "fs";
import path from "path";
import os from "os";

import { cmd, dirToURI, exists, sleep } from "./misc";
import { BackupOptions } from "./interfaces";
import { LOCAL, REMOTE } from "./enum";
import { Check } from "./Check";

export const USER_CONFIG_FILE = path.resolve(os.homedir(), "jlg-backup.json");

const getDuration = (intervalInSecond: number | undefined) =>
  (intervalInSecond ?? 3600) * 1000;

let timeout: NodeJS.Timeout | undefined;

export class Backup {
  last = new Date();
  next = new Date();
  options: BackupOptions = {
    sh: path.resolve("C:\\Program Files\\Git\\bin\\sh.exe"),
    intervalInSecond: 3600,
  };

  remoteStatus = REMOTE.NOT_SET;
  localStatus = LOCAL.NOT_SET;
  resolve = () => {};

  constructor(opts: Partial<BackupOptions> = {}) {
    this.options = { ...this.options, ...opts };
    this.check();
  }

  async start(): Promise<void> {
    if (!this.options.local) {
      return;
    }
    this.init();
    try {
      while (true) {
        await this.save();
        await this.wait();
      }
    } catch (error) {
      console.error("error while starting: ", error);
    }
  }

  wait(): Promise<void> {
    return new Promise((resolve) => {
      this.resolve = resolve;
      const duration = getDuration(this.options.intervalInSecond);
      this.next = new Date(new Date().getTime() + duration);
      timeout = setTimeout(this.resolve, duration);
    });
  }

  reschedule(newIntervalInSecond: number | undefined) {
    if (timeout) {
      clearTimeout(timeout);
    }
    const duration = getDuration(newIntervalInSecond);
    this.next = new Date(new Date().getTime() + duration);
    timeout = setTimeout(this.resolve, duration);
  }

  async init() {
    if (!this.options.local) {
      return;
    }
    await fs.promises.mkdir(this.options.local, { recursive: true });
    process.chdir(this.options.local);
    if (!(await exists(path.resolve(this.options.local, ".git")))) {
      console.log(".git do not exist");
      await cmd("git init");
    }
  }

  async save(): Promise<void> {
    console.log("backup start");
    if (!this.options.local) {
      return;
    }
    process.chdir(this.options.local);
    try {
      await cmd("git add -A .");
    } catch (error) {}

    try {
      await cmd("git commit -m backup");
    } catch (error) {}
    try {
      await cmd(`"${this.options.sh}" -c "git push" `);
    } catch (error) {
      console.error("error: ", error);
    }
    console.log("backup finished at " + new Date());
    this.last = new Date();
  }

  async update(bo: BackupOptions) {
    const options = { ...this.options, ...bo };
    if (bo.intervalInSecond !== this.options.intervalInSecond) {
      this.reschedule(bo.intervalInSecond);
    }
    try {
      await fs.promises.writeFile(
        USER_CONFIG_FILE,
        JSON.stringify(options, undefined, 2),
        { encoding: "utf8" }
      );
      this.options = options;
      this.init();
      this.save();
    } catch (e) {}
  }

  async check() {
    const check = new Check();
    this.remoteStatus = await check.remoteDir(this.options.remote);
    this.localStatus = await check.localDir(
      this.options.local,
      this.options.remote
    );
  }
}
