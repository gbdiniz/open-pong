// CENÁRIO

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// SPRITES

const ballImage = new Image();
ballImage.src = 'assets/sprites/ball.png';

const playerRacket = new Image();
playerRacket.src = 'assets/sprites/player/player_racket0.png';

const iaRacket = new Image();
iaRacket.src = 'assets/sprites/ia/ia_racket0.png';

// SONS

const som = document.getElementById('som-colisao-parede');
const colisaoplayer = document.getElementById('som-colisao-player');

// INTERFACE

let playerName = "";
let playerScore = 0;
let computerScore = 0;
const maxScore = 5;

// PLAYER E IA

const paddleWidth = 96, paddleHeight = 96, ballRadius = 10;
const frameDuration = 40; // Decreta o FPS

// PLAYER

let playerY = (canvas.height - paddleHeight) / 2;
let velPlayerY = 5;

const pAnimationFrames = [];
let pCurrentFrame = 0;
let pAnimationInProgress = false;
let pLastFrameTime = 0;

// IA

let computerY = (canvas.height - paddleHeight) / 2;
let velComputerY = 3.5;

const iAnimationFrames = [];
let iCurrentFrame = 0;
let iAnimationInProgress = false;
let iLastFrameTime = 0;

// BOLA

let ballX = canvas.width / 2, ballY = canvas.height / 2;
let velBallY = 4.2;
let ballSpeedX = 5, ballSpeedY = velBallY;

// TECLAS

let upPressed = false;
let downPressed = false;
let zPressed = false;



// Carregar as imagens da sequência de animação
for (let i = 0; i < 6; i++) { // Supondo que você tenha 6 imagens na sequência

    // PLAYER ARRAY

    const pImg = new Image();
    pImg.src = `assets/sprites/player/player_racket${i}.png`; // Substitua pelo caminho correto
    pAnimationFrames.push(pImg);

    // IA ARRAY

    const iImg = new Image();
    iImg.src = `assets/sprites/ia/ia_racket${i}.png`; // Substitua pelo caminho correto
    iAnimationFrames.push(iImg);

}

function startGame() {

    playerName = document.getElementById('playerName').value || "Jogador"; // Define o nome do jogador

    // MOVE PARA A PRÓXIMA CENA

    document.getElementById('welcome').style.display = 'none'; 
    document.getElementById('game').style.display = 'flex';

    document.getElementById('greeting').innerText = `Bem-vindo, ${playerName}!`; // Define o texto de boas-vindas
    
    let timer = setInterval(myTimer, 1000);
    let s = 4;
    function myTimer() {
        s -= 1;
        document.getElementById("timer").innerHTML = s;
        if (s == 0) {
            clearInterval(timer);
            document.getElementById('timer').style.display = 'none'; // Tira a contagem da tela
        }
    }
    requestAnimationFrame(gameLoop);

}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5;
    ballSpeedY = velBallY;
}

function gameLoop(timestamp) {
    drawEverything(timestamp);
    setTimeout(moveBall, 4000);

    moveComputerPaddle();
    movePlayerPaddle();
    checkScore();
    requestAnimationFrame(gameLoop);
}

function drawEverything(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (iAnimationInProgress) { // Verifica se a animação está em progresso
        if (timestamp - iLastFrameTime > frameDuration) {
            iCurrentFrame++; // Passa para o próximo frame
            iLastFrameTime = timestamp;

            if (iCurrentFrame >= iAnimationFrames.length) {
                iCurrentFrame = 0;
                iAnimationInProgress = false; // Termina a animação
            }
        }
        ctx.drawImage(iAnimationFrames[iCurrentFrame], canvas.width - paddleWidth, computerY, paddleWidth, paddleHeight);
        if (iCurrentFrame >= iAnimationFrames.length) {
            iCurrentFrame = 0;
            iAnimationInProgress = false; // Termina a animação
        }
    } else { // Se a animação não estiver em progresso

        ctx.drawImage(iaRacket, canvas.width - paddleWidth, computerY, paddleWidth, paddleHeight); // Desenha a forma "idle" da IA

    }

    // Animação da Raquete do Player
    if (pAnimationInProgress) {
        if (timestamp - pLastFrameTime > frameDuration) {
            pCurrentFrame++;
            pLastFrameTime = timestamp;

            if (pCurrentFrame >= pAnimationFrames.length) {
                pCurrentFrame = 0;
                pAnimationInProgress = false; // Termina a animação
            }
        }
        ctx.drawImage(pAnimationFrames[pCurrentFrame], 0, playerY, paddleWidth, paddleHeight);
        if (pCurrentFrame >= pAnimationFrames.length) {
            pCurrentFrame = 0;
            pAnimationInProgress = false; // Termina a animação
        }
    } else {

        ctx.drawImage(playerRacket, 0, playerY, paddleWidth, paddleHeight); // Desenha a forma "idle" do jogador

    }

    ctx.drawImage(ballImage, ballX - ballRadius, ballY - ballRadius, ballRadius * 2, ballRadius * 2); // Desenha o sprite da bola

    document.getElementById('playerScore').innerText = playerScore;
    document.getElementById('computerScore').innerText = computerScore;
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
            startPaddleIAnimation();
        } else {
            playerScore++;
            resetBall();
            som.play();
        }
    }

    if (ballX - ballRadius < 44) {
        if (ballY > playerY && ballY < playerY + paddleHeight && zPressed) {
            setInterval(ballSpeedX = -ballSpeedX, 1000)
            colisaoplayer.play();
            startPaddlePAnimation();

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
        computerY += velComputerY;
    } else {
        computerY -= velComputerY;
    }
}

function movePlayerPaddle() {
    if (upPressed && playerY > 0) {
        playerY -= velPlayerY;
    }
    if (downPressed && playerY < canvas.height - paddleHeight) {
        playerY += velPlayerY;
    }
}

function startPaddlePAnimation() {
    pAnimationInProgress = true;
    pCurrentFrame = 0; // Reiniciar a animação
    pLastFrameTime = 0;
}

function startPaddleIAnimation() {
    iAnimationInProgress = true;
    iCurrentFrame = 0; // Reiniciar a animação
    iLastFrameTime = 0;
}

function checkScore() { //Verifica se o jogador ou a IA ganharam
    if (playerScore >= maxScore || computerScore >= maxScore) { // Verifica quem atingiu a pontuação máxima
        alert(`${playerScore >= maxScore ? playerName : 'Computador'} venceu!`); // Alerta mostrando quem ganhou
        resetGame(); // Reseta o jogo
    }
}

function changeDifficult(difficult) {
    if (difficult == 'easy') {

        velComputerY = 2.9;
        ballSpeedY = 4.2;

    } else if (difficult == 'normal') {

        velComputerY = 4.5;
        ballSpeedY = 5.5;

    } else {

        velPlayerY = 6.5;
        velComputerY = 6.5;
        ballSpeedY = 8.5;

    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') { // Verifica se tecla "Seta para cima" está sendo pressionada
        upPressed = true;
    }
    if (e.key === 'ArrowDown') { // Verifica se tecla "Seta para baixo" está sendo pressionada
        downPressed = true;
    }
    if (e.key === 'z') { // Verifica se tecla "z" está sendo pressionada
        zPressed = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') { // Verifica se tecla "Seta para cima" parou de ser pressionada
        upPressed = false;
    }
    if (e.key === 'ArrowDown') { // Verifica se tecla "Seta para baixo" parou de ser pressionada
        downPressed = false;
    }
    if (e.key === 'z') { // Verifica se tecla "z" parou de ser pressionada
        setTimeout(function() {zPressed = false;}, 450); // Faz com que a tecla demore para ser computada como não pressionada
    }
});