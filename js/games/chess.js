// ==========================================================================
// MINI-ÉCHECS DE DIEU - ECHECS_DIVINS.HC
// Jeu d'échecs tactique avec déplacements légaux et IA adverse
// ==========================================================================

class ChessGame {
  constructor(boardId, statusId) {
    this.boardEl = document.getElementById(boardId);
    this.statusEl = document.getElementById(statusId);

    this.board = [];
    this.selected = null; // {r, c}
    this.turn = 'white';
    this.isOver = false;

    this.symbols = {
      'wP': '♙', 'wR': '♖', 'wN': '♘', 'wB': '♗', 'wQ': '♕', 'wK': '♔',
      'bP': '♟', 'bR': '♜', 'bN': '♞', 'bB': '♝', 'bQ': '♛', 'bK': '♚'
    };

    this.reset();
  }

  reset() {
    this.isOver = false;
    this.turn = 'white';
    this.selected = null;

    // Échiquier de départ standard
    this.board = [
      ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
      ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
      ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
    ];

    if (this.statusEl) this.statusEl.textContent = "TOUR : LES BLANCS (FIDÈLE DE DIEU)";
    this.render();
  }

  handleClick(r, c) {
    if (this.isOver || this.turn !== 'white') return;

    if (this.selected) {
      if (this.selected.r === r && this.selected.c === c) {
        this.selected = null;
        this.render();
        return;
      }
      if (this.isValidMove(this.selected.r, this.selected.c, r, c)) {
        this.makeMove(this.selected.r, this.selected.c, r, c);
        this.selected = null;
        this.render();

        if (!this.isOver) {
          this.turn = 'black';
          if (this.statusEl) this.statusEl.textContent = "TOUR : CALCULS DE L'IA DU VATICAN (NOIRS)...";
          setTimeout(() => this.aiTurn(), 400);
        }
        return;
      }
    }

    const piece = this.board[r][c];
    if (piece && piece.startsWith('w')) {
      this.selected = { r, c };
      window.soundEngine.playClick();
      this.render();
    }
  }

  makeMove(fr, fc, tr, tc) {
    const target = this.board[tr][tc];
    this.board[tr][tc] = this.board[fr][fc];
    this.board[fr][fc] = null;

    if (target === 'bK') {
      this.isOver = true;
      window.soundEngine.playVictory();
      if (this.statusEl) this.statusEl.textContent = "🏆 LE ROI NOIR EST CAPTURÉ ! VICTOIRE SAINTE !";
      return;
    }
    if (target === 'wK') {
      this.isOver = true;
      window.soundEngine.playDefeat();
      if (this.statusEl) this.statusEl.textContent = "💀 TON ROI A ÉTÉ CAPTURÉ ! ÉCHEC ET MAT !";
      return;
    }

    window.soundEngine.playPaddleHit();
  }

  isValidMove(fr, fc, tr, tc) {
    const piece = this.board[fr][fc];
    if (!piece) return false;
    const target = this.board[tr][tc];
    if (target && target[0] === piece[0]) return false; // Ne mange pas ses propres pièces

    const dr = tr - fr;
    const dc = tc - fc;
    const type = piece[1];

    if (type === 'P') {
      const dir = piece[0] === 'w' ? -1 : 1;
      if (dc === 0 && dr === dir && !target) return true;
      if (Math.abs(dc) === 1 && dr === dir && target) return true;
      return false;
    }

    if (type === 'R') {
      return (dr === 0 || dc === 0) && this.isPathClear(fr, fc, tr, tc);
    }
    if (type === 'B') {
      return Math.abs(dr) === Math.abs(dc) && this.isPathClear(fr, fc, tr, tc);
    }
    if (type === 'Q') {
      return ((dr === 0 || dc === 0) || Math.abs(dr) === Math.abs(dc)) && this.isPathClear(fr, fc, tr, tc);
    }
    if (type === 'K') {
      return Math.abs(dr) <= 1 && Math.abs(dc) <= 1;
    }
    if (type === 'N') {
      return (Math.abs(dr) === 2 && Math.abs(dc) === 1) || (Math.abs(dr) === 1 && Math.abs(dc) === 2);
    }

    return false;
  }

  isPathClear(fr, fc, tr, tc) {
    const stepR = Math.sign(tr - fr);
    const stepC = Math.sign(tc - fc);
    let r = fr + stepR;
    let c = fc + stepC;
    while (r !== tr || c !== tc) {
      if (this.board[r][c] !== null) return false;
      r += stepR;
      c += stepC;
    }
    return true;
  }

  aiTurn() {
    if (this.isOver) return;
    const validMoves = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.board[r][c] && this.board[r][c].startsWith('b')) {
          for (let tr = 0; tr < 8; tr++) {
            for (let tc = 0; tc < 8; tc++) {
              if (this.isValidMove(r, c, tr, tc)) {
                const target = this.board[tr][tc];
                const score = target ? 10 : 1; // Priorité aux captures
                validMoves.push({ fr: r, fc: c, tr, tc, score });
              }
            }
          }
        }
      }
    }

    if (validMoves.length > 0) {
      validMoves.sort((a, b) => b.score - a.score);
      const chosen = validMoves[0];
      this.makeMove(chosen.fr, chosen.fc, chosen.tr, chosen.tc);
    }

    this.turn = 'white';
    if (!this.isOver && this.statusEl) {
      this.statusEl.textContent = "TOUR : LES BLANCS (FIDÈLE DE DIEU)";
    }
    this.render();
  }

  render() {
    if (!this.boardEl) return;
    this.boardEl.innerHTML = '';

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = document.createElement('div');
        const isWhite = (r + c) % 2 === 0;
        cell.classList.add('chess-cell', isWhite ? 'white' : 'black');

        if (this.selected && this.selected.r === r && this.selected.c === c) {
          cell.classList.add('selected');
        }

        const piece = this.board[r][c];
        if (piece) cell.textContent = this.symbols[piece];

        cell.addEventListener('click', () => this.handleClick(r, c));
        this.boardEl.appendChild(cell);
      }
    }
  }
}

window.ChessGame = ChessGame;
