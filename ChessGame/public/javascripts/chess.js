var game = new Chess(); 

var myboard = Chessboard("myboard", {
    pieceTheme: '/images/chesspieces/{piece}.png',
    position: 'start',
    draggable: true,

    // Enforce legal moves and detect special game states
    onDrop: function (source, target) {
        let move = game.move({
            from: source,
            to: target,
            promotion: "q"
        });

        if (move === null) return "snapback"; 

        console.log("Move:", move.san); 

        setTimeout(() => {
            myboard.position(game.fen());
        }, 100); 

        if (game.in_checkmate()) {
            console.log("Checkmate! Game Over.");
            setTimeout(() => alert("Checkmate! Game Over."), 100);
        } else if (game.in_stalemate()) {
            console.log("Stalemate! It's a Draw.");
            setTimeout(() => alert("Stalemate! It's a Draw."), 100);
        } else if (game.in_check()) {
            console.log("Check!");
            setTimeout(() => alert("Check!"), 100);
        } else if (game.in_draw()) {
            console.log("Game is a draw.");
            setTimeout(() => alert("Game is a draw."), 100);
        } else if (game.in_threefold_repetition()) {
            console.log("Draw by threefold repetition.");
            setTimeout(() => alert("Draw by threefold repetition."), 100);
        }
    }
});

$("#startBtn").on("click", function () {
    game.reset(); 
    myboard.start(); 
    console.log("Game restarted!");
});

$("#clearBtn").on("click", function () {
    game.clear(); 
    myboard.clear(); 
    console.log("Board cleared!");
});
