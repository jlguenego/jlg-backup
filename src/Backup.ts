import fs from "fs";
import path from "path";
import os from "os";
import { DateTime } from "luxon";

import { cmd, cwd, log, now } from "./misc";
import { BackupInfo, BackupOptions } from "./interfaces";
import { BACKUP, LOCAL, REMOTE } from "./enum";
import { Check } from "./Check";
import { BackupWebSocket } from "./BackupWebSocket";
import { GitUtils } from "./GitUtils";

export const USER_CONFIG_FILE = path.resolve(os.homedir(), "jlg-backup.json");

const getDuration = (intervalInSecond: number | undefined) =>
  (intervalInSecond ?? 3600) * 1000;

let timeout: NodeJS.Timeout | undefined;

export class Backup {
  backupWs: BackupWebSocket | undefined;
  gitUtils = new GitUtils(this);

  last = "";
  next = "";
  options: BackupOptions = {
    $schema: "",
    sh: path.resolve("C:\\Program Files\\Git\\bin\\sh.exe"),
    intervalInSecond: 3600,
    local: "",
    remote: "",
    git: {},
    port: 55555,
  };

  remoteStatus = REMOTE.NOT_SET;
  localStatus = LOCAL.NOT_SET;
  backupStatus = BACKUP.OK;
  resolve = () => {};

  constructor(opts: Partial<BackupOptions> = {}) {
    this.options = { ...this.options, ...opts };
    this.check();
  }

  getInfo(): BackupInfo {
    const result = { ...this };
    delete (result as Partial<Backup>).gitUtils;
    delete (result as Partial<Backup>).backupWs;
    return result;
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
      this.next = DateTime.fromMillis(
        DateTime.local().toMillis() + duration
      ).toISO();
      timeout = setTimeout(this.resolve, duration);
    });
  }

  reschedule(newIntervalInSecond: number) {
    try {
      if (timeout) {
        clearTimeout(timeout);
      }
      const duration = getDuration(newIntervalInSecond);
      this.next = DateTime.fromMillis(
        DateTime.fromISO(this.last).toMillis() + duration
      ).toISO();

      const remaining = Math.max(
        DateTime.fromISO(this.next).toMillis() - DateTime.local().toMillis(),
        0
      );
      timeout = setTimeout(this.resolve, remaining);
    } catch (error) {
      console.log("error: ", error);
      throw error;
    }
  }

  async backup(): Promise<void> {
    this.broadcast(`START backup`, true);
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
      this.broadcast("backup error: ", error);
    } finally {
      process.chdir(cwd);
      this.broadcast(`END backup`, false);
    }
  }

  async backupRepos(repos: string) {
    try {
      this.broadcast(`START backupRepos ${repos}`);
      const lstat = await fs.promises.lstat(repos);
      if (!lstat.isDirectory()) {
        this.broadcast(`${repos} is not a directory`);
        return;
      }

      this.last = DateTime.local().toISO();
      await this.gitUtils.convertToGitRepos(repos);
      process.chdir(repos);
      await this.cmd("git add -A .");
      await this.cmd("git commit -m backup");
      await this.cmd(
        `"${this.options.sh}" -c "git push --set-upstream origin master" `
      );
    } catch (error) {
      console.error("error: ", error);
    } finally {
      process.chdir(cwd);
      this.broadcast(`END backupRepos ${repos}`);
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
    const check = new Check(this.options);
    this.remoteStatus = await check.remoteDir(this.options.remote);
    this.localStatus = await check.localDir(this.options.local);
    await check.gitUser();
  }

  broadcast(msg: string, backuping = false): void {
    this.backupWs?.broadcast({ message: msg, backuping });
    log(msg);
  }

  async cmd(command: string): Promise<void> {
    try {
      this.broadcast(`START ${command}`, true);
      await cmd(command);
    } catch (error) {
      this.broadcast(`ERROR while doing: ${command} - ${error}`, true);
    }
  }
}
