// ==========================================================================
// WAR ROOM CONSPIRATIONNISTE MONDIALE (RADAR MILITAIRE INTERACTIF)
// Carte du monde vectorielle avec bases secrètes cliquables et radio morse
// ==========================================================================

class WarRoomGame {
  constructor(canvasId, logId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.logEl = document.getElementById(logId);

    this.width = this.canvas.width = 540;
    this.height = this.canvas.height = 320;

    this.bases = [
      { id: 'area51', name: 'ZONE 51 (NEVADA)', x: 120, y: 115, icon: '🛸', desc: 'Rétro-ingénierie de soucoupes volantes et tests de moteurs à anti-gravité dans le hangar S-4.' },
      { id: 'denver', name: 'AÉROPORT DE DENVER', x: 145, y: 110, icon: '👁️', desc: 'Fresques prophétiques apocalyptiques et tunnels souterrains profonds de niveau -4 réservés aux élites.' },
      { id: 'bermuda', name: 'TRIANGLE DES BERMUDES', x: 180, y: 155, icon: '⚠️', desc: 'Anomalie électromagnétique majeure. Disparition de bombardiers de l\'US Navy et vortex temporel.' },
      { id: 'cern', name: 'CERN (GENÈVE)', x: 285, y: 95, icon: '⚛️', desc: 'Collisionneur de hadrons tentant d\'ouvrir un portail vers la 4ème dimension et statut de Shiva dans la cour.' },
      { id: 'bohemian', name: 'BOHEMIAN GROVE', x: 95, y: 105, icon: '🦉', desc: 'Forêt de séquoias où les dirigeants mondiaux simulent le sacrifice de la Crémation des Soucis devant la Chouette.' },
      { id: 'pyramids', name: 'GÎZEH (ÉGYPTE)', x: 330, y: 130, icon: '🔺', desc: 'Alignement parfait avec la constellation d\'Orion et générateur d\'énergie scalaire antique.' },
      { id: 'vatican', name: 'ARCHIVES DU VATICAN', x: 295, y: 105, icon: '✝', desc: '38 kilomètres de rayonnages secrets renfermant le chronoviseur et les évangiles apocryphes perdus.' }
    ];

    this.radarAngle = 0;
    this.activeBase = null;
    this.isRunning = false;

    this.initEvents();
    this.render();
  }

  initEvents() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      for (const base of this.bases) {
        const dist = Math.hypot(clickX - base.x, clickY - base.y);
        if (dist < 15) {
          this.selectBase(base);
          return;
        }
      }
    });
  }

  selectBase(base) {
    this.activeBase = base;
    window.soundEngine.playReptilianLaser();
    if (window.speechEngine) {
      window.speechEngine.speak(`Interception de la transmission : ${base.name}`);
    }
    if (this.logEl) {
      this.logEl.innerHTML = `
        <div style="color:var(--vga-yellow); font-weight:bold; font-size:13px; margin-bottom:4px;">
          ${base.icon} DOSSIER DÉCLASSIFIÉ : ${base.name}
        </div>
        <div style="color:var(--vga-white); font-size:11px; margin-bottom:6px;">${base.desc}</div>
        <div style="color:var(--vga-light-green); font-size:10px;">FRÉQUENCE D'ÉCOUTE : 144.800 MHz • STATUT : ÉMISSION EN COURS</div>
      `;
    }
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.loop();
    }
  }

  stop() {
    this.isRunning = false;
  }

  draw() {
    this.ctx.fillStyle = '#001100';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Grille radar verte militaire
    this.ctx.strokeStyle = '#003300';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }

    // Cercles concentriques radar
    const cx = this.width / 2;
    const cy = this.height / 2;
    this.ctx.strokeStyle = '#004400';
    [60, 120, 180, 240].forEach(r => {
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
      this.ctx.stroke();
    });

    // Balayage radar tournant
    this.radarAngle += 0.03;
    const rx = cx + Math.cos(this.radarAngle) * 300;
    const ry = cy + Math.sin(this.radarAngle) * 300;

    const grad = this.ctx.createRadialGradient(cx, cy, 10, cx, cy, 260);
    grad.addColorStop(0, 'rgba(85, 255, 85, 0.2)');
    grad.addColorStop(1, 'rgba(0, 50, 0, 0)');
    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy);
    this.ctx.arc(cx, cy, 260, this.radarAngle - 0.4, this.radarAngle);
    this.ctx.closePath();
    this.ctx.fill();

    // Silhouettes grossières des continents en vert sombre
    this.ctx.strokeStyle = '#00aa00';
    this.ctx.lineWidth = 1.5;
    // Amérique du Nord
    this.ctx.strokeRect(70, 70, 110, 80);
    // Amérique du Sud
    this.ctx.strokeRect(140, 170, 60, 90);
    // Europe
    this.ctx.strokeRect(260, 70, 70, 60);
    // Afrique
    this.ctx.strokeRect(260, 140, 80, 90);
    // Asie
    this.ctx.strokeRect(340, 60, 130, 90);

    // Dessin des bases secrètes
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    for (const b of this.bases) {
      const isSel = this.activeBase && this.activeBase.id === b.id;
      this.ctx.fillStyle = isSel ? '#ffff55' : '#ff5555';
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, isSel ? 7 : 4, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.font = '13px monospace';
      this.ctx.fillText(b.icon, b.x, b.y - 12);
    }
  }

  loop() {
    if (!this.isRunning) return;
    this.draw();
    requestAnimationFrame(() => this.loop());
  }

  render() {
    this.draw();
  }
}

window.WarRoomGame = WarRoomGame;
