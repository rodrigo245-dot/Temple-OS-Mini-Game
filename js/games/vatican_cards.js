// ==========================================================================
// BLACK JACK DU VATICAN & TAROT MAÇONNIQUE
// Jeu de cartes ésotérique contre le Diable avec pouvoirs sacrés
// ==========================================================================

class VaticanCardsGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.deck = [];
    this.playerHand = [];
    this.dealerHand = [];
    this.playerMoney = 666;
    this.currentBet = 50;
    this.isGameOver = false;
    this.init();
  }

  init() {
    this.buildDeck();
    this.render();
  }

  buildDeck() {
    const suits = ['✝', '👁️', '🔺', '👑'];
    const values = [
      { name: '2', val: 2 }, { name: '3', val: 3 }, { name: '4', val: 4 },
      { name: '5', val: 5 }, { name: '6', val: 6 }, { name: '7', val: 7 },
      { name: '8', val: 8 }, { name: '9', val: 9 }, { name: '10', val: 10 },
      { name: 'Vatican Valet', val: 10 }, { name: 'Reine de Saba', val: 10 },
      { name: 'Roi Salomon', val: 10 }, { name: 'As Sacré', val: 11 }
    ];

    this.deck = [];
    for (const s of suits) {
      for (const v of values) {
        this.deck.push({ suit: s, name: v.name, val: v.val });
      }
    }
    // Mélange divin
    this.deck.sort(() => Math.random() - 0.5);
  }

  deal() {
    if (this.playerMoney < this.currentBet) {
      alert("Fonds insuffisants ! Priez pour de la manne !");
      return;
    }
    this.buildDeck();
    this.playerHand = [this.deck.pop(), this.deck.pop()];
    this.dealerHand = [this.deck.pop(), this.deck.pop()];
    this.isGameOver = false;
    window.soundEngine.playTokenDrop();
    this.render();
  }

  hit() {
    if (this.isGameOver) return;
    this.playerHand.push(this.deck.pop());
    window.soundEngine.playClick();
    if (this.calcScore(this.playerHand) > 21) {
      this.stand(); // Bust
    } else {
      this.render();
    }
  }

  stand() {
    if (this.isGameOver) return;
    this.isGameOver = true;

    // Tour du croupier (Le Diable)
    while (this.calcScore(this.dealerHand) < 17) {
      this.dealerHand.push(this.deck.pop());
    }

    const pScore = this.calcScore(this.playerHand);
    const dScore = this.calcScore(this.dealerHand);

    let resultMsg = "";
    if (pScore > 21) {
      this.playerMoney -= this.currentBet;
      resultMsg = "❌ BUST ! VOUS AVEZ DÉPASSÉ 21 ! LE DIABLE EMPORTE LA MISE.";
      window.soundEngine.playDefeat();
    } else if (dScore > 21 || pScore > dScore) {
      this.playerMoney += this.currentBet;
      resultMsg = "🏆 VICTOIRE DIVINE ! LE DIABLE EST EXORCISÉ DE LA TABLE !";
      window.soundEngine.playVictory();
    } else if (pScore === dScore) {
      resultMsg = "⚖️ ÉGALITÉ ! PAIX PROVISOIRE AVEC LES ENFERS.";
      window.soundEngine.playPaddleHit();
    } else {
      this.playerMoney -= this.currentBet;
      resultMsg = "❌ DÉFAITE ! LE CROUPIER A UNE MEILLEURE MAIN.";
      window.soundEngine.playDefeat();
    }

    this.render(resultMsg);
  }

  calcScore(hand) {
    let sum = hand.reduce((acc, c) => acc + c.val, 0);
    let aces = hand.filter(c => c.name === 'As Sacré').length;
    while (sum > 21 && aces > 0) {
      sum -= 10;
      aces--;
    }
    return sum;
  }

  render(msg = "") {
    if (!this.container) return;

    const pScore = this.calcScore(this.playerHand);
    const dScore = this.isGameOver ? this.calcScore(this.dealerHand) : '?';

    this.container.innerHTML = `
      <div style="text-align:center; padding:10px; background:#002200; border:2px solid #55ff55;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-weight:bold; font-size:12px;">
          <span style="color:var(--vga-yellow);">OR MAÇONNIQUE : ${this.playerMoney} 🪙</span>
          <span style="color:var(--vga-light-cyan);">MISE : ${this.currentBet} 🪙</span>
        </div>

        <!-- Main du Diable -->
        <div style="margin:10px 0;">
          <div style="color:var(--vga-light-red); font-size:11px; font-weight:bold;">MAIN DU DIABLE (SCORE: ${dScore})</div>
          <div style="display:flex; gap:8px; justify-content:center; margin-top:4px;">
            ${this.dealerHand.map((c, i) => `
              <div style="width:55px; height:75px; background:#fff; color:#000; border:2px solid #333; border-radius:4px; display:flex; flex-direction:column; justify-content:space-between; padding:3px; font-weight:bold; font-size:11px;">
                ${(!this.isGameOver && i === 1) ? '<div style="margin:auto; font-size:24px; color:#aa0000;">😈</div>' : `
                  <div>${c.name[0]}</div>
                  <div style="font-size:18px;">${c.suit}</div>
                  <div style="text-align:right;">${c.name[0]}</div>
                `}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Main du Joueur -->
        <div style="margin:12px 0;">
          <div style="color:var(--vga-light-green); font-size:11px; font-weight:bold;">VOTRE MAIN SACRÉE (SCORE: ${pScore})</div>
          <div style="display:flex; gap:8px; justify-content:center; margin-top:4px;">
            ${this.playerHand.map(c => `
              <div style="width:55px; height:75px; background:#fff; color:#000; border:2px solid #ffd700; border-radius:4px; display:flex; flex-direction:column; justify-content:space-between; padding:3px; font-weight:bold; font-size:11px;">
                <div>${c.name[0]}</div>
                <div style="font-size:18px;">${c.suit}</div>
                <div style="text-align:right;">${c.name[0]}</div>
              </div>
            `).join('')}
          </div>
        </div>

        ${msg ? `<div style="font-weight:bold; font-size:12px; margin:8px 0; color:#ffff55;">${msg}</div>` : ''}

        <div style="margin-top:10px;">
          ${this.playerHand.length === 0 || this.isGameOver ? `
            <button class="temple-btn primary" onclick="desktop.games.vaticanCards.deal()">DISTRIBUER LES CARTES</button>
          ` : `
            <button class="temple-btn primary" onclick="desktop.games.vaticanCards.hit()">TIRER (+1)</button>
            <button class="temple-btn" onclick="desktop.games.vaticanCards.stand()">RESTER</button>
          `}
        </div>
      </div>
    `;
  }
}

window.VaticanCardsGame = VaticanCardsGame;
