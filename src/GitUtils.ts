import path from "path";
import { Backup } from "./Backup";

import { cmd, cwd } from "./misc";

export class GitUtils {
  constructor(private backup: Backup) {}

  async isGitLocalRepos(repos: string): Promise<boolean> {
    // is it a git local repos ?
    try {
      process.chdir(repos);
      const result = (await cmd("git rev-parse --is-inside-work-tree")).trim();
      if (result !== "true") {
        throw new Error("it is not");
      }
      return true;
    } catch (error) {
      console.log("error: ", error);
      return false;
    } finally {
      process.chdir(cwd);
    }
  }

  async convertToGitRepos(repos: string): Promise<void> {
    try {
      if (await this.isGitLocalRepos(repos)) {
        return;
      }
      process.chdir(repos);
      const remoteRepos = path.resolve(
        this.backup.options.remote,
        path.basename(repos)
      );
      await this.backup.cmd(`git init --bare "${remoteRepos}"`);
      await this.backup.cmd("git init");
      await this.backup.cmd(`git remote add origin "${remoteRepos}"`);
    } catch (error) {
      console.log("error: ", error);
    } finally {
      process.chdir(cwd);
    }
  }
}
