// ==========================================================================
// EXPANSION PACK V5.3 : 7 NOUVEAUX JEUX RETRO DU RING-0 (SANS EMOJIS)
// 1. Terry Honda Civic 1996 Pseudo-3D (CivicEscapeGame)
// 2. HAARP Ionosphere Hacker (HaarpHackerGame)
// 3. FAT32 Hex Sector Recovery (HexRecoveryGame)
// 4. Denver Sub-Level 7 Dungeon 3D (DenverDungeonGame)
// 5. UVB-76 Numbers Station (NumbersStationGame)
// 6. Holy Crusade Deck-Builder 3x3 (HolyCrusadeGame)
// 7. CRISPR Synthetic Gene Lab (CrisprLabGame)
// ==========================================================================

// --------------------------------------------------------------------------
// 1. TERRY HONDA CIVIC 1996 : ESCAPE THE MATRIX (Pseudo-3D Highway)
// --------------------------------------------------------------------------
class CivicEscapeGame {
  constructor(canvasId, statusId) {
    this.canvas = document.getElementById(canvasId);
    this.statusEl = document.getElementById(statusId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.carX = 0; // -1 to 1
    this.carSpeed = 0;
    this.maxSpeed = 160;
    this.distance = 0;
    this.fuel = 100;
    this.score = 0;
    this.isGameOver = false;
    this.animationId = null;

    this.keys = { left: false, right: false, up: false, down: false };
    this.traffic = [];
    this.collectibles = [];
    this.trackPos = 0;

    this.initEvents();
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      if (!this.canvas || this.canvas.offsetParent === null) return;
      if (e.key === 'ArrowLeft' || e.key === 'q' || e.key === 'Q') this.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = true;
      if (e.key === 'ArrowUp' || e.key === 'z' || e.key === 'Z') this.keys.up = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') this.keys.down = true;
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'q' || e.key === 'Q') this.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = false;
      if (e.key === 'ArrowUp' || e.key === 'z' || e.key === 'Z') this.keys.up = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') this.keys.down = false;
    });
  }

  start() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.reset();
    const loop = () => {
      this.update();
      this.draw();
      if (!this.isGameOver) {
        this.animationId = requestAnimationFrame(loop);
      }
    };
    this.animationId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  reset() {
    this.carX = 0;
    this.carSpeed = 60;
    this.distance = 0;
    this.fuel = 100;
    this.score = 0;
    this.isGameOver = false;
    this.traffic = [
      { x: -0.5, z: 400, type: 'van' },
      { x: 0.4, z: 800, type: 'police' },
      { x: 0.0, z: 1200, type: 'van' }
    ];
    this.collectibles = [
      { x: -0.3, z: 300, type: 'fuel' },
      { x: 0.5, z: 600, type: 'bible' },
      { x: 0.0, z: 1000, type: 'disk' }
    ];
    if (this.statusEl) this.statusEl.textContent = "STATUT : EN FUITE DANS LA CIVIC ROUGE 1996 !";
  }

  update() {
    if (this.isGameOver) return;

    if (this.keys.up) this.carSpeed = Math.min(this.maxSpeed, this.carSpeed + 1.2);
    else if (this.keys.down) this.carSpeed = Math.max(20, this.carSpeed - 2);
    else this.carSpeed = Math.max(40, this.carSpeed - 0.4);

    if (this.keys.left) this.carX = Math.max(-0.9, this.carX - 0.035);
    if (this.keys.right) this.carX = Math.min(0.9, this.carX + 0.035);

    this.trackPos += this.carSpeed * 0.1;
    this.distance += Math.floor(this.carSpeed * 0.05);
    this.fuel = Math.max(0, this.fuel - (this.carSpeed * 0.0015));

    if (this.fuel <= 0) {
      this.isGameOver = true;
      if (this.statusEl) this.statusEl.textContent = "PANNE SÈCHE ! LA CIA A INTERCEPTÉ LA CIVIC !";
      if (window.soundEngine) window.soundEngine.playExplosion();
      return;
    }

    // Progression du trafic
    this.traffic.forEach(car => {
      car.z -= this.carSpeed * 0.15;
      if (car.z < 20) {
        car.z = 1200 + Math.random() * 400;
        car.x = (Math.random() - 0.5) * 1.5;
      }
      if (car.z < 60 && car.z > 20 && Math.abs(car.x - this.carX) < 0.28) {
        this.fuel = Math.max(0, this.fuel - 20);
        this.carSpeed = 30;
        if (window.soundEngine) window.soundEngine.playExplosion();
        car.z = 1400;
      }
    });

    // Collectibles
    this.collectibles.forEach(col => {
      col.z -= this.carSpeed * 0.15;
      if (col.z < 20) {
        col.z = 1000 + Math.random() * 500;
        col.x = (Math.random() - 0.5) * 1.5;
      }
      if (col.z < 60 && col.z > 20 && Math.abs(col.x - this.carX) < 0.25) {
        if (col.type === 'fuel') this.fuel = Math.min(100, this.fuel + 25);
        else if (col.type === 'bible') this.score += 500;
        else if (col.type === 'disk') this.score += 1000;
        if (window.soundEngine) window.soundEngine.playCoin();
        col.z = 1200;
      }
    });

    if (this.statusEl) {
      this.statusEl.textContent = `VITESSE: ${Math.floor(this.carSpeed)} KM/H | CARBURANT: ${Math.floor(this.fuel)}% | DIST: ${this.distance}m | SCORE: ${this.score}`;
    }
  }

  draw() {
    if (!this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    // Ciel nocturne
    ctx.fillStyle = "#000015";
    ctx.fillRect(0, 0, w, h * 0.45);

    // Étoiles / Grille néon
    ctx.strokeStyle = "#220044";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h * 0.45);
      ctx.stroke();
    }

    // Sol
    ctx.fillStyle = "#001a00";
    ctx.fillRect(0, h * 0.45, w, h * 0.55);

    // Route en perspective
    const horizon = h * 0.45;
    const steps = 60;
    for (let i = 0; i < steps; i++) {
      const p1 = i / steps;
      const p2 = (i + 1) / steps;
      const y1 = horizon + Math.pow(p1, 2) * (h - horizon);
      const y2 = horizon + Math.pow(p2, 2) * (h - horizon);
      const rw1 = 80 + p1 * (w * 0.75);
      const rw2 = 80 + p2 * (w * 0.75);

      const colorAlt = Math.sin((i * 4) + (this.trackPos * 0.2)) > 0;
      ctx.fillStyle = colorAlt ? "#222" : "#191919";
      ctx.beginPath();
      ctx.moveTo((w / 2) - rw1, y1);
      ctx.lineTo((w / 2) + rw1, y1);
      ctx.lineTo((w / 2) + rw2, y2);
      ctx.lineTo((w / 2) - rw2, y2);
      ctx.closePath();
      ctx.fill();

      // Bandes latérales
      ctx.fillStyle = colorAlt ? "#ff3333" : "#ffffff";
      ctx.fillRect((w / 2) - rw2 - 8, y2, 8, y2 - y1 + 1);
      ctx.fillRect((w / 2) + rw2, y2, 8, y2 - y1 + 1);
    }

    // Ligne centrale
    for (let i = 0; i < steps; i += 4) {
      const p1 = i / steps;
      const y1 = horizon + Math.pow(p1, 2) * (h - horizon);
      const y2 = horizon + Math.pow((i + 2) / steps, 2) * (h - horizon);
      if (Math.sin((i * 4) + (this.trackPos * 0.2)) > 0) {
        ctx.fillStyle = "#ffff55";
        ctx.fillRect((w / 2) - 3, y1, 6, y2 - y1 + 1);
      }
    }

    // Rendu des Objets & Trafic
    this.traffic.forEach(car => {
      if (car.z > 50 && car.z < 1200) {
        const p = (1200 - car.z) / 1200;
        const cy = horizon + Math.pow(p, 2) * (h - horizon - 20);
        const rw = 80 + p * (w * 0.75);
        const cx = (w / 2) + (car.x * rw);
        const cw = 20 + p * 60;
        const ch = 12 + p * 35;

        ctx.fillStyle = car.type === 'police' ? '#0000aa' : '#111111';
        ctx.fillRect(cx - (cw / 2), cy - ch, cw, ch);
        ctx.strokeStyle = car.type === 'police' ? '#55ffff' : '#555555';
        ctx.strokeRect(cx - (cw / 2), cy - ch, cw, ch);

        ctx.fillStyle = "#ff0000";
        ctx.fillRect(cx - (cw / 2) + 2, cy - 6, cw * 0.25, 4);
        ctx.fillRect(cx + (cw / 4) - 2, cy - 6, cw * 0.25, 4);

        if (car.type === 'police' && Math.floor(Date.now() / 150) % 2 === 0) {
          ctx.fillStyle = "#ff0000";
          ctx.fillRect(cx - 6, cy - ch - 4, 6, 4);
          ctx.fillStyle = "#0055ff";
          ctx.fillRect(cx, cy - ch - 4, 6, 4);
        }
      }
    });

    // Rendu des Collectibles
    this.collectibles.forEach(col => {
      if (col.z > 50 && col.z < 1200) {
        const p = (1200 - col.z) / 1200;
        const cy = horizon + Math.pow(p, 2) * (h - horizon - 15);
        const rw = 80 + p * (w * 0.75);
        const cx = (w / 2) + (col.x * rw);
        const size = 10 + p * 20;

        ctx.fillStyle = col.type === 'fuel' ? '#ffff55' : (col.type === 'bible' ? '#55ff55' : '#55ffff');
        ctx.fillRect(cx - (size / 2), cy - size, size, size);
        ctx.fillStyle = '#000';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(col.type === 'fuel' ? 'G' : (col.type === 'bible' ? '+' : 'D'), cx - 3, cy - 4);
      }
    });

    // Rendu de la Honda Civic Rouge
    const playerX = (w / 2) + (this.carX * (w * 0.38));
    const playerY = h - 35;
    const pWidth = 85;
    const pHeight = 45;

    ctx.fillStyle = "#cc0000";
    ctx.fillRect(playerX - (pWidth / 2), playerY - pHeight, pWidth, pHeight);
    ctx.fillStyle = "#990000";
    ctx.fillRect(playerX - (pWidth / 2) + 5, playerY - pHeight - 12, pWidth - 10, 14);

    ctx.fillStyle = "#112233";
    ctx.fillRect(playerX - (pWidth / 2) + 12, playerY - pHeight - 10, pWidth - 24, 10);

    ctx.fillStyle = "#ff2222";
    ctx.fillRect(playerX - (pWidth / 2) + 4, playerY - 14, 20, 8);
    ctx.fillRect(playerX + (pWidth / 2) - 24, playerY - 14, 20, 8);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(playerX - 18, playerY - 12, 36, 8);
    ctx.fillStyle = "#000000";
    ctx.font = "bold 7px monospace";
    ctx.fillText("RING-0", playerX - 14, playerY - 6);

    ctx.fillStyle = "#111111";
    ctx.fillRect(playerX - (pWidth / 2) - 3, playerY - 8, 6, 8);
    ctx.fillRect(playerX + (pWidth / 2) - 3, playerY - 8, 6, 8);

    if (this.isGameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#ff5555";
      ctx.font = "bold 18px monospace";
      ctx.textAlign = "center";
      ctx.fillText("[GAME OVER - INTERCEPTION FED]", w / 2, h / 2 - 20);
      ctx.fillStyle = "#ffff55";
      ctx.font = "12px monospace";
      ctx.fillText("Distance : " + this.distance + "m | Score : " + this.score, w / 2, h / 2 + 10);
      ctx.fillStyle = "#55ff55";
      ctx.fillText("Cliquez sur [RECOMMENCER] pour relancer la Civic", w / 2, h / 2 + 35);
      ctx.textAlign = "left";
    }
  }
}

// --------------------------------------------------------------------------
// 2. HAARP IONOSPHERE HACKER (Contrôle d'ondes électromagnétiques)
// --------------------------------------------------------------------------
class HaarpHackerGame {
  constructor(canvasId, statusId) {
    this.canvas = document.getElementById(canvasId);
    this.statusEl = document.getElementById(statusId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.frequency = 3.2; // MHz
    this.targetFreq = 5.8;
    this.power = 40;      // MegaWatts
    this.targetPower = 85;
    this.phase = 45;      // Degrés
    this.targetPhase = 120;
    this.auroraProgress = 0;
    this.isLocked = false;
    this.animationId = null;
  }

  start() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    const loop = () => {
      this.update();
      this.draw();
      this.animationId = requestAnimationFrame(loop);
    };
    this.animationId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  adjustFreq(val) {
    this.frequency = Math.max(1.0, Math.min(10.0, +(this.frequency + val).toFixed(1)));
    if (window.soundEngine) window.soundEngine.beep(400 + this.frequency * 80, 0.05);
  }

  adjustPower(val) {
    this.power = Math.max(10, Math.min(100, this.power + val));
    if (window.soundEngine) window.soundEngine.beep(200 + this.power * 5, 0.05);
  }

  adjustPhase(val) {
    this.phase = (this.phase + val + 360) % 360;
    if (window.soundEngine) window.soundEngine.beep(500, 0.03);
  }

  update() {
    const diffF = Math.abs(this.frequency - this.targetFreq);
    const diffP = Math.abs(this.power - this.targetPower);
    const diffPh = Math.abs(this.phase - this.targetPhase);

    if (diffF < 0.3 && diffP < 8 && diffPh < 15) {
      this.auroraProgress = Math.min(100, this.auroraProgress + 0.4);
      if (this.auroraProgress >= 100 && !this.isLocked) {
        this.isLocked = true;
        if (window.soundEngine) window.soundEngine.playHolyMiracle();
        if (this.statusEl) this.statusEl.textContent = "SYNTONISATION PARFAITE ! L'AURORE BORÉALE ARTIFICIELLE BROUILLE LA CIA !";
      }
    } else {
      this.auroraProgress = Math.max(0, this.auroraProgress - 0.2);
    }

    if (this.statusEl && !this.isLocked) {
      this.statusEl.textContent = "FREQ: " + this.frequency + " MHz (CIBLE: " + this.targetFreq + ") | PUISSANCE: " + this.power + " MW | PHASE: " + this.phase + " deg | AURORE: " + Math.floor(this.auroraProgress) + "%";
    }
  }

  draw() {
    if (!this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    ctx.fillStyle = "#000804";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(0, 255, 100, 0.15)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    if (this.auroraProgress > 5) {
      const alpha = this.auroraProgress / 100;
      const grad = ctx.createLinearGradient(0, 0, 0, h * 0.4);
      grad.addColorStop(0, "rgba(0, 255, 180, " + (alpha * 0.6) + ")");
      grad.addColorStop(0.5, "rgba(180, 0, 255, " + (alpha * 0.4) + ")");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h * 0.45);
    }

    ctx.strokeStyle = "#555555";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const rad = (x * 0.03 * (this.targetFreq / 2)) + (this.targetPhase * Math.PI / 180);
      const y = (h * 0.6) + Math.sin(rad) * (this.targetPower * 0.6);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = "#55ff55";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const rad = (x * 0.03 * (this.frequency / 2)) + (this.phase * Math.PI / 180) + (Date.now() * 0.005);
      const y = (h * 0.6) + Math.sin(rad) * (this.power * 0.6);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    for (let i = 0; i < 12; i++) {
      const ax = 30 + i * (w - 60) / 11;
      const ay = h - 20;
      ctx.strokeStyle = "#ffff55";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax, ay - 25);
      ctx.moveTo(ax - 8, ay - 25);
      ctx.lineTo(ax + 8, ay - 25);
      ctx.stroke();
    }
  }

  randomizeTarget() {
    this.targetFreq = +(Math.random() * 6 + 2).toFixed(1);
    this.targetPower = Math.floor(Math.random() * 60 + 30);
    this.targetPhase = Math.floor(Math.random() * 24) * 15;
    this.auroraProgress = 0;
    this.isLocked = false;
  }
}

// --------------------------------------------------------------------------
// 3. FAT32 HEX SECTOR RECOVERY (Forensics / Puzzle Hexadécimal)
// --------------------------------------------------------------------------
class HexRecoveryGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.correctByte = "43"; // 'C'
    this.currentVal = "00";
    this.sectors = [
      { addr: "0x0000", hex: ["EB", "58", "90", "4D", "53", "44", "4F", "53"], ascii: "MSDOS5.0" },
      { addr: "0x0008", hex: ["35", "2E", "30", "00", "02", "08", "20", "00"], ascii: "5.0....." },
      { addr: "0x0010", hex: ["02", "00", "00", "00", "??", "49", "41", "5F"], ascii: "..[CORRUPT]" },
      { addr: "0x0018", hex: ["4B", "45", "52", "4E", "45", "4C", "2E", "48"], ascii: "KERNEL.H" },
      { addr: "0x0020", hex: ["43", "00", "00", "64", "00", "00", "FF", "FF"], ascii: "C..d...." }
    ];
    this.solved = false;
    this.render();
  }

  setByte(val) {
    this.currentVal = val.toUpperCase();
    if (this.currentVal === this.correctByte) {
      this.solved = true;
      this.sectors[2].hex[4] = "43";
      this.sectors[2].ascii = "....CIA_";
      if (window.soundEngine) window.soundEngine.playHolyMiracle();
    } else {
      if (window.soundEngine) window.soundEngine.beep(200, 0.1);
    }
    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div style="background:#000; color:#55ff55; font-family:monospace; font-size:12px; padding:10px; border:1px solid #444;">
        <div style="color:#ffff55; margin-bottom:8px; font-weight:bold;">
          [FAT32 DISK RECOVERY] - SECTEUR 0 KERNEL RING-0
        </div>
        <div style="color:#aaa; font-size:11px; margin-bottom:10px;">
          Le pointeur de table d'allocation est corrompu à l'offset 0x0014. Trouvez le code HEX valide pour restaurer la chaîne ASCII 'CIA_KERNEL.HC'.
        </div>
        <table style="width:100%; border-collapse:collapse; margin-bottom:12px; font-size:11px;">
          <tr style="color:#ffff55; border-bottom:1px solid #333;">
            <th style="text-align:left; padding:4px;">OFFSET</th>
            <th style="text-align:left; padding:4px;">HEX DUMP (8 OCTETS)</th>
            <th style="text-align:left; padding:4px;">ASCII DÉCODÉ</th>
          </tr>
          ${this.sectors.map(s => `
            <tr style="border-bottom:1px solid #222;">
              <td style="color:#55ffff; padding:4px;">${s.addr}</td>
              <td style="padding:4px; letter-spacing:2px;">
                ${s.hex.map(b => b === '??' ? `<span style="background:#ff0000; color:#fff; font-weight:bold; padding:0 2px;">${this.currentVal}</span>` : b).join(' ')}
              </td>
              <td style="color:#ffffaa; padding:4px;">${s.ascii}</td>
            </tr>
          `).join('')}
        </table>

        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-bottom:10px;">
          <span style="color:#fff;">INJECTER OCTET :</span>
          <button class="action-btn" onclick="desktop.games.hexRecovery.setByte('41')">0x41 ('A')</button>
          <button class="action-btn" onclick="desktop.games.hexRecovery.setByte('42')">0x42 ('B')</button>
          <button class="action-btn" onclick="desktop.games.hexRecovery.setByte('43')">0x43 ('C')</button>
          <button class="action-btn" onclick="desktop.games.hexRecovery.setByte('44')">0x44 ('D')</button>
          <button class="action-btn" onclick="desktop.games.hexRecovery.setByte('58')">0x58 ('X')</button>
          <button class="action-btn" onclick="desktop.games.hexRecovery.setByte('00')">0x00 (NULL)</button>
        </div>

        <div style="padding:8px; background:${this.solved ? '#003300' : '#111'}; border:1px solid ${this.solved ? '#55ff55' : '#333'};">
          <span style="color:${this.solved ? '#55ff55' : '#ffff55'}; font-weight:bold;">
            ${this.solved ? '[SUCCÈS] KERNEL RING-0 RESTAURÉ ! CLUSTER LINKÉ AVEC SUCCÈS.' : '[EN ATTENTE DE CORRECTION DU SECTEUR]'}
          </span>
        </div>
      </div>
    `;
  }
}

// --------------------------------------------------------------------------
// 4. DENVER AIRPORT SUB-LEVEL 7 : DUNGEON 3D CRAWLER
// --------------------------------------------------------------------------
class DenverDungeonGame {
  constructor(canvasId, statusId) {
    this.canvas = document.getElementById(canvasId);
    this.statusEl = document.getElementById(statusId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.map = [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 3, 1],
      [1, 0, 1, 0, 1, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 2, 1],
      [1, 0, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ];

    this.px = 1;
    this.py = 1;
    this.dir = 0; // 0: Est, 1: Sud, 2: Ouest, 3: Nord
    this.hasKey = false;
    this.escaped = false;

    this.initEvents();
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      if (!this.canvas || this.canvas.offsetParent === null) return;
      if (e.key === 'ArrowLeft' || e.key === 'q' || e.key === 'Q') this.turnLeft();
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.turnRight();
      if (e.key === 'ArrowUp' || e.key === 'z' || e.key === 'Z') this.moveForward();
    });
  }

  turnLeft() {
    this.dir = (this.dir + 3) % 4;
    if (window.soundEngine) window.soundEngine.playClick();
    this.render();
  }

  turnRight() {
    this.dir = (this.dir + 1) % 4;
    if (window.soundEngine) window.soundEngine.playClick();
    this.render();
  }

  moveForward() {
    const dx = [1, 0, -1, 0][this.dir];
    const dy = [0, 1, 0, -1][this.dir];
    const nx = this.px + dx;
    const ny = this.py + dy;

    if (this.map[ny] && this.map[ny][nx] !== 1) {
      this.px = nx;
      this.py = ny;
      if (this.map[ny][nx] === 2) {
        this.hasKey = true;
        this.map[ny][nx] = 0;
        if (window.soundEngine) window.soundEngine.playCoin();
      }
      if (this.map[ny][nx] === 3) {
        if (this.hasKey) {
          this.escaped = true;
          if (window.soundEngine) window.soundEngine.playHolyMiracle();
        }
      }
      if (window.soundEngine) window.soundEngine.beep(150, 0.05);
      this.render();
    } else {
      if (window.soundEngine) window.soundEngine.beep(80, 0.1);
    }
  }

  render() {
    if (!this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    ctx.fillStyle = "#110022";
    ctx.fillRect(0, 0, w, h / 2);
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, h / 2, w, h / 2);

    ctx.strokeStyle = "#552288";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(w / 2, h / 2);
    ctx.moveTo(w, 0); ctx.lineTo(w / 2, h / 2);
    ctx.moveTo(0, h); ctx.lineTo(w / 2, h / 2);
    ctx.moveTo(w, h); ctx.lineTo(w / 2, h / 2);
    ctx.stroke();

    const dx = [1, 0, -1, 0][this.dir];
    const dy = [0, 1, 0, -1][this.dir];
    const front1 = (this.map[this.py + dy] && this.map[this.py + dy][this.px + dx]);
    const front2 = (this.map[this.py + (dy*2)] && this.map[this.py + (dy*2)][this.px + (dx*2)]);

    if (front2 === 1) {
      ctx.fillStyle = "#331144";
      ctx.fillRect(w * 0.35, h * 0.35, w * 0.3, h * 0.3);
      ctx.strokeStyle = "#aa44ff";
      ctx.strokeRect(w * 0.35, h * 0.35, w * 0.3, h * 0.3);
    }

    if (front1 === 1) {
      ctx.fillStyle = "#551166";
      ctx.fillRect(w * 0.15, h * 0.15, w * 0.7, h * 0.7);
      ctx.strokeStyle = "#ff55ff";
      ctx.lineWidth = 2;
      ctx.strokeRect(w * 0.15, h * 0.15, w * 0.7, h * 0.7);

      ctx.fillStyle = "#ffff55";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("[MUR EN BETON ARME]", w / 2, h / 2);
      ctx.textAlign = "left";
    }

    if (front1 === 2) {
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(w / 2 - 15, h / 2, 30, 15);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px monospace";
      ctx.fillText("KEY", w / 2 - 10, h / 2 + 11);
    }

    if (front1 === 3) {
      ctx.fillStyle = "#ffff55";
      ctx.fillRect(w * 0.25, h * 0.25, w * 0.5, h * 0.5);
      ctx.fillStyle = "#000";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText(this.hasKey ? "[SORTIE DEVERROUILLEE]" : "[PORTE S-7 : REQUIERT CLE]", w / 2, h / 2);
      ctx.textAlign = "left";
    }

    const dirNames = ["EST", "SUD", "OUEST", "NORD"];
    ctx.fillStyle = "#55ff55";
    ctx.font = "bold 11px monospace";
    ctx.fillText("COORD: (" + this.px + ", " + this.py + ") | CAP: [" + dirNames[this.dir] + "] | CLE ROUGE: " + (this.hasKey ? '[POSSEDEE]' : '[MANQUANTE]'), 10, 20);

    if (this.escaped) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#55ff55";
      ctx.font = "bold 18px monospace";
      ctx.textAlign = "center";
      ctx.fillText("[EVASION DU SOUS-SOL 7 REUSSIE !]", w / 2, h / 2);
      ctx.textAlign = "left";
    }

    if (this.statusEl) {
      this.statusEl.textContent = this.escaped ? "VICTOIRE : VOUS AVEZ FUI LE SOUS-SOL DE DENVER !" : "EXPLORATION CASE PAR CASE : UTILISEZ LES TOUCHES OU LES BOUTONS CI-DESSOUS";
    }
  }
}

// --------------------------------------------------------------------------
// 5. UVB-76 NUMBERS STATION (Décodeur d'Ondes Courtes 4625 kHz)
// --------------------------------------------------------------------------
class NumbersStationGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.freq = 4625;
    this.isBuzzerActive = false;
    this.buzzerInterval = null;
    this.decodedWord = "TERRY";
    this.solved = false;
    this.render();
  }

  toggleBuzzer() {
    this.isBuzzerActive = !this.isBuzzerActive;
    if (this.isBuzzerActive) {
      this.buzzerInterval = setInterval(() => {
        if (window.soundEngine) {
          window.soundEngine.beep(460, 0.12, 'sawtooth');
        }
      }, 1200);
    } else {
      if (this.buzzerInterval) clearInterval(this.buzzerInterval);
    }
    this.render();
  }

  solveCode(input) {
    if (input && input.toUpperCase().trim() === this.decodedWord) {
      this.solved = true;
      if (window.soundEngine) window.soundEngine.playHolyMiracle();
    } else {
      if (window.soundEngine) window.soundEngine.playExplosion();
    }
    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div style="background:#000; color:#ffff55; font-family:monospace; padding:10px; border:1px solid #444;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px solid #333; padding-bottom:4px;">
          <span style="font-weight:bold;">[RECEPTEUR RADIO ONDES COURTES : UVB-76]</span>
          <span style="color:#55ff55;">${this.freq} kHz USB</span>
        </div>

        <div style="display:flex; gap:10px; align-items:center; margin-bottom:10px;">
          <button class="action-btn" onclick="desktop.games.numbersStation.toggleBuzzer()">
            ${this.isBuzzerActive ? '[ARRETER LE BUZZER]' : '[ACTIVER LE BUZZER 4625 kHz]'}
          </button>
          <span style="font-size:11px; color:${this.isBuzzerActive ? '#55ff55' : '#888'};">
            ${this.isBuzzerActive ? 'SIGNAL AUDIBLE ACTIF (460 Hz PULSE)' : 'SIGNAL EN VEILLE'}
          </span>
        </div>

        <div style="background:#0a0a0a; border:1px solid #333; padding:8px; margin-bottom:10px; font-size:11px;">
          <div style="color:#aaa; margin-bottom:4px;">MESSAGE CRYPTE INTERCEPTE DEPUIS POVAROVO :</div>
          <div style="color:#55ffff; font-size:14px; font-weight:bold; letter-spacing:2px; margin-bottom:6px;">
            MDZhB 76 82 45 19 03 BRAVO ROMEO TANGO
          </div>
          <div style="color:#aaa;">GRILLE DU CARNET A USAGE UNIQUE (OTP KEY) :</div>
          <div style="color:#ffaa55; font-size:12px; letter-spacing:2px;">
            MASQUE CLEF : 50 20 10 01 (SOUSTRACTION MODULO 26)
          </div>
          <div style="color:#888; font-size:10px; margin-top:4px;">
            Indice : Le mot decode est le prenom du prophete du Ring-0.
          </div>
        </div>

        <div style="display:flex; gap:6px; margin-bottom:8px;">
          <input type="text" id="otp-input" placeholder="Entrez le mot decode..." style="flex:1; background:#111; color:#fff; border:1px solid #555; padding:4px 8px; font-family:monospace;">
          <button class="action-btn" onclick="desktop.games.numbersStation.solveCode(document.getElementById('otp-input').value)">DECODER</button>
        </div>

        <div style="padding:6px; background:${this.solved ? '#003300' : '#111'}; border:1px solid ${this.solved ? '#55ff55' : '#444'};">
          <span style="color:${this.solved ? '#55ff55' : '#ffffaa'}; font-size:11px; font-weight:bold;">
            ${this.solved ? '[SUCCES] TRANSMISSION CONFIRMEE : ORDRE D EMANCIPATION RECU !' : '[EN ATTENTE DU DECODAGE OTP]'}
          </span>
        </div>
      </div>
    `;
  }
}

// --------------------------------------------------------------------------
// 6. HOLY CRUSADE : MINI ROGUELIKE DECK-BUILDER 3x3
// --------------------------------------------------------------------------
class HolyCrusadeGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.board = Array(9).fill(null);
    this.playerHand = [
      { name: "Moine Hacker", power: 4 },
      { name: "Ligne 2600Hz", power: 3 },
      { name: "Sceau Divin", power: 6 }
    ];
    this.playerScore = 0;
    this.enemyScore = 0;
    this.render();
  }

  playCard(cardIdx, cellIdx) {
    if (this.board[cellIdx] !== null) return;
    const card = this.playerHand[cardIdx];
    if (!card) return;

    this.board[cellIdx] = { owner: 'player', name: card.name, power: card.power };
    this.playerHand.splice(cardIdx, 1);
    if (window.soundEngine) window.soundEngine.playClick();

    setTimeout(() => this.enemyTurn(), 400);
    this.render();
  }

  enemyTurn() {
    const emptyCells = this.board.map((c, i) => c === null ? i : null).filter(i => i !== null);
    if (emptyCells.length === 0) {
      this.evaluateGame();
      return;
    }
    const pick = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const enemyPowers = [3, 4, 5];
    const p = enemyPowers[Math.floor(Math.random() * enemyPowers.length)];
    this.board[pick] = { owner: 'enemy', name: "Agent CIA", power: p };
    if (window.soundEngine) window.soundEngine.beep(250, 0.08);

    if (this.board.every(c => c !== null)) {
      this.evaluateGame();
    }
    this.render();
  }

  evaluateGame() {
    let pSum = 0;
    let eSum = 0;
    this.board.forEach(c => {
      if (c && c.owner === 'player') pSum += c.power;
      if (c && c.owner === 'enemy') eSum += c.power;
    });
    this.playerScore = pSum;
    this.enemyScore = eSum;
    if (pSum > eSum && window.soundEngine) window.soundEngine.playHolyMiracle();
  }

  reset() {
    this.board = Array(9).fill(null);
    this.playerHand = [
      { name: "Moine Hacker", power: 4 },
      { name: "Ligne 2600Hz", power: 3 },
      { name: "Sceau Divin", power: 6 }
    ];
    this.playerScore = 0;
    this.enemyScore = 0;
    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div style="background:#000; color:#fff; font-family:monospace; padding:10px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span style="color:#55ff55; font-weight:bold;">[TACTIQUE DU RING-0 : 3x3 CRUSADE]</span>
          <span style="color:#ffff55;">JOUEUR: ${this.playerScore} vs FEDS: ${this.enemyScore}</span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; width:270px; margin:0 auto 12px;">
          ${this.board.map((cell, idx) => `
            <div style="height:70px; background:${cell ? (cell.owner === 'player' ? '#003300' : '#330000') : '#111'}; border:2px solid ${cell ? (cell.owner === 'player' ? '#55ff55' : '#ff5555') : '#444'}; display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:10px; cursor:pointer;" onclick="desktop.games.holyCrusade.playCard(0, ${idx})">
              ${cell ? `
                <div style="font-weight:bold; color:#fff;">${cell.name}</div>
                <div style="color:#ffff55; font-size:13px; font-weight:bold;">${cell.power} PWR</div>
              ` : `<span style="color:#555;">[CASE ${idx+1}]</span>`}
            </div>
          `).join('')}
        </div>

        <div style="font-size:11px; color:#aaa; margin-bottom:4px;">VOTRE MAIN DE CARTES TACTIQUES :</div>
        <div style="display:flex; gap:8px; justify-content:center; margin-bottom:10px;">
          ${this.playerHand.map((c, i) => `
            <div style="background:#1a1a1a; border:1px solid #55ff55; padding:6px 10px; font-size:11px; text-align:center;">
              <div style="color:#fff; font-weight:bold;">${c.name}</div>
              <div style="color:#ffff55;">${c.power} PUISSANCE</div>
            </div>
          `).join('')}
        </div>

        <div style="text-align:center;">
          <button class="action-btn" onclick="desktop.games.holyCrusade.reset()">[NOUVELLE MANCHE]</button>
        </div>
      </div>
    `;
  }
}

// --------------------------------------------------------------------------
// 7. CRISPR SYNTHETIC GENE LAB (Alignement ADN & Mutations)
// --------------------------------------------------------------------------
class CrisprLabGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.targetDna = ["A", "T", "G", "C", "A", "A", "T", "G"];
    this.currentDna = ["A", "A", "G", "C", "T", "A", "C", "G"];
    this.bases = ["A", "T", "C", "G"];
    this.isMutated = false;
    this.render();
  }

  mutate(idx) {
    const curr = this.currentDna[idx];
    const nextIdx = (this.bases.indexOf(curr) + 1) % 4;
    this.currentDna[idx] = this.bases[nextIdx];
    if (window.soundEngine) window.soundEngine.playClick();

    if (this.currentDna.every((b, i) => b === this.targetDna[i])) {
      this.isMutated = true;
      if (window.soundEngine) window.soundEngine.playHolyMiracle();
    }
    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div style="background:#000; color:#55ff55; font-family:monospace; padding:10px;">
        <div style="color:#55ffff; font-weight:bold; margin-bottom:6px;">
          [CRISPR LAB : SYNTHESE DU BRIN D ADN ANTI-FLUOR]
        </div>
        <div style="color:#aaa; font-size:11px; margin-bottom:10px;">
          Alignez chaque paire de nucleotides avec le brin matrice divin pour inoculer l immunite biologique.
        </div>

        <div style="background:#0a0a0a; border:1px solid #333; padding:8px; margin-bottom:10px;">
          <div style="color:#ffffaa; font-size:11px; margin-bottom:4px;">BRIN MATRICE CIBLE :</div>
          <div style="display:flex; gap:6px; font-weight:bold; font-size:14px; letter-spacing:2px; color:#ffff55;">
            ${this.targetDna.map(b => `<div style="width:24px; text-align:center; background:#111; border:1px solid #444;">${b}</div>`).join('')}
          </div>
        </div>

        <div style="background:#0a0a0a; border:1px solid #333; padding:8px; margin-bottom:10px;">
          <div style="color:#55ff55; font-size:11px; margin-bottom:4px;">VOTRE SEQUENCE SYNTHETISEE (CLIQUEZ POUR MUTER A->T->C->G) :</div>
          <div style="display:flex; gap:6px; font-weight:bold; font-size:14px; letter-spacing:2px;">
            ${this.currentDna.map((b, i) => `
              <div class="clickable" style="width:24px; text-align:center; background:${b === this.targetDna[i] ? '#003300' : '#330000'}; border:1px solid ${b === this.targetDna[i] ? '#55ff55' : '#ff5555'}; color:#fff; cursor:pointer;" onclick="desktop.games.crisprLab.mutate(${i})">
                ${b}
              </div>
            `).join('')}
          </div>
        </div>

        <div style="padding:6px; background:${this.isMutated ? '#003300' : '#111'}; border:1px solid ${this.isMutated ? '#55ff55' : '#444'}; text-align:center;">
          <span style="color:${this.isMutated ? '#55ff55' : '#aaa'}; font-weight:bold; font-size:11px;">
            ${this.isMutated ? '[SUCCES] SEQUENCE GENETIQUE STABILISEE ! IMMUNITE CIVILE CONFEREE.' : '[EN COURS DE SYNTHESE ADN]'}
          </span>
        </div>
      </div>
    `;
  }
}

// Exports
window.CivicEscapeGame = CivicEscapeGame;
window.HaarpHackerGame = HaarpHackerGame;
window.HexRecoveryGame = HexRecoveryGame;
window.DenverDungeonGame = DenverDungeonGame;
window.NumbersStationGame = NumbersStationGame;
window.HolyCrusadeGame = HolyCrusadeGame;
window.CrisprLabGame = CrisprLabGame;
