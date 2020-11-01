import express from "express";
import { Backup } from "./Backup";

const app = express.Router();

app.get("/backup", (req, res) => {
  console.log("backup start");
  const backup = new Backup();
  backup.save();
  res.send("ok");
});

export const ws = app;
