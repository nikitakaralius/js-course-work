substituteUsername();

function substituteUsername() {
  const username = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
  const greetingElement = document.getElementById("title-greeting");
  greetingElement.innerText = greetingElement.innerText.replace("{username}", username);
}
