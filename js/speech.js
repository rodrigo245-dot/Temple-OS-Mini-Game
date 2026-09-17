// ==========================================================================
// TEMPLEOS RETRO SPEECH SYNTHESIS ENGINE (TERRY DAVIS DIGITAL VOICE)
// Utilise l'API Web Speech de macOS avec pitch robotique vintage
// ==========================================================================

class TempleSpeech {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.isEnabled = true;
    this.voice = null;
    this.initVoice();
  }

  initVoice() {
    if (!this.synth) return;
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      // Chercher une voix française ou anglaise rétro
      this.voice = voices.find(v => v.lang.includes('fr')) || voices.find(v => v.lang.includes('en')) || voices[0];
    };
    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  toggleVoice() {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled && this.synth) {
      this.synth.cancel();
    }
    return this.isEnabled;
  }

  speak(text) {
    if (!this.isEnabled || !this.synth) return;

    try {
      this.synth.cancel(); // Stoppe la phrase précédente
      const utter = new SpeechSynthesisUtterance(text);
      if (this.voice) utter.voice = this.voice;

      // Pitch et vitesse robotique façon Terry Davis / Amiga 1990
      utter.pitch = 1.25;
      utter.rate = 1.05;
      utter.volume = 0.9;

      this.synth.speak(utter);
    } catch (e) {
      console.warn("Speech error:", e);
    }
  }
}

window.speechEngine = new TempleSpeech();
