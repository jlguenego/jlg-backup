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
  console.log("about to start");
  svc.start();
});

// Listen for the "uninstall" event so we know when it's done.
svc.on("uninstall", function () {
  console.log("Uninstall complete.");
  console.log("The service exists: ", svc.exists);
});

const myArgv = yargs
  .scriptName("jlg-backup")
  .command({
    command: "install",
    aliases: ["i"],
    desc: "Install the service",
    handler: (...args) => {
      console.log("install args: ", args);
      svc.install();
    },
  })
  .command({
    command: "uninstall",
    aliases: ["u"],
    desc: "Uninstall the service",
    handler: (...args) => {
      console.log("uninstall args: ", args);
      svc.uninstall();
    },
  })
  // provide a minimum demand and a minimum demand message
  .demandCommand(1, "You need at least one command before moving on")
  .help()
  .parse();
