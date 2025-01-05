substituteUsername();

function play() {
  document.getElementById("menu-panel").classList.add("hidden");
  document.getElementById("difficulty-panel").classList.remove("hidden");
}

function backToMenu() {
  document.getElementById("difficulty-panel").classList.add("hidden");
  document.getElementById("menu-panel").classList.remove("hidden");
}

function logOut() {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
  redirectToPage("auth");
}

function substituteUsername() {
  const username = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
  const greetingElement = document.getElementById("title-greeting");
  greetingElement.innerText = greetingElement.innerText.replace("{username}", username);
}
