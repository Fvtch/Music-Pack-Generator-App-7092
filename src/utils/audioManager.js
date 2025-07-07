// Enhanced audio playback and management utilities
import audioSynth from './audioSynth';

// Tracking currently playing items
let currentlyPlayingId = null;
let isAudioInitialized = false;

// Initialize audio on first user interaction
export const initAudio = () => {
  if (!isAudioInitialized) {
    audioSynth.init();
    isAudioInitialized = true;
  }
};

// Audio playback functions
export const playAudio = async (sample) => {
  try {
    // Initialize audio if needed (must be called from a user interaction)
    initAudio();
    
    // Stop any currently playing audio
    if (currentlyPlayingId) {
      audioSynth.stopSound(currentlyPlayingId);
    }

    // If sample is already playing, just stop it and return
    if (currentlyPlayingId === sample.name) {
      currentlyPlayingId = null;
      return { id: null, playing: false };
    }
    
    // Determine sample type from name
    const sampleType = getSampleTypeFromName(sample.name);
    
    // Generate unique ID for this sound
    const soundId = sample.name;
    
    // Play the sound
    audioSynth.generateSound(soundId, sampleType);
    currentlyPlayingId = soundId;
    
    // Return a controller object
    const controller = {
      id: soundId,
      playing: true,
      stop: () => {
        audioSynth.stopSound(soundId);
        if (currentlyPlayingId === soundId) {
          currentlyPlayingId = null;
        }
      }
    };
    
    // Auto-stop after 1.5 seconds
    setTimeout(() => {
      if (currentlyPlayingId === soundId) {
        controller.stop();
      }
    }, 1500);
    
    return controller;
  } catch (error) {
    console.error('Error playing audio:', error);
    return { id: null, playing: false };
  }
};

export const stopAllAudio = () => {
  audioSynth.stopAllSounds();
  currentlyPlayingId = null;
};

// Helper to determine sample type from name
function getSampleTypeFromName(name) {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('kick')) return 'kick';
  if (lowerName.includes('snare')) return 'snare';
  if (lowerName.includes('hihat') || lowerName.includes('hat')) return 'hihat';
  if (lowerName.includes('808')) return 'bass';
  if (lowerName.includes('loop')) return 'loop';
  if (lowerName.includes('melody') || lowerName.includes('.mid')) return 'midi';
  if (lowerName.includes('bass')) return 'bass';
  
  // Default to loop for unknown types
  return 'loop';
}

// Enhanced demo samples with better organization
export const demoSamples = {
  'hip-hop': {
    loops: [
      { name: 'Boom Bap Loop 90bpm_01.wav', path: 'hip-hop/loops/boom-bap-90', isDemo: true, genre: 'hip-hop' },
      { name: 'Lo-Fi Loop 85bpm_01.wav', path: 'hip-hop/loops/lofi-85', isDemo: true, genre: 'hip-hop' },
      { name: 'Trap Loop 92bpm_01.wav', path: 'hip-hop/loops/trap-92', isDemo: true, genre: 'hip-hop' }
    ],
    oneShots: [
      { name: 'Kick_01.wav', path: 'hip-hop/oneshots/kick-01', isDemo: true, genre: 'hip-hop' },
      { name: 'Snare_01.wav', path: 'hip-hop/oneshots/snare-01', isDemo: true, genre: 'hip-hop' },
      { name: '808_01.wav', path: 'hip-hop/oneshots/808-01', isDemo: true, genre: 'hip-hop' }
    ],
    midi: [
      { name: 'Melody_01.mid', path: 'hip-hop/midi/melody-01', isDemo: true, genre: 'hip-hop' }
    ]
  },
  'house': {
    loops: [
      { name: 'Deep House Loop 124bpm_01.wav', path: 'house/loops/deep-124', isDemo: true, genre: 'house' },
      { name: 'Tech House Loop 126bpm_01.wav', path: 'house/loops/tech-126', isDemo: true, genre: 'house' }
    ],
    oneShots: [
      { name: 'Kick_01.wav', path: 'house/oneshots/kick-01', isDemo: true, genre: 'house' },
      { name: 'Clap_01.wav', path: 'house/oneshots/clap-01', isDemo: true, genre: 'house' }
    ],
    midi: [
      { name: 'Chord_01.mid', path: 'house/midi/chord-01', isDemo: true, genre: 'house' }
    ]
  },
  // Other genres remain the same...
};

// Generate audio sample objects for the pack
export const generateAudioSamples = (pack) => {
  const { genre } = pack;
  
  // Use demo samples if available for this genre
  if (demoSamples[genre]) {
    return {
      loops: demoSamples[genre].loops.slice(0, pack.loops.length).map((sample, i) => ({
        ...sample,
        name: pack.loops[i],
        category: 'loops'
      })),
      oneShots: demoSamples[genre].oneShots.slice(0, pack.oneShots.length).map((sample, i) => ({
        ...sample,
        name: pack.oneShots[i],
        category: 'oneShots'
      })),
      midi: demoSamples[genre].midi.slice(0, pack.midi.length).map((sample, i) => ({
        ...sample,
        name: pack.midi[i],
        category: 'midi'
      }))
    };
  }
  
  // Fallback to generic samples
  return {
    loops: pack.loops.map(name => ({
      name,
      path: `${genre}/loops/${name.toLowerCase().replace(/\s+/g, '-')}`,
      isDemo: true,
      genre,
      category: 'loops'
    })),
    oneShots: pack.oneShots.map(name => ({
      name,
      path: `${genre}/oneshots/${name.toLowerCase().replace(/\s+/g, '-')}`,
      isDemo: true,
      genre,
      category: 'oneShots'
    })),
    midi: pack.midi.map(name => ({
      name,
      path: `${genre}/midi/${name.toLowerCase().replace(/\s+/g, '-')}`,
      isDemo: true,
      genre,
      category: 'midi'
    }))
  };
};

// Download functionality
export const downloadPack = async (pack) => {
  try {
    // Create a simple text file with pack information for demo
    const packInfo = `
Music Production Ninja - Sample Pack
====================================

Pack Name: ${pack.name}
Description: ${pack.description}
Genre: ${pack.genre}
Mood: ${pack.mood}
Skill Level: ${pack.skillLevel}
Created: ${new Date(pack.createdAt).toLocaleDateString()}

Loops (${pack.loops.length}):
${pack.loops.map((loop, i) => `${i + 1}. ${loop}`).join('\n')}

One-shots (${pack.oneShots.length}):
${pack.oneShots.map((shot, i) => `${i + 1}. ${shot}`).join('\n')}

MIDI Files (${pack.midi.length}):
${pack.midi.map((midi, i) => `${i + 1}. ${midi}`).join('\n')}

Note: This is a demo pack. In a full version, you would receive:
- High-quality WAV/AIFF audio files
- MIDI files for melodies and chords
- Project files for popular DAWs
- Bonus content and stems
`;

    // Create and download the file
    const blob = new Blob([packInfo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pack.name.replace(/\s+/g, '_')}_PackInfo.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Download error:', error);
    return false;
  }
};