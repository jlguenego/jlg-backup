import { BackupOptions } from "./interfaces";
import fs from "fs";
import path from "path";
import { cmd, exists, sleep } from "./misc";

export class Backup {
  options: BackupOptions = {
    local: path.resolve("D:\\_backup_local"),
    remote: path.resolve("D:\\_backup_remote"),
    intervalInSecond: 3600,
  };
  constructor(opts: Partial<BackupOptions> = {}) {
    this.options = { ...this.options, ...opts };
    console.log("this.options: ", this.options);
  }

  async start(): Promise<void> {
    // mkdir local
    try {
      await fs.promises.mkdir(this.options.local, { recursive: true });
      process.chdir(this.options.local);
      if (!(await exists(path.resolve(this.options.local, ".git")))) {
        console.log(".git do not exist");
        await cmd("git init");
      }
      while (true) {
        await this.save();
        await sleep(this.options.intervalInSecond * 1000);
      }
    } catch (error) {
      console.log("start error: ", error);
    }
  }

  async save(): Promise<void> {
    console.log("start save");
    process.chdir(this.options.local);
    await cmd("git add -A .");
    try {
      await cmd("git commit -m backup");
    } catch (error) {
      console.log("error: ", error);
    }
    console.log("save finished at " + new Date());
  }
}
