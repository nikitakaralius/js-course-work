const AppContext = {
  auth: new Auth(),
  router: new Router(),
}

preventUnauthenticatedAccess();

function preventUnauthenticatedAccess() {
  const currentUser = AppContext.auth.getCurrentUser();
  const currentPage = AppContext.router.getCurrentPage();

  if (!currentUser) {
    AppContext.router.redirectToPage(PAGE.AUTH);
    return;
  }

  if (currentPage === PAGE.AUTH) {
    AppContext.router.redirectToPage(PAGE.MENU);
    return;
  }

  if (currentPage === PAGE.ROOT) {
    AppContext.router.redirectToPage(PAGE.MENU);
  }
}
