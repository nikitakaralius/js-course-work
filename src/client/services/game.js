class GameBuilder {
  #difficulty;
  #storageKey = "game";

  build = () => {
    const rawGame = sessionStorage.getItem(this.#storageKey);
    const game = JSON.parse(rawGame);

    if (!game)
      return;

    this.#difficulty = game.difficulty;

    return new Game(this.#difficulty);
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
    sessionStorage.setItem(this.#storageKey, JSON.stringify(data));
  }
}

class Game {
  #difficulty;

  constructor(difficulty) {
    this.#difficulty = difficulty;
  }

  start = () => {

  }

  stop = () => {

  }
}
