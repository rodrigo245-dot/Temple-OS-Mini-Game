// ==========================================================================
// CATÉGORIE 2 : LOGIQUE, CHAÎNES & BOUCLES (TEMPLEOS V2.0)
// 1. Plus ou Moins
// 2. Mastermind VGA
// 3. Le Pendu Sacré (ASCII Art)
// 4. Motus / Wordle
// 5. Jeu de Nim (XOR Mathématique)
// 6. Convertisseur Express
// ==========================================================================

// --------------------------------------------------------------------------
// 1. PLUS OU MOINS
// --------------------------------------------------------------------------
class PlusMoinsGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.target = 0;
    this.attempts = 0;
    this.max = 100;
    this.init();
  }

  init() {
    this.target = Math.floor(Math.random() * this.max) + 1;
    this.attempts = 0;
    if (!this.container) return;
    this.container.innerHTML = `
      <div style="text-align:center; padding: 10px;">
        <div style="color:var(--vga-light-cyan); margin-bottom:8px;">DEVINE LE NOMBRE SECRET CHOISI PAR L'ORACLE (1 À ${this.max})</div>
        <div style="margin: 10px 0;">
          <input type="number" id="pm-input" style="width:80px; font-size:16px; background:#000; color:#ffff55; border:1px solid #aaa; text-align:center;" min="1" max="${this.max}">
          <button class="temple-btn primary" id="pm-btn">VALIDER</button>
          <button class="temple-btn" id="pm-reset">NOUVEAU</button>
        </div>
        <div id="pm-msg" style="font-weight:bold; font-size:15px; min-height:24px; color:var(--vga-yellow);">TAPE UN CHIFFRE ET CLIQUE SUR VALIDER.</div>
        <div id="pm-tries" style="color:var(--vga-light-gray); margin-top:5px;">ESSAIS : 0</div>
      </div>
    `;

    const input = document.getElementById('pm-input');
    const btn = document.getElementById('pm-btn');
    const reset = document.getElementById('pm-reset');

    btn.addEventListener('click', () => this.checkGuess());
    reset.addEventListener('click', () => this.init());
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.checkGuess(); });
  }

  checkGuess() {
    const input = document.getElementById('pm-input');
    const msg = document.getElementById('pm-msg');
    const tries = document.getElementById('pm-tries');
    const val = parseInt(input.value);

    if (isNaN(val)) return;
    this.attempts++;
    tries.textContent = `ESSAIS : ${this.attempts}`;

    if (val < this.target) {
      msg.textContent = "[^] C'EST PLUS GRAND ! MONTE VERS LES CIEUX !";
      msg.style.color = "var(--vga-light-cyan)";
      window.soundEngine.beep(400, 0.08);
    } else if (val > this.target) {
      msg.textContent = "[v] C'EST PLUS PETIT ! DESCENDS VERS LA TERRE !";
      msg.style.color = "var(--vga-light-red)";
      window.soundEngine.beep(250, 0.08);
    } else {
      msg.textContent = `[TOP] MIRACLE ! NOMBRE ${this.target} TROUVÉ EN ${this.attempts} COUPS !`;
      msg.style.color = "var(--vga-light-green)";
      window.soundEngine.playVictory();
    }
    input.value = '';
    input.focus();
  }
}

// --------------------------------------------------------------------------
// 2. MASTERMIND VGA
// --------------------------------------------------------------------------
class MastermindGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.colors = ['#aa0000', '#00aa00', '#0000aa', '#ffff55', '#00aaaa', '#aa00aa'];
    this.colorNames = ['ROUGE', 'VERT', 'BLEU', 'JAUNE', 'CYAN', 'MAGENTA'];
    this.secret = [];
    this.currentGuess = [];
    this.history = [];
    this.maxAttempts = 10;
    this.isOver = false;

    this.init();
  }

  init() {
    this.secret = [];
    for (let i = 0; i < 4; i++) {
      this.secret.push(this.colors[Math.floor(Math.random() * this.colors.length)]);
    }
    this.currentGuess = [];
    this.history = [];
    this.isOver = false;
    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:8px;">
        <div style="font-size:12px; color:var(--vga-light-cyan);">DEVINE LA SÉQUENCE SECRÈTE DE 4 COULEURS EN 10 ESSAIS</div>
        <div id="mm-palette" style="display:flex; gap:6px; justify-content:center;">
          ${this.colors.map(c => `<div class="mm-pal-btn" style="background:${c}; width:26px; height:26px; border:2px outset #fff; cursor:pointer;" data-color="${c}"></div>`).join('')}
        </div>
        <div style="display:flex; align-items:center; justify-content:center; gap:8px; margin:4px 0;">
          <span>COUP EN COURS :</span>
          <div id="mm-current" style="display:flex; gap:6px;">
            ${[0,1,2,3].map(i => `<div style="width:24px; height:24px; border:1px solid #aaa; background:${this.currentGuess[i] || '#000'}"></div>`).join('')}
          </div>
          <button class="temple-btn primary" id="mm-submit">VALIDER</button>
          <button class="temple-btn" id="mm-clear">EFFACER</button>
        </div>
        <div id="mm-history" style="max-height:160px; overflow-y:auto; background:#000; padding:6px; border:1px solid #555;">
          ${this.history.map(h => `
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:4px;">
              <div style="display:flex; gap:4px;">${h.guess.map(c => `<div style="width:16px; height:16px; background:${c};"></div>`).join('')}</div>
              <span style="color:var(--vga-yellow);">BIEN PLACÉS : ${h.exact} | MAL PLACÉS : ${h.partial}</span>
            </div>
          `).join('')}
        </div>
        <div id="mm-msg" style="text-align:center; font-weight:bold; color:var(--vga-yellow);"></div>
      </div>
    `;

    this.container.querySelectorAll('.mm-pal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.currentGuess.length < 4 && !this.isOver) {
          this.currentGuess.push(btn.dataset.color);
          window.soundEngine.playClick();
          this.render();
        }
      });
    });

    const submit = document.getElementById('mm-submit');
    const clear = document.getElementById('mm-clear');
    if (submit) submit.addEventListener('click', () => this.submitGuess());
    if (clear) clear.addEventListener('click', () => { this.currentGuess = []; this.render(); });
  }

  submitGuess() {
    if (this.currentGuess.length !== 4 || this.isOver) return;

    let exact = 0;
    let partial = 0;
    const secretCopy = [...this.secret];
    const guessCopy = [...this.currentGuess];

    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] === secretCopy[i]) {
        exact++;
        secretCopy[i] = null;
        guessCopy[i] = 'MATCHED';
      }
    }

    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] !== 'MATCHED') {
        const idx = secretCopy.indexOf(guessCopy[i]);
        if (idx !== -1) {
          partial++;
          secretCopy[idx] = null;
        }
      }
    }

    this.history.unshift({ guess: [...this.currentGuess], exact, partial });
    this.currentGuess = [];

    if (exact === 4) {
      this.isOver = true;
      window.soundEngine.playVictory();
      this.render();
      document.getElementById('mm-msg').textContent = "[TOP] CODE SECRET DÉCHIFFRÉ PAR LE FIDELE !";
      return;
    }

    if (this.history.length >= this.maxAttempts) {
      this.isOver = true;
      window.soundEngine.playDefeat();
      this.render();
      document.getElementById('mm-msg').textContent = "[ERR] 10 ESSAIS ÉPUISÉS ! LE CODE RESTE CELUI DE LA CIA !";
      return;
    }

    window.soundEngine.beep(550, 0.06);
    this.render();
  }
}

// --------------------------------------------------------------------------
// 3. LE PENDU SACRÉ (ASCII ART TEMPLEOS)
// --------------------------------------------------------------------------
class PenduGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.words = ["ARCHE", "PROPHETE", "JERICHO", "VATICAN", "SANCTUAIRE", "COMPILATEUR", "RINGZERO", "MIRACLE", "PARANOIA", "LUMIERE"];
    this.secretWord = "";
    this.guessed = new Set();
    this.errors = 0;
    this.maxErrors = 6;

    this.asciiStages = [
`
  +---+
  |   |
      |
      |
      |
      |
=========`,
`
  +---+
  |   |
  O   |
      |
      |
      |
=========`,
`
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
`
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
`
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
`
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
`
  +---+
  |   |
  [ERR]   |
 /|\\  |
 / \\  |
      |
========= (PENDU PAR LA CIA !)`
    ];

    this.init();
  }

  init() {
    this.secretWord = this.words[Math.floor(Math.random() * this.words.length)];
    this.guessed = new Set();
    this.errors = 0;
    this.render();
  }

  guess(letter) {
    if (this.guessed.has(letter) || this.errors >= this.maxErrors) return;
    this.guessed.add(letter);

    if (this.secretWord.includes(letter)) {
      window.soundEngine.beep(700, 0.05);
    } else {
      this.errors++;
      window.soundEngine.beep(220, 0.1);
    }

    this.render();
  }

  render() {
    if (!this.container) return;
    const isWon = [...this.secretWord].every(l => this.guessed.has(l));
    const isLost = this.errors >= this.maxErrors;

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

    this.container.innerHTML = `
      <div style="display:flex; gap:16px; align-items:center;">
        <pre style="color:var(--vga-light-red); font-weight:bold; font-size:12px; line-height:1.2; background:#000; padding:6px; border:1px solid #555;">${this.asciiStages[this.errors]}</pre>
        <div style="flex:1;">
          <div style="font-size:20px; letter-spacing:4px; font-weight:bold; margin-bottom:12px; color:var(--vga-yellow);">
            ${[...this.secretWord].map(l => (this.guessed.has(l) || isLost ? l : '_')).join(' ')}
          </div>
          <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:4px; margin-bottom:10px;">
            ${letters.map(l => `
              <button class="temple-btn" style="padding:2px 4px; font-size:12px; ${this.guessed.has(l) ? 'opacity:0.3;' : ''}" 
                      ${this.guessed.has(l) || isWon || isLost ? 'disabled' : ''} onclick="desktop.games.pendu.guess('${l}')">
                ${l}
              </button>
            `).join('')}
          </div>
          <div style="font-weight:bold; color:${isWon ? 'var(--vga-light-green)' : (isLost ? 'var(--vga-light-red)' : 'var(--vga-light-cyan)')}">
            ${isWon ? "[TOP] MOT SACRÉ TROUVÉ ! BÉNÉDICTION !" : (isLost ? `[ERR] PERDU ! LE MOT ÉTAIT : ${this.secretWord}` : `ERREURS : ${this.errors} / ${this.maxErrors}`)}
          </div>
          <button class="temple-btn primary" style="margin-top:6px;" onclick="desktop.games.pendu.init()">NOUVEAU MOT</button>
        </div>
      </div>
    `;

    if (isWon) window.soundEngine.playVictory();
    if (isLost) window.soundEngine.playDefeat();
  }
}

// --------------------------------------------------------------------------
// 4. CLONE WORDLE / MOTUS
// --------------------------------------------------------------------------
class MotusGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.wordList = ["SANTE", "CROIX", "BIBLE", "TEMPO", "GRACE", "DIVIN", "TERRY", "GLOIRE", "PRIER", "FANGE"];
    this.secret = "";
    this.guesses = [];
    this.currentInput = "";
    this.isOver = false;

    this.init();
  }

  init() {
    this.secret = this.wordList[Math.floor(Math.random() * this.wordList.length)];
    this.guesses = [];
    this.currentInput = "";
    this.isOver = false;
    this.render();
  }

  handleKey(key) {
    if (this.isOver) return;
    if (key === 'ENTER') {
      if (this.currentInput.length === 5) {
        this.guesses.push(this.currentInput);
        if (this.currentInput === this.secret) {
          this.isOver = true;
          window.soundEngine.playVictory();
        } else if (this.guesses.length >= 6) {
          this.isOver = true;
          window.soundEngine.playDefeat();
        } else {
          window.soundEngine.beep(600, 0.05);
        }
        this.currentInput = "";
      }
    } else if (key === 'BACKSPACE') {
      this.currentInput = this.currentInput.slice(0, -1);
    } else if (this.currentInput.length < 5 && /^[A-Z]$/.test(key)) {
      this.currentInput += key;
      window.soundEngine.playClick();
    }
    this.render();
  }

  render() {
    if (!this.container) return;
    let gridHtml = '';
    for (let r = 0; r < 6; r++) {
      gridHtml += '<div style="display:flex; gap:4px; justify-content:center; margin-bottom:4px;">';
      const guess = this.guesses[r];
      for (let c = 0; c < 5; c++) {
        let letter = '';
        let bg = '#000';
        let color = '#fff';

        if (guess) {
          letter = guess[c];
          if (letter === this.secret[c]) {
            bg = 'var(--vga-green)'; color = '#000'; // Bien placé
          } else if (this.secret.includes(letter)) {
            bg = 'var(--vga-yellow)'; color = '#000'; // Mal placé
          } else {
            bg = 'var(--vga-dark-gray)'; color = '#fff'; // Absent
          }
        } else if (r === this.guesses.length) {
          letter = this.currentInput[c] || '';
        }

        gridHtml += `<div style="width:32px; height:32px; background:${bg}; color:${color}; font-weight:bold; font-size:18px; display:flex; align-items:center; justify-content:center; border:1px solid #555;">${letter}</div>`;
      }
      gridHtml += '</div>';
    }

    this.container.innerHTML = `
      <div style="text-align:center;">
        <div style="font-size:12px; color:var(--vga-light-cyan); margin-bottom:6px;">DEVINE LE MOT SACRÉ DE 5 LETTRES EN 6 ESSAIS</div>
        ${gridHtml}
        <div style="margin-top:6px; font-weight:bold; color:var(--vga-yellow);">
          ${this.isOver ? (this.guesses.includes(this.secret) ? "[TOP] MOT DÉCOUVERT !" : `[ERR] PERDU ! LE MOT ÉTAIT : ${this.secret}`) : "TAPE AU CLAVIER OU UTILISE LES TOUCHES CI-DESSOUS"}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:3px; justify-content:center; max-width:320px; margin:8px auto;">
          ${"AZERTYUIOPQSDFGHJKLMWXCVBN".split('').map(k => `
            <button class="temple-btn" style="padding:2px 5px; font-size:11px;" onclick="desktop.games.motus.handleKey('${k}')">${k}</button>
          `).join('')}
          <button class="temple-btn primary" onclick="desktop.games.motus.handleKey('ENTER')">ENTRÉE</button>
          <button class="temple-btn danger" onclick="desktop.games.motus.handleKey('BACKSPACE')">EFFACER</button>
        </div>
      </div>
    `;
  }
}

// --------------------------------------------------------------------------
// 5. JEU DE NIM (ALLUMETTES AVEC LOGIQUE XOR)
// --------------------------------------------------------------------------
class NimGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.piles = [3, 5, 7];
    this.isPlayerTurn = true;
    this.isOver = false;
    this.init();
  }

  init() {
    this.piles = [3, 5, 7];
    this.isPlayerTurn = true;
    this.isOver = false;
    this.render();
  }

  take(pileIdx, count) {
    if (!this.isPlayerTurn || this.isOver || this.piles[pileIdx] < count) return;
    this.piles[pileIdx] -= count;
    window.soundEngine.playClick();
    this.checkEnd();

    if (!this.isOver) {
      this.isPlayerTurn = false;
      this.render();
      setTimeout(() => this.aiTurn(), 600);
    }
  }

  aiTurn() {
    if (this.isOver) return;

    // Calcul de la somme de Nim via l'opérateur bitwise XOR (^)
    let nimSum = this.piles.reduce((acc, p) => acc ^ p, 0);

    let targetPile = -1;
    let takeCount = 1;

    if (nimSum !== 0) {
      // Stratégie gagnante : Ramener la somme de Nim à zéro
      for (let i = 0; i < this.piles.length; i++) {
        const target = this.piles[i] ^ nimSum;
        if (target < this.piles[i]) {
          targetPile = i;
          takeCount = this.piles[i] - target;
          break;
        }
      }
    }

    // Si déjà à 0, coup par défaut
    if (targetPile === -1) {
      targetPile = this.piles.findIndex(p => p > 0);
      takeCount = 1;
    }

    this.piles[targetPile] -= takeCount;
    window.soundEngine.beep(480, 0.08);
    this.checkEnd();
    this.isPlayerTurn = true;
    this.render();
  }

  checkEnd() {
    if (this.piles.every(p => p === 0)) {
      this.isOver = true;
      if (this.isPlayerTurn) {
        window.soundEngine.playDefeat(); // Celui qui prend la dernière allumette perd
      } else {
        window.soundEngine.playVictory();
      }
    }
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div style="text-align:center;">
        <div style="font-size:12px; color:var(--vga-light-cyan); margin-bottom:8px;">
          PRENDS 1, 2 OU 3 ALLUMETTES. CELUI QUI PREND LA DERNIÈRE A PERDU !
        </div>
        <div style="display:flex; justify-content:center; gap:24px; margin:16px 0;">
          ${this.piles.map((p, idx) => `
            <div style="background:#000; padding:10px; border:1px solid #555; width:90px;">
              <div style="color:var(--vga-yellow); font-weight:bold;">TAS ${idx + 1}</div>
              <div style="color:var(--vga-light-red); font-size:20px; min-height:40px; margin:6px 0;">
                ${'[FIRE]'.repeat(p) || 'VIDE'}
              </div>
              <div style="display:flex; gap:4px; justify-content:center;">
                <button class="temple-btn" ${p < 1 || !this.isPlayerTurn || this.isOver ? 'disabled' : ''} onclick="desktop.games.nim.take(${idx}, 1)">-1</button>
                <button class="temple-btn" ${p < 2 || !this.isPlayerTurn || this.isOver ? 'disabled' : ''} onclick="desktop.games.nim.take(${idx}, 2)">-2</button>
                <button class="temple-btn" ${p < 3 || !this.isPlayerTurn || this.isOver ? 'disabled' : ''} onclick="desktop.games.nim.take(${idx}, 3)">-3</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div style="font-weight:bold; color:${this.isOver ? 'var(--vga-light-green)' : 'var(--vga-yellow)'}">
          ${this.isOver ? (this.isPlayerTurn ? "[ERR] L'IA DE DIEU (OPÉRATEUR XOR) A GAGNÉ !" : "[TOP] LE FIDÈLE A TRIOMPHÉ !") : (this.isPlayerTurn ? "À TOI DE JOUER" : "L'IA CALCULE LA SOMME DE NIM (XOR)...")}
        </div>
        <button class="temple-btn primary" style="margin-top:10px;" onclick="desktop.games.nim.init()">REJOUER</button>
      </div>
    `;
  }
}

// --------------------------------------------------------------------------
// 6. CONVERTISSEUR EXPRESS (BINAIRE / HEXA)
// --------------------------------------------------------------------------
class BinaryConvertGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.score = 0;
    this.timeLeft = 30;
    this.timer = null;
    this.currentNumber = 0;
    this.mode = 'bin'; // 'bin' ou 'hex'
    this.init();
  }

  init() {
    this.score = 0;
    this.timeLeft = 30;
    clearInterval(this.timer);
    this.nextNumber();
    this.render();
  }

  startTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        window.soundEngine.playDefeat();
      }
      this.render();
    }, 1000);
  }

  nextNumber() {
    this.currentNumber = Math.floor(Math.random() * 63) + 1; // 1 à 63
  }

  checkAnswer(val) {
    if (parseInt(val) === this.currentNumber && this.timeLeft > 0) {
      this.score += 10;
      window.soundEngine.playPaddleHit();
      this.nextNumber();
      this.render();
    }
  }

  render() {
    if (!this.container) return;
    const representation = this.mode === 'bin' ? this.currentNumber.toString(2).padStart(8, '0') : '0x' + this.currentNumber.toString(16).toUpperCase();

    this.container.innerHTML = `
      <div style="text-align:center; padding:10px;">
        <div style="font-size:12px; color:var(--vga-light-cyan);">CONVERTIS LE NOMBRE EN DÉCIMAL LE PLUS VITE POSSIBLE !</div>
        <div style="display:flex; justify-content:center; gap:16px; margin:8px 0; font-weight:bold;">
          <span style="color:var(--vga-light-red);">TEMPS : ${this.timeLeft}s</span>
          <span style="color:var(--vga-light-green);">SCORE : ${this.score} PTS</span>
        </div>
        <div style="background:#000; padding:12px; font-size:28px; font-weight:bold; color:var(--vga-yellow); border:2px solid #555; letter-spacing:3px; margin:10px auto; max-width:260px;">
          ${representation}
        </div>
        <div style="margin:10px 0;">
          <input type="number" id="bin-input" style="width:100px; font-size:18px; text-align:center; background:#000; color:#fff; border:1px solid #aaa;" ${this.timeLeft <= 0 ? 'disabled' : ''} autofocus>
          <button class="temple-btn" onclick="desktop.games.binary.mode = (desktop.games.binary.mode === 'bin' ? 'hex' : 'bin'); desktop.games.binary.render();">MODE: ${this.mode.toUpperCase()}</button>
          <button class="temple-btn primary" onclick="desktop.games.binary.init(); desktop.games.binary.startTimer();">DÉMARRER 30S</button>
        </div>
      </div>
    `;

    const input = document.getElementById('bin-input');
    if (input) {
      input.addEventListener('input', (e) => this.checkAnswer(e.target.value));
      input.focus();
    }
  }
}

window.PlusMoinsGame = PlusMoinsGame;
window.MastermindGame = MastermindGame;
window.PenduGame = PenduGame;
window.MotusGame = MotusGame;
window.NimGame = NimGame;
window.BinaryConvertGame = BinaryConvertGame;
