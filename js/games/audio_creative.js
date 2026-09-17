// ==========================================================================
// CATÉGORIE 3 : AUDIO, LUMIÈRE & CRÉATIF (TEMPLEOS V2.0)
// 1. Simon Musical 8-bit
// 2. Chasse au Trésor "Poursuite" (Faisceau Lyre MAC 250)
// 3. Puzzle de Câblage (Pipe Dream Régie)
// 4. Séquenceur Rythmique (Puzzle d'écoute)
// 5. Clicker / Idle Game de Location
// ==========================================================================

// --------------------------------------------------------------------------
// 1. SIMON MUSICAL 8-BIT
// --------------------------------------------------------------------------
class SimonGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.sequence = [];
    this.playerStep = 0;
    this.isPlayingSequence = false;
    this.score = 0;
    this.pads = [
      { id: 0, color: 'var(--vga-green)', freq: 330, name: 'DO' },
      { id: 1, color: 'var(--vga-red)', freq: 440, name: 'MI' },
      { id: 2, color: 'var(--vga-yellow)', freq: 554, name: 'SOL' },
      { id: 3, color: 'var(--vga-blue)', freq: 659, name: 'SI' }
    ];
    this.init();
  }

  init() {
    this.sequence = [];
    this.playerStep = 0;
    this.score = 0;
    this.render();
  }

  start() {
    this.sequence = [];
    this.score = 0;
    this.nextRound();
  }

  nextRound() {
    this.playerStep = 0;
    this.sequence.push(Math.floor(Math.random() * 4));
    this.score = this.sequence.length - 1;
    this.render();
    this.playSequence();
  }

  playSequence() {
    this.isPlayingSequence = true;
    this.sequence.forEach((padIdx, i) => {
      setTimeout(() => {
        this.flashPad(padIdx);
        if (i === this.sequence.length - 1) {
          setTimeout(() => { this.isPlayingSequence = false; }, 400);
        }
      }, (i + 1) * 500);
    });
  }

  flashPad(idx) {
    const el = document.getElementById(`simon-pad-${idx}`);
    if (el) {
      el.style.filter = 'brightness(2.5)';
      window.soundEngine.beep(this.pads[idx].freq, 0.25);
      setTimeout(() => { el.style.filter = 'brightness(1.0)'; }, 250);
    }
  }

  handlePadClick(idx) {
    if (this.isPlayingSequence || this.sequence.length === 0) return;
    this.flashPad(idx);

    if (idx === this.sequence[this.playerStep]) {
      this.playerStep++;
      if (this.playerStep === this.sequence.length) {
        window.soundEngine.playPaddleHit();
        setTimeout(() => this.nextRound(), 600);
      }
    } else {
      window.soundEngine.playDefeat();
      alert(`Séquence rompue ! Score final : ${this.score}`);
      this.init();
    }
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div style="text-align:center;">
        <div style="font-size:12px; color:var(--vga-light-cyan); margin-bottom:6px;">MÉMORISE ET REPRODUIS LA SÉQUENCE SONORE ET LUMINEUSE</div>
        <div style="font-weight:bold; color:var(--vga-yellow); margin-bottom:8px;">SCORE : ${this.score} NOTES</div>
        <div style="display:grid; grid-template-columns:repeat(2, 80px); gap:8px; justify-content:center; margin:10px auto;">
          ${this.pads.map((p, idx) => `
            <div id="simon-pad-${idx}" style="background:${p.color}; width:80px; height:80px; border:3px outset #fff; cursor:pointer;" onclick="desktop.games.simon.handlePadClick(${idx})"></div>
          `).join('')}
        </div>
        <button class="temple-btn primary" onclick="desktop.games.simon.start()">DÉMARRER LA MÉLODIE</button>
      </div>
    `;
  }
}

// --------------------------------------------------------------------------
// 2. CHASSE AU TRÉSOR "POURSUITE" (FAISCEAU DE LYRE MAC 250)
// --------------------------------------------------------------------------
class PoursuiteGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.gridSize = 8;
    this.target = { x: 0, y: 0 };
    this.clicks = 0;
    this.found = false;
    this.lastDist = 0;
    this.init();
  }

  init() {
    this.target = {
      x: Math.floor(Math.random() * this.gridSize),
      y: Math.floor(Math.random() * this.gridSize)
    };
    this.clicks = 0;
    this.found = false;
    this.lastDist = 10;
    this.render();
  }

  handleClick(x, y) {
    if (this.found) return;
    this.clicks++;

    const dist = Math.sqrt(Math.pow(x - this.target.x, 2) + Math.pow(y - this.target.y, 2));
    this.lastDist = dist;

    if (dist === 0) {
      this.found = true;
      window.soundEngine.playVictory();
    } else {
      // Fréquence sonore dépendante de la distance (plus c'est proche, plus c'est aigu)
      const freq = Math.max(150, Math.min(1000, 1000 - dist * 100));
      window.soundEngine.beep(freq, 0.08);
    }
    this.render();
  }

  render() {
    if (!this.container) return;
    // Simulation visuelle du faisceau lyre motorisée (MAC 250)
    const intensity = Math.max(0.1, (8 - this.lastDist) / 8);
    const beamColor = this.found ? '#55ff55' : (this.lastDist < 2.5 ? '#ff5555' : (this.lastDist < 4 ? '#ffff55' : '#00aaaa'));

    let gridHtml = '';
    for (let r = 0; r < this.gridSize; r++) {
      gridHtml += '<div style="display:flex; gap:3px; justify-content:center;">';
      for (let c = 0; c < this.gridSize; c++) {
        const isTarget = this.found && r === this.target.y && c === this.target.x;
        gridHtml += `<div style="width:26px; height:26px; background:#000; border:1px solid #444; display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="desktop.games.poursuite.handleClick(${c}, ${r})">${isTarget ? '💎' : ''}</div>`;
      }
      gridHtml += '</div>';
    }

    this.container.innerHTML = `
      <div style="text-align:center;">
        <div style="font-size:12px; color:var(--vga-light-cyan); margin-bottom:4px;">RETROUVE LA BALISE CACHÉE VIA LE FAISCEAU D'ÉCLAIRAGE</div>
        <div style="margin:6px auto; width:180px; height:18px; border:2px inset #aaa; background:black; display:flex; align-items:center; justify-content:center; box-shadow:0 0 ${intensity * 20}px ${beamColor}; color:${beamColor}; font-weight:bold; font-size:11px;">
          FAISCEAU LYRE MAC 250 : ${this.found ? "CIBLE VERROUILLÉE !" : (this.lastDist < 2.5 ? "TRÈS CHAUD 🔥" : (this.lastDist < 4.5 ? "TIÈDE ⚡" : "FROID ❄️"))}
        </div>
        <div style="margin:8px 0;">${gridHtml}</div>
        <div style="color:var(--vga-yellow); font-weight:bold;">TIRS : ${this.clicks} ${this.found ? '🏆 TRÉSOR DÉCOUVERT !' : ''}</div>
        <button class="temple-btn primary" style="margin-top:6px;" onclick="desktop.games.poursuite.init()">NOUVELLE POURSUITE</button>
      </div>
    `;
  }
}

// --------------------------------------------------------------------------
// 3. PUZZLE DE CÂBLAGE (PIPE DREAM RÉGIE AUDIO)
// --------------------------------------------------------------------------
class PipeDreamGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.size = 5;
    this.grid = [];
    this.isSolved = false;
    this.init();
  }

  init() {
    this.isSolved = false;
    this.grid = [];
    // Types : 0 = ligne droite (═ ou ║), 1 = coude (╔, ╗, ╚, ╝), 2 = carrefour (╬)
    for (let r = 0; r < this.size; r++) {
      this.grid[r] = [];
      for (let c = 0; c < this.size; c++) {
        this.grid[r][c] = {
          type: Math.random() < 0.4 ? 0 : 1,
          rot: Math.floor(Math.random() * 4) // 0, 90, 180, 270 deg
        };
      }
    }
    this.render();
  }

  rotateTile(r, c) {
    if (this.isSolved) return;
    this.grid[r][c].rot = (this.grid[r][c].rot + 1) % 4;
    window.soundEngine.playClick();
    this.checkPath();
    this.render();
  }

  checkPath() {
    // Vérification simplifiée de continuité du signal régie (0,0) aux enceintes (4,4)
    if (this.grid[0][0].rot === 1 && this.grid[4][4].rot === 3) {
      this.isSolved = true;
      window.soundEngine.playVictory();
    }
  }

  render() {
    if (!this.container) return;
    const symbols = {
      0: ['═', '║', '═', '║'],
      1: ['╔', '╗', '╝', '╚']
    };

    let gridHtml = '';
    for (let r = 0; r < this.size; r++) {
      gridHtml += '<div style="display:flex; gap:3px; justify-content:center;">';
      for (let c = 0; c < this.size; c++) {
        const tile = this.grid[r][c];
        const sym = symbols[tile.type][tile.rot];
        const isStart = r === 0 && c === 0;
        const isEnd = r === this.size - 1 && c === this.size - 1;

        let bg = '#000';
        if (isStart) bg = 'var(--vga-blue)';
        if (isEnd) bg = 'var(--vga-red)';

        gridHtml += `
          <div style="width:34px; height:34px; background:${bg}; border:1px solid #555; color:var(--vga-yellow); font-size:22px; font-weight:bold; display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="desktop.games.pipedream.rotateTile(${r}, ${c})">
            ${sym}
          </div>
        `;
      }
      gridHtml += '</div>';
    }

    this.container.innerHTML = `
      <div style="text-align:center;">
        <div style="font-size:12px; color:var(--vga-light-cyan); margin-bottom:6px;">CLIQUE SUR LES TUILES POUR RELIER LA RÉGIE AUDIO [BLEU] AUX ENCEINTES [ROUGE]</div>
        <div style="margin:8px 0;">${gridHtml}</div>
        <div style="color:var(--vga-yellow); font-weight:bold;">${this.isSolved ? "🏆 SIGNAL AUDIO ÉTABLI SANS PARASITES !" : "SIGNAUX DÉCONNECTÉS"}</div>
        <button class="temple-btn primary" style="margin-top:6px;" onclick="desktop.games.pipedream.init()">RÉINITIALISER LES CÂBLES</button>
      </div>
    `;
  }
}

// --------------------------------------------------------------------------
// 4. SÉQUENCEUR RYTHMIQUE (PUZZLE D'ÉCOUTE 8 PAS)
// --------------------------------------------------------------------------
class BeatSequencerGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.steps = 8;
    this.tracks = ['KICK', 'SNARE', 'HIHAT'];
    this.targetPattern = [];
    this.playerPattern = [];
    this.currentStep = 0;
    this.isPlaying = false;
    this.interval = null;

    this.init();
  }

  init() {
    this.targetPattern = [
      [1, 0, 0, 0, 1, 0, 0, 0], // Kick
      [0, 0, 1, 0, 0, 0, 1, 0], // Snare
      [1, 1, 1, 1, 1, 1, 1, 1]  // Hi-hat
    ];
    this.playerPattern = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];
    this.render();
  }

  playDrumSound(trackIdx) {
    if (trackIdx === 0) window.soundEngine.beep(120, 0.08, 'sine'); // Kick
    if (trackIdx === 1) window.soundEngine.beep(400, 0.06, 'square'); // Snare
    if (trackIdx === 2) window.soundEngine.beep(850, 0.02, 'triangle'); // Hi-hat
  }

  playDemo() {
    this.currentStep = 0;
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      for (let t = 0; t < 3; t++) {
        if (this.targetPattern[t][this.currentStep]) this.playDrumSound(t);
      }
      this.currentStep = (this.currentStep + 1) % 8;
      if (this.currentStep === 0) {
        clearInterval(this.interval);
      }
    }, 150);
  }

  toggleCell(track, step) {
    this.playerPattern[track][step] = this.playerPattern[track][step] ? 0 : 1;
    if (this.playerPattern[track][step]) this.playDrumSound(track);
    this.render();
  }

  verify() {
    let match = true;
    for (let t = 0; t < 3; t++) {
      for (let s = 0; s < 8; s++) {
        if (this.playerPattern[t][s] !== this.targetPattern[t][s]) match = false;
      }
    }
    if (match) {
      window.soundEngine.playVictory();
      alert("🏆 RYTHME REPRODUIT À LA PERFECTION ! OREILLE ABSOLUE !");
    } else {
      window.soundEngine.playDefeat();
      alert("Ce n'est pas le bon motif. Réécoute le beat modèle !");
    }
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div style="text-align:center;">
        <div style="font-size:12px; color:var(--vga-light-cyan); margin-bottom:6px;">ÉCOUTE LE BEAT ET COCHE LES BONNES CASES DU SÉQUENCEUR</div>
        <div style="margin:8px 0;">
          ${this.tracks.map((name, t) => `
            <div style="display:flex; align-items:center; gap:6px; justify-content:center; margin-bottom:4px;">
              <span style="width:60px; text-align:right; font-size:12px; color:var(--vga-yellow); font-weight:bold;">${name}</span>
              ${[0,1,2,3,4,5,6,7].map(s => `
                <div style="width:24px; height:24px; background:${this.playerPattern[t][s] ? 'var(--vga-green)' : '#111'}; border:1px solid #555; cursor:pointer;" onclick="desktop.games.sequencer.toggleCell(${t}, ${s})"></div>
              `).join('')}
            </div>
          `).join('')}
        </div>
        <div style="display:flex; gap:8px; justify-content:center; margin-top:8px;">
          <button class="temple-btn holy" onclick="desktop.games.sequencer.playDemo()">ÉCOUTER LE MODÈLE 🎵</button>
          <button class="temple-btn primary" onclick="desktop.games.sequencer.verify()">VÉRIFIER LE RYTHME</button>
        </div>
      </div>
    `;
  }
}

// --------------------------------------------------------------------------
// 5. CLICKER / IDLE GAME DE LOCATION AUDIO/LIGHT
// --------------------------------------------------------------------------
class RentalIdleGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.budget = 0;
    this.incomePerSec = 0;
    this.items = [
      { id: 'mic', name: 'Micro Shure SM58', cost: 15, income: 1, count: 0 },
      { id: 'par', name: 'Projecteur PAR LED', cost: 100, income: 6, count: 0 },
      { id: 'spk', name: 'Enceinte RCF 1000W', cost: 500, income: 30, count: 0 },
      { id: 'desk', name: 'Console Numérique M32', cost: 2000, income: 140, count: 0 }
    ];

    this.init();
  }

  init() {
    this.render();
    setInterval(() => {
      this.budget += this.incomePerSec;
      this.updateHud();
    }, 1000);
  }

  clickEarn() {
    this.budget += 1;
    window.soundEngine.beep(800, 0.02);
    this.updateHud();
  }

  buyItem(idx) {
    const item = this.items[idx];
    if (this.budget >= item.cost) {
      this.budget -= item.cost;
      item.count++;
      item.cost = Math.floor(item.cost * 1.25);
      this.incomePerSec += item.income;
      window.soundEngine.playPaddleHit();
      this.render();
    }
  }

  updateHud() {
    const b = document.getElementById('idle-budget');
    const inc = document.getElementById('idle-income');
    if (b) b.textContent = `${this.budget} €`;
    if (inc) inc.textContent = `${this.incomePerSec} €/s`;
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div style="text-align:center;">
        <div style="display:flex; justify-content:space-around; font-weight:bold; margin-bottom:8px;">
          <span style="color:var(--vga-light-green);">BUDGET : <span id="idle-budget">${this.budget} €</span></span>
          <span style="color:var(--vga-light-cyan);">REVENU : <span id="idle-income">${this.incomePerSec} €/s</span></span>
        </div>
        <button class="temple-btn primary" style="font-size:16px; padding:10px 20px; margin:6px 0;" onclick="desktop.games.idle.clickEarn()">LOUER UN CÂBLE (+1 €)</button>
        <div style="display:flex; flex-direction:column; gap:4px; max-height:160px; overflow-y:auto; margin-top:8px;">
          ${this.items.map((it, idx) => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:#111; padding:4px 8px; border:1px solid #444; font-size:12px;">
              <span style="color:var(--vga-yellow);">${it.name} (x${it.count})</span>
              <button class="temple-btn" ${this.budget < it.cost ? 'disabled' : ''} onclick="desktop.games.idle.buyItem(${idx})">ACHETER : ${it.cost} € (+${it.income}€/s)</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

window.SimonGame = SimonGame;
window.PoursuiteGame = PoursuiteGame;
window.PipeDreamGame = PipeDreamGame;
window.BeatSequencerGame = BeatSequencerGame;
window.RentalIdleGame = RentalIdleGame;
