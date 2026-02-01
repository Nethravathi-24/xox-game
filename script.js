const cells = document.querySelectorAll(".cell");
const message = document.getElementById("message");
const resetBtn = document.getElementById("resetBtn");
const toggleAI = document.getElementById("toggleAI");

const xScoreEl = document.getElementById("xScore");
const oScoreEl = document.getElementById("oScore");
const drawScoreEl = document.getElementById("drawScore");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let vsAI = false;

let scores = { X: 0, O: 0, Draw: 0 };

const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

cells.forEach(cell => cell.addEventListener("click", handleClick));
resetBtn.addEventListener("click", resetGame);
toggleAI.addEventListener("click", toggleAIPlay);

function handleClick(e) {
    const index = e.target.dataset.index;

    if (!gameActive || board[index] !== "") return;

    playMove(index, currentPlayer);

    if (vsAI && gameActive && currentPlayer === "O") {
        setTimeout(aiMove, 500);
    }
}

function playMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;

    if (checkWinner(player)) {
        message.textContent = `Player ${player} Wins 🎉`;
        highlightWin(player);
        gameActive = false;
        updateScore(player);
        return;
    }

    if (board.every(cell => cell !== "")) {
        message.textContent = "It's a Draw 🤝";
        scores.Draw++;
        drawScoreEl.textContent = scores.Draw;
        gameActive = false;
        return;
    }

    currentPlayer = player === "X" ? "O" : "X";
    message.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner(player) {
    return winPatterns.some(pattern =>
        pattern.every(i => board[i] === player)
    );
}

function highlightWin(player) {
    winPatterns.forEach(pattern => {
        if (pattern.every(i => board[i] === player)) {
            pattern.forEach(i => cells[i].classList.add("win"));
        }
    });
}

function updateScore(player) {
    scores[player]++;
    xScoreEl.textContent = scores.X;
    oScoreEl.textContent = scores.O;
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("win");
    });
    currentPlayer = "X";
    gameActive = true;
    message.textContent = `Player ${currentPlayer}'s turn`;
}

function toggleAIPlay() {
    vsAI = !vsAI;
    toggleAI.textContent = `Play vs AI: ${vsAI ? "ON" : "OFF"}`;
    resetGame();
}

function aiMove() {
    const empty = board
        .map((v, i) => v === "" ? i : null)
        .filter(v => v !== null);

    if (empty.length === 0) return;

    const move = empty[Math.floor(Math.random() * empty.length)];
    playMove(move, "O");
}
