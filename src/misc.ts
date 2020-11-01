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
  return new Promise((resolve, reject) => {
    exec(str, (error, stdout, stderr) => {
      if (error) {
        reject(stderr + stdout);
      }
      resolve(stdout);
    });
  });
}

export function sleep(delay: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay);
  });
}
