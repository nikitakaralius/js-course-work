const populateTable = (leaderboardInstance) => {
  const tableBody = document.querySelector('#leaderboard tbody');
  tableBody.innerHTML = ''; // Clear existing rows

  const results = Array.from(leaderboardInstance.getResults());
  results.sort((a, b) => b[1] - a[1]); // Sort by score descending

  results.forEach(([player, score]) => {
    const row = document.createElement('tr');
    const playerCell = document.createElement('td');
    const scoreCell = document.createElement('td');

    playerCell.textContent = player;
    scoreCell.textContent = score;

    row.appendChild(playerCell);
    row.appendChild(scoreCell);
    tableBody.appendChild(row);
  });
};

const leaderboard = AppContext.leaderboard;

leaderboard.addResult('nkaralius', 256);
leaderboard.addResult('test1', 256);
leaderboard.addResult('test2', 2342);
leaderboard.addResult('test3', 123);
leaderboard.addResult('test4', 132);

// Populate the table with leaderboard data
populateTable(leaderboard);
