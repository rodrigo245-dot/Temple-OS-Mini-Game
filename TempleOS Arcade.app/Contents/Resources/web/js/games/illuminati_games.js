// ==========================================================================
// CATÉGORIE 7 : NOUVEL ORDRE MONDIAL & JEUX ILLUMINATI (TEMPLEOS V4.0)
// 1. Pyramid Run (Le Temple Perdu d'Horus)
// 2. Secret Society Clicker (NWO Tycoon)
// 3. Le Décrypteur Illuminati (César, Atbash, Templiers)
// 4. Whack-a-Reptilian (La Chèvre de Denver)
// 5. Tri-Pong Illuminati (Pong Triangulaire Sacré)
// ==========================================================================

// --------------------------------------------------------------------------
// 1. PYRAMID RUN (LE TEMPLE PERDU D'HORUS)
// Vertical runner rétro : pilotez la pyramide pour esquiver satellites & lasers
// --------------------------------------------------------------------------
class PyramidRunGame {
  constructor(canvasId, scoreId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.scoreEl = document.getElementById(scoreId);

    this.width = this.canvas.width = 340;
    this.height = this.canvas.height = 360;

    this.playerX = this.width / 2;
    this.playerY = this.height - 45;
    this.playerW = 26;
    this.playerH = 26;
    this.speed = 4.5;

    this.obstacles = [];
    this.score = 0;
    this.altitude = 0;
    this.isRunning = false;
    this.animId = null;

    this.keys = {};
    this.initEvents();
    this.reset();
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(e.code)) {
        this.keys[e.code] = true;
      }
    });
    window.addEventListener('keyup', (e) => {
      if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(e.code)) {
        this.keys[e.code] = false;
      }
    });
  }

  reset() {
    this.playerX = this.width / 2;
    this.obstacles = [];
    this.score = 0;
    this.altitude = 0;
    this.updateScore();
    this.draw();
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.reset();
      this.loop();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  updateScore() {
    if (this.scoreEl) {
      this.scoreEl.textContent = `ALTITUDE : ${Math.floor(this.altitude)}m | SCORE : ${this.score}`;
    }
  }

  spawnObstacle() {
    const types = [
      { name: 'SATELLITE_ECHELON', icon: '[SAT]️', w: 24, h: 20, color: '#55ffff' },
      { name: 'BILLET_DOLLAR', icon: '[USD]', w: 22, h: 16, color: '#55ff55' },
      { name: 'CHOUETTE_BOHEMIAN', icon: '[OWL]', w: 20, h: 22, color: '#ffff55' },
      { name: 'LASER_5G', icon: '[SYS]', w: 18, h: 24, color: '#ff5555' }
    ];
    const type = types[Math.floor(Math.random() * types.length)];
    const x = Math.random() * (this.width - 30) + 15;
    this.obstacles.push({
      x,
      y: -25,
      type,
      speed: 2.5 + Math.min(4, this.altitude / 800)
    });
  }

  update() {
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
      this.playerX = Math.max(15, this.playerX - this.speed);
    }
    if (this.keys['ArrowRight'] || this.keys['KeyD']) {
      this.playerX = Math.min(this.width - 15, this.playerX + this.speed);
    }

    this.altitude += 1.2;
    this.score = Math.floor(this.altitude / 10);
    this.updateScore();

    if (Math.random() < 0.045) {
      this.spawnObstacle();
    }

    // Déplacement obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.y += obs.speed;

      // Collision avec la Pyramide sacrée
      const dx = Math.abs(this.playerX - obs.x);
      const dy = Math.abs(this.playerY - obs.y);
      if (dx < 18 && dy < 18) {
        window.soundEngine.playExplosion();
        if (window.speechEngine) window.speechEngine.speak("La pyramide s'est effondrée !");
        this.stop();
        alert(`[HIT] IMPACT CONSPIRATIONNISTE ! Altitude atteinte : ${Math.floor(this.altitude)}m.`);
        return;
      }

      if (obs.y > this.height + 30) {
        this.obstacles.splice(i, 1);
      }
    }
  }

  draw() {
    // Fond étoilé illuminati
    this.ctx.fillStyle = '#000018';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Lignes de fuite pyramidale
    this.ctx.strokeStyle = '#002233';
    this.ctx.lineWidth = 1;
    for (let x = 0; x <= this.width; x += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x + ((this.altitude * 2) % 30) - 15, this.height);
      this.ctx.stroke();
    }

    // Dessin des obstacles
    this.ctx.font = '16px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    for (const obs of this.obstacles) {
      this.ctx.fillText(obs.type.icon, obs.x, obs.y);
    }

    // Dessin du Joueur (Pyramide d'Or avec l'Œil)
    this.ctx.fillStyle = '#ffff55';
    this.ctx.beginPath();
    this.ctx.moveTo(this.playerX, this.playerY - 16);
    this.ctx.lineTo(this.playerX - 16, this.playerY + 12);
    this.ctx.lineTo(this.playerX + 16, this.playerY + 12);
    this.ctx.closePath();
    this.ctx.fill();

    // Pierre de faîte flottante
    this.ctx.fillStyle = '#55ff55';
    this.ctx.beginPath();
    this.ctx.moveTo(this.playerX, this.playerY - 22);
    this.ctx.lineTo(this.playerX - 7, this.playerY - 12);
    this.ctx.lineTo(this.playerX + 7, this.playerY - 12);
    this.ctx.closePath();
    this.ctx.fill();

    // Œil au centre
    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(this.playerX, this.playerY + 2, 4, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#55ffff';
    this.ctx.beginPath();
    this.ctx.arc(this.playerX, this.playerY + 2, 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }
}

// --------------------------------------------------------------------------
// 2. SECRET SOCIETY CLICKER (NWO TYCOON)
// Achetez des Banques Centrales, Médias de Masse et Chemtrails pour contrôler le monde !
// --------------------------------------------------------------------------
class NWOClickerGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.influence = 0;
    this.totalInfluence = 0;
    this.totalLifetimeInfluence = 0;
    this.perSec = 0;
    this.clickPower = 1;
    this.horusSeals = 0; // Prestige currency (+10% each)
    this.activeTab = 'assets'; // 'assets', 'doctrines', 'prestige', 'stats'
    this.newsMessage = "ANNUIT CŒPTIS : Le Nouvel Ordre Mondial amorce sa prise de contrôle silencieuse.";
    this.flyingBonus = null; // Bonus cliquable volant

    // 20 Actifs de Conspiration répartis en 4 Ères
    this.upgrades = [
      // Ère 1 : Surveillance de Proximité
      { id: 'pigeon', era: 1, name: 'Pigeons Espions Caméras 4K', cost: 15, baseCost: 15, gen: 1, count: 0, icon: '[BIRD]' },
      { id: 'chemtrail', era: 1, name: 'Flotte de Chemtrails Aériens', cost: 75, baseCost: 75, gen: 5, count: 0, icon: '[FLY]' },
      { id: 'fluor', era: 1, name: 'Fluorure & Nanoparticules', cost: 320, baseCost: 320, gen: 18, count: 0, icon: '[VIAL]' },
      { id: 'pharma', era: 1, name: 'Médicaments Big Pharma', cost: 1200, baseCost: 1200, gen: 65, count: 0, icon: '[PILL]' },
      { id: 'tiktok', era: 1, name: 'Algorithme de Doomscrolling', cost: 4200, baseCost: 4200, gen: 240, count: 0, icon: '[PHONE]' },

      // Ère 2 : Hégémonie Financière & Médiatique
      { id: 'media', era: 2, name: 'Monopole Télévisuel 24/7', cost: 16000, baseCost: 16000, gen: 900, count: 0, icon: '[CRT]' },
      { id: 'centralbank', era: 2, name: 'Banque Centrale & Planche à Billets', cost: 65000, baseCost: 65000, gen: 3800, count: 0, icon: '[TEMPLE]️' },
      { id: 'davos', era: 2, name: 'Sommet Annuel des Élites (Davos)', cost: 260000, baseCost: 260000, gen: 15000, count: 0, icon: '[HAT]' },
      { id: 'bohemian', era: 2, name: 'Rituels de Bohemian Grove', cost: 950000, baseCost: 950000, gen: 60000, count: 0, icon: '[OWL]' },
      { id: 'denver', era: 2, name: 'Bunker Souterrain Denver -4', cost: 3800000, baseCost: 3800000, gen: 240000, count: 0, icon: '[VOID]️' },

      // Ère 3 : Transhumanisme & Cyber-Contrôle
      { id: 'neuralchip', era: 3, name: 'Implants Cérébraux Neural-Chip', cost: 16000000, baseCost: 16000000, gen: 1000000, count: 0, icon: '[AI]' },
      { id: 'echelon', era: 3, name: 'Satellites ECHELON & PRISM', cost: 70000000, baseCost: 70000000, gen: 4500000, count: 0, icon: '[SAT]️' },
      { id: 'clones', era: 3, name: 'Laboratoire de Clonage d\'Élites', cost: 320000000, baseCost: 320000000, gen: 21000000, count: 0, icon: '[CELL]' },
      { id: 'reptilian', era: 3, name: 'Ambassade Reptilienne Secrète', cost: 1400000000, baseCost: 1400000000, gen: 95000000, count: 0, icon: '[REP]' },
      { id: 'cern', era: 3, name: 'Collisionneur CERN Multidimensionnel', cost: 6500000000, baseCost: 6500000000, gen: 440000000, count: 0, icon: '[LHC]' },

      // Ère 4 : Domination Cosmique & Matrice Céleste
      { id: 'tr3b', era: 4, name: 'Flotte d\'OVNIs Anti-Gravité TR-3B', cost: 30000000000, baseCost: 30000000000, gen: 2100000000, count: 0, icon: '[S4]' },
      { id: 'pyramidspace', era: 4, name: 'Pyramide d\'Or Spatiale Orbitale', cost: 150000000000, baseCost: 150000000000, gen: 11000000000, count: 0, icon: '[NWO]' },
      { id: 'matrixring0', era: 4, name: 'Matrice de Réalité Simulée Ring-0', cost: 800000000000, baseCost: 800000000000, gen: 60000000000, count: 0, icon: '[DISK]' },
      { id: 'eyeprovidence', era: 4, name: 'Œil Céleste de la Providence', cost: 4500000000000, baseCost: 4500000000000, gen: 350000000000, count: 0, icon: '[CIA]' },
      { id: 'novusordo', era: 4, name: 'Annuit Cœptis : Conscience Globale', cost: 25000000000000, baseCost: 25000000000000, gen: 2000000000000, count: 0, icon: '[QUEEN]' }
    ];

    // 12 Doctrines Secrètes / Technologies (Achat unique)
    this.doctrines = [
      { id: 'doc_gloves', name: 'Gants Maçonniques en Soie', cost: 400, bought: false, desc: 'Double la puissance de clic (+x2 clic)', icon: '[GLOVE]' },
      { id: 'doc_subliminal', name: 'Flashs Subliminaux TV', cost: 3500, bought: false, desc: 'Multiplie par 3 les gains des Médias et TikTok', icon: '[CRT]' },
      { id: 'doc_qe', name: 'Quantitative Easing Perpétuel', cost: 25000, bought: false, desc: 'Multiplie par 3 les gains de la Banque Centrale', icon: '[USD]' },
      { id: 'doc_laser5g', name: 'Réseau 5G à Fréquence Scalaire', cost: 150000, bought: false, desc: '+30% de pouvoir passif global', icon: '[SYS]' },
      { id: 'doc_owl', name: 'Bénédiction de la Chouette Sacrée', cost: 800000, bought: false, desc: '+50% de pouvoir passif global et clics x3', icon: '[OWL]' },
      { id: 'doc_hybriddna', name: 'Génome Hybride Séro-Reptilien', cost: 5000000, bought: false, desc: 'Multiplie par 4 les gains des Ambassades Reptiliennes', icon: '[REP]' },
      { id: 'doc_godparticle', name: 'Extraction de la Particule de Dieu', cost: 35000000, bought: false, desc: 'Multiplie par 4 les gains du Collisionneur CERN', icon: '[LHC]' },
      { id: 'doc_bluebeam', name: 'Projet Holographique Blue Beam', cost: 200000000, bought: false, desc: 'Double la production de toutes les ères (+100%)', icon: '[COSMOS]' },
      { id: 'doc_clickratio', name: 'Sceau de Salomon Alchimique', cost: 1500000000, bought: false, desc: 'Chaque clic ajoute 3% de votre production par seconde', icon: '[SEAL]' },
      { id: 'doc_hivemind', name: 'Liaison Synaptique Collective', cost: 12000000000, bought: false, desc: '+150% de production passive globale', icon: '[NET]' },
      { id: 'doc_timewarp', name: 'Inversion Temporelle Scalaire', cost: 100000000000, bought: false, desc: 'Triple tous les gains de l\'univers (+200%)', icon: '[TIME]' },
      { id: 'doc_apotheosis', name: 'Apothéose de l\'Ordre Mondial', cost: 1000000000000, bought: false, desc: 'Multiplie toute la production par 5 (x5 Global)', icon: '[SUN]️' }
    ];

    this.loadState();
    this.recalcStats();
    this.init();

    // Boucle de production par seconde
    setInterval(() => this.tick(), 1000);

    // Boucle d'événements aléatoires et flash news (toutes les 20 secondes)
    setInterval(() => this.randomNewsEvent(), 20000);

    // Sauvegarde automatique toutes les 10 secondes
    setInterval(() => this.saveState(), 10000);
  }

  init() {
    this.render();
  }

  formatNum(n) {
    if (n >= 1e12) return (n / 1e12).toFixed(2) + ' Billion';
    if (n >= 1e9) return (n / 1e9).toFixed(2) + ' Milliard';
    if (n >= 1e6) return (n / 1e6).toFixed(2) + ' Million';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + ' k';
    return Math.floor(n).toLocaleString('fr-FR');
  }

  saveState() {
    try {
      const data = {
        influence: this.influence,
        totalInfluence: this.totalInfluence,
        totalLifetimeInfluence: this.totalLifetimeInfluence,
        horusSeals: this.horusSeals,
        upgrades: this.upgrades.map(u => ({ id: u.id, count: u.count, cost: u.cost })),
        doctrines: this.doctrines.map(d => ({ id: d.id, bought: d.bought }))
      };
      localStorage.setItem('temple_nwo_tycoon_v5', JSON.stringify(data));
    } catch (e) {}
  }

  loadState() {
    try {
      const raw = localStorage.getItem('temple_nwo_tycoon_v5');
      if (raw) {
        const data = JSON.parse(raw);
        if (data.influence) this.influence = data.influence;
        if (data.totalInfluence) this.totalInfluence = data.totalInfluence;
        if (data.totalLifetimeInfluence) this.totalLifetimeInfluence = data.totalLifetimeInfluence;
        if (data.horusSeals) this.horusSeals = data.horusSeals;

        if (data.upgrades) {
          data.upgrades.forEach(saved => {
            const up = this.upgrades.find(u => u.id === saved.id);
            if (up) {
              up.count = saved.count;
              up.cost = saved.cost;
            }
          });
        }

        if (data.doctrines) {
          data.doctrines.forEach(saved => {
            const doc = this.doctrines.find(d => d.id === saved.id);
            if (doc) doc.bought = saved.bought;
          });
        }
      }
    } catch (e) {}
  }

  setTab(tab) {
    this.activeTab = tab;
    window.soundEngine.playClick();
    this.render();
  }

  clickGlobe() {
    let power = this.clickPower;
    // Sceau de Salomon : 3% de perSec ajouté au clic
    if (this.hasDoctrine('doc_clickratio')) {
      power += this.perSec * 0.03;
    }
    this.influence += power;
    this.totalInfluence += power;
    this.totalLifetimeInfluence += power;
    window.soundEngine.playClick();
    this.render();

    if (this.totalLifetimeInfluence >= 666 && window.achievementsManager) {
      window.achievementsManager.unlock('nwo_666');
    }
  }

  hasDoctrine(id) {
    const d = this.doctrines.find(item => item.id === id);
    return d ? d.bought : false;
  }

  recalcStats() {
    // 1. Calcul du multiplicateur de prestige (Sceaux d'Horus)
    const prestigeMult = 1 + (this.horusSeals * 0.10); // +10% par sceau

    // 2. Puissance de clic
    let baseClick = 1;
    if (this.hasDoctrine('doc_gloves')) baseClick *= 2;
    if (this.hasDoctrine('doc_owl')) baseClick *= 3;
    this.clickPower = baseClick * prestigeMult;

    // 3. Multiplicateurs globaux
    let globalMult = prestigeMult;
    if (this.hasDoctrine('doc_laser5g')) globalMult *= 1.3;
    if (this.hasDoctrine('doc_owl')) globalMult *= 1.5;
    if (this.hasDoctrine('doc_bluebeam')) globalMult *= 2.0;
    if (this.hasDoctrine('doc_hivemind')) globalMult *= 2.5;
    if (this.hasDoctrine('doc_timewarp')) globalMult *= 3.0;
    if (this.hasDoctrine('doc_apotheosis')) globalMult *= 5.0;

    // 4. Calcul de la génération par seconde de chaque actif
    let totalGen = 0;
    this.upgrades.forEach(u => {
      let itemGen = u.gen;
      // Multiplicateurs spécifiques
      if (this.hasDoctrine('doc_subliminal') && (u.id === 'media' || u.id === 'tiktok')) itemGen *= 3;
      if (this.hasDoctrine('doc_qe') && u.id === 'centralbank') itemGen *= 3;
      if (this.hasDoctrine('doc_hybriddna') && u.id === 'reptilian') itemGen *= 4;
      if (this.hasDoctrine('doc_godparticle') && u.id === 'cern') itemGen *= 4;

      totalGen += u.count * itemGen * globalMult;
    });

    this.perSec = totalGen;
  }

  buyUpgrade(id) {
    const up = this.upgrades.find(u => u.id === id);
    if (!up || this.influence < up.cost) return;

    this.influence -= up.cost;
    up.count++;
    up.cost = Math.floor(up.cost * 1.20); // Progression exponentielle équilibrée
    this.recalcStats();
    window.soundEngine.playTokenDrop();
    this.render();
  }

  buyDoctrine(id) {
    const doc = this.doctrines.find(d => d.id === id);
    if (!doc || doc.bought || this.influence < doc.cost) return;

    this.influence -= doc.cost;
    doc.bought = true;
    this.recalcStats();
    window.soundEngine.playHolyMiracle();
    if (window.speechEngine) window.speechEngine.speak(`Doctrine adoptée : ${doc.name}`);
    this.render();
  }

  // Prestige / Ascendance Maçonnique (Le Grand Reset)
  prestigeReset() {
    const sealsToEarn = Math.floor(Math.sqrt(this.totalLifetimeInfluence / 1000000));
    if (sealsToEarn <= this.horusSeals) {
      alert(`Il vous faut au moins 1 000 000 d'influence totale pour obtenir un nouveau Sceau d'Horus ! Prochain sceau disponible à plus haute influence.`);
      return;
    }

    const diff = sealsToEarn - this.horusSeals;
    if (!confirm(`[CIA] VOULEZ-VOUS INITIER LE GRAND RESET ?\n\nVous sacrifierez votre influence et vos conspirations actuelles pour obtenir +${diff} Sceaux d'Horus !\nChaque sceau confère un bonus permanent de +10% de production sur toutes vos futures parties.`)) {
      return;
    }

    this.horusSeals = sealsToEarn;
    this.influence = 0;
    this.totalInfluence = 0;

    // Reset des bâtiments
    this.upgrades.forEach(u => {
      u.count = 0;
      u.cost = u.baseCost;
    });

    // Reset des doctrines
    this.doctrines.forEach(d => {
      d.bought = false;
    });

    this.recalcStats();
    this.saveState();
    window.soundEngine.playHolyMiracle();
    if (window.speechEngine) window.speechEngine.speak("Le Grand Reset a eu lieu. Vous renaissez sous la bénédiction d'Horus.");
    this.render();
  }

  randomNewsEvent() {
    const news = [
      "ALERTE : Un lanceur d'alerte a été neutralisé par nos agents dans les médias.",
      "FINANCES : La Réserve Fédérale imprime 500 milliards supplémentaires sans contrôle.",
      "SANTÉ : Les niveaux de fluorure dans les réseaux urbains atteignent les quotas idéaux.",
      "TECH : 98% des jeunes passent plus de 7 heures par jour sous hypnose algorithmique.",
      "CLIMAT : Nouvelle formation géométrique de chemtrails au-dessus de Paris et New York.",
      "DAVOS : Les dirigeants mondiaux valident l'introduction du crédit social quantique.",
      "DENVER : Témoins rapportent des bruits de machinerie lourde sous la piste 16L.",
      "CERN : Des fluctuations du champ scalaire confirment l'ouverture d'un portail.",
      "TERRY DAVIS : Les feds continuent de briller dans le noir sous nos caméras infrarouges !"
    ];
    this.newsMessage = `[NWO] FLASH NWO : ${news[Math.floor(Math.random() * news.length)]}`;
    this.renderNewsTicker();
  }

  renderNewsTicker() {
    const el = document.getElementById('nwo-news-ticker');
    if (el) el.textContent = this.newsMessage;
  }

  tick() {
    if (this.perSec > 0) {
      this.influence += this.perSec;
      this.totalInfluence += this.perSec;
      this.totalLifetimeInfluence += this.perSec;
      this.renderLiveCounters();
    }
  }

  renderLiveCounters() {
    const infEl = document.getElementById('nwo-inf-val');
    const secEl = document.getElementById('nwo-sec-val');
    const popEl = document.getElementById('nwo-pop-val');
    const barEl = document.getElementById('nwo-pop-bar');

    if (infEl) infEl.textContent = `${this.formatNum(this.influence)} [CIA]`;
    if (secEl) secEl.textContent = `+${this.formatNum(this.perSec)} / sec`;

    const globalPercent = Math.min(100, (this.totalLifetimeInfluence / 10000000000) * 100).toFixed(3);
    if (popEl) popEl.textContent = `${globalPercent}%`;
    if (barEl) barEl.style.width = `${globalPercent}%`;
  }

  render() {
    if (!this.container) return;
    const sealsToEarn = Math.floor(Math.sqrt(this.totalLifetimeInfluence / 1000000));
    const nextSeals = Math.max(0, sealsToEarn - this.horusSeals);

    this.container.innerHTML = `
      <div style="display:flex; flex-direction:column; height:100%; font-family:var(--font-temple);">

        <!-- Bandeau d'actualités NWO -->
        <div id="nwo-news-ticker" style="background:#002200; border:1px solid #00aa00; color:#55ff55; font-size:10px; padding:3px 6px; margin-bottom:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
          ${this.newsMessage}
        </div>

        <div style="display:flex; gap:10px; flex:1; overflow:hidden;">

          <!-- Colonne Gauche : Le Globe Maçonnique & Stats Rapides -->
          <div style="flex:1; max-width:240px; background:#001100; border:1px solid #00aa00; padding:8px; display:flex; flex-direction:column; align-items:center; justify-content:space-between;">
            <div style="text-align:center; width:100%;">
              <div style="color:var(--vga-light-green); font-size:10px; font-weight:bold;">PUISSANCE D'INFLUENCE NWO</div>
              <div id="nwo-inf-val" style="font-size:20px; color:var(--vga-yellow); font-weight:bold; margin:4px 0;">
                ${this.formatNum(this.influence)} [CIA]
              </div>
              <div id="nwo-sec-val" style="font-size:10px; color:#88ff88;">
                +${this.formatNum(this.perSec)} / sec
              </div>
              <div style="font-size:9px; color:#aaa; margin-top:2px;">
                Puissance clic : +${this.formatNum(this.clickPower)}
              </div>
            </div>

            <!-- Bouton Globe d'Asservissement -->
            <div class="clickable" style="width:85px; height:85px; margin:8px auto; border-radius:50%; background:#003300; border:3px solid #55ff55; display:flex; align-items:center; justify-content:center; font-size:38px; cursor:pointer; box-shadow:0 0 15px rgba(85,255,85,0.3); transition:transform 0.05s;" onclick="desktop.games.nwoClicker.clickGlobe()">
              [CIA]
            </div>
            <div style="font-size:9px; color:#ffff55;">CLIQUEZ POUR ASSERVIR</div>

            <!-- Jauge de domination mondiale -->
            <div style="width:100%; margin-top:6px;">
              <div style="display:flex; justify-content:space-between; font-size:9px; color:#88ff88;">
                <span>DOMINATION MONDIALE :</span>
                <span id="nwo-pop-val">0%</span>
              </div>
              <div style="background:#000; border:1px solid #444; height:8px; margin-top:2px;">
                <div id="nwo-pop-bar" style="background:#55ff55; height:100%; width:0%;"></div>
              </div>
              <div style="font-size:9px; color:#ffd700; margin-top:4px; text-align:center;">
                Sceaux d'Horus : ${this.horusSeals} (+${this.horusSeals * 10}%)
              </div>
            </div>
          </div>

          <!-- Colonne Droite : Navigation par Onglets -->
          <div style="flex:2; display:flex; flex-direction:column; overflow:hidden;">

            <!-- Barre d'onglets -->
            <div style="display:flex; gap:4px; margin-bottom:6px;">
              <button class="temple-btn ${this.activeTab === 'assets' ? 'primary' : ''}" style="padding:3px 8px; font-size:10px;" onclick="desktop.games.nwoClicker.setTab('assets')">
                [TEMPLE]️ CONSPIRATIONS (${this.upgrades.filter(u=>u.count>0).length}/${this.upgrades.length})
              </button>
              <button class="temple-btn ${this.activeTab === 'doctrines' ? 'primary' : ''}" style="padding:3px 8px; font-size:10px;" onclick="desktop.games.nwoClicker.setTab('doctrines')">
                [DOC] RECHERCHES (${this.doctrines.filter(d=>d.bought).length}/${this.doctrines.length})
              </button>
              <button class="temple-btn ${this.activeTab === 'prestige' ? 'holy' : ''}" style="padding:3px 8px; font-size:10px;" onclick="desktop.games.nwoClicker.setTab('prestige')">
                [CIA] GRAND RESET (${nextSeals > 0 ? `+${nextSeals}` : '0'})
              </button>
            </div>

            <!-- Contenu de l'onglet actif -->
            <div style="flex:1; overflow-y:auto; padding-right:4px;">
              ${this.renderActiveTabContent()}
            </div>
          </div>

        </div>
      </div>
    `;

    this.renderLiveCounters();
  }

  renderActiveTabContent() {
    if (this.activeTab === 'assets') {
      return `
        <div style="display:flex; flex-direction:column; gap:5px;">
          ${this.upgrades.map(u => `
            <div style="background:#000; border:1px solid ${this.influence >= u.cost ? '#55ff55' : '#333'}; padding:4px 8px; display:flex; align-items:center; gap:8px;">
              <span style="font-size:22px;">${u.icon}</span>
              <div style="flex:1; overflow:hidden;">
                <div style="color:var(--vga-white); font-size:11px; font-weight:bold; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">
                  ${u.name} <span style="color:#ffd700;">(x${u.count})</span>
                </div>
                <div style="color:var(--vga-light-green); font-size:10px;">
                  +${this.formatNum(u.gen)}/s | Coût: <span style="color:#ffff55;">${this.formatNum(u.cost)} [CIA]</span>
                </div>
              </div>
              <button class="temple-btn ${this.influence >= u.cost ? 'primary' : ''}" style="padding:2px 8px; font-size:10px;" onclick="desktop.games.nwoClicker.buyUpgrade('${u.id}')" ${this.influence < u.cost ? 'disabled' : ''}>
                ACHETER
              </button>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (this.activeTab === 'doctrines') {
      return `
        <div style="display:flex; flex-direction:column; gap:5px;">
          <div style="color:#aaa; font-size:10px; margin-bottom:4px;">
            Débloquez des technologies et décrets secrets pour décupler votre puissance d'influence !
          </div>
          ${this.doctrines.map(d => `
            <div style="background:${d.bought ? '#002200' : '#000'}; border:1px solid ${d.bought ? '#ffd700' : (this.influence >= d.cost ? '#55ff55' : '#444')}; padding:5px 8px; display:flex; align-items:center; gap:8px;">
              <span style="font-size:20px;">${d.icon}</span>
              <div style="flex:1;">
                <div style="color:${d.bought ? '#ffd700' : '#fff'}; font-size:11px; font-weight:bold;">
                  ${d.name} ${d.bought ? '[OK] [ADOPTÉE]' : ''}
                </div>
                <div style="color:#88ff88; font-size:10px;">${d.desc}</div>
                ${!d.bought ? `<div style="color:#ffff55; font-size:10px;">Coût : ${this.formatNum(d.cost)} [CIA]</div>` : ''}
              </div>
              ${!d.bought ? `
                <button class="temple-btn ${this.influence >= d.cost ? 'primary' : ''}" style="padding:2px 8px; font-size:10px;" onclick="desktop.games.nwoClicker.buyDoctrine('${d.id}')" ${this.influence < d.cost ? 'disabled' : ''}>
                  RECHERCHER
                </button>
              ` : `
                <span style="color:#ffd700; font-size:11px; font-weight:bold;">ACTIF</span>
              `}
            </div>
          `).join('')}
        </div>
      `;
    }

    if (this.activeTab === 'prestige') {
      const sealsToEarn = Math.floor(Math.sqrt(this.totalLifetimeInfluence / 1000000));
      const nextSeals = Math.max(0, sealsToEarn - this.horusSeals);

      return `
        <div style="background:#001100; border:2px solid #ffd700; padding:12px; text-align:center;">
          <div style="font-size:16px; color:#ffd700; font-weight:bold; margin-bottom:6px;">
            [CIA] LE GRAND RESET MAÇONNIQUE [CIA]
          </div>
          <div style="font-size:11px; color:#fff; line-height:1.4; margin-bottom:12px;">
            Détruisez la réalité actuelle pour renaître dans un cycle supérieur.<br>
            Vous possédez actuellement : <strong style="color:#ffd700;">${this.horusSeals} Sceaux d'Horus</strong> (+${this.horusSeals * 10}% permanent).
          </div>

          <div style="background:#000; border:1px solid #555; padding:8px; margin-bottom:12px; font-size:11px;">
            <div>Influence totale accumulée à vie : <span style="color:#55ff55;">${this.formatNum(this.totalLifetimeInfluence)} [CIA]</span></div>
            <div style="margin-top:4px;">Nouveaux Sceaux disponibles au Reset : <span style="color:#ffd700; font-weight:bold;">+${nextSeals}</span></div>
          </div>

          <button class="temple-btn holy" style="padding:6px 16px; font-size:12px;" onclick="desktop.games.nwoClicker.prestigeReset()" ${nextSeals <= 0 ? 'disabled' : ''}>
            [SYS] SACRIFIER ET OBTENIR +${nextSeals} SCEAUX D'HORUS [SYS]
          </button>
          <div style="font-size:9px; color:#aaa; margin-top:8px;">
            (Nécessite au moins 1 Sceau disponible pour initier le Reset)
          </div>
        </div>
      `;
    }

    return '';
  }
}

// --------------------------------------------------------------------------
// 3. LE DÉCRYPTEUR ILLUMINATI
// Cassez les codes chiffrés des sociétés secrètes (César / Atbash / Templiers)
// --------------------------------------------------------------------------
class IlluminatiDecryptGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.secretMessages = [
      { plain: "NOVUS ORDO SECLORUM", cipher: "QRYXV RUGU VHOXUXP", shift: 3, hint: "Chiffre de César (+3)" },
      { plain: "ANNUIT COEPTIS", cipher: "DQQXLW FRHSWLV", shift: 3, hint: "Chiffre de César (+3)" },
      { plain: "BOHEMIAN GROVE 1993", cipher: "ERKHPLDQ JURYH 1993", shift: 3, hint: "Chiffre de César (+3)" },
      { plain: "DENVER AIRPORT UNDERGROUND", cipher: "GHNYHU DLUSRUW XQGHUjurxqg", shift: 3, hint: "Chiffre de César (+3)" },
      { plain: "TERRY DAVIS RING ZERO", cipher: "WHUUB GDYLV ULQJ CHUR", shift: 3, hint: "Code Sacré (+3)" }
    ];
    this.currentIndex = 0;
    this.score = 0;
    this.init();
  }

  init() {
    this.currentIndex = Math.floor(Math.random() * this.secretMessages.length);
    this.render();
  }

  checkAnswer() {
    const input = document.getElementById('decrypt-input');
    const msg = document.getElementById('decrypt-status');
    if (!input || !msg) return;

    const val = input.value.trim().toUpperCase();
    const current = this.secretMessages[this.currentIndex];

    if (val === current.plain) {
      this.score += 100;
      window.soundEngine.playVictory();
      msg.textContent = `[OK] CODE CASSÉ AVEC SUCCÈS ! +100 PTS MAÇONNIQUES !`;
      msg.style.color = "var(--vga-light-green)";
      setTimeout(() => this.init(), 1500);
    } else {
      window.soundEngine.beep(200, 0.15, 'sawtooth');
      msg.textContent = `[X] CODE INCORRECT ! LA SOCIÉTÉ SECRÈTE VOUS OBSERVE !`;
      msg.style.color = "var(--vga-light-red)";
    }
  }

  render() {
    if (!this.container) return;
    const current = this.secretMessages[this.currentIndex];

    this.container.innerHTML = `
      <div style="text-align:center; padding:10px;">
        <div style="color:var(--vga-yellow); font-weight:bold; font-size:13px; margin-bottom:6px;">
          INTERCEPTION DE TÉLÉGRAMME SECRET DU BILDERBERG
        </div>
        <div style="color:#aaa; font-size:11px; margin-bottom:12px;">DÉCHIFFREZ LE MESSAGE TRANSMIS PAR SATELLITE MILITAIRE</div>

        <div style="background:#001100; border:2px dashed #00aa00; padding:12px; margin:10px auto; max-width:380px; font-family:monospace; font-size:16px; color:#55ff55; letter-spacing:2px;">
          ${current.cipher}
        </div>

        <div style="font-size:11px; color:#55ffff; margin-bottom:10px;">INDICE SÉCURISÉ : ${current.hint}</div>

        <div style="margin:12px 0;">
          <input type="text" id="decrypt-input" placeholder="TAPEZ LE TEXTE DÉCHIFFRÉ..." style="width:280px; font-size:14px; background:#000; color:#ffff55; border:1px solid #777; padding:4px 8px; text-transform:uppercase; text-align:center;">
          <button class="temple-btn primary" onclick="desktop.games.illuminatiDecrypt.checkAnswer()">DÉCRYPTER</button>
        </div>

        <div id="decrypt-status" style="font-size:12px; font-weight:bold; min-height:20px; color:#ffff55;">ENTREZ LA SOLUTION POUR PERCER LE SECRET.</div>
        <div style="color:#888; font-size:11px; margin-top:8px;">SCORE DE DÉCRYPTAGE : ${this.score} PTS</div>
      </div>
    `;

    const inp = document.getElementById('decrypt-input');
    if (inp) {
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.checkAnswer();
      });
    }
  }
}

// --------------------------------------------------------------------------
// 4. WHACK-A-REPTILIAN (LA CHÈVRE DE DENVER)
// Frappez les diplomates reptiliens et les agents fédéraux qui surgissent des trappes !
// --------------------------------------------------------------------------
class WhackReptilianGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.holes = Array(9).fill(false); // 3x3 grille
    this.score = 0;
    this.timeLeft = 30;
    this.timer = null;
    this.spawnTimer = null;
    this.isRunning = false;
    this.init();
  }

  init() {
    this.holes = Array(9).fill(false);
    this.score = 0;
    this.timeLeft = 30;
    this.render();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.score = 0;
    this.timeLeft = 30;

    window.soundEngine.playXFilesTheme();

    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.stop();
        window.soundEngine.playVictory();
        alert(`FIN DE LA CHASSE AUX REPTILIENS ! Score final : ${this.score}`);
      }
      this.render();
    }, 1000);

    this.spawnLoop();
  }

  spawnLoop() {
    if (!this.isRunning) return;
    const holeIdx = Math.floor(Math.random() * 9);
    this.holes[holeIdx] = Math.random() > 0.3 ? '[REP]' : '[FED]️';
    this.render();

    setTimeout(() => {
      this.holes[holeIdx] = false;
      this.render();
    }, 900);

    const nextDelay = Math.random() * 600 + 400;
    this.spawnTimer = setTimeout(() => this.spawnLoop(), nextDelay);
  }

  hitHole(idx) {
    if (!this.isRunning || !this.holes[idx]) return;

    if (this.holes[idx] === '[REP]') {
      this.score += 10;
      window.soundEngine.playReptilianLaser();
    } else {
      this.score += 5;
      window.soundEngine.playPaddleHit();
    }
    this.holes[idx] = false;
    this.render();
  }

  stop() {
    this.isRunning = false;
    if (this.timer) clearInterval(this.timer);
    if (this.spawnTimer) clearTimeout(this.spawnTimer);
    this.holes = Array(9).fill(false);
    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="text-align:center;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-weight:bold; font-size:12px;">
          <span style="color:var(--vga-light-green);">TEMPS RESTANT : ${this.timeLeft}s</span>
          <span style="color:var(--vga-yellow);">REPTILIENS PURIFIÉS : ${this.score}</span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(3, 85px); gap:10px; justify-content:center; margin:12px auto;">
          ${this.holes.map((h, i) => `
            <div class="clickable" style="width:85px; height:85px; background:${h ? '#003300' : '#111'}; border:3px inset ${h ? '#55ff55' : '#444'}; display:flex; align-items:center; justify-content:center; font-size:36px; cursor:pointer;" onclick="desktop.games.whackReptilian.hitHole(${i})">
              ${h || '[VOID]️'}
            </div>
          `).join('')}
        </div>

        <div style="margin-top:10px;">
          <button class="temple-btn primary" onclick="desktop.games.whackReptilian.start()" ${this.isRunning ? 'disabled' : ''}>
            LANCER LA CHASSE
          </button>
          <button class="temple-btn" onclick="desktop.games.whackReptilian.stop()">ARRÊTER</button>
        </div>
      </div>
    `;
  }
}

// --------------------------------------------------------------------------
// 5. TRI-PONG ILLUMINATI (PONG TRIANGULAIRE SACRÉ)
// Arène triangulaire sacrée à 3 côtés avec rebonds géométriques !
// --------------------------------------------------------------------------
class TriPongGame {
  constructor(canvasId, statusId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.statusEl = document.getElementById(statusId);

    this.width = this.canvas.width = 360;
    this.height = this.canvas.height = 340;

    // Sommets du triangle équilatéral
    this.p1 = { x: 180, y: 30 };
    this.p2 = { x: 30, y: 310 };
    this.p3 = { x: 330, y: 310 };

    // Balle
    this.bx = 180;
    this.by = 200;
    this.vx = 2.5;
    this.vy = -2.5;
    this.radius = 6;

    // Raquette Joueur (sur la base p2-p3)
    this.paddleBottomX = 180;
    this.paddleW = 55;

    // Raquettes IA (sur les côtés inclinés)
    this.paddleLeftT = 0.5; // Entre 0 et 1 sur segment p1-p2
    this.paddleRightT = 0.5; // Entre 0 et 1 sur segment p1-p3

    this.score = 0;
    this.lives = 3;
    this.isRunning = false;
    this.animId = null;

    this.initEvents();
    this.reset();
  }

  initEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      this.paddleBottomX = Math.max(60, Math.min(300, mx));
    });
  }

  reset() {
    this.bx = 180;
    this.by = 200;
    this.vx = (Math.random() > 0.5 ? 2.5 : -2.5);
    this.vy = -2.5;
    this.score = 0;
    this.lives = 3;
    this.updateStatus();
    this.draw();
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.loop();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  updateStatus() {
    if (this.statusEl) {
      this.statusEl.textContent = `VIES : ${this.lives} | ÉCHANGES MAÇONNIQUES : ${this.score}`;
    }
  }

  update() {
    this.bx += this.vx;
    this.by += this.vy;

    // IA Raquette Gauche (suit la balle sur le bord p1-p2)
    const targetLeftT = Math.max(0.2, Math.min(0.8, (this.by - 30) / 280));
    this.paddleLeftT += (targetLeftT - this.paddleLeftT) * 0.08;

    // IA Raquette Droite (suit la balle sur le bord p1-p3)
    const targetRightT = Math.max(0.2, Math.min(0.8, (this.by - 30) / 280));
    this.paddleRightT += (targetRightT - this.paddleRightT) * 0.08;

    // Rebond côté gauche (p1 - p2)
    // Droite reliant (180,30) et (30,310) => pente ~ -280/150 = -1.86
    if (this.bx < 180) {
      const edgeX = 180 - ((this.by - 30) / 280) * 150;
      if (this.bx - this.radius <= edgeX) {
        this.vx = Math.abs(this.vx);
        this.score++;
        window.soundEngine.playPaddleHit();
        this.updateStatus();
      }
    }

    // Rebond côté droit (p1 - p3)
    if (this.bx > 180) {
      const edgeX = 180 + ((this.by - 30) / 280) * 150;
      if (this.bx + this.radius >= edgeX) {
        this.vx = -Math.abs(this.vx);
        this.score++;
        window.soundEngine.playPaddleHit();
        this.updateStatus();
      }
    }

    // Rebond sommet
    if (this.by - this.radius <= 35) {
      this.vy = Math.abs(this.vy);
      window.soundEngine.playWallHit();
    }

    // Contact avec la base (Joueur)
    if (this.by + this.radius >= 300 && this.by - this.radius <= 312) {
      if (this.bx >= this.paddleBottomX - this.paddleW / 2 && this.bx <= this.paddleBottomX + this.paddleW / 2) {
        this.vy = -Math.abs(this.vy);
        this.score += 2;
        window.soundEngine.playPaddleHit();
        this.updateStatus();
      }
    }

    // Balle perdue en bas
    if (this.by > 320) {
      this.lives--;
      window.soundEngine.playDefeat();
      this.updateStatus();
      if (this.lives <= 0) {
        this.stop();
        alert(`Fin de partie dans le Temple ! Échanges réussis : ${this.score}`);
        this.reset();
      } else {
        this.bx = 180;
        this.by = 180;
        this.vy = -2.5;
      }
    }
  }

  draw() {
    this.ctx.fillStyle = '#000022';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Dessin du Triangle Sacré
    this.ctx.strokeStyle = '#ffff55';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(this.p1.x, this.p1.y);
    this.ctx.lineTo(this.p2.x, this.p2.y);
    this.ctx.lineTo(this.p3.x, this.p3.y);
    this.ctx.closePath();
    this.ctx.stroke();

    // Œil en filigrane au centre
    this.ctx.strokeStyle = 'rgba(85, 255, 85, 0.2)';
    this.ctx.beginPath();
    this.ctx.arc(180, 190, 30, 0, Math.PI * 2);
    this.ctx.stroke();

    // Raquette Joueur (Base)
    this.ctx.fillStyle = '#55ff55';
    this.ctx.fillRect(this.paddleBottomX - this.paddleW / 2, 306, this.paddleW, 8);

    // Balle en or avec lueur
    this.ctx.fillStyle = '#ffff55';
    this.ctx.beginPath();
    this.ctx.arc(this.bx, this.by, this.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }
}

window.PyramidRunGame = PyramidRunGame;
window.NWOClickerGame = NWOClickerGame;
window.IlluminatiDecryptGame = IlluminatiDecryptGame;
window.WhackReptilianGame = WhackReptilianGame;
window.TriPongGame = TriPongGame;
