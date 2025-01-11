startOrPreventGame();

function startOrPreventGame() {
  const timerBar = document.getElementById("timer-bar");
  const grid = document.getElementById("squares-container");
  const score = document.getElementById("score");

  const timerHandlers = {
    onTimeChanged: (percentage) => {
      timerBar.style.width = percentage + '%';
    },
    onEnd: () => {
      AppContext.router.redirectToPage(PAGE.LEADERBOARD);
    },
  }

  const scoreHandlers = {
    onValueChanged: (value) => {
      score.textContent = value;
    }
  }

  const game = AppContext
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
