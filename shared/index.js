const AppContext = {
  auth: new Auth(),
  router: new Router(),
  gameBuilder: new GameBuilder(),
  leaderboard: new Leaderboard(),
}

preventUnauthenticatedAccess();

function preventUnauthenticatedAccess() {
  const currentUser = AppContext.auth.getCurrentUser();

  const router = AppContext.router;
  const currentPage = router.getCurrentPage();

  if (!currentUser) {
    router.redirectToPage(PAGE.AUTH);
    return;
  }

  if (currentPage === PAGE.AUTH) {
    router.redirectToPage(PAGE.MENU);
    return;
  }

  if (currentPage === PAGE.ROOT || currentPage.startsWith(PAGE.INDEX)) {
    router.redirectToPage(PAGE.MENU);
  }
}
