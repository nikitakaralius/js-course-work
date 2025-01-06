const DIFFICULTY = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
}

class GameBuilder {
  #difficulty;
  #storageKey = "game";

  build = () => {
    const rawGame = sessionStorage.getItem(this.#storageKey);
    const game = JSON.parse(rawGame);

    if (!game)
      return;

    this.#difficulty = game.difficulty;

    const prefs = this.#createPrefs(this.#difficulty);

    return new Game(prefs);
  }

  setDifficulty = (difficulty) => {
    this.#difficulty = difficulty;
    this.#save();
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
          reduceFactorDelta: 0.1
        }
      case DIFFICULTY.MEDIUM:
        return {
          maxTimerCapacity: 30,
          reducePerSecond: 3,
          reduceFactorDelta: 0.3
        }
      case DIFFICULTY.HARD:
        return {
          maxTimerCapacity: 20,
          reducePerSecond: 4,
          reduceFactorDelta: 0.4
        }
      default:
        throw new Error(`Invalid difficulty: ${difficulty}`);
    }
  }
}

class Game {
  #prefs;
  #timeLeft;
  #reduceFactor;

  constructor(prefs) {
    this.#prefs = prefs;
    this.#timeLeft = prefs.maxTimerCapacity;
    this.#reduceFactor = 1;
  }

  start = () => {

  }

  end = () => {

  }
}
