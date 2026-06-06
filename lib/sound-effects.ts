export class GameSoundEffects {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (this.context) {
      return this.context;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as Window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) {
        console.warn("AudioContext not supported in this browser.");
        return null;
      }

      const audioContext = new AudioCtx();
      const gainNode = audioContext.createGain();
      
      // Boost volume slightly for better audibility
      gainNode.gain.value = 0.35; 
      gainNode.connect(audioContext.destination);

      this.context = audioContext;
      this.masterGain = gainNode;

      console.log("AudioContext initialized. State:", audioContext.state);
      return audioContext;
    } catch (e) {
      console.error("Failed to initialize AudioContext:", e);
      return null;
    }
  }

  /**
   * Must be called inside a user interaction (click/touch) to unlock audio.
   */
  async unlock(): Promise<boolean> {
    const ctx = this.ensureContext();
    if (!ctx) return false;

    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
        console.log("AudioContext resumed successfully.");
      } catch (e) {
        console.error("Failed to resume AudioContext:", e);
        return false;
      }
    }
    return true;
  }

  private playTone({
    frequency,
    duration,
    type = "sine",
    volume = 0.15,
    delay = 0,
    ramp = "exponential",
  }: {
    frequency: number | number[];
    duration: number;
    type?: OscillatorType;
    volume?: number;
    delay?: number;
    ramp?: "linear" | "exponential";
  }) {
    const ctx = this.ensureContext();
    const master = this.masterGain;
    
    // Only play if context is running
    if (!ctx || !master || ctx.state !== "running") {
      return;
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    
    const startTime = ctx.currentTime + delay;

    if (Array.isArray(frequency)) {
      oscillator.frequency.setValueAtTime(frequency[0], startTime);
      oscillator.frequency.exponentialRampToValueAtTime(frequency[1], startTime + duration);
    } else {
      oscillator.frequency.setValueAtTime(frequency, startTime);
    }

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
    
    if (ramp === "exponential") {
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    } else {
      gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
    }

    oscillator.connect(gainNode);
    gainNode.connect(master);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.1);
  }

  playStart() {
    this.playTone({ frequency: [400, 800], duration: 0.2, type: "triangle", volume: 0.2 });
    this.playTone({ frequency: [600, 1200], duration: 0.2, type: "triangle", volume: 0.2, delay: 0.1 });
  }

  playPop() {
    this.playTone({ frequency: [150, 450], duration: 0.12, type: "sine", volume: 0.15 });
  }

  playHit() {
    this.playTone({ frequency: [900, 300], duration: 0.08, type: "square", volume: 0.12 });
  }

  playMiss() {
    this.playTone({ frequency: [200, 60], duration: 0.2, type: "sawtooth", volume: 0.1 });
  }

  playTick() {
    this.playTone({ frequency: 1000, duration: 0.03, type: "sine", volume: 0.08 });
  }

  playEnd() {
    [523.25, 392, 329.63].forEach((freq, i) => {
      this.playTone({ frequency: freq, duration: 0.3, type: "triangle", volume: 0.15, delay: i * 0.2 });
    });
  }

  dispose() {
    if (this.context) {
      void this.context.close();
      this.context = null;
      this.masterGain = null;
    }
  }
}
