const gamePreferencesValue = sessionStorage.getItem(SESSION_STORAGE_KEYS.GAME_PREFERENCES);
const gamePreferences = JSON.parse(gamePreferencesValue);

if (!gamePreferences || gamePreferences.gameStarted) {
  redirectToPage("menu");
}

gamePreferences.gameStarted = true;

sessionStorage.setItem(
  SESSION_STORAGE_KEYS.GAME_PREFERENCES,
  JSON.stringify(gamePreferences)
);

