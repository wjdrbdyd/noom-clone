import express from "express";
import WebSocket from "ws";
import http from "http";
const app = express();

// view 설정 및 render
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");
// app.listen(3000, handleListen);
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); //http & websocket 둘다 작동  // http서버 위에서 ws 서버 만든거임

function onSocketClose() {
  console.log("Disconnected from the Browser.");
}
const sockets = [];
wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("Connected to Browser ✅");
  socket.on("close", onSocketClose);
  socket.on("message", (msg) => {
    const message = JSON.parse(msg.toString());
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) => {
          aSocket.send(`${socket.nickname}: ${message.payload}`);
        });
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        break;
    }
  });
});
server.listen(3000, handleListen);
