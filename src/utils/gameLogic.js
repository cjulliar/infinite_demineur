// Fonction pour créer une grille avec des mines
export const createGrid = (rows, cols, mines) => {
  // Initialiser une grille vide
  let grid = Array(rows).fill().map(() => Array(cols).fill({
    isMine: false,
    isRevealed: false,
    isFlagged: false,
    neighborCount: 0
  }));

  // Placer les mines aléatoirement
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    
    if (!grid[row][col].isMine) {
      grid[row][col] = { ...grid[row][col], isMine: true };
      minesPlaced++;
    }
  }

  // Calculer les nombres pour chaque cellule
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!grid[row][col].isMine) {
        const count = countNeighborMines(grid, row, col);
        grid[row][col] = { ...grid[row][col], neighborCount: count };
      }
    }
  }

  return grid;
};

// Compte les mines voisines
const countNeighborMines = (grid, row, col) => {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (newRow >= 0 && newRow < grid.length && 
          newCol >= 0 && newCol < grid[0].length) {
        if (grid[newRow][newCol].isMine) count++;
      }
    }
  }
  return count;
};

// Révéler les cases vides adjacentes
export const revealEmptyCells = (grid, row, col) => {
  if (!grid[row][col].isRevealed && !grid[row][col].isFlagged) {
    grid[row][col] = { ...grid[row][col], isRevealed: true };
    
    if (grid[row][col].neighborCount === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i;
          const newCol = col + j;
          if (newRow >= 0 && newRow < grid.length && 
              newCol >= 0 && newCol < grid[0].length) {
            revealEmptyCells(grid, newRow, newCol);
          }
        }
      }
    }
  }
  return grid;
}; 