startOrPreventGame();

function startOrPreventGame() {
  const timerBar = document.getElementById('timer-bar');

  const timerHandlers = {
    onTimeChanged: (percentage) => {
      timerBar.style.width = percentage + '%';
    },
    onEnd: () => {
      AppContext.router.redirectToPage(PAGE.LEADERBOARD);
    },
  }

  const game = AppContext
    .gameBuilder
    .setTimerHandlers(timerHandlers)
    .build();

  if (!game) {
    AppContext.router.redirectToPage(PAGE.MENU);
    return;
  }

 game.start();
}


// --------------

const colors = [
  "#FF5733", // Bright Red
  "#FFBD33", // Bright Yellow
  "#33FF57", // Bright Green
  "#3357FF", // Bright Blue
  "#FF33A1", // Bright Pink
  "#FF8333", // Bright Orange
  "#33FFF5", // Bright Cyan
  "#B833FF", // Bright Purple
  "#FFC300", // Golden Yellow
  "#DAF7A6", // Light Green
  "#FF6F61", // Coral
  "#6A5ACD", // Slate Blue
  "#FF1493", // Deep Pink
  "#00BFFF", // Deep Sky Blue
  "#FFD700", // Gold
  "#FF4500", // Orange Red
  "#32CD32", // Lime Green
  "#FF69B4", // Hot Pink
  "#00FA9A", // Medium Spring Green
  "#8A2BE2"  // Blue Violet
];

let score = 0;
let identicalSquare1 = null;
let identicalSquare2 = null;
let isGameActive = true;
let N = 32; // Number of squares

function generateRandomRotation() {
  return Math.random() * 360;
}

function generateAvailablePositions() {
  const positions = [];

  for (let i = 1; i < 10; i++) {
    for (let j = 1; j < 10; j++) {
      positions.push([i, j]);
    }
  }

  positions.sort(_ => Math.random() - 0.5);

  return positions;
}

function assignRandomPosition(square, availablePositions) {
  const start = (Math.random() * availablePositions.length) | 0;
  const position = availablePositions.splice(start, 1);

  const randomX = position[0][0];
  const randomY = position[0][1];

  square.style.gridColumn = `${randomX} / ${randomX + 1}`;
  square.style.gridRow = `${randomY} / ${randomY + 1}`;
}

function generateSquare(length) {
  const square = document.createElement('div');
  square.classList.add('square');

  const subSquaresCount = length * length;

  const shuffledColors = [...colors].sort(() => Math.random() - 0.5);
  const squareColors = shuffledColors.slice(0, subSquaresCount);

  for (let i = 0; i < subSquaresCount; i++) {
    const subSquare = document.createElement('div');
    const percentage = 100.0 / length

    subSquare.style.width = `${percentage}%`;
    subSquare.style.height = `${percentage}%`;
    subSquare.style.display = 'inline-block';
    subSquare.style.backgroundColor = squareColors[i];

    square.appendChild(subSquare);
  }

  return square;
}

function generateGameSquares() {
  const squaresContainer = document.getElementById('squares-container');
  squaresContainer.innerHTML = ''; // Clear any previous squares
  let squareElements = [];

  const availablePositions = generateAvailablePositions();

  for (let i = 0; i < N; i++) {
    const square = generateSquare(2);
    square.style.transform = `rotate(${generateRandomRotation()}deg)`;
    assignRandomPosition(square, availablePositions);
    squaresContainer.appendChild(square);
    squareElements.push(square);
  }

  // Pick two squares to be identical
  const randomIndex1 = Math.floor(Math.random() * N);
  let randomIndex2 = Math.floor(Math.random() * N);
  while (randomIndex2 === randomIndex1) {
    randomIndex2 = Math.floor(Math.random() * N);
  }

  identicalSquare1 = squareElements[randomIndex1];
  identicalSquare2 = squareElements[randomIndex2];

  // Make the two squares identical but rotated differently
  identicalSquare2.style.transform = identicalSquare1.style.transform;

  // Highlight the first identical square
  identicalSquare1.classList.add('highlighted');

  // Set up click events
  squareElements.forEach((square, index) => {
    square.addEventListener('click', () => handleSquareClick(square, index));
  });
}

function handleSquareClick(square, index) {
  if (!isGameActive) return;

  if (square === identicalSquare2) {
    score += 10;
    alert('You found the identical square!');
  } else {
    score -= 5;
    alert('Wrong square!');
  }

  // Update the score and reset the game state
  document.getElementById('score').textContent = `Score: ${score}`;
  isGameActive = false;
  setTimeout(() => {
    isGameActive = true;
    generateGameSquares();
  }, 1500);
}

// Start the game
generateGameSquares();
