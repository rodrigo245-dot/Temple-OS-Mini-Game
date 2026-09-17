// ==========================================================================
// BATAILLE NAVALE DE L'ARCHE (BATTLESHIP TEMPLEOS V2.0)
// Difficultés : Facile, Normal, Difficile (Radar Parité), Troll Divin ⚡
// ==========================================================================

class BattleshipJeu {
  constructor(playerGridId, enemyGridId, statusId, commentId) {
    this.playerGridEl = document.getElementById(playerGridId);
    this.enemyGridEl = document.getElementById(enemyGridId);
    this.statusEl = document.getElementById(statusId);
    this.commentEl = document.getElementById(commentId);

    this.size = 10;
    this.shipsConfig = [
      { name: "L'Arche de Noé", size: 5, icon: "⛵" },
      { name: "Frégate de Jéricho", size: 4, icon: "🚢" },
      { name: "Croiseur Sacré", size: 3, icon: "🛥" },
      { name: "Sous-Marin du Vatican", size: 3, icon: "🐟" },
      { name: "Barque Apostolique", size: 2, icon: "🛶" }
    ];

    this.playerGrid = [];
    this.enemyGrid = [];
    this.playerShips = [];
    this.enemyShips = [];

    this.difficulty = 'normal'; // 'facile', 'normal', 'difficile', 'troll'
    this.isGameOver = false;
    this.isCpuTurn = false;
    this.cpuHuntQueue = [];

    this.init();
  }

  init() {
    this.createGridsUI();
    this.reset();
  }

  setDifficulty(level) {
    this.difficulty = level;
    const btns = document.querySelectorAll('#win-battleship .diff-btn');
    btns.forEach(b => {
      b.classList.toggle('active', b.dataset.diff === level);
    });

    const labels = {
      facile: "NIVEAU : RECRUE CIA (FACILE) - TIRS AVEUGLES.",
      normal: "NIVEAU : COMMANDEUR FÉDÉRAL (NORMAL) - CHASSE STANDARD.",
      difficile: "NIVEAU : RADAR PARITÉ DU PENTAGONE (DIFFICILE) - BALAYAGE STRATÉGIQUE !",
      troll: "NIVEAU : SONAR DE DIEU TROLL ⚡ - RÉVÉLATIONS MYSTIQUES SUR LE RADAR !"
    };
    if (this.commentEl) this.commentEl.textContent = labels[level] || "";
    this.reset();
  }

  createGridsUI() {
    if (!this.playerGridEl || !this.enemyGridEl) return;
    this.playerGridEl.innerHTML = '';
    this.enemyGridEl.innerHTML = '';

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const pCell = document.createElement('div');
        pCell.classList.add('bs-cell');
        pCell.dataset.row = r;
        pCell.dataset.col = c;
        this.playerGridEl.appendChild(pCell);

        const eCell = document.createElement('div');
        eCell.classList.add('bs-cell');
        eCell.dataset.row = r;
        eCell.dataset.col = c;
        eCell.addEventListener('click', () => this.handlePlayerAttack(r, c));
        this.enemyGridEl.appendChild(eCell);
      }
    }
  }

  reset() {
    this.isGameOver = false;
    this.isCpuTurn = false;
    this.cpuHuntQueue = [];

    this.playerGrid = Array(this.size).fill(0).map(() => Array(this.size).fill(0));
    this.enemyGrid = Array(this.size).fill(0).map(() => Array(this.size).fill(0));

    this.playerShips = this.placeFleetRandomly(this.playerGrid);
    this.enemyShips = this.placeFleetRandomly(this.enemyGrid);

    this.render();

    if (this.statusEl) {
      this.statusEl.textContent = "RADAR PRÊT ! CLIQUE SUR LE RADAR ENNEMI POUR TIRER.";
      this.statusEl.style.color = "var(--vga-light-green)";
    }
  }

  placeFleetRandomly(grid) {
    const placedShips = [];
    for (const ship of this.shipsConfig) {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 250) {
        attempts++;
        const isHorizontal = Math.random() > 0.5;
        const r = Math.floor(Math.random() * (isHorizontal ? this.size : this.size - ship.size + 1));
        const c = Math.floor(Math.random() * (isHorizontal ? this.size - ship.size + 1 : this.size));

        let canPlace = true;
        for (let i = 0; i < ship.size; i++) {
          const currR = isHorizontal ? r : r + i;
          const currC = isHorizontal ? c + i : c;
          if (grid[currR][currC] !== 0) { canPlace = false; break; }
        }

        if (canPlace) {
          const coords = [];
          for (let i = 0; i < ship.size; i++) {
            const currR = isHorizontal ? r : r + i;
            const currC = isHorizontal ? c + i : c;
            grid[currR][currC] = 1;
            coords.push({ r: currR, c: currC });
          }
          placedShips.push({ name: ship.name, size: ship.size, coords, hits: 0, sunk: false });
          placed = true;
        }
      }
    }
    return placedShips;
  }

  handlePlayerAttack(r, c) {
    if (this.isGameOver || this.isCpuTurn) return;

    if (this.enemyGrid[r][c] === 2 || this.enemyGrid[r][c] === 3) {
      window.soundEngine.beep(160, 0.05, 'triangle');
      return;
    }

    if (this.enemyGrid[r][c] === 1) {
      this.enemyGrid[r][c] = 3;
      window.soundEngine.playExplosion();

      const hitShip = this.enemyShips.find(s => s.coords.some(pt => pt.r === r && pt.c === c));
      if (hitShip) {
        hitShip.hits++;
        if (hitShip.hits >= hitShip.size) {
          hitShip.sunk = true;
          if (this.commentEl) {
            this.commentEl.textContent = `⚓ BÂTIMENT ADVERSE COULÉ : ${hitShip.name.toUpperCase()} !`;
          }
        } else {
          if (this.commentEl) this.commentEl.textContent = window.godOracle.getComment('battleship_hit');
        }
      }
    } else {
      this.enemyGrid[r][c] = 2;
      window.soundEngine.playSplash();
      if (this.commentEl) this.commentEl.textContent = window.godOracle.getComment('battleship_miss');
    }

    this.render();

    if (this.enemyShips.every(s => s.sunk)) {
      this.endGame(true);
      return;
    }

    // Troll Ring-0 : Révélation divine impromptue
    if (this.difficulty === 'troll' && Math.random() < 0.20) {
      this.revealEnemySecret();
    }

    this.isCpuTurn = true;
    if (this.statusEl) {
      this.statusEl.textContent = "RIPOSTE DE L'ENNEMI EN COURS...";
      this.statusEl.style.color = "var(--vga-light-red)";
    }
    setTimeout(() => this.cpuTurn(), 600);
  }

  revealEnemySecret() {
    // Trouve une case ennemie non touchée contenant un bateau
    const candidates = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.enemyGrid[r][c] === 1) candidates.push({ r, c });
      }
    }
    if (candidates.length > 0) {
      const lucky = candidates[Math.floor(Math.random() * candidates.length)];
      window.soundEngine.playHolyMiracle();
      if (this.commentEl) {
        const letters = "ABCDEFGHIJ";
        this.commentEl.textContent = `⚡ SONAR DE DIEU : UN NAVIRE EST DÉTECTÉ EN CASE ${letters[lucky.c]}${lucky.r + 1} !`;
      }
    }
  }

  cpuTurn() {
    if (this.isGameOver) return;

    let targetR, targetC;

    if (this.difficulty === 'facile') {
      // 100% aléatoire sans chasse
      const valid = [];
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          if (this.playerGrid[r][c] === 0 || this.playerGrid[r][c] === 1) valid.push({ r, c });
        }
      }
      const choice = valid[Math.floor(Math.random() * valid.length)];
      targetR = choice.r; targetC = choice.c;
    } else if (this.cpuHuntQueue.length > 0) {
      // Chasse
      const nextTarget = this.cpuHuntQueue.shift();
      targetR = nextTarget.r; targetC = nextTarget.c;
    } else if (this.difficulty === 'difficile') {
      // Balayage en damier de parité
      const parityCells = [];
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          if ((r + c) % 2 === 0 && (this.playerGrid[r][c] === 0 || this.playerGrid[r][c] === 1)) {
            parityCells.push({ r, c });
          }
        }
      }
      if (parityCells.length > 0) {
        const choice = parityCells[Math.floor(Math.random() * parityCells.length)];
        targetR = choice.r; targetC = choice.c;
      } else {
        const valid = [];
        for (let r = 0; r < this.size; r++) {
          for (let c = 0; c < this.size; c++) {
            if (this.playerGrid[r][c] === 0 || this.playerGrid[r][c] === 1) valid.push({ r, c });
          }
        }
        const choice = valid[Math.floor(Math.random() * valid.length)];
        targetR = choice.r; targetC = choice.c;
      }
    } else {
      // Normal
      const valid = [];
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          if (this.playerGrid[r][c] === 0 || this.playerGrid[r][c] === 1) valid.push({ r, c });
        }
      }
      const choice = valid[Math.floor(Math.random() * valid.length)];
      targetR = choice.r; targetC = choice.c;
    }

    // Traiter tir CPU
    if (this.playerGrid[targetR][targetC] === 1) {
      this.playerGrid[targetR][targetC] = 3;
      window.soundEngine.playExplosion();

      if (this.difficulty !== 'facile') {
        const adjacents = [
          { r: targetR - 1, c: targetC },
          { r: targetR + 1, c: targetC },
          { r: targetR, c: targetC - 1 },
          { r: targetR, c: targetC + 1 }
        ];
        for (const adj of adjacents) {
          if (adj.r >= 0 && adj.r < this.size && adj.c >= 0 && adj.c < this.size &&
              (this.playerGrid[adj.r][adj.c] === 0 || this.playerGrid[adj.r][adj.c] === 1)) {
            if (!this.cpuHuntQueue.some(q => q.r === adj.r && q.c === adj.c)) {
              this.cpuHuntQueue.push(adj);
            }
          }
        }
      }

      const hitShip = this.playerShips.find(s => s.coords.some(pt => pt.r === targetR && pt.c === targetC));
      if (hitShip) {
        hitShip.hits++;
        if (hitShip.hits >= hitShip.size) {
          hitShip.sunk = true;
          if (this.commentEl) {
            this.commentEl.textContent = `💀 ALERTE : TON ${hitShip.name.toUpperCase()} A ÉTÉ COULÉ PAR LA CIA !`;
          }
        }
      }
    } else {
      this.playerGrid[targetR][targetC] = 2;
      window.soundEngine.playSplash();
    }

    this.render();

    if (this.playerShips.every(s => s.sunk)) {
      this.endGame(false);
      return;
    }

    this.isCpuTurn = false;
    if (this.statusEl) {
      this.statusEl.textContent = "À TOI DE VISER SUR LE RADAR ENNEMI !";
      this.statusEl.style.color = "var(--vga-light-green)";
    }
  }

  endGame(isPlayerWinner) {
    this.isGameOver = true;
    if (isPlayerWinner) {
      window.soundEngine.playVictory();
      if (this.statusEl) {
        this.statusEl.textContent = "🏆 VICTOIRE TOTALE ! LES SOUS-MARINS SONT TOUS NEUTRALISÉS !";
        this.statusEl.style.color = "var(--vga-light-green)";
      }
      if (this.commentEl) this.commentEl.textContent = window.godOracle.getComment('battleship_win');
    } else {
      window.soundEngine.playDefeat();
      if (this.statusEl) {
        this.statusEl.textContent = "💀 DÉFAITE ! L'ARCHE ET TA FLOTTE ONT ÉTÉ ENGLOUTIES !";
        this.statusEl.style.color = "var(--vga-light-red)";
      }
    }
  }

  render() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const pCell = this.playerGridEl.querySelector(`.bs-cell[data-row='${r}'][data-col='${c}']`);
        if (pCell) {
          const val = this.playerGrid[r][c];
          pCell.className = 'bs-cell';
          pCell.textContent = '';
          if (val === 1) { pCell.classList.add('ship'); pCell.textContent = '■'; }
          else if (val === 2) { pCell.classList.add('miss'); pCell.textContent = '·'; }
          else if (val === 3) { pCell.classList.add('hit'); pCell.textContent = 'X'; }
        }

        const eCell = this.enemyGridEl.querySelector(`.bs-cell[data-row='${r}'][data-col='${c}']`);
        if (eCell) {
          const val = this.enemyGrid[r][c];
          eCell.className = 'bs-cell';
          eCell.textContent = '';
          if (val === 2) { eCell.classList.add('miss'); eCell.textContent = '·'; }
          else if (val === 3) { eCell.classList.add('hit'); eCell.textContent = 'X'; }
        }
      }
    }
  }
}

window.BattleshipJeu = BattleshipJeu;
