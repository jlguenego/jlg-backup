import path from "path";

import { cmd, cwd } from "./misc";

export async function isGitLocalRepos(repos: string): Promise<boolean> {
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

export async function convertToGitRepos(
  repos: string,
  remote: string
): Promise<void> {
  try {
    if (await isGitLocalRepos(repos)) {
      return;
    }
    process.chdir(repos);
    const remoteRepos = path.resolve(remote, path.basename(repos));
    await cmd(`git init --bare "${remoteRepos}"`);
    await cmd("git init");
    await cmd(`git remote add origin "${remoteRepos}"`);
  } catch (error) {
    console.log("error: ", error);
  } finally {
    process.chdir(cwd);
  }
}
