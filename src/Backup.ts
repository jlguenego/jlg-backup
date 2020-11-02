import { BackupOptions } from "./interfaces";
import fs from "fs";
import path from "path";
import { cmd, cmdSpawn, exists, sleep } from "./misc";

export class Backup {
  last = new Date();
  next = new Date();
  options: BackupOptions = {
    sh: path.resolve("C:\\Program Files\\Git\\bin\\sh.exe"),
    intervalInSecond: 3600,
  };
  constructor(opts: Partial<BackupOptions> = {}) {
    this.options = { ...this.options, ...opts };
    console.log("this.options: ", this.options);
  }

  async start(): Promise<void> {
    if (!this.options.local) {
      return;
    }
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
      throw new Error(
        "no local repos specified in the backup config. Check the %USER%/jlg-backup.json"
      );
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
      throw new Error(
        "no local repos specified in the backup config. Check the %USER%/jlg-backup.json"
      );
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

  update(bo: BackupOptions) {
    this.options = { ...this.options, ...bo };
  }
}
