/**
 * Simple Web Audio API synthesizer for generating audio in the browser
 * This creates different sounds without requiring audio files
 */
class AudioSynthEngine {
  constructor() {
    this.context = null;
    this.masterGain = null;
    this.sounds = new Map();
    this.isInitialized = false;
  }
  
  // Initialize the audio context (must be called from a user interaction)
  init() {
    if (this.isInitialized) return;
    
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.context = new AudioContext();
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = 0.7; // Master volume
      this.masterGain.connect(this.context.destination);
      this.isInitialized = true;
      console.log("🔊 Audio engine initialized");
    } catch (error) {
      console.error("Failed to initialize audio engine:", error);
    }
    
    return this.isInitialized;
  }
  
  // Generate a sound based on the sample type
  playSample(id, type) {
    if (!this.isInitialized) {
      if (!this.init()) return null;
    }
    
    // Stop any existing sound with this ID
    this.stopSound(id);
    
    try {
      // Create oscillators and gain nodes
      const mainOsc = this.context.createOscillator();
      const mainGain = this.context.createGain();
      
      // Configure based on type
      const config = this.getSampleConfig(type);
      
      // Setup oscillator
      mainOsc.type = config.waveform;
      mainOsc.frequency.value = config.frequency;
      
      // Connect nodes
      mainOsc.connect(mainGain);
      mainGain.connect(this.masterGain);
      
      // Apply envelope
      const now = this.context.currentTime;
      mainGain.gain.setValueAtTime(0, now);
      mainGain.gain.linearRampToValueAtTime(config.peak, now + config.attack);
      mainGain.gain.exponentialRampToValueAtTime(config.sustain, now + config.attack + config.decay);
      mainGain.gain.exponentialRampToValueAtTime(0.001, now + config.attack + config.decay + config.release);
      
      // Create secondary oscillator for more complex sounds if needed
      let subOsc = null;
      let subGain = null;
      
      if (config.useSubOsc) {
        subOsc = this.context.createOscillator();
        subGain = this.context.createGain();
        
        subOsc.type = config.subWaveform;
        subOsc.frequency.value = config.subFrequency;
        
        subOsc.connect(subGain);
        subGain.connect(this.masterGain);
        
        subGain.gain.setValueAtTime(0, now);
        subGain.gain.linearRampToValueAtTime(config.subPeak, now + config.attack);
        subGain.gain.exponentialRampToValueAtTime(config.subSustain, now + config.attack + config.decay);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + config.attack + config.decay + config.release);
        
        subOsc.start(now);
        subOsc.stop(now + config.attack + config.decay + config.release + 0.1);
      }
      
      // Add noise for snares, hi-hats, etc.
      let noiseNode = null;
      let noiseGain = null;
      let filter = null;
      
      if (config.useNoise) {
        // Create noise
        const bufferSize = 2 * this.context.sampleRate;
        const noiseBuffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        
        noiseNode = this.context.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;
        
        // Create filter for noise
        filter = this.context.createBiquadFilter();
        filter.type = config.filterType;
        filter.frequency.value = config.filterFreq;
        filter.Q.value = config.filterQ;
        
        // Create gain for noise
        noiseGain = this.context.createGain();
        
        // Connect
        noiseNode.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        
        // Envelope
        noiseGain.gain.setValueAtTime(0, now);
        noiseGain.gain.linearRampToValueAtTime(config.noisePeak, now + config.noiseAttack);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + config.noiseAttack + config.noiseRelease);
        
        noiseNode.start(now);
        noiseNode.stop(now + config.noiseAttack + config.noiseRelease + 0.1);
      }
      
      // Start the oscillator
      mainOsc.start(now);
      mainOsc.stop(now + config.attack + config.decay + config.release + 0.1);
      
      // Store the sound components for stopping later
      this.sounds.set(id, {
        mainOsc,
        mainGain,
        subOsc,
        subGain,
        noiseNode,
        noiseGain,
        startTime: now,
        duration: config.attack + config.decay + config.release + 0.1,
        timerId: setTimeout(() => {
          this.sounds.delete(id);
        }, (config.attack + config.decay + config.release + 0.2) * 1000)
      });
      
      return {
        id,
        startTime: now,
        duration: config.attack + config.decay + config.release
      };
    } catch (error) {
      console.error("Error generating sound:", error);
      return null;
    }
  }
  
  // Stop a sound by ID
  stopSound(id) {
    if (!this.sounds.has(id)) return false;
    
    try {
      const sound = this.sounds.get(id);
      const now = this.context.currentTime;
      
      // Quick fade out to avoid clicks
      if (sound.mainGain) {
        sound.mainGain.gain.cancelScheduledValues(now);
        sound.mainGain.gain.setValueAtTime(sound.mainGain.gain.value, now);
        sound.mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      }
      
      if (sound.subGain) {
        sound.subGain.gain.cancelScheduledValues(now);
        sound.subGain.gain.setValueAtTime(sound.subGain.gain.value, now);
        sound.subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      }
      
      if (sound.noiseGain) {
        sound.noiseGain.gain.cancelScheduledValues(now);
        sound.noiseGain.gain.setValueAtTime(sound.noiseGain.gain.value, now);
        sound.noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      }
      
      // Stop all oscillators after fade
      setTimeout(() => {
        try {
          if (sound.mainOsc) sound.mainOsc.stop();
          if (sound.subOsc) sound.subOsc.stop();
          if (sound.noiseNode) sound.noiseNode.stop();
        } catch (e) {
          // Ignore errors if already stopped
        }
        
        clearTimeout(sound.timerId);
        this.sounds.delete(id);
      }, 60);
      
      return true;
    } catch (error) {
      console.error("Error stopping sound:", error);
      this.sounds.delete(id);
      return false;
    }
  }
  
  // Stop all sounds
  stopAllSounds() {
    const ids = Array.from(this.sounds.keys());
    ids.forEach(id => this.stopSound(id));
    return ids.length;
  }
  
  // Get configuration for different sample types
  getSampleConfig(type) {
    // Default configuration
    const defaults = {
      waveform: 'sine',
      frequency: 440,
      attack: 0.01,
      decay: 0.1,
      sustain: 0.3,
      release: 0.5,
      peak: 0.8,
      useSubOsc: false,
      subWaveform: 'sine',
      subFrequency: 220,
      subPeak: 0.5,
      subSustain: 0.2,
      useNoise: false,
      noisePeak: 0.5,
      noiseAttack: 0.01,
      noiseRelease: 0.2,
      filterType: 'lowpass',
      filterFreq: 1000,
      filterQ: 1
    };
    
    // Specific configurations for different sound types
    const configs = {
      kick: {
        waveform: 'sine',
        frequency: 120,
        attack: 0.001,
        decay: 0.2,
        sustain: 0.1,
        release: 0.2,
        peak: 0.9,
        useSubOsc: true,
        subWaveform: 'sine',
        subFrequency: 60,
        subPeak: 0.8,
        subSustain: 0.2
      },
      snare: {
        waveform: 'triangle',
        frequency: 180,
        attack: 0.001,
        decay: 0.1,
        sustain: 0.1,
        release: 0.1,
        peak: 0.7,
        useNoise: true,
        noisePeak: 0.6,
        noiseAttack: 0.001,
        noiseRelease: 0.2,
        filterType: 'highpass',
        filterFreq: 1000,
        filterQ: 1.5
      },
      hihat: {
        waveform: 'square',
        frequency: 200,
        attack: 0.001,
        decay: 0.05,
        sustain: 0.01,
        release: 0.1,
        peak: 0.3,
        useNoise: true,
        noisePeak: 0.7,
        noiseAttack: 0.001,
        noiseRelease: 0.1,
        filterType: 'highpass',
        filterFreq: 7000,
        filterQ: 1
      },
      bass: {
        waveform: 'triangle',
        frequency: 80,
        attack: 0.01,
        decay: 0.1,
        sustain: 0.4,
        release: 0.4,
        peak: 0.9,
        useSubOsc: true,
        subWaveform: 'sine',
        subFrequency: 40,
        subPeak: 0.7,
        subSustain: 0.5
      },
      loop: {
        waveform: 'sawtooth',
        frequency: 220,
        attack: 0.02,
        decay: 0.1,
        sustain: 0.6,
        release: 0.5,
        peak: 0.7,
        useSubOsc: true,
        subWaveform: 'triangle',
        subFrequency: 110,
        subPeak: 0.4,
        subSustain: 0.3
      },
      midi: {
        waveform: 'sine',
        frequency: 330,
        attack: 0.05,
        decay: 0.1,
        sustain: 0.6,
        release: 0.6,
        peak: 0.8,
        useSubOsc: true,
        subWaveform: 'triangle',
        subFrequency: 165,
        subPeak: 0.4,
        subSustain: 0.3
      }
    };
    
    // Determine which config to use based on the type
    let config = { ...defaults };
    
    if (typeof type === 'string') {
      const lowerType = type.toLowerCase();
      
      if (lowerType.includes('kick')) {
        config = { ...defaults, ...configs.kick };
      } else if (lowerType.includes('snare')) {
        config = { ...defaults, ...configs.snare };
      } else if (lowerType.includes('hihat') || lowerType.includes('hat')) {
        config = { ...defaults, ...configs.hihat };
      } else if (lowerType.includes('808') || lowerType.includes('bass')) {
        config = { ...defaults, ...configs.bass };
      } else if (lowerType.includes('loop')) {
        config = { ...defaults, ...configs.loop };
      } else if (lowerType.includes('midi') || lowerType.includes('melody')) {
        config = { ...defaults, ...configs.midi };
      }
    }
    
    return config;
  }
  
  // Utility method to create frequency for a specific note
  getNoteFrequency(note, octave) {
    const notes = { 'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11 };
    const baseFreq = 440; // A4
    const baseNote = notes['A'];
    const baseOctave = 4;
    
    const semitones = (octave - baseOctave) * 12 + (notes[note] - baseNote);
    return baseFreq * Math.pow(2, semitones / 12);
  }
}

// Create a singleton instance
const audioSynth = new AudioSynthEngine();
export default audioSynth;