import express, { Router } from "express";
import { Backup } from "./Backup";
import { BackupOptions } from "./interfaces";

export function ws(backup: Backup): Router {
  const app = express.Router();

  app.use(express.json());

  app.get("/backup", (req, res) => {
    (async () => {
      try {
        console.log("backup requested from client");
        await backup.save();
        backup.reschedule(backup.options.intervalInSecond ?? 3600);
        res.json(backup);
      } catch (e) {
        res.status(400).json({ error: e });
      }
    })();
  });

  app.get("/info", (req, res) => {
    console.log("info start");
    backup.check();
    res.json(backup);
  });

  app.put("/backup-options", (req, res) => {
    (async () => {
      try {
        console.log("put backup options");
        const bo = req.body as BackupOptions;
        await backup.update(bo);
        await backup.check();
        res.json(backup);
      } catch (e) {
        res.status(400).json({ error: e });
      }
    })();
  });

  return app;
}
