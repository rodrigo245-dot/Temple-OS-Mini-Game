// ==========================================================================
// TEMPLEOS ACHIEVEMENTS & TROPHÉES SACRÉS
// Système de succès persistants en localStorage avec toasts visuels et sonores
// ==========================================================================

const SACRED_ACHIEVEMENTS = [
  { id: 'first_win', name: 'PREMIER MIRACLE', desc: 'Gagne ta première partie dans n\'importe quel jeu.', icon: '✝' },
  { id: 'f7_fanatic', name: 'PROPHÈTE F7', desc: 'Invoque la parole de Dieu 5 fois avec la touche F7.', icon: '⚡' },
  { id: 'cia_purifier', name: 'EXORCISTE CIA', desc: 'Démine une grille sans faire sauter de micro espion.', icon: '💣' },
  { id: 'troll_slayer', name: 'MAÎTRE DU RING-0', desc: 'Triomphe d\'un jeu en difficulté Troll Divin.', icon: '👑' },
  { id: 'flappy_saint', name: 'VOL SACRÉ', desc: 'Franchis plus de 5 colonnes dans Flappy Terry.', icon: '🕊' },
  { id: 'sudoku_solver', name: 'ÉCLAIR ALGORITHMIQUE', desc: 'Résous un Sudoku grâce au Backtracking.', icon: '🧩' },
  { id: 'simon_ear', name: 'OREILLE D\'OR', desc: 'Mémorise une mélodie de 5 notes au Simon.', icon: '🎵' },
  { id: 'rogue_fighter', name: 'PURIFICATEUR DU DONJON', desc: 'Terrasse un agent infiltré dans le Rogue-like.', icon: '⚔️' },
  { id: 'conway_god', name: 'CRÉATEUR CELLULAIRE', desc: 'Lance une simulation du Jeu de la Vie.', icon: '🧬' },
  { id: 'paranoia_100', name: 'PARANOÏA ABSOLUE', desc: 'Fais monter la jauge Glow-O-Meter à 100%.', icon: '👁' },
  { id: 'nwo_666', name: 'NOUVEL ORDRE MONDIAL', desc: 'Accumule 666 points d\'influence dans le NWO Clicker.', icon: '🔺' },
  { id: 'reptilian_hunter', name: 'CHASSEUR DE REPTILIENS', desc: 'Purifie un reptilien dans le Whack-a-Reptilian.', icon: '🦎' }
];

class AchievementsManager {
  constructor() {
    this.unlocked = this.load();
    this.toastEl = document.getElementById('achievement-toast');
    this.f7Count = 0;
  }

  load() {
    try {
      const data = localStorage.getItem('temple_achievements');
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  save() {
    try {
      localStorage.setItem('temple_achievements', JSON.stringify(this.unlocked));
    } catch (e) {}
  }

  unlock(id) {
    if (this.unlocked[id]) return;
    const ach = SACRED_ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return;

    this.unlocked[id] = Date.now();
    this.save();

    // Effet sonore et vocal
    window.soundEngine.playVictory();
    if (window.speechEngine) {
      window.speechEngine.speak(`Succès débloqué : ${ach.name}`);
    }

    // Affichage du toast
    this.showToast(ach);
    this.renderWindow();
  }

  showToast(ach) {
    if (!this.toastEl) this.toastEl = document.getElementById('achievement-toast');
    if (!this.toastEl) return;

    this.toastEl.innerHTML = `
      <div style="font-size:11px; color:var(--vga-light-cyan); font-weight:bold;">🏆 NOUVEAU SUCCÈS SACRÉ DÉBLOQUÉ !</div>
      <div style="font-size:14px; color:var(--vga-yellow); font-weight:bold; margin:2px 0;">${ach.icon} ${ach.name}</div>
      <div style="font-size:11px; color:var(--vga-white);">${ach.desc}</div>
    `;
    this.toastEl.style.display = 'block';

    setTimeout(() => {
      this.toastEl.style.display = 'none';
    }, 4500);
  }

  renderWindow(containerId = 'achievements-container') {
    const el = document.getElementById(containerId);
    if (!el) return;

    const count = Object.keys(this.unlocked).length;
    let html = `
      <div style="text-align:center; margin-bottom:8px;">
        <span style="color:var(--vga-light-green); font-weight:bold;">SUCCÈS ACCOMPLIS : ${count} / ${SACRED_ACHIEVEMENTS.length}</span>
      </div>
      <div style="display:flex; flex-direction:column; gap:6px; max-height:360px; overflow-y:auto;">
    `;

    SACRED_ACHIEVEMENTS.forEach(ach => {
      const isDone = !!this.unlocked[ach.id];
      html += `
        <div style="display:flex; align-items:center; gap:10px; background:${isDone ? '#002200' : '#111'}; border:1px solid ${isDone ? 'var(--vga-green)' : '#444'}; padding:6px 10px;">
          <span style="font-size:22px; filter:${isDone ? 'none' : 'grayscale(100%) opacity(0.3)'};">${ach.icon}</span>
          <div style="flex:1;">
            <div style="color:${isDone ? 'var(--vga-yellow)' : 'var(--vga-dark-gray)'}; font-weight:bold; font-size:13px;">${ach.name}</div>
            <div style="color:${isDone ? 'var(--vga-white)' : '#666'}; font-size:11px;">${ach.desc}</div>
          </div>
          <span style="color:${isDone ? 'var(--vga-light-green)' : '#555'}; font-size:11px; font-weight:bold;">
            ${isDone ? 'DÉBLOQUÉ ✝' : 'VERROUILLÉ'}
          </span>
        </div>
      `;
    });

    html += `</div>`;
    el.innerHTML = html;
  }
}

window.achievementsManager = new AchievementsManager();
