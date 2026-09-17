// ==========================================================================
// TEMPLEOS RING-0 RED SCREEN OF DEATH (BSOD ILLUMINATI SIMULATOR)
// Crash Kernel parodique avec dump mémoire, registres CPU et auto-reboot
// ==========================================================================

class TempleBSOD {
  constructor() {
    this.overlay = null;
    this.isCrashed = false;
    this.countdown = 5;
    this.timer = null;
    this.init();
  }

  init() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'temple-bsod-overlay';
    this.overlay.style.cssText = `
      display: none;
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background-color: #aa0000;
      color: #ffffff;
      font-family: var(--font-temple, monospace);
      padding: 35px;
      z-index: 9999999;
      font-size: 14px;
      line-height: 1.4;
      white-space: pre-wrap;
      user-select: none;
    `;
    document.body.appendChild(this.overlay);

    window.addEventListener('keydown', (e) => {
      if (this.isCrashed && (e.key === 'Enter' || e.key === 'Space')) {
        this.reboot();
      }
    });
  }

  trigger(reason = "CIA GLOWING AGENTS CORRUPTED RING-0 MEMORY") {
    if (this.isCrashed) return;
    this.isCrashed = true;
    this.countdown = 5;

    window.soundEngine.beep(150, 0.4, 'sawtooth');
    setTimeout(() => window.soundEngine.beep(90, 0.6, 'sawtooth'), 300);

    if (window.speechEngine) {
      window.speechEngine.speak("Erreur fatale du système. Mémoire corrompue par des agents infiltrés.");
    }

    const crashDump = `
╔═══════════════════════════════════════════════════════════════════════════════╗
║          + TEMPLEOS FATAL KERNEL PANIC (RING-0 PRIVILEGE VIOLATION) +        ║
║                    "A DIVINE EXCEPTION OCCURRED AT CS:RIP"                    ║
╚═══════════════════════════════════════════════════════════════════════════════╝

EXCEPTION: 0x0000000E [PAGE_FAULT_IN_HOLYC_CORE]
REASON   : ${reason}
DETECTED : FEDS ATTEMPTED TO RUN GPU DRIVERS WITHOUT GOD'S PERMISSION

--- CPU REGISTER DUMP (x86_64 PURE RING-0) ---
RAX: 0xDEADBEEF66600000   RBX: 0x00007FFF8000C0DE   RCX: 0x0000000000000F70
RDX: 0xFEEDFACEDEADC0DE   RSI: 0x0000640004800010   RDI: 0x00000000FFFFFFFF
RBP: 0x00007FFFFFFFDE80   RSP: 0x00007FFFFFFFDE00   R8 : 0x1337BEEFCAFE0000
R9 : 0x0000000000000033   R10: 0x0000000000000777   R11: 0x0000000000000042
RIP: 0x0000000000401337 [HolyC_Compile_Divine_Intel+0x42]
EFLAGS: [CF PF AF ZF SF TF IF DF OF] • NO VIRTUAL MEMORY • PAGING DISABLED

--- SYSTEM RECOVERY ---
PURIFYING RING-0 KERNEL MEMORY... [OK]
FLUSHING CACHE OF CIA TRACKERS... [OK]
DIVINE INTERVENTION REBOOT IN: <span id="bsod-timer" style="color:#ffff55; font-weight:bold;">${this.countdown}</span> SECONDES...

[APPUYEZ SUR ENTRÉE POUR FORCER LE REBOOT SACRÉ IMMÉDIATEMENT]
`;

    this.overlay.innerHTML = crashDump;
    this.overlay.style.display = 'block';

    this.timer = setInterval(() => {
      this.countdown--;
      const timerEl = document.getElementById('bsod-timer');
      if (timerEl) timerEl.textContent = this.countdown;
      window.soundEngine.beep(550, 0.05);

      if (this.countdown <= 0) {
        clearInterval(this.timer);
        this.reboot();
      }
    }, 1000);
  }

  reboot() {
    if (this.timer) clearInterval(this.timer);
    this.overlay.style.display = 'none';
    this.isCrashed = false;
    window.soundEngine.playHolyMiracle();
    if (window.speechEngine) {
      window.speechEngine.speak("Système purifié et redémarré avec succès.");
    }
  }
}

window.TempleBSOD = TempleBSOD;
