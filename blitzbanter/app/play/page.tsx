"use client";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useState, useEffect, useRef, SetStateAction } from "react";
import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:3001";

export default function Page() {
    const [game, setGame] = useState(new Chess());
    const [gameId, setGameId] = useState("defaultGame");
    const [playerColor, setPlayerColor] = useState<"w" | "b" | "spectator" | null>(null);
    const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);
    
    const socketRef = useRef<any>(null);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io(SERVER_URL);
        }

        const socket = socketRef.current;

        socket.emit("joinGame", gameId);
        socket.emit("requestGameState", gameId);

        socket.on("playerColor", (color: string) => {
            setPlayerColor(color as "w" | "b" | "spectator" | null);
            console.log(`Assigned color: ${color}`);
        });

        socket.on("gameState", (fen: string) => {
            const updatedGame = new Chess();
            updatedGame.load(fen);
            setGame(updatedGame);
        });

        socket.on("gameOver", (message: SetStateAction<string | null>) => {
            setGameOverMessage(message);
        });

        return () => {
            socket.off("gameState");
            socket.off("playerColor");
            socket.off("gameOver");
        };
    }, [gameId]);

    const onDrop = (sourceSquare: any, targetSquare: any) => {
        if (!playerColor || playerColor === "spectator" || gameOverMessage) return false;
        if (game.turn() !== playerColor) return false;

        const move = { from: sourceSquare, to: targetSquare, promotion: "q" };

        const newGame = new Chess(game.fen());
        try {
            const moveResult = newGame.move(move);
            if (!moveResult) return false;

            setGame(new Chess(newGame.fen()));
            socketRef.current.emit("move", { gameId, move, playerColor });
            return true;
        } catch (error) {
            console.log("Illegal move");
            return false;
        }
    };

    return (
        <main>
            <h2 style={{ textAlign: "center" }}>
                Multiplayer Chess ({playerColor === "w" ? "White" : playerColor === "b" ? "Black" : "Spectator"})
            </h2>
            {gameOverMessage && (
                <h3 style={{ textAlign: "center", color: "red" }}>{gameOverMessage}</h3>
            )}
            <div style={{ maxWidth: "800px", margin: "auto" }}>
                <Chessboard
                    position={game.fen()}
                    onPieceDrop={onDrop}
                    boardWidth={600}
                    boardOrientation={playerColor === "b" ? "black" : "white"}
                />
            </div>
        </main>
    );
}
