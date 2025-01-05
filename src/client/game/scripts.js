preventUnplannedGame();

function preventUnplannedGame() {
  const gamePreferencesValue = sessionStorage.getItem(SESSION_STORAGE_KEY.GAME_PREFERENCES);
  const gamePreferences = JSON.parse(gamePreferencesValue);

  if (!gamePreferences || gamePreferences.gameStarted) {
    redirectToPage(PAGE.MENU);
  }

  gamePreferences.gameStarted = true;

  sessionStorage.setItem(
    SESSION_STORAGE_KEY.GAME_PREFERENCES,
    JSON.stringify(gamePreferences)
  );
}
