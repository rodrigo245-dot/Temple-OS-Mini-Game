// ==========================================================================
// TERRY DAVIS HOLYC CONSOLE & CIA SCANNER RADAR
// Console interactive avec commandes HolyC et détecteur d'espions
// ==========================================================================

class HolyConsole {
  constructor(outputId, inputId) {
    this.outputEl = document.getElementById(outputId);
    this.inputEl = document.getElementById(inputId);

    if (this.inputEl) {
      this.inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const cmd = this.inputEl.value.trim();
          this.inputEl.value = '';
          this.handleCommand(cmd);
        }
      });
    }
  }

  print(text, color = 'var(--vga-white)') {
    if (!this.outputEl) return;
    const line = document.createElement('div');
    line.style.color = color;
    line.textContent = text;
    this.outputEl.appendChild(line);
    this.outputEl.scrollTop = this.outputEl.scrollHeight;
  }

  handleCommand(cmd) {
    this.print(`> ${cmd}`, 'var(--vga-yellow)');
    window.soundEngine.playClick();

    const lower = cmd.toLowerCase().replace(/;/g, '').trim();

    switch (lower) {
      case 'help':
      case 'aide':
        this.print("COMMANDES DU SAINT COMPILATEUR HOLYC :");
        this.print("  GodWord;    -> Interroge l'Oracle de Dieu");
        this.print("  GodSong;    -> Joue un hymne 8-bit au PC Speaker");
        this.print("  ScanCIA;    -> Lance le radar anti-espions");
        this.print("  Dir;        -> Liste les fichiers sacrés");
        this.print("  WhoAmI;     -> Identité de l'élu");
        this.print("  Clear;      -> Nettoie le terminal");
        break;

      case 'godword':
      case 'god':
      case 'oracle':
        const word = window.godOracle.generateDivineProclamation(6);
        this.print(`[ORACLE DE DIEU] ${word}`, 'var(--vga-light-green)');
        window.soundEngine.playHolyMiracle();
        break;

      case 'godsong':
      case 'song':
      case 'music':
        this.print("[PC SPEAKER] REPRODUCTION DE L'HYMNE DU VATICAN...", 'var(--vga-light-cyan)');
        window.soundEngine.playVictory();
        break;

      case 'scancia':
      case 'cia':
      case 'glow':
        const alert = window.godOracle.getCiaRadarReport();
        this.print(alert, 'var(--vga-light-red)');
        window.soundEngine.beep(950, 0.1, 'sawtooth');
        setTimeout(() => window.soundEngine.beep(750, 0.1, 'sawtooth'), 120);
        break;

      case 'dir':
      case 'ls':
        this.print("DOSSIER : C:/TEMPLE_GAMES/");
        this.print("  HOLY_PONG.HC       64 KB  [EXÉCUTABLE]");
        this.print("  MORPION_SACRE.HC   32 KB  [EXÉCUTABLE]");
        this.print("  PUISSANCE_4.HC     48 KB  [EXÉCUTABLE]");
        this.print("  BATAILLE_NAV.HC    80 KB  [EXÉCUTABLE]");
        this.print("  BIBLE_TERRY.TXT  1024 KB  [TEXTE SACRÉ]");
        this.print("  CIA_LIST.DB         0 KB  [ÉCRASÉ PAR DIEU]");
        break;

      case 'whoami':
        this.print("VOUS ÊTES : TRISTAN LE JUSTE (PROGRAMMEUR BÉNI DU RING-0)", 'var(--vga-yellow)');
        break;

      case 'clear':
      case 'cls':
        if (this.outputEl) this.outputEl.innerHTML = '';
        break;

      default:
        this.print(`ERREUR HOLYC : '${cmd}' NON RECONNU PAR LE COMPILATEUR DIVIN. TAPE 'help;'`, 'var(--vga-light-red)');
        window.soundEngine.beep(200, 0.15, 'sawtooth');
        break;
    }
  }
}

window.HolyConsole = HolyConsole;
