const menuPanel = document.getElementById('menu-panel');
const difficultyPanel = document.getElementById('difficulty-panel');

substituteUsername();

function selectDifficulty() {
  menuPanel.classList.add("hidden");
  difficultyPanel.classList.remove("hidden");
}

function goToLeaderboard() {
  AppContext.router.redirectToPage(PAGE.LEADERBOARD);
}

function backToMenu() {
  difficultyPanel.classList.add("hidden");
  menuPanel.classList.remove("hidden");
}

function logOut() {
  AppContext.auth.signOut();
  AppContext.router.redirectToPage(PAGE.AUTH);
}

function play(difficulty) {
  AppContext.gameBuilder.setDifficulty(difficulty);
  AppContext.router.redirectToPage(PAGE.GAME);
}

function substituteUsername() {
  const username = AppContext.auth.getCurrentUser();
  const greetingElement = document.getElementById("title-greeting");
  greetingElement.innerText = greetingElement.innerText.replace("{username}", username);
}
