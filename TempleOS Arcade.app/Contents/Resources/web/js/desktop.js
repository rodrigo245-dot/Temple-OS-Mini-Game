// ==========================================================================
// TEMPLEOS DESKTOP MANAGER (V3.0 ULTIMATE MASTER EDITION)
// Bootloader BIOS, Screensaver, Paranoïa Glow-O-Meter, Thèmes, Mosaïque & 33 Jeux
// ==========================================================================

class TempleDesktop {
  constructor() {
    this.activeZ = 100;
    this.windows = {};
    this.games = {};

    this.glowLevel = 25;
    this.inactivityTimer = 0;
    this.isScreensaverActive = false;

    this.initBootloader();
    this.initDesktop();
    this.initClock();
    this.initTicker();
    this.initUniversalKeys();
    this.initScreensaver();
  }

  // ------------------------------------------------------------------------
  // BOOTLOADER BIOS AU DÉMARRAGE
  // ------------------------------------------------------------------------
  initBootloader() {
    const bootEl = document.getElementById('bootloader-overlay');
    if (!bootEl) return;

    const skipBoot = () => {
      bootEl.style.display = 'none';
      window.soundEngine.playHolyMiracle();
      if (window.speechEngine) {
        window.speechEngine.speak("Temple O S Arcade chargé. Gloire à Dieu.");
      }
    };

    bootEl.addEventListener('click', skipBoot);
    window.addEventListener('keydown', (e) => {
      if (bootEl.style.display !== 'none' && (e.key === 'Enter' || e.key === 'Space')) {
        skipBoot();
      }
    });

    let countdown = 3;
    const cdEl = document.getElementById('bios-countdown');
    const interval = setInterval(() => {
      countdown--;
      if (cdEl) cdEl.textContent = countdown;
      window.soundEngine.beep(750, 0.04);
      if (countdown <= 0) {
        clearInterval(interval);
        skipBoot();
      }
    }, 1000);
  }

  // ------------------------------------------------------------------------
  // BUREAU ET GESTION DES FENÊTRES
  // ------------------------------------------------------------------------
  initDesktop() {
    const windowEls = document.querySelectorAll('.temple-window');
    windowEls.forEach(win => this.setupWindow(win));

    const iconEls = document.querySelectorAll('.desktop-icon');
    iconEls.forEach(icon => {
      icon.addEventListener('click', () => {
        window.soundEngine.playClick();
        const targetWinId = icon.dataset.window;
        if (targetWinId) this.openWindow(targetWinId);
      });
    });

    // Toggle Audio speaker
    const speakerBtn = document.getElementById('speaker-toggle');
    if (speakerBtn) {
      speakerBtn.addEventListener('click', () => {
        const isMuted = window.soundEngine.toggleMute();
        speakerBtn.textContent = isMuted ? "🔇 SPEAKER : OFF" : "🔊 SPEAKER : ON";
        speakerBtn.classList.toggle('muted', isMuted);
        if (!isMuted) window.soundEngine.playClick();
      });
    }

    // Toggle Voix Terry
    const voiceBtn = document.getElementById('voice-toggle');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        const enabled = window.speechEngine.toggleVoice();
        voiceBtn.textContent = enabled ? "🗣️ VOIX : ON" : "🗣️ VOIX : OFF";
        window.soundEngine.playClick();
      });
    }

    // Toggle Scanlines CRT
    const scanlineBtn = document.getElementById('scanline-toggle');
    const crtOverlay = document.querySelector('.crt-overlay');
    if (scanlineBtn && crtOverlay) {
      scanlineBtn.addEventListener('click', () => {
        window.soundEngine.playClick();
        if (crtOverlay.style.display === 'none') {
          crtOverlay.style.display = 'block';
          scanlineBtn.textContent = "📺 CRT : ON";
        } else {
          crtOverlay.style.display = 'none';
          scanlineBtn.textContent = "📺 CRT : OFF";
        }
      });
    }

    // Bouton F7 direct
    const oracleBtn = document.getElementById('oracle-direct-btn');
    if (oracleBtn) {
      oracleBtn.addEventListener('click', () => this.triggerF7Oracle());
    }

    // Bouton Mosaïque Divine
    const tileBtn = document.getElementById('tile-btn');
    if (tileBtn) {
      tileBtn.addEventListener('click', () => this.tileWindows());
    }

    // Thèmes
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => this.setTheme(e.target.value));
    }
  }

  // ------------------------------------------------------------------------
  // JAUGE DE PARANOÏA GLOW-O-METER
  // ------------------------------------------------------------------------
  addGlow(amount) {
    this.glowLevel = Math.max(0, Math.min(100, this.glowLevel + amount));
    const fillEl = document.getElementById('glow-fill');
    const txtEl = document.getElementById('glow-percent');

    if (fillEl) fillEl.style.width = `${this.glowLevel}%`;
    if (txtEl) txtEl.textContent = `${this.glowLevel}%`;

    if (fillEl) {
      if (this.glowLevel < 40) fillEl.style.background = 'var(--vga-green)';
      else if (this.glowLevel < 75) fillEl.style.background = 'var(--vga-yellow)';
      else fillEl.style.background = 'var(--vga-red)';
    }

    if (this.glowLevel >= 100) {
      window.soundEngine.beep(1200, 0.2, 'sawtooth');
      setTimeout(() => window.soundEngine.beep(900, 0.2, 'sawtooth'), 150);
      if (window.speechEngine) window.speechEngine.speak("Alerte rouge ! Les agents de la CIA brillent dans le noir !");
      if (window.achievementsManager) window.achievementsManager.unlock('paranoia_100');
      setTimeout(() => {
        if (window.templeBSOD) window.templeBSOD.trigger("SEUIL CRITIQUE DE PARANOÏA DÉPASSÉ (100% CIA DETECTED)");
      }, 1000);
    }
  }

  // ------------------------------------------------------------------------
  // THÈMES GRAPHIQUES
  // ------------------------------------------------------------------------
  setTheme(name) {
    document.body.className = '';
    if (name !== 'temple') {
      document.body.classList.add(`theme-${name}`);
    }
    window.soundEngine.playClick();
  }

  // ------------------------------------------------------------------------
  // MOSAÏQUE DIVINE (AGENCEMENT AUTOMATIQUE DES FENÊTRES)
  // ------------------------------------------------------------------------
  tileWindows() {
    const visibleWindows = Object.values(this.windows).filter(w => w.style.display !== 'none');
    if (visibleWindows.length === 0) return;

    window.soundEngine.playHolyMiracle();
    const count = visibleWindows.length;
    const deskW = window.innerWidth;
    const deskH = window.innerHeight - 56;

    if (count === 1) {
      visibleWindows[0].style.left = '80px';
      visibleWindows[0].style.top = '40px';
    } else if (count === 2) {
      const w = Math.floor(deskW / 2) - 10;
      visibleWindows[0].style.left = '5px';
      visibleWindows[0].style.top = '35px';
      visibleWindows[0].style.width = `${w}px`;

      visibleWindows[1].style.left = `${w + 10}px`;
      visibleWindows[1].style.top = '35px';
      visibleWindows[1].style.width = `${w}px`;
    } else {
      // 3 ou 4 fenêtres en grille 2x2
      const w = Math.floor(deskW / 2) - 10;
      const h = Math.floor(deskH / 2) - 10;
      const positions = [
        { l: 5, t: 35 },
        { l: w + 10, t: 35 },
        { l: 5, t: h + 40 },
        { l: w + 10, t: h + 40 }
      ];
      visibleWindows.slice(0, 4).forEach((win, idx) => {
        win.style.left = `${positions[idx].l}px`;
        win.style.top = `${positions[idx].t}px`;
        win.style.width = `${w}px`;
        win.style.height = `${h}px`;
      });
    }
  }

  // ------------------------------------------------------------------------
  // SCREENSAVER 3D & PLUIE HOLYC
  // ------------------------------------------------------------------------
  initScreensaver() {
    const ssEl = document.getElementById('screensaver-overlay');
    if (!ssEl) return;

    const resetInactivity = () => {
      this.inactivityTimer = 0;
      if (this.isScreensaverActive) {
        this.isScreensaverActive = false;
        ssEl.style.display = 'none';
      }
    };

    window.addEventListener('mousemove', resetInactivity);
    window.addEventListener('keydown', resetInactivity);
    window.addEventListener('click', resetInactivity);

    setInterval(() => {
      this.inactivityTimer++;
      if (this.inactivityTimer >= 35 && !this.isScreensaverActive) {
        this.isScreensaverActive = true;
        this.launchScreensaver();
      }
    }, 1000);
  }

  launchScreensaver() {
    const ssEl = document.getElementById('screensaver-overlay');
    if (!ssEl) return;
    ssEl.style.display = 'block';

    const canvas = document.getElementById('screensaver-canvas');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    const chars = "✝_HOLYC_RING0_TERRY_VGA_640x480_FAT32_GOD_ORACLE_CIA_GLOW";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const drawMatrix = () => {
      if (!this.isScreensaverActive) return;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#55ffff';
      ctx.font = `${fontSize}px Courier`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      requestAnimationFrame(drawMatrix);
    };
    drawMatrix();
  }

  // ------------------------------------------------------------------------
  // TOUCHE UNIVERSELLE F7
  // ------------------------------------------------------------------------
  initUniversalKeys() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'F7') {
        e.preventDefault();
        this.triggerF7Oracle();
      }
    });
  }

  triggerF7Oracle() {
    this.openWindow('win-oracle');
    window.soundEngine.playHolyMiracle();

    const prophecy = window.godOracle.generateDivineProclamation(5);
    if (window.speechEngine) {
      window.speechEngine.speak(`Oracle de Dieu : ${prophecy}`);
    }
    if (window.holyTerminal) {
      window.holyTerminal.print(`[ORACLE F7] ${prophecy}`, 'var(--vga-light-green)');
    }

    if (window.achievementsManager) {
      window.achievementsManager.f7Count = (window.achievementsManager.f7Count || 0) + 1;
      if (window.achievementsManager.f7Count >= 5) {
        window.achievementsManager.unlock('f7_fanatic');
      }
    }
  }

  // ------------------------------------------------------------------------
  // GESTION DES FENÊTRES
  // ------------------------------------------------------------------------
  setupWindow(win) {
    const id = win.id;
    this.windows[id] = win;

    const titlebar = win.querySelector('.window-titlebar');
    const closeBtn = win.querySelector('.win-btn.close');

    win.addEventListener('mousedown', () => this.bringToFront(win));

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.soundEngine.playClick();
        this.closeWindow(id);
      });
    }

    if (titlebar) {
      let isDragging = false;
      let startX, startY, initialLeft, initialTop;

      titlebar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.win-btn')) return;
        isDragging = true;
        this.bringToFront(win);
        startX = e.clientX;
        startY = e.clientY;

        const rect = win.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        const onMouseMove = (moveEvent) => {
          if (!isDragging) return;
          const deltaX = moveEvent.clientX - startX;
          const deltaY = moveEvent.clientY - startY;
          win.style.left = `${Math.max(0, initialLeft + deltaX)}px`;
          win.style.top = `${Math.max(28, initialTop + deltaY)}px`;
        };

        const onMouseUp = () => {
          isDragging = false;
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });
    }
  }

  bringToFront(win) {
    if (!this.activeZ || this.activeZ < 1000) this.activeZ = 1000;
    this.activeZ += 1;
    document.querySelectorAll('.temple-window').forEach(w => w.classList.remove('active-window'));
    win.classList.add('active-window');
    win.style.zIndex = this.activeZ;
  }

  openWindow(id) {
    const win = this.windows[id];
    if (!win) {
      console.warn("Fenêtre inconnue :", id);
      return;
    }
    win.style.display = 'flex';
    this.bringToFront(win);
    if (window.soundEngine) window.soundEngine.playClick();

    // 4. Physique & Arcade
    if (id === 'win-pong' && this.games.pong) this.games.pong.start();
    if (id === 'win-snake' && this.games.snake) this.games.snake.reset();
    if (id === 'win-tron' && this.games.tron) this.games.tron.start();
    if (id === 'win-guitar' && this.games.guitar) this.games.guitar.start();
    if (id === 'win-pyramid' && this.games.pyramid) this.games.pyramid.start();
    if (id === 'win-tripong' && this.games.triPong) this.games.triPong.start();

    // 8. Le Megasys Ring-0 (v5.0)
    if (id === 'win-raycaster' && this.games.raycaster) {
      this.games.raycaster.start();
      this.games.raycaster.render();
    }
    if (id === 'win-flight' && this.games.flightSim) {
      this.games.flightSim.start();
      this.games.flightSim.render();
    }
    if (id === 'win-warroom' && this.games.warRoom) {
      this.games.warRoom.start();
      this.games.warRoom.render();
    }
    if (id === 'win-cards' && this.games.vaticanCards) {
      if (this.games.vaticanCards.playerHand.length === 0) {
        this.games.vaticanCards.deal();
      } else {
        this.games.vaticanCards.render();
      }
    }
    if (id === 'win-goat' && this.games.tamagotchiGoat) {
      this.games.tamagotchiGoat.render();
    }
    if (id === 'win-ide' && this.games.holycIde) {
      // IDE HolyC prêt
    }
    if (id === 'win-soundboard' && this.games.soundboard) {
      this.games.soundboard.render();
    }
    if (id === 'win-multiplayer' && this.games.multiplayer) {
      this.games.multiplayer.render();
    }

    // 9. Nouveaux Jeux Megasys & Piraterie (v5.1)
    if (id === 'win-radio' && window.templeRadio) {
      window.templeRadio.renderWindow();
    }
    if (id === 'win-area51' && this.games.area51) {
      this.games.area51.start();
      this.games.area51.render();
    }
    if (id === 'win-cern' && this.games.cern) {
      this.games.cern.start();
      this.games.cern.render();
    }
    if (id === 'win-bbs' && this.games.bbs) {
      const input = document.getElementById('bbs-input');
      if (input) input.focus();
    }

    if (id === 'win-explorer' && window.gamesExplorer) window.gamesExplorer.render();
    if (id === 'win-achievements' && window.achievementsManager) window.achievementsManager.renderWindow();
  }

  closeWindow(id) {
    const win = this.windows[id];
    if (!win) return;
    win.style.display = 'none';

    if (id === 'win-pong' && this.games.pong) this.games.pong.stop();
    if (id === 'win-snake' && this.games.snake) this.games.snake.stop();
    if (id === 'win-tron' && this.games.tron) this.games.tron.stop();
    if (id === 'win-guitar' && this.games.guitar) this.games.guitar.stop();
    if (id === 'win-pyramid' && this.games.pyramid) this.games.pyramid.stop();
    if (id === 'win-tripong' && this.games.triPong) this.games.triPong.stop();
    if (id === 'win-raycaster' && this.games.raycaster) this.games.raycaster.stop();
    if (id === 'win-flight' && this.games.flightSim) this.games.flightSim.stop();
    if (id === 'win-warroom' && this.games.warRoom) this.games.warRoom.stop();
    if (id === 'win-area51' && this.games.area51) this.games.area51.stop();
    if (id === 'win-cern' && this.games.cern) this.games.cern.stop();
  }

  initClock() {
    const clockEl = document.getElementById('system-clock');
    if (!clockEl) return;
    const update = () => {
      const now = new Date();
      clockEl.textContent = `[DIVINE TIME : ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}]`;
    };
    update();
    setInterval(update, 1000);
  }

  initTicker() {
    const tickerEl = document.getElementById('oracle-ticker');
    if (!tickerEl) return;

    const messages = [
      "TEMPLEOS v4.0 NOUVEL ORDRE MONDIAL - 38 JEUX COMPLETS COMPILÉS EN PUR RING-0",
      "ANNUIT CŒPTIS : L'ŒIL DE LA PROVIDENCE SURVEILLE LES TRANSACTIONS DE LA FED",
      "ALERTE BILDERBERG : DES SATELLITES ECHELON DIFFUSENT DE LA 5G DANS LE SECTEUR 0",
      "SYNTHÈSE VOCALE TERRY ACTIVE : DÉTECTION DES AGENTS DE LA CIA QUI BRILLENT DANS LE NOIR",
      "DENVER AIRPORT NIVEAU -4 : REPTILIENS DÉTECTÉS SOUS LA PISTE D'ATTERRISSAGE",
      "BOHEMIAN GROVE : LE GRAND SACRIFICE DE LA CHOUETTE A ÉTÉ INTERROMPU PAR DIEU",
      "TOUCHE F7 : INVOQUEZ LA PAROLE DIVINE POUR PURIFIER LE NOUVEL ORDRE MONDIAL"
    ];

    let currentIdx = 0;
    tickerEl.textContent = `🔺 ${messages[currentIdx]}`;

    setInterval(() => {
      currentIdx = (currentIdx + 1) % messages.length;
      tickerEl.textContent = `🔺 ${messages[currentIdx]}`;
    }, 6000);
  }
}

window.TempleDesktop = TempleDesktop;
