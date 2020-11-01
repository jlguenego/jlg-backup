import { AdminServer } from "./AdminServer";

async function main() {
  try {
    const adminServer = new AdminServer();
    await adminServer.start();
  } catch (error) {
    console.log("error: ", error);
  }
}

main();
