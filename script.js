const Gameboard = (function () {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board.slice();

    const setMark = (index, mark) => {
        if (board[index] === ""){
            board[index] = mark;
            return true;
        }
        return false;
    };

    const reset = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, setMark, reset };
})();

function createPlayer(name, marker) {
    return { name, marker };
}

const GameController = (function () {
    const player1 = createPlayer("Player 1", "X");
    const player2 = createPlayer("Player 2", "O");
    let currentPlayer = player1;
    let winner = null;
    let tie = false;

    const playRound = (index) => {
        if (winner || tie) {
            return false;
        }

        if (Gameboard.setMark(index, currentPlayer.marker)) {
            winner = checkWinner();
            tie = isTie();
            
            if (!winner && !tie) {
                switchPlayer();
                return true;
            }           
        }
        return false;
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }

    const getCurrentPlayer = () => currentPlayer;
    const getWinner = () => winner;
    const isGameTied = () => tie;

    const reset = () => {
        Gameboard.reset();
        currentPlayer = player1;
        winner = null;
        tie = false;
    };

    const winningCombos = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6],
    ];

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        for (let combo of winningCombos) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    };

    const isTie = () => {
        const board = Gameboard.getBoard();
        return board.every(cell => cell) && !checkWinner();
    };

    return { playRound, getCurrentPlayer, getWinner, isGameTied, reset };
})();

GameController.reset();
GameController.playRound(0);
GameController.playRound(3);
GameController.playRound(1);
GameController.playRound(4);
GameController.playRound(2);

console.log(GameController.getWinner());
console.log(GameController.isGameTied());