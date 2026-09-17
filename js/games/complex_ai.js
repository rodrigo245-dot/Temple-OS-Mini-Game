// ==========================================================================
// CATÉGORIE 5 : IA, GÉNÉRATION PROCÉDURALE & ALGORITHMES COMPLEXES
// 1. Générateur de Labyrinthes (DFS Backtracking)
// 2. Dungeon Crawler Textuel (Rogue-like)
// 3. Cadavre Exquis Procédural
// 4. Machine Learning Tic-Tac-Toe (Q-Learning)
// 5. Problème des 8 Dames (Solveur Backtracking 92 solutions)
// ==========================================================================

// --------------------------------------------------------------------------
// 1. GÉNÉRATEUR DE LABYRINTHES (DFS BACKTRACKING)
// --------------------------------------------------------------------------
class LabyrinthGame {
  constructor(canvasId, statusId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.statusEl = document.getElementById(statusId);

    this.cols = 21; // Impairs pour les murs
    this.rows = 21;
    this.cellSize = 14;
    this.canvas.width = this.cols * this.cellSize;
    this.canvas.height = this.rows * this.cellSize;

    this.grid = [];
    this.player = { x: 1, y: 1 };
    this.exit = { x: 19, y: 19 };

    this.initEvents();
    this.generate();
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyS','KeyA','KeyD'].includes(e.code)) {
        let dx = 0, dy = 0;
        if (e.code === 'ArrowUp' || e.code === 'KeyW') dy = -1;
        if (e.code === 'ArrowDown' || e.code === 'KeyS') dy = 1;
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') dx = -1;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') dx = 1;

        const nx = this.player.x + dx;
        const ny = this.player.y + dy;
        if (this.grid[ny] && this.grid[ny][nx] === 0) {
          this.player.x = nx;
          this.player.y = ny;
          window.soundEngine.playClick();
          if (this.player.x === this.exit.x && this.player.y === this.exit.y) {
            window.soundEngine.playVictory();
            if (this.statusEl) this.statusEl.textContent = "🏆 SORTIE DU LABYRINTHE ATTEINTE ! BÉNÉDICTION !";
          }
          this.draw();
        }
      }
    });
  }

  generate() {
    // Initialiser plein de murs (1 = mur, 0 = passage)
    this.grid = Array(this.rows).fill(0).map(() => Array(this.cols).fill(1));

    // DFS avec pile
    const stack = [];
    this.grid[1][1] = 0;
    stack.push([1, 1]);

    while (stack.length > 0) {
      const [r, c] = stack[stack.length - 1];
      const neighbors = [];

      const dirs = [[-2, 0], [2, 0], [0, -2], [0, 2]];
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr > 0 && nr < this.rows - 1 && nc > 0 && nc < this.cols - 1 && this.grid[nr][nc] === 1) {
          neighbors.push([nr, nc, dr / 2, dc / 2]);
        }
      }

      if (neighbors.length > 0) {
        const [nr, nc, mr, mc] = neighbors[Math.floor(Math.random() * neighbors.length)];
        this.grid[r + mr][c + mc] = 0;
        this.grid[nr][nc] = 0;
        stack.push([nr, nc]);
      } else {
        stack.pop();
      }
    }

    this.player = { x: 1, y: 1 };
    this.exit = { x: this.cols - 2, y: this.rows - 2 };
    this.grid[this.exit.y][this.exit.x] = 0;

    if (this.statusEl) this.statusEl.textContent = "LABYRINTHE PARFAIT GÉNÉRÉ PAR DFS BACKTRACKING. ATTEINS LA SORTIE [VERT] !";
    this.draw();
  }

  draw() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] === 1) {
          this.ctx.fillStyle = '#0000aa'; // Murs bleus TempleOS
          this.ctx.fillRect(c * this.cellSize, r * this.cellSize, this.cellSize, this.cellSize);
        }
      }
    }

    // Sortie
    this.ctx.fillStyle = '#55ff55';
    this.ctx.fillRect(this.exit.x * this.cellSize, this.exit.y * this.cellSize, this.cellSize, this.cellSize);

    // Joueur
    this.ctx.fillStyle = '#ffff55';
    this.ctx.fillRect(this.player.x * this.cellSize + 2, this.player.y * this.cellSize + 2, this.cellSize - 4, this.cellSize - 4);
  }
}

// --------------------------------------------------------------------------
// 2. DUNGEON CRAWLER TEXTUEL (ROGUE-LIKE ASCII)
// --------------------------------------------------------------------------
class RogueGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.w = 28;
    this.h = 12;
    this.player = { x: 2, y: 2, hp: 20, maxHp: 20, atk: 5, gold: 0 };
    this.map = [];
    this.monsters = [];
    this.log = "Bienvenue dans les catacombes de TempleOS !";

    this.initEvents();
    this.generate();
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      if (['KeyI', 'KeyJ', 'KeyK', 'KeyL'].includes(e.code)) {
        let dx = 0, dy = 0;
        if (e.code === 'KeyI') dy = -1;
        if (e.code === 'KeyK') dy = 1;
        if (e.code === 'KeyJ') dx = -1;
        if (e.code === 'KeyL') dx = 1;
        this.step(dx, dy);
      }
    });
  }

  generate() {
    this.map = Array(this.h).fill('').map(() => Array(this.w).fill('#'));
    // Créer deux salles reliées
    for (let y = 1; y < 6; y++) for (let x = 1; x < 12; x++) this.map[y][x] = '.';
    for (let y = 5; y < 11; y++) for (let x = 14; x < 26; x++) this.map[y][x] = '.';
    for (let x = 11; x < 15; x++) this.map[5][x] = '.'; // Couloir

    this.player = { x: 2, y: 2, hp: 20, maxHp: 20, atk: 5, gold: 0 };
    this.monsters = [
      { x: 18, y: 8, hp: 12, name: 'Agent CIA', symbol: 'M' },
      { x: 22, y: 6, hp: 16, name: 'Démon Ring-0', symbol: 'D' }
    ];
    this.render();
  }

  step(dx, dy) {
    const nx = this.player.x + dx;
    const ny = this.player.y + dy;

    if (this.map[ny][nx] === '#') return;

    // Combat monstre
    const monster = this.monsters.find(m => m.x === nx && m.y === ny);
    if (monster) {
      monster.hp -= this.player.atk;
      this.log = `Tu frappes ${monster.name} pour ${this.player.atk} dégâts !`;
      window.soundEngine.beep(400, 0.08);

      if (monster.hp <= 0) {
        this.monsters = this.monsters.filter(m => m !== monster);
        this.player.gold += 15;
        this.log = `${monster.name} terrassé ! +15 pièces d'or !`;
        window.soundEngine.playVictory();
      } else {
        this.player.hp -= 3;
        if (this.player.hp <= 0) {
          window.soundEngine.playDefeat();
          alert("Tu as péri dans les catacombes de la CIA !");
          this.generate();
          return;
        }
      }
      this.render();
      return;
    }

    this.player.x = nx;
    this.player.y = ny;
    this.render();
  }

  render() {
    if (!this.container) return;
    let display = [];
    for (let y = 0; y < this.h; y++) {
      let row = '';
      for (let x = 0; x < this.w; x++) {
        if (x === this.player.x && y === this.player.y) {
          row += '<span style="color:#ffff55; font-weight:bold;">@</span>';
        } else {
          const m = this.monsters.find(mon => mon.x === x && mon.y === y);
          if (m) {
            row += `<span style="color:#ff5555; font-weight:bold;">${m.symbol}</span>`;
          } else {
            row += `<span style="color:${this.map[y][x] === '#' ? '#00aaaa' : '#555'};">${this.map[y][x]}</span>`;
          }
        }
      }
      display.push(row);
    }

    this.container.innerHTML = `
      <div style="text-align:center;">
        <div style="font-weight:bold; color:var(--vga-light-green); margin-bottom:4px;">
          PV : ${this.player.hp}/${this.player.maxHp} | OR : ${this.player.gold} | ATK : ${this.player.atk}
        </div>
        <pre style="background:#000; padding:6px; border:1px solid #555; display:inline-block; font-size:12px; line-height:1.1;">${display.join('\n')}</pre>
        <div style="font-size:11px; color:var(--vga-yellow); margin-top:4px;">${this.log}</div>
        <div style="margin-top:6px; font-size:11px; color:var(--vga-light-cyan);">Contrôles clavier : I (Haut), K (Bas), J (Gauche), L (Droite)</div>
        <div style="margin-top:4px;">
          <button class="temple-btn" onclick="desktop.games.rogue.step(0, -1)">▲</button>
          <button class="temple-btn" onclick="desktop.games.rogue.step(-1, 0)">◀</button>
          <button class="temple-btn" onclick="desktop.games.rogue.step(0, 1)">▼</button>
          <button class="temple-btn" onclick="desktop.games.rogue.step(1, 0)">▶</button>
        </div>
      </div>
    `;
  }
}

// --------------------------------------------------------------------------
// 3. CADAVRE EXQUIS PROCÉDURAL
// --------------------------------------------------------------------------
class CadavreGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.subjects = ["L'ÉLÉPHANT SACRÉ", "LE COMPILATEUR HOLYC", "MOÏSE EN RING-0", "UN AGENT DU PENTAGONE", "TERRY DAVIS", "LE RADAR DIVIN", "L'ARCHE DE NOÉ"];
    this.verbs = ["PULVÉRISE", "PURIFIE DANS LE CODE", "CONVERTIT EN VGA 640x480", "DÉMASQUE", "EXORCISE", "FAIT BRILLER DANS LE NOIR", "BÉNIT SANS PILOTE GPU"];
    this.objects = ["LA MÉMOIRE VIDÉO", "LES ESPIONS DE LA CIA", "LA PYRAMIDE DE JÉRICHO", "LE DISQUE DUR EN FAT32", "LES CATHÉDRALES NUMÉRIQUES", "LES FORCES DU MAL"];
    this.adverbs = ["AVEC UNE FOI INÉBRANLABLE", "À 60 FPS PURS", "SANS AUCUNE PERMISSION", "DANS LE SANCTUAIRE DIVIN", "À COUPS D'ÉCLAIRS SACRÉS"];
    this.history = [];
    this.init();
  }

  init() {
    this.generateSentence();
  }

  generateSentence() {
    const s = this.subjects[Math.floor(Math.random() * this.subjects.length)];
    const v = this.verbs[Math.floor(Math.random() * this.verbs.length)];
    const o = this.objects[Math.floor(Math.random() * this.objects.length)];
    const a = this.adverbs[Math.floor(Math.random() * this.adverbs.length)];

    const sentence = `« ${s} ${v} ${o} ${a} ! »`;
    this.history.unshift(sentence);
    window.soundEngine.playHolyMiracle();
    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div style="text-align:center; padding:8px;">
        <div style="font-size:12px; color:var(--vga-light-cyan); margin-bottom:8px;">GÉNÉRATEUR SYNTAXIQUE COMBINATOIRE DE PROPHÉTIES SURRÉALISTES</div>
        <div style="background:#000; padding:12px; border:2px dashed var(--vga-yellow); color:var(--vga-yellow); font-size:14px; font-weight:bold; margin-bottom:10px;">
          ${this.history[0] || 'Cliquez pour composer une phrase'}
        </div>
        <button class="temple-btn primary" onclick="desktop.games.cadavre.generateSentence()">ASSEMBLER UNE PROPHÉTIE ⚡</button>
        <div style="margin-top:10px; max-height:100px; overflow-y:auto; text-align:left; font-size:11px; color:var(--vga-light-gray); border-top:1px solid #555; padding-top:6px;">
          ${this.history.slice(1).map(h => `<div>• ${h}</div>`).join('')}
        </div>
      </div>
    `;
  }
}

// --------------------------------------------------------------------------
// 4. MACHINE LEARNING TIC-TAC-TOE (Q-LEARNING PAR RENFORCEMENT)
// --------------------------------------------------------------------------
class QLearningGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.qTable = {}; // Table des états (clé = board string, valeur = array de 9 scores)
    this.episodesTrained = 0;
    this.playerBoard = Array(9).fill(null);
    this.init();
  }

  init() {
    this.playerBoard = Array(9).fill(null);
    this.render();
  }

  trainFast(episodes = 5000) {
    const alpha = 0.5; // Taux d'apprentissage
    const gamma = 0.9; // Facteur d'actualisation

    for (let ep = 0; ep < episodes; ep++) {
      let b = Array(9).fill(null);
      let turn = 'X';
      let history = [];

      while (true) {
        const stateKey = b.map(v => v || '-').join('');
        if (!this.qTable[stateKey]) this.qTable[stateKey] = Array(9).fill(0);

        // Sélection coup (epsilon-greedy)
        const emptyIndices = b.map((v, i) => v === null ? i : null).filter(v => v !== null);
        if (emptyIndices.length === 0) break;

        let move;
        if (Math.random() < 0.2) {
          move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        } else {
          // Meilleur coup selon Q-values
          let maxVal = -Infinity;
          move = emptyIndices[0];
          for (const idx of emptyIndices) {
            if (this.qTable[stateKey][idx] > maxVal) {
              maxVal = this.qTable[stateKey][idx];
              move = idx;
            }
          }
        }

        history.push({ state: stateKey, action: move, player: turn });
        b[move] = turn;

        // Vérifier victoire
        const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        const hasWon = wins.some(c => c.every(idx => b[idx] === turn));

        if (hasWon) {
          // Récompense terminale
          const reward = turn === 'X' ? 1.0 : -1.0;
          for (const step of history) {
            const r = step.player === 'X' ? reward : -reward;
            this.qTable[step.state][step.action] += alpha * (r - this.qTable[step.state][step.action]);
          }
          break;
        }

        turn = turn === 'X' ? 'O' : 'X';
      }
    }

    this.episodesTrained += episodes;
    window.soundEngine.playHolyMiracle();
    this.render();
  }

  playerMove(idx) {
    if (this.playerBoard[idx] !== null) return;
    this.playerBoard[idx] = 'X';
    window.soundEngine.playMorpionMove(true);

    // Tour IA entraînée
    const stateKey = this.playerBoard.map(v => v || '-').join('');
    const emptyIndices = this.playerBoard.map((v, i) => v === null ? i : null).filter(v => v !== null);

    if (emptyIndices.length > 0) {
      const qVals = this.qTable[stateKey] || Array(9).fill(0);
      let bestMove = emptyIndices[0];
      let bestQ = -Infinity;
      for (const i of emptyIndices) {
        if (qVals[i] > bestQ) { bestQ = qVals[i]; bestMove = i; }
      }
      this.playerBoard[bestMove] = 'O';
      window.soundEngine.playMorpionMove(false);
    }
    this.render();
  }

  render() {
    if (!this.container) return;
    const statesCount = Object.keys(this.qTable).length;

    this.container.innerHTML = `
      <div style="text-align:center;">
        <div style="font-size:12px; color:var(--vga-light-cyan); margin-bottom:6px;">L'IA APPREND SEULE PAR RENFORCEMENT SANS RÈGLES CODÉES EN DUR !</div>
        <div style="font-weight:bold; color:var(--vga-yellow); margin-bottom:6px;">
          PARTIES D'ENTRAÎNEMENT : ${this.episodesTrained} | ÉTATS EN MÉMOIRE : ${statesCount}
        </div>
        <div style="display:flex; justify-content:center; gap:8px; margin-bottom:10px;">
          <button class="temple-btn primary" onclick="desktop.games.qlearn.trainFast(5000)">ENTRAÎNER +5 000 PARTIES ⚡</button>
          <button class="temple-btn" onclick="desktop.games.qlearn.init()">RÉINITIALISER GRILLE</button>
        </div>
        <div style="display:grid; grid-template-columns:repeat(3, 50px); gap:4px; justify-content:center; margin:0 auto;">
          ${this.playerBoard.map((v, i) => `
            <div style="width:50px; height:50px; background:#000; border:2px solid var(--vga-yellow); color:${v==='X'?'var(--vga-light-red)':'var(--vga-light-cyan)'}; font-size:28px; font-weight:bold; display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="desktop.games.qlearn.playerMove(${i})">
              ${v || ''}
            </div>
          `).join('')}
        </div>
        <div style="font-size:11px; color:var(--vga-light-gray); margin-top:6px;">Clique sur la grille pour tester le niveau de l'IA Q-Learning.</div>
      </div>
    `;
  }
}

// --------------------------------------------------------------------------
// 5. PROBLÈME DES 8 DAMES (BACKTRACKING 92 SOLUTIONS)
// --------------------------------------------------------------------------
class EightQueensGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.solutions = [];
    this.currentSolIdx = 0;
    this.playerQueens = []; // [{r, c}]
    this.mode = 'solveur'; // 'solveur' ou 'puzzle'

    this.findAllSolutions();
    this.init();
  }

  init() {
    this.playerQueens = [];
    this.render();
  }

  findAllSolutions() {
    this.solutions = [];
    const board = Array(8).fill(-1); // board[row] = col

    const solve = (row) => {
      if (row === 8) {
        this.solutions.push([...board]);
        return;
      }
      for (let col = 0; col < 8; col++) {
        let safe = true;
        for (let prevRow = 0; prevRow < row; prevRow++) {
          const prevCol = board[prevRow];
          if (prevCol === col || Math.abs(prevCol - col) === Math.abs(prevRow - row)) {
            safe = false;
            break;
          }
        }
        if (safe) {
          board[row] = col;
          solve(row + 1);
          board[row] = -1;
        }
      }
    };
    solve(0);
  }

  toggleQueen(r, c) {
    const idx = this.playerQueens.findIndex(q => q.r === r && q.c === c);
    if (idx !== -1) {
      this.playerQueens.splice(idx, 1);
    } else if (this.playerQueens.length < 8) {
      this.playerQueens.push({ r, c });
      window.soundEngine.playClick();
    }
    this.render();
  }

  render() {
    if (!this.container) return;
    const sol = this.solutions[this.currentSolIdx];

    let boardHtml = '';
    for (let r = 0; r < 8; r++) {
      boardHtml += '<div style="display:flex; justify-content:center;">';
      for (let c = 0; c < 8; c++) {
        const isBlack = (r + c) % 2 === 1;
        let hasQueen = false;

        if (this.mode === 'solveur') {
          hasQueen = sol && sol[r] === c;
        } else {
          hasQueen = this.playerQueens.some(q => q.r === r && q.c === c);
        }

        boardHtml += `
          <div style="width:26px; height:26px; background:${isBlack ? 'var(--vga-blue)' : 'var(--vga-light-gray)'}; color:#ffff55; font-size:18px; font-weight:bold; display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="desktop.games.eightqueens.toggleQueen(${r}, ${c})">
            ${hasQueen ? '♛' : ''}
          </div>
        `;
      }
      boardHtml += '</div>';
    }

    this.container.innerHTML = `
      <div style="text-align:center;">
        <div style="font-size:12px; color:var(--vga-light-cyan); margin-bottom:6px;">DISPOSE 8 DAMES SANS AUCUNE MENACE SUR L'ÉCHIQUIER</div>
        <div style="display:flex; justify-content:center; gap:8px; margin-bottom:6px;">
          <button class="temple-btn ${this.mode === 'solveur' ? 'primary' : ''}" onclick="desktop.games.eightqueens.mode = 'solveur'; desktop.games.eightqueens.render();">SOLVEUR 92 SOLUTIONS</button>
          <button class="temple-btn ${this.mode === 'puzzle' ? 'primary' : ''}" onclick="desktop.games.eightqueens.mode = 'puzzle'; desktop.games.eightqueens.render();">MODE PUZZLE LIBRE</button>
        </div>
        <div style="margin:6px 0;">${boardHtml}</div>
        ${this.mode === 'solveur' ? `
          <div style="display:flex; justify-content:center; align-items:center; gap:8px; font-weight:bold; color:var(--vga-yellow);">
            <button class="temple-btn" onclick="desktop.games.eightqueens.currentSolIdx = (desktop.games.eightqueens.currentSolIdx - 1 + 92) % 92; desktop.games.eightqueens.render();">◀</button>
            <span>SOLUTION ${this.currentSolIdx + 1} / 92</span>
            <button class="temple-btn" onclick="desktop.games.eightqueens.currentSolIdx = (desktop.games.eightqueens.currentSolIdx + 1) % 92; desktop.games.eightqueens.render();">▶</button>
          </div>
        ` : `
          <div style="color:var(--vga-yellow); font-weight:bold;">DAMES PLACÉES : ${this.playerQueens.length} / 8</div>
        `}
      </div>
    `;
  }
}

window.LabyrinthGame = LabyrinthGame;
window.RogueGame = RogueGame;
window.CadavreGame = CadavreGame;
window.QLearningGame = QLearningGame;
window.EightQueensGame = EightQueensGame;
