import fs from "fs";
import path from "path";
import os from "os";

import { cmd, cwd, exists } from "./misc";
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

  reschedule(newIntervalInSecond: number) {
    if (timeout) {
      clearTimeout(timeout);
    }
    const duration = getDuration(newIntervalInSecond);
    this.next = new Date(new Date().getTime() + duration);
    timeout = setTimeout(this.resolve, duration);
  }

  async save(): Promise<void> {
    console.log("backup start at " + new Date());
    if (!this.options.local) {
      return;
    }
    try {
      process.chdir(this.options.local);
      this.last = new Date();
      await cmd("git add -A .");
      await cmd("git commit -m backup");
      await cmd(`"${this.options.sh}" -c "git push" `);
      console.log("backup finished at " + this.last);
    } catch (error) {
      console.error("backup error: ", error);
    } finally {
      process.chdir(cwd);
    }
  }

  async update(bo: BackupOptions) {
    const options: BackupOptions = { ...this.options, ...bo };
    if (options.intervalInSecond !== this.options.intervalInSecond) {
      this.reschedule(options.intervalInSecond ?? 3600);
    }
    try {
      await fs.promises.writeFile(
        USER_CONFIG_FILE,
        JSON.stringify(options, undefined, 2),
        { encoding: "utf8" }
      );
      this.options = options;
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
