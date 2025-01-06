startOrPreventGame();

function startOrPreventGame() {
  const game = AppContext.gameBuilder.build();

  if (!game) {
    AppContext.router.redirectToPage(PAGE.MENU);
    return;
  }

 game.start();
}
