import { BackupOptions } from "./interfaces";
import { promises as fs } from "fs";
import path from "path";
import { cmd, exists, sleep } from "./misc";

export class Backup {
  options: BackupOptions = {
    local: path.resolve("D:\\_backup_local"),
    remote: path.resolve("D:\\_backup_remote"),
  };
  constructor(opts: Partial<BackupOptions>) {
    this.options = { ...this.options, ...opts };
    console.log("this.options: ", this.options);
  }

  async start(): Promise<void> {
    // mkdir local
    try {
      await fs.mkdir(this.options.local, { recursive: true });
      process.chdir(this.options.local);
      if (!(await exists(path.resolve(this.options.local, ".git")))) {
        console.log(".git do not exist");
        await cmd("git init");
      }
      while (true) {
        console.log("backup");
        await sleep(10000);
        console.log(await cmd("git add -A ."));
        try {
          console.log(await cmd("git commit -m backup"));
        } catch (error) {
          console.log("error: ", error);
        }
      }
    } catch (error) {
      console.log("start error: ", error);
    }
  }
}
