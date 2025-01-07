import express from "express";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import indexRouter from "./routes/index";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set("views", path.join(__dirname, "../src/views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "../public")));

app.use("/", indexRouter);

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

process.on("SIGINT", () => {
    console.log("Received SIGINT. Closing server...");

    server.close(() => {
        console.log("Server closed. Exiting process.");
        process.exit(0);
    });

    setTimeout(() => {
        console.error("Force exiting after timeout...");
        process.exit(1);
    }, 5000);
});

process.on("SIGTERM", () => {
    console.log("Received SIGTERM. Closing server...");

    server.close(() => {
        console.log("Server closed. Exiting process.");
        process.exit(0);
    });

    setTimeout(() => {
        console.error("Force exiting after timeout...");
        process.exit(1);
    }, 5000);
});
