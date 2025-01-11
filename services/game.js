const DIFFICULTY = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
}

class GameBuilder {
  #difficulty;
  #timerHandlers;
  #grid;
  #scoreHandlers;
  #storageKey = "game";

  build = () => {
    const rawGame = sessionStorage.getItem(this.#storageKey);
    const game = JSON.parse(rawGame);

    if (!game)
      return;

    this.#difficulty = game.difficulty;

    const prefs = this.#createPrefs(this.#difficulty);

    const timerProps = {
      prefs: {
        maxTimerCapacity: prefs.maxTimerCapacity,
        reducePerSecond: prefs.reducePerSecond,
        reduceFactorDelta: prefs.reduceFactorDelta,
        timePenalty: prefs.timePenalty,
      },
      onTimeChanged: this.#timerHandlers.onTimeChanged,
      onEnd: this.#timerHandlers.onEnd,
    };

    const squaresGeneratorsProps = {
      grid: this.#grid,
      squareLength: prefs.squareLength,
      squareCount: prefs.squareCount,
    }

    const scoreProps = {
      increment: prefs.scoreIncrement,
      decrement: prefs.scoreDecrement,
      onValueChanged: this.#scoreHandlers.onValueChanged,
    }

    const timer = new Timer(timerProps);
    const squaresGenerator = new GridSquaresGenerator(squaresGeneratorsProps);
    const score = new Score(scoreProps);

    return new Game(timer, squaresGenerator, score);
  }

  setDifficulty = (difficulty) => {
    this.#difficulty = difficulty;
    this.#save();
    return this;
  }

  setTimerHandlers = (timerHandlers) => {
    this.#timerHandlers = timerHandlers;
    return this;
  }

  setGrid = (grid) => {
    this.#grid = grid;
    return this;
  }

  setScoreHandlers = (scoreHandlers) => {
    this.#scoreHandlers = scoreHandlers;
    return this;
  }

  #save = () => {
    const data = {
      difficulty: this.#difficulty,
    }
    sessionStorage.setItem(
      this.#storageKey,
      JSON.stringify(data)
    );
  }

  #createPrefs = (difficulty) => {
    switch (difficulty) {
      case DIFFICULTY.EASY:
        return {
          maxTimerCapacity: 60,
          reducePerSecond: 3,
          reduceFactorDelta: 0.1,
          timePenalty: 3,
          squareLength: 2,
          squareCount: 10,
          scoreIncrement: 10,
          scoreDecrement: 5,
        }
      case DIFFICULTY.MEDIUM:
        return {
          maxTimerCapacity: 30,
          reducePerSecond: 3,
          reduceFactorDelta: 0.3,
          timePenalty: 5,
          squareLength: 2,
          squareCount: 15,
          scoreIncrement: 15,
          scoreDecrement: 5,
        }
      case DIFFICULTY.HARD:
        return {
          maxTimerCapacity: 20,
          reducePerSecond: 4,
          reduceFactorDelta: 0.4,
          timePenalty: 6,
          squareLength: 3,
          squareCount: 10,
          scoreIncrement: 40,
          scoreDecrement: 15,
        }
      default:
        throw new Error(`Invalid difficulty: ${difficulty}`);
    }
  }
}

class Game {
  #timer;
  #squaresGenerator;
  #score;

  constructor(timer, squaresGenerator, score) {
    this.#timer = timer;
    this.#squaresGenerator = squaresGenerator;
    this.#score = score;
  }

  start = () => {
    this.#generateField();
    this.#timer.start();
  }

  getScore = () => {
    return this.#score.getValue();
  }

  #handleSquareClicks = (generationResult) => {
    generationResult.squares.forEach((square) => {
      square.addEventListener('click', () => {
        if (square === generationResult.exampleSquare) {
          return;
        }

        if (square === generationResult.targetSquare) {
          this.#handleRightChoice();
        } else {
          this.#handleWrongChoice();
        }
      });
    })
  }

  #generateField = () => {
    const generationResult = this.#squaresGenerator.generate();
    this.#handleSquareClicks(generationResult);
  }

  #handleRightChoice = () => {
    this.#timer.speedUp();
    this.#score.increase();
    this.#generateField()
  }

  #handleWrongChoice = () => {
    this.#timer.decreaseTime();
    this.#score.decrease();
  }
}

class Timer {
  #defaultTimeout = 1000;

  #prefs;
  #timeLeft;
  #reduceFactor;
  #onTimeChanged;
  #onEnd;
  #intervalId;

  constructor(props) {
    this.#prefs = props.prefs;
    this.#timeLeft = props.prefs.maxTimerCapacity;
    this.#onTimeChanged = props.onTimeChanged;
    this.#onEnd = props.onEnd;

    this.#reduceFactor = 1;
    this.#intervalId = null;
  }

  start = () => {
    if (this.#intervalId) {
      clearInterval(this.#intervalId);
    }

    this.#intervalId = setInterval(() => {
      this.#timeLeft -= this.#prefs.reducePerSecond * this.#reduceFactor;
      const percentage = (this.#timeLeft / this.#prefs.maxTimerCapacity) * 100;
      const clampedPercentage = Math.max(0, percentage);

      this.#onTimeChanged(clampedPercentage);

      if (this.#timeLeft <= 0.01) {
        this.#timeLeft = 0;
        this.#onTimeChanged(0);
        clearInterval(this.#intervalId);
        setTimeout(() => this.#onEnd(), this.#defaultTimeout);
      }
    }, this.#defaultTimeout);
  }

  speedUp = () => {
    this.#reduceFactor += this.#prefs.reduceFactorDelta;
  }

  decreaseTime = () => {
    this.#timeLeft -= this.#prefs.timePenalty;
  }
}

class GridSquaresGenerator {
  #gridSize = 10;

  #grid;
  #squareLength;
  #squareCount;

  constructor(props) {
    this.#grid = props.grid;
    this.#squareLength = props.squareLength;
    this.#squareCount = props.squareCount;
  }

  generate = () => {
    this.#grid.innerHTML = '';
    const squares = [];

    const availablePositions = this.#generateGridPositions();

    for (let i = 0; i < this.#squareCount - 1; i++) {
      const square = this.#createSquare(this.#squareLength);
      this.#assignTransform(square, availablePositions);
      squares.push(square);
    }

    const randomIndex = Math.floor(Math.random() * squares.length);
    const exampleSquare = squares[randomIndex];
    const targetSquare = exampleSquare.cloneNode(true);

    exampleSquare.classList.add('highlighted');

    this.#assignTransform(targetSquare, availablePositions);

    squares.push(targetSquare);

    return {
      exampleSquare,
      targetSquare,
      squares
    };
  }

  #createSquare = () => {
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

    const square = document.createElement('div');
    square.classList.add('square');

    const length = this.#squareLength;
    const subSquaresCount = this.#squareLength * length;

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

  #generateGridPositions = () => {
    const positions = [];

    for (let x = 1; x < this.#gridSize; x++) {
      for (let y = 1; y < this.#gridSize; y++) {
        positions.push({x, y});
      }
    }

    positions.sort(_ => Math.random() - 0.5);

    return positions;
  }

  #generateRandomRotation = () => {
    return Math.random() * 360;
  }

  #assignGridPosition = (square, position) => {
    const x = position.x;
    const y = position.y;

    square.style.gridColumn = `${x} / ${x + 1}`;
    square.style.gridRow = `${y} / ${y + 1}`;
  }

  #assignRotation = (square, rotation) => {
    square.style.transform = `rotate(${rotation}deg)`;
  }

  #assignTransform = (square, availablePositions) => {
    const position = this.#popRandomElement(availablePositions);
    const rotation = this.#generateRandomRotation();

    this.#assignGridPosition(square, position);
    this.#assignRotation(square, rotation);
    this.#grid.appendChild(square);
  }

  #popRandomElement = (array) => {
    const start = (Math.random() * array.length) | 0;
    const element = array.splice(start, 1);
    return element[0];
  }
}

class Score {
  #increment
  #decrement
  #onValueChanged;

  #value = 0;

  constructor(props) {
    this.#increment = props.increment;
    this.#decrement = props.decrement;
    this.#onValueChanged = props.onValueChanged;
  }

  increase = () => {
    this.#value += this.#increment;
    this.#onValueChanged(this.#value);
  }

  decrease = () => {
    this.#value = Math.max(0, this.#value - this.#decrement);
    this.#onValueChanged(this.#value);
  }

  getValue = () => {
    return this.#value;
  }
}

class Leaderboard {
  #storageKey = "leaderboard";
  #results;

  constructor() {
    const item = localStorage.getItem(this.#storageKey);

    if (!item) {
      this.#results = new Map();
      return;
    }

    const parseResult = JSON.parse(item);

    if (!parseResult) {
      this.#results = new Map();
      return;
    }

    const results = new Map(parseResult);

    if (!results) {
      this.#results = new Map();
      return;
    }

    this.#results = results;
  }

  addResult = (player, score) => {
    const previousScore = this.#results[player];

    if (!previousScore) {
      this.#results.set(player, score);
    } else {
      this.#results.set(player, Math.max(previousScore, score));
    }

    const entries = Array.from(this.#results.entries());
    const stringValue = JSON.stringify(entries);

    localStorage.setItem(
      this.#storageKey,
      stringValue
    );
  }

  getResults = () => {
    return new Map(this.#results);
  }
}
