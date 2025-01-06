startOrPreventGame();

function startOrPreventGame() {
  const timerBar = document.getElementById('timer-bar');

  const timerHandlers = {
    onTimeChanged: (percentage) => {
      timerBar.style.width = percentage + '%';
    },
    onEnd: () => {
      alert("Time's up!");
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
