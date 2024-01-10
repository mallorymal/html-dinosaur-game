// Global variables
const dinosaur = document.getElementById('dinosaur');
const game = document.getElementById('game');
const scoreNumber = document.getElementById('score-number');
const restart = document.getElementById('restart');
const restartButton = document.getElementById('restart-button');
let isJumping = false;
let gameStarted = false;
const cacti = [];
let score = 0;
const jumpDistance = 5;
const jumpIntervalTime = 5;
const obstacleMovingDistance = 5;
const obstacleMovingIntervalTime = 10;
const createObstaclesTimeout = [];
const MAX_TIME_OBSTACLE_GENERATED = 1500;
const MIN_TIME_OBSTACLE_GENERATED = 1000;

// Start game event
const startGame = () => {
  hideRestart();
  gameStarted = true;
  dinosaur.style.bottom = '0px';
  clearObstacles();
  generateObstacles();
  resetScore();
};

// Game over event
const gameOver = () => {
  gameStarted = false;
  console.log('Game Over');
  createObstaclesTimeout.forEach((timeout) => clearTimeout(timeout));
  showRestart();
};

// Restart
const showRestart = () => {
  restart.style.display = 'flex';
};
const hideRestart = () => {
  restart.style.display = 'none';
};

// Handle Dinosaur Movement
const jump = () => {
  const maxJumpHeight = game.clientHeight - dinosaur.clientHeight;
  isJumping = true;
  let jumpCount = 0;
  let jumpInterval = setInterval(() => {
    if (gameStarted) {
      if (jumpCount < maxJumpHeight) {
        jumpCount += jumpDistance;
        dinosaur.style.bottom = `${jumpCount}px`;
      } else {
        clearInterval(jumpInterval);
        setTimeout(() => {
          let fallInterval = setInterval(() => {
            if (jumpCount > 0) {
              jumpCount -= jumpDistance;
              dinosaur.style.bottom = `${jumpCount}px`;
            } else {
              clearInterval(fallInterval);
              isJumping = false;
            }
          }, jumpIntervalTime);
        }, jumpIntervalTime);
      }
    }
  }, jumpIntervalTime);
};

// Scoring
const handleScoring = () => {
  score++;
  scoreNumber.innerHTML = score.toString().padStart(4, '0');
};
const resetScore = () => {
  score = 0;
  scoreNumber.innerHTML = score.toString().padStart(4, '0');
};

// Obstacles
const checkCollision = (dinosaur, obstacle) => {
  let dinosaurRect = dinosaur.getBoundingClientRect();
  let obstacleRect = obstacle.getBoundingClientRect();
  return !(dinosaurRect.top > obstacleRect.bottom || dinosaurRect.right < obstacleRect.left || dinosaurRect.bottom < obstacleRect.top || dinosaurRect.left > obstacleRect.right);
};

const randomObstacleClass = () => {
  const classes = ['cactus', 'bird'];
  let baseClass = classes[0];
  if (score >= 10) {
    baseClass = classes[Math.floor(Math.random() * classes.length)];
  }
  if (baseClass === 'cactus') {
    const cactusClass = ['cactus', 'cactus cactus-2', 'cactus cactus-3'];
    baseClass = cactusClass[Math.floor(Math.random() * cactusClass.length)];
  }
  return baseClass;
};

const createObstacle = () => {
  const obstacle = document.createElement('div');
  const classes = randomObstacleClass().split(' ');
  classes.forEach((cls) => obstacle.classList.add(cls));
  document.getElementById('game').appendChild(obstacle);
  cacti.push(obstacle);
  let moveObstacle = setInterval(() => {
    let obstacleRight = parseInt(window.getComputedStyle(obstacle).getPropertyValue('right'));
    if (checkCollision(dinosaur, obstacle)) {
      // Failed
      clearInterval(moveObstacle);
      gameOver();
    } else if (obstacleRight > game.clientWidth) {
      // Passed
      clearInterval(moveObstacle);
      document.getElementById('game').removeChild(obstacle);
      cacti.shift();
      handleScoring();
    } else if (gameStarted) {
      obstacle.style.right = `${obstacleRight + obstacleMovingDistance}px`;
    } else {
      clearInterval(moveObstacle);
    }
  }, obstacleMovingIntervalTime);

  return obstacle;
};

const clearObstacles = () => {
  cacti.forEach((cactus) => {
    document.getElementById('game').removeChild(cactus);
  });
  cacti.length = 0;
};

const generateObstacles = () => {
  const generate = () => {
    if (!gameStarted) {
      return;
    }
    const randomTime = Math.random() * (MAX_TIME_OBSTACLE_GENERATED - MIN_TIME_OBSTACLE_GENERATED) + MIN_TIME_OBSTACLE_GENERATED;
    createObstaclesTimeout.push(
      setTimeout(() => {
        createObstacle();
        generate();
      }, randomTime)
    );
  };

  generate();
};

// Initial Setup
hideRestart();

// Key Event Listener
document.addEventListener('keydown', (event) => {
  if (event.key === ' ') {
    if (!gameStarted) {
      startGame();
    } else if (!isJumping) {
      jump();
    }
  }
});

// Attach the onClick function
restartButton.addEventListener('click', function () {
  startGame();
});
