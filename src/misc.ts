import { promises as fs } from "fs";
import path from "path";
import { exec, spawn } from "child_process";

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
    console.log("process.env: ", process.env);
    exec(str, { env: process.env }, (error, stdout, stderr) => {
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

export function cmdSpawn(command: string, args: string[]): Promise<string> {
  console.log("spawn cmd: ", command, args);
  return new Promise((resolve, reject) => {
    const ps = spawn(command, args, { env: process.env });
    const std = {
      out: "",
      err: "",
    };

    ps.stdout.on("data", (data) => {
      std.out += data;
    });

    ps.stderr.on("data", (data) => {
      std.err += data;
    });

    ps.on("close", (code) => {
      const stdout = std.out;
      console.log("stdout: ", stdout);
      const stderr = std.err;
      console.log("stderr: ", stderr);
      if (code !== 0) {
        console.log(`ps process exited with code ${code}`);
        reject(stderr + stdout);
        return;
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
