startOrPreventGame();

function startOrPreventGame() {
  const timerBar = document.getElementById("timer-bar");
  const grid = document.getElementById("squares-container");
  const score = document.getElementById("score");

  let game;

  const timerHandlers = {
    onTimeChanged: (percentage) => {
      timerBar.style.width = percentage + '%';
    },
    onEnd: () => {
      const player = AppContext.auth.getCurrentUser();
      AppContext.leaderboard.addResult(player, game.getScore());
      AppContext.router.redirectToPage(PAGE.LEADERBOARD);
    },
  }

  const scoreHandlers = {
    onValueChanged: (value) => {
      score.textContent = value;
    }
  }

  game = AppContext
    .gameBuilder
    .setTimerHandlers(timerHandlers)
    .setScoreHandlers(scoreHandlers)
    .setGrid(grid)
    .build();

  if (!game) {
    AppContext.router.redirectToPage(PAGE.MENU);
    return;
  }

  game.start();
}
