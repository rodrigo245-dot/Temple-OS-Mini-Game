// ==========================================================================
// PUISSANCE 4 DE L'ALLIANCE (CONNECT 4 TEMPLEOS V2.0)
// Difficultés : Facile, Normal, Difficile (IA Prédictive), Troll Divin ⚡
// ==========================================================================

class Puissance4 {
  constructor(boardId, statusId, commentId) {
    this.boardEl = document.getElementById(boardId);
    this.statusEl = document.getElementById(statusId);
    this.commentEl = document.getElementById(commentId);

    this.cols = 7;
    this.rows = 6;
    this.grid = [];
    this.currentPlayer = 1;
    this.isGameOver = false;
    this.isAiThinking = false;
    this.difficulty = 'normal'; // 'facile', 'normal', 'difficile', 'troll'

    this.init();
  }

  init() {
    if (!this.boardEl) return;
    this.boardEl.innerHTML = '';
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = document.createElement('div');
        cell.classList.add('p4-cell');
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.addEventListener('click', () => this.handleColumnClick(c));
        cell.addEventListener('mouseenter', () => this.highlightColumn(c, true));
        cell.addEventListener('mouseleave', () => this.highlightColumn(c, false));
        this.boardEl.appendChild(cell);
      }
    }
    this.reset();
  }

  setDifficulty(level) {
    this.difficulty = level;
    const btns = document.querySelectorAll('#win-p4 .diff-btn');
    btns.forEach(b => {
      b.classList.toggle('active', b.dataset.diff === level);
    });

    const labels = {
      facile: "NIVEAU : ESPION DÉBUTANT (FACILE) - CHUTES HASARDEUSES.",
      normal: "NIVEAU : AGENT FÉDÉRAL (NORMAL) - VIGILANCE STANDARD.",
      difficile: "NIVEAU : STRATÈGE PENTAGONE (DIFFICILE) - ANTICIPATION À 3 COUPS !",
      troll: "NIVEAU : GRAVITÉ DIVINE TROLL ⚡ - SÉISME AU RING-0 !"
    };
    if (this.commentEl) this.commentEl.textContent = labels[level] || "";
    this.reset();
  }

  reset() {
    this.grid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0));
    this.currentPlayer = 1;
    this.isGameOver = false;
    this.isAiThinking = false;
    this.render();
    if (this.statusEl) {
      this.statusEl.textContent = "TOUR : CROISÉ BÉNI (JAUNE)";
      this.statusEl.style.color = "var(--vga-yellow)";
    }
  }

  highlightColumn(col, isHover) {
    if (this.isGameOver || this.isAiThinking) return;
    const cells = this.boardEl.querySelectorAll(`.p4-cell[data-col='${col}']`);
    cells.forEach(c => {
      c.classList.toggle('hover-col', isHover);
    });
  }

  handleColumnClick(col) {
    if (this.isGameOver || this.isAiThinking) return;

    const row = this.getAvailableRow(col);
    if (row === -1) {
      window.soundEngine.beep(150, 0.08, 'sawtooth');
      return;
    }

    this.dropPiece(col, row, this.currentPlayer);
  }

  getAvailableRow(col) {
    for (let r = this.rows - 1; r >= 0; r--) {
      if (this.grid[r][col] === 0) return r;
    }
    return -1;
  }

  dropPiece(col, row, player) {
    this.grid[row][col] = player;
    window.soundEngine.playTokenDrop();
    this.render();

    if (this.commentEl) {
      this.commentEl.textContent = window.godOracle.getComment('p4_drop');
    }

    if (this.checkWin(player)) {
      this.endGame(player);
      return;
    }

    if (this.checkDraw()) {
      this.endGame(0);
      return;
    }

    // Troll Ring-0 : Miracle de gravité
    if (this.difficulty === 'troll' && Math.random() < 0.15) {
      setTimeout(() => this.triggerTrollQuake(), 300);
    }

    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;

    if (this.currentPlayer === 2) {
      this.isAiThinking = true;
      if (this.statusEl) {
        this.statusEl.textContent = "TOUR : CALCULS DE L'ESPION CIA (ROUGE)...";
        this.statusEl.style.color = "var(--vga-light-red)";
      }
      setTimeout(() => this.aiTurn(), 450);
    } else {
      if (this.statusEl) {
        this.statusEl.textContent = "TOUR : CROISÉ BÉNI (JAUNE)";
        this.statusEl.style.color = "var(--vga-yellow)";
      }
    }
  }

  triggerTrollQuake() {
    window.soundEngine.playHolyMiracle();
    // Inversion d'un jeton aléatoire
    const r = Math.floor(Math.random() * this.rows);
    const c = Math.floor(Math.random() * this.cols);
    if (this.grid[r][c] !== 0) {
      this.grid[r][c] = this.grid[r][c] === 1 ? 2 : 1;
      this.render();
      if (this.commentEl) {
        this.commentEl.textContent = "⚡ SÉISME DIVIN ! UN JETON A ÉTÉ CONVERTI PAR L'ÉTERNEL !";
      }
    }
  }

  aiTurn() {
    if (this.isGameOver) return;

    let targetCol = -1;

    if (this.difficulty === 'facile') {
      // Aléatoire
      const validCols = [];
      for (let c = 0; c < this.cols; c++) {
        if (this.getAvailableRow(c) !== -1) validCols.push(c);
      }
      targetCol = validCols[Math.floor(Math.random() * validCols.length)];
    } else if (this.difficulty === 'normal') {
      targetCol = this.findImmediateCol();
    } else {
      // Difficile ou Troll : Mini lookahead 2-3 coups
      targetCol = this.findSmartCol();
    }

    if (targetCol === -1) {
      const validCols = [];
      for (let c = 0; c < this.cols; c++) {
        if (this.getAvailableRow(c) !== -1) validCols.push(c);
      }
      targetCol = validCols[Math.floor(Math.random() * validCols.length)];
    }

    const row = this.getAvailableRow(targetCol);
    this.isAiThinking = false;
    this.dropPiece(targetCol, row, 2);
  }

  findImmediateCol() {
    // Gagner immédiatement
    for (let c = 0; c < this.cols; c++) {
      const r = this.getAvailableRow(c);
      if (r !== -1) {
        this.grid[r][c] = 2;
        if (this.checkWin(2)) { this.grid[r][c] = 0; return c; }
        this.grid[r][c] = 0;
      }
    }
    // Bloquer joueur
    for (let c = 0; c < this.cols; c++) {
      const r = this.getAvailableRow(c);
      if (r !== -1) {
        this.grid[r][c] = 1;
        if (this.checkWin(1)) { this.grid[r][c] = 0; return c; }
        this.grid[r][c] = 0;
      }
    }
    if (this.getAvailableRow(3) !== -1) return 3;
    return -1;
  }

  findSmartCol() {
    // Vérifier victoires ou blocages
    const imm = this.findImmediateCol();
    if (imm !== -1) return imm;

    // Préférer colonne centrale (3) puis (2, 4)
    const preferences = [3, 2, 4, 1, 5, 0, 6];
    for (const c of preferences) {
      const r = this.getAvailableRow(c);
      if (r !== -1) {
        // Ne pas donner une opportunité de victoire au joueur juste au dessus
        if (r > 0) {
          this.grid[r - 1][c] = 1;
          const wouldGiveWin = this.checkWin(1);
          this.grid[r - 1][c] = 0;
          if (wouldGiveWin) continue;
        }
        return c;
      }
    }
    return -1;
  }

  checkWin(player) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols - 3; c++) {
        if (this.grid[r][c] === player && this.grid[r][c + 1] === player &&
            this.grid[r][c + 2] === player && this.grid[r][c + 3] === player) return true;
      }
    }
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows - 3; r++) {
        if (this.grid[r][c] === player && this.grid[r + 1][c] === player &&
            this.grid[r + 2][c] === player && this.grid[r + 3][c] === player) return true;
      }
    }
    for (let r = 0; r < this.rows - 3; r++) {
      for (let c = 0; c < this.cols - 3; c++) {
        if (this.grid[r][c] === player && this.grid[r + 1][c + 1] === player &&
            this.grid[r + 2][c + 2] === player && this.grid[r + 3][c + 3] === player) return true;
      }
    }
    for (let r = 3; r < this.rows; r++) {
      for (let c = 0; c < this.cols - 3; c++) {
        if (this.grid[r][c] === player && this.grid[r - 1][c + 1] === player &&
            this.grid[r - 2][c + 2] === player && this.grid[r - 3][c + 3] === player) return true;
      }
    }
    return false;
  }

  checkDraw() {
    return this.grid[0].every(cell => cell !== 0);
  }

  endGame(winner) {
    this.isGameOver = true;
    if (winner === 1) {
      window.soundEngine.playVictory();
      if (this.statusEl) {
        this.statusEl.textContent = "🏆 VICTOIRE SAINTE ! LES 4 JETONS BRILLENT !";
        this.statusEl.style.color = "var(--vga-light-green)";
      }
      if (this.commentEl) this.commentEl.textContent = window.godOracle.getComment('p4_win');
    } else if (winner === 2) {
      window.soundEngine.playDefeat();
      if (this.statusEl) {
        this.statusEl.textContent = "💀 LES AGENTS DE LA CIA ONT ALIGNÉ 4 PIONS !";
        this.statusEl.style.color = "var(--vga-light-red)";
      }
    } else {
      if (this.statusEl) {
        this.statusEl.textContent = "ÉGALITÉ COSMIQUE !";
        this.statusEl.style.color = "var(--vga-light-cyan)";
      }
    }
  }

  render() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.boardEl.querySelector(`.p4-cell[data-row='${r}'][data-col='${c}']`);
        if (!cell) continue;
        const val = this.grid[r][c];
        cell.className = 'p4-cell';
        cell.textContent = '';
        if (val === 1) {
          cell.classList.add('p1-token');
          cell.textContent = '✝';
        } else if (val === 2) {
          cell.classList.add('p2-token');
          cell.textContent = '👁';
        }
      }
    }
  }
}

window.Puissance4 = Puissance4;
