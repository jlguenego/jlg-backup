import express, { Router } from "express";
import { Backup } from "./Backup";
import { BackupOptions } from "./interfaces";

export function ws(backup: Backup): Router {
  const app = express.Router();

  app.get("/backup", (req, res) => {
    (async () => {
      try {
        console.log("backup start");
        await backup.save();
        res.json(backup);
      } catch (e) {
        res.status(400).json({ error: e });
      }
    })();
  });

  app.get("/info", (req, res) => {
    console.log("info start");
    res.json(backup);
  });

  return app;
}
