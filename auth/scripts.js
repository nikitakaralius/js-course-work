function onSubmit(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  AppContext.auth.signIn(username);
  AppContext.router.redirectToPage(PAGE.MENU);
}
