const DIFFICULTY = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
}

class GameBuilder {
  #difficulty;
  #timerHandlers;
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

    const timer = new Timer(timerProps);

    return new Game(timer);
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
          maxTimerCapacity: 6000,
          reducePerSecond: 3,
          reduceFactorDelta: 0.1,
          timePenalty: 3
        }
      case DIFFICULTY.MEDIUM:
        return {
          maxTimerCapacity: 30,
          reducePerSecond: 3,
          reduceFactorDelta: 0.3,
          timePenalty: 5
        }
      case DIFFICULTY.HARD:
        return {
          maxTimerCapacity: 20,
          reducePerSecond: 4,
          reduceFactorDelta: 0.4,
          timePenalty: 6
        }
      default:
        throw new Error(`Invalid difficulty: ${difficulty}`);
    }
  }
}

class Game {
  #timer;

  constructor(timer) {
    this.#timer = timer;
  }

  start = () => {
    this.#timer.start();
  }

  handleRightChoice = () => {
    this.#timer.speedUp();
  }

  handleWrongChoice = () => {
    this.#timer.decreaseTime();
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
