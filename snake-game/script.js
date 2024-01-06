// define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

const winnerText = document.getElementById('winner');

// define game variables
const gridSize = 20;
let snake = [{x: 5, y: 5}];// 뱀의 위치, 길어지면 추가됨
let food = generateFood();// {x, y} 형식
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 250;
let gameStarted = false;

let snake2 = [{x: 14, y: 14}];// 2번째 뱀 시작 위치
let direction2 = 'left';// 2번째 뱀의 이동 방향

let win1 = 0;// 1번 뱀이 이기는 경우 1
let win2 = 0;// 2번 뱀이 이기는 경우 1

// draw game map, snake, food
function draw() {
    board.innerHTML = '';// 그릴 때 마다 초기화
    drawSnake();// 뱀 상태 그려줌
    drawFood();// 음식 상태 그려줌
    updateScore();// 점수 그려줌
}

// draw snake
function drawSnake() {
    // snake 배열에 들어있는 각 정보마다 arrow function을 실행해줌
    snake.forEach((segment) => {//뱀의 각 위치들을
        const snakeElement = createGameElement('div', 'snake');// snake 클래스인 div로 바꿔줌
        setPosition(snakeElement, segment);// 뱀 클래스에 위치 정보를 추가해줌
        board.appendChild(snakeElement);// 그것을 보드에 추가
    });

    snake2.forEach((segment) => {
        const snakeElement2 = createGameElement('div', 'snake2');// 각 칸들을 snake를 클래스로 가지는 div 로 넣어줌
        setPosition(snakeElement2, segment);// 각 칸에 위치 정보를 style 형식으로 넣어줌
        board.appendChild(snakeElement2);
    });
}

// create a snake or food cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);// ex) div
    element.className = className;// ex) div에 클래스를 snake로
    return element;// <div class='snake'></div> 형식으로 return
}

// set the position of the snake or the food
function setPosition(element, position) {
    element.style.gridColumn = position.x;// tag의 style로 x,y 축 값을 넣어줌
    element.style.gridRow = position.y;
}

// draw food function
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);// board의 자식으로 추가해줌
    }
}

// generate food
function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y}// 오브젝트 형식으로 return
}

// 뱀의 이동을 위해서 위치 값을 수정하는게 아니라 추가와 삭제를 이용
function move() {
    const head = { ...snake[0] };// ...이 형식에 맞게 펼쳐 줌
    const head2 = { ...snake2[0]}
    
    switch(direction) {// 새 head 변수를 상황에 맞게 수정
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    switch(direction2) {// 두번째 뱀 이동 방향
        case 'up':
            head2.y--;
            break;
        case 'down':
            head2.y++;
            break;
        case 'left':
            head2.x--;
            break;
        case 'right':
            head2.x++;
            break;
    }
    
    snake.unshift(head);// snake 배열의 앞에 추가해주는 함수
    snake2.unshift(head2);

    // 먹이를 먹은 경우
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();// 바뀐 속도가 적용될 수 있도록 새 인터벌로 들어가는 것
        clearInterval(gameInterval);// 이전의 인터벌 초기화
        gameInterval = setInterval(() => {// 먹은 경우 새로운 인터벌 개시
           move();
           checkCollision();
           draw();
        }, gameSpeedDelay);
    }
    else {
        snake.pop();// 먹이를 먹은게 아닐경우 꼬리 제거
    }

    if (head2.x === food.x && head2.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    }
    else{
        snake2.pop();
    }
}

function startGame() {
    gameStarted = true;// keep track of a running game
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    winnerText.style.display = 'none';
    gameInterval = setInterval(() => {// 처음 게임을 시작하고 음식을 먹기까지의 인터벌
        move();
        checkCollision();
        draw();
    }, 300);
}

// keypress event listener
function handleKeyPress(event) {
    if(
        (!gameStarted && event.code === 'Space') ||
        (!gameStarted && event.code === ' ')
    ) {
        startGame();
    }
    else {
        switch(event.key) {
            case 'ArrowUp':// 1번째 뱀의 이동 키 관리
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
            case 'w':// 2번째 뱀의 이동 키 관리
                direction2 = 'up';
                break;
            case 's':
                direction2 = 'down';
                break;
            case 'a':
                direction2 = 'left';
                break;
            case 'd':
                direction2 = 'right';
                break;
        }
    }
}

// 페이지에서 키가 눌렸을 때 그것을 핸들해주는 이벤트 리스터
document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
    //console.log(gameSpeedDelay);
    if(gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;// 인터벌이 줄어들어 자주 그려줌으로 이동이 빨라짐
    }
    else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    }
    else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    }
    else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}


function checkCollision() {// 충돌을 확인하는 함수
    const head = snake[0];
    const head2 = snake2[0];

    if( head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {// 1번 뱀의 장외
        win2 = 1;
        resetGame();
    }
    if( head2.x < 1 || head2.x > gridSize || head2.y < 1 || head2.y > gridSize) {// 2번 뱀의 장외
        win1 = 1;
        resetGame();
    }

    if(head.x === head2.x && head.y === head2.y) {// 뱀 서로의 머리가 닿은 경우
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {// 1번 뱀 혹은 2번 뱀이 1번 뱀의 몸에 닿는 경우
        if (head.x === snake[i].x && head.y === snake[i].y) {// 1번 뱀이 1번에 닿은 경우
            win2 = 1;
            resetGame();
        }
        if (head2.x === snake[i].x && head2.y === snake[i].y) {// 2번 뱀이 1번에 닿은 경우
            win1 = 1;
            resetGame();
        }
    }

    for (let i = 1; i < snake2.length; i++) {// 1번 뱀 혹은 2번 뱀이 2번 뱀의 몸에 닿는 경우
        if (head.x === snake2[i].x && head.y === snake2[i].y) {// 1번이 2번에 닿은 경우
            win2 = 1;
            resetGame();
        }
        if (head2.x === snake2[i].x && head2.y === snake2[i].y){// 2번이 2번에 닿은 경우
            win1 = 1
            resetGame();
        }
    }
}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{x: 10, y: 10}];
    snake2 = [{x: 14, y: 14}];
    win1 = 0;
    win2 = 0;
    food = generateFood();
    direction = 'right';
    direction2 = 'left';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore() {
    const currentScore = (snake.length + snake2.length - 2);
    score.textContent = currentScore.toString().padStart(3, '0');

}

function stopGame() {// 게임이 끝나는 경우
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
    winnerText.style.display = 'block';
    if (win1 === 1) {
        winnerText.textContent = "Blue Snake Win!";
    }
    else if (win2 === 1) {
        winnerText.textContent = "Red Snake Win!";
    }
    else {
        winnerText.textContent = "Draw!";
    }
}


function updateHighScore() {
    const currentScore = snake.length + snake2.length - 2;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().
        padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}