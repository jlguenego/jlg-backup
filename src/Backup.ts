import fs from "fs";
import path from "path";
import os from "os";

import { cmd, cwd, log, now } from "./misc";
import { BackupOptions } from "./interfaces";
import { BACKUP, LOCAL } from "./enum";
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

  localStatus = LOCAL.NOT_SET;
  backupStatus = BACKUP.OK;
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
        await this.backup();
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
    this.next = new Date(this.last.getTime() + duration);
    const remaining = Math.max(this.next.getTime() - new Date().getTime(), 0);
    timeout = setTimeout(this.resolve, remaining);
  }

  async backup(): Promise<void> {
    log(`START backup`);
    if (!this.options.local) {
      return;
    }
    const local = this.options.local;
    try {
      const entries = await fs.promises.readdir(
        path.resolve(this.options.local)
      );
      for (const entry of entries) {
        await this.backupRepos(path.resolve(local, entry));
      }
    } catch (error) {}

    try {
    } catch (error) {
      console.error("backup error: ", error);
    } finally {
      process.chdir(cwd);
      log(`END backup`);
    }
  }

  async backupRepos(repos: string) {
    try {
      log(`START backupRepos ${repos}`);
      const lstat = await fs.promises.lstat(repos);
      if (!lstat.isDirectory()) {
        return;
      }
      process.chdir(repos);
      this.last = new Date();
      await cmd("git add -A .");
      await cmd("git commit -m backup");
      await cmd(`"${this.options.sh}" -c "git push" `);
    } catch (error) {
      console.error("error: ", error);
    } finally {
      process.chdir(cwd);
      log(`END backupRepos ${repos}`);
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
    this.localStatus = await check.localDir(this.options.local);
  }
}
