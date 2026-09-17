// ==========================================================================
// TEMPLEOS FLIGHT SIMULATOR ("TERRY'S GOD FLIGHT 3D")
// Vol 3D fil de fer basse résolution au-dessus de montagnes sacrées et pyramides
// ==========================================================================

class FlightSimGame {
  constructor(canvasId, statusId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.statusEl = document.getElementById(statusId);

    this.width = this.canvas.width = 440;
    this.height = this.canvas.height = 300;

    // Avion
    this.x = 0;
    this.y = 120;
    this.z = 0;
    this.pitch = 0;
    this.yaw = 0;
    this.roll = 0;
    this.speed = 3.5;

    this.keys = {};
    this.isRunning = false;
    this.animId = null;

    this.initEvents();
    this.render();
  }

  initEvents() {
    const setKey = (code, key, val) => {
      const k = (key || '').toLowerCase();
      const c = code || '';
      if (['w', 'z', 'arrowup'].includes(k) || ['KeyW', 'KeyZ', 'ArrowUp'].includes(c)) this.keys['pitchDown'] = val;
      if (['s', 'arrowdown'].includes(k) || ['KeyS', 'ArrowDown'].includes(c)) this.keys['pitchUp'] = val;
      if (['a', 'q', 'arrowleft'].includes(k) || ['KeyA', 'KeyQ', 'ArrowLeft'].includes(c)) this.keys['rollLeft'] = val;
      if (['d', 'arrowright'].includes(k) || ['KeyD', 'ArrowRight'].includes(c)) this.keys['rollRight'] = val;
    };

    window.addEventListener('keydown', (e) => setKey(e.code, e.key, true));
    window.addEventListener('keyup', (e) => setKey(e.code, e.key, false));

    if (this.canvas) {
      this.canvas.addEventListener('click', () => {
        if (!this.isRunning) {
          this.start();
        }
      });
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
    // Commandes de vol (AZERTY & QWERTY & Flèches)
    if (this.keys['pitchDown']) this.pitch = Math.max(-0.5, this.pitch - 0.02);
    else if (this.keys['pitchUp']) this.pitch = Math.min(0.5, this.pitch + 0.02);
    else this.pitch *= 0.95;

    if (this.keys['rollLeft']) {
      this.roll = Math.max(-0.6, this.roll - 0.03);
      this.yaw -= 0.025;
    } else if (this.keys['rollRight']) {
      this.roll = Math.min(0.6, this.roll + 0.03);
      this.yaw += 0.025;
    } else {
      this.roll *= 0.92;
    }

    this.x += Math.sin(this.yaw) * this.speed;
    this.z += Math.cos(this.yaw) * this.speed;
    this.y += Math.sin(-this.pitch) * this.speed;
    this.y = Math.max(30, Math.min(300, this.y));

    if (this.statusEl) {
      this.statusEl.textContent = `ALT: ${Math.floor(this.y * 10)}m | CAP: ${Math.floor((this.yaw * 180 / Math.PI) % 360)}° | VITESSE: ${Math.floor(this.speed * 40)} KTS`;
    }
  }

  draw() {
    this.ctx.fillStyle = '#000022';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Ligne d'horizon artificielle
    const horizonY = this.height / 2 + this.pitch * 140;
    this.ctx.save();
    this.ctx.translate(this.width / 2, horizonY);
    this.ctx.rotate(this.roll);

    this.ctx.strokeStyle = '#55ffff';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(-250, 0);
    this.ctx.lineTo(250, 0);
    this.ctx.stroke();

    // Rendu du terrain fil de fer 3D sous l'horizon
    this.ctx.strokeStyle = '#55ff55';
    this.ctx.lineWidth = 1;

    for (let d = 20; d <= 200; d += 25) {
      const screenY = (d / 200) * 120;
      this.ctx.beginPath();
      this.ctx.moveTo(-200, screenY);
      this.ctx.lineTo(200, screenY);
      this.ctx.stroke();
    }

    for (let col = -150; col <= 150; col += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(col * 0.2, 0);
      this.ctx.lineTo(col * 1.6, 120);
      this.ctx.stroke();
    }

    // Pyramide fil de fer visible au loin
    this.ctx.strokeStyle = '#ffff55';
    this.ctx.beginPath();
    this.ctx.moveTo(0, -35);
    this.ctx.lineTo(-40, 20);
    this.ctx.lineTo(40, 20);
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.restore();

    // Réticule de visée de vol
    this.ctx.strokeStyle = '#ffff55';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(this.width / 2, this.height / 2, 10, 0, Math.PI * 2);
    this.ctx.moveTo(this.width / 2 - 20, this.height / 2);
    this.ctx.lineTo(this.width / 2 + 20, this.height / 2);
    this.ctx.stroke();
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

window.FlightSimGame = FlightSimGame;
