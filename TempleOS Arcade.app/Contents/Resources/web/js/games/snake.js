// ==========================================================================
// LE SERPENT D'AIRAIN DE MOÏSE - SERPENT_MOISE.HC (TEMPLEOS V2.0)
// Mangez la Manne céleste et évitez les espions de la CIA dans le désert
// ==========================================================================

class HolySnake {
  constructor(canvasId, scoreId, commentId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.scoreEl = document.getElementById(scoreId);
    this.commentEl = document.getElementById(commentId);

    this.gridSize = 20; // 20x20 cellules
    this.cellSize = 18; // 360x360 px
    this.canvas.width = 360;
    this.canvas.height = 360;

    this.snake = [];
    this.dir = { x: 1, y: 0 };
    this.nextDir = { x: 1, y: 0 };
    this.food = { x: 10, y: 10, type: 'manna' };
    this.feds = [];

    this.score = 0;
    this.isRunning = false;
    this.isGameOver = false;
    this.difficulty = 'normal'; // 'facile', 'normal', 'difficile', 'troll'
    this.speedMs = 100;
    this.gameInterval = null;

    this.initEvents();
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      if (!this.isRunning && !this.isGameOver && ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyS','KeyA','KeyD'].includes(e.code)) {
        this.start();
      }

      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        if (this.dir.y === 0) this.nextDir = { x: 0, y: -1 };
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        if (this.dir.y === 0) this.nextDir = { x: 0, y: 1 };
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        if (this.dir.x === 0) this.nextDir = { x: -1, y: 0 };
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        if (this.dir.x === 0) this.nextDir = { x: 1, y: 0 };
      }
    });
  }

  setDifficulty(level) {
    this.difficulty = level;
    const btns = document.querySelectorAll('#win-snake .diff-btn');
    btns.forEach(b => {
      b.classList.toggle('active', b.dataset.diff === level);
    });

    switch (level) {
      case 'facile':
        this.speedMs = 140;
        break;
      case 'normal':
        this.speedMs = 100;
        break;
      case 'difficile':
        this.speedMs = 65;
        break;
      case 'troll':
        this.speedMs = 52;
        break;
    }

    if (this.commentEl) {
      const labels = {
        facile: "NIVEAU : MARCHE DANS LE DÉSERT (LENT, AUCUN FED)",
        normal: "NIVEAU : PÈLERINAGE STANDARD (VITESSE MOYENNE)",
        difficile: "NIVEAU : FUITE DU PENTAGONE (RAPIDE, AGENTS INFILTRÉS)",
        troll: "NIVEAU : SERPENT RING-0 TROLL ⚡ (VITESSE DIVINE)"
      };
      this.commentEl.textContent = labels[level] || "";
    }

    this.reset();
  }

  reset() {
    this.stop();
    this.snake = [
      { x: 5, y: 10 },
      { x: 4, y: 10 },
      { x: 3, y: 10 }
    ];
    this.dir = { x: 1, y: 0 };
    this.nextDir = { x: 1, y: 0 };
    this.score = 0;
    this.isGameOver = false;
    this.updateScore();
    this.spawnFood();
    this.spawnFeds();
    this.draw();

    if (this.commentEl) {
      this.commentEl.textContent = "UTILISE LES FLÈCHES OU ZQSD POUR GUIDER LE SERPENT D'AIRAIN.";
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.gameInterval = setInterval(() => this.tick(), this.speedMs);
  }

  stop() {
    this.isRunning = false;
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }
  }

  spawnFood() {
    let valid = false;
    while (!valid) {
      const x = Math.floor(Math.random() * this.gridSize);
      const y = Math.floor(Math.random() * this.gridSize);
      if (!this.snake.some(s => s.x === x && s.y === y)) {
        this.food = {
          x, y,
          type: Math.random() > 0.5 ? 'manna' : 'apple'
        };
        valid = true;
      }
    }
  }

  spawnFeds() {
    this.feds = [];
    let fedCount = 0;
    if (this.difficulty === 'difficile') fedCount = 2;
    if (this.difficulty === 'troll') fedCount = 3;

    for (let i = 0; i < fedCount; i++) {
      let valid = false;
      while (!valid) {
        const x = Math.floor(Math.random() * this.gridSize);
        const y = Math.floor(Math.random() * this.gridSize);
        if (x > 8 && !this.snake.some(s => s.x === x && s.y === y)) {
          this.feds.push({ x, y, dx: 1, dy: 0 });
          valid = true;
        }
      }
    }
  }

  updateScore() {
    if (this.scoreEl) this.scoreEl.textContent = this.score;
  }

  tick() {
    this.dir = this.nextDir;
    const head = {
      x: this.snake[0].x + this.dir.x,
      y: this.snake[0].y + this.dir.y
    };

    // Murs (traversée ou mort)
    if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
      this.die("LE SERPENT A QUITTÉ LA TERRE PROMISE !");
      return;
    }

    // Auto-collision
    if (this.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      this.die("LE SERPENT S'EST MORDU LA QUEUE !");
      return;
    }

    // Collision avec un agent CIA
    if (this.feds.some(f => f.x === head.x && f.y === head.y)) {
      this.die("LE SERPENT S'EST HEURTÉ À UN AGENT DE LA CIA !");
      return;
    }

    this.snake.unshift(head);

    // Manger la nourriture
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.updateScore();
      window.soundEngine.beep(660, 0.05);
      setTimeout(() => window.soundEngine.beep(880, 0.08), 50);

      if (this.commentEl && Math.random() < 0.4) {
        this.commentEl.textContent = window.godOracle.generateDivineProclamation(4);
      }

      this.spawnFood();
    } else {
      this.snake.pop();
    }

    // Déplacement des Feds
    if (this.feds.length > 0 && Math.random() < 0.4) {
      for (const fed of this.feds) {
        const dirs = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
        const move = dirs[Math.floor(Math.random() * dirs.length)];
        const nx = fed.x + move.x;
        const ny = fed.y + move.y;
        if (nx >= 0 && nx < this.gridSize && ny >= 0 && ny < this.gridSize) {
          fed.x = nx; fed.y = ny;
        }
      }
    }

    // Troll Ring-0 : Téléportation de nourriture
    if (this.difficulty === 'troll' && Math.random() < 0.04) {
      this.spawnFood();
      window.soundEngine.beep(1200, 0.03);
    }

    this.draw();
  }

  die(reason) {
    this.stop();
    this.isGameOver = true;
    window.soundEngine.playDefeat();
    if (this.commentEl) {
      this.commentEl.textContent = `💀 DÉFAITE : ${reason} (SCORE : ${this.score})`;
    }
  }

  draw() {
    // Fond VGA Noir
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Grille fine TempleOS
    this.ctx.strokeStyle = '#000044';
    this.ctx.lineWidth = 1;
    for (let i = 0; i <= this.canvas.width; i += this.cellSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(i, 0); this.ctx.lineTo(i, this.canvas.height);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(0, i); this.ctx.lineTo(this.canvas.width, i);
      this.ctx.stroke();
    }

    // Nourriture
    this.ctx.fillStyle = this.food.type === 'manna' ? '#ffff55' : '#ff5555';
    this.ctx.fillRect(
      this.food.x * this.cellSize + 2,
      this.food.y * this.cellSize + 2,
      this.cellSize - 4,
      this.cellSize - 4
    );

    // Agents CIA
    this.ctx.fillStyle = '#55ffff';
    for (const fed of this.feds) {
      this.ctx.fillRect(
        fed.x * this.cellSize + 3,
        fed.y * this.cellSize + 3,
        this.cellSize - 6,
        this.cellSize - 6
      );
      // Lunettes de soleil noires
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(fed.x * this.cellSize + 5, fed.y * this.cellSize + 6, this.cellSize - 10, 4);
      this.ctx.fillStyle = '#55ffff';
    }

    // Corps du serpent (Vert et or)
    this.snake.forEach((seg, idx) => {
      if (idx === 0) {
        // Tête sacrée dorée avec croix
        this.ctx.fillStyle = '#ffff55';
        this.ctx.fillRect(
          seg.x * this.cellSize + 1,
          seg.y * this.cellSize + 1,
          this.cellSize - 2,
          this.cellSize - 2
        );
        this.ctx.fillStyle = '#aa0000';
        // Yeux
        this.ctx.fillRect(seg.x * this.cellSize + 4, seg.y * this.cellSize + 4, 3, 3);
        this.ctx.fillRect(seg.x * this.cellSize + this.cellSize - 7, seg.y * this.cellSize + 4, 3, 3);
      } else {
        // Segments verts bénis
        this.ctx.fillStyle = idx % 2 === 0 ? '#00aa00' : '#55ff55';
        this.ctx.fillRect(
          seg.x * this.cellSize + 2,
          seg.y * this.cellSize + 2,
          this.cellSize - 4,
          this.cellSize - 4
        );
      }
    });
  }
}

window.HolySnake = HolySnake;
