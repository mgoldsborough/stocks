import { websocketClient } from "@polygon.io/client-js";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export const initializeWebSocket = (apiKey) => {
  return websocketClient(apiKey, "wss://delayed.polygon.io").stocks();
};

export const subscribePolygon = (ws, callback) => {
  // register a handler to log errors
  ws.onerror = (err) => console.log("Failed to connect", err);

  // register a handler to log info if websocket closes
  ws.onclose = (code, reason) => console.log("Connection closed", code, reason);

  // register a handler when messages are received
  ws.onmessage = (msg) => {
    console.dir(msg);
    // parse the data from the message
    const parsedMessage = JSON.parse(msg.data);

    // wait until the message saying authentication was successful, then subscribe to a channel
    if (
      parsedMessage[0].ev === "status" &&
      parsedMessage[0].status === "auth_success"
    ) {
      console.log(
        "Subscribing to the minute aggregates channel for ticker AAPL"
      );

      ws.send(
        JSON.stringify({
          action: "subscribe",
          params: "AM.AAPL,AM.TSLA,AM.MSFT",
        })
      );

      // DEBUG
      // setInterval(() => {
      //   callback({
      //     ev: "AM",
      //     sym: "APPL",
      //     v: getRandomInt(10000),
      //     av: getRandomInt(10000),
      //     op: getRandomInt(10000),
      //     vw: getRandomInt(10000),
      //     o: 0.4488,
      //     c: 0.4486,
      //     h: 0.4489,
      //     l: 0.4486,
      //     a: 0.4352,
      //     z: 685,
      //     s: 1610144640000,
      //     e: 1610144700000,
      //   });

      //   callback({
      //     ev: "AM",
      //     sym: "TSLA",
      //     v: getRandomInt(10000),
      //     av: getRandomInt(10000),
      //     op: getRandomInt(10000),
      //     vw: getRandomInt(10000),
      //     o: 0.4488,
      //     c: 0.4486,
      //     h: 0.4489,
      //     l: 0.4486,
      //     a: 0.4352,
      //     z: 685,
      //     s: 1610144640000,
      //     e: 1610144700000,
      //   });

      //   callback({
      //     ev: "AM",
      //     sym: "MSFT",
      //     v: getRandomInt(10000),
      //     av: getRandomInt(10000),
      //     op: getRandomInt(10000),
      //     vw: getRandomInt(10000),
      //     o: 0.4488,
      //     c: 0.4486,
      //     h: 0.4489,
      //     l: 0.4486,
      //     a: 0.4352,
      //     z: 685,
      //     s: 1610144640000,
      //     e: 1610144700000,
      //   });
      // }, 1000);
    }
    // minute aggregates
    else if (parsedMessage[0].ev === "AM") {
      /*
        {
          "ev": "AM",
          "sym": "GTE",
          "v": 4110,
          "av": 9470157,
          "op": 0.4372,
          "vw": 0.4488,
          "o": 0.4488,
          "c": 0.4486,
          "h": 0.4489,
          "l": 0.4486,
          "a": 0.4352,
          "z": 685,
          "s": 1610144640000,
          "e": 1610144700000
        }
      */

      // Process and handle the message
      console.log("sending aggregate", parsedMessage);
      callback(parsedMessage); // Send data back to the component
    } else {
      // just log the message
      console.log("Other message", parsedMessage);
    }
  };
};
