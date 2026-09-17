// ==========================================================================
// DÉMINEUR DE FEDS - DEMINEUR_CIA.HC (TEMPLEOS V2.0)
// Détectez les micros espions et agents CIA cachés dans la mémoire Ring-0
// ==========================================================================

class DemineurCIA {
  constructor(containerId, faceId, mineCountId, timerId, commentId) {
    this.containerEl = document.getElementById(containerId);
    this.faceEl = document.getElementById(faceId);
    this.mineCountEl = document.getElementById(mineCountId);
    this.timerEl = document.getElementById(timerId);
    this.commentEl = document.getElementById(commentId);

    this.rows = 9;
    this.cols = 9;
    this.totalMines = 10;
    this.grid = [];
    this.revealedCount = 0;
    this.flagsCount = 0;
    this.isGameOver = false;
    this.firstClick = true;
    this.timer = 0;
    this.timerInterval = null;
    this.difficulty = 'normal'; // 'facile', 'normal', 'difficile', 'troll'

    this.initEvents();
    this.reset();
  }

  initEvents() {
    if (this.faceEl) {
      this.faceEl.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.reset();
      });
    }
  }

  setDifficulty(level) {
    this.difficulty = level;
    const btns = document.querySelectorAll('#win-demineur .diff-btn');
    btns.forEach(b => {
      b.classList.toggle('active', b.dataset.diff === level);
    });

    switch (level) {
      case 'facile':
        this.rows = 8; this.cols = 8; this.totalMines = 8;
        break;
      case 'normal':
        this.rows = 9; this.cols = 9; this.totalMines = 12;
        break;
      case 'difficile':
        this.rows = 11; this.cols = 11; this.totalMines = 24;
        break;
      case 'troll':
        this.rows = 9; this.cols = 9; this.totalMines = 15;
        break;
    }

    if (this.commentEl) {
      const labels = {
        facile: "NIVEAU : BALAYAGE SIMPLE (8 MICROS CIA)",
        normal: "NIVEAU : SCANNER STANDARD (12 MICROS CIA)",
        difficile: "NIVEAU : NID D'ESPIONS DU FBI (24 MICROS CIA)",
        troll: "NIVEAU : RING-0 PARANOÏAQUE TROLL ⚡ (LES MICROS BOUCHENT !)"
      };
      this.commentEl.textContent = labels[level] || "";
    }

    this.reset();
  }

  reset() {
    this.isGameOver = false;
    this.firstClick = true;
    this.revealedCount = 0;
    this.flagsCount = 0;
    this.stopTimer();
    this.timer = 0;
    this.updateHud();

    if (this.faceEl) this.faceEl.textContent = "😇";

    // Initialiser matrice
    this.grid = [];
    for (let r = 0; r < this.rows; r++) {
      this.grid[r] = [];
      for (let c = 0; c < this.cols; c++) {
        this.grid[r][c] = {
          mine: false,
          revealed: false,
          flagged: false,
          count: 0
        };
      }
    }

    this.render();
  }

  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.timer = Math.min(999, this.timer + 1);
      if (this.timerEl) {
        this.timerEl.textContent = String(this.timer).padStart(3, '0');
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateHud() {
    if (this.mineCountEl) {
      const rem = Math.max(0, this.totalMines - this.flagsCount);
      this.mineCountEl.textContent = String(rem).padStart(3, '0');
    }
    if (this.timerEl) {
      this.timerEl.textContent = String(this.timer).padStart(3, '0');
    }
  }

  placeMines(safeR, safeC) {
    let placed = 0;
    while (placed < this.totalMines) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      // Case protégée au premier clic et ses alentours
      if ((Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) || this.grid[r][c].mine) {
        continue;
      }
      this.grid[r][c].mine = true;
      placed++;
    }

    // Calculer les nombres adjacents
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c].mine) continue;
        let cnt = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && this.grid[nr][nc].mine) {
              cnt++;
            }
          }
        }
        this.grid[r][c].count = cnt;
      }
    }
  }

  handleCellClick(r, c) {
    if (this.isGameOver) return;
    const cell = this.grid[r][c];
    if (cell.revealed || cell.flagged) return;

    if (this.firstClick) {
      this.firstClick = false;
      this.placeMines(r, c);
      this.startTimer();
    }

    if (cell.mine) {
      // Troll Ring-0 : 25% de chance que Dieu sauve le joueur
      if (this.difficulty === 'troll' && Math.random() < 0.25) {
        cell.mine = false;
        window.soundEngine.playHolyMiracle();
        if (this.commentEl) {
          this.commentEl.textContent = "⚡ MIRACLE ! DIEU A DÉSACTIVÉ CE MICRO ESPION AU DERNIER INSTANT !";
        }
        this.reveal(r, c);
        return;
      }

      // Explosion
      this.explode(r, c);
      return;
    }

    window.soundEngine.playClick();
    this.reveal(r, c);
    this.checkWin();
  }

  handleRightClick(e, r, c) {
    e.preventDefault();
    if (this.isGameOver) return;
    const cell = this.grid[r][c];
    if (cell.revealed) return;

    cell.flagged = !cell.flagged;
    this.flagsCount += (cell.flagged ? 1 : -1);
    window.soundEngine.beep(cell.flagged ? 800 : 500, 0.04);
    this.updateHud();
    this.renderCell(r, c);
  }

  reveal(r, c) {
    const cell = this.grid[r][c];
    if (cell.revealed || cell.flagged) return;

    cell.revealed = true;
    this.revealedCount++;
    this.renderCell(r, c);

    // Cascade si zéro mine autour
    if (cell.count === 0 && !cell.mine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
            this.reveal(nr, nc);
          }
        }
      }
    }
  }

  explode(hitR, hitC) {
    this.isGameOver = true;
    this.stopTimer();
    window.soundEngine.playExplosion();
    if (this.faceEl) this.faceEl.textContent = "💀";

    // Révéler toutes les mines
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c].mine) {
          this.grid[r][c].revealed = true;
        }
      }
    }
    this.render();

    if (this.commentEl) {
      this.commentEl.textContent = "💥 UN MICRO DE LA CIA A EXPLOSÉ ! TU AS ÉTÉ SURVEILLÉ !";
    }
  }

  checkWin() {
    const totalSafe = (this.rows * this.cols) - this.totalMines;
    if (this.revealedCount >= totalSafe) {
      this.isGameOver = true;
      this.stopTimer();
      window.soundEngine.playVictory();
      if (this.faceEl) this.faceEl.textContent = "😎";

      // Poser des drapeaux partout où il y avait des mines
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          if (this.grid[r][c].mine) {
            this.grid[r][c].flagged = true;
          }
        }
      }
      this.flagsCount = this.totalMines;
      this.updateHud();
      this.render();

      if (this.commentEl) {
        this.commentEl.textContent = "🏆 TOUS LES ESPIONS ONT ÉTÉ IDENTIFIÉS ET NEUTRALISÉS ! BÉNÉDICTION TOTALE !";
      }
    }
  }

  renderCell(r, c) {
    const el = this.containerEl.querySelector(`.mine-cell[data-r='${r}'][data-c='${c}']`);
    if (!el) return;
    const cell = this.grid[r][c];

    el.className = 'mine-cell';
    el.textContent = '';

    if (cell.flagged) {
      el.classList.add('flagged');
      el.textContent = '✝';
    } else if (cell.revealed) {
      el.classList.add('revealed');
      if (cell.mine) {
        el.classList.add('mine');
        el.textContent = '👁'; // Badge espion CIA
      } else if (cell.count > 0) {
        el.classList.add(`n${cell.count}`);
        el.textContent = cell.count;
      }
    }
  }

  render() {
    if (!this.containerEl) return;
    this.containerEl.innerHTML = '';
    this.containerEl.style.gridTemplateColumns = `repeat(${this.cols}, 26px)`;
    this.containerEl.style.gridTemplateRows = `repeat(${this.rows}, 26px)`;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cellEl = document.createElement('div');
        cellEl.classList.add('mine-cell');
        cellEl.dataset.r = r;
        cellEl.dataset.c = c;
        cellEl.addEventListener('click', () => this.handleCellClick(r, c));
        cellEl.addEventListener('contextmenu', (e) => this.handleRightClick(e, r, c));
        this.containerEl.appendChild(cellEl);
        this.renderCell(r, c);
      }
    }
  }
}

window.DemineurCIA = DemineurCIA;
