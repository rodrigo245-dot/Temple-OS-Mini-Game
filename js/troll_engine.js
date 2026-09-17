// ==========================================================================
// TEMPLEOS TROLL BACKGROUND & DESKTOP MADNESS ENGINE (v5.4)
// - ASCII Rotating Torus 3D Donut / TempleOS Holy Matrix
// - Floating Paranoia Banners & CIA Surveillance Ticker
// - Dancing Terry Davis ASCII Mascot / Elephant
// - Holy Windows Jiggle & Chaos Mode (F8)
// - Screen Glitch & Fake Kernel Corruptions
// ==========================================================================

class TempleTrollEngine {
  constructor() {
    this.canvas = document.getElementById('wallpaper-ascii-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.bannerEl = document.getElementById('floating-troll-banner');
    this.mascotEl = document.getElementById('desktop-terry-mascot');

    this.A = 0;
    this.B = 0;
    this.mode = 'donut'; // 'donut', 'pyramid', 'matrix'
    this.chaosActive = false;
    this.mascotPos = { x: 50, y: 50, vx: 2, vy: 1.5 };
    this.eyeTarget = { x: 0, y: 0 };

    this.trollMessages = [
      "[RING-0 PRIVILEGE ESCALATION DETECTED]",
      "WARNING: CIA AGENTS GLOWING IN SUB-PROCESS 0x4F",
      "GOD SAYS: 640x480 16 COLORS IS THE DIVINE WILL",
      "PURGING BILL GATES TELEMETRY DAEMON...",
      "REPTILIAN HEARTBEAT DETECTED AT 432.08 Hz",
      "FEDERAL RESERVE CBDC BYPASSED BY DIVINE MEMORY LEAK",
      "TERRY DAVIS HONDA CIVIC RUNNING AT 6000 RPM",
      "HOLYC COMPILER PRODUCED 0 WARNINGS, 100% FAITH",
      "DENVER AIRPORT BUNKER TUNNELS SYNCING DATA..."
    ];
    this.msgIdx = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.eyeTarget.x = e.clientX;
      this.eyeTarget.y = e.clientY;
    });

    // Raccourci F8 pour mode chaos / panique troll
    window.addEventListener('keydown', (e) => {
      if (e.key === 'F8') {
        this.toggleChaos();
      }
    });

    this.startLoop();
    this.startTrollTicker();
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 56;
  }

  toggleChaos() {
    this.chaosActive = !this.chaosActive;
    if (window.soundEngine) {
      if (this.chaosActive) window.soundEngine.playExplosion();
      else window.soundEngine.playHolyMiracle();
    }
    if (this.chaosActive) {
      document.body.classList.add('troll-chaos-mode');
      if (window.speechEngine) {
        window.speechEngine.speak("Alerte rouge ! Mode panique divine active !");
      }
    } else {
      document.body.classList.remove('troll-chaos-mode');
    }
  }

  setMode(mode) {
    this.mode = mode;
    if (window.soundEngine) window.soundEngine.playClick();
  }

  startTrollTicker() {
    setInterval(() => {
      this.msgIdx = (this.msgIdx + 1) % this.trollMessages.length;
      if (this.bannerEl) {
        this.bannerEl.textContent = this.trollMessages[this.msgIdx];
      }
      // Paranoïa Glow aléatoire
      if (Math.random() > 0.6 && window.desktop) {
        window.desktop.addGlow(Math.floor(Math.random() * 6 - 2));
      }
    }, 4000);
  }

  startLoop() {
    const render = () => {
      this.drawAsciiBackground();
      this.updateMascot();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  // ------------------------------------------------------------------------
  // RENDU ASCII 3D DU DONUT / TORUS DE TERRY DAVIS EN PLEIN ÉCRAN
  // ------------------------------------------------------------------------
  drawAsciiBackground() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Fond avec léger fondu pour effet phosphore CRT
    ctx.fillStyle = "rgba(0, 0, 16, 0.25)";
    ctx.fillRect(0, 0, w, h);

    if (this.mode === 'donut') {
      this.renderAsciiTorus(ctx, w, h);
    } else if (this.mode === 'pyramid') {
      this.renderAsciiPyramid(ctx, w, h);
    } else {
      this.renderAsciiRain(ctx, w, h);
    }

    // Effet glitch si mode chaos
    if (this.chaosActive) {
      ctx.fillStyle = "rgba(255, 0, 0, 0.08)";
      ctx.fillRect(0, Math.random() * h, w, Math.random() * 20);
      ctx.fillStyle = "#ffff55";
      ctx.font = "bold 24px monospace";
      ctx.fillText("[!] ALERTE SYSTEME : SURVEILLANCE SATELLITE 100% ACTIVE [!]", 20, 80);
    }
  }

  renderAsciiTorus(ctx, w, h) {
    this.A += 0.035;
    this.B += 0.02;

    const b = [];
    const z = [];
    const cols = Math.floor(w / 12);
    const rows = Math.floor(h / 14);
    const size = cols * rows;

    for (let k = 0; k < size; k++) {
      b[k] = " ";
      z[k] = 0;
    }

    const sinA = Math.sin(this.A);
    const cosA = Math.cos(this.A);
    const sinB = Math.sin(this.B);
    const cosB = Math.cos(this.B);

    for (let j = 0; j < 6.28; j += 0.12) {
      const ct = Math.cos(j);
      const st = Math.sin(j);
      for (let i = 0; i < 6.28; i += 0.05) {
        const sp = Math.sin(i);
        const cp = Math.cos(i);
        const hRad = ct + 2;
        const D = 1 / (sp * hRad * sinA + st * cosA + 5);
        const t = sp * hRad * cosA - st * sinA;

        const x = Math.floor((cols / 2) + (cols * 0.42) * D * (cp * hRad * cosB - t * sinB));
        const y = Math.floor((rows / 2) + (rows * 0.42) * D * (cp * hRad * sinB + t * cosB));
        const o = x + cols * y;
        const N = Math.floor(8 * ((st * sinA - sp * ct * cosA) * cosB - sp * ct * sinA - st * cosA - cp * ct * sinB));

        if (rows > y && y > 0 && x > 0 && cols > x && D > z[o]) {
          z[o] = D;
          b[o] = ".,-~:;=!*#$@"[Math.max(0, Math.min(11, N))];
        }
      }
    }

    ctx.font = "12px monospace";
    ctx.fillStyle = "rgba(0, 255, 120, 0.45)";

    for (let r = 0; r < rows; r++) {
      const lineChars = b.slice(r * cols, (r + 1) * cols).join('');
      if (lineChars.trim().length > 0) {
        ctx.fillText(lineChars, 10, r * 14 + 14);
      }
    }
  }

  renderAsciiPyramid(ctx, w, h) {
    this.A += 0.03;
    const cx = w / 2;
    const cy = h / 2;
    ctx.font = "13px monospace";
    ctx.fillStyle = "rgba(255, 215, 0, 0.4)";

    const lines = [
      "        /\\        ",
      "       /  \\       ",
      "      / [CIA]\\    ",
      "     /________\\   ",
      "    /  |    |  \\  ",
      "   /___|____|___\\ ",
      "  /    |    |    \\",
      " /_____|____|_____\\"
    ];

    const scale = 1 + Math.sin(this.A) * 0.15;
    lines.forEach((l, idx) => {
      ctx.fillText(l, cx - 80 + Math.sin(this.A + idx) * 15, cy - 60 + idx * 18 * scale);
    });
  }

  renderAsciiRain(ctx, w, h) {
    this.A += 1;
    ctx.font = "12px monospace";
    ctx.fillStyle = "rgba(85, 255, 85, 0.35)";
    const chars = "01_RING0_TERRY_CIA_VGA_GOD_";
    const cols = Math.floor(w / 18);
    for (let c = 0; c < cols; c++) {
      const y = ((this.A * 8) + (c * 37)) % h;
      const char = chars[(c + Math.floor(this.A)) % chars.length];
      ctx.fillText(char, c * 18, y);
    }
  }

  // ------------------------------------------------------------------------
  // MASCOTTE DVD / TERRY DAVIS FLOTTANTE SUR LE BUREAU
  // ------------------------------------------------------------------------
  updateMascot() {
    if (!this.mascotEl) return;
    const deskW = window.innerWidth;
    const deskH = window.innerHeight - 56;

    this.mascotPos.x += this.mascotPos.vx;
    this.mascotPos.y += this.mascotPos.vy;

    if (this.mascotPos.x <= 10 || this.mascotPos.x >= deskW - 140) {
      this.mascotPos.vx *= -1;
      if (window.soundEngine) window.soundEngine.beep(600, 0.03);
    }
    if (this.mascotPos.y <= 10 || this.mascotPos.y >= deskH - 80) {
      this.mascotPos.vy *= -1;
      if (window.soundEngine) window.soundEngine.beep(800, 0.03);
    }

    this.mascotEl.style.left = `${this.mascotPos.x}px`;
    this.mascotEl.style.top = `${this.mascotPos.y}px`;
  }
}

window.TempleTrollEngine = TempleTrollEngine;
