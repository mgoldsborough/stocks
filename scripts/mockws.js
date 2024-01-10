const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080, path: "/stocks" });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });

  // Send a test message every 5 seconds
  setInterval(() => {
    ws.send(
      JSON.stringify({
        ev: "T",
        // ... other mock data fields
      })
    );
  }, 5000);
});

console.log("Mock WebSocket Server started on port 8080");
