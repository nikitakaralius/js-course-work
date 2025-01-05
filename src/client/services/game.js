class Game {
  #difficulty;
  #hasStared = false;
  #storageKey = "game";

  init = () => {
    const rawGame = sessionStorage.getItem(this.#storageKey);
    const game = JSON.parse(rawGame);

    if (!game)
      return;

    this.#difficulty = game.difficulty;
    this.#hasStared = game.hasStared;

    return this;
  }

  setDifficulty = (difficulty) => {
    this.#difficulty = difficulty;
    this.#save();
  }

  start = () => {
    this.#hasStared = true;
    this.#save();
  }

  stop = () => {
    this.#hasStared = false;
    this.#save();
  }

  hasStarted = () => {
    return this.#hasStared;
  }

  #save = () => {
    const data = {
      difficulty: this.#difficulty,
      hasStared: this.#hasStared,
    }
    sessionStorage.setItem(this.#storageKey, JSON.stringify(data));
  }
}
