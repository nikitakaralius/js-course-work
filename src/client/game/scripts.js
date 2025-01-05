startOrPreventGame();

function startOrPreventGame() {
  const game = AppContext.game.init();

  if (!game || game.hasStarted()) {
    AppContext.game.stop();
    AppContext.router.redirectToPage(PAGE.MENU);
    return;
  }

  AppContext.game.start();
}
