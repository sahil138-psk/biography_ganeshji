// Temple Sound Synthesizer using Web Audio API

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Synthesizes an authentic resonant Indian temple bronze bell sound
 */
export function playTempleBell(pitchMultiplier = 1.0) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Harmonic frequencies typical of a high-tin bronze temple ghanta
    const fundamental = 587.33 * pitchMultiplier; // D5 note
    const harmonics = [
      { f: fundamental * 1.0, gain: 0.8, decay: 3.5 },
      { f: fundamental * 1.52, gain: 0.5, decay: 2.8 },
      { f: fundamental * 2.01, gain: 0.4, decay: 2.2 },
      { f: fundamental * 2.76, gain: 0.3, decay: 1.8 },
      { f: fundamental * 3.42, gain: 0.2, decay: 1.2 },
      { f: fundamental * 4.15, gain: 0.1, decay: 0.9 },
    ];

    harmonics.forEach(({ f, gain, decay }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      gainNode.gain.setValueAtTime(gain, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decay);
    });
  } catch (err) {
    console.warn('Audio synthesis not supported or permitted yet:', err);
  }
}

/**
 * Synthesizes a sacred Conch Shell (Shankh) blowing sound
 */
export function playShankh() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const duration = 3.2;

    // Shankh has a warm low brassy resonance around 220Hz-235Hz with vibrato
    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    subOsc.type = 'sine';

    // Pitch sweep mimicking breath into shankh
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(235, now + 0.4);
    osc.frequency.setValueAtTime(235, now + duration - 0.6);
    osc.frequency.exponentialRampToValueAtTime(180, now + duration);

    subOsc.frequency.setValueAtTime(95, now);
    subOsc.frequency.exponentialRampToValueAtTime(117.5, now + 0.4);
    subOsc.frequency.setValueAtTime(117.5, now + duration - 0.6);
    subOsc.frequency.exponentialRampToValueAtTime(90, now + duration);

    // Vibrato
    vibrato.frequency.value = 5.5; // 5.5 Hz subtle breath vibrato
    vibratoGain.gain.value = 4.0;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);

    // Warm resonant lowpass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(750, now + 0.5);
    filter.frequency.setValueAtTime(750, now + duration - 0.5);
    filter.frequency.exponentialRampToValueAtTime(300, now + duration);

    // Envelope
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.7, now + 0.4);
    gainNode.gain.setValueAtTime(0.65, now + duration - 0.6);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    subOsc.start(now);
    vibrato.start(now);

    osc.stop(now + duration);
    subOsc.stop(now + duration);
    vibrato.stop(now + duration);
  } catch (err) {
    console.warn('Shankh audio error:', err);
  }
}

/**
 * Synthesizes Manjira (Devotional Aarti Cymbals)
 */
export function playCymbal() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const frequencies = [2093, 3136, 4186, 5587];

    frequencies.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      gainNode.gain.setValueAtTime(0.25 / (i + 1), now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    });
  } catch (err) {
    console.warn('Cymbal error:', err);
  }
}

/**
 * Ambient Tanpura Drone state
 */
let tanpuraOscillators: OscillatorNode[] = [];
let tanpuraGain: GainNode | null = null;

export function startTanpuraDrone(): boolean {
  try {
    if (tanpuraOscillators.length > 0) return true;
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    tanpuraGain = ctx.createGain();
    tanpuraGain.gain.setValueAtTime(0.0001, now);
    tanpuraGain.gain.exponentialRampToValueAtTime(0.15, now + 2);
    tanpuraGain.connect(ctx.destination);

    // Traditional C# Sa - Pa - Sa tanpura tuning (approx 138.5 Hz)
    const baseFreq = 138.59;
    const freqs = [
      baseFreq * 0.75, // Pa (lower octave)
      baseFreq,        // Sa
      baseFreq * 1.002,// subtle chorus
      baseFreq * 1.5,  // Pa
      baseFreq * 2.0   // High Sa
    ];

    tanpuraOscillators = freqs.map((f) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);

      osc.connect(filter);
      filter.connect(tanpuraGain!);
      osc.start(now);
      return osc;
    });

    return true;
  } catch (err) {
    console.warn('Tanpura drone error:', err);
    return false;
  }
}

export function stopTanpuraDrone() {
  try {
    if (!tanpuraGain || !audioCtx) return;
    const now = audioCtx.currentTime;
    tanpuraGain.gain.exponentialRampToValueAtTime(0.0001, now + 1);
    setTimeout(() => {
      tanpuraOscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      tanpuraOscillators = [];
      tanpuraGain = null;
    }, 1000);
  } catch (err) {
    console.warn('Stop tanpura error:', err);
  }
}

/**
 * Text-to-Speech Devotional Chanting Voice System
 */
class VoiceReciter {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;
  private onLineChangeCallback: ((lineIndex: number) => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private lines: string[] = [];
  private currentLine = 0;
  private rate = 0.9;
  private pitch = 1.0;
  private languageCode = 'mr-IN';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public speakLines(
    lines: string[],
    options?: {
      rate?: number;
      pitch?: number;
      lang?: string;
      onLineChange?: (lineIndex: number) => void;
      onEnd?: () => void;
    }
  ) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported');
      return;
    }

    this.stop();
    this.lines = lines.filter((l) => l.trim().length > 0);
    this.currentLine = 0;
    this.rate = options?.rate ?? 0.88;
    this.pitch = options?.pitch ?? 0.98;
    this.languageCode = options?.lang ?? 'mr-IN';
    this.onLineChangeCallback = options?.onLineChange ?? null;
    this.onEndCallback = options?.onEnd ?? null;
    this.isSpeaking = true;

    this.speakNextLine();
  }

  private speakNextLine() {
    if (!this.synth || !this.isSpeaking) return;

    if (this.currentLine >= this.lines.length) {
      this.isSpeaking = false;
      if (this.onEndCallback) this.onEndCallback();
      return;
    }

    const lineText = this.lines[this.currentLine];
    if (this.onLineChangeCallback) {
      this.onLineChangeCallback(this.currentLine);
    }

    // Accompany with subtle temple bell every few lines
    if (this.currentLine % 2 === 0) {
      playCymbal();
    }

    const utterance = new SpeechSynthesisUtterance(lineText);
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    // Pick Indian voice if available
    const voices = this.synth.getVoices();
    const matchVoice = voices.find(
      (v) =>
        v.lang === this.languageCode ||
        v.lang === 'hi-IN' ||
        v.lang === 'mr-IN' ||
        v.lang.startsWith('hi') ||
        v.lang.startsWith('mr') ||
        v.name.toLowerCase().includes('india')
    );

    if (matchVoice) {
      utterance.voice = matchVoice;
    }

    utterance.onend = () => {
      if (!this.isSpeaking) return;
      this.currentLine++;
      // Natural breath pause between prayer lines
      setTimeout(() => {
        this.speakNextLine();
      }, 400);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis utterance error:', e);
      this.currentLine++;
      setTimeout(() => {
        this.speakNextLine();
      }, 300);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.isSpeaking) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }

  public stop() {
    this.isSpeaking = false;
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
    this.currentLine = 0;
  }

  public isActive(): boolean {
    return this.isSpeaking;
  }
}

export const devotionalVoiceReciter = new VoiceReciter();

/* ========================================================================= */
/* PUNERI DHOL-TASHA PATHAK WEBAUDIO SYNTHESIZER                             */
/* High-energy Maharashtrian festival rhythm instruments synthesized in real-time */
/* ========================================================================= */

/**
 * Synthesizes the deep, booming punch of the Left Drum Membrane (Dhum / धूम्)
 */
export function playDholBass(velocity = 1.0) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Pitch envelope: drops from ~125Hz to 46Hz for authentic leather head thump
    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    subOsc.type = 'triangle';

    osc.frequency.setValueAtTime(125, now);
    osc.frequency.exponentialRampToValueAtTime(46, now + 0.28);

    subOsc.frequency.setValueAtTime(80, now);
    subOsc.frequency.exponentialRampToValueAtTime(38, now + 0.32);

    // Dynamic leather punch envelope
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.85 * velocity, now + 0.008);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gainNode);
    subOsc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + 0.46);
    subOsc.stop(now + 0.46);
  } catch (err) {
    console.warn('Dhol bass synthesis warning:', err);
  }
}

/**
 * Synthesizes the sharp stick slap of the Right Drum Membrane (Ta / टा)
 */
export function playDholTreble(velocity = 1.0) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Tonal slap
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

    oscGain.gain.setValueAtTime(0.7 * velocity, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    // Stick impact transient crack (noise)
    const bufferSize = ctx.sampleRate * 0.08;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1600;
    filter.Q.value = 2.5;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6 * velocity, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    osc.start(now);
    whiteNoise.start(now);
    osc.stop(now + 0.15);
    whiteNoise.stop(now + 0.1);
  } catch (err) {
    console.warn('Dhol treble synthesis warning:', err);
  }
}

/**
 * Synthesizes the crisp, high-pitch brass crack of the Puneri Tasha (ताशा)
 */
export function playTasha(style: 'single' | 'roll' = 'single', velocity = 1.0) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const count = style === 'roll' ? 3 : 1;
    const spacing = 0.042; // fast rapid strikes for roll

    for (let i = 0; i < count; i++) {
      const strikeTime = now + i * spacing;
      const v = velocity * (style === 'roll' ? (i === count - 1 ? 1.0 : 0.75) : 1.0);

      // High metallic brass ping
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(840, strikeTime);
      osc.frequency.exponentialRampToValueAtTime(380, strikeTime + 0.08);

      oscGain.gain.setValueAtTime(0.4 * v, strikeTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, strikeTime + 0.09);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      // Thin cane stick snap on parchment (highpass noise)
      const bufferSize = ctx.sampleRate * 0.06;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) {
        output[j] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const hpFilter = ctx.createBiquadFilter();
      hpFilter.type = 'highpass';
      hpFilter.frequency.value = 2400;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.75 * v, strikeTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, strikeTime + 0.07);

      noise.connect(hpFilter);
      hpFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      osc.start(strikeTime);
      noise.start(strikeTime);
      osc.stop(strikeTime + 0.1);
      noise.stop(strikeTime + 0.08);
    }
  } catch (err) {
    console.warn('Tasha synthesis warning:', err);
  }
}

/**
 * Synthesizes the deep resonant brass gong/bell strike (Tol / टोल)
 */
export function playTol(velocity = 1.0) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const fundamental = 392; // G4 bell tone

    const harmonics = [
      { f: fundamental, g: 0.75, decay: 2.5 },
      { f: fundamental * 1.62, g: 0.45, decay: 1.8 },
      { f: fundamental * 2.14, g: 0.35, decay: 1.4 },
      { f: fundamental * 3.02, g: 0.2, decay: 0.9 },
    ];

    harmonics.forEach(({ f, g, decay }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(g * velocity, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decay);
    });
  } catch (err) {
    console.warn('Tol synthesis warning:', err);
  }
}

/**
 * Synthesizes the metallic clinking of the traditional Maharashtrian Lejim (लेझीम)
 */
export function playLejim(velocity = 1.0) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Dual metal jingler clinks
    [1850, 2400, 3100, 4200].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25 * velocity, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    });
  } catch (err) {
    console.warn('Lejim synthesis warning:', err);
  }
}

/**
 * Real-time Festive Dhol Tasha Procession Beat Sequencer
 */
export class DholTashaLoopEngine {
  private timerId: number | null = null;
  private currentStep = 0;
  private bpm = 128;
  private patternName: 'miravnuk' | 'morya' | 'kallol' = 'miravnuk';
  private onBeatCallback: ((step: number, instrument: string) => void) | null = null;

  // Patterns defined as arrays of steps
  // 16-step patterns
  private patterns = {
    // Puneri Miravnuk - Thrilling procession beat
    miravnuk: [
      { dholBass: true, dholTreble: false, tasha: true, tol: true },
      { dholBass: false, dholTreble: true, tasha: false, tol: false },
      { dholBass: false, dholTreble: true, tasha: true, tol: false },
      { dholBass: true, dholTreble: false, tasha: false, tol: false },
      { dholBass: false, dholTreble: false, tasha: true, tol: true },
      { dholBass: true, dholTreble: false, tasha: false, tol: false },
      { dholBass: false, dholTreble: true, tasha: true, tol: false },
      { dholBass: false, dholTreble: true, tasha: true, tol: false },
      { dholBass: true, dholTreble: false, tasha: true, tol: true },
      { dholBass: false, dholTreble: true, tasha: false, tol: false },
      { dholBass: true, dholTreble: false, tasha: true, tol: false },
      { dholBass: false, dholTreble: true, tasha: true, tol: false },
      { dholBass: true, dholTreble: false, tasha: true, tol: true },
      { dholBass: false, dholTreble: false, tasha: true, tol: false },
      { dholBass: false, dholTreble: true, tasha: true, tol: false },
      { dholBass: false, dholTreble: true, tasha: true, tol: false },
    ],
    // Ganpati Bappa Morya 4-Beat Groove
    morya: [
      { dholBass: true, dholTreble: false, tasha: true, tol: true },
      { dholBass: false, dholTreble: false, tasha: false, tol: false },
      { dholBass: false, dholTreble: true, tasha: true, tol: false },
      { dholBass: false, dholTreble: false, tasha: false, tol: false },
      { dholBass: true, dholTreble: false, tasha: true, tol: false },
      { dholBass: false, dholTreble: true, tasha: false, tol: false },
      { dholBass: true, dholTreble: false, tasha: true, tol: true },
      { dholBass: false, dholTreble: false, tasha: false, tol: false },
    ],
    // Kallol - Fast double-speed peak energy rhythm
    kallol: [
      { dholBass: true, dholTreble: false, tasha: true, tol: true },
      { dholBass: false, dholTreble: true, tasha: true, tol: false },
      { dholBass: true, dholTreble: false, tasha: true, tol: false },
      { dholBass: false, dholTreble: true, tasha: true, tol: false },
      { dholBass: true, dholTreble: false, tasha: true, tol: true },
      { dholBass: false, dholTreble: true, tasha: true, tol: false },
      { dholBass: true, dholTreble: false, tasha: true, tol: false },
      { dholBass: false, dholTreble: true, tasha: true, tol: false },
    ],
  };

  public setOnBeat(cb: (step: number, instrument: string) => void) {
    this.onBeatCallback = cb;
  }

  public setBpm(newBpm: number) {
    this.bpm = Math.max(70, Math.min(180, newBpm));
    if (this.timerId !== null) {
      this.stop();
      this.start(this.patternName, this.bpm);
    }
  }

  public getBpm(): number {
    return this.bpm;
  }

  public start(patternName: 'miravnuk' | 'morya' | 'kallol', bpm = 126) {
    this.stop();
    this.patternName = patternName;
    this.bpm = bpm;
    this.currentStep = 0;

    const pattern = this.patterns[patternName];
    const intervalMs = (60 / this.bpm / 4) * 1000;

    this.timerId = window.setInterval(() => {
      const stepData = pattern[this.currentStep % pattern.length];

      let triggered = '';
      if (stepData.dholBass) {
        playDholBass(0.9);
        triggered += 'dhol-bass ';
      }
      if (stepData.dholTreble) {
        playDholTreble(0.7);
        triggered += 'dhol-treble ';
      }
      if (stepData.tasha) {
        playTasha('single', 0.85);
        triggered += 'tasha ';
      }
      if (stepData.tol) {
        playTol(0.65);
        triggered += 'tol ';
      }

      if (this.onBeatCallback && triggered) {
        this.onBeatCallback(this.currentStep % pattern.length, triggered.trim());
      }

      this.currentStep++;
    }, intervalMs);
  }

  public stop() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.currentStep = 0;
  }

  public isRunning(): boolean {
    return this.timerId !== null;
  }
}

export const dholTashaEngine = new DholTashaLoopEngine();

