// ==========================================================================
// CATÉGORIE 7 : NOUVEL ORDRE MONDIAL & JEUX ILLUMINATI (TEMPLEOS V4.0)
// 1. Pyramid Run (Le Temple Perdu d'Horus)
// 2. Secret Society Clicker (NWO Tycoon)
// 3. Le Décrypteur Illuminati (César, Atbash, Templiers)
// 4. Whack-a-Reptilian (La Chèvre de Denver)
// 5. Tri-Pong Illuminati (Pong Triangulaire Sacré)
// ==========================================================================

// --------------------------------------------------------------------------
// 1. PYRAMID RUN (LE TEMPLE PERDU D'HORUS)
// Vertical runner rétro : pilotez la pyramide pour esquiver satellites & lasers
// --------------------------------------------------------------------------
class PyramidRunGame {
  constructor(canvasId, scoreId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.scoreEl = document.getElementById(scoreId);

    this.width = this.canvas.width = 340;
    this.height = this.canvas.height = 360;

    this.playerX = this.width / 2;
    this.playerY = this.height - 45;
    this.playerW = 26;
    this.playerH = 26;
    this.speed = 4.5;

    this.obstacles = [];
    this.score = 0;
    this.altitude = 0;
    this.isRunning = false;
    this.animId = null;

    this.keys = {};
    this.initEvents();
    this.reset();
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(e.code)) {
        this.keys[e.code] = true;
      }
    });
    window.addEventListener('keyup', (e) => {
      if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(e.code)) {
        this.keys[e.code] = false;
      }
    });
  }

  reset() {
    this.playerX = this.width / 2;
    this.obstacles = [];
    this.score = 0;
    this.altitude = 0;
    this.updateScore();
    this.draw();
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.reset();
      this.loop();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  updateScore() {
    if (this.scoreEl) {
      this.scoreEl.textContent = `ALTITUDE : ${Math.floor(this.altitude)}m | SCORE : ${this.score}`;
    }
  }

  spawnObstacle() {
    const types = [
      { name: 'SATELLITE_ECHELON', icon: '🛰️', w: 24, h: 20, color: '#55ffff' },
      { name: 'BILLET_DOLLAR', icon: '💵', w: 22, h: 16, color: '#55ff55' },
      { name: 'CHOUETTE_BOHEMIAN', icon: '🦉', w: 20, h: 22, color: '#ffff55' },
      { name: 'LASER_5G', icon: '⚡', w: 18, h: 24, color: '#ff5555' }
    ];
    const type = types[Math.floor(Math.random() * types.length)];
    const x = Math.random() * (this.width - 30) + 15;
    this.obstacles.push({
      x,
      y: -25,
      type,
      speed: 2.5 + Math.min(4, this.altitude / 800)
    });
  }

  update() {
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
      this.playerX = Math.max(15, this.playerX - this.speed);
    }
    if (this.keys['ArrowRight'] || this.keys['KeyD']) {
      this.playerX = Math.min(this.width - 15, this.playerX + this.speed);
    }

    this.altitude += 1.2;
    this.score = Math.floor(this.altitude / 10);
    this.updateScore();

    if (Math.random() < 0.045) {
      this.spawnObstacle();
    }

    // Déplacement obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.y += obs.speed;

      // Collision avec la Pyramide sacrée
      const dx = Math.abs(this.playerX - obs.x);
      const dy = Math.abs(this.playerY - obs.y);
      if (dx < 18 && dy < 18) {
        window.soundEngine.playExplosion();
        if (window.speechEngine) window.speechEngine.speak("La pyramide s'est effondrée !");
        this.stop();
        alert(`💥 IMPACT CONSPIRATIONNISTE ! Altitude atteinte : ${Math.floor(this.altitude)}m.`);
        return;
      }

      if (obs.y > this.height + 30) {
        this.obstacles.splice(i, 1);
      }
    }
  }

  draw() {
    // Fond étoilé illuminati
    this.ctx.fillStyle = '#000018';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Lignes de fuite pyramidale
    this.ctx.strokeStyle = '#002233';
    this.ctx.lineWidth = 1;
    for (let x = 0; x <= this.width; x += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x + ((this.altitude * 2) % 30) - 15, this.height);
      this.ctx.stroke();
    }

    // Dessin des obstacles
    this.ctx.font = '16px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    for (const obs of this.obstacles) {
      this.ctx.fillText(obs.type.icon, obs.x, obs.y);
    }

    // Dessin du Joueur (Pyramide d'Or avec l'Œil)
    this.ctx.fillStyle = '#ffff55';
    this.ctx.beginPath();
    this.ctx.moveTo(this.playerX, this.playerY - 16);
    this.ctx.lineTo(this.playerX - 16, this.playerY + 12);
    this.ctx.lineTo(this.playerX + 16, this.playerY + 12);
    this.ctx.closePath();
    this.ctx.fill();

    // Pierre de faîte flottante
    this.ctx.fillStyle = '#55ff55';
    this.ctx.beginPath();
    this.ctx.moveTo(this.playerX, this.playerY - 22);
    this.ctx.lineTo(this.playerX - 7, this.playerY - 12);
    this.ctx.lineTo(this.playerX + 7, this.playerY - 12);
    this.ctx.closePath();
    this.ctx.fill();

    // Œil au centre
    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(this.playerX, this.playerY + 2, 4, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#55ffff';
    this.ctx.beginPath();
    this.ctx.arc(this.playerX, this.playerY + 2, 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }
}

// --------------------------------------------------------------------------
// 2. SECRET SOCIETY CLICKER (NWO TYCOON)
// Achetez des Banques Centrales, Médias de Masse et Chemtrails pour contrôler le monde !
// --------------------------------------------------------------------------
class NWOClickerGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.influence = 0;
    this.totalInfluence = 0;
    this.perSec = 0;

    this.upgrades = [
      { id: 'chemtrail', name: 'Flotte de Chemtrails', cost: 15, gen: 1, count: 0, icon: '✈️' },
      { id: 'fluor', name: 'Fluorure dans les Eaux', cost: 80, gen: 6, count: 0, icon: '🧪' },
      { id: 'media', name: 'Monopole Médiatique TV', cost: 350, gen: 25, count: 0, icon: '📺' },
      { id: 'centralbank', name: 'Banque Centrale Privée', cost: 1200, gen: 90, count: 0, icon: '🏛️' },
      { id: 'davos', name: 'Sommet Annuel de Davos', cost: 5000, gen: 350, count: 0, icon: '🎩' },
      { id: 'reptilian', name: 'Ambassade Reptilienne', cost: 20000, gen: 1500, count: 0, icon: '🦎' }
    ];

    this.init();
    setInterval(() => this.tick(), 1000);
  }

  init() {
    this.render();
  }

  clickGlobe() {
    this.influence += 1;
    this.totalInfluence += 1;
    window.soundEngine.playClick();
    this.render();

    if (this.totalInfluence >= 666 && window.achievementsManager) {
      window.achievementsManager.unlock('nwo_666');
    }
  }

  buyUpgrade(id) {
    const up = this.upgrades.find(u => u.id === id);
    if (!up || this.influence < up.cost) return;

    this.influence -= up.cost;
    up.count++;
    up.cost = Math.floor(up.cost * 1.25);
    this.recalcPerSec();
    window.soundEngine.playTokenDrop();
    this.render();
  }

  recalcPerSec() {
    this.perSec = this.upgrades.reduce((acc, u) => acc + u.count * u.gen, 0);
  }

  tick() {
    if (this.perSec > 0) {
      this.influence += this.perSec;
      this.totalInfluence += this.perSec;
      this.render();
    }
  }

  render() {
    if (!this.container) return;
    const globalPercent = Math.min(100, (this.totalInfluence / 100000) * 100).toFixed(2);

    this.container.innerHTML = `
      <div style="display:flex; gap:12px; height:100%;">
        <!-- Colonne Gauche : Le Globe et l'Oeil -->
        <div style="flex:1; text-align:center; background:#001100; border:1px solid #00aa00; padding:10px;">
          <div style="color:var(--vga-light-green); font-size:11px; font-weight:bold;">CONTRÔLE DU NOUVEL ORDRE MONDIAL</div>
          <div style="font-size:24px; color:var(--vga-yellow); font-weight:bold; margin:6px 0;">${Math.floor(this.influence)} 👁️</div>
          <div style="font-size:11px; color:#aaa; margin-bottom:10px;">+${this.perSec} POUVOIR / SECONDE</div>

          <div class="clickable" style="width:90px; height:90px; margin:0 auto; border-radius:50%; background:#003300; border:3px solid #55ff55; display:flex; align-items:center; justify-content:center; font-size:42px; cursor:pointer; box-shadow:0 0 15px rgba(85,255,85,0.4);" onclick="desktop.games.nwoClicker.clickGlobe()">
            👁️
          </div>
          <div style="font-size:10px; color:#ffff55; margin-top:6px;">CLIQUEZ POUR ASSERVIR</div>

          <div style="margin-top:12px; text-align:left;">
            <div style="display:flex; justify-content:space-between; font-size:10px; color:#88ff88;">
              <span>POPULATION DOMINÉE :</span>
              <span>${globalPercent}%</span>
            </div>
            <div style="background:#000; border:1px solid #444; height:10px; margin-top:3px;">
              <div style="background:#55ff55; height:100%; width:${globalPercent}%;"></div>
            </div>
          </div>
        </div>

        <!-- Colonne Droite : Les conspirations achetables -->
        <div style="flex:1.4; display:flex; flex-direction:column; gap:6px; max-height:330px; overflow-y:auto; padding-right:4px;">
          ${this.upgrades.map(u => `
            <div style="background:#000; border:1px solid ${this.influence >= u.cost ? '#55ff55' : '#444'}; padding:5px 8px; display:flex; align-items:center; gap:8px;">
              <span style="font-size:20px;">${u.icon}</span>
              <div style="flex:1;">
                <div style="color:var(--vga-white); font-size:11px; font-weight:bold;">${u.name} (x${u.count})</div>
                <div style="color:var(--vga-light-green); font-size:10px;">+${u.gen}/s | Coût: ${u.cost} 👁️</div>
              </div>
              <button class="temple-btn ${this.influence >= u.cost ? 'primary' : ''}" style="padding:2px 8px; font-size:10px;" onclick="desktop.games.nwoClicker.buyUpgrade('${u.id}')" ${this.influence < u.cost ? 'disabled' : ''}>
                ACHETER
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

// --------------------------------------------------------------------------
// 3. LE DÉCRYPTEUR ILLUMINATI
// Cassez les codes chiffrés des sociétés secrètes (César / Atbash / Templiers)
// --------------------------------------------------------------------------
class IlluminatiDecryptGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.secretMessages = [
      { plain: "NOVUS ORDO SECLORUM", cipher: "QRYXV RUGU VHOXUXP", shift: 3, hint: "Chiffre de César (+3)" },
      { plain: "ANNUIT COEPTIS", cipher: "DQQXLW FRHSWLV", shift: 3, hint: "Chiffre de César (+3)" },
      { plain: "BOHEMIAN GROVE 1993", cipher: "ERKHPLDQ JURYH 1993", shift: 3, hint: "Chiffre de César (+3)" },
      { plain: "DENVER AIRPORT UNDERGROUND", cipher: "GHNYHU DLUSRUW XQGHUjurxqg", shift: 3, hint: "Chiffre de César (+3)" },
      { plain: "TERRY DAVIS RING ZERO", cipher: "WHUUB GDYLV ULQJ CHUR", shift: 3, hint: "Code Sacré (+3)" }
    ];
    this.currentIndex = 0;
    this.score = 0;
    this.init();
  }

  init() {
    this.currentIndex = Math.floor(Math.random() * this.secretMessages.length);
    this.render();
  }

  checkAnswer() {
    const input = document.getElementById('decrypt-input');
    const msg = document.getElementById('decrypt-status');
    if (!input || !msg) return;

    const val = input.value.trim().toUpperCase();
    const current = this.secretMessages[this.currentIndex];

    if (val === current.plain) {
      this.score += 100;
      window.soundEngine.playVictory();
      msg.textContent = `✅ CODE CASSÉ AVEC SUCCÈS ! +100 PTS MAÇONNIQUES !`;
      msg.style.color = "var(--vga-light-green)";
      setTimeout(() => this.init(), 1500);
    } else {
      window.soundEngine.beep(200, 0.15, 'sawtooth');
      msg.textContent = `❌ CODE INCORRECT ! LA SOCIÉTÉ SECRÈTE VOUS OBSERVE !`;
      msg.style.color = "var(--vga-light-red)";
    }
  }

  render() {
    if (!this.container) return;
    const current = this.secretMessages[this.currentIndex];

    this.container.innerHTML = `
      <div style="text-align:center; padding:10px;">
        <div style="color:var(--vga-yellow); font-weight:bold; font-size:13px; margin-bottom:6px;">
          INTERCEPTION DE TÉLÉGRAMME SECRET DU BILDERBERG
        </div>
        <div style="color:#aaa; font-size:11px; margin-bottom:12px;">DÉCHIFFREZ LE MESSAGE TRANSMIS PAR SATELLITE MILITAIRE</div>

        <div style="background:#001100; border:2px dashed #00aa00; padding:12px; margin:10px auto; max-width:380px; font-family:monospace; font-size:16px; color:#55ff55; letter-spacing:2px;">
          ${current.cipher}
        </div>

        <div style="font-size:11px; color:#55ffff; margin-bottom:10px;">INDICE SÉCURISÉ : ${current.hint}</div>

        <div style="margin:12px 0;">
          <input type="text" id="decrypt-input" placeholder="TAPEZ LE TEXTE DÉCHIFFRÉ..." style="width:280px; font-size:14px; background:#000; color:#ffff55; border:1px solid #777; padding:4px 8px; text-transform:uppercase; text-align:center;">
          <button class="temple-btn primary" onclick="desktop.games.illuminatiDecrypt.checkAnswer()">DÉCRYPTER</button>
        </div>

        <div id="decrypt-status" style="font-size:12px; font-weight:bold; min-height:20px; color:#ffff55;">ENTREZ LA SOLUTION POUR PERCER LE SECRET.</div>
        <div style="color:#888; font-size:11px; margin-top:8px;">SCORE DE DÉCRYPTAGE : ${this.score} PTS</div>
      </div>
    `;

    const inp = document.getElementById('decrypt-input');
    if (inp) {
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.checkAnswer();
      });
    }
  }
}

// --------------------------------------------------------------------------
// 4. WHACK-A-REPTILIAN (LA CHÈVRE DE DENVER)
// Frappez les diplomates reptiliens et les agents fédéraux qui surgissent des trappes !
// --------------------------------------------------------------------------
class WhackReptilianGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.holes = Array(9).fill(false); // 3x3 grille
    this.score = 0;
    this.timeLeft = 30;
    this.timer = null;
    this.spawnTimer = null;
    this.isRunning = false;
    this.init();
  }

  init() {
    this.holes = Array(9).fill(false);
    this.score = 0;
    this.timeLeft = 30;
    this.render();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.score = 0;
    this.timeLeft = 30;

    window.soundEngine.playXFilesTheme();

    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.stop();
        window.soundEngine.playVictory();
        alert(`FIN DE LA CHASSE AUX REPTILIENS ! Score final : ${this.score}`);
      }
      this.render();
    }, 1000);

    this.spawnLoop();
  }

  spawnLoop() {
    if (!this.isRunning) return;
    const holeIdx = Math.floor(Math.random() * 9);
    this.holes[holeIdx] = Math.random() > 0.3 ? '🦎' : '🕴️';
    this.render();

    setTimeout(() => {
      this.holes[holeIdx] = false;
      this.render();
    }, 900);

    const nextDelay = Math.random() * 600 + 400;
    this.spawnTimer = setTimeout(() => this.spawnLoop(), nextDelay);
  }

  hitHole(idx) {
    if (!this.isRunning || !this.holes[idx]) return;

    if (this.holes[idx] === '🦎') {
      this.score += 10;
      window.soundEngine.playReptilianLaser();
    } else {
      this.score += 5;
      window.soundEngine.playPaddleHit();
    }
    this.holes[idx] = false;
    this.render();
  }

  stop() {
    this.isRunning = false;
    if (this.timer) clearInterval(this.timer);
    if (this.spawnTimer) clearTimeout(this.spawnTimer);
    this.holes = Array(9).fill(false);
    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="text-align:center;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-weight:bold; font-size:12px;">
          <span style="color:var(--vga-light-green);">TEMPS RESTANT : ${this.timeLeft}s</span>
          <span style="color:var(--vga-yellow);">REPTILIENS PURIFIÉS : ${this.score}</span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(3, 85px); gap:10px; justify-content:center; margin:12px auto;">
          ${this.holes.map((h, i) => `
            <div class="clickable" style="width:85px; height:85px; background:${h ? '#003300' : '#111'}; border:3px inset ${h ? '#55ff55' : '#444'}; display:flex; align-items:center; justify-content:center; font-size:36px; cursor:pointer;" onclick="desktop.games.whackReptilian.hitHole(${i})">
              ${h || '🕳️'}
            </div>
          `).join('')}
        </div>

        <div style="margin-top:10px;">
          <button class="temple-btn primary" onclick="desktop.games.whackReptilian.start()" ${this.isRunning ? 'disabled' : ''}>
            LANCER LA CHASSE
          </button>
          <button class="temple-btn" onclick="desktop.games.whackReptilian.stop()">ARRÊTER</button>
        </div>
      </div>
    `;
  }
}

// --------------------------------------------------------------------------
// 5. TRI-PONG ILLUMINATI (PONG TRIANGULAIRE SACRÉ)
// Arène triangulaire sacrée à 3 côtés avec rebonds géométriques !
// --------------------------------------------------------------------------
class TriPongGame {
  constructor(canvasId, statusId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.statusEl = document.getElementById(statusId);

    this.width = this.canvas.width = 360;
    this.height = this.canvas.height = 340;

    // Sommets du triangle équilatéral
    this.p1 = { x: 180, y: 30 };
    this.p2 = { x: 30, y: 310 };
    this.p3 = { x: 330, y: 310 };

    // Balle
    this.bx = 180;
    this.by = 200;
    this.vx = 2.5;
    this.vy = -2.5;
    this.radius = 6;

    // Raquette Joueur (sur la base p2-p3)
    this.paddleBottomX = 180;
    this.paddleW = 55;

    // Raquettes IA (sur les côtés inclinés)
    this.paddleLeftT = 0.5; // Entre 0 et 1 sur segment p1-p2
    this.paddleRightT = 0.5; // Entre 0 et 1 sur segment p1-p3

    this.score = 0;
    this.lives = 3;
    this.isRunning = false;
    this.animId = null;

    this.initEvents();
    this.reset();
  }

  initEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      this.paddleBottomX = Math.max(60, Math.min(300, mx));
    });
  }

  reset() {
    this.bx = 180;
    this.by = 200;
    this.vx = (Math.random() > 0.5 ? 2.5 : -2.5);
    this.vy = -2.5;
    this.score = 0;
    this.lives = 3;
    this.updateStatus();
    this.draw();
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

  updateStatus() {
    if (this.statusEl) {
      this.statusEl.textContent = `VIES : ${this.lives} | ÉCHANGES MAÇONNIQUES : ${this.score}`;
    }
  }

  update() {
    this.bx += this.vx;
    this.by += this.vy;

    // IA Raquette Gauche (suit la balle sur le bord p1-p2)
    const targetLeftT = Math.max(0.2, Math.min(0.8, (this.by - 30) / 280));
    this.paddleLeftT += (targetLeftT - this.paddleLeftT) * 0.08;

    // IA Raquette Droite (suit la balle sur le bord p1-p3)
    const targetRightT = Math.max(0.2, Math.min(0.8, (this.by - 30) / 280));
    this.paddleRightT += (targetRightT - this.paddleRightT) * 0.08;

    // Rebond côté gauche (p1 - p2)
    // Droite reliant (180,30) et (30,310) => pente ~ -280/150 = -1.86
    if (this.bx < 180) {
      const edgeX = 180 - ((this.by - 30) / 280) * 150;
      if (this.bx - this.radius <= edgeX) {
        this.vx = Math.abs(this.vx);
        this.score++;
        window.soundEngine.playPaddleHit();
        this.updateStatus();
      }
    }

    // Rebond côté droit (p1 - p3)
    if (this.bx > 180) {
      const edgeX = 180 + ((this.by - 30) / 280) * 150;
      if (this.bx + this.radius >= edgeX) {
        this.vx = -Math.abs(this.vx);
        this.score++;
        window.soundEngine.playPaddleHit();
        this.updateStatus();
      }
    }

    // Rebond sommet
    if (this.by - this.radius <= 35) {
      this.vy = Math.abs(this.vy);
      window.soundEngine.playWallHit();
    }

    // Contact avec la base (Joueur)
    if (this.by + this.radius >= 300 && this.by - this.radius <= 312) {
      if (this.bx >= this.paddleBottomX - this.paddleW / 2 && this.bx <= this.paddleBottomX + this.paddleW / 2) {
        this.vy = -Math.abs(this.vy);
        this.score += 2;
        window.soundEngine.playPaddleHit();
        this.updateStatus();
      }
    }

    // Balle perdue en bas
    if (this.by > 320) {
      this.lives--;
      window.soundEngine.playDefeat();
      this.updateStatus();
      if (this.lives <= 0) {
        this.stop();
        alert(`Fin de partie dans le Temple ! Échanges réussis : ${this.score}`);
        this.reset();
      } else {
        this.bx = 180;
        this.by = 180;
        this.vy = -2.5;
      }
    }
  }

  draw() {
    this.ctx.fillStyle = '#000022';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Dessin du Triangle Sacré
    this.ctx.strokeStyle = '#ffff55';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(this.p1.x, this.p1.y);
    this.ctx.lineTo(this.p2.x, this.p2.y);
    this.ctx.lineTo(this.p3.x, this.p3.y);
    this.ctx.closePath();
    this.ctx.stroke();

    // Œil en filigrane au centre
    this.ctx.strokeStyle = 'rgba(85, 255, 85, 0.2)';
    this.ctx.beginPath();
    this.ctx.arc(180, 190, 30, 0, Math.PI * 2);
    this.ctx.stroke();

    // Raquette Joueur (Base)
    this.ctx.fillStyle = '#55ff55';
    this.ctx.fillRect(this.paddleBottomX - this.paddleW / 2, 306, this.paddleW, 8);

    // Balle en or avec lueur
    this.ctx.fillStyle = '#ffff55';
    this.ctx.beginPath();
    this.ctx.arc(this.bx, this.by, this.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }
}

window.PyramidRunGame = PyramidRunGame;
window.NWOClickerGame = NWOClickerGame;
window.IlluminatiDecryptGame = IlluminatiDecryptGame;
window.WhackReptilianGame = WhackReptilianGame;
window.TriPongGame = TriPongGame;
