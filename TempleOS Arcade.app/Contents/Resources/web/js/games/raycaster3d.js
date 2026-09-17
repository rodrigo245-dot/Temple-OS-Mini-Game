// ==========================================================================
// TEMPLEOS 3D RAYCASTER (WOLFENSTEIN PENTAGONE PUR 60 FPS)
// Moteur de rendu DDA pseudo-3D en vue subjective dans les couloirs du Pentagone
// ==========================================================================

class Raycaster3DGame {
  constructor(canvasId, statusId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.statusEl = document.getElementById(statusId);

    this.width = this.canvas.width = 400;
    this.height = this.canvas.height = 280;

    // Carte du labyrinthe (1 = Mur en briques, 2 = Mur doré, 0 = Passage)
    this.map = [
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,1,0,0,0,0,0,1],
      [1,0,1,1,0,1,0,1,1,1,0,1],
      [1,0,1,0,0,0,0,0,0,1,0,1],
      [1,0,1,0,2,2,2,2,0,1,0,1],
      [1,0,0,0,2,0,0,2,0,0,0,1],
      [1,0,1,0,2,0,0,2,0,1,0,1],
      [1,0,1,0,2,2,0,2,0,1,0,1],
      [1,0,1,0,0,0,0,0,0,1,0,1],
      [1,0,1,1,1,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    this.mapW = 12;
    this.mapH = 12;

    // Position joueur
    this.px = 2.5;
    this.py = 2.5;
    this.dirX = 1;
    this.dirY = 0;
    this.planeX = 0;
    this.planeY = 0.66; // Champ de vision FOV ~ 66°

    // Ennemis (Feds en costume noir qui brillent)
    this.enemies = [
      { x: 5.5, y: 5.5, alive: true, icon: '[FED]️' },
      { x: 8.5, y: 3.5, alive: true, icon: '[FED]️' },
      { x: 9.5, y: 8.5, alive: true, icon: '[REP]' }
    ];

    this.keys = {};
    this.isRunning = false;
    this.animId = null;
    this.score = 0;

    this.initEvents();
    this.render();
  }

  initEvents() {
    const setKey = (code, key, val) => {
      const k = (key || '').toLowerCase();
      const c = code || '';
      if (['w', 'z', 'arrowup'].includes(k) || ['KeyW', 'KeyZ', 'ArrowUp'].includes(c)) {
        this.keys['up'] = val;
      }
      if (['s', 'arrowdown'].includes(k) || ['KeyS', 'ArrowDown'].includes(c)) {
        this.keys['down'] = val;
      }
      if (['a', 'q', 'arrowleft'].includes(k) || ['KeyA', 'KeyQ', 'ArrowLeft'].includes(c)) {
        this.keys['left'] = val;
      }
      if (['d', 'arrowright'].includes(k) || ['KeyD', 'ArrowRight'].includes(c)) {
        this.keys['right'] = val;
      }
      if (k === ' ' || c === 'Space') {
        this.keys['shoot'] = val;
        if (val && this.isRunning) {
          this.shoot();
        }
      }
    };

    window.addEventListener('keydown', (e) => {
      setKey(e.code, e.key, true);
    });
    window.addEventListener('keyup', (e) => {
      setKey(e.code, e.key, false);
    });

    if (this.canvas) {
      this.canvas.addEventListener('click', () => {
        if (!this.isRunning) {
          this.start();
        }
        this.shoot();
      });
    }
  }

  shoot() {
    if (window.soundEngine) {
      window.soundEngine.beep(900, 0.08, 'sawtooth');
      setTimeout(() => window.soundEngine.playPaddleHit(), 50);
    }

    // Vérifie si un ennemi est dans le viseur central
    for (const en of this.enemies) {
      if (!en.alive) continue;
      const dx = en.x - this.px;
      const dy = en.y - this.py;
      const angleToEn = Math.atan2(dy, dx);
      const curAngle = Math.atan2(this.dirY, this.dirX);
      let diff = Math.abs(angleToEn - curAngle);
      while (diff > Math.PI) diff -= Math.PI * 2;
      diff = Math.abs(diff);

      if (diff < 0.35 && Math.hypot(dx, dy) < 7) {
        en.alive = false;
        this.score += 100;
        if (window.soundEngine) window.soundEngine.playExplosion();
        if (window.speechEngine) window.speechEngine.speak("Agent fédéral purifié !");
        if (this.statusEl) {
          this.statusEl.textContent = `AGENT PURIFIÉ ! SCORE : ${this.score} • CIBLE ÉLIMINÉE`;
        }
        return;
      }
    }
  }

  start() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
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
    const moveSpeed = 0.06;
    const rotSpeed = 0.045;

    // Déplacement avant / arrière (AZERTY & QWERTY & Flèches)
    if (this.keys['up']) {
      const nx = this.px + this.dirX * moveSpeed;
      const ny = this.py + this.dirY * moveSpeed;
      if (this.map[Math.floor(this.py)][Math.floor(nx)] === 0) this.px = nx;
      if (this.map[Math.floor(ny)][Math.floor(this.px)] === 0) this.py = ny;
    }
    if (this.keys['down']) {
      const nx = this.px - this.dirX * moveSpeed;
      const ny = this.py - this.dirY * moveSpeed;
      if (this.map[Math.floor(this.py)][Math.floor(nx)] === 0) this.px = nx;
      if (this.map[Math.floor(ny)][Math.floor(this.px)] === 0) this.py = ny;
    }

    // Rotation gauche / droite
    if (this.keys['left']) {
      const oldDirX = this.dirX;
      this.dirX = this.dirX * Math.cos(-rotSpeed) - this.dirY * Math.sin(-rotSpeed);
      this.dirY = oldDirX * Math.sin(-rotSpeed) + this.dirY * Math.cos(-rotSpeed);
      const oldPlaneX = this.planeX;
      this.planeX = this.planeX * Math.cos(-rotSpeed) - this.planeY * Math.sin(-rotSpeed);
      this.planeY = oldPlaneX * Math.sin(-rotSpeed) + this.planeY * Math.cos(-rotSpeed);
    }
    if (this.keys['right']) {
      const oldDirX = this.dirX;
      this.dirX = this.dirX * Math.cos(rotSpeed) - this.dirY * Math.sin(rotSpeed);
      this.dirY = oldDirX * Math.sin(rotSpeed) + this.dirY * Math.cos(rotSpeed);
      const oldPlaneX = this.planeX;
      this.planeX = this.planeX * Math.cos(rotSpeed) - this.planeY * Math.sin(rotSpeed);
      this.planeY = oldPlaneX * Math.sin(rotSpeed) + this.planeY * Math.cos(rotSpeed);
    }
  }

  draw() {
    // Ciel & Sol VGA
    this.ctx.fillStyle = '#000033'; // Plafond bleu nuit
    this.ctx.fillRect(0, 0, this.width, this.height / 2);
    this.ctx.fillStyle = '#111111'; // Sol sombre
    this.ctx.fillRect(0, this.height / 2, this.width, this.height / 2);

    // Raycasting DDA colonne par colonne
    for (let x = 0; x < this.width; x += 2) {
      const cameraX = 2 * x / this.width - 1;
      const rayDirX = this.dirX + this.planeX * cameraX;
      const rayDirY = this.dirY + this.planeY * cameraX;

      let mapX = Math.floor(this.px);
      let mapY = Math.floor(this.py);

      let sideDistX, sideDistY;
      const deltaDistX = Math.abs(1 / (rayDirX || 0.0001));
      const deltaDistY = Math.abs(1 / (rayDirY || 0.0001));
      let perpWallDist;

      let stepX, stepY;
      let hit = 0;
      let side;

      if (rayDirX < 0) {
        stepX = -1;
        sideDistX = (this.px - mapX) * deltaDistX;
      } else {
        stepX = 1;
        sideDistX = (mapX + 1.0 - this.px) * deltaDistX;
      }
      if (rayDirY < 0) {
        stepY = -1;
        sideDistY = (this.py - mapY) * deltaDistY;
      } else {
        stepY = 1;
        sideDistY = (mapY + 1.0 - this.py) * deltaDistY;
      }

      while (hit === 0) {
        if (sideDistX < sideDistY) {
          sideDistX += deltaDistX;
          mapX += stepX;
          side = 0;
        } else {
          sideDistY += deltaDistY;
          mapY += stepY;
          side = 1;
        }
        if (mapX >= 0 && mapX < this.mapW && mapY >= 0 && mapY < this.mapH) {
          if (this.map[mapY][mapX] > 0) hit = 1;
        } else {
          hit = 1;
        }
      }

      if (side === 0) perpWallDist = (mapX - this.px + (1 - stepX) / 2) / rayDirX;
      else perpWallDist = (mapY - this.py + (1 - stepY) / 2) / rayDirY;

      const lineHeight = Math.floor(this.height / (perpWallDist || 0.0001));
      const drawStart = Math.max(0, -lineHeight / 2 + this.height / 2);
      const drawEnd = Math.min(this.height - 1, lineHeight / 2 + this.height / 2);

      // Couleurs des murs selon type et orientation
      const wallType = (mapX >= 0 && mapX < this.mapW && mapY >= 0 && mapY < this.mapH) ? this.map[mapY][mapX] : 1;
      let wallColor = (wallType === 2) ? '#ffd700' : '#00aa00';
      if (side === 1) wallColor = (wallType === 2) ? '#aa8800' : '#006600'; // Ombre

      this.ctx.fillStyle = wallColor;
      this.ctx.fillRect(x, drawStart, 2, drawEnd - drawStart);
    }

    // Viseur central & arme sacrée
    this.ctx.strokeStyle = '#55ffff';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.arc(this.width / 2, this.height / 2, 8, 0, Math.PI * 2);
    this.ctx.stroke();

    // Rendu canon laser sacré en bas
    this.ctx.fillStyle = '#ffff55';
    this.ctx.fillRect(this.width / 2 - 8, this.height - 35, 16, 35);

    // Rendu des sprites ennemis (billboards)
    this.enemies.forEach(en => {
      if (!en.alive) return;
      const spriteX = en.x - this.px;
      const spriteY = en.y - this.py;
      const invDet = 1.0 / (this.planeX * this.dirY - this.dirX * this.planeY);
      const transformX = invDet * (this.dirY * spriteX - this.dirX * spriteY);
      const transformY = invDet * (-this.planeY * spriteX + this.planeX * spriteY);

      if (transformY > 0.3) {
        const spriteScreenX = Math.floor((this.width / 2) * (1 + transformX / transformY));
        const spriteSize = Math.abs(Math.floor(this.height / transformY));
        if (spriteSize > 8 && spriteSize < 220) {
          this.ctx.font = `${Math.min(42, Math.max(16, spriteSize / 2))}px monospace`;
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText(en.icon, spriteScreenX, this.height / 2 + 10);
        }
      }
    });

    // Radar / Minimap dans le coin haut-droit
    const mmSize = 56;
    const mmX = this.width - mmSize - 6;
    const mmY = 6;
    this.ctx.fillStyle = 'rgba(0,0,15,0.75)';
    this.ctx.fillRect(mmX, mmY, mmSize, mmSize);
    this.ctx.strokeStyle = '#00ff00';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(mmX, mmY, mmSize, mmSize);
    const cellW = mmSize / this.mapW;
    const cellH = mmSize / this.mapH;
    for (let r = 0; r < this.mapH; r++) {
      for (let c = 0; c < this.mapW; c++) {
        if (this.map[r][c] > 0) {
          this.ctx.fillStyle = this.map[r][c] === 2 ? '#ffd700' : '#007700';
          this.ctx.fillRect(mmX + c * cellW, mmY + r * cellH, cellW, cellH);
        }
      }
    }
    // Ennemis sur minimap
    this.enemies.forEach(en => {
      if (!en.alive) return;
      this.ctx.fillStyle = '#ff2222';
      this.ctx.fillRect(mmX + en.x * cellW - 1.5, mmY + en.y * cellH - 1.5, 3, 3);
    });
    // Terry (joueur) sur minimap
    this.ctx.fillStyle = '#00ffff';
    this.ctx.fillRect(mmX + this.px * cellW - 1.5, mmY + this.py * cellH - 1.5, 3, 3);
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

window.Raycaster3DGame = Raycaster3DGame;
