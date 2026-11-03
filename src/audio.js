// Web Audio API procedural sound engine - Zero external audio files required!

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.engineOsc1 = null;
    this.engineOsc2 = null;
    this.engineGain = null;
    this.noiseNode = null;
    this.noiseGain = null;
    this.isEngineRunning = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.engineGain) {
      this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  startEngine(vehicleType = 'car') {
    this.init();
    if (this.isEngineRunning || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.setValueAtTime(0.04, now);
      this.engineGain.connect(this.ctx.destination);

      if (vehicleType === 'car') {
        // Dual saw engine drone with lowpass
        this.engineOsc1 = this.ctx.createOscillator();
        this.engineOsc1.type = 'sawtooth';
        this.engineOsc1.frequency.setValueAtTime(65, now);

        this.engineOsc2 = this.ctx.createOscillator();
        this.engineOsc2.type = 'triangle';
        this.engineOsc2.frequency.setValueAtTime(130, now);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);

        this.engineOsc1.connect(filter);
        this.engineOsc2.connect(filter);
        filter.connect(this.engineGain);

        this.engineOsc1.start();
        this.engineOsc2.start();
      } else if (vehicleType === 'motorcycle') {
        // High rev pulse wave with slight flutter
        this.engineOsc1 = this.ctx.createOscillator();
        this.engineOsc1.type = 'sawtooth';
        this.engineOsc1.frequency.setValueAtTime(95, now);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, now);
        filter.Q.setValueAtTime(2.0, now);

        this.engineOsc1.connect(filter);
        filter.connect(this.engineGain);
        this.engineOsc1.start();
      } else if (vehicleType === 'bicycle') {
        // Subtle chain tick/hum
        this.engineOsc1 = this.ctx.createOscillator();
        this.engineOsc1.type = 'triangle';
        this.engineOsc1.frequency.setValueAtTime(40, now);
        this.engineGain.gain.setValueAtTime(0.015, now);
        this.engineOsc1.connect(this.engineGain);
        this.engineOsc1.start();
      }

      this.isEngineRunning = true;
    } catch (e) {
      console.warn("Audio initialization postponed until user gesture", e);
    }
  }

  updateEngine(speed, maxSpeed, vehicleType = 'car') {
    if (!this.isEngineRunning || !this.ctx || this.isMuted) return;
    const ratio = Math.min(1, Math.max(0, Math.abs(speed) / maxSpeed));
    const now = this.ctx.currentTime;

    if (vehicleType === 'car') {
      const baseFreq = 65 + ratio * 160;
      if (this.engineOsc1) this.engineOsc1.frequency.setTargetAtTime(baseFreq, now, 0.08);
      if (this.engineOsc2) this.engineOsc2.frequency.setTargetAtTime(baseFreq * 2, now, 0.08);
      if (this.engineGain) this.engineGain.gain.setTargetAtTime(0.03 + ratio * 0.07, now, 0.08);
    } else if (vehicleType === 'motorcycle') {
      const baseFreq = 95 + ratio * 240;
      if (this.engineOsc1) this.engineOsc1.frequency.setTargetAtTime(baseFreq, now, 0.05);
      if (this.engineGain) this.engineGain.gain.setTargetAtTime(0.02 + ratio * 0.06, now, 0.05);
    } else if (vehicleType === 'bicycle') {
      const baseFreq = 40 + ratio * 90;
      if (this.engineOsc1) this.engineOsc1.frequency.setTargetAtTime(baseFreq, now, 0.1);
      if (this.engineGain) this.engineGain.gain.setTargetAtTime(0.008 + ratio * 0.02, now, 0.1);
    }
  }

  stopEngine() {
    if (!this.isEngineRunning) return;
    try {
      if (this.engineOsc1) { this.engineOsc1.stop(); this.engineOsc1.disconnect(); }
      if (this.engineOsc2) { this.engineOsc2.stop(); this.engineOsc2.disconnect(); }
      if (this.engineGain) { this.engineGain.disconnect(); }
    } catch (e) {
      // Ignored
    }
    this.isEngineRunning = false;
  }

  playHorn(hornType = 'car') {
    this.init();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;

    if (hornType === 'bell') {
      // Bicycle "Ting-Ting" double chime
      [0, 0.12].forEach(offset => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2050, now + offset);
        gain.gain.setValueAtTime(0.18, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.3);
      });
    } else if (hornType === 'motorcycle') {
      // High pitch buzz horn
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(420, now);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    } else {
      // Car dual-tone horn (F & A chord: 440Hz & 554Hz)
      const freqs = [440, 554];
      freqs.forEach(f => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.25);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
      });
    }
  }

  playCatch() {
    this.init();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.18, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.28);
    });
  }

  playPanicAlert() {
    this.init();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.15);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  playCountdownTick(count) {
    this.init();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const freq = 380 + (10 - count) * 45; // pitch climbs as countdown approaches 1
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playCountdownGo() {
    this.init();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    // Long high-energy double whistle
    [0, 0.15].forEach(offset => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(987.77, now + offset); // B5
      gain.gain.setValueAtTime(0.2, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.4);
    });
  }

  playVictory() {
    this.init();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    // Fanfare chord progression
    const chords = [
      { notes: [523, 659, 784], time: 0.0, dur: 0.2 },
      { notes: [587, 740, 880], time: 0.25, dur: 0.2 },
      { notes: [659, 830, 987], time: 0.5, dur: 0.3 },
      { notes: [784, 987, 1174, 1568], time: 0.85, dur: 0.8 }
    ];

    chords.forEach(ch => {
      ch.notes.forEach(f => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + ch.time);
        gain.gain.setValueAtTime(0.12, now + ch.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + ch.time + ch.dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + ch.time);
        osc.stop(now + ch.time + ch.dur + 0.05);
      });
    });
  }
}

export const sound = new SoundEngine();
