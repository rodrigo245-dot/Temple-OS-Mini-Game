// ==========================================================================
// RADIO FM CONSPIRATIONNISTE (LECTEUR CASSETTE CHIPTUNE 8-BIT)
// Lecteur audio rétro en continu avec 4 stations de musique 8-bit
// ==========================================================================

class TempleRadio {
  constructor(statusId) {
    this.statusEl = document.getElementById(statusId);
    this.isPlaying = false;
    this.currentStation = 0;
    this.timer = null;

    this.stations = [
      { name: "VATICAN SYNTHWAVE", bpm: 120, notes: [440, 554, 659, 880, 784, 659, 554, 440] },
      { name: "AREA 51 AMBIENT", bpm: 80, notes: [220, 246, 277, 329, 369, 440, 329, 246] },
      { name: "CYBER-MOÏSE TECHNO", bpm: 140, notes: [523, 587, 659, 698, 784, 880, 987, 1046] },
      { name: "TERRY'S SACRED ORGAN", bpm: 95, notes: [330, 392, 493, 587, 659, 587, 493, 392] }
    ];

    this.noteIdx = 0;
  }

  togglePlay() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }

  play() {
    this.isPlaying = true;
    window.soundEngine.ensureContext();
    this.updateStatus();
    this.loop();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) clearTimeout(this.timer);
    this.updateStatus();
  }

  nextStation() {
    this.currentStation = (this.currentStation + 1) % this.stations.length;
    this.noteIdx = 0;
    window.soundEngine.beep(880, 0.05);
    this.updateStatus();
  }

  loop() {
    if (!this.isPlaying) return;
    const st = this.stations[this.currentStation];
    const freq = st.notes[this.noteIdx];
    this.noteIdx = (this.noteIdx + 1) % st.notes.length;

    window.soundEngine.beep(freq, (60 / st.bpm) * 0.7, 'square');

    this.timer = setTimeout(() => {
      this.loop();
    }, (60 / st.bpm) * 1000);
  }

  updateStatus() {
    if (!this.statusEl) this.statusEl = document.getElementById('radio-status');
    if (!this.statusEl) return;
    const st = this.stations[this.currentStation];
    this.statusEl.textContent = this.isPlaying ? `📻 [PLAYING: ${st.name}]` : `📻 [RADIO: EN PAUSE]`;
  }
}

window.templeRadio = new TempleRadio('radio-status');
