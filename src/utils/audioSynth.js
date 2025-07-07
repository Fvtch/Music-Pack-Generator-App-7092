// A simple audio synthesis engine to create sounds without requiring audio files
class AudioSynthEngine {
  constructor() {
    // Initialize audio context when needed (to avoid autoplay restrictions)
    this.audioContext = null;
    this.oscillators = new Map();
    this.gainNodes = new Map();
  }

  // Initialize audio context on user interaction
  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Generate different types of sounds based on sample type
  generateSound(id, type, duration = 1.5) {
    try {
      const ctx = this.init();

      // Stop any currently playing sound with this ID
      this.stopSound(id);

      // Create oscillator and gain node
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Configure sound based on type
      const config = this.getSoundConfig(type);
      
      oscillator.type = config.waveform;
      oscillator.frequency.value = config.frequency;
      
      // Apply envelope
      gainNode.gain.setValueAtTime(config.attack, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        config.sustain, 
        ctx.currentTime + config.attackTime
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001, 
        ctx.currentTime + duration
      );
      
      // Start oscillator
      oscillator.start();
      oscillator.stop(ctx.currentTime + duration);
      
      // Store references
      this.oscillators.set(id, oscillator);
      this.gainNodes.set(id, gainNode);
      
      // Clean up when done
      oscillator.onended = () => {
        this.oscillators.delete(id);
        this.gainNodes.delete(id);
      };
      
      return true;
    } catch (error) {
      console.error('Audio synthesis error:', error);
      return false;
    }
  }
  
  // Stop a specific sound
  stopSound(id) {
    if (this.oscillators.has(id)) {
      const oscillator = this.oscillators.get(id);
      const gainNode = this.gainNodes.get(id);
      
      // Quick fade out to avoid clicks
      if (gainNode && this.audioContext) {
        gainNode.gain.exponentialRampToValueAtTime(
          0.001, 
          this.audioContext.currentTime + 0.05
        );
        
        // Stop after fade
        setTimeout(() => {
          try {
            oscillator.stop();
          } catch (e) {
            // Ignore errors if already stopped
          }
        }, 50);
      }
      
      this.oscillators.delete(id);
      this.gainNodes.delete(id);
      return true;
    }
    return false;
  }
  
  // Stop all sounds
  stopAllSounds() {
    const ids = Array.from(this.oscillators.keys());
    ids.forEach(id => this.stopSound(id));
    return ids.length;
  }
  
  // Get configuration for different sound types
  getSoundConfig(type) {
    // Base configurations for different sound types
    const configs = {
      kick: {
        waveform: 'sine',
        frequency: 60,
        attack: 0.5,
        attackTime: 0.01,
        sustain: 0.2
      },
      snare: {
        waveform: 'triangle',
        frequency: 200,
        attack: 0.5,
        attackTime: 0.01,
        sustain: 0.1
      },
      hihat: {
        waveform: 'square',
        frequency: 800,
        attack: 0.2,
        attackTime: 0.01,
        sustain: 0.05
      },
      loop: {
        waveform: 'sine',
        frequency: 440,
        attack: 0.3,
        attackTime: 0.05,
        sustain: 0.2
      },
      midi: {
        waveform: 'sine',
        frequency: 330,
        attack: 0.3,
        attackTime: 0.1,
        sustain: 0.2
      },
      bass: {
        waveform: 'triangle',
        frequency: 80,
        attack: 0.3,
        attackTime: 0.1,
        sustain: 0.2
      },
      default: {
        waveform: 'sine',
        frequency: 440,
        attack: 0.3,
        attackTime: 0.05,
        sustain: 0.2
      }
    };
    
    // Determine which config to use
    let config = configs.default;
    
    if (typeof type === 'string') {
      const lowerType = type.toLowerCase();
      
      if (lowerType.includes('kick')) {
        config = configs.kick;
      } else if (lowerType.includes('snare')) {
        config = configs.snare;
      } else if (lowerType.includes('hihat') || lowerType.includes('hat')) {
        config = configs.hihat;
      } else if (lowerType.includes('loop')) {
        config = configs.loop;
      } else if (lowerType.includes('midi') || lowerType.includes('melody')) {
        config = configs.midi;
      } else if (lowerType.includes('bass') || lowerType.includes('808')) {
        config = configs.bass;
      }
    }
    
    return config;
  }
  
  // Modify a sound's frequency
  modifyFrequency(id, frequency) {
    if (this.oscillators.has(id)) {
      const oscillator = this.oscillators.get(id);
      oscillator.frequency.value = frequency;
      return true;
    }
    return false;
  }
}

// Create a singleton instance
const audioSynth = new AudioSynthEngine();
export default audioSynth;