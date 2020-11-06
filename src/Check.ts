import fs from "fs";
import path from "path";

import { LOCAL } from "./enum";
import { cmd, cwd, dirToURI } from "./misc";

export class Check {
  async localDir(local: string | undefined): Promise<LOCAL> {
    try {
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

      // check if local repos
      try {
        process.chdir(path.resolve(local));
        const answer = await cmd("git rev-parse --is-inside-work-tree");
        if (answer.trim() !== "true") {
          throw "it is not";
        }
      } catch (error) {
        return LOCAL.NOT_GIT_REPOS;
      }

      return LOCAL.GIT_CLONE_REPOS;
    } finally {
      process.chdir(cwd);
    }
  }
}
