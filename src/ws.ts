import express from "express";
import { backup } from "./Backup";

const app = express.Router();

app.get("/backup", (req, res) => {
  console.log("backup start");
  backup();
  res.send("ok");
});
