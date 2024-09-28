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

// let playerName = "";
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

let alreadyPressed = false;

// PLAYER 2

let computerY = (canvas.height - paddleHeight) / 2;
let velComputerY = 5;

const iAnimationFrames = [];
let iCurrentFrame = 0;
let iAnimationInProgress = false;
let iLastFrameTime = 0;

let alreadyTwoPressed = false;

// BOLA

let ballX = 55, ballY = canvas.height / 2;
let velBallY = 2;
var ofBallSpeedX = 8;
let ballSpeedX = 0, ballSpeedY = 0;

var gravity = 0.5;
var bounce = 0.7;
var xFriction = 0.1;

// TECLAS

let upPressed = false;
let downPressed = false;
let attackPressed = false;

let upTwoPressed = false;
let downTwoPressed = false;
let attackTwoPressed = false;

let isHolding = true;
let isTwoHolding = false;

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

    // playerName = document.getElementById('playerName').value || "Jogador"; // Define o nome do jogador

    // MOVE PARA A PRÓXIMA CENA

    // document.getElementById('welcome').style.display = 'none';
    // document.getElementById('help').style.display = 'flex';
    // document.getElementById('game').style.display = 'flex';

    document.getElementById('greeting').innerText = `Bem-vindos!`; // Define o texto de bowwwas-vindas

    // let timer = setInterval(myTimer, 1000);
    // let s = 4;
    // function myTimer() {
    //     s -= 1;
    //     document.getElementById("timer").innerHTML = s;
    //     if (s == 0) {
    //         clearInterval(timer);
    //         document.getElementById('timer').style.display = 'none'; // Tira a contagem da tela
    //     }
    // }
    requestAnimationFrame(gameLoop);

}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    playerY = canvas.height / 2;
    computerY = canvas.height / 2;
    isTwoHolding = false;
    isHolding = true;
    ballX = 55;
    ballY = playerY + 34;
    // ballSpeedX = 0;
    // ballSpeedY = 0;
    
}

function gameLoop(timestamp) {
    drawEverything(timestamp);
    if (isHolding && attackPressed) {
        isHolding = false;
        ballSpeedX = ofBallSpeedX;
        ballSpeedY = velBallY;
    }

    if (isTwoHolding && attackTwoPressed) {
        isTwoHolding = false;
        ballSpeedX = ofBallSpeedX;
        ballSpeedY = velBallY;
    }

    moveBall();
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
        setInterval(xF, 14);
    }

    if (ballX + ballRadius > (canvas.width - 44)) {
        if (ballY > computerY && ballY < computerY + paddleHeight) {
            if (attackTwoPressed) {
                if (ballSpeedX == ofBallSpeedX * 2) {
                    ballSpeedX = -ofBallSpeedX * 2;
                } else {
                    ballSpeedX = -ofBallSpeedX * 2;
                }
                colisaoplayer.play();
                // startPaddleIAnimation();
            }

        } else {
            playerScore++;
            resetBall();
            som.play();
        }
    }

    if (ballX - ballRadius < 44) {
        if (ballY > playerY && ballY < playerY + paddleHeight && attackPressed) {
            if (ballSpeedX == ofBallSpeedX * 2) {
                ballSpeedX = -ballSpeedX;
            } else {
                ballSpeedX = -ballSpeedX * 2;
            }
            colisaoplayer.play();
            // startPaddlePAnimation();

        } else {
            computerScore++;
            resetBall(isTwoScored = true);
            som.play();
        }
    }
}

function xF() {
    if (ballSpeedX > ofBallSpeedX)
        ballSpeedX = ballSpeedX - xFriction;
    if (ballSpeedX < -ofBallSpeedX)
        ballSpeedX = ballSpeedX + xFriction;
}

function resetBall(isTwoScored = false) {
    if (isTwoScored) {
        ballX = canvas.width - 65;
        ballY = computerY + 34;
        ballSpeedX = 0;
        ballSpeedY = 0;
        isTwoHolding = true;


    } else {
        ballX = 55;
        ballY = playerY + 34;
        ballSpeedX = 0;
        ballSpeedY = 0;
        isHolding = true;

    }

}

function moveComputerPaddle() {
    if (upTwoPressed && computerY > 0) {
        computerY -= velComputerY;
        if (isTwoHolding) {
            ballY -= velComputerY;
        }
    }
    if (downTwoPressed && computerY < canvas.height - paddleHeight) {
        computerY += velComputerY;
        if (isTwoHolding) {
            ballY += velComputerY;
        }
    }

}

function movePlayerPaddle() {
    if (upPressed && playerY > 0) {
        playerY -= velPlayerY;
        if (isHolding) {
            ballY -= velPlayerY;
        }
    }
    if (downPressed && playerY < canvas.height - paddleHeight) {
        playerY += velPlayerY;
        if (isHolding) {
            ballY += velPlayerY;
        }
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
        alert(`${playerScore >= maxScore ? 'Player 1' : 'Player 2'} venceu!`); // Alerta mostrando quem ganhou
        resetGame(); // Reseta o jogo
    }
}

function changeDifficult(difficult) {
    if (difficult == 'easy') {

        ofBallSpeedX = 8;

        // velComputerY = 3.2;
        // ballSpeedY = 4.2;

    } else if (difficult == 'normal') {

        ofBallSpeedX = 10;

        // velComputerY = 4.5;
        // ballSpeedY = 5.9;

    } else {

        ofBallSpeedX = 12;

        // velPlayerY = 6.5;
        // velComputerY = 6.5;
        // ballSpeedY = 8.5;

    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'w') { // Verifica se tecla "Seta para cima" está sendo pressionada
        upPressed = true;
    }
    if (e.key === 'ArrowUp') { // Verifica se tecla "Seta para cima" está sendo pressionada
        upTwoPressed = true;
    }
    if (e.key === 's') { // Verifica se tecla "Seta para baixo" está sendo pressionada
        downPressed = true;
    }
    if (e.key === 'ArrowDown') { // Verifica se tecla "Seta para baixo" está sendo pressionada
        downTwoPressed = true;
    }
    if (e.key === 'c') { // Verifica se tecla "z" está sendo pressionada
        if (!alreadyPressed) {
            attackPressed = true;
            alreadyPressed = true;
            startPaddlePAnimation();
            setTimeout(function () {
                attackPressed = false;
            }, 350)

            setTimeout(function () {
                alreadyPressed = false;
            }, 600); // Faz com que a tecla demore para ser computada como não pressionada
        }
    }

    if (e.key === 'Enter') { // Verifica se tecla "control" está sendo pressionada
        if (!alreadyTwoPressed) {
            attackTwoPressed = true;
            alreadyTwoPressed = true;
            startPaddleIAnimation();
            setTimeout(function () {
                attackTwoPressed = false;
            }, 350)

            setTimeout(function () {
                alreadyTwoPressed = false;
            }, 600); // Faz com que a tecla demore para ser computada como não pressionada
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'w') { // Verifica se tecla "Seta para cima" parou de ser pressionada
        upPressed = false;
    }
    if (e.key === 'ArrowUp') { // Verifica se tecla "Seta para cima" parou de ser pressionada
        upTwoPressed = false;
    }
    if (e.key === 's') { // Verifica se tecla "Seta para baixo" parou de ser pressionada
        downPressed = false;
    }
    if (e.key === 'ArrowDown') { // Verifica se tecla "Seta para baixo" parou de ser pressionada
        downTwoPressed = false;
    }
});