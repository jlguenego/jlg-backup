import fs from "fs";
import path from "path";

import { LOCAL } from "./enum";

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
}
