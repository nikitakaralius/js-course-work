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
  #gridSize = 7;

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
      "#FF5733",
      "#FFBD33",
      "#33FF57",
      "#3357FF",
      "#FF33A1",
      "#FF8333",
      "#33FFF5",
      "#B833FF",
      "#FFC300",
      "#DAF7A6",
      "#FF6F61",
      "#6A5ACD",
      "#FF1493",
      "#00BFFF",
      "#FFD700",
      "#FF4500",
      "#32CD32",
      "#FF69B4",
      "#00FA9A",
      "#8A2BE2"
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
      subSquare.classList.add('border');

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
  #leaderboardStorageKey = "leaderboard";
  #latestResultStorageKey = "latestResult";
  #results;
  #latestResult;

  constructor() {
    this.#results = this.#loadResults();
    this.#latestResult = this.#loadLatestResult();
  }

  addResult = (player, score) => {
    this.#latestResult = {
      player,
      score
    };

    const previousScore = this.#results.get(player);

    if (!previousScore) {
      this.#results.set(player, score);
    } else {
      this.#results.set(player, Math.max(previousScore, score));
    }

    this.#save();
  }

  getResults = () => {
    return new Map(this.#results);
  }

  getLatestResult = () => {
    return this.#latestResult;
  }

  #loadResults = () => {
    const item = localStorage.getItem(this.#leaderboardStorageKey);

    if (!item) {
      return new Map();
    }

    const parseResult = JSON.parse(item);

    if (!parseResult) {
      return new Map();
    }

    const results = new Map(parseResult);

    if (!results) {
      return new Map();
    }

    return results;
  }

  #loadLatestResult = () => {
    return JSON.parse(sessionStorage.getItem(this.#latestResultStorageKey));
  }

  #save = () => {
    const entries = Array.from(this.#results.entries());
    const stringValue = JSON.stringify(entries);

    localStorage.setItem(
      this.#leaderboardStorageKey,
      stringValue
    );

    sessionStorage.setItem(
      this.#latestResultStorageKey,
      JSON.stringify(this.#latestResult)
    );
  }
}
