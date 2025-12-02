
export class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambianceNodes: { 
      gain: GainNode, 
      baseOscs: OscillatorNode[], 
      moodOsc: OscillatorNode | null 
  } | null = null;

  private getContext(): AudioContext | null {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    // Attempt to resume if suspended (requires user interaction first)
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playOscillator(
    freqStart: number, 
    freqEnd: number, 
    type: OscillatorType, 
    duration: number, 
    vol: number = 0.1
  ) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, ctx.currentTime);
    if (freqEnd !== freqStart) {
        osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + duration);
    }

    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  // --- AMBIANCE ENGINE ---

  startAmbiance(gender: 'male' | 'female') {
      if (this.isMuted) return;
      this.stopAmbiance(); // Clear previous if any
      const ctx = this.getContext();
      if (!ctx) return;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 3); // Slow fade in
      gain.connect(ctx.destination);

      // Gender Tones:
      // Female: Ethereal, higher pitch (E4 base)
      // Male: Grounded, lower pitch (C3 base)
      const baseFreq = gender === 'female' ? 329.63 : 130.81;
      const oscs: OscillatorNode[] = [];

      // Create a drone (Root + Fifth)
      const intervals = [1, 1.5]; // Root, Perfect Fifth
      
      intervals.forEach(ratio => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          
          // Slight detune for warmth/texture
          const detune = (Math.random() - 0.5) * 4; 
          osc.frequency.value = baseFreq * ratio + detune;
          
          osc.start();
          osc.connect(gain);
          oscs.push(osc);
      });

      this.ambianceNodes = { gain, baseOscs: oscs, moodOsc: null };
  }

  setAmbianceMood(score: number) { // 0=Bad, 1=Neutral, 2=Good
      if (!this.ambianceNodes || !this.ctx) return;
      
      // Remove previous mood note
      this.resetAmbianceMood();

      // Determine Mood Interval
      let ratio = 1;
      if (score === 2) ratio = 1.25; // Major 3rd (Happy/Empowered)
      else if (score === 0) ratio = 1.2; // Minor 3rd (Sad/Stereotypical)
      else ratio = 1.333; // Perfect 4th (Neutral/Contemplative)

      // Base frequency recovery from existing oscillator
      // Assuming first osc is root. If male C3 (130), female E4 (329)
      const rootFreq = this.ambianceNodes.baseOscs[0].frequency.value;

      const moodOsc = this.ctx.createOscillator();
      moodOsc.type = 'sine';
      moodOsc.frequency.value = rootFreq * ratio;
      
      // Fade in mood note
      const moodGain = this.ctx.createGain();
      moodGain.gain.setValueAtTime(0, this.ctx.currentTime);
      moodGain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 1);
      
      moodOsc.connect(moodGain);
      moodGain.connect(this.ambianceNodes.gain);
      
      moodOsc.start();
      
      // Store mood osc (and its wrapper gain implicitly via graph) 
      // Note: We only store osc reference to stop it, garbage collection handles gain
      this.ambianceNodes.moodOsc = moodOsc;
  }

  resetAmbianceMood() {
      if (this.ambianceNodes?.moodOsc) {
          const oldOsc = this.ambianceNodes.moodOsc;
          // Simple stop for now, could fade out if we tracked the moodGain
          try {
             // Ramp frequency down slightly to simulate "release"
             oldOsc.frequency.exponentialRampToValueAtTime(oldOsc.frequency.value * 0.9, this.ctx!.currentTime + 0.5);
             oldOsc.stop(this.ctx!.currentTime + 0.5);
          } catch(e) {}
          this.ambianceNodes.moodOsc = null;
      }
  }

  stopAmbiance() {
      if (this.ambianceNodes && this.ctx) {
          const { gain, baseOscs, moodOsc } = this.ambianceNodes;
          
          // Fade out master volume
          try {
            gain.gain.cancelScheduledValues(this.ctx.currentTime);
            gain.gain.setValueAtTime(gain.gain.value, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2);
          } catch (e) {}

          setTimeout(() => {
              baseOscs.forEach(o => o.stop());
              if (moodOsc) moodOsc.stop();
              gain.disconnect();
          }, 2100);

          this.ambianceNodes = null;
      }
  }

  // --- SFX ---

  playClick() {
    this.playOscillator(800, 800, 'sine', 0.05, 0.05);
  }

  playStart() {
    this.playOscillator(220, 880, 'sine', 0.4, 0.1);
  }

  playSuccess() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    this.scheduleTone(ctx, 523.25, 'sine', now, 0.2, 0.1); // C5
    this.scheduleTone(ctx, 659.25, 'sine', now + 0.1, 0.3, 0.1); // E5
  }

  playAlert() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    this.scheduleTone(ctx, 880, 'square', now, 0.1, 0.05);
    this.scheduleTone(ctx, 880, 'square', now + 0.12, 0.1, 0.05);
  }

  playMiss() {
    this.playOscillator(150, 50, 'triangle', 0.3, 0.1);
  }

  private scheduleTone(ctx: AudioContext, freq: number, type: OscillatorType, time: number, duration: number, vol: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }
}

export const soundManager = new SoundManager();
