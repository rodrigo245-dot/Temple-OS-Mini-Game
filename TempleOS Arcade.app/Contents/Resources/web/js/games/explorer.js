// ==========================================================================
// TEMPLEOS MASTER GAMES EXPLORER (C:/GAMES_EXPLORER.HC)
// Catalogue complet des 33 jeux, algorithmes sacrés et outils système
// ==========================================================================

const TEMPLE_GAMES_CATALOG = [
  {
    category: "1. GRILLES & TABLEAUX 2D",
    folder: "C:/GAMES/GRILLES/",
    games: [
      { id: "win-morpion", name: "Morpion Sacré (Minimax)", file: "MORPION.HC", icon: "✝" },
      { id: "win-p4", name: "Puissance 4 de l'Alliance", file: "PUISSANCE_4.HC", icon: "🔴" },
      { id: "win-demineur", name: "Démineur de Feds CIA", file: "DEMINEUR.HC", icon: "💣" },
      { id: "win-battleship", name: "Bataille Navale de l'Arche", file: "BATAILLE.HC", icon: "🚢" },
      { id: "win-conway", name: "Jeu de la Vie (Conway B3/S23)", file: "CONWAY.HC", icon: "🧬" },
      { id: "win-taquin", name: "Le Taquin 15-Puzzle", file: "TAQUIN_15.HC", icon: "🔢" },
      { id: "win-sudoku", name: "Générateur / Solveur Sudoku", file: "SUDOKU.HC", icon: "🧩" }
    ]
  },
  {
    category: "2. LOGIQUE, STRINGS & BOUCLES",
    folder: "C:/GAMES/LOGIQUE/",
    games: [
      { id: "win-plusmoins", name: "Plus ou Moins", file: "PLUS_MOINS.HC", icon: "❓" },
      { id: "win-mastermind", name: "Mastermind VGA", file: "MASTERMIND.HC", icon: "🔴" },
      { id: "win-pendu", name: "Le Pendu Sacré (ASCII Art)", file: "PENDU.HC", icon: "🪢" },
      { id: "win-motus", name: "Clone Wordle / Motus", file: "MOTUS.HC", icon: "🔤" },
      { id: "win-nim", name: "Jeu de Nim (XOR Math)", file: "JEU_NIM.HC", icon: "🔥" },
      { id: "win-binary", name: "Convertisseur Express", file: "CONVERT_BIN.HC", icon: "⚡" }
    ]
  },
  {
    category: "3. AUDIO, LUMIÈRE & INTERFACE",
    folder: "C:/GAMES/AUDIO/",
    games: [
      { id: "win-simon", name: "Simon Musical 8-Bit", file: "SIMON_AUDIO.HC", icon: "🎵" },
      { id: "win-poursuite", name: "Chasse au Trésor (Lyre MAC 250)", file: "POURSUITE.HC", icon: "🔦" },
      { id: "win-pipedream", name: "Puzzle de Câblage Régie", file: "PIPE_DREAM.HC", icon: "🔌" },
      { id: "win-sequencer", name: "Séquenceur Rythmique 8 Pas", file: "SEQUENCER.HC", icon: "🥁" },
      { id: "win-idle", name: "Clicker / Idle de Location", file: "RENTAL_IDLE.HC", icon: "💰" }
    ]
  },
  {
    category: "4. PHYSIQUE & ARCADE 2D",
    folder: "C:/GAMES/ARCADE/",
    games: [
      { id: "win-pong", name: "Holy Pong (Ping-Pong 60 FPS)", file: "PONG.HC", icon: "🏓" },
      { id: "win-snake", name: "Le Serpent d'Airain de Moïse", file: "SNAKE.HC", icon: "🐍" },
      { id: "win-breakout", name: "Casse-Briques (Breakout)", file: "BREAKOUT.HC", icon: "🧱" },
      { id: "win-flappy", name: "Flappy Bird (Flappy Terry)", file: "FLAPPY.HC", icon: "🕊" },
      { id: "win-tetris", name: "Tetris Sacré (Tétriminos)", file: "TETRIS.HC", icon: "🕹" },
      { id: "win-asteroids", name: "Asteroids Vectoriel", file: "ASTEROIDS.HC", icon: "🚀" },
      { id: "win-invaders", name: "Space Invaders", file: "INVADERS.HC", icon: "👾" },
      { id: "win-tron", name: "Tron Lightcycles (2 Joueurs)", file: "TRON.HC", icon: "🏍" },
      { id: "win-guitar", name: "Guitar Terry (Jeu de Rythme)", file: "GUITAR.HC", icon: "🎸" }
    ]
  },
  {
    category: "5. IA & ALGORITHMES COMPLEXES",
    folder: "C:/GAMES/IA_ALGO/",
    games: [
      { id: "win-labyrinth", name: "Générateur de Labyrinthes (DFS)", file: "LABYRINTHE.HC", icon: "🌀" },
      { id: "win-rogue", name: "Dungeon Crawler ASCII (Rogue)", file: "ROGUE.HC", icon: "⚔️" },
      { id: "win-cadavre", name: "Cadavre Exquis Procédural", file: "CADAVRE.HC", icon: "📜" },
      { id: "win-qlearn", name: "Machine Learning (Q-Learning)", file: "Q_LEARNING.HC", icon: "🧠" },
      { id: "win-eightqueens", name: "Problème des 8 Dames", file: "EIGHT_QUEENS.HC", icon: "👑" },
      { id: "win-chess", name: "Mini-Échecs de Dieu (IA)", file: "CHESS_GOD.HC", icon: "♟" }
    ]
  },
  {
    category: "6. SYSTÈME & PROPHÉTIES",
    folder: "C:/SYSTEM/",
    games: [
      { id: "win-achievements", name: "Succès & Trophées Sacrés", file: "ACHIEVEMENTS.HC", icon: "🏆" },
      { id: "win-oracle", name: "Terminal HolyC & Scanner CIA", file: "HOLYC_ORACLE.HC", icon: "⚡" }
    ]
  },
  {
    category: "7. NOUVEL ORDRE MONDIAL & ILLUMINATI",
    folder: "C:/GAMES/ILLUMINATI/",
    games: [
      { id: "win-pyramid", name: "Pyramid Run (Temple d'Horus)", file: "PYRAMID_RUN.HC", icon: "🔺" },
      { id: "win-nwo", name: "NWO Tycoon (Secret Society)", file: "NWO_TYCOON.HC", icon: "👁️" },
      { id: "win-decrypt", name: "Le Décrypteur Illuminati", file: "DECRYPT_CODE.HC", icon: "📜" },
      { id: "win-reptilian", name: "Whack-a-Reptilian (Denver)", file: "REPTILIAN.HC", icon: "🦎" },
      { id: "win-tripong", name: "Tri-Pong Maçonnique (3 Côtés)", file: "TRI_PONG.HC", icon: "📐" }
    ]
  },
  {
    category: "8. LE MEGASYS RING-0 (v5.0)",
    folder: "C:/MEGASYS/",
    games: [
      { id: "win-raycaster", name: "Wolfenstein Pentagone 3D", file: "DOOM_PENTAGON.HC", icon: "🔫" },
      { id: "win-flight", name: "Simulateur de Vol Terry 3D", file: "GOD_FLIGHT.HC", icon: "✈️" },
      { id: "win-cards", name: "Black Jack du Vatican", file: "VATICAN_BJ.HC", icon: "🃏" },
      { id: "win-goat", name: "Tamagotchi Chèvre Sacrée", file: "GOAT_TAMAGOTCHI.HC", icon: "🐐" },
      { id: "win-warroom", name: "War Room Conspirationniste", file: "WAR_ROOM.HC", icon: "🌍" },
      { id: "win-ide", name: "IDE HolyC de Programmation", file: "HOLYC_IDE.HC", icon: "💻" },
      { id: "win-soundboard", name: "Soundboard de Terry Davis", file: "TERRY_VOICE.HC", icon: "🗣️" },
      { id: "win-multiplayer", name: "Liaison Multijoueur P2P", file: "NET_WEBRTC.HC", icon: "🌐" }
    ]
  }
];

class GamesExplorer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.render();
  }

  render() {
    if (!this.container) return;

    let html = `
      <div style="font-size:12px; color:var(--vga-light-cyan); margin-bottom:6px; font-weight:bold;">
        EXPLORATEUR DE FICHIERS TEMPLEOS (33 JEUX & OUTILS DISPONIBLES)
      </div>
      <div style="max-height:430px; overflow-y:auto; padding-right:6px;">
    `;

    TEMPLE_GAMES_CATALOG.forEach(cat => {
      html += `
        <div style="margin-bottom:10px; border:1px solid #444; background:#000022; padding:5px 8px;">
          <div style="color:var(--vga-yellow); font-weight:bold; font-size:12px; margin-bottom:4px; display:flex; justify-content:space-between;">
            <span>📁 ${cat.category}</span>
            <span style="color:var(--vga-light-gray); font-size:11px;">${cat.folder}</span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(230px, 1fr)); gap:5px;">
            ${cat.games.map(g => `
              <div class="clickable" style="display:flex; align-items:center; gap:8px; background:#000; border:1px solid #333; padding:4px 8px; cursor:pointer;" onclick="desktop.openWindow('${g.id}')">
                <span style="font-size:16px;">${g.icon}</span>
                <div style="flex:1; overflow:hidden;">
                  <div style="color:var(--vga-white); font-weight:bold; font-size:11px; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${g.name}</div>
                  <div style="color:var(--vga-green); font-size:10px;">${g.file}</div>
                </div>
                <button class="temple-btn" style="padding:1px 6px; font-size:10px;">OUVRIR</button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    html += `</div>`;
    this.container.innerHTML = html;
  }
}

window.TEMPLE_GAMES_CATALOG = TEMPLE_GAMES_CATALOG;
window.GamesExplorer = GamesExplorer;
