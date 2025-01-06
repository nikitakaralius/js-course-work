startOrPreventGame();

function startOrPreventGame() {
  const timerBar = document.getElementById('timer-bar');

  const timerHandlers = {
    onTimeChanged: (percentage) => {
      timerBar.style.width = percentage + '%';
    },
    onEnd: () => {
      AppContext.router.redirectToPage(PAGE.LEADERBOARD);
    },
  }

  const game = AppContext
    .gameBuilder
    .setTimerHandlers(timerHandlers)
    .build();

  if (!game) {
    AppContext.router.redirectToPage(PAGE.MENU);
    return;
  }

 game.start();
}
