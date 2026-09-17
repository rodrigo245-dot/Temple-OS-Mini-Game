// ==========================================================================
// TEMPLEOS GAMEPAD CONTROLLER ENGINE (GAMEPAD API)
// Support automatique des manettes PS5, Xbox, Switch et USB pour tous les jeux
// ==========================================================================

class TempleGamepad {
  constructor() {
    this.gamepadIndex = null;
    this.indicatorEl = document.getElementById('gamepad-indicator');
    this.prevButtons = {};
    this.prevAxes = { x: 0, y: 0 };
    this.initEvents();
  }

  initEvents() {
    window.addEventListener('gamepadconnected', (e) => {
      this.gamepadIndex = e.gamepad.index;
      if (this.indicatorEl) {
        this.indicatorEl.textContent = `[PAD] MANETTE : ACTIVE (${e.gamepad.id.slice(0, 15)}...)`;
        this.indicatorEl.style.color = "var(--vga-light-green)";
      }
      window.soundEngine.playHolyMiracle();
      this.poll();
    });

    window.addEventListener('gamepaddisconnected', () => {
      this.gamepadIndex = null;
      if (this.indicatorEl) {
        this.indicatorEl.textContent = "[PAD] MANETTE : NON DÉTECTÉE";
        this.indicatorEl.style.color = "var(--vga-dark-gray)";
      }
    });
  }

  poll() {
    if (this.gamepadIndex === null) return;
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gamepads[this.gamepadIndex];

    if (gp) {
      // 1. Boutons (A/Croix = Espace, B/Rond = Entrée)
      const isPressed = (btnIdx) => gp.buttons[btnIdx] && gp.buttons[btnIdx].pressed;

      if (isPressed(0) && !this.prevButtons[0]) this.simulateKey('Space');
      if (isPressed(1) && !this.prevButtons[1]) this.simulateKey('Enter');
      if (isPressed(12) && !this.prevButtons[12]) this.simulateKey('ArrowUp');
      if (isPressed(13) && !this.prevButtons[13]) this.simulateKey('ArrowDown');
      if (isPressed(14) && !this.prevButtons[14]) this.simulateKey('ArrowLeft');
      if (isPressed(15) && !this.prevButtons[15]) this.simulateKey('ArrowRight');

      // 2. Stick analogique gauche
      const ax = gp.axes[0] || 0;
      const ay = gp.axes[1] || 0;

      if (ay < -0.5 && this.prevAxes.y >= -0.5) this.simulateKey('ArrowUp');
      if (ay > 0.5 && this.prevAxes.y <= 0.5) this.simulateKey('ArrowDown');
      if (ax < -0.5 && this.prevAxes.x >= -0.5) this.simulateKey('ArrowLeft');
      if (ax > 0.5 && this.prevAxes.x <= 0.5) this.simulateKey('ArrowRight');

      this.prevAxes = { x: ax, y: ay };
      for (let i = 0; i < gp.buttons.length; i++) {
        this.prevButtons[i] = isPressed(i);
      }
    }

    requestAnimationFrame(() => this.poll());
  }

  simulateKey(code) {
    const evDown = new KeyboardEvent('keydown', { code, bubbles: true });
    window.dispatchEvent(evDown);
  }
}

window.gamepadEngine = new TempleGamepad();
