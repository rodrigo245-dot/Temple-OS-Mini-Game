// ==========================================================================
// TEMPLEOS HOLYC INTEGRATED DEVELOPMENT ENVIRONMENT (IDE DE DIEU)
// Éditeur de code rétro avec coloration syntaxique et interpréteur en direct
// ==========================================================================

class HolyCIDE {
  constructor(editorId, outputId) {
    this.editor = document.getElementById(editorId);
    this.output = document.getElementById(outputId);
    this.initDefaultCode();
  }

  initDefaultCode() {
    if (!this.editor) return;
    this.editor.value = `// COMPILATEUR HOLYC RING-0 - EXÉCUTION EN TEMPS RÉEL
U0 DivineMiracle()
{
  Print("✝ ALLIANCE AVEC LE COMPILATEUR DIVIN DE TERRY A. DAVIS ✝\\n");
  
  I64 i;
  for (i = 0; i < 4; i++) {
    Beep(440 + i * 110, 0.08);
    Print("Psaume binaire compilé à l'adresse 0x%X\\n", 0x1000 + i * 16);
  }
  
  Print("Oracle : %s\\n", GodWord());
}

DivineMiracle();
`;
  }

  run() {
    if (!this.editor || !this.output) return;
    const rawCode = this.editor.value;
    this.output.innerHTML = '';
    window.soundEngine.playClick();

    // Logique d'émulation HolyC vers JavaScript
    let jsCode = rawCode
      .replace(/U0\s+(\w+)\s*\(\)/g, 'function $1()')
      .replace(/I64\s+(\w+)\s*;/g, 'let $1 = 0;')
      .replace(/Print\((.*?)\);/g, 'holyPrint($1);')
      .replace(/Beep\((.*?)\);/g, 'holyBeep($1);')
      .replace(/GodWord\(\)/g, 'window.godOracle.generateDivineProclamation(4)');

    const self = this;
    const holyPrint = function(fmt, ...args) {
      let str = fmt;
      args.forEach(arg => {
        str = str.replace(/%[sxdX]/, arg);
      });
      const line = document.createElement('div');
      line.style.color = '#55ff55';
      line.textContent = str.replace(/\\n/g, '');
      self.output.appendChild(line);
      self.output.scrollTop = self.output.scrollHeight;
    };

    const holyBeep = function(freq, dur) {
      window.soundEngine.beep(freq, dur || 0.1);
    };

    try {
      const execFn = new Function('holyPrint', 'holyBeep', jsCode);
      execFn(holyPrint, holyBeep);
      window.soundEngine.playHolyMiracle();
    } catch (err) {
      const errLine = document.createElement('div');
      errLine.style.color = '#ff5555';
      errLine.textContent = `❌ ERREUR DE COMPILATION HOLYC : ${err.message}`;
      this.output.appendChild(errLine);
      window.soundEngine.beep(200, 0.2, 'sawtooth');
    }
  }

  clear() {
    if (this.output) this.output.innerHTML = '';
    window.soundEngine.playClick();
  }
}

window.HolyCIDE = HolyCIDE;
