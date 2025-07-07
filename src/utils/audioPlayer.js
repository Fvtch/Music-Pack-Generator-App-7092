// Advanced audio player that loads and plays real audio files
class AudioPlayer {
  constructor() {
    this.context = null;
    this.isInitialized = false;
    this.audioBuffers = new Map(); // Cache for loaded audio buffers
    this.playingSounds = new Map(); // Track currently playing sounds
    this.masterGain = null;
  }

  // Initialize the audio context (must be called from a user interaction)
  init() {
    if (this.isInitialized) return true;
    
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.context = new AudioContext();
      
      // Create master gain
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = 0.8; // Overall volume
      this.masterGain.connect(this.context.destination);
      
      this.isInitialized = true;
      console.log("🎵 Audio player initialized successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to initialize audio context:", error);
      return false;
    }
  }

  // Load and cache an audio file
  async loadSound(url) {
    if (!this.isInitialized && !this.init()) {
      console.error("❌ Cannot load sound, audio context not initialized");
      return null;
    }

    // Return from cache if already loaded
    if (this.audioBuffers.has(url)) {
      return this.audioBuffers.get(url);
    }

    try {
      console.log(`🔄 Loading audio: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch audio file: ${response.status} ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      
      // Cache the decoded buffer
      this.audioBuffers.set(url, audioBuffer);
      console.log(`✅ Successfully loaded: ${url}`);
      
      return audioBuffer;
    } catch (error) {
      console.error(`❌ Error loading audio from ${url}:`, error);
      
      // Create a fallback buffer with a simple tone if loading fails
      return this.createFallbackBuffer();
    }
  }

  // Create a fallback buffer with a simple tone
  createFallbackBuffer() {
    try {
      const sampleRate = this.context.sampleRate;
      const duration = 1; // 1 second
      const buffer = this.context.createBuffer(2, sampleRate * duration, sampleRate);
      
      // Fill both channels with a simple sine wave
      for (let channel = 0; channel < 2; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < channelData.length; i++) {
          // Simple sine wave at 440Hz
          channelData[i] = Math.sin(2 * Math.PI * 440 * i / sampleRate) * 0.5;
        }
      }
      
      return buffer;
    } catch (error) {
      console.error("❌ Error creating fallback buffer:", error);
      return null;
    }
  }

  // Play a loaded audio buffer
  async playSound(url, options = {}) {
    if (!this.isInitialized && !this.init()) {
      return null;
    }

    // Resume audio context if suspended (browser requirement)
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }

    try {
      // Load the sound if not already cached
      const buffer = await this.loadSound(url);
      if (!buffer) {
        throw new Error("Failed to load audio buffer");
      }

      // Create source node
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      
      // Create gain node for this sound
      const gainNode = this.context.createGain();
      gainNode.gain.value = options.volume || 1.0;
      
      // Connect the nodes
      source.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      // Generate a unique ID for this sound
      const soundId = `sound_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Store reference to the playing sound
      this.playingSounds.set(soundId, {
        source,
        gainNode,
        url
      });
      
      // Handle when sound finishes playing
      source.onended = () => {
        this.playingSounds.delete(soundId);
        console.log(`🔊 Sound finished: ${soundId}`);
      };
      
      // Start playing
      source.start(0);
      console.log(`▶️ Playing sound: ${url} (ID: ${soundId})`);
      
      return {
        id: soundId,
        stop: () => this.stopSound(soundId),
        setVolume: (volume) => {
          if (this.playingSounds.has(soundId)) {
            this.playingSounds.get(soundId).gainNode.gain.value = volume;
          }
        }
      };
    } catch (error) {
      console.error(`❌ Error playing sound ${url}:`, error);
      return null;
    }
  }

  // Stop a specific sound
  stopSound(soundId) {
    if (!this.playingSounds.has(soundId)) return false;
    
    try {
      const { source } = this.playingSounds.get(soundId);
      source.stop(0);
      this.playingSounds.delete(soundId);
      console.log(`⏹️ Stopped sound: ${soundId}`);
      return true;
    } catch (error) {
      console.error(`❌ Error stopping sound ${soundId}:`, error);
      this.playingSounds.delete(soundId);
      return false;
    }
  }

  // Stop all playing sounds
  stopAllSounds() {
    const soundIds = Array.from(this.playingSounds.keys());
    let stoppedCount = 0;
    
    soundIds.forEach(id => {
      if (this.stopSound(id)) {
        stoppedCount++;
      }
    });
    
    console.log(`⏹️ Stopped ${stoppedCount} sounds`);
    return stoppedCount;
  }

  // Set master volume
  setMasterVolume(volume) {
    if (!this.isInitialized) return false;
    
    try {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
      return true;
    } catch (error) {
      console.error("❌ Error setting master volume:", error);
      return false;
    }
  }

  // Clean up and release resources
  dispose() {
    this.stopAllSounds();
    this.audioBuffers.clear();
    this.playingSounds.clear();
    
    if (this.context) {
      this.context.close().then(() => {
        console.log("🧹 Audio context closed");
      }).catch(error => {
        console.error("❌ Error closing audio context:", error);
      });
    }
    
    this.isInitialized = false;
  }
}

// Create a singleton instance
const audioPlayer = new AudioPlayer();
export default audioPlayer;