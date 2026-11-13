// ============================================================================
// PATİ-KOD: Web Audio API Sentetik Ses Motoru (Sıfır Harici Ses Dosyası)
// Buton tıklamaları, kalp atışı/stres sesi, ses frekansı simülasyonu,
// hotspot sonar taraması, daktilo efekti ve başarı fanfarı üretir.
// ============================================================================

class PatiKodAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.rainPlaying = false;
    this.rainGain = null;
    this.rainSource = null;
    this.heartbeatTimer = null;
    this.currentBpm = 75;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stopHeartbeatLoop();
      this.stopRain();
    } else {
      this.init();
      this.playClick();
    }
    return this.enabled;
  }

  // 1. UI Tıklama Sesi
  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.065);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.075);
  }

  // 2. Hotspot Dedektif Tarama (Sonar Ping) Sesi
  playHotspotScan() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [587.33, 880, 1174.66]; // D5, A5, D6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.055);

      gain.gain.setValueAtTime(0.11, now + idx * 0.055);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.055 + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.055);
      osc.stop(now + idx * 0.055 + 0.24);
    });
  }

  // 3. Kalp Atışı / Stres Sesi (Tek vuruş lub-dub)
  playHeartbeatOnce(intensity = 1.0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const vol = Math.min(0.32, 0.16 * intensity);

    // "Lub" (birinci kalp sesi)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(85, now);
    osc1.frequency.exponentialRampToValueAtTime(42, now + 0.11);
    gain1.gain.setValueAtTime(vol, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.13);

    // "Dub" (ikinci kalp sesi)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(72, now + 0.15);
    osc2.frequency.exponentialRampToValueAtTime(38, now + 0.25);
    gain2.gain.setValueAtTime(vol * 0.78, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.27);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.28);
  }

  // Sürekli Kalp Atışı Döngüsü (Kriz / QTE sahnesi için)
  startHeartbeatLoop(bpm = 125) {
    this.stopHeartbeatLoop();
    this.currentBpm = bpm;
    if (!this.enabled) return;

    const intervalMs = Math.max(380, Math.round((60 / bpm) * 1000));
    this.playHeartbeatOnce(bpm > 100 ? 1.25 : 0.8);
    this.heartbeatTimer = setInterval(() => {
      if (this.enabled) {
        this.playHeartbeatOnce(this.currentBpm > 100 ? 1.2 : 0.75);
      }
    }, intervalMs);
  }

  stopHeartbeatLoop() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // 4. Doğru Hamle / Empati Başarı Sesi
  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chord = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    chord.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.12, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.36);
    });
  }

  // 5. Rozet Kazanma & Mezuniyet Fanfarı
  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const melody = [
      { f: 523.25, t: 0.0, d: 0.14 },
      { f: 659.25, t: 0.12, d: 0.14 },
      { f: 783.99, t: 0.24, d: 0.14 },
      { f: 1046.5, t: 0.38, d: 0.45 },
      { f: 783.99, t: 0.56, d: 0.15 },
      { f: 1046.5, t: 0.72, d: 0.65 }
    ];

    melody.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0.15, now + note.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + note.t);
      osc.stop(now + note.t + note.d + 0.02);
    });
  }

  // 6. Yanlış / Stres Artırıcı Hamle Uyarı Sesi
  playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const tones = [260, 195];
    tones.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.09, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.2);
    });
    this.playHeartbeatOnce(1.3);
  }

  // 7. Bölüm 3: Ses Frekansı Simülatörü Canlı Ton Önizlemesi
  playFrequencyPreview(freqHz) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Sakin aralıkta (170-270 Hz) yumuşak sine dalgası, yüksek/stresli aralıkta keskin triangle/sawtooth
    const isCalm = freqHz >= 170 && freqHz <= 270;
    osc.type = isCalm ? "sine" : "triangle";
    osc.frequency.setValueAtTime(freqHz, now);

    gain.gain.setValueAtTime(isCalm ? 0.09 : 0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // 8. AI Veteriner Daktilo (Typewriter) Yumuşak Ses Efekti
  playTypewriterTick() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(680 + Math.random() * 140, now);
    gain.gain.setValueAtTime(0.022, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.02);
  }

  // 9. Yağmur Sesi Ambiyans Sentezleyicisi (Hero ve Bölüm 4 için)
  toggleRain() {
    if (this.rainPlaying) {
      this.stopRain();
      return false;
    }
    this.init();
    if (!this.ctx) return false;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 0.25;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 950;
    filter.Q.value = 0.7;

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.value = 0.06;

    whiteNoise.connect(filter);
    filter.connect(this.rainGain);
    this.rainGain.connect(this.ctx.destination);

    whiteNoise.start(0);
    this.rainSource = whiteNoise;
    this.rainPlaying = true;
    return true;
  }

  stopRain() {
    if (this.rainSource) {
      try {
        this.rainSource.stop();
      } catch (e) {}
      this.rainSource = null;
    }
    this.rainPlaying = false;
  }
}

window.patiAudio = new PatiKodAudioEngine();
