class Game {
  #difficulty;
  #hasStared = false;

  constructor() {
    const rawGame = sessionStorage.getItem('game');
    const game = JSON.parse(rawGame);

    if (!game)
      return;

    this.#difficulty = game.difficulty;
    this.#hasStared = game.hasStared;
  }

  setDifficulty = (difficulty) => {
    this.#difficulty = difficulty;
    this.#save();
  }

  start = () => {
    this.#hasStared = true;
    this.#save();
  }

  hasStarted = () => {
    return this.#hasStared;
  }

  #save = () => {
    const data = {
      difficulty: this.#difficulty,
      hasStared: this.#hasStared
    }
    sessionStorage.setItem('game', JSON.stringify(data));
  }
}
