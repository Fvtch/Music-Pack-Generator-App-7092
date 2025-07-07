// Enhanced audio manager with real sample loading and playback
import audioPlayer from './audioPlayer';

// Tracking playing sounds
let currentlyPlayingId = null;

// Initialize audio on first user interaction
export const initAudio = () => {
  const success = audioPlayer.init();
  console.log(`🎵 Audio manager initialized: ${success ? 'success' : 'failed'}`);
  return success;
};

// Play a sample by name/type
export const playAudio = async (sample) => {
  try {
    console.log(`🎯 Attempting to play: ${sample.name}`, sample);
    
    // Initialize audio if needed
    if (!initAudio()) {
      console.warn("❌ Audio initialization failed");
      return null;
    }

    // Stop any currently playing audio
    if (currentlyPlayingId) {
      stopAllAudio();
    }

    // If same sample is playing, just stop it
    if (currentlyPlayingId === sample.name) {
      currentlyPlayingId = null;
      return { id: null, playing: false };
    }

    // Determine the URL for the audio file
    const audioUrl = getAudioUrl(sample);
    console.log(`🔊 Playing audio from: ${audioUrl}`);

    // Play the sound
    const sound = await audioPlayer.playSound(audioUrl, { volume: 0.8 });
    
    if (sound) {
      currentlyPlayingId = sample.name;
      console.log(`✅ Successfully playing: ${sample.name}`);
      
      return {
        id: sample.name,
        playing: true,
        stop: () => {
          sound.stop();
          currentlyPlayingId = null;
        }
      };
    } else {
      console.warn(`❌ Failed to play: ${sample.name}`);
      return null;
    }
  } catch (error) {
    console.error('❌ Error in playAudio:', error);
    return null;
  }
};

export const stopAllAudio = () => {
  audioPlayer.stopAllSounds();
  currentlyPlayingId = null;
  console.log('🛑 All audio stopped');
};

// Helper to determine the URL for an audio file
function getAudioUrl(sample) {
  // Check if the sample has a path property
  if (sample.path) {
    // If it's a demo sample, use the demo directory
    if (sample.isDemo) {
      return `/audio/demo-samples/${sample.genre}/${sample.category.toLowerCase()}/${getSampleFilename(sample.path)}.mp3`;
    }
    
    // Regular sample
    return `/audio/${sample.path}.mp3`;
  }
  
  // Fallback to a static path based on name
  const category = sample.category || 'loops';
  const genre = sample.genre || 'hip-hop';
  
  // Use the sample name to create a path
  const filename = sample.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\.wav$|\.mp3$|\.aiff$|\.mid$/i, '');
  
  return `/audio/${genre}/${category}/${filename}.mp3`;
}

// Extract the last part of a path as the filename
function getSampleFilename(path) {
  return path.split('/').pop();
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
      { name: 'Deep House Loop 124bpm_01.wav', path: 'house/loops/deep-house-124', isDemo: true, genre: 'house' },
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
  'trap': {
    loops: [
      { name: 'Trap Loop 140bpm_01.wav', path: 'trap/loops/trap-140', isDemo: true, genre: 'trap' },
      { name: 'Dark Trap Loop 145bpm_01.wav', path: 'trap/loops/dark-145', isDemo: true, genre: 'trap' }
    ],
    oneShots: [
      { name: 'Trap Kick_01.wav', path: 'trap/oneshots/kick-01', isDemo: true, genre: 'trap' },
      { name: '808 Bass_01.wav', path: 'trap/oneshots/808-01', isDemo: true, genre: 'trap' }
    ],
    midi: [
      { name: 'Trap Melody_01.mid', path: 'trap/midi/melody-01', isDemo: true, genre: 'trap' }
    ]
  },
  'ambient': {
    loops: [
      { name: 'Pad Loop 70bpm_01.wav', path: 'ambient/loops/pad-70', isDemo: true, genre: 'ambient' },
      { name: 'Atmospheric Loop 65bpm_01.wav', path: 'ambient/loops/atmos-65', isDemo: true, genre: 'ambient' }
    ],
    oneShots: [
      { name: 'Bell_01.wav', path: 'ambient/oneshots/bell-01', isDemo: true, genre: 'ambient' },
      { name: 'Texture_01.wav', path: 'ambient/oneshots/texture-01', isDemo: true, genre: 'ambient' }
    ],
    midi: [
      { name: 'Ambient Pad_01.mid', path: 'ambient/midi/pad-01', isDemo: true, genre: 'ambient' }
    ]
  },
  'pop': {
    loops: [
      { name: 'Pop Chord Loop 100bpm_01.wav', path: 'pop/loops/chord-100', isDemo: true, genre: 'pop' },
      { name: 'Verse Loop 105bpm_01.wav', path: 'pop/loops/verse-105', isDemo: true, genre: 'pop' }
    ],
    oneShots: [
      { name: 'Pop Kick_01.wav', path: 'pop/oneshots/kick-01', isDemo: true, genre: 'pop' },
      { name: 'Clap_01.wav', path: 'pop/oneshots/clap-01', isDemo: true, genre: 'pop' }
    ],
    midi: [
      { name: 'Pop Melody_01.mid', path: 'pop/midi/melody-01', isDemo: true, genre: 'pop' }
    ]
  },
  'techno': {
    loops: [
      { name: 'Techno Loop 130bpm_01.wav', path: 'techno/loops/techno-130', isDemo: true, genre: 'techno' },
      { name: 'Industrial Loop 132bpm_01.wav', path: 'techno/loops/industrial-132', isDemo: true, genre: 'techno' }
    ],
    oneShots: [
      { name: 'Techno Kick_01.wav', path: 'techno/oneshots/kick-01', isDemo: true, genre: 'techno' },
      { name: 'Noise Hit_01.wav', path: 'techno/oneshots/noise-01', isDemo: true, genre: 'techno' }
    ],
    midi: [
      { name: 'Techno Sequence_01.mid', path: 'techno/midi/sequence-01', isDemo: true, genre: 'techno' }
    ]
  }
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