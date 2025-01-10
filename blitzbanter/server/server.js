const { Server } = require("socket.io");
const { Chess } = require("chess.js");

const io = new Server(3001, {
    cors: { origin: "*" },
});

let games = {}; // Store active game states

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinGame", (gameId) => {
        socket.join(gameId);

        if (!games[gameId]) {
            games[gameId] = {
                game: new Chess(),
                players: [],
                gameOver: false,
            };
        }

        let color = "spectator"; // Default is spectator

        // Ensure only two players get colors
        const existingPlayer = games[gameId].players.find(p => p.id === socket.id);

        if (existingPlayer) {
            color = existingPlayer.color;
        } else if (games[gameId].players.length < 2) {
            const whiteTaken = games[gameId].players.some(p => p.color === "w");
            color = whiteTaken ? "b" : "w";
            games[gameId].players.push({ id: socket.id, color });
        }

        socket.emit("playerColor", color);
        console.log(`Player ${socket.id} joined game ${gameId} as ${color}`);

        // Send the latest game state
        socket.emit("gameState", games[gameId].game.fen());
    });

    socket.on("requestGameState", (gameId) => {
        if (games[gameId]) {
            socket.emit("gameState", games[gameId].game.fen());
        }
    });

    socket.on("move", ({ gameId, move, playerColor }) => {
        const gameData = games[gameId];
        if (!gameData || gameData.gameOver) return;

        const game = gameData.game;
        if (game.turn() !== playerColor) return;

        try {
            const moveResult = game.move(move);
            if (moveResult) {
                games[gameId].fen = game.fen(); // Store the latest game state
                io.to(gameId).emit("gameState", game.fen());

                if (game.isCheckmate()) {
                    gameData.gameOver = true;
                    const winner = game.turn() === "b" ? "White" : "Black";
                    io.to(gameId).emit("gameOver", `${winner} wins by Checkmate!`);
                } else if (game.isStalemate()) {
                    gameData.gameOver = true;
                    io.to(gameId).emit("gameOver", "Game is a Stalemate!");
                } else if (game.isDraw()) {
                    gameData.gameOver = true;
                    io.to(gameId).emit("gameOver", "Game is a Draw!");
                }
            }
        } catch (error) {
            console.log("Illegal move attempt:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);

        for (let gameId in games) {
            games[gameId].players = games[gameId].players.filter(player => player.id !== socket.id);

            if (games[gameId].players.length === 0) {
                delete games[gameId];
            }
        }
    });
});

console.log("WebSocket server running on port 3001");
