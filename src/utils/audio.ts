/**
 * Web Audio API Sentetik Ses Üretici
 * Hiçbir harici mp3/wav dosyasına ihtiyaç duymadan tamamen tarayıcı içinde
 * matematiksel osilatörler ve filtreler ile ses efektleri üretir.
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Hafif buton tıklama sesi
  public playClick(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Doğru cevap / Başarı sesi (Harmonik 3 nota: Do - Mi - Sol)
  public playSuccess(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.09);

        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.09);
        osc.stop(ctx.currentTime + i * 0.09 + 0.35);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Hata / Uyarı sesi (İki düşük tonlu testere dalgası)
  public playWarning(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.28);

      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Sentetik Köpek Havlama Sesi (Noise band-pass + Pitch glide)
  public playDogBark(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      // Osilatör kısmı: derin tonda düşüş
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);

      oscGain.gain.setValueAtTime(0.3, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);

      // Beyaz gürültü patlaması (hırlama/havlama gırtlak rezonansı)
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(650, now);
      filter.Q.setValueAtTime(3, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.16);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Sakin, Düşük Frekanslı İnsan Sesi & Kavis Tonu (Monoton, güven verici)
  public playCalmTone(onVisualNode?: (analyser: AnalyserNode) => void): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const analyser = ctx.createAnalyser();

      analyser.fftSize = 64;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(174, now); // 174 Hz rahatlatıcı derin ton
      osc.frequency.linearRampToValueAtTime(180, now + 1.2);
      osc.frequency.linearRampToValueAtTime(170, now + 2.0);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(261.63, now); // C4 hafif armoni

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.4);
      gain.gain.linearRampToValueAtTime(0.18, now + 1.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(analyser);
      analyser.connect(ctx.destination);

      if (onVisualNode) {
        onVisualNode(analyser);
      }

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 2.2);
      osc2.stop(now + 2.2);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Yüksek, Panik & Tiz Çığlık Sesi (Alarmlı, yüksek frekanslı)
  public playPanicTone(onVisualNode?: (analyser: AnalyserNode) => void): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const analyser = ctx.createAnalyser();

      analyser.fftSize = 64;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.linearRampToValueAtTime(2200, now + 0.4);
      osc.frequency.linearRampToValueAtTime(1600, now + 0.8);
      osc.frequency.linearRampToValueAtTime(2100, now + 1.3);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      osc.connect(gain);
      gain.connect(analyser);
      analyser.connect(ctx.destination);

      if (onVisualNode) {
        onVisualNode(analyser);
      }

      osc.start(now);
      osc.stop(now + 1.4);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Sertifika ve Zafer Melodisi
  public playVictory(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const notes = [
        { f: 523.25, d: 0.15 },
        { f: 659.25, d: 0.15 },
        { f: 783.99, d: 0.18 },
        { f: 1046.5, d: 0.35 },
      ];
      let t = ctx.currentTime;
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + n.d);
        t += n.d * 0.9;
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  public getAudioContext(): AudioContext {
    return this.initContext();
  }
}

export const soundSys = new SoundSynthesizer();
