// ==========================================================================
// HOLY PONG - PING PONG SACRÉ (TEMPLEOS V2.0)
// Avec sélecteur de difficulté (Facile, Normal, Difficile, Troll Ring-0)
// ==========================================================================

class HolyPong {
  constructor(canvasId, commentId, scorePlayerId, scoreCpuId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.commentEl = document.getElementById(commentId);
    this.scorePlayerEl = document.getElementById(scorePlayerId);
    this.scoreCpuEl = document.getElementById(scoreCpuId);

    this.width = this.canvas.width = 480;
    this.height = this.canvas.height = 300;

    this.paddleHeight = 60;
    this.paddleWidth = 10;
    this.ballSize = 10;

    this.playerY = this.height / 2 - this.paddleHeight / 2;
    this.cpuY = this.height / 2 - this.paddleHeight / 2;

    this.ballX = this.width / 2;
    this.ballY = this.height / 2;
    this.ballSpeedX = 4;
    this.ballSpeedY = 2;

    this.difficulty = 'normal'; // 'facile', 'normal', 'difficile', 'troll'
    this.cpuSpeed = 3.8;
    this.errorMargin = 25;
    this.baseSpeed = 4;

    this.playerScore = 0;
    this.cpuScore = 0;
    this.maxScore = 7;
    this.isRunning = false;
    this.mode = '1p'; // '1p' ou '2p'

    this.keys = {};
    this.animId = null;

    this.initEvents();
  }

  setDifficulty(level) {
    this.difficulty = level;
    switch (level) {
      case 'facile':
        this.cpuSpeed = 2.2;
        this.errorMargin = 45;
        this.paddleHeight = 75;
        this.baseSpeed = 3.2;
        break;
      case 'normal':
        this.cpuSpeed = 3.8;
        this.errorMargin = 22;
        this.paddleHeight = 60;
        this.baseSpeed = 4.2;
        break;
      case 'difficile':
        this.cpuSpeed = 5.2;
        this.errorMargin = 8;
        this.paddleHeight = 52;
        this.baseSpeed = 5.6;
        break;
      case 'troll':
        this.cpuSpeed = 6.4;
        this.errorMargin = 2;
        this.paddleHeight = 45;
        this.baseSpeed = 6.5;
        break;
    }

    // Mise à jour visuelle des boutons de difficulté
    const btns = document.querySelectorAll('#win-pong .diff-btn');
    btns.forEach(b => {
      b.classList.toggle('active', b.dataset.diff === level);
    });

    if (this.commentEl) {
      const labels = {
        facile: "NIVEAU : RECRUE CIA (FACILE) - LA BALLE EST DOUCE.",
        normal: "NIVEAU : AGENT FÉDÉRAL (NORMAL) - COMBAT STANDARD.",
        difficile: "NIVEAU : DIRECTEUR FBI (DIFFICILE) - RÉFLEXES SURHUMAINS !",
        troll: "NIVEAU : TROLL DIVIN [SYS] - ATTENTION AUX ÉCLAIRS DU RING-0 !"
      };
      this.commentEl.textContent = labels[level] || "";
    }
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      this.playerY = Math.max(0, Math.min(this.height - this.paddleHeight, mouseY - this.paddleHeight / 2));
    });
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.resetBall();
      this.loop();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  reset() {
    this.playerScore = 0;
    this.cpuScore = 0;
    this.updateScoreHud();
    this.resetBall();
    this.start();
  }

  resetBall() {
    this.ballX = this.width / 2;
    this.ballY = this.height / 2;
    const dir = (Math.random() > 0.5 ? 1 : -1);
    this.ballSpeedX = dir * this.baseSpeed;
    this.ballSpeedY = (Math.random() * 4 - 2);
  }

  updateScoreHud() {
    if (this.scorePlayerEl) this.scorePlayerEl.textContent = this.playerScore;
    if (this.scoreCpuEl) this.scoreCpuEl.textContent = this.cpuScore;
  }

  update() {
    // Clavier Joueur 1
    if (this.keys['KeyW'] || this.keys['ArrowUp']) {
      this.playerY = Math.max(0, this.playerY - 6);
    }
    if (this.keys['KeyS'] || this.keys['ArrowDown']) {
      this.playerY = Math.min(this.height - this.paddleHeight, this.playerY + 6);
    }

    // Déplacement CPU
    if (this.mode === '1p') {
      const cpuCenter = this.cpuY + this.paddleHeight / 2;
      if (this.ballX > this.width / 3) {
        if (cpuCenter < this.ballY - this.errorMargin) {
          this.cpuY = Math.min(this.height - this.paddleHeight, this.cpuY + this.cpuSpeed);
        } else if (cpuCenter > this.ballY + this.errorMargin) {
          this.cpuY = Math.max(0, this.cpuY - this.cpuSpeed);
        }
      }
    } else {
      if (this.keys['KeyI']) this.cpuY = Math.max(0, this.cpuY - 6);
      if (this.keys['KeyK']) this.cpuY = Math.min(this.height - this.paddleHeight, this.cpuY + 6);
    }

    // Troll Ring-0 : Miracle impromptu
    if (this.difficulty === 'troll' && Math.random() < 0.005) {
      this.ballSpeedY = -this.ballSpeedY * 1.2;
      this.ballSpeedX = -this.ballSpeedX;
      window.soundEngine.playHolyMiracle();
      if (this.commentEl) {
        this.commentEl.textContent = "[SYS] DIEU A TÉLÉPORTÉ LA BALLE EN PLEIN VOL !";
      }
    }

    // Déplacement
    this.ballX += this.ballSpeedX;
    this.ballY += this.ballSpeedY;

    // Murs
    if (this.ballY <= 0 || this.ballY + this.ballSize >= this.height) {
      this.ballSpeedY = -this.ballSpeedY;
      window.soundEngine.playWallHit();
    }

    // Raquette Joueur
    if (
      this.ballX <= 25 &&
      this.ballX >= 15 &&
      this.ballY + this.ballSize >= this.playerY &&
      this.ballY <= this.playerY + this.paddleHeight
    ) {
      this.ballSpeedX = Math.abs(this.ballSpeedX) * 1.05;
      const hitOffset = (this.ballY + this.ballSize / 2) - (this.playerY + this.paddleHeight / 2);
      this.ballSpeedY = hitOffset * 0.2;
      window.soundEngine.playPaddleHit();
    }

    // Raquette Droite
    if (
      this.ballX + this.ballSize >= this.width - 25 &&
      this.ballX + this.ballSize <= this.width - 15 &&
      this.ballY + this.ballSize >= this.cpuY &&
      this.ballY <= this.cpuY + this.paddleHeight
    ) {
      this.ballSpeedX = -Math.abs(this.ballSpeedX) * 1.05;
      const hitOffset = (this.ballY + this.ballSize / 2) - (this.cpuY + this.paddleHeight / 2);
      this.ballSpeedY = hitOffset * 0.2;
      window.soundEngine.playPaddleHit();
    }

    // Points
    if (this.ballX > this.width) {
      this.playerScore++;
      this.updateScoreHud();
      window.soundEngine.playScore();
      if (this.commentEl) {
        this.commentEl.textContent = window.godOracle.getComment('pong_score_player');
      }
      this.checkEnd();
      this.resetBall();
    }

    if (this.ballX < -this.ballSize) {
      this.cpuScore++;
      this.updateScoreHud();
      window.soundEngine.playScore();
      if (this.commentEl) {
        this.commentEl.textContent = window.godOracle.getComment('pong_score_cpu');
      }
      this.checkEnd();
      this.resetBall();
    }
  }

  checkEnd() {
    if (this.playerScore >= this.maxScore) {
      this.stop();
      window.soundEngine.playVictory();
      if (this.commentEl) {
        this.commentEl.textContent = "[TOP] VICTOIRE BÉNIE DU FIDÈLE ! LE COMPILATEUR DIVIN TRIOMPHE !";
      }
    } else if (this.cpuScore >= this.maxScore) {
      this.stop();
      window.soundEngine.playDefeat();
      if (this.commentEl) {
        this.commentEl.textContent = "[ERR] LES AGENTS DE LA CIA ONT GAGNÉ ! PURIFICATION CONSEILLÉE !";
      }
    }
  }

  draw() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Ligne centrale
    this.ctx.strokeStyle = this.difficulty === 'troll' ? '#ff5555' : '#00aaaa';
    this.ctx.setLineDash([8, 6]);
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(this.width / 2, 0);
    this.ctx.lineTo(this.width / 2, this.height);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Raquette Joueur
    this.ctx.fillStyle = '#ffff55';
    this.ctx.fillRect(15, this.playerY, this.paddleWidth, this.paddleHeight);

    // Raquette CPU
    this.ctx.fillStyle = this.difficulty === 'troll' ? '#ff55ff' : '#ff5555';
    this.ctx.fillRect(this.width - 25, this.cpuY, this.paddleWidth, this.paddleHeight);

    // Balle
    this.ctx.fillStyle = this.difficulty === 'troll' ? '#ffff55' : '#ffffff';
    this.ctx.fillRect(this.ballX, this.ballY, this.ballSize, this.ballSize);
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }
}

window.HolyPong = HolyPong;
