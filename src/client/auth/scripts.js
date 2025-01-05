function onSubmit(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  signIn(username)
}

function signIn(username) {
  localStorage.setItem(LOCAL_STORAGE_KEY.CURRENT_USER, username);
  redirectToPage(PAGE.MENU);
}
