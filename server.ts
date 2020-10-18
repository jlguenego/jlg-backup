import express from "express";
import { Backup } from "./src/backup";
import path from 'path';

const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

const backup = new Backup({
  local: path.resolve("D:\\_backup_local"),
  remote: path.resolve("D:\\_backup_remote"),
});

backup.start();
