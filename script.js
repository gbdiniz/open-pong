let playerName = "";
let playerScore = 0;
let computerScore = 0;
const maxScore = 5;


const som = document.getElementById('som-colisao-parede');
const colisaoplayer = document.getElementById('som-colisao-player');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ballImage = new Image();
ballImage.src = 'assets/sprites/ball.png';

const playerRacket = new Image();
playerRacket.src = 'assets/sprites/player/player_racket0.png';

const iaRacket = new Image();
iaRacket.src = 'assets/sprites/ia/ia_racket.png';

const paddleWidth = 96, paddleHeight = 96, ballRadius = 10;
let playerY = (canvas.height - paddleHeight) / 2;
let computerY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 5, ballSpeedY = 2.5;
let upPressed = false;
let downPressed = false;

const animationFrames = [];
let currentFrame = 0;
let animationInProgress = false;
let lastFrameTime = 0;
const frameDuration = 50;

// Carregar as imagens da sequência de animação
for (let i = 0; i < 6; i++) { // Supondo que você tenha 6 imagens na sequência
    const img = new Image();
    img.src = `assets/sprites/player/player_racket${i}.png`; // Substitua pelo caminho correto
    animationFrames.push(img);
}

function startGame() {
    playerName = document.getElementById('playerName').value || "Jogador";
    document.getElementById('welcome').style.display = 'none';
    document.getElementById('greeting').innerText = `Bem-vindo, ${playerName}!`;
    document.getElementById('game').style.display = 'block';
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5;
    ballSpeedY = 2.5;
}

function gameLoop(timestamp) {
    moveBall();
    moveComputerPaddle();
    movePlayerPaddle();
    drawEverything(timestamp);
    checkScore();
    requestAnimationFrame(gameLoop);
}

function startPaddleAnimation() {
    animationInProgress = true;
    currentFrame = 0; // Reiniciar a animação
    lastFrameTime = 0;
}

function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
        som.play();
    }

    if (ballX + ballRadius > (canvas.width - 66)) {
        if (ballY > computerY && ballY < computerY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            colisaoplayer.play();
        } else {
            playerScore++;
            resetBall();
            som.play();
        }
    }

    if (ballX - ballRadius < 66) {
        if (ballY > playerY && ballY < playerY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            colisaoplayer.play();
            startPaddleAnimation();
        } else {
            computerScore++;
            resetBall();
            som.play();
        }
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
}

function moveComputerPaddle() {
    if (computerY + paddleHeight / 2 < ballY) {
        computerY += 1.6;
    } else {
        computerY -= 1.6;
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

function drawEverything(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Animação da Raquete do Player
    if (animationInProgress) {
        if (timestamp - lastFrameTime > frameDuration) {
            currentFrame++;
            lastFrameTime = timestamp;

            if (currentFrame >= animationFrames.length) {
                currentFrame = 0;
                animationInProgress = false; // Termina a animação
            }
        }
        ctx.drawImage(animationFrames[currentFrame], 0, playerY, paddleWidth, paddleHeight);
        if (currentFrame >= animationFrames.length) {
            currentFrame = 0;
            animationInProgress = false; // Termina a animação
        }
    } else {

        ctx.drawImage(playerRacket, 0, playerY, paddleWidth, paddleHeight);

    }

    // Desenho da raquete do Player
    ctx.drawImage(ballImage, ballX - ballRadius, ballY - ballRadius, ballRadius * 2, ballRadius * 2);

    // Desenho da raquete da IA
    ctx.drawImage(iaRacket, canvas.width - paddleWidth, computerY, paddleWidth, paddleHeight);

    document.getElementById('playerScore').innerText = playerScore;
    document.getElementById('computerScore').innerText = computerScore;
}

function checkScore() {
    if (playerScore >= maxScore || computerScore >= maxScore) {
        alert(`${playerScore >= maxScore ? playerName : 'Computador'} venceu!`);
        resetGame();
    }
}