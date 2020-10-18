const { Service } = require("node-windows");
const path = require("path");

const yargs = require("yargs");

const myArgv = yargs
  .scriptName("jlg-backup")
  .usage("$0 <cmd> [args]")
  .command("install", "Install the service")
  .command("uninstall", "Uninstall the service")
  .help()
  .strict().argv;

console.log("myArgv: ", myArgv);

// Create a new service object
const svc = new Service({
  name: "JLG Node application as Windows Service",
  description: "JLG Description of Node application as Windows Service",
  script: path.resolve(__dirname, "server.js"),
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

if (myArgv._[0] === "install") {
  svc.install();
}

if (myArgv._[0] === "uninstall") {
  svc.uninstall();
}
