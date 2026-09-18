// ==========================================================================
// TEMPLEOS MASTER GAMES EXPLORER (C:/GAMES_EXPLORER.HC)
// Catalogue complet des 33 jeux, algorithmes sacrés et outils système
// ==========================================================================

const TEMPLE_GAMES_CATALOG = [
  {
    category: "1. GRILLES & TABLEAUX 2D",
    folder: "C:/GAMES/GRILLES/",
    games: [
      { id: "win-morpion", name: "Morpion Sacré (Minimax)", file: "MORPION.HC", icon: "+" },
      { id: "win-p4", name: "Puissance 4 de l'Alliance", file: "PUISSANCE_4.HC", icon: "[O]" },
      { id: "win-demineur", name: "Démineur de Feds CIA", file: "DEMINEUR.HC", icon: "[MINE]" },
      { id: "win-battleship", name: "Bataille Navale de l'Arche", file: "BATAILLE.HC", icon: "[SHIP]" },
      { id: "win-conway", name: "Jeu de la Vie (Conway B3/S23)", file: "CONWAY.HC", icon: "[CELL]" },
      { id: "win-taquin", name: "Le Taquin 15-Puzzle", file: "TAQUIN_15.HC", icon: "[NUM]" },
      { id: "win-sudoku", name: "Générateur / Solveur Sudoku", file: "SUDOKU.HC", icon: "[GRID]" }
    ]
  },
  {
    category: "2. LOGIQUE, STRINGS & BOUCLES",
    folder: "C:/GAMES/LOGIQUE/",
    games: [
      { id: "win-plusmoins", name: "Plus ou Moins", file: "PLUS_MOINS.HC", icon: "[?]" },
      { id: "win-mastermind", name: "Mastermind VGA", file: "MASTERMIND.HC", icon: "[O]" },
      { id: "win-pendu", name: "Le Pendu Sacré (ASCII Art)", file: "PENDU.HC", icon: "[HANG]" },
      { id: "win-motus", name: "Clone Wordle / Motus", file: "MOTUS.HC", icon: "[WORD]" },
      { id: "win-nim", name: "Jeu de Nim (XOR Math)", file: "JEU_NIM.HC", icon: "[FIRE]" },
      { id: "win-binary", name: "Convertisseur Express", file: "CONVERT_BIN.HC", icon: "[SYS]" }
    ]
  },
  {
    category: "3. AUDIO, LUMIÈRE & INTERFACE",
    folder: "C:/GAMES/AUDIO/",
    games: [
      { id: "win-simon", name: "Simon Musical 8-Bit", file: "SIMON_AUDIO.HC", icon: "[NOTE]" },
      { id: "win-poursuite", name: "Chasse au Trésor (Lyre MAC 250)", file: "POURSUITE.HC", icon: "[SPOT]" },
      { id: "win-pipedream", name: "Puzzle de Câblage Régie", file: "PIPE_DREAM.HC", icon: "[WIRE]" },
      { id: "win-sequencer", name: "Séquenceur Rythmique 8 Pas", file: "SEQUENCER.HC", icon: "[DRUM]" },
      { id: "win-idle", name: "Clicker / Idle de Location", file: "RENTAL_IDLE.HC", icon: "[GOLD]" }
    ]
  },
  {
    category: "4. PHYSIQUE & ARCADE 2D",
    folder: "C:/GAMES/ARCADE/",
    games: [
      { id: "win-pong", name: "Holy Pong (Ping-Pong 60 FPS)", file: "PONG.HC", icon: "[PONG]" },
      { id: "win-snake", name: "Le Serpent d'Airain de Moïse", file: "SNAKE.HC", icon: "[SNAKE]" },
      { id: "win-breakout", name: "Casse-Briques (Breakout)", file: "BREAKOUT.HC", icon: "[BRICK]" },
      { id: "win-flappy", name: "Flappy Bird (Flappy Terry)", file: "FLAPPY.HC", icon: "[BIRD]" },
      { id: "win-tetris", name: "Tetris Sacré (Tétriminos)", file: "TETRIS.HC", icon: "[ARC]" },
      { id: "win-asteroids", name: "Asteroids Vectoriel", file: "ASTEROIDS.HC", icon: "[ROCKET]" },
      { id: "win-invaders", name: "Space Invaders", file: "INVADERS.HC", icon: "[ALIEN]" },
      { id: "win-tron", name: "Tron Lightcycles (2 Joueurs)", file: "TRON.HC", icon: "[TRON]" },
      { id: "win-guitar", name: "Guitar Terry (Jeu de Rythme)", file: "GUITAR.HC", icon: "[TUNE]" }
    ]
  },
  {
    category: "5. IA & ALGORITHMES COMPLEXES",
    folder: "C:/GAMES/IA_ALGO/",
    games: [
      { id: "win-labyrinth", name: "Générateur de Labyrinthes (DFS)", file: "LABYRINTHE.HC", icon: "[MAZE]" },
      { id: "win-rogue", name: "Dungeon Crawler ASCII (Rogue)", file: "ROGUE.HC", icon: "[SWORD]" },
      { id: "win-cadavre", name: "Cadavre Exquis Procédural", file: "CADAVRE.HC", icon: "[DOC]" },
      { id: "win-qlearn", name: "Machine Learning (Q-Learning)", file: "Q_LEARNING.HC", icon: "[AI]" },
      { id: "win-eightqueens", name: "Problème des 8 Dames", file: "EIGHT_QUEENS.HC", icon: "[QUEEN]" },
      { id: "win-chess", name: "Mini-Échecs de Dieu (IA)", file: "CHESS_GOD.HC", icon: "[CHESS]" }
    ]
  },
  {
    category: "6. SYSTÈME & PROPHÉTIES",
    folder: "C:/SYSTEM/",
    games: [
      { id: "win-achievements", name: "Succès & Trophées Sacrés", file: "ACHIEVEMENTS.HC", icon: "[TOP]" },
      { id: "win-oracle", name: "Terminal HolyC & Scanner CIA", file: "HOLYC_ORACLE.HC", icon: "[SYS]" }
    ]
  },
  {
    category: "7. NOUVEL ORDRE MONDIAL & ILLUMINATI",
    folder: "C:/GAMES/ILLUMINATI/",
    games: [
      { id: "win-pyramid", name: "Pyramid Run (Temple d'Horus)", file: "PYRAMID_RUN.HC", icon: "[NWO]" },
      { id: "win-nwo", name: "NWO Tycoon (Secret Society)", file: "NWO_TYCOON.HC", icon: "[CIA]" },
      { id: "win-decrypt", name: "Le Décrypteur Illuminati", file: "DECRYPT_CODE.HC", icon: "[DOC]" },
      { id: "win-reptilian", name: "Whack-a-Reptilian (Denver)", file: "REPTILIAN.HC", icon: "[REP]" },
      { id: "win-tripong", name: "Tri-Pong Maçonnique (3 Côtés)", file: "TRI_PONG.HC", icon: "[TRI]" }
    ]
  },
  {
    category: "8. LE MEGASYS RING-0 (v5.0)",
    folder: "C:/MEGASYS/",
    games: [
      { id: "win-raycaster", name: "Wolfenstein Pentagone 3D", file: "DOOM_PENTAGON.HC", icon: "[3D]" },
      { id: "win-flight", name: "Simulateur de Vol Terry 3D", file: "GOD_FLIGHT.HC", icon: "[FLY]" },
      { id: "win-cards", name: "Black Jack du Vatican", file: "VATICAN_BJ.HC", icon: "[CARD]" },
      { id: "win-goat", name: "Tamagotchi Chèvre Sacrée", file: "GOAT_TAMAGOTCHI.HC", icon: "[GOAT]" },
      { id: "win-warroom", name: "War Room Conspirationniste", file: "WAR_ROOM.HC", icon: "[MAP]" },
      { id: "win-ide", name: "IDE HolyC de Programmation", file: "HOLYC_IDE.HC", icon: "[IDE]" },
      { id: "win-soundboard", name: "Soundboard de Terry Davis", file: "TERRY_VOICE.HC", icon: "[VOX]" },
      { id: "win-multiplayer", name: "Liaison Multijoueur P2P", file: "NET_WEBRTC.HC", icon: "[NET]" }
    ]
  },
  {
    category: "9. PIRATERIE & RÉSEAUX DISSIDENTS (v5.1)",
    folder: "C:/UNDERGROUND/",
    games: [
      { id: "win-radio", name: "Radio Pirate Anarchiste & Podcasts", file: "RADIO_PIRATE.HC", icon: "[RAD]" },
      { id: "win-area51", name: "Area 51 Stealth Infiltration", file: "HANGAR_S4.HC", icon: "[S4]" },
      { id: "win-cern", name: "CERN Particle Smasher LHC", file: "CERN_COLLIDER.HC", icon: "[LHC]" },
      { id: "win-bbs", name: "Cyber-Phreaking BBS Terminal", file: "BLUE_BOX_2600.HC", icon: "[ERR]" }
    ]
  },
  {
    category: "10. NOUVELLES EXPÉRIMENTATIONS DU RING-0 (v5.3)",
    folder: "C:/RING0_EXP/",
    games: [
      { id: "win-civic", name: "Terry 1996 Civic Escape (Pseudo-3D)", file: "CIVIC_1996.HC", icon: "[CAR]" },
      { id: "win-haarp", name: "HAARP Ionosphere Wave Hacker", file: "HAARP_ARRAY.HC", icon: "[WAVE]" },
      { id: "win-hex", name: "FAT32 Hex Sector Recovery", file: "FAT32_HEX.HC", icon: "[HEX]" },
      { id: "win-denver", name: "Denver Sub-Level 7 (Dungeon 3D)", file: "DENVER_S7.HC", icon: "[BUNKER]" },
      { id: "win-uvb", name: "UVB-76 Numbers Station 4625kHz", file: "UVB_76_RX.HC", icon: "[RADIO]" },
      { id: "win-crusade", name: "Holy Crusade (Mini Deck-Builder)", file: "CRUSADE_3X3.HC", icon: "[DECK]" },
      { id: "win-crispr", name: "CRISPR Synthetic Gene Lab", file: "CRISPR_DNA.HC", icon: "[GENE]" }
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
        EXPLORATEUR DE FICHIERS TEMPLEOS (52 JEUX & OUTILS DISPONIBLES)
      </div>
      <div style="max-height:430px; overflow-y:auto; padding-right:6px;">
    `;

    TEMPLE_GAMES_CATALOG.forEach(cat => {
      html += `
        <div style="margin-bottom:10px; border:1px solid #444; background:#000022; padding:5px 8px;">
          <div style="color:var(--vga-yellow); font-weight:bold; font-size:12px; margin-bottom:4px; display:flex; justify-content:space-between;">
            <span>[DIR] ${cat.category}</span>
            <span style="color:var(--vga-light-gray); font-size:11px;">${cat.folder}</span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(230px, 1fr)); gap:5px;">
            ${cat.games.map(g => `
              <div class="clickable explorer-item" data-window-id="${g.id}" style="display:flex; align-items:center; gap:8px; background:#000; border:1px solid #333; padding:4px 8px; cursor:pointer;" onclick="(window.desktop || desktop).openWindow('${g.id}')">
                <span style="font-size:16px;">${g.icon}</span>
                <div style="flex:1; overflow:hidden;">
                  <div style="color:var(--vga-white); font-weight:bold; font-size:11px; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${g.name}</div>
                  <div style="color:var(--vga-green); font-size:10px;">${g.file}</div>
                </div>
                <button class="temple-btn" style="padding:1px 6px; font-size:10px;" onclick="event.stopPropagation(); (window.desktop || desktop).openWindow('${g.id}')">OUVRIR</button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    html += `</div>`;
    this.container.innerHTML = html;

    // Écouteur de secours direct sur le conteneur
    this.container.querySelectorAll('.explorer-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const id = item.dataset.windowId;
        if (id && window.desktop) {
          window.desktop.openWindow(id);
        }
      });
    });
  }
}

window.TEMPLE_GAMES_CATALOG = TEMPLE_GAMES_CATALOG;
window.GamesExplorer = GamesExplorer;
