// ==========================================================================
// TAMAGOTCHI DU TEMPLE ("ÉLÈVE TA CHÈVRE SACRÉE RING-0")
// Animal virtuel rétro en ASCII : faim, piété, énergie et exorcisme
// ==========================================================================

class TamagotchiGoatGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.hunger = 80;
    this.piety = 70;
    this.energy = 90;
    this.paranoia = 10;
    this.age = 0;
    this.statusMsg = "La Chèvre Sacrée bêle doucement dans le Sanctuaire.";
    this.init();
  }

  init() {
    this.render();
    setInterval(() => {
      this.hunger = Math.max(0, this.hunger - 2);
      this.energy = Math.max(0, this.energy - 1);
      this.piety = Math.max(0, this.piety - 1);
      this.paranoia = Math.min(100, this.paranoia + 1);
      this.age += 1;
      this.render();
    }, 4000);
  }

  feed() {
    this.hunger = Math.min(100, this.hunger + 25);
    this.energy = Math.min(100, this.energy + 10);
    this.statusMsg = "La chèvre broute la manne céleste avec ferveur !";
    window.soundEngine.beep(600, 0.08);
    this.render();
  }

  pray() {
    this.piety = Math.min(100, this.piety + 30);
    this.paranoia = Math.max(0, this.paranoia - 15);
    this.statusMsg = "Prière divine effectuée ! La chèvre monte vers le Ring-0 !";
    window.soundEngine.playHolyMiracle();
    this.render();
  }

  exorcise() {
    this.paranoia = 0;
    this.statusMsg = "Micro espion de la CIA retiré de la corne gauche !";
    window.soundEngine.playReptilianLaser();
    this.render();
  }

  sleep() {
    this.energy = 100;
    this.statusMsg = "La chèvre s'endort sous l'aile d'un ange 64-bit.";
    window.soundEngine.beep(400, 0.2);
    this.render();
  }

  render() {
    if (!this.container) return;

    // Animation ASCII de la chèvre selon son état
    let goatAscii = `
      / \\__
     (    @\\___
     /         O
    /   (_____/
   /_____/   U
`;
    if (this.hunger < 25) {
      goatAscii = `
      / \\__
     (    x\\___   (J'ai faim...)
     /         o
    /   (_____/
   /_____/   u
`;
    } else if (this.piety > 80) {
      goatAscii = `
       [*]  +  [*]
      / \\__
     (    ^\\___   (Bénie soit Terry !)
     /         O
    /   (_____/
   /_____/   U
`;
    }

    this.container.innerHTML = `
      <div style="text-align:center; padding:10px;">
        <div style="color:var(--vga-light-cyan); font-weight:bold; font-size:12px; margin-bottom:4px;">
          CHÈVRE SACRÉE DU TEMPLE • ÂGE : ${this.age} CYCLES RING-0
        </div>

        <pre style="font-family:monospace; font-size:14px; color:#ffff55; margin:8px auto; text-align:left; width:fit-content; background:#000; border:1px solid #444; padding:8px 16px;">
${goatAscii}
        </pre>

        <!-- Barres de statut -->
        <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:6px; max-width:320px; margin:8px auto; font-size:11px; text-align:left;">
          <div>[CORN] FAIM : ${this.hunger}%</div>
          <div>+ PIÉTÉ : ${this.piety}%</div>
          <div>[SYS] ÉNERGIE : ${this.energy}%</div>
          <div style="color:${this.paranoia > 50 ? '#ff5555' : '#88ff88'};">[CIA] PARANOÏA : ${this.paranoia}%</div>
        </div>

        <div style="font-size:11px; color:#ffffff; margin:8px 0; min-height:16px;">${this.statusMsg}</div>

        <div style="display:flex; gap:6px; justify-content:center; margin-top:6px;">
          <button class="temple-btn primary" onclick="desktop.games.tamagotchiGoat.feed()">[CORN] NOURRIR</button>
          <button class="temple-btn holy" onclick="desktop.games.tamagotchiGoat.pray()">+ PRIER</button>
          <button class="temple-btn danger" onclick="desktop.games.tamagotchiGoat.exorcise()">[CIA] EXORCISER</button>
          <button class="temple-btn" onclick="desktop.games.tamagotchiGoat.sleep()">[Zz] DORMIR</button>
        </div>
      </div>
    `;
  }
}

window.TamagotchiGoatGame = TamagotchiGoatGame;
