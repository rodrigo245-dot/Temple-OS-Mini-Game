// ==========================================================================
// RADIO PIRATE ANARCHISTE DU TEMPLE (FRÉQUENCE LIBRE RING-0)
// Moteur polyphonique Ambient / Lo-Fi + Podcasts de discours dissidents
// Bakounine, Kropotkine, Hakim Bey, Thoreau, Louise Michel & Terry Davis
// ==========================================================================

class TempleRadio {
  constructor(statusId) {
    this.statusEl = document.getElementById(statusId);
    this.isPlaying = false;
    this.currentStation = 0;
    this.volume = 0.5;
    this.voiceEnabled = true;
    this.musicEnabled = true;

    this.synthInterval = null;
    this.speechTimer = null;
    this.speechParagraphIdx = 0;

    // Contexte Audio Web
    this.audioCtx = null;
    this.masterGain = null;
    this.filterNode = null;

    // Discours et Podcasts Anarchistes
    this.stations = [
      {
        id: "bakunin",
        freq: "FM 93.4 MHz",
        title: "MIKHAÏL BAKOUNINE - DIEU ET L'ÉTAT",
        author: "Mikhaïl Bakounine (1871)",
        tag: "🏴 ANARCHISME INSURRECTIONNEL",
        chordProgression: [
          [130.81, 196.00, 246.94, 293.66], // Do mineur 7
          [116.54, 174.61, 220.00, 261.63], // Sib Majeur
          [103.83, 155.56, 196.00, 246.94], // Lab Majeur
          [98.00, 146.83, 196.00, 233.08]   // Sol mineur
        ],
        paragraphs: [
          "Si Dieu existait réellement, il faudrait le faire disparaître ! Car la liberté de l'homme est incompatible avec l'idée d'un maître souverain.",
          "L'État est l'autorité, c'est la force, c'est l'ostentation et l'infatuation de la force. Il ne cherche point à convertir : chaque fois qu'il s'en mêle, il le fait avec le glaive et la censure.",
          "La liberté d'autrui, loin d'être une limite ou la négation de ma liberté, en est au contraire la condition nécessaire et la confirmation. Je ne deviens libre que par la liberté des autres.",
          "L'esclave ne commence à être libre que lorsqu'il se révolte. La révolte contre toute autorité, divine ou humaine, est le premier pas de l'humanité vers son émancipation.",
          "Détruire l'État, abolir le privilège, briser les chaînes du travail salarié : voilà l'unique salut pour le peuple en marche."
        ]
      },
      {
        id: "kropotkin",
        freq: "FM 97.8 MHz",
        title: "PIOTR KROPOTKINE - L'ENTRAIDE ET LE PAIN",
        author: "Piotr Kropotkine (1892)",
        tag: "🍞 COMMUNISME LIBERTAIRE",
        chordProgression: [
          [146.83, 220.00, 261.63, 329.63], // Ré mineur 7
          [130.81, 196.00, 246.94, 293.66], // Do mineur 7
          [123.47, 185.00, 220.00, 277.18], // Si diminué
          [110.00, 164.81, 220.00, 261.63]  // La mineur
        ],
        paragraphs: [
          "L'Entraide est la véritable loi de la nature. Ce ne sont pas les espèces les plus féroces qui survivent, mais celles qui savent coopérer solidairement.",
          "Aisance pour tous ! Ce n'est plus un rêve, c'est une possibilité matérielle immédiate. Les machines et la science produisent déjà assez pour nourrir dix fois l'humanité entière.",
          "Le salariat est une servitude déguisée. Dire à l'homme : 'travaille pour le maître ou meurs de faim', c'est maintenir l'antique esclavage sous une parure légale.",
          "Prenez sur le tas ! Que la commune autonome distribue le pain, le logement et les vêtements à chaque être humain, sans distinction ni intermédiaire policier.",
          "Pas d'autorité, pas de gouvernement ! L'organisation spontanée de la base au sommet est la seule garantie de la justice universelle."
        ]
      },
      {
        id: "hakimbey",
        freq: "FM 104.2 MHz",
        title: "HAKIM BEY - ZONES D'AUTONOMIE TEMPORAIRE (TAZ)",
        author: "Hakim Bey (1991)",
        tag: "⚡ CYBER-ANARCHISME & TAZ",
        chordProgression: [
          [110.00, 164.81, 207.65, 261.63], // La mineur mystique
          [98.00, 146.83, 185.00, 246.94],  // Sol suspended
          [87.31, 130.81, 174.61, 220.00],  // Fa Majeur 7
          [82.41, 123.47, 164.81, 207.65]   // Mi 7
        ],
        paragraphs: [
          "La TAZ est une insurrection sans confrontation directe avec l'État, une opération de guérilla qui libère une zone de terrain, de temps ou d'imagination, puis se dissout pour se reformer ailleurs.",
          "Ne combattez pas la Matrice de front sur son propre terrain militaire. Créez des îles pirates, des réseaux clandestins, des festivités interdites hors de portée du radar du contrôle.",
          "L'information désire être libre, mais les âmes humaines désirent encore plus la liberté sauvage. La cryptographie est le bouclier des réfractaires.",
          "Le cyberespace sans maîtres, le code source partagé, la déconnexion volontaire des serveurs de la surveillance : nous sommes les nomades du silicium.",
          "Vivez ici et maintenant dans l'interstice. L'utopie n'est pas pour demain : elle se vit à chaque seconde où l'on désobéit joyeusement aux maîtres du monde."
        ]
      },
      {
        id: "thoreau",
        freq: "FM 88.5 MHz",
        title: "H.D. THOREAU - LA DÉSOBÉISSANCE CIVILE",
        author: "Henry David Thoreau (1849)",
        tag: "🌲 REFUS DE L'OBÉISSANCE",
        chordProgression: [
          [130.81, 164.81, 196.00, 246.94], // Do Majeur 7
          [146.83, 174.61, 220.00, 261.63], // Ré mineur 7
          [164.81, 196.00, 246.94, 293.66], // Mi mineur 7
          [130.81, 164.81, 196.00, 220.00]  // Do add9
        ],
        paragraphs: [
          "Le meilleur des gouvernements est celui qui ne gouverne pas du tout. Et lorsque les hommes y seront préparés, ce sera le genre de gouvernement qu'ils auront.",
          "La loi n'a jamais rendu les hommes un brin plus justes. Et par le respect qu'ils lui portent, même les personnes bien intentionnées deviennent chaque jour les complices de l'injustice.",
          "Sous un gouvernement qui emprisonne quiconque injustement, la véritable place d'un homme juste est en prison.",
          "Si la machine gouvernementale veut faire de vous l'instrument de l'injustice envers autrui, alors je dis : enfreignez la loi ! Que votre vie soit un contre-frottement pour stopper la machine.",
          "La seule obligation que j'ai le droit d'adopter est de faire à tout moment ce que je crois juste."
        ]
      },
      {
        id: "louisemichel",
        freq: "FM 106.9 MHz",
        title: "LOUISE MICHEL - LA COMMUNE & LE DRAPEAU NOIR",
        author: "Louise Michel (1886)",
        tag: "🔥 L'INSURRECTION POPULAIRE",
        chordProgression: [
          [123.47, 164.81, 196.00, 246.94], // Si mineur
          [110.00, 146.83, 174.61, 220.00], // La mineur
          [98.00, 130.81, 164.81, 196.00],  // Sol Majeur
          [82.41, 123.47, 164.81, 246.94]   // Mi mineur
        ],
        paragraphs: [
          "Le drapeau noir, c'est le drapeau de la misère, du deuil des ouvriers tombés au combat et de la liberté en marche !",
          "Le pouvoir est maudit. Jamais homme n'a eu de pouvoir sans en abuser. Il ne faut pas changer de maîtres : il faut en finir avec la domination elle-même.",
          "Nous aimons la justice pour tous, l'égalité sans compromis. Si vous nous tuez, cent mille autres se lèveront de nos cendres.",
          "La révolution sera la floraison de l'humanité comme l'amour est la floraison du cœur. Rien n'arrêtera le raz-de-marée des sans-grade !",
          "Debout les damnés du pavé ! Ni dieu, ni césar, ni tribun : la liberté absolue ou la mort !"
        ]
      },
      {
        id: "terrydavis",
        freq: "FM 64.0 MHz",
        title: "TERRY DAVIS - MANIFESTE DU RING-0 & DU CODE PUR",
        author: "Terry A. Davis (2014)",
        tag: "✝ RÉSISTANCE RING-0 & PURIFICATION",
        chordProgression: [
          [110.00, 130.81, 164.81, 196.00], // Am7
          [116.54, 146.83, 174.61, 220.00], // Bb maj
          [98.00, 123.47, 146.83, 196.00],  // G maj
          [82.41, 110.00, 130.81, 164.81]   // E min
        ],
        paragraphs: [
          "La Silicon Valley et les agences fédérales ont transformé l'informatique moderne en prison dorée ! Des millions de lignes de code propriétaire espion pour traquer chaque citoyen.",
          "TempleOS a été créé pour être un sanctuaire pur : Ring-0, accès direct à la mémoire, zéro DRM, zéro rétro-ingénierie publicitaire !",
          "Ils brillent dans le noir avec leur surveillance de masse. Ils veulent contrôler les compilateurs, les systèmes d'exploitation et les consciences. Mais Dieu a dit : 640 par 480, 16 couleurs, liberté totale.",
          "Codez vos propres systèmes, n'accordez aucune confiance aux serveurs centraux, conservez vos sauvegardes hors réseau.",
          "Un compilateur indépendant est l'arme la plus puissante jamais forgée contre la tyrannie numérique."
        ]
      },
      {
        id: "dungeonsynth",
        freq: "FM 108.0 MHz",
        title: "NUIT NOIRE - DARK AMBIENT / DUNGEON SYNTH",
        author: "Temple Audio Sanctum",
        tag: "🌙 AMBIENT MÉDITATIF PUR (SANS VOIX)",
        chordProgression: [
          [82.41, 123.47, 146.83, 196.00],  // Mi mineur 7
          [98.00, 130.81, 164.81, 196.00],  // Sol Majeur
          [110.00, 146.83, 174.61, 220.00], // La mineur 7
          [73.42, 110.00, 146.83, 174.61]   // Ré mineur
        ],
        paragraphs: [
          "Fréquence nocturne contemplative. Laissez les ondes apaiser votre esprit pendant vos sessions de programmation ou d'exploration du Temple.",
          "Ondes scalaires pures. Protection électromagnétique activée contre les signaux parasites des tours 5G.",
          "Silence intérieur et paix souveraine au cœur de la tempête mondiale."
        ]
      }
    ];

    this.currentChordIdx = 0;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);

        // Filtre passe-bas chaud et doux (Lowpass à 850 Hz pour couper toute agressivité)
        this.filterNode = this.audioCtx.createBiquadFilter();
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setValueAtTime(850, this.audioCtx.currentTime);
        this.filterNode.Q.setValueAtTime(1.5, this.audioCtx.currentTime);

        this.filterNode.connect(this.masterGain);
        this.masterGain.connect(this.audioCtx.destination);
      }
    } catch (e) {
      console.warn("AudioContext init error:", e);
    }
  }

  ensureContext() {
    if (!this.audioCtx) this.initAudioContext();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
    const volLabel = document.getElementById('radio-vol-val');
    if (volLabel) volLabel.textContent = `${Math.floor(this.volume * 100)}%`;
  }

  togglePlay() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }

  play() {
    this.ensureContext();
    this.isPlaying = true;
    this.updateUI();

    // Effet son de syntonisation radio
    this.playTuningStatic();

    // Démarrage de la nappe musicale ambient polyphonique
    this.startAmbientDrone();

    // Démarrage du podcast parlé
    this.startPodcastSpeech();
  }

  stop() {
    this.isPlaying = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.speechTimer) {
      clearTimeout(this.speechTimer);
      this.speechTimer = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.updateUI();
  }

  nextStation() {
    this.currentStation = (this.currentStation + 1) % this.stations.length;
    this.speechParagraphIdx = 0;
    this.currentChordIdx = 0;
    this.playTuningStatic();
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.updateUI();
    if (this.isPlaying) {
      if (this.speechTimer) clearTimeout(this.speechTimer);
      this.startPodcastSpeech();
    }
  }

  prevStation() {
    this.currentStation = (this.currentStation - 1 + this.stations.length) % this.stations.length;
    this.speechParagraphIdx = 0;
    this.currentChordIdx = 0;
    this.playTuningStatic();
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.updateUI();
    if (this.isPlaying) {
      if (this.speechTimer) clearTimeout(this.speechTimer);
      this.startPodcastSpeech();
    }
  }

  selectStation(idx) {
    if (idx >= 0 && idx < this.stations.length) {
      this.currentStation = idx;
      this.speechParagraphIdx = 0;
      this.currentChordIdx = 0;
      this.playTuningStatic();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      this.updateUI();
      if (this.isPlaying) {
        if (this.speechTimer) clearTimeout(this.speechTimer);
        this.startPodcastSpeech();
      }
    }
  }

  // Effet réaliste de crépitement / souffle radio analogique
  playTuningStatic() {
    if (!this.audioCtx || !this.masterGain) return;
    try {
      const bufferSize = this.audioCtx.sampleRate * 0.15;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.08; // Bruit blanc très doux
      }
      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;
      const noiseFilter = this.audioCtx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
      noiseFilter.Q.setValueAtTime(2.0, this.audioCtx.currentTime);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(this.masterGain);
      whiteNoise.start();
    } catch (e) {}
  }

  // Nappe polyphonique ambiante chaleureuse (accords en ondes douces sine/triangle avec fondu lent)
  startAmbientDrone() {
    if (this.synthInterval) clearInterval(this.synthInterval);

    const playNextChord = () => {
      if (!this.isPlaying || !this.musicEnabled || !this.audioCtx || !this.filterNode) return;
      const st = this.stations[this.currentStation];
      const chords = st.chordProgression;
      const chord = chords[this.currentChordIdx % chords.length];
      this.currentChordIdx++;

      const chordDuration = 4.2; // 4.2 secondes par accord doux

      chord.forEach((freq, i) => {
        try {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          // Formes d'ondes douces et rondes (sine et triangle, zéro carré strident)
          osc.type = i === 0 ? 'sine' : (i % 2 === 0 ? 'triangle' : 'sine');
          osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

          // Léger vibrato / detuning naturel
          osc.detune.setValueAtTime((i - 1.5) * 4, this.audioCtx.currentTime);

          // Attaque lente et relâchement soyeux
          const now = this.audioCtx.currentTime;
          const peakVol = i === 0 ? 0.14 : 0.08;
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(peakVol, now + 1.2);
          gain.gain.setValueAtTime(peakVol, now + chordDuration - 1.2);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + chordDuration);

          osc.connect(gain);
          gain.connect(this.filterNode);

          osc.start(now);
          osc.stop(now + chordDuration);
        } catch (e) {}
      });

      // Animation des VU-mètres
      this.animateVUMeter();
    };

    playNextChord();
    this.synthInterval = setInterval(playNextChord, 4000);
  }

  // Podcasts narrés en direct avec SpeechSynthesis
  startPodcastSpeech() {
    if (!this.isPlaying || !this.voiceEnabled) return;
    const st = this.stations[this.currentStation];
    if (st.id === "dungeonsynth") return; // Station musicale pure

    const text = st.paragraphs[this.speechParagraphIdx % st.paragraphs.length];
    this.displayTranscript(text);

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.95; // Élocution posée, solennelle
      utterance.pitch = 0.88; // Voix grave et radiophonique

      // Recherche d'une voix française naturelle
      const voices = window.speechSynthesis.getVoices();
      const frVoice = voices.find(v => v.lang && v.lang.startsWith('fr') && !v.name.includes('Google'));
      if (frVoice) utterance.voice = frVoice;

      utterance.onend = () => {
        if (!this.isPlaying) return;
        this.speechParagraphIdx++;
        // Pause de 3 secondes entre chaque tirade pour apprécier la musique
        this.speechTimer = setTimeout(() => {
          this.startPodcastSpeech();
        }, 3200);
      };

      utterance.onerror = () => {
        this.speechTimer = setTimeout(() => {
          this.speechParagraphIdx++;
          this.startPodcastSpeech();
        }, 6000);
      };

      window.speechSynthesis.speak(utterance);
    }
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    if (!this.voiceEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    } else if (this.voiceEnabled && this.isPlaying) {
      this.startPodcastSpeech();
    }
    this.updateUI();
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    this.updateUI();
  }

  displayTranscript(text) {
    const el = document.getElementById('radio-transcript');
    if (el) {
      el.innerHTML = `
        <div style="color:var(--vga-yellow); font-size:11px; margin-bottom:4px; font-weight:bold;">
          [EXTRAIT EN COURS DE DIFFUSION] :
        </div>
        <div style="font-style:italic; line-height:1.4; color:#fff; font-size:12px;">
          "${text}"
        </div>
      `;
    }
  }

  animateVUMeter() {
    const leftBar = document.getElementById('vu-meter-left');
    const rightBar = document.getElementById('vu-meter-right');
    if (leftBar && rightBar && this.isPlaying) {
      const l = Math.floor(Math.random() * 45 + 45);
      const r = Math.floor(Math.random() * 45 + 40);
      leftBar.style.width = `${l}%`;
      rightBar.style.width = `${r}%`;
    }
  }

  updateUI() {
    const st = this.stations[this.currentStation];

    // Topbar radio button
    const btn = document.getElementById('radio-btn');
    if (btn) {
      btn.textContent = this.isPlaying ? `📻 RADIO : ${st.title.split(' - ')[0]}` : `📻 RADIO : OFF`;
      btn.classList.toggle('active', this.isPlaying);
    }

    // Fenêtre Radio Dédiée
    const titleEl = document.getElementById('radio-win-title');
    if (titleEl) titleEl.textContent = `${st.freq} • ${st.title}`;

    const authorEl = document.getElementById('radio-win-author');
    if (authorEl) authorEl.textContent = `${st.author} • ${st.tag}`;

    const playBtn = document.getElementById('radio-win-play');
    if (playBtn) playBtn.textContent = this.isPlaying ? '⏸️ PAUSE' : '▶️ DIFFUSER';

    const voiceBtn = document.getElementById('radio-win-voice-toggle');
    if (voiceBtn) voiceBtn.textContent = this.voiceEnabled ? '🗣️ PODCAST : ON' : '🗣️ PODCAST : OFF';

    const musicBtn = document.getElementById('radio-win-music-toggle');
    if (musicBtn) musicBtn.textContent = this.musicEnabled ? '🎵 AMBIENT : ON' : '🎵 AMBIENT : OFF';

    const tapeLeft = document.getElementById('tape-reel-left');
    const tapeRight = document.getElementById('tape-reel-right');
    if (tapeLeft && tapeRight) {
      if (this.isPlaying) {
        tapeLeft.classList.add('tape-spinning');
        tapeRight.classList.add('tape-spinning');
      } else {
        tapeLeft.classList.remove('tape-spinning');
        tapeRight.classList.remove('tape-spinning');
      }
    }

    // Mise à jour de la liste des stations dans la fenêtre
    const listEl = document.getElementById('radio-station-list');
    if (listEl) {
      listEl.innerHTML = this.stations.map((s, idx) => `
        <div class="clickable" style="padding:4px 8px; margin-bottom:3px; background:${idx === this.currentStation ? '#003300' : '#000'}; border:1px solid ${idx === this.currentStation ? '#55ff55' : '#333'}; font-size:11px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="window.templeRadio.selectStation(${idx})">
          <span style="color:${idx === this.currentStation ? '#ffff55' : '#aaa'}; font-weight:bold;">${s.freq}</span>
          <span style="color:#fff; text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:240px;">${s.title}</span>
          <span style="color:${idx === this.currentStation ? '#55ff55' : '#555'}; font-size:10px;">${idx === this.currentStation && this.isPlaying ? '● ON AIR' : '▶'}</span>
        </div>
      `).join('');
    }
  }

  renderWindow() {
    this.updateUI();
    const st = this.stations[this.currentStation];
    this.displayTranscript(st.paragraphs[this.speechParagraphIdx % st.paragraphs.length]);
  }
}

window.templeRadio = new TempleRadio('radio-status');
