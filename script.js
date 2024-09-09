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
iaRacket.src = 'assets/sprites/ia/ia_racket0.png';

const paddleWidth = 96, paddleHeight = 96, ballRadius = 10;
let playerY = (canvas.height - paddleHeight) / 2;
let computerY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2, ballY = canvas.height / 2;

let velComputerY = 3.5;
let velBallY = 4.2;
let velPlayerY = 5;

let ballSpeedX = 5, ballSpeedY = velBallY;
let upPressed = false;
let downPressed = false;

let zPressed = false;

const pAnimationFrames = [];
let pCurrentFrame = 0;
let pAnimationInProgress = false;
let pLastFrameTime = 0;

const iAnimationFrames = [];
let iCurrentFrame = 0;
let iAnimationInProgress = false;
let iLastFrameTime = 0;

const frameDuration = 40;

// Carregar as imagens da sequência de animação
for (let i = 0; i < 6; i++) { // Supondo que você tenha 6 imagens na sequência
    const pImg = new Image();
    pImg.src = `assets/sprites/player/player_racket${i}.png`; // Substitua pelo caminho correto
    pAnimationFrames.push(pImg);

    const iImg = new Image();
    iImg.src = `assets/sprites/ia/ia_racket${i}.png`; // Substitua pelo caminho correto
    iAnimationFrames.push(iImg);

}

function startGame() {

    playerName = document.getElementById('playerName').value || "Jogador";
    document.getElementById('welcome').style.display = 'none';
    document.getElementById('greeting').innerText = `Bem-vindo, ${playerName}!`;
    document.getElementById('game').style.display = 'flex';
    let myVar = setInterval(myTimer, 1000);
    let d = 4;
    function myTimer() {

        d -= 1;
        document.getElementById("timer").innerHTML = d;
        if (d == 0) {
            clearInterval(myVar);
            document.getElementById('timer').style.display = 'none';
        }
    }
    requestAnimationFrame(gameLoop);

}

function changeDifficult(difficult) {
    if (difficult == 'easy') {

        velComputerY = 3.5;
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

    if (ballX - ballRadius < 66) {
        if (ballY > playerY && ballY < playerY + paddleHeight && zPressed) {
            ballSpeedX = -ballSpeedX;
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

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        upPressed = true;
    }
    if (e.key === 'ArrowDown') {
        downPressed = true;
    }
    if (e.key === 'z') {
        zPressed = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') {
        upPressed = false;
    }
    if (e.key === 'ArrowDown') {
        downPressed = false;
    }
    if (e.key === 'z') {
        setTimeout(zPressed = false, 2000);
    }
});

// function checkAnimation(animeInProgress, lastFrameT, currentFrame, animationFrames, sprite, spriteY, timestamp) {    
//     if (animeInProgress) {
//         if (timestamp - lastFrameT > frameDuration) {
//             currentFrame++;
//             lastFrameT = timestamp;

//             if (currentFrame >= animationFrames.length) {
//                 currentFrame = 0;
//                 animeInProgress = false; // Termina a animação
//             }
//         }
//         ctx.drawImage(animationFrames[currentFrame], canvas.width - paddleWidth, spriteY, paddleWidth, paddleHeight);
//         if (currentFrame >= animationFrames.length) {
//             currentFrame = 0;
//             animeInProgress = false; // Termina a animação
//         }
//     } else {

//         ctx.drawImage(sprite, canvas.width - paddleWidth, spriteY, paddleWidth, paddleHeight);

//     }
// }

function drawEverything(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (iAnimationInProgress) {
        if (timestamp - iLastFrameTime > frameDuration) {
            iCurrentFrame++;
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
    } else {

        ctx.drawImage(iaRacket, canvas.width - paddleWidth, computerY, paddleWidth, paddleHeight);

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

        ctx.drawImage(playerRacket, 0, playerY, paddleWidth, paddleHeight);

    }

    // checkAnimation(iAnimationInProgress, iLastFrameTime, iCurrentFrame, iAnimationFrames, iaRacket, computerY, timestamp)

    // Desenho da raquete do Player
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