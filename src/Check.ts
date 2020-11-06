import fs from "fs";
import path from "path";

import { LOCAL } from "./enum";
import { cmd } from "./misc";

export class Check {
  async localDir(local: string | undefined): Promise<LOCAL> {
    // check local dir.
    if (!local) {
      return LOCAL.NOT_SET;
    }

    // check existing directory
    try {
      await fs.promises.access(path.resolve(local));
      // The check succeeded
    } catch (error) {
      return LOCAL.NOT_EXISTING_DIR;
    }

    return LOCAL.OK;
  }

  async gitUser() {
    const username = "Backuper";
    const email = "please@enjoy-jlg-backup.com";
    try {
      await cmd("git config --global --get user.name");
      await cmd("git config --global --get user.email");
    } catch (error) {
      console.log("error: ", error);
      await cmd(`git config --global  user.name "${username}"`);
      await cmd(`git config --global  user.email "${email}"`);
    }
  }
}
