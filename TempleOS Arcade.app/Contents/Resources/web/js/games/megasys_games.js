// ==========================================================================
// TEMPLEOS MEGASYS EXPANSION PACK (3 NOUVEAUX JEUX RETRO-CONSPIRATIONNISTES)
// 1. Area 51 Stealth Infiltration (Jeu d'infiltration 2D vue du dessus)
// 2. CERN Particle Smasher (Accélérateur de Hadrons & Chasse au Boson)
// 3. Cyber-Phreaking & BBS Terminal (Hacking 80s, Blue Box 2600Hz & ARPANET)
// ==========================================================================

// --------------------------------------------------------------------------
// 1. AREA 51 STEALTH INFILTRATION (HANGAR S-4)
// --------------------------------------------------------------------------
class Area51Game {
  constructor(canvasId, statusId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.statusEl = document.getElementById(statusId);

    this.width = this.canvas.width = 460;
    this.height = this.canvas.height = 320;

    this.isRunning = false;
    this.animId = null;
    this.keys = {};

    this.reset();
    this.initEvents();
    this.render();
  }

  reset() {
    this.player = { x: 30, y: 30, size: 14, speed: 2.5 };
    this.alien = { x: 410, y: 280, rescued: false };
    this.keycard = { x: 230, y: 40, collected: false };
    this.disks = [
      { x: 30, y: 270, collected: false },
      { x: 230, y: 270, collected: false },
      { x: 410, y: 40, collected: false }
    ];

    // Murs du complexe bunker S-4
    this.walls = [
      { x: 80, y: 0, w: 12, h: 220 },
      { x: 160, y: 90, w: 12, h: 230 },
      { x: 280, y: 0, w: 12, h: 220 },
      { x: 350, y: 90, w: 12, h: 230 }
    ];

    // Lasers de sécurité qui s'allument et s'éteignent
    this.lasers = [
      { x: 92, y: 150, w: 68, h: 6, active: true, timer: 0 },
      { x: 292, y: 150, w: 58, h: 6, active: true, timer: 40 }
    ];

    // Gardes Feds en costume noir avec cône de vision
    this.guards = [
      { x: 120, y: 60, dir: 1, range: [40, 260], speed: 1.8, angle: Math.PI / 2 },
      { x: 220, y: 240, dir: -1, range: [40, 260], speed: 2.0, angle: -Math.PI / 2 },
      { x: 315, y: 70, dir: 1, range: [50, 250], speed: 1.9, angle: Math.PI / 2 }
    ];

    this.alarm = false;
    this.victory = false;
    this.score = 0;
    this.updateStatus("INFILTRATION DU HANGAR S-4 : Évitez les cônes de vision des Feds !");
  }

  initEvents() {
    window.addEventListener("keydown", (e) => {
      const k = e.key.toLowerCase();
      if (["w","z","arrowup"].includes(k)) this.keys["up"] = true;
      if (["s","arrowdown"].includes(k)) this.keys["down"] = true;
      if (["a","q","arrowleft"].includes(k)) this.keys["left"] = true;
      if (["d","arrowright"].includes(k)) this.keys["right"] = true;
    });

    window.addEventListener("keyup", (e) => {
      const k = e.key.toLowerCase();
      if (["w","z","arrowup"].includes(k)) this.keys["up"] = false;
      if (["s","arrowdown"].includes(k)) this.keys["down"] = false;
      if (["a","q","arrowleft"].includes(k)) this.keys["left"] = false;
      if (["d","arrowright"].includes(k)) this.keys["right"] = false;
    });

    if (this.canvas) {
      this.canvas.addEventListener("click", () => {
        if (!this.isRunning && !this.victory) this.start();
      });
    }
  }

  updateStatus(msg) {
    if (this.statusEl) this.statusEl.textContent = msg;
  }

  start() {
    if (this.animId) cancelAnimationFrame(this.animId);
    this.isRunning = true;
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  update() {
    if (this.victory || !this.isRunning) return;

    // Déplacement joueur
    let nx = this.player.x;
    let ny = this.player.y;
    if (this.keys["up"]) ny -= this.player.speed;
    if (this.keys["down"]) ny += this.player.speed;
    if (this.keys["left"]) nx -= this.player.speed;
    if (this.keys["right"]) nx += this.player.speed;

    // Collisions avec les bords
    nx = Math.max(10, Math.min(this.width - 10, nx));
    ny = Math.max(10, Math.min(this.height - 10, ny));

    // Collisions avec les murs
    let collide = false;
    for (const w of this.walls) {
      if (nx + this.player.size / 2 > w.x && nx - this.player.size / 2 < w.x + w.w &&
          ny + this.player.size / 2 > w.y && ny - this.player.size / 2 < w.y + w.h) {
        collide = true;
        break;
      }
    }
    if (!collide) {
      this.player.x = nx;
      this.player.y = ny;
    }

    // Gestion des lasers
    this.lasers.forEach(las => {
      las.timer = (las.timer + 1) % 90;
      las.active = las.timer < 55;

      if (las.active) {
        if (this.player.x + this.player.size / 2 > las.x && this.player.x - this.player.size / 2 < las.x + las.w &&
            this.player.y + this.player.size / 2 > las.y && this.player.y - this.player.size / 2 < las.y + las.h) {
          this.triggerAlarm("ALERTE LASER : Détection thermique par le faisceau !");
        }
      }
    });

    // Déplacement des gardes
    this.guards.forEach(g => {
      g.y += g.dir * g.speed;
      if (g.y < g.range[0]) { g.y = g.range[0]; g.dir = 1; g.angle = Math.PI / 2; }
      if (g.y > g.range[1]) { g.y = g.range[1]; g.dir = -1; g.angle = -Math.PI / 2; }

      // Cône de vision (FOV 60° et distance 75px)
      const dx = this.player.x - g.x;
      const dy = this.player.y - g.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 80) {
        const angleToPlayer = Math.atan2(dy, dx);
        let diff = Math.abs(angleToPlayer - g.angle);
        while (diff > Math.PI) diff -= Math.PI * 2;
        diff = Math.abs(diff);

        if (diff < 0.55) {
          this.triggerAlarm("REPÉRÉ ! Un agent fédéral braque sa lampe sur vous !");
        }
      }
    });

    // Récupération des disquettes
    this.disks.forEach(d => {
      if (!d.collected && Math.hypot(this.player.x - d.x, this.player.y - d.y) < 18) {
        d.collected = true;
        this.score += 250;
        window.soundEngine.playTokenDrop();
        this.updateStatus(`💾 Disquette Top Secret récupérée ! (+250 pts)`);
      }
    });

    // Récupération du passe magnétique
    if (!this.keycard.collected && Math.hypot(this.player.x - this.keycard.x, this.player.y - this.keycard.y) < 18) {
      this.keycard.collected = true;
      this.score += 500;
      window.soundEngine.playVictory();
      this.updateStatus("🔑 PASSE NIVEAU 4 OBTENU ! Foncez libérer l'Alien en bas à droite !");
    }

    // Libération de l'Alien
    if (Math.hypot(this.player.x - this.alien.x, this.player.y - this.alien.y) < 22) {
      if (this.keycard.collected) {
        this.alien.rescued = true;
        this.victory = true;
        this.stop();
        window.soundEngine.playHolyMiracle();
        if (window.speechEngine) window.speechEngine.speak("L'extraterrestre est libéré ! Victoire divine contre la Zone 51 !");
        this.updateStatus(`🏆 VICTOIRE TOTALE ! Alien libéré ! Score final : ${this.score + 1000} pts`);
      } else {
        this.updateStatus("⚠️ PORTE CYBÉRNÉTIQUE VERROUILLÉE ! Trouvez la clé de niveau 4 !");
      }
    }
  }

  triggerAlarm(msg) {
    window.soundEngine.playReptilianLaser();
    window.soundEngine.beep(1200, 0.2, "sawtooth");
    if (window.speechEngine) window.speechEngine.speak("Alerte intrusion !");
    this.stop();
    this.updateStatus(`❌ CAPTURÉ ! ${msg} Cliquez sur DÉMARRER pour réessayer.`);
  }

  draw() {
    this.ctx.fillStyle = "#001111"; // Fond bunker militaire
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Grille de dalles de béton
    this.ctx.strokeStyle = "#002222";
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }

    // Dessin des murs renforcés
    this.ctx.fillStyle = "#004444";
    this.ctx.strokeStyle = "#00ffcc";
    this.ctx.lineWidth = 1.5;
    for (const w of this.walls) {
      this.ctx.fillRect(w.x, w.y, w.w, w.h);
      this.ctx.strokeRect(w.x, w.y, w.w, w.h);
    }

    // Dessin des lasers
    for (const las of this.lasers) {
      if (las.active) {
        this.ctx.strokeStyle = "#ff0000";
        this.ctx.lineWidth = 3;
        this.ctx.shadowColor = "#ff0000";
        this.ctx.shadowBlur = 8;
        this.ctx.beginPath();
        this.ctx.moveTo(las.x, las.y);
        this.ctx.lineTo(las.x + las.w, las.y);
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
      }
    }

    // Dessin des cônes de vision des gardes
    this.guards.forEach(g => {
      this.ctx.fillStyle = "rgba(255, 255, 0, 0.18)";
      this.ctx.beginPath();
      this.ctx.moveTo(g.x, g.y);
      this.ctx.arc(g.x, g.y, 80, g.angle - 0.5, g.angle + 0.5);
      this.ctx.closePath();
      this.ctx.fill();

      // Garde lui-même (Agent Fed)
      this.ctx.fillStyle = "#ffff55";
      this.ctx.beginPath();
      this.ctx.arc(g.x, g.y, 8, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = "#000";
      this.ctx.stroke();

      this.ctx.font = "12px monospace";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText("🕴️", g.x, g.y);
    });

    // Dessin des disquettes
    this.disks.forEach(d => {
      if (!d.collected) {
        this.ctx.font = "16px monospace";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText("💾", d.x, d.y);
      }
    });

    // Dessin du passe clé
    if (!this.keycard.collected) {
      this.ctx.font = "16px monospace";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText("🔑", this.keycard.x, this.keycard.y);
    }

    // Dessin de la cage de l'Alien
    this.ctx.strokeStyle = this.keycard.collected ? "#00ff00" : "#ff0000";
    this.ctx.strokeRect(this.alien.x - 18, this.alien.y - 18, 36, 36);
    this.ctx.font = "20px monospace";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("👽", this.alien.x, this.alien.y);

    // Dessin du Joueur (Hacker dissident en trench-coat)
    this.ctx.fillStyle = "#55ff55";
    this.ctx.beginPath();
    this.ctx.arc(this.player.x, this.player.y, this.player.size / 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.stroke();
    this.ctx.font = "14px monospace";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("🕵️", this.player.x, this.player.y);
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }

  render() {
    this.draw();
  }
}

// --------------------------------------------------------------------------
// 2. CERN PARTICLE SMASHER (ACCÉLÉRATEUR DE HADRONS LHC)
// --------------------------------------------------------------------------
class CernSmasherGame {
  constructor(canvasId, statusId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.statusEl = document.getElementById(statusId);

    this.width = this.canvas.width = 460;
    this.height = this.canvas.height = 320;

    this.isRunning = false;
    this.animId = null;

    this.reset();
    this.initEvents();
    this.render();
  }

  reset() {
    this.ringRadius = 110;
    this.cx = this.width / 2;
    this.cy = this.height / 2;

    // Faisceaux de particules
    this.beam1Angle = 0;
    this.beam2Angle = Math.PI;
    this.beamSpeed = 0.035;
    this.energyTev = 1.0; // Tera-électron-volts
    this.stability = 100;

    this.targetPhase = Math.PI / 2; // Point d'impact dans le détecteur ATLAS
    this.discoveredParticles = [];
    this.explosions = [];

    this.updateStatus("LHC EN ATTENTE : Accélérez le faisceau et déclenchez la collision au point ATLAS !");
  }

  initEvents() {
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        this.triggerCollision();
      }
      if (e.code === "ArrowUp" || e.code === "KeyW") {
        this.accelerate();
      }
    });

    if (this.canvas) {
      this.canvas.addEventListener("click", () => {
        this.triggerCollision();
      });
    }
  }

  updateStatus(msg) {
    if (this.statusEl) this.statusEl.textContent = msg;
  }

  accelerate() {
    this.energyTev = Math.min(14.0, this.energyTev + 0.8);
    this.beamSpeed = Math.min(0.12, this.beamSpeed + 0.008);
    window.soundEngine.beep(200 + this.energyTev * 60, 0.06, "sawtooth");
  }

  triggerCollision() {
    if (!this.isRunning) {
      this.start();
      return;
    }

    // Mesure la distance angulaire par rapport au détecteur ATLAS
    const diff1 = Math.abs(this.beam1Angle % (Math.PI * 2) - this.targetPhase);
    const diff2 = Math.abs(this.beam2Angle % (Math.PI * 2) - this.targetPhase);

    if (diff1 < 0.35 || diff2 < 0.35) {
      // Collision réussie !
      this.createCollisionExplosion();
      this.evaluatePhysics();
    } else {
      this.stability = Math.max(0, this.stability - 15);
      window.soundEngine.beep(150, 0.15, "square");
      this.updateStatus(`⚠️ COLLISION RATÉE ! Faisceau désynchronisé. Stabilité anneau : ${this.stability}%`);
      if (this.stability <= 0) {
        this.stop();
        this.updateStatus("💥 EFFONDREMENT DU CHAMP MAGNÉTIQUE ! Le LHC a disjoncté.");
      }
    }
  }

  createCollisionExplosion() {
    window.soundEngine.playExplosion();
    const x = this.cx + Math.cos(this.targetPhase) * this.ringRadius;
    const y = this.cy + Math.sin(this.targetPhase) * this.ringRadius;

    for (let i = 0; i < 24; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = Math.random() * 5 + 2;
      this.explosions.push({
        x, y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 30,
        color: ["#55ffff", "#ffff55", "#ff5555", "#ffffff"][Math.floor(Math.random() * 4)]
      });
    }
  }

  evaluatePhysics() {
    const roll = Math.random() * 100;
    let name = "";
    if (this.energyTev >= 12.0 && roll > 70) {
      name = "✨ LE BOSON DE HIGGS SACRÉ (PARTICULE DE DIEU) !";
      window.soundEngine.playHolyMiracle();
      if (window.speechEngine) window.speechEngine.speak("Eurêka ! Le Boson de Higgs sacré a été détecté dans le Ring-0 !");
    } else if (roll > 50) {
      name = "Quark Top & Gluon lourd détectés !";
      window.soundEngine.playVictory();
    } else if (roll > 20) {
      name = "Paire de Muons à haute énergie identifiée !";
      window.soundEngine.playPaddleHit();
    } else {
      name = "Neutrinos et photons Gamma enregistrés.";
    }

    this.discoveredParticles.unshift(name);
    if (this.discoveredParticles.length > 3) this.discoveredParticles.pop();
    this.updateStatus(`💥 COLLISION À ${this.energyTev.toFixed(1)} TeV ! ${name}`);
  }

  start() {
    if (this.animId) cancelAnimationFrame(this.animId);
    this.isRunning = true;
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  update() {
    if (!this.isRunning) return;

    this.beam1Angle += this.beamSpeed;
    this.beam2Angle -= this.beamSpeed;

    // Déplacement des débris d'explosion
    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const p = this.explosions[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) this.explosions.splice(i, 1);
    }
  }

  draw() {
    this.ctx.fillStyle = "#000814";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Dessin de l'anneau principal LHC
    this.ctx.strokeStyle = "#003366";
    this.ctx.lineWidth = 14;
    this.ctx.beginPath();
    this.ctx.arc(this.cx, this.cy, this.ringRadius, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.strokeStyle = "#00ffff";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(this.cx, this.cy, this.ringRadius, 0, Math.PI * 2);
    this.ctx.stroke();

    // Détecteurs ATLAS & CMS (points clés)
    [Math.PI / 2, -Math.PI / 2, 0, Math.PI].forEach((ang, idx) => {
      const dx = this.cx + Math.cos(ang) * this.ringRadius;
      const dy = this.cy + Math.sin(ang) * this.ringRadius;
      this.ctx.fillStyle = idx === 0 ? "#ffd700" : "#555";
      this.ctx.fillRect(dx - 10, dy - 10, 20, 20);
      this.ctx.strokeStyle = "#fff";
      this.ctx.strokeRect(dx - 10, dy - 10, 20, 20);
    });

    // Faisceau 1 (Cyan)
    const p1x = this.cx + Math.cos(this.beam1Angle) * this.ringRadius;
    const p1y = this.cy + Math.sin(this.beam1Angle) * this.ringRadius;
    this.ctx.fillStyle = "#55ffff";
    this.ctx.beginPath();
    this.ctx.arc(p1x, p1y, 5, 0, Math.PI * 2);
    this.ctx.fill();

    // Faisceau 2 (Magenta / Anti-matière)
    const p2x = this.cx + Math.cos(this.beam2Angle) * this.ringRadius;
    const p2y = this.cy + Math.sin(this.beam2Angle) * this.ringRadius;
    this.ctx.fillStyle = "#ff55ff";
    this.ctx.beginPath();
    this.ctx.arc(p2x, p2y, 5, 0, Math.PI * 2);
    this.ctx.fill();

    // Rendu des étincelles de collision
    for (const exp of this.explosions) {
      this.ctx.fillStyle = exp.color;
      this.ctx.fillRect(exp.x, exp.y, 3, 3);
    }

    // Informations télémétrie dans le centre de l'anneau
    this.ctx.fillStyle = "#ffff55";
    this.ctx.font = "bold 13px monospace";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`${this.energyTev.toFixed(1)} TeV`, this.cx, this.cy - 12);

    this.ctx.fillStyle = "#55ff55";
    this.ctx.font = "11px monospace";
    this.ctx.fillText(`STABILITÉ : ${this.stability}%`, this.cx, this.cy + 6);
    this.ctx.fillText(`[ESPACE] COLLISION`, this.cx, this.cy + 24);
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }

  render() {
    this.draw();
  }
}

// --------------------------------------------------------------------------
// 3. CYBER-PHREAKING & BBS TERMINAL (HACKING ANARCHISTE 80s)
// --------------------------------------------------------------------------
class BBSPhreakGame {
  constructor(outputId, inputId) {
    this.outputEl = document.getElementById(outputId);
    this.inputEl = document.getElementById(inputId);

    this.connectedNode = null;
    this.blueBoxActive = false;

    this.nodes = {
      "2600": { name: "PHREAKERS_HAVEN_BBS", ip: "127.0.0.1:2600", desc: "Serveur pirate d'échange de codes de cartes téléphoniques et fréquences 2600Hz." },
      "8080": { name: "CERN_EARLY_WWW_GATEWAY", ip: "192.16.202.1", desc: "Passerelle expérimentale du NeXT Cube de Tim Berners-Lee au CERN." },
      "1984": { name: "PENTAGON_ARPANET_GATEWAY", ip: "10.0.0.1:1984", desc: "Passerelle militaire classifiée sous protocole NCP/TCP primitif." },
      "666": { name: "DENVER_DEEP_UNDERGROUND_VAULT", ip: "66.6.66.6", desc: "Base de données chiffrée des élites mondiales au niveau -4." }
    };

    this.files = {
      "manifeste.txt": "RÉSEAU SANS MAÎTRES : Le téléphone et l'ordinateur sont des extensions de la pensée humaine. Aucune corporation ne possède le droit de taxer la communication des hommes libres.",
      "feds_list.dat": "AGENTS CIA CONNUS : Smith (Secteur 4), Davis (Undercover Denver), Agent 042 (Projet Echelon). NOTE : Tous brillent dans le noir sous spectre UV.",
      "passwords.hc": "HOLYC MASTER PASSWORDS : #define GOD_KEY 0x777DEADBEEF ; Root access granted to all disciples."
    };

    this.initEvents();
    this.printBanner();
  }

  initEvents() {
    if (this.inputEl) {
      this.inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const cmd = this.inputEl.value.trim();
          this.inputEl.value = "";
          this.handleCommand(cmd);
        }
      });
    }
  }

  print(text, color = "#55ff55") {
    if (!this.outputEl) return;
    const line = document.createElement("div");
    line.style.color = color;
    line.style.fontFamily = "monospace";
    line.style.fontSize = "11px";
    line.style.lineHeight = "1.3";
    line.textContent = text;
    this.outputEl.appendChild(line);
    this.outputEl.scrollTop = this.outputEl.scrollHeight;
  }

  printBanner() {
    this.print("╔═════════════════════════════════════════════════════════════╗", "#ffd700");
    this.print("║  CYBER-PHREAKING BBS TERMINAL v2.600 - MODEM 1200 BAUDS     ║", "#ffd700");
    this.print("║  Tapez 'help' pour la liste des commandes de télécommunication. ║", "#ffd700");
    this.print("╚═════════════════════════════════════════════════════════════╝", "#ffd700");
    this.print("CONNECT 1200 / NO CARRIER DETECTED. Prêt pour syntonisation.", "#aaa");
  }

  handleInput(cmd) {
    this.handleCommand(cmd);
  }

  handleCommand(cmd) {
    if (!cmd) return;
    this.print(`> ${cmd}`, "#ffff55");
    window.soundEngine.playClick();

    const parts = cmd.toLowerCase().split(" ");
    const action = parts[0];
    const arg = parts[1];

    switch (action) {
      case "help":
      case "aide":
        this.print("COMMANDES PHREAKING DISPONIBLES :");
        this.print("  scan               -> Scanne les numéros de téléphone et serveurs BBS");
        this.print("  dial <numero>      -> Compose le numéro (ex: dial 2600, dial 1984)");
        this.print("  bluebox            -> Envoie la fréquence sacrée de 2600 Hz (prise de contrôle de ligne)");
        this.print("  ls / dir           -> Liste les fichiers du serveur distant connecté");
        this.print("  cat <fichier>      -> Affiche le contenu d'un fichier texte");
        this.print("  crack              -> Brute-force le mot de passe du terminal connecté");
        this.print("  disconnect         -> Raccroche le combiné téléphonique");
        this.print("  clear              -> Efface l'écran du terminal");
        break;

      case "scan":
        this.print("BALAYAGE DES LIGNES TÉLÉPHONIQUES EN COURS (TONALITÉS DTMF)...", "#55ffff");
        window.soundEngine.beep(941, 0.1);
        setTimeout(() => window.soundEngine.beep(1336, 0.1), 120);
        setTimeout(() => {
          this.print("NOEUDS DÉTECTÉS SUR LE RÉSEAU :");
          for (const [num, info] of Object.entries(this.nodes)) {
            this.print(`  [NUM: ${num}] -> ${info.name} (${info.ip})`);
          }
        }, 300);
        break;

      case "bluebox":
      case "2600":
        this.blueBoxActive = true;
        this.print("[BLUE BOX 2600 Hz] ÉMISSION DE LA TONALITÉ DE DÉCONNEXION TRUNK OPERATOR...", "#55ffff");
        window.soundEngine.beep(2600, 0.4, "sine");
        setTimeout(() => {
          this.print("✅ LIGNE INTERURBAINE PIRATÉE ! Tous vos appels sont désormais gratuits et intraçables.", "#ffd700");
          window.soundEngine.playHolyMiracle();
        }, 450);
        break;

      case "dial":
        if (!arg || !this.nodes[arg]) {
          this.print("❌ NUMÉRO INVALIDE OU NON ASSIGNÉ. Essayez 'scan' pour trouver des numéros.", "#ff5555");
          window.soundEngine.beep(200, 0.2);
          return;
        }
        this.print(`COMPOSITION DU NUMÉRO ${arg}... [BIP... BIP...]`, "#aaa");
        window.soundEngine.beep(770, 0.08);
        setTimeout(() => window.soundEngine.beep(1209, 0.08), 90);
        setTimeout(() => {
          this.connectedNode = this.nodes[arg];
          this.print(`CARRIER DETECTED ! CONNECT 1200 / ${this.connectedNode.name}`, "#55ff55");
          this.print(`DESCRIPTION : ${this.connectedNode.desc}`, "#fff");
          window.soundEngine.playVictory();
        }, 500);
        break;

      case "ls":
      case "dir":
        if (!this.connectedNode) {
          this.print("❌ VOUS N'ÊTES CONNECTÉ À AUCUN NOEUD. Utilisez 'dial <num>' d'abord.", "#ff5555");
          return;
        }
        this.print(`CONTENU DU SERVEUR ${this.connectedNode.name} :`);
        for (const f of Object.keys(this.files)) {
          this.print(`  - ${f} (ASCII Text / Classified)`);
        }
        break;

      case "cat":
      case "read":
        if (!arg || !this.files[arg]) {
          this.print("❌ FICHIER INTROUVABLE. Tapez 'ls' pour voir les fichiers.", "#ff5555");
          return;
        }
        this.print(`[AFFICHAGE DE ${arg}] :`, "#ffd700");
        this.print(this.files[arg], "#fff");
        window.soundEngine.playTokenDrop();
        break;

      case "crack":
        if (!this.connectedNode) {
          this.print("❌ AUCUNE CIBLE À PIRATER.", "#ff5555");
          return;
        }
        this.print("INJECTION DU DICTIONNAIRE DE BRUTE-FORCE DANS LE PORT SERIEL...", "#55ffff");
        let step = 0;
        const crackInt = setInterval(() => {
          step++;
          window.soundEngine.beep(400 + step * 100, 0.04);
          this.print(`Test du hash SHA-256 bloc #${step}... [MATCH DÉTECTÉ]`);
          if (step >= 4) {
            clearInterval(crackInt);
            this.print("🔓 ACCÈS ROOT RING-0 ACCORDÉ ! Mot de passe : 'TERRY_GOD_1993'", "#ffd700");
            window.soundEngine.playHolyMiracle();
          }
        }, 180);
        break;

      case "disconnect":
        this.connectedNode = null;
        this.print("LIGNE TÉLÉPHONIQUE LIBÉRÉE. NO CARRIER.", "#aaa");
        window.soundEngine.beep(400, 0.1);
        break;

      case "clear":
      case "cls":
        if (this.outputEl) this.outputEl.innerHTML = "";
        break;

      default:
        this.print(`Commande inconnue : '${cmd}'. Tapez 'help' pour la liste.`, "#ff5555");
        break;
    }
  }
}

window.Area51Game = Area51Game;
window.CernSmasherGame = CernSmasherGame;
window.BBSPhreakGame = BBSPhreakGame;
