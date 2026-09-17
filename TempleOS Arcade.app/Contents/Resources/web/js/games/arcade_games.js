// ==========================================================================
// CATÉGORIE 4 : PHYSIQUE & ARCADE 2D (TEMPLEOS V2.0)
// 1. Casse-Briques (Breakout)
// 2. Flappy Bird (Flappy Terry)
// 3. Tetris Sacré
// 4. Asteroids Vectoriel
// 5. Space Invaders
// ==========================================================================

// --------------------------------------------------------------------------
// 1. CASSE-BRIQUES (BREAKOUT)
// --------------------------------------------------------------------------
class BreakoutGame {
  constructor(canvasId, scoreId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.scoreEl = document.getElementById(scoreId);

    this.width = this.canvas.width = 360;
    this.height = this.canvas.height = 300;

    this.paddleW = 60;
    this.paddleH = 8;
    this.paddleX = (this.width - this.paddleW) / 2;

    this.ballX = this.width / 2;
    this.ballY = this.height - 40;
    this.ballRadius = 5;
    this.dx = 3;
    this.dy = -3;

    this.bricks = [];
    this.rows = 4;
    this.cols = 7;
    this.brickW = 44;
    this.brickH = 12;
    this.brickPadding = 6;
    this.offsetTop = 30;
    this.offsetLeft = 8;

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
      const rootX = e.clientX - rect.left;
      this.paddleX = Math.max(0, Math.min(this.width - this.paddleW, rootX - this.paddleW / 2));
    });
  }

  reset() {
    this.score = 0;
    this.lives = 3;
    this.ballX = this.width / 2;
    this.ballY = this.height - 40;
    this.dx = 3;
    this.dy = -3;

    this.bricks = [];
    for (let c = 0; c < this.cols; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.rows; r++) {
        this.bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
    this.updateScore();
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

  updateScore() {
    if (this.scoreEl) this.scoreEl.textContent = `SCORE: ${this.score} | VIES: ${this.lives}`;
  }

  update() {
    this.ballX += this.dx;
    this.ballY += this.dy;

    // Rebonds murs
    if (this.ballX + this.ballRadius > this.width || this.ballX - this.ballRadius < 0) {
      this.dx = -this.dx;
      window.soundEngine.playWallHit();
    }
    if (this.ballY - this.ballRadius < 0) {
      this.dy = -this.dy;
      window.soundEngine.playWallHit();
    }

    // Rebond raquette
    if (this.ballY + this.ballRadius >= this.height - this.paddleH - 5) {
      if (this.ballX >= this.paddleX && this.ballX <= this.paddleX + this.paddleW) {
        this.dy = -Math.abs(this.dy);
        const hitPoint = (this.ballX - (this.paddleX + this.paddleW / 2)) / (this.paddleW / 2);
        this.dx = hitPoint * 4;
        window.soundEngine.playPaddleHit();
      } else if (this.ballY > this.height) {
        this.lives--;
        window.soundEngine.beep(200, 0.1);
        if (this.lives <= 0) {
          this.stop();
          window.soundEngine.playDefeat();
          alert("GAME OVER ! TOUTES LES VIES PERDUES !");
          this.reset();
          return;
        } else {
          this.ballX = this.width / 2;
          this.ballY = this.height - 40;
          this.dy = -3;
        }
      }
    }

    // Collision briques
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows; r++) {
        const b = this.bricks[c][r];
        if (b.status === 1) {
          if (this.ballX > b.x && this.ballX < b.x + this.brickW &&
              this.ballY > b.y && this.ballY < b.y + this.brickH) {
            this.dy = -this.dy;
            b.status = 0;
            this.score += 10;
            this.updateScore();
            window.soundEngine.beep(750, 0.04);
          }
        }
      }
    }
  }

  draw() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Briques
    const colors = ['#aa0000', '#aa5500', '#00aa00', '#00aaaa'];
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows; r++) {
        if (this.bricks[c][r].status === 1) {
          const bx = c * (this.brickW + this.brickPadding) + this.offsetLeft;
          const by = r * (this.brickH + this.brickPadding) + this.offsetTop;
          this.bricks[c][r].x = bx;
          this.bricks[c][r].y = by;

          this.ctx.fillStyle = colors[r % colors.length];
          this.ctx.fillRect(bx, by, this.brickW, this.brickH);
          this.ctx.strokeStyle = '#ffffff';
          this.ctx.strokeRect(bx, by, this.brickW, this.brickH);
        }
      }
    }

    // Raquette
    this.ctx.fillStyle = '#ffff55';
    this.ctx.fillRect(this.paddleX, this.height - this.paddleH - 5, this.paddleW, this.paddleH);

    // Balle
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
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
// 2. FLAPPY BIRD (FLAPPY TERRY)
// --------------------------------------------------------------------------
class FlappyGame {
  constructor(canvasId, scoreId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.scoreEl = document.getElementById(scoreId);

    this.width = this.canvas.width = 340;
    this.height = this.canvas.height = 360;

    this.birdY = this.height / 2;
    this.velocity = 0;
    this.gravity = 0.28;
    this.lift = -5.8;

    this.pipes = [];
    this.score = 0;
    this.isRunning = false;
    this.animId = null;

    this.initEvents();
    this.reset();
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        this.flap();
      }
    });
    this.canvas.addEventListener('click', () => this.flap());
  }

  flap() {
    if (!this.isRunning) {
      this.start();
    }
    this.velocity = this.lift;
    window.soundEngine.beep(600, 0.04);
  }

  reset() {
    this.birdY = this.height / 2;
    this.velocity = 0;
    this.pipes = [];
    this.score = 0;
    this.updateScore();
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

  updateScore() {
    if (this.scoreEl) this.scoreEl.textContent = `SCORE : ${this.score}`;
  }

  update() {
    this.velocity += this.gravity;
    this.birdY += this.velocity;

    // Plafond et sol
    if (this.birdY > this.height - 15 || this.birdY < 0) {
      this.die();
      return;
    }

    // Tuyaux procéduraux
    if (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].x < this.width - 140) {
      const topH = Math.floor(Math.random() * (this.height - 180)) + 40;
      this.pipes.push({ x: this.width, top: topH, gap: 90, passed: false });
    }

    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const p = this.pipes[i];
      p.x -= 2.2;

      // Score
      if (!p.passed && p.x < 50) {
        p.passed = true;
        this.score++;
        this.updateScore();
        window.soundEngine.beep(880, 0.06);
      }

      // Collision
      if (50 + 12 > p.x && 50 - 12 < p.x + 35) {
        if (this.birdY - 10 < p.top || this.birdY + 10 > p.top + p.gap) {
          this.die();
          return;
        }
      }

      if (p.x < -40) this.pipes.splice(i, 1);
    }
  }

  die() {
    this.stop();
    window.soundEngine.playDefeat();
    alert(`L'oiseau sacré a heurté une colonne ! Score : ${this.score}`);
    this.reset();
  }

  draw() {
    this.ctx.fillStyle = '#0000aa'; // Bleu ciel TempleOS
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Tuyaux sacrés (colonnes dorées)
    for (const p of this.pipes) {
      this.ctx.fillStyle = '#ffff55';
      this.ctx.fillRect(p.x, 0, 35, p.top);
      this.ctx.fillRect(p.x, p.top + p.gap, 35, this.height - (p.top + p.gap));
      this.ctx.strokeStyle = '#000';
      this.ctx.strokeRect(p.x, 0, 35, p.top);
      this.ctx.strokeRect(p.x, p.top + p.gap, 35, this.height - (p.top + p.gap));
    }

    // Oiseau sacré (Éléphant ou colombe de Terry)
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(45, this.birdY - 8, 18, 16);
    this.ctx.fillStyle = '#ff5555';
    this.ctx.fillRect(59, this.birdY - 2, 8, 5); // Bec
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }
}

// --------------------------------------------------------------------------
// 3. TETRIS SACRÉ (TÉTRIMINOS)
// --------------------------------------------------------------------------
class TetrisGame {
  constructor(canvasId, scoreId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.scoreEl = document.getElementById(scoreId);

    this.cols = 10;
    this.rows = 20;
    this.cellSize = 16; // 160x320
    this.canvas.width = this.cols * this.cellSize;
    this.canvas.height = this.rows * this.cellSize;

    this.grid = Array(this.rows).fill(0).map(() => Array(this.cols).fill(0));
    this.score = 0;
    this.isRunning = false;
    this.interval = null;

    this.pieces = [
      [[1, 1, 1, 1]], // I
      [[1, 0, 0], [1, 1, 1]], // J
      [[0, 0, 1], [1, 1, 1]], // L
      [[1, 1], [1, 1]], // O
      [[0, 1, 1], [1, 1, 0]], // S
      [[0, 1, 0], [1, 1, 1]], // T
      [[1, 1, 0], [0, 1, 1]]  // Z
    ];
    this.colors = ['#00aaaa', '#0000aa', '#aa5500', '#ffff55', '#00aa00', '#aa00aa', '#aa0000'];

    this.curPiece = null;
    this.curX = 0;
    this.curY = 0;
    this.curColor = '';

    this.initEvents();
    this.reset();
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      if (!this.isRunning) return;
      if (e.code === 'ArrowLeft') this.move(-1);
      if (e.code === 'ArrowRight') this.move(1);
      if (e.code === 'ArrowDown') this.drop();
      if (e.code === 'ArrowUp') this.rotate();
    });
  }

  reset() {
    this.grid = Array(this.rows).fill(0).map(() => Array(this.cols).fill(0));
    this.score = 0;
    this.updateScore();
    this.spawnPiece();
    this.draw();
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.interval = setInterval(() => this.drop(), 600);
    }
  }

  stop() {
    this.isRunning = false;
    clearInterval(this.interval);
  }

  spawnPiece() {
    const idx = Math.floor(Math.random() * this.pieces.length);
    this.curPiece = this.pieces[idx];
    this.curColor = this.colors[idx];
    this.curX = Math.floor((this.cols - this.curPiece[0].length) / 2);
    this.curY = 0;

    if (this.collision(this.curX, this.curY, this.curPiece)) {
      this.stop();
      window.soundEngine.playDefeat();
      alert(`Partie terminée ! Score : ${this.score}`);
      this.reset();
    }
  }

  collision(x, y, piece) {
    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece[r].length; c++) {
        if (piece[r][c]) {
          const nx = x + c;
          const ny = y + r;
          if (nx < 0 || nx >= this.cols || ny >= this.rows) return true;
          if (ny >= 0 && this.grid[ny][nx]) return true;
        }
      }
    }
    return false;
  }

  move(dir) {
    if (!this.collision(this.curX + dir, this.curY, this.curPiece)) {
      this.curX += dir;
      window.soundEngine.playClick();
      this.draw();
    }
  }

  rotate() {
    const rotated = this.curPiece[0].map((_, i) => this.curPiece.map(row => row[i]).reverse());
    if (!this.collision(this.curX, this.curY, rotated)) {
      this.curPiece = rotated;
      window.soundEngine.beep(550, 0.03);
      this.draw();
    }
  }

  drop() {
    if (!this.collision(this.curX, this.curY + 1, this.curPiece)) {
      this.curY++;
    } else {
      // Bloquer pièce
      for (let r = 0; r < this.curPiece.length; r++) {
        for (let c = 0; c < this.curPiece[r].length; c++) {
          if (this.curPiece[r][c]) {
            this.grid[this.curY + r][this.curX + c] = this.curColor;
          }
        }
      }
      window.soundEngine.playPaddleHit();
      this.clearLines();
      this.spawnPiece();
    }
    this.draw();
  }

  clearLines() {
    for (let r = this.rows - 1; r >= 0; r--) {
      if (this.grid[r].every(c => c !== 0)) {
        this.grid.splice(r, 1);
        this.grid.unshift(Array(this.cols).fill(0));
        this.score += 100;
        this.updateScore();
        window.soundEngine.beep(880, 0.08);
        r++;
      }
    }
  }

  updateScore() {
    if (this.scoreEl) this.scoreEl.textContent = `SCORE : ${this.score}`;
  }

  draw() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Grille fixe
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c]) {
          this.ctx.fillStyle = this.grid[r][c];
          this.ctx.fillRect(c * this.cellSize, r * this.cellSize, this.cellSize - 1, this.cellSize - 1);
        }
      }
    }

    // Pièce en cours
    if (this.curPiece) {
      this.ctx.fillStyle = this.curColor;
      for (let r = 0; r < this.curPiece.length; r++) {
        for (let c = 0; c < this.curPiece[r].length; c++) {
          if (this.curPiece[r][c]) {
            this.ctx.fillRect((this.curX + c) * this.cellSize, (this.curY + r) * this.cellSize, this.cellSize - 1, this.cellSize - 1);
          }
        }
      }
    }
  }
}

// --------------------------------------------------------------------------
// 4. ASTEROIDS VECTORIEL
// --------------------------------------------------------------------------
class AsteroidsGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.width = this.canvas.width = 360;
    this.height = this.canvas.height = 300;

    this.ship = { x: 180, y: 150, angle: 0, vx: 0, vy: 0 };
    this.lasers = [];
    this.asteroids = [];
    this.keys = {};
    this.isRunning = false;

    this.initEvents();
    this.reset();
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'Space' && this.isRunning) {
        this.fire();
      }
    });
    window.addEventListener('keyup', (e) => { this.keys[e.code] = false; });
  }

  reset() {
    this.ship = { x: 180, y: 150, angle: 0, vx: 0, vy: 0 };
    this.lasers = [];
    this.asteroids = [];
    for (let i = 0; i < 4; i++) {
      this.asteroids.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        r: 20
      });
    }
    this.draw();
  }

  fire() {
    const rad = this.ship.angle * Math.PI / 180;
    this.lasers.push({
      x: this.ship.x + Math.cos(rad) * 14,
      y: this.ship.y + Math.sin(rad) * 14,
      vx: Math.cos(rad) * 6,
      vy: Math.sin(rad) * 6,
      life: 40
    });
    window.soundEngine.beep(900, 0.03);
  }

  update() {
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) this.ship.angle -= 5;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) this.ship.angle += 5;

    if (this.keys['ArrowUp'] || this.keys['KeyW']) {
      const rad = this.ship.angle * Math.PI / 180;
      this.ship.vx += Math.cos(rad) * 0.15;
      this.ship.vy += Math.sin(rad) * 0.15;
    }

    // Inertie
    this.ship.vx *= 0.98;
    this.ship.vy *= 0.98;
    this.ship.x += this.ship.vx;
    this.ship.y += this.ship.vy;

    // Screen wrap
    if (this.ship.x < 0) this.ship.x = this.width;
    if (this.ship.x > this.width) this.ship.x = 0;
    if (this.ship.y < 0) this.ship.y = this.height;
    if (this.ship.y > this.height) this.ship.y = 0;

    // Lasers
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const l = this.lasers[i];
      l.x += l.vx; l.y += l.vy;
      l.life--;
      if (l.life <= 0) this.lasers.splice(i, 1);
    }

    // Astéroïdes
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const a = this.asteroids[i];
      a.x = (a.x + a.vx + this.width) % this.width;
      a.y = (a.y + a.vy + this.height) % this.height;

      // Collision laser
      for (let j = this.lasers.length - 1; j >= 0; j--) {
        const l = this.lasers[j];
        if (Math.hypot(a.x - l.x, a.y - l.y) < a.r) {
          window.soundEngine.playExplosion();
          this.lasers.splice(j, 1);
          if (a.r > 10) {
            this.asteroids.push({ x: a.x, y: a.y, vx: a.vx + 1, vy: a.vy - 1, r: a.r / 2 });
            this.asteroids.push({ x: a.x, y: a.y, vx: a.vx - 1, vy: a.vy + 1, r: a.r / 2 });
          }
          this.asteroids.splice(i, 1);
          break;
        }
      }
    }
  }

  draw() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Vaisseau
    this.ctx.save();
    this.ctx.translate(this.ship.x, this.ship.y);
    this.ctx.rotate(this.ship.angle * Math.PI / 180);
    this.ctx.strokeStyle = '#ffff55';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(12, 0);
    this.ctx.lineTo(-8, -7);
    this.ctx.lineTo(-4, 0);
    this.ctx.lineTo(-8, 7);
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.restore();

    // Lasers
    this.ctx.fillStyle = '#55ffff';
    for (const l of this.lasers) {
      this.ctx.fillRect(l.x - 1, l.y - 1, 3, 3);
    }

    // Astéroïdes
    this.ctx.strokeStyle = '#aaaaaa';
    for (const a of this.asteroids) {
      this.ctx.strokeRect(a.x - a.r, a.y - a.r, a.r * 2, a.r * 2);
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

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }
}

// --------------------------------------------------------------------------
// 5. SPACE INVADERS
// --------------------------------------------------------------------------
class SpaceInvadersGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.width = this.canvas.width = 340;
    this.height = this.canvas.height = 300;

    this.playerX = 170;
    this.bullets = [];
    this.invaders = [];
    this.invaderDir = 1;
    this.isRunning = false;

    this.initEvents();
    this.reset();
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      if (!this.isRunning) return;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.playerX = Math.max(10, this.playerX - 10);
      if (e.code === 'ArrowRight' || e.code === 'KeyD') this.playerX = Math.min(this.width - 20, this.playerX + 10);
      if (e.code === 'Space') {
        this.bullets.push({ x: this.playerX + 6, y: this.height - 25 });
        window.soundEngine.beep(800, 0.04);
      }
    });
  }

  reset() {
    this.playerX = 170;
    this.bullets = [];
    this.invaders = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 6; c++) {
        this.invaders.push({ x: c * 40 + 40, y: r * 30 + 30, alive: true });
      }
    }
    this.draw();
  }

  update() {
    let hitEdge = false;
    for (const inv of this.invaders) {
      if (!inv.alive) continue;
      inv.x += this.invaderDir * 1.5;
      if (inv.x > this.width - 25 || inv.x < 10) hitEdge = true;
    }

    if (hitEdge) {
      this.invaderDir = -this.invaderDir;
      for (const inv of this.invaders) inv.y += 12;
    }

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.y -= 5;
      for (const inv of this.invaders) {
        if (inv.alive && Math.abs(b.x - (inv.x + 8)) < 10 && Math.abs(b.y - inv.y) < 10) {
          inv.alive = false;
          this.bullets.splice(i, 1);
          window.soundEngine.playExplosion();
          break;
        }
      }
    }
  }

  draw() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Joueur
    this.ctx.fillStyle = '#00aa00';
    this.ctx.fillRect(this.playerX, this.height - 20, 16, 10);

    // Projectiles
    this.ctx.fillStyle = '#ffff55';
    for (const b of this.bullets) {
      this.ctx.fillRect(b.x, b.y, 2, 6);
    }

    // Invaders (Feds)
    this.ctx.fillStyle = '#55ffff';
    for (const inv of this.invaders) {
      if (inv.alive) {
        this.ctx.fillRect(inv.x, inv.y, 16, 12);
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(inv.x + 2, inv.y + 4, 12, 3); // Lunettes
        this.ctx.fillStyle = '#55ffff';
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
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }
}

window.BreakoutGame = BreakoutGame;
window.FlappyGame = FlappyGame;
window.TetrisGame = TetrisGame;
window.AsteroidsGame = AsteroidsGame;
window.SpaceInvadersGame = SpaceInvadersGame;
