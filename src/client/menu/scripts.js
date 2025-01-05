substituteUsername();

function selectDifficulty() {
  document.getElementById("menu-panel").classList.add("hidden");
  document.getElementById("difficulty-panel").classList.remove("hidden");
}

function backToMenu() {
  document.getElementById("difficulty-panel").classList.add("hidden");
  document.getElementById("menu-panel").classList.remove("hidden");
}

function logOut() {
  AppContext.auth.signOut();
  AppContext.router.redirectToPage(PAGE.AUTH);
}

function play(difficulty) {
  AppContext.game.setDifficulty(difficulty);
  AppContext.router.redirectToPage(PAGE.GAME);
}

function substituteUsername() {
  const username = AppContext.auth.getCurrentUser();
  const greetingElement = document.getElementById("title-greeting");
  greetingElement.innerText = greetingElement.innerText.replace("{username}", username);
}
