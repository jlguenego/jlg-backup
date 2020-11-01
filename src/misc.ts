import { promises as fs } from "fs";
import path from "path";
import { exec } from "child_process";

export async function exists(str: string): Promise<boolean> {
  try {
    await fs.access(path.resolve(str));
    return true;
  } catch (error) {
    return false;
  }
}

export function cmd(str: string): Promise<string> {
  console.log("starting cmd: ", str);
  return new Promise((resolve, reject) => {
    exec(str, (error, stdout, stderr) => {
      if (error) {
        console.log("stdout: ", stdout);
        console.log("stderr: ", stderr);
        reject(stderr + stdout);
        return;
      }
      console.log("stdout: ", stdout);
      resolve(stdout);
    });
  });
}

export function sleep(delay: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay);
  });
}
