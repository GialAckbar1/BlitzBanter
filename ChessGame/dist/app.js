"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = require("socket.io");
var index_1 = __importDefault(require("./routes/index"));
var app = (0, express_1["default"])();
var server = http_1["default"].createServer(app);
var io = new socket_io_1.Server(server);
// View engine setup (for Pug templates)
app.set("views", path_1["default"].join(__dirname, "../src/views"));
app.set("view engine", "pug");
// Serve static files (JS, CSS)
app.use(express_1["default"].static(path_1["default"].join(__dirname, "../public")));
// Register the homepage route
app.use("/", index_1["default"]);
// Start the server
server.listen(3000, function () {
    console.log("Server running on http://localhost:3000");
});
// ? Graceful shutdown handling
process.on("SIGINT", function () {
    console.log("Received SIGINT. Closing server...");
    // Close the HTTP server properly
    server.close(function () {
        console.log("Server closed. Exiting process.");
        process.exit(0);
    });
    // Ensure that if close doesn't complete, exit after 5 seconds
    setTimeout(function () {
        console.error("Force exiting after timeout...");
        process.exit(1);
    }, 5000);
});
process.on("SIGTERM", function () {
    console.log("Received SIGTERM. Closing server...");
    server.close(function () {
        console.log("Server closed. Exiting process.");
        process.exit(0);
    });
    setTimeout(function () {
        console.error("Force exiting after timeout...");
        process.exit(1);
    }, 5000);
});
