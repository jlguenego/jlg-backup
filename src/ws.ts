import express, { Router } from "express";
import { Backup } from "./Backup";
import { BackupOptions } from "./interfaces";

export function ws(backup: Backup): Router {
  const app = express.Router();

  app.get("/backup", (req, res) => {
    console.log("backup start");
    backup.save();
    res.send("ok");
  });

  app.get("/info", (req, res) => {
    console.log("info start");
    res.json(backup);
  });

  return app;
}
