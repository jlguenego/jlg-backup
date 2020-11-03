import fs from "fs";
import path from "path";
import os from "os";

import { cmd, exists, sleep } from "./misc";
import { BackupOptions } from "./interfaces";

export const USER_CONFIG_FILE = path.resolve(os.homedir(), "jlg-backup.json");

const REMOTE_NOT_SET = "remote not set";
const REMOTE_NOT_EXISTING_DIR = "remote directory not existing";
const REMOTE_NOT_GIT_BARE_REPOS = "remote directory is not bare git repository";
const REMOTE_GIT_BARE_REPOS = "success! (remote directory - bare repos).";

export class Backup {
  last = new Date();
  next = new Date();
  options: BackupOptions = {
    sh: path.resolve("C:\\Program Files\\Git\\bin\\sh.exe"),
    intervalInSecond: 3600,
  };

  remoteStatus = REMOTE_NOT_SET;

  constructor(opts: Partial<BackupOptions> = {}) {
    this.options = { ...this.options, ...opts };
    console.log("this.options: ", this.options);
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
        const duration = (this.options.intervalInSecond ?? 3600) * 1000;
        console.log("duration: ", duration);
        this.last = new Date();
        console.log("this.last: ", this.last);
        this.next = new Date(this.last.getTime() + duration);
        console.log("this.next: ", this.next);
        await sleep(duration);
      }
    } catch (error) {
      console.log("start error: ", error);
    }
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
    console.log("start save");
    if (!this.options.local) {
      return;
    }
    process.chdir(this.options.local);
    await cmd("git add -A .");
    try {
      await cmd("git commit -m backup");
    } catch (error) {
      console.log("error: ", error);
    }
    try {
      await cmd(`"${this.options.sh}" -c "git push" `);
    } catch (error) {
      console.log("error: ", error);
    }
    console.log("save finished at " + new Date());
    this.last = new Date();
  }

  async update(bo: BackupOptions) {
    const options = { ...this.options, ...bo };
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
    await this.checkRemoteDir();
  }

  async checkRemoteDir() {
    console.log("checkRemoteDir");
    console.log("this.options.remote: ", this.options.remote);

    // check remote dir.
    if (!this.options.remote) {
      this.remoteStatus = REMOTE_NOT_SET;
      return;
    }
    // check existing directory
    try {
      await fs.promises.access(path.resolve(this.options.remote));
      // The check succeeded
    } catch (error) {
      this.remoteStatus = REMOTE_NOT_EXISTING_DIR;
      return;
    }

    try {
      process.chdir(path.resolve(this.options.remote));
      const answer = await cmd("git rev-parse --is-bare-repository");
      console.log("answer: ", answer);
      if (answer.trim() === "false") {
        throw "it is not";
      }
      this.remoteStatus = REMOTE_GIT_BARE_REPOS;
    } catch (error) {
      this.remoteStatus = REMOTE_NOT_GIT_BARE_REPOS;
      return;
    }
  }
}
