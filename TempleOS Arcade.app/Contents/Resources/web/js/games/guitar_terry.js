// ==========================================================================
// GUITAR TERRY - GUITAR_TERRY.HC (JEU DE RYTHME 4 PISTES)
// Tape en rythme sur D - F - J - K au passage des notes sacrées !
// ==========================================================================

class GuitarTerryGame {
  constructor(containerId, scoreId) {
    this.container = document.getElementById(containerId);
    this.scoreEl = document.getElementById(scoreId);

    this.lanes = [
      { key: 'KeyD', label: 'D', color: '#ff5555', freq: 330 },
      { key: 'KeyF', label: 'F', color: '#55ff55', freq: 440 },
      { key: 'KeyJ', label: 'J', color: '#ffff55', freq: 554 },
      { key: 'KeyK', label: 'K', color: '#55ffff', freq: 659 }
    ];

    this.notes = []; // [{lane: 0..3, y: 0, hit: false}]
    this.score = 0;
    this.combo = 0;
    this.judgment = "PRÊT";
    this.isRunning = false;
    this.animId = null;
    this.spawnTimer = 0;

    this.initEvents();
    this.reset();
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      if (!this.isRunning) return;
      const laneIdx = this.lanes.findIndex(l => l.key === e.code);
      if (laneIdx !== -1) {
        this.hitLane(laneIdx);
      }
    });
  }

  reset() {
    this.stop();
    this.notes = [];
    this.score = 0;
    this.combo = 0;
    this.judgment = "APPUIE SUR DÉMARRER";
    this.updateHud();
    this.render();
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.loop();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  hitLane(laneIdx) {
    const laneInfo = this.lanes[laneIdx];
    window.soundEngine.beep(laneInfo.freq, 0.08);

    // Flash visuel
    const laneEl = document.getElementById(`guitar-lane-${laneIdx}`);
    if (laneEl) {
      laneEl.style.background = '#333';
      setTimeout(() => { laneEl.style.background = '#111'; }, 100);
    }

    // Trouver la note la plus proche de la ligne cible (y = 225)
    const targetY = 225;
    const note = this.notes.find(n => n.lane === laneIdx && !n.hit && Math.abs(n.y - targetY) < 40);

    if (note) {
      note.hit = true;
      const diff = Math.abs(note.y - targetY);
      if (diff <= 15) {
        this.score += 100;
        this.combo++;
        this.judgment = "PARFAIT ! [FIRE]";
      } else {
        this.score += 50;
        this.combo++;
        this.judgment = "BON ! [SYS]";
      }
    } else {
      this.combo = 0;
      this.judgment = "TROP TÔT / DANS LE VIDE";
    }
    this.updateHud();
  }

  update() {
    this.spawnTimer++;
    if (this.spawnTimer % 25 === 0) {
      const lane = Math.floor(Math.random() * 4);
      this.notes.push({ lane, y: 0, hit: false });
    }

    for (let i = this.notes.length - 1; i >= 0; i--) {
      const n = this.notes[i];
      n.y += 3.2;

      // Note ratée
      if (n.y > 255 && !n.hit) {
        this.combo = 0;
        this.judgment = "RATÉ ! [ERR]";
        this.notes.splice(i, 1);
        this.updateHud();
      } else if (n.y > 270) {
        this.notes.splice(i, 1);
      }
    }
  }

  updateHud() {
    if (this.scoreEl) {
      this.scoreEl.textContent = `SCORE : ${this.score} | COMBO : ${this.combo}x | ${this.judgment}`;
    }
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div style="text-align:center;">
        <div style="font-size:12px; color:var(--vga-light-cyan); margin-bottom:4px;">FRAPPE LES TOUCHES [D] [F] [J] [K] LORSQUE LES NOTES TOUCHENT LA LIGNE DORÉE !</div>
        <div style="display:flex; justify-content:center; gap:8px; margin:8px 0;">
          ${this.lanes.map((l, idx) => `
            <div id="guitar-lane-${idx}" class="guitar-lane">
              <div class="guitar-target-line"></div>
              <div id="guitar-notes-lane-${idx}"></div>
              <div style="position:absolute; bottom:4px; left:0; width:100%; text-align:center; font-weight:bold; color:${l.color};">${l.label}</div>
            </div>
          `).join('')}
        </div>
        <button class="temple-btn primary clickable" onclick="desktop.games.guitar.start()">DÉMARRER LE RYTHME [NOTE]</button>
      </div>
    `;
  }

  drawNotes() {
    for (let i = 0; i < 4; i++) {
      const laneEl = document.getElementById(`guitar-notes-lane-${i}`);
      if (laneEl) {
        const laneNotes = this.notes.filter(n => n.lane === i && !n.hit);
        laneEl.innerHTML = laneNotes.map(n => `
          <div class="guitar-note" style="top:${n.y}px; background:${this.lanes[i].color}; box-shadow:0 0 6px ${this.lanes[i].color};"></div>
        `).join('');
      }
    }
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.drawNotes();
    this.animId = requestAnimationFrame(() => this.loop());
  }
}

window.GuitarTerryGame = GuitarTerryGame;
