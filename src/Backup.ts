import { BackupOptions } from "./interfaces";

export class Backup {
  constructor(opts: Partial<BackupOptions>) {
    const options: BackupOptions = {
      local: "D:\\_backup_local",
      remote: "D:\\_backup_remote",
      ...opts,
    };

    console.log("options: ", options);
  }

  start() {}
}
