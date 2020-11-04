import fs from "fs";
import path from "path";

import { LOCAL, REMOTE } from "./enum";
import { cmd, dirToURI } from "./misc";

export class Check {
  async remoteDir(remote: string | undefined) {
    // check remote dir.
    if (!remote) {
      return REMOTE.NOT_SET;
    }
    // check existing directory
    try {
      await fs.promises.access(path.resolve(remote));
      // The check succeeded
    } catch (error) {
      return REMOTE.NOT_EXISTING_DIR;
    }

    // check if bare repos
    try {
      process.chdir(path.resolve(remote));
      const answer = await cmd("git rev-parse --is-bare-repository");
      if (answer.trim() === "false") {
        throw "it is not";
      }
    } catch (error) {
      return REMOTE.NOT_GIT_BARE_REPOS;
    }
    return REMOTE.GIT_BARE_REPOS;
  }

  async localDir(
    local: string | undefined,
    remote: string | undefined
  ): Promise<LOCAL> {
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

    // check if repos
    try {
      process.chdir(path.resolve(local));
      const answer = await cmd("git rev-parse --is-inside-work-tree");
      if (answer.trim() !== "true") {
        throw "it is not";
      }
    } catch (error) {
      return LOCAL.NOT_GIT_REPOS;
    }

    // check if remote
    try {
      const answer = await cmd("git remote get-url origin");
      const trimAnswer = answer.trim();
      const uri = dirToURI(remote ?? "");
      if (trimAnswer.trim() !== uri) {
        throw "it is not";
      }
    } catch (error) {
      return LOCAL.NOT_REMOTE;
    }

    return LOCAL.GIT_CLONE_REPOS;
  }
}
