import http from "http";
import * as WebSocket from "ws";
import { BackupMessage } from "./interfaces";

export class BackupWebSocket {
  wss: WebSocket.Server;

  constructor(server: http.Server) {
    this.wss = new WebSocket.Server({ server });
    this.wss.on("connection", (ws: WebSocket) => {
      //connection is up, let's add a simple simple event
      ws.on("message", (message: string) => {
        //log the received message and send it back to the client
        console.log("received: %s", message);
        ws.send(`Hello, you sent -> ${message}`);
      });

      //send immediatly a feedback to the incoming connection
      ws.send(
        JSON.stringify({
          message: "Websocket running",
        })
      );
    });
  }

  broadcast(msg: BackupMessage) {
    this.wss.clients.forEach((client) => {
      if (client.readyState !== WebSocket.OPEN) {
        return;
      }
      client.send(JSON.stringify(msg));
    });
  }
}
