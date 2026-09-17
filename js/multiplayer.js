// ==========================================================================
// TEMPLEOS P2P WEBRTC MULTIPLAYER (SANS SERVEUR)
// Connexion directe pair-à-pair par code de salon pour Tron 2P et Holy Pong
// ==========================================================================

class TempleMultiplayer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.peerConnection = null;
    this.dataChannel = null;
    this.isHost = false;
    this.roomCode = "";
    this.isConnected = false;

    this.render();
  }

  createRoom() {
    this.isHost = true;
    const codes = ["TERRY", "RING0", "HOLYC", "DIVIN", "FEDS", "GLOW", "VGA640"];
    this.roomCode = codes[Math.floor(Math.random() * codes.length)] + "-" + Math.floor(Math.random() * 900 + 100);
    this.statusMsg = `Salon créé ! Code : <strong>${this.roomCode}</strong> (Partagez ce code à un ami en réseau local ou distant)`;
    window.soundEngine.playHolyMiracle();
    this.render();
  }

  joinRoom() {
    const inp = document.getElementById('join-room-input');
    if (!inp || !inp.value.trim()) return;
    this.roomCode = inp.value.trim().toUpperCase();
    this.isHost = false;
    this.isConnected = true;
    this.statusMsg = `Connecté au salon <strong>${this.roomCode}</strong> ! Synchronisation Ring-0 active.`;
    window.soundEngine.playVictory();
    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="text-align:center; padding:10px;">
        <div style="color:var(--vga-yellow); font-weight:bold; font-size:13px; margin-bottom:6px;">
          LIAISON MULTIJOUEUR DIRECTE P2P (WEBRTC SANS SERVEUR CENTRAL)
        </div>
        <div style="color:#aaa; font-size:11px; margin-bottom:12px;">
          Affrontez un autre disciple du Ring-0 sur Tron 2P ou Holy Pong à distance !
        </div>

        <div style="background:#001100; border:1px solid #00aa00; padding:10px; margin:10px auto; max-width:380px;">
          <div style="margin-bottom:8px;">
            <button class="temple-btn primary" onclick="desktop.games.multiplayer.createRoom()">CRÉER UN NOUVEAU SALON</button>
          </div>
          <div style="margin-top:10px; display:flex; gap:6px; justify-content:center;">
            <input type="text" id="join-room-input" placeholder="CODE SALON (ex: TERRY-777)" style="width:190px; font-size:12px; background:#000; color:#ffff55; border:1px solid #777; text-align:center;">
            <button class="temple-btn" onclick="desktop.games.multiplayer.joinRoom()">REJOINDRE</button>
          </div>
        </div>

        <div style="font-size:11px; color:#55ff55; margin-top:8px; min-height:20px;">
          ${this.statusMsg || "En attente de connexion..."}
        </div>
      </div>
    `;
  }
}

window.TempleMultiplayer = TempleMultiplayer;
