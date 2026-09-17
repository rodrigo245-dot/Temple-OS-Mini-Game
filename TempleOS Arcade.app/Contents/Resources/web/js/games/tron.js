// ==========================================================================
// TRON LIGHTCYCLES - TRON_LIGHTCYCLES.HC (2 JOUEURS LOCAL)
// Deux motos de lumière sacrées s'affrontent et laissent un mur mortel
// Joueur 1 : ZQSD (Cyan) | Joueur 2 : Flèches (Jaune)
// ==========================================================================

class TronGame {
  constructor(canvasId, statusId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.statusEl = document.getElementById(statusId);

    this.cols = 50;
    this.rows = 40;
    this.cellSize = 8; // 400x320
    this.canvas.width = this.cols * this.cellSize;
    this.canvas.height = this.rows * this.cellSize;

    this.grid = [];
    this.p1 = { x: 10, y: 20, dx: 1, dy: 0, color: '#55ffff', alive: true };
    this.p2 = { x: 40, y: 20, dx: -1, dy: 0, color: '#ffff55', alive: true };

    this.isRunning = false;
    this.interval = null;

    this.initEvents();
    this.reset();
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      // Joueur 1 (ZQSD / WASD)
      if ((e.code === 'KeyW') && this.p1.dy === 0) { this.p1.dx = 0; this.p1.dy = -1; }
      if ((e.code === 'KeyS') && this.p1.dy === 0) { this.p1.dx = 0; this.p1.dy = 1; }
      if ((e.code === 'KeyA') && this.p1.dx === 0) { this.p1.dx = -1; this.p1.dy = 0; }
      if ((e.code === 'KeyD') && this.p1.dx === 0) { this.p1.dx = 1; this.p1.dy = 0; }

      // Joueur 2 (Flèches)
      if ((e.code === 'ArrowUp') && this.p2.dy === 0) { this.p2.dx = 0; this.p2.dy = -1; }
      if ((e.code === 'ArrowDown') && this.p2.dy === 0) { this.p2.dx = 0; this.p2.dy = 1; }
      if ((e.code === 'ArrowLeft') && this.p2.dx === 0) { this.p2.dx = -1; this.p2.dy = 0; }
      if ((e.code === 'ArrowRight') && this.p2.dx === 0) { this.p2.dx = 1; this.p2.dy = 0; }
    });
  }

  reset() {
    this.stop();
    this.grid = Array(this.rows).fill(0).map(() => Array(this.cols).fill(0));
    this.p1 = { x: 10, y: 20, dx: 1, dy: 0, color: '#55ffff', alive: true };
    this.p2 = { x: 40, y: 20, dx: -1, dy: 0, color: '#ffff55', alive: true };
    this.grid[this.p1.y][this.p1.x] = 1;
    this.grid[this.p2.y][this.p2.x] = 2;
    if (this.statusEl) this.statusEl.textContent = "JOUEUR 1 (CYAN: ZQSD) vs JOUEUR 2 (JAUNE: FLÈCHES)";
    this.draw();
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.interval = setInterval(() => this.tick(), 65);
    }
  }

  stop() {
    this.isRunning = false;
    if (this.interval) clearInterval(this.interval);
  }

  tick() {
    const n1 = { x: this.p1.x + this.p1.dx, y: this.p1.y + this.p1.dy };
    const n2 = { x: this.p2.x + this.p2.dx, y: this.p2.y + this.p2.dy };

    // Vérifier collisions
    const p1Dead = n1.x < 0 || n1.x >= this.cols || n1.y < 0 || n1.y >= this.rows || this.grid[n1.y][n1.x] !== 0;
    const p2Dead = n2.x < 0 || n2.x >= this.cols || n2.y < 0 || n2.y >= this.rows || this.grid[n2.y][n2.x] !== 0;

    if (p1Dead && p2Dead) {
      this.endGame("DOUBLE CRASH ! ÉGALITÉ PARFAITE !");
      return;
    } else if (p1Dead) {
      this.endGame("🏆 JOUEUR 2 (JAUNE) TRIOMPHE DE LA LUMIÈRE !");
      return;
    } else if (p2Dead) {
      this.endGame("🏆 JOUEUR 1 (CYAN) TRIOMPHE DE LA LUMIÈRE !");
      return;
    }

    this.p1.x = n1.x; this.p1.y = n1.y;
    this.p2.x = n2.x; this.p2.y = n2.y;
    this.grid[n1.y][n1.x] = 1;
    this.grid[n2.y][n2.x] = 2;

    this.draw();
  }

  endGame(msg) {
    this.stop();
    window.soundEngine.playExplosion();
    if (this.statusEl) this.statusEl.textContent = msg;
    if (window.achievementsManager) window.achievementsManager.unlock('first_win');
  }

  draw() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] === 1) {
          this.ctx.fillStyle = '#55ffff';
          this.ctx.fillRect(c * this.cellSize, r * this.cellSize, this.cellSize, this.cellSize);
        } else if (this.grid[r][c] === 2) {
          this.ctx.fillStyle = '#ffff55';
          this.ctx.fillRect(c * this.cellSize, r * this.cellSize, this.cellSize, this.cellSize);
        }
      }
    }
  }
}

window.TronGame = TronGame;
