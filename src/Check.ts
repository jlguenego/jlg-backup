import fs from "fs";
import path from "path";

import { LOCAL, REMOTE } from "./enum";
import { cmd, dirToURI } from "./misc";

export class Check {
  async remoteDir(remote: string | undefined) {
    console.log("checkRemoteDir");
    console.log("remote: ", remote);

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
      console.log("answer: ", answer);
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
    console.log("check LocalDir");
    // check remote dir.
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
      console.log("answer: ", answer);
      if (answer.trim() !== "true") {
        throw "it is not";
      }
    } catch (error) {
      return LOCAL.NOT_GIT_REPOS;
    }

    // check if remote
    try {
      // git remote add origin file:///D:/_bbb
      const answer = await cmd("git remote get-url origin");
      const trimAnswer = answer.trim();
      console.log("trimAnswer: ", trimAnswer);
      const uri = dirToURI(remote ?? "");
      console.log("uri: ", uri);
      if (trimAnswer.trim() !== uri) {
        throw "it is not";
      }
    } catch (error) {
      return LOCAL.NOT_REMOTE;
    }

    return LOCAL.GIT_CLONE_REPOS;
  }
}
