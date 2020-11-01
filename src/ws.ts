import express, { Router } from "express";
import { Backup } from "./Backup";
import { BackupOptions } from "./interfaces";

export function ws(backup: Backup): Router {
  const app = express.Router();

  app.get("/backup", (req, res) => {
    (async () => {
      console.log("backup start");
      await backup.save();
      res.json(backup);
    })();
  });

  app.get("/info", (req, res) => {
    console.log("info start");
    res.json(backup);
  });

  return app;
}
