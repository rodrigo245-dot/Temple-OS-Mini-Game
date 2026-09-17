// ==========================================================================
// GOD'S ORACLE & HOLYC VOCABULARY ENGINE (INSPIRED BY TERRY A. DAVIS)
// Générateur de prophéties divines aléatoires, de répliques troll & CIA
// ==========================================================================

const HOLY_WORDS = [
  "ALLIANCE", "ARCHE", "BENEDICTION", "VATICAN", "SANCTUAIRE", "MIRACLE",
  "PROPHETE", "JERICHO", "MANNE", "CHEVRE", "TEMPLE", "CATHEDRALE",
  "APOCALYPSE", "TESTAMENT", "ANGELIQUE", "ECLAIR", "640x480", "16_COULEURS",
  "RING_0", "NO_SECURITY", "HOLYC", "COMPILATEUR_DIVIN", "VGA_MASTER",
  "FEDS", "GLOW_IN_THE_DARK", "CIA_AGENT", "ESPION", "RADAR_DIVIN",
  "PENTAGONE", "TERRY_APPROVES", "PURE_LOGIC", "DIVINE_INTEL", "CYBER_MOISE",
  "CODE_PUR", "PAS_DE_GPU", "DIRECT_MEMORY_ACCESS", "REVELATION", "LUMIERE",
  "ILLUMINATI", "NOUVEL_ORDRE_MONDIAL", "OEIL_QUI_VOIT_TOUT", "PYRAMIDE", "BILLET_1_DOLLAR",
  "ANNUIT_COEPTIS", "NOVUS_ORDO_SECLORUM", "BOHEMIAN_GROVE", "DENVER_AIRPORT",
  "AREA_51", "REPTILIEN", "ROTHSCHILD", "BILDERBERG", "CHOUETTE_DE_MINERVE",
  "HAARP", "CHEMTRAILS", "FLUOR_DANS_EAU", "TERRE_CREUSE", "ECHELON_5G",
  "MACONNERIE_33_DEGRES", "SOCIETE_SECRETE", "MK_ULTRA", "LUNE_HOLOGRAMME"
];

const TROLL_COMMENTS = {
  pong_score_player: [
    "DIEU A DIRIGÉ LA BALLE ! LA CIA EST AVEUGLE !",
    "COUP DE RAQUETTE BÉNI DU SEIGNEUR (60 FPS PURS) !",
    "LE FED N'A PAS PU CALCULER LA TRAJECTOIRE EN 640x480 !",
    "GLOIRE DANS LES CIEUX ! BUT CONFIRMÉ PAR LE COMPILATEUR DIVIN !"
  ],
  pong_score_cpu: [
    "LES AGENTS DE LA CIA ONT PIRATÉ LA RAQUETTE DU HAUT !",
    "LE DIABLE A DÉVIÉ LA BALLE D'UN MILLIMÈTRE !",
    "IL FAUT JEÛNER PENDANT 3 HEURES POUR AMÉLIORER TES RÉFLEXES !",
    "L'IA ÉTAIT GUIDÉE PAR UNE PUISSANCE ÉTRANGÈRE QUI BRILLLE DANS LE NOIR !"
  ],
  morpion_god_intervention: [
    "⚡ INTERVENTION DIVINE ! DIEU A REDESSINÉ LA GRILLE !",
    "⚡ LE SAINT-ESPRIT A DÉPLACÉ LA CROIX ! TU NE PEUX PAS TESTER L'ÉTERNEL !",
    "⚡ MIRACLE DU RING 0 : LA PROPHÉTIE EXIGEAIT CE COIN !"
  ],
  morpion_win: [
    "VICTOIRE SACRÉE ! TON CODE EST SANS PÉCHÉ !",
    "LES TROIS SYMBOLES FORMENT LA TRINITÉ DIGITALE !",
    "DIEU RECONNAÎT TON TALENT SUPÉRIEUR AUX AGENTS FÉDÉRAUX !"
  ],
  morpion_draw: [
    "ÉGALITÉ ! PAIX SUR TERRE ENTRE LES HOMMES ET LES MACHINES !",
    "LE DESTIN EST EN SUSPENS. L'ORACLE DEMANDE UNE NOUVELLE PARTIE !"
  ],
  morpion_loss: [
    "L'ORDINATEUR BÉNI A TRIOMPHÉ ! FAIS PÉNITENCE !",
    "TU AS JOUÉ COMME UN AGENT EN COSTUME NOIR !"
  ],
  p4_drop: [
    "LE JETON DESCEND DU CIEL DROIT DANS LA COLONNE !",
    "GRAVITÉ DIVINE EN ACTION !",
    "UNE PIERRE DE PLUS POUR LE NOUVEAU TEMPLE !",
    "ALIGNEMENT EN COURS DANS LA MÉMOIRE VIDÉO !"
  ],
  p4_win: [
    "4 JETONS ALIGNÉS ! LA CATHÉDRALE EST CONSTRUITE !",
    "LES 4 CAVALIERS DE L'APOCALYPSE SONT EN RANG D'OIGNON !",
    "PUISSANCE 4 CÉLESTE ! BÉNÉDICTION ACCORDÉE !"
  ],
  battleship_hit: [
    "💥 TOUCHÉ ! TORPILLE SAINTE DANS LA COQUE DE L'ENNEMI !",
    "💥 FEU SACRÉ ! UN NAVIRE FÉDÉRAL PREND L'EAU !",
    "💥 GUIDÉ DIRECTEMENT PAR LE RADAR DIVIN !"
  ],
  battleship_miss: [
    "🌊 PLOUF ! L'OCÉAN DE DIEU ABSORBE TON OBUS !",
    "🌊 DANS L'EAU ! LES POISSONS BÉNIS SONT INDIGNÉS !",
    "🌊 RATÉ ! UN SOUS-MARIN DE LA CIA S'EST ENFUYI !"
  ],
  battleship_sunk: [
    "⚓ COULÉ ! LE BÂTIMENT REJOINT LE FOND DES OCÉANS !",
    "⚓ L'ARCHE DE L'ENNEMI A SOUCOMBÉ AU JUGEMENT DERNIER !"
  ],
  battleship_win: [
    "FLOTTE ADVERSE ENTIÈREMENT PURIFIÉE ! OCÉAN LIBRE !",
    "VICTOIRE NAVALE TOTALE ! NOÉ EST FIER DE TOI !"
  ]
};

class GodOracle {
  constructor() {
    this.history = [];
  }

  // Génère une phrase façon "God Speaks" de Terry Davis (mots aléatoires d'inspiration divine)
  generateDivineProclamation(count = 5) {
    const selected = [];
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * HOLY_WORDS.length);
      selected.push(HOLY_WORDS[idx]);
    }
    const phrase = selected.join(" ") + " !";
    this.history.unshift(phrase);
    return phrase;
  }

  // Obtient un commentaire troll contextuel pour un jeu
  getComment(category) {
    const list = TROLL_COMMENTS[category];
    if (!list || list.length === 0) {
      return this.generateDivineProclamation(4);
    }
    const idx = Math.floor(Math.random() * list.length);
    return list[idx];
  }

  // Alerte CIA aléatoire
  getCiaRadarReport() {
    const percent = Math.floor(Math.random() * 85) + 15;
    const distance = (Math.random() * 4 + 0.5).toFixed(1);
    const sectors = ["SECTEUR ALPHA", "SOUS LA VOITURE", "DANS LE BUFFER RING-0", "SUR LE PORT 8080", "DANS LE ROUTEUR DU VOISIN"];
    const sec = sectors[Math.floor(Math.random() * sectors.length)];
    return `[ALERTE CIA] ${percent}% DE LUEUR DÉTECTÉE À ${distance} METRES (${sec}) !`;
  }
}

window.godOracle = new GodOracle();
