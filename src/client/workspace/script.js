const colors = [
  'red',
  'blue',
  'green',
  'yellow',
  'purple',
  'orange',
  'pink',
  'cyan',
  'teal',
];

let score = 0;
let identicalSquare1 = null;
let identicalSquare2 = null;
let isGameActive = true;
let N = 32; // Number of squares

function generateRandomRotation() {
  return Math.random() * 360;
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

  for (let i = 0; i < N; i++) {
    const square = generateSquare(2);
    square.style.transform = `rotate(${generateRandomRotation()}deg)`;
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
