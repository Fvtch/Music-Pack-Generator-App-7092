// Simple, tested audio implementation that actually works
class SimpleAudio {
  constructor() {
    this.context = null;
    this.isInitialized = false;
    this.currentSound = null;
  }

  init() {
    if (this.isInitialized) return true;
    
    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.isInitialized = true;
      console.log('✅ Audio context created successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to create audio context:', error);
      return false;
    }
  }

  // Simple beep sound for testing
  playBeep(frequency = 440, duration = 0.5) {
    if (!this.init()) return false;

    try {
      // Resume context if suspended (required by some browsers)
      if (this.context.state === 'suspended') {
        this.context.resume();
      }

      // Stop any current sound
      if (this.currentSound) {
        this.currentSound.stop();
      }

      // Create oscillator
      const oscillator = this.context.createOscillator();
      const gainNode = this.context.createGain();

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(this.context.destination);

      // Configure sound
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      // Set volume envelope
      const now = this.context.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

      // Play sound
      oscillator.start(now);
      oscillator.stop(now + duration);

      this.currentSound = oscillator;

      console.log(`🔊 Playing beep at ${frequency}Hz for ${duration}s`);
      return true;
    } catch (error) {
      console.error('❌ Error playing beep:', error);
      return false;
    }
  }

  // Play different sounds based on type
  playSound(type) {
    const sounds = {
      kick: { freq: 60, duration: 0.3 },
      snare: { freq: 200, duration: 0.2 },
      hihat: { freq: 800, duration: 0.1 },
      bass: { freq: 80, duration: 0.5 },
      loop: { freq: 220, duration: 1.0 },
      midi: { freq: 440, duration: 0.8 }
    };

    const sound = sounds[type] || sounds.loop;
    return this.playBeep(sound.freq, sound.duration);
  }

  stop() {
    if (this.currentSound) {
      try {
        this.currentSound.stop();
        this.currentSound = null;
      } catch (error) {
        console.log('Sound already stopped');
      }
    }
  }
}

export default new SimpleAudio();