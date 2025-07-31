let flippedCards = [];
let totalFlips = 0;
let player1Score = 0;
let player2Score = 0;
let botScore = 0;
let turn = 1;
let lastPlayer = "Ply1";
let mode = "single";

const icons = [
    'fa-face-smile', 'fa-dragon', 'fa-lightbulb', 'fa-car', 'fa-bolt',
    'fa-star ', 'fa-ghost', 'fa-gem', 'fa-bug', 'fa-fish'
];

function playerTurn(player = "Ply1") {
    const turnDisplay = document.getElementById('turnDisplay');
    const fronts = document.querySelectorAll('.front');
    lastPlayer = player;
    if (player === "Ply1") {
        turn = 1;
        turnDisplay.textContent = "1";
        fronts.forEach(el => el.classList.add("twPlayer"));
    } else if (player === "Ply2") {
        turn = 2;
        turnDisplay.textContent = "2";
        fronts.forEach(el => el.classList.remove("twPlayer"));
    }
}

function botTurn() {
    const turnDisplay = document.getElementById('turnDisplay');
    const fronts = document.querySelectorAll('.front');
    turn = 2;
    turnDisplay.textContent = "Bot";
    fronts.forEach(el => el.classList.remove("twPlayer"));
    lastPlayer = "Bot";
    setTimeout(() => {
        botMove();
    }, 800);
}

function botMove() {
    const unflippedCards = Array.from(document.querySelectorAll('.card:not(.flipped)'));
    if (unflippedCards.length < 2) return;

    const randomIndexes = [];
    while (randomIndexes.length < 2) {
        const rand = Math.floor(Math.random() * unflippedCards.length);
        if (!randomIndexes.includes(rand)) {
            randomIndexes.push(rand);
        }
    }

    const firstCard = unflippedCards[randomIndexes[0]];
    const secondCard = unflippedCards[randomIndexes[1]];

    firstCard.click();
    setTimeout(() => {
        secondCard.click();
    }, 500);
}

function startSingleGame() {
    mode = "single";
    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("gameScreen").classList.remove("hidden");
    document.getElementById("turn").classList.remove("hidden");
    document.getElementById("twplyScore").classList.add("hidden");
    document.getElementById("botXply").classList.remove("hidden");
    createBoard();
    playerTurn("Ply1");
}

function startGame() {
    mode = "two";
    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("turn").classList.remove("hidden");
    document.getElementById("gameScreen").classList.remove("hidden");
    document.getElementById("twplyScore").classList.remove("hidden");
    document.getElementById("botXply").classList.add("hidden");
    createBoard();
    playerTurn("Ply1");
}

const board = document.getElementById('gameBoard');

function createBoard() {
    board.innerHTML = '';
    const shuffledIcons = [...icons, ...icons].sort(() => Math.random() - 0.5);
    shuffledIcons.forEach(icon => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <div class="card-inner">
            <div class="front"></div>
            <div class="back">
              <i class="fa ${icon}"></i>
            </div>
          </div>
        `;
        card.onclick = () => flipCard(card);
        board.appendChild(card);
    });
}

function flipCard(card) {
    if (flippedCards.length >= 2 || card.classList.contains('flipped')) return;
    card.classList.add("flipped");
    flippedCards.push(card);
    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const icon1 = card1.querySelector('.back i').className;
    const icon2 = card2.querySelector('.back i').className;

    if (icon1 === icon2) {
        flippedCards = [];

        if (lastPlayer === "Ply1") {
            player1Score++;
            if (mode === "single") {
                document.getElementById("singlePlayer1ScoreValue").textContent = player1Score;
            } else {
                document.getElementById("player1ScoreValue").textContent = player1Score;
            }
            setTimeout(() => {
                if (mode === "two") playerTurn("Ply1");
            }, 800);
        } else if (lastPlayer === "Ply2") {
            player2Score++;
            document.getElementById("player2ScoreValue").textContent = player2Score;
            setTimeout(() => {
                if (mode === "two") playerTurn("Ply2");
            }, 800);
        } else if (lastPlayer === "Bot") {
            botScore++;
            document.getElementById("botScore").textContent = botScore;
            setTimeout(() => {
                botTurn();
            }, 800);
        }

    } else {
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            flippedCards = [];

            if (mode === "single") {
                if (lastPlayer === "Ply1") {
                    botTurn();
                } else {
                    playerTurn("Ply1");
                }
            } else {
                if (lastPlayer === "Ply1") {
                    playerTurn("Ply2");
                } else {
                    playerTurn("Ply1");
                }
            }
        }, 500);
    }

    checkWinCondition();
}

function checkWinCondition() {
    const allCards = document.querySelectorAll('.card');
    const matchedCards = document.querySelectorAll('.card.flipped');

    if (allCards.length === matchedCards.length) {
        setTimeout(() => {
            let message = "";
            if (mode === "single") {
                if (player1Score > botScore) {
                    message = "Player Wins!";
                } else if (botScore > player1Score) {
                    message = "Bot Wins!";
                } else {
                    message = "It's a Draw!";
                }
                alert(`${message}\nFinal Score:\nPlayer: ${player1Score}\nBot: ${botScore}`);
            } else {
                if (player1Score > player2Score) {
                    message = "Player 1 Wins!";
                } else if (player2Score > player1Score) {
                    message = "Player 2 Wins!";
                } else {
                    message = "It's a Draw!";
                }
                alert(`${message}\nFinal Score:\nPlayer 1: ${player1Score}\nPlayer 2: ${player2Score}`);
            }
            Menu();
        }, 500);
    }
}

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    botScore = 0;
    flippedCards = [];
    document.getElementById("player1ScoreValue").textContent = 0;
    document.getElementById("player2ScoreValue").textContent = 0;
    document.getElementById("singlePlayer1ScoreValue").textContent = 0;
    document.getElementById("botScore").textContent = 0;
    createBoard();
    playerTurn("Ply1");
}

function Menu() {
    document.getElementById("startScreen").classList.remove("hidden");
    document.getElementById("gameScreen").classList.add("hidden");
    resetGame();
}

createBoard();
