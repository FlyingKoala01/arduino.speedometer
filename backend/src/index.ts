import express from "express";
import "dotenv/config";
import cors from "cors";

import { createServer } from "http";
import { Server } from "socket.io";
import { SerialHandler } from "./serialHandler";

const app = express();
app.use(cors()); // Enable CORS for all routes
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with the URL of your React app
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT;

// Initialize SerialHandler with the correct COM port
const serialPortName = process.env.SERIAL_PORT_NAME || "COM3";
const baudRate = parseInt(process.env.BAUD_RATE || "9600");

const serialHandler = new SerialHandler(serialPortName, baudRate, (data) => {
  io.emit("serial-data", data);
});

io.on("connection", (socket) => {
  console.log("a user connected");

  // Example: Emitting data to client
  socket.emit("message", "Hello from Server!");

  // Handling disconnection
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
