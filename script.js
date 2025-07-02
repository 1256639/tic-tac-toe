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
    let player1 = createPlayer("Player 1", "X");
    let player2 = createPlayer("Player 2", "O");
    let currentPlayer = player1;
    let winner = null;
    let tie = false;

    const setPlayers = (name1, name2) => {
        player1 = createPlayer(name1, "X");
        player2 = createPlayer(name2, "O");
        currentPlayer = player1;
    };

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

    return { playRound, getCurrentPlayer, getWinner, isGameTied, reset, setPlayers, player1: () => player1, player2: () => player2 };
})();

const DisplayController = (function() {
    const boardDiv = document.getElementById('board');
    const statusDiv = document.getElementById('game-status');
    const resetBtn = document.getElementById('reset-btn');
    const gameContainer = document.getElementById('game-container');
    const playerFormContainer = document.getElementById('player-form-container');
    const playerForm = document.getElementById('player-form');
    playerForm.addEventListener('submit', handlePlayerFormSubmit);
    const player1Input = document.getElementById('player1-name');
    const player2Input = document.getElementById('player2-name');
    const cells = [];

    function setupBoard() {
        for (let i = 0; i < 9; i++) {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            cellDiv.dataset.index = i;
            cellDiv.addEventListener('click', handleCellClick);
            cells.push(cellDiv);
            boardDiv.appendChild(cellDiv);
        }
    }

    function renderBoard() {
        const board = Gameboard.getBoard();
        for (let i = 0; i < 9; i++) {
            cells[i].textContent = board[i];
            cells[i].style.pointerEvents = '';
            if (board[i] || GameController.getWinner() || GameController.isGameTied()) {
                cells[i].style.pointerEvents = 'none';
            }
        }
    }

    function renderStatus() {
        if (GameController.getWinner()) {
            let winnerMarker = GameController.getWinner();
            let winnerName = winnerMarker === "X" ? GameController.player1().name : GameController.player2().name;
            statusDiv.textContent = "Winner: " + winnerName + "!";
        } else if (GameController.isGameTied()) {
            statusDiv.textContent = "It's a tie!";
        } else {
            statusDiv.textContent = "Turn: " + GameController.getCurrentPlayer().name;
        }
    }

    function handleCellClick(e) {
        const ix = parseInt(e.target.dataset.index);
        GameController.playRound(ix);
        renderBoard();
        renderStatus();
    }

    function handleReset() {
        GameController.reset();
        renderBoard();
        renderStatus();
    }

    function handlePlayerFormSubmit(e) {
        e.preventDefault();
        const name1 = player1Input.value.trim();
        const name2 = player2Input.value.trim();
        if(name1 && name2) {
            GameController.setPlayers(name1, name2);
            playerFormContainer.style.display = 'none';
            gameContainer.style.display = '';
            GameController.reset();
            renderBoard();
            renderStatus();
        }
    }

    setupBoard();
    resetBtn.addEventListener('click', handleReset);
    renderBoard();
    renderStatus();

    return { renderBoard, renderStatus }

})();