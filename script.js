let playerName = "";
let playerScore = 0;
let computerScore = 0;
const maxScore = 5;


const som = document.getElementById('som-colisao-player');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ballImage = new Image();
ballImage.src = 'ball.png';

const paddleWidth = 10, paddleHeight = 100, ballRadius = 10;
let playerY = (canvas.height - paddleHeight) / 2;
let computerY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 5, ballSpeedY = 2;
let upPressed = false;
let downPressed = false;

function startGame() {
    playerName = document.getElementById('playerName').value || "Jogador";
    document.getElementById('welcome').style.display = 'none';
    document.getElementById('greeting').innerText = `Bem-vindo, ${playerName}!`;
    document.getElementById('game').style.display = 'block';
    gameLoop();
}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5;
    ballSpeedY = 2;
}

function gameLoop() {
    moveBall();
    moveComputerPaddle();
    movePlayerPaddle();
    drawEverything();
    checkScore();
    requestAnimationFrame(gameLoop);
}

function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
        som.play();
    }

    if (ballX + ballRadius > canvas.width) {
        if (ballY > computerY && ballY < computerY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else {
            playerScore++;
            resetBall();
            som.play();
        }
    }

    if (ballX - ballRadius < 0) {
        if (ballY > playerY && ballY < playerY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else {
            computerScore++;
            resetBall();
            som.play();
        }
    }
}

function resetBall() {
    // setInterval(increaseDifficult(), 113000);
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
}

function moveComputerPaddle() {
    if (computerY + paddleHeight / 2 < ballY) {
        computerY += 4;
    } else {
        computerY -= 4;
    }
}

function movePlayerPaddle() {
    if (upPressed && playerY > 0) {
        playerY -= 5;
    }
    if (downPressed && playerY < canvas.height - paddleHeight) {
        playerY += 5;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        upPressed = true;
    }
    if (e.key === 'ArrowDown') {
        downPressed = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') {
        upPressed = false;
    }
    if (e.key === 'ArrowDown') {
        downPressed = false;
    }
});

function drawEverything() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#61dafb';
    ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, computerY, paddleWidth, paddleHeight);

    ctx.drawImage(ballImage, ballX - ballRadius, ballY - ballRadius, ballRadius * 2, ballRadius * 2);

    document.getElementById('playerScore').innerText = playerScore;
    document.getElementById('computerScore').innerText = computerScore;
}

function checkScore() {
    if (playerScore >= maxScore || computerScore >= maxScore) {
        alert(`${playerScore >= maxScore ? playerName : 'Computador'} venceu!`);
        resetGame();
    }
}

function increaseDifficult() {
    ballSpeedX = ballSpeedX * 2;
    ballSpeedY = ballSpeedY * 2;
}
