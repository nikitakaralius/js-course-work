class Auth {
  #LOCAL_STORAGE_KEY = 'currentUser';

  signIn = (username) => {
    localStorage.setItem(this.#LOCAL_STORAGE_KEY, username);
  }

  signOut = () => {
    localStorage.removeItem(this.#LOCAL_STORAGE_KEY);
  }

  getCurrentUser = () => {
    return localStorage.getItem(this.#LOCAL_STORAGE_KEY);
  }
}
