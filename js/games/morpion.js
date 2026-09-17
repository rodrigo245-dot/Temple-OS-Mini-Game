// ==========================================================================
// MORPION CÉLESTE (TIC-TAC-TOE TEMPLEOS V2.0)
// Difficultés : Facile, Normal, Difficile (Minimax Imbattable), Troll Divin ⚡
// ==========================================================================

class MorpionJeu {
  constructor(boardId, statusId, commentId) {
    this.boardEl = document.getElementById(boardId);
    this.statusEl = document.getElementById(statusId);
    this.commentEl = document.getElementById(commentId);

    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.isGameOver = false;
    this.difficulty = 'normal'; // 'facile', 'normal', 'difficile', 'troll'

    this.winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    this.init();
  }

  init() {
    if (!this.boardEl) return;
    this.boardEl.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.classList.add('morpion-cell');
      cell.dataset.index = i;
      cell.addEventListener('click', () => this.handleCellClick(i));
      this.boardEl.appendChild(cell);
    }
    this.reset();
  }

  setDifficulty(level) {
    this.difficulty = level;
    const btns = document.querySelectorAll('#win-morpion .diff-btn');
    btns.forEach(b => {
      b.classList.toggle('active', b.dataset.diff === level);
    });

    const labels = {
      facile: "NIVEAU : INFILTRÉ DISTRAIT (FACILE) - IL JOUE AU HASARD.",
      normal: "NIVEAU : AGENT FÉDÉRAL (NORMAL) - STRATÉGIE STANDARD.",
      difficile: "NIVEAU : MINIMAX DIVIN (DIFFICILES) - MATHÉMATIQUEMENT IMBATTABLE !",
      troll: "NIVEAU : VOLONTÉ DIVINE TROLL ⚡ - MIRACLES ET ÉCLAIRS DU RING-0 !"
    };
    if (this.commentEl) this.commentEl.textContent = labels[level] || "";
    this.reset();
  }

  reset() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.isGameOver = false;
    this.render();
    if (this.statusEl) {
      this.statusEl.textContent = "TOUR : CROIX SACRÉE (X)";
      this.statusEl.style.color = "var(--vga-yellow)";
    }
  }

  handleCellClick(index) {
    if (this.isGameOver || this.board[index] !== null) return;

    this.makeMove(index, this.currentPlayer);

    if (this.checkWin(this.currentPlayer)) {
      this.endGame(this.currentPlayer);
      return;
    }

    if (this.checkDraw()) {
      this.endGame('draw');
      return;
    }

    this.currentPlayer = 'O';
    if (this.statusEl) this.statusEl.textContent = "TOUR : CALCULS DE L'ORACLE (O)...";
    setTimeout(() => this.aiTurn(), 350);
  }

  makeMove(index, player) {
    this.board[index] = player;
    window.soundEngine.playMorpionMove(player === 'X');
    this.render();

    // Mode Troll Divin : Miracle aléatoire
    if (this.difficulty === 'troll' && Math.random() < 0.28 && !this.checkWin(player)) {
      this.triggerDivineIntervention();
    }
  }

  triggerDivineIntervention() {
    const occupied = this.board.map((v, i) => v !== null ? i : null).filter(v => v !== null);
    if (occupied.length >= 2) {
      const targetIdx = occupied[Math.floor(Math.random() * occupied.length)];
      const oldVal = this.board[targetIdx];
      this.board[targetIdx] = oldVal === 'X' ? 'O' : 'X';

      window.soundEngine.playHolyMiracle();
      this.render();

      if (this.commentEl) {
        this.commentEl.textContent = window.godOracle.getComment('morpion_god_intervention');
      }
    }
  }

  aiTurn() {
    if (this.isGameOver) return;

    let move = -1;

    if (this.difficulty === 'facile') {
      const empty = this.board.map((v, i) => v === null ? i : null).filter(v => v !== null);
      move = empty[Math.floor(Math.random() * empty.length)];
    } else if (this.difficulty === 'normal') {
      move = this.findHeuristicMove();
    } else {
      // Difficile ou Troll : Minimax optimal
      move = this.findBestMinimaxMove();
    }

    if (move === -1) {
      const empty = this.board.map((v, i) => v === null ? i : null).filter(v => v !== null);
      move = empty[Math.floor(Math.random() * empty.length)];
    }

    this.makeMove(move, 'O');

    if (this.checkWin('O')) {
      this.endGame('O');
      return;
    }

    if (this.checkDraw()) {
      this.endGame('draw');
      return;
    }

    this.currentPlayer = 'X';
    if (this.statusEl) this.statusEl.textContent = "TOUR : CROIX SACRÉE (X)";
  }

  findHeuristicMove() {
    // 1. Victoire immédiate
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === null) {
        this.board[i] = 'O';
        if (this.checkWin('O')) {
          this.board[i] = null;
          return i;
        }
        this.board[i] = null;
      }
    }
    // 2. Blocage immédiat
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === null) {
        this.board[i] = 'X';
        if (this.checkWin('X')) {
          this.board[i] = null;
          return i;
        }
        this.board[i] = null;
      }
    }
    // 3. Centre
    if (this.board[4] === null) return 4;
    return -1;
  }

  findBestMinimaxMove() {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
      if (this.board[i] === null) {
        this.board[i] = 'O';
        let score = this.minimax(this.board, 0, false);
        this.board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  }

  minimax(board, depth, isMaximizing) {
    if (this.checkWin('O')) return 10 - depth;
    if (this.checkWin('X')) return depth - 10;
    if (this.checkDraw()) return 0;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'O';
          let evaluation = this.minimax(board, depth + 1, false);
          board[i] = null;
          maxEval = Math.max(maxEval, evaluation);
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'X';
          let evaluation = this.minimax(board, depth + 1, true);
          board[i] = null;
          minEval = Math.min(minEval, evaluation);
        }
      }
      return minEval;
    }
  }

  checkWin(player) {
    return this.winningCombos.some(combo => combo.every(idx => this.board[idx] === player));
  }

  checkDraw() {
    return this.board.every(cell => cell !== null);
  }

  endGame(winner) {
    this.isGameOver = true;
    if (winner === 'X') {
      window.soundEngine.playVictory();
      if (this.statusEl) {
        this.statusEl.textContent = "VICTOIRE DE LA CROIX SACRÉE !";
        this.statusEl.style.color = "var(--vga-light-green)";
      }
      if (this.commentEl) this.commentEl.textContent = window.godOracle.getComment('morpion_win');
    } else if (winner === 'O') {
      window.soundEngine.playDefeat();
      if (this.statusEl) {
        this.statusEl.textContent = "VICTOIRE DE L'ORDINATEUR BÉNI !";
        this.statusEl.style.color = "var(--vga-light-red)";
      }
      if (this.commentEl) this.commentEl.textContent = window.godOracle.getComment('morpion_loss');
    } else {
      window.soundEngine.playPaddleHit();
      if (this.statusEl) {
        this.statusEl.textContent = "ÉGALITÉ SOLENNELLE !";
        this.statusEl.style.color = "var(--vga-light-cyan)";
      }
      if (this.commentEl) this.commentEl.textContent = window.godOracle.getComment('morpion_draw');
    }
  }

  render() {
    const cells = this.boardEl.querySelectorAll('.morpion-cell');
    cells.forEach((cell, idx) => {
      const val = this.board[idx];
      cell.textContent = val || '';
      cell.className = 'morpion-cell';
      if (val === 'X') cell.classList.add('x-cell');
      if (val === 'O') cell.classList.add('o-cell');
    });
  }
}

window.MorpionJeu = MorpionJeu;
