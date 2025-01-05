class Game {
  #difficulty;
  #hasStared = false;

  init = () => {
    const rawGame = sessionStorage.getItem('game');
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
    sessionStorage.setItem('game', JSON.stringify(data));
  }
}
