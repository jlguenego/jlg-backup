#!/usr/bin/env node

const { Service } = require("node-windows");
const path = require("path");
const yargs = require("yargs");

// Create a new service object
const svc = new Service({
  name: "JLG Node application as Windows Service",
  description: "JLG Description of Node application as Windows Service",
  script: path.resolve(__dirname, "../dist/index.js"),
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on("install", function () {
  console.log("Windows service installed. Starting...");
  svc.start();
});

svc.on("start", function () {
  console.log("Windows service started.");
});

svc.on("stop", function () {
  console.log("Windows service stopped.");
});

// Listen for the "uninstall" event so we know when it's done.
svc.on("uninstall", function () {
  console.log("Windows service uninstalled.");
});

svc.on("error", function (err) {
  console.log("Error occurred: ", err);
});

svc.on("alreadyinstalled", function () {
  console.log("Windows service already installed.");
});

const myArgv = yargs
  .scriptName("jlg-backup")
  .command({
    command: "install",
    aliases: ["i"],
    desc: "Install the service",
    handler: (...args) => {
      console.log("Installing windows service...");
      svc.install();
    },
  })
  .command({
    command: "uninstall",
    aliases: ["u"],
    desc: "Uninstall the service",
    handler: (...args) => {
      console.log("Uninstalling windows service...");
      svc.uninstall();
    },
  })
  // provide a minimum demand and a minimum demand message
  .demandCommand(1, "You need at least one command before moving on")
  .help()
  .parse();
