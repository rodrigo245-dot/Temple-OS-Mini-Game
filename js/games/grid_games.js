// ==========================================================================
// CATÉGORIE 1 : GRILLES & TABLEAUX 2D (TEMPLEOS V2.0)
// 1. Jeu de la Vie (Conway)
// 2. Le Taquin 15-Puzzle (Mélange résoluble)
// 3. Générateur & Solveur de Sudoku (Backtracking)
// ==========================================================================

// --------------------------------------------------------------------------
// 1. LE JEU DE LA VIE DE CONWAY (AUTOMATE CELLULAIRE 2D)
// --------------------------------------------------------------------------
class ConwayGame {
  constructor(canvasId, statsId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.statsEl = document.getElementById(statsId);

    this.cols = 40;
    this.rows = 28;
    this.cellSize = 10;
    this.canvas.width = this.cols * this.cellSize;
    this.canvas.height = this.rows * this.cellSize;

    this.grid = this.createGrid();
    this.isRunning = false;
    this.generation = 0;
    this.intervalId = null;

    this.initEvents();
    this.loadGliderGun();
    this.draw();
  }

  createGrid() {
    return Array(this.rows).fill(0).map(() => Array(this.cols).fill(0));
  }

  initEvents() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / this.cellSize);
      const y = Math.floor((e.clientY - rect.top) / this.cellSize);
      if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
        this.grid[y][x] = this.grid[y][x] ? 0 : 1;
        window.soundEngine.beep(this.grid[y][x] ? 600 : 300, 0.03);
        this.draw();
      }
    });
  }

  toggle() {
    this.isRunning = !this.isRunning;
    if (this.isRunning) {
      this.intervalId = setInterval(() => this.step(), 100);
    } else {
      clearInterval(this.intervalId);
    }
  }

  clear() {
    this.isRunning = false;
    clearInterval(this.intervalId);
    this.grid = this.createGrid();
    this.generation = 0;
    this.updateStats();
    this.draw();
  }

  randomize() {
    this.clear();
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.grid[r][c] = Math.random() < 0.25 ? 1 : 0;
      }
    }
    this.draw();
  }

  loadPreset(name) {
    this.clear();
    if (name === 'glider') {
      const coords = [[1,2], [2,3], [3,1], [3,2], [3,3]];
      coords.forEach(([r, c]) => { this.grid[r + 2][c + 2] = 1; });
    } else if (name === 'pulsar') {
      const r0 = 7, c0 = 13;
      const offsets = [-4, -2, -1, 1, 2, 4];
      offsets.forEach(d => {
        this.grid[r0 + d][c0 - 2] = 1; this.grid[r0 + d][c0 - 1] = 1; this.grid[r0 + d][c0 + 1] = 1; this.grid[r0 + d][c0 + 2] = 1;
        this.grid[r0 - 2][c0 + d] = 1; this.grid[r0 - 1][c0 + d] = 1; this.grid[r0 + 1][c0 + d] = 1; this.grid[r0 + 2][c0 + d] = 1;
      });
    } else {
      this.loadGliderGun();
    }
    this.draw();
  }

  loadGliderGun() {
    // Canon à planeurs simplifié
    const pts = [
      [5,1],[5,2],[6,1],[6,2],
      [5,11],[6,11],[7,11],[4,12],[8,12],[3,13],[9,13],[3,14],[9,14],[6,15],[4,16],[8,16],[5,17],[6,17],[7,17],[6,18],
      [3,21],[4,21],[5,21],[3,22],[4,22],[5,22],[2,23],[6,23],[1,25],[2,25],[6,25],[7,25],
      [3,35],[4,35],[3,36],[4,36]
    ];
    pts.forEach(([r, c]) => {
      if (r < this.rows && c < this.cols) this.grid[r][c] = 1;
    });
  }

  step() {
    const next = this.createGrid();
    let livingCount = 0;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        let neighbors = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = (r + dr + this.rows) % this.rows;
            const nc = (c + dc + this.cols) % this.cols;
            neighbors += this.grid[nr][nc];
          }
        }

        // Règles de Conway (B3/S23)
        if (this.grid[r][c] === 1) {
          next[r][c] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
        } else {
          next[r][c] = (neighbors === 3) ? 1 : 0;
        }
        if (next[r][c] === 1) livingCount++;
      }
    }

    this.grid = next;
    this.generation++;
    this.updateStats(livingCount);
    this.draw();
  }

  updateStats(alive) {
    if (this.statsEl) {
      this.statsEl.textContent = `GEN : ${this.generation} | VIVANTES : ${alive !== undefined ? alive : 0}`;
    }
  }

  draw() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.strokeStyle = '#000044';
    this.ctx.lineWidth = 0.5;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] === 1) {
          this.ctx.fillStyle = '#ffff55';
          this.ctx.fillRect(c * this.cellSize, r * this.cellSize, this.cellSize - 1, this.cellSize - 1);
        } else {
          this.ctx.strokeRect(c * this.cellSize, r * this.cellSize, this.cellSize, this.cellSize);
        }
      }
    }
  }
}

// --------------------------------------------------------------------------
// 2. LE TAQUIN 15-PUZZLE (GARANTI MATHÉMATIQUEMENT RÉSOLUBLE)
// --------------------------------------------------------------------------
class TaquinPuzzle {
  constructor(boardId, movesId, commentId) {
    this.boardEl = document.getElementById(boardId);
    this.movesEl = document.getElementById(movesId);
    this.commentEl = document.getElementById(commentId);

    this.tiles = [];
    this.moves = 0;
    this.isWon = false;

    this.reset();
  }

  reset() {
    this.moves = 0;
    this.isWon = false;
    this.updateMoves();
    this.tiles = this.generateSolvableBoard();
    this.render();
    if (this.commentEl) {
      this.commentEl.textContent = "GLISSE LES TUILES DANS L'ORDRE SACRÉ 1 À 15.";
    }
  }

  generateSolvableBoard() {
    let arr = [];
    for (let i = 1; i <= 15; i++) arr.push(i);
    arr.push(0); // 0 = case vide

    // Mélanger jusqu'à ce que la grille soit résoluble
    do {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    } while (!this.isSolvable(arr) || this.checkVictory(arr));

    return arr;
  }

  isSolvable(arr) {
    let inversions = 0;
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        if (arr[i] !== 0 && arr[j] !== 0 && arr[i] > arr[j]) {
          inversions++;
        }
      }
    }
    const emptyRowFromBottom = 4 - Math.floor(arr.indexOf(0) / 4);
    // Règle du Taquin 4x4 résoluble :
    // Si la ligne vide depuis le bas est impaire, les inversions doivent être paires.
    // Si la ligne vide depuis le bas est paire, les inversions doivent être impaires.
    return (emptyRowFromBottom % 2 === 1) === (inversions % 2 === 0);
  }

  handleTileClick(index) {
    if (this.isWon) return;
    const emptyIdx = this.tiles.indexOf(0);
    const row = Math.floor(index / 4);
    const col = index % 4;
    const emptyRow = Math.floor(emptyIdx / 4);
    const emptyCol = emptyIdx % 4;

    const isAdjacent = (Math.abs(row - emptyRow) + Math.abs(col - emptyCol)) === 1;

    if (isAdjacent) {
      this.tiles[emptyIdx] = this.tiles[index];
      this.tiles[index] = 0;
      this.moves++;
      window.soundEngine.playPaddleHit();
      this.updateMoves();
      this.render();

      if (this.checkVictory(this.tiles)) {
        this.isWon = true;
        window.soundEngine.playVictory();
        if (this.commentEl) {
          this.commentEl.textContent = `[TOP] TAQUIN RÉSOLU EN ${this.moves} COUPS ! GLOIRE AU RING-0 !`;
        }
      }
    }
  }

  checkVictory(arr) {
    for (let i = 0; i < 15; i++) {
      if (arr[i] !== i + 1) return false;
    }
    return arr[15] === 0;
  }

  updateMoves() {
    if (this.movesEl) this.movesEl.textContent = this.moves;
  }

  render() {
    if (!this.boardEl) return;
    this.boardEl.innerHTML = '';
    this.tiles.forEach((val, idx) => {
      const tile = document.createElement('div');
      tile.classList.add('taquin-tile');
      if (val === 0) {
        tile.classList.add('empty');
      } else {
        tile.textContent = val;
        tile.addEventListener('click', () => this.handleTileClick(idx));
      }
      this.boardEl.appendChild(tile);
    });
  }
}

// --------------------------------------------------------------------------
// 3. GÉNÉRATEUR ET SOLVEUR DE SUDOKU PAR BACKTRACKING
// --------------------------------------------------------------------------
class SudokuGame {
  constructor(boardId, statusId) {
    this.boardEl = document.getElementById(boardId);
    this.statusEl = document.getElementById(statusId);

    this.initialGrid = Array(9).fill(0).map(() => Array(9).fill(0));
    this.grid = Array(9).fill(0).map(() => Array(9).fill(0));

    this.init();
  }

  init() {
    this.generateNewPuzzle();
  }

  generateNewPuzzle() {
    // Grille résolue complète
    const full = Array(9).fill(0).map(() => Array(9).fill(0));
    this.solveBacktracking(full);

    // Enlever environ 45 chiffres pour faire un puzzle
    this.grid = full.map(row => [...row]);
    let removed = 0;
    while (removed < 44) {
      const r = Math.floor(Math.random() * 9);
      const c = Math.floor(Math.random() * 9);
      if (this.grid[r][c] !== 0) {
        this.grid[r][c] = 0;
        removed++;
      }
    }

    this.initialGrid = this.grid.map(row => [...row]);
    this.render();
    if (this.statusEl) this.statusEl.textContent = "NOUVELLE GRILLE CHARGÉE. REMPLIS LES CASES OU LANCE LE SOLVEUR !";
  }

  solveBacktracking(grid) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
          const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
          for (const n of nums) {
            if (this.isValid(grid, r, c, n)) {
              grid[r][c] = n;
              if (this.solveBacktracking(grid)) return true;
              grid[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  isValid(grid, row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (grid[startRow + r][startCol + c] === num) return false;
      }
    }
    return true;
  }

  solveInstant() {
    const copy = this.initialGrid.map(row => [...row]);
    if (this.solveBacktracking(copy)) {
      this.grid = copy;
      window.soundEngine.playHolyMiracle();
      this.render();
      if (this.statusEl) this.statusEl.textContent = "[SYS] GRILLE RÉSOLUE INSTANTANÉMENT PAR L'ALGORITHME DE BACKTRACKING !";
    }
  }

  render() {
    if (!this.boardEl) return;
    this.boardEl.innerHTML = '';
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.classList.add('sudoku-cell');

        const val = this.grid[r][c];
        if (val !== 0) input.value = val;

        if (this.initialGrid[r][c] !== 0) {
          input.disabled = true;
          input.classList.add('fixed');
        } else {
          input.addEventListener('input', (e) => {
            const num = parseInt(e.target.value);
            if (num >= 1 && num <= 9) {
              this.grid[r][c] = num;
              window.soundEngine.playClick();
            } else {
              e.target.value = '';
              this.grid[r][c] = 0;
            }
          });
        }

        if ((c + 1) % 3 === 0 && c < 8) input.classList.add('border-right');
        if ((r + 1) % 3 === 0 && r < 8) input.classList.add('border-bottom');

        this.boardEl.appendChild(input);
      }
    }
  }
}

window.ConwayGame = ConwayGame;
window.TaquinPuzzle = TaquinPuzzle;
window.SudokuGame = SudokuGame;
