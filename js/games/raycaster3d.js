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
      { x: 5.5, y: 5.5, alive: true, icon: '🕴️' },
      { x: 8.5, y: 3.5, alive: true, icon: '🕴️' },
      { x: 9.5, y: 8.5, alive: true, icon: '🦎' }
    ];

    this.keys = {};
    this.isRunning = false;
    this.animId = null;
    this.score = 0;

    this.initEvents();
    this.render();
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      if (['KeyW','KeyS','KeyA','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) {
        this.keys[e.code] = true;
        if (e.code === 'Space' && this.isRunning) {
          this.shoot();
        }
      }
    });
    window.addEventListener('keyup', (e) => {
      if (['KeyW','KeyS','KeyA','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) {
        this.keys[e.code] = false;
      }
    });
  }

  shoot() {
    window.soundEngine.beep(900, 0.08, 'sawtooth');
    setTimeout(() => window.soundEngine.playPaddleHit(), 50);

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

      if (diff < 0.25 && Math.hypot(dx, dy) < 6) {
        en.alive = false;
        this.score += 100;
        window.soundEngine.playExplosion();
        if (window.speechEngine) window.speechEngine.speak("Agent fédéral purifié !");
        if (this.statusEl) {
          this.statusEl.textContent = `AGENT PURIFIÉ ! SCORE : ${this.score} • CIBLE ÉLIMINÉE`;
        }
        return;
      }
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
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  update() {
    const moveSpeed = 0.06;
    const rotSpeed = 0.045;

    // Déplacement avant / arrière
    if (this.keys['KeyW'] || this.keys['ArrowUp']) {
      const nx = this.px + this.dirX * moveSpeed;
      const ny = this.py + this.dirY * moveSpeed;
      if (this.map[Math.floor(this.py)][Math.floor(nx)] === 0) this.px = nx;
      if (this.map[Math.floor(ny)][Math.floor(this.px)] === 0) this.py = ny;
    }
    if (this.keys['KeyS'] || this.keys['ArrowDown']) {
      const nx = this.px - this.dirX * moveSpeed;
      const ny = this.py - this.dirY * moveSpeed;
      if (this.map[Math.floor(this.py)][Math.floor(nx)] === 0) this.px = nx;
      if (this.map[Math.floor(ny)][Math.floor(this.px)] === 0) this.py = ny;
    }

    // Rotation gauche / droite
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
      const oldDirX = this.dirX;
      this.dirX = this.dirX * Math.cos(-rotSpeed) - this.dirY * Math.sin(-rotSpeed);
      this.dirY = oldDirX * Math.sin(-rotSpeed) + this.dirY * Math.cos(-rotSpeed);
      const oldPlaneX = this.planeX;
      this.planeX = this.planeX * Math.cos(-rotSpeed) - this.planeY * Math.sin(-rotSpeed);
      this.planeY = oldPlaneX * Math.sin(-rotSpeed) + this.planeY * Math.cos(-rotSpeed);
    }
    if (this.keys['KeyD'] || this.keys['ArrowRight']) {
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
