fillTableUp(AppContext.leaderboard);

function fillTableUp(leaderboard) {
  const tableBody = document.querySelector('#leaderboard tbody');
  tableBody.innerHTML = '';

  const results = Array.from(leaderboard.getResults());
  results.sort((a, b) => b[1] - a[1]);

  const latestResult = leaderboard.getLatestResult();

  results.forEach(([player, score]) => {
    const row = document.createElement('tr');
    const playerCell = document.createElement('td');
    const scoreCell = document.createElement('td');

    playerCell.textContent = player;
    scoreCell.textContent = score;

    if (latestResult && player === latestResult.player) {
      scoreCell.textContent += ` (${latestResult.score})`;
    }

    row.appendChild(playerCell);
    row.appendChild(scoreCell);
    tableBody.appendChild(row);
  });
}

function backToMenu() {
  AppContext.router.redirectToPage(PAGE.MENU);
}

function playAgain() {
  AppContext.router.redirectToPage(PAGE.GAME);
}
