class SirenEngine {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  private isPlaying: boolean = false;

  public start() {
    if (this.isPlaying) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Main distress oscillator (piercing alternating dual tone)
      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = 'sawtooth';
      this.osc1.frequency.setValueAtTime(750, this.ctx.currentTime);

      // Low frequency oscillator (LFO) to modulate pitch like an emergency beacon
      this.lfo = this.ctx.createOscillator();
      this.lfo.type = 'sine';
      this.lfo.frequency.setValueAtTime(2.5, this.ctx.currentTime); // 2.5 cycles per second

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(250, this.ctx.currentTime); // sweep between 500Hz and 1000Hz

      this.lfo.connect(lfoGain);
      lfoGain.connect(this.osc1.frequency);

      // Master volume gain
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.35, this.ctx.currentTime);

      this.osc1.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.osc1.start();
      this.lfo.start();
      this.isPlaying = true;
    } catch (e) {
      console.warn('AudioContext failed to start:', e);
    }
  }

  public stop() {
    if (!this.isPlaying) return;

    try {
      if (this.osc1) {
        this.osc1.stop();
        this.osc1.disconnect();
      }
      if (this.lfo) {
        this.lfo.stop();
        this.lfo.disconnect();
      }
      if (this.ctx && this.ctx.state !== 'closed') {
        this.ctx.close();
      }
    } catch {
      // Ignore cleanup error
    } finally {
      this.osc1 = null;
      this.lfo = null;
      this.gainNode = null;
      this.ctx = null;
      this.isPlaying = false;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const sirenEngine = new SirenEngine();
