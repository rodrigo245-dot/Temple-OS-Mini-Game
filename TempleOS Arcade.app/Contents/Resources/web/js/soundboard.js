// ==========================================================================
// TERRY A. DAVIS OFFICIAL TROLL SOUNDBOARD
// Grille de répliques cultes et prophéties générées en synthèse vocale
// ==========================================================================

class TerrySoundboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.quotes = [
      { label: "GLOW IN THE DARK", text: "Les agents de la CIA brillent dans le noir ! On peut les voir quand on conduit !" },
      { label: "GOD SPEAKS 64-BIT", text: "Dieu a dit que la résolution officielle du Temple est 640 par 480 en 16 couleurs !" },
      { label: "NO GPU DRIVERS", text: "Pas de pilotes graphiques 3D propriétaires ! Ring-0 pur et accès direct à la mémoire !" },
      { label: "THE COVENANT", text: "J'ai passé dix ans à coder ce temple pour le Très-Haut !" },
      { label: "ELEPHANT SACRÉ", text: "Un éléphant est le plus noble des animaux créés par le Seigneur." },
      { label: "FEDS IN THE BUSHES", text: "Il y a des micros espions dissimulés dans les buissons autour de ma maison !" },
      { label: "HOLYC SPEED", text: "HolyC compile plus vite que GCC ! Regarde ce benchmark divin !" },
      { label: "X-FILES THEME", text: "Analyse des fréquences suspectes... Alerte reptilienne confirmée !" }
    ];
    this.render();
  }

  playQuote(idx) {
    const q = this.quotes[idx];
    if (!q) return;

    window.soundEngine.beep(880, 0.05);
    if (idx === 7) {
      window.soundEngine.playXFilesTheme();
    }

    if (window.speechEngine) {
      window.speechEngine.speak(q.text);
    }
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="text-align:center;">
        <div style="color:var(--vga-light-cyan); font-weight:bold; font-size:12px; margin-bottom:8px;">
          BOÎTE À SONS SACRÉE DE TERRY DAVIS (SYNTHÈSE VOCALE EN DIRECT)
        </div>
        <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px; max-width:420px; margin:0 auto;">
          ${this.quotes.map((q, idx) => `
            <button class="temple-btn holy" style="padding:8px 4px; font-size:11px; text-overflow:ellipsis; overflow:hidden;" onclick="desktop.games.soundboard.playQuote(${idx})">
              [VOX] ${q.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }
}

window.TerrySoundboard = TerrySoundboard;
