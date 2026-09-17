// ==========================================================================
// TEMPLE OS PC SPEAKER SYNTHESIZER (8-BIT WEB AUDIO)
// Reproduit fidèlement le son monophonique carré du PC Speaker de Terry Davis
// ==========================================================================

class TempleAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.initAudioContext();
  }

  initAudioContext() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  ensureContext() {
    this.initAudioContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Joue une tonalité carrée brute classique (PC Speaker Beep)
  beep(freq, duration = 0.1, type = 'square') {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // Son de clic rétro
  playClick() {
    this.beep(880, 0.03);
  }

  // Rebond de Pong
  playPaddleHit() {
    this.beep(440, 0.05);
  }

  playWallHit() {
    this.beep(330, 0.04);
  }

  // Score Pong
  playScore() {
    this.beep(659, 0.08);
    setTimeout(() => this.beep(880, 0.15), 80);
  }

  // Morpion coup joué
  playMorpionMove(isPlayer1) {
    if (isPlayer1) {
      this.beep(587, 0.06);
    } else {
      this.beep(392, 0.06);
    }
  }

  // Puissance 4 jeton qui tombe
  playTokenDrop() {
    this.beep(300, 0.03);
    setTimeout(() => this.beep(240, 0.05), 35);
  }

  // Bataille Navale : Tir raté (Plouf)
  playSplash() {
    if (this.isMuted) return;
    this.beep(180, 0.08, 'sine');
    setTimeout(() => this.beep(120, 0.12, 'triangle'), 60);
  }

  // Bataille Navale : Explosion (Bruit blanc 8-bit)
  playExplosion() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 0.3; // 300ms
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1; // Bruit blanc
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.3);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {
      this.beep(110, 0.25, 'sawtooth');
    }
  }

  // Victoire divine (Hymne VGA 8-bit de Terry)
  playVictory() {
    const notes = [440, 554, 659, 880, 1108];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.beep(freq, 0.12, 'square'), idx * 90);
    });
  }

  // Défaite / Alerte CIA
  playDefeat() {
    const notes = [440, 415, 392, 349];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.beep(freq, 0.18, 'sawtooth'), idx * 130);
    });
  }

  // Bip d'intervention divine / miracle
  playHolyMiracle() {
    const freqs = [523, 659, 783, 1046, 1318];
    freqs.forEach((f, i) => {
      setTimeout(() => this.beep(f, 0.08, 'square'), i * 50);
    });
  }

  // Jingle Culte X-Files / Complot Illuminati (La - Mi - Ré - Mi - Sol - Mi)
  playXFilesTheme() {
    const notes = [
      { f: 440, d: 0.28 }, // A4
      { f: 659, d: 0.28 }, // E5
      { f: 587, d: 0.28 }, // D5
      { f: 659, d: 0.28 }, // E5
      { f: 784, d: 0.40 }, // G5
      { f: 659, d: 0.50 }  // E5
    ];
    let time = 0;
    notes.forEach(n => {
      setTimeout(() => this.beep(n.f, n.d, 'sine'), time);
      time += n.d * 1000 + 30;
    });
  }

  // Son laser ovni / téléportation reptilienne
  playReptilianLaser() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {
      this.beep(800, 0.1, 'sawtooth');
    }
  }
}

window.soundEngine = new TempleAudio();
