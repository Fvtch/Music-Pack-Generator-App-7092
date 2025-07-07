// Sample pack generation logic
import { generateAudioSamples } from './audioManager';

export const generatePack = (selections) => {
  const { genre, mood, skillLevel, daw } = selections;
  
  // Pack name generator
  const packNames = {
    'hip-hop': ['Urban Chronicles', 'Street Symphony', 'Concrete Jungle', 'City Pulse', 'Metro Beats'],
    'house': ['Deep Currents', 'Midnight Groove', 'Neon Nights', 'Electric Dreams', 'Pulse Drive'],
    'trap': ['Dark Matter', 'Shadow Realm', 'Void Trap', 'Midnight Hustle', 'Bass Dynasty'],
    'ambient': ['Ethereal Spaces', 'Cosmic Drift', 'Infinite Calm', 'Zen Garden', 'Astral Plane'],
    'pop': ['Radio Gold', 'Chart Toppers', 'Melody Magic', 'Hit Factory', 'Pop Perfection'],
    'techno': ['Machine Soul', 'Digital Pulse', 'Cyber Rhythms', 'Tech Noir', 'Binary Beats'],
  };

  const moodAdjectives = {
    'dark': ['Shadow', 'Noir', 'Midnight', 'Obsidian', 'Void'],
    'uplifting': ['Bright', 'Sunrise', 'Golden', 'Radiant', 'Euphoric'],
    'chill': ['Mellow', 'Smooth', 'Velvet', 'Serene', 'Tranquil'],
    'aggressive': ['Fierce', 'Intense', 'Savage', 'Raw', 'Brutal'],
    'cinematic': ['Epic', 'Dramatic', 'Orchestral', 'Majestic', 'Heroic'],
    'zen': ['Peaceful', 'Meditative', 'Harmony', 'Balance', 'Mindful'],
  };

  // Generate pack name
  const baseName = packNames[genre][Math.floor(Math.random() * packNames[genre].length)];
  const moodPrefix = moodAdjectives[mood][Math.floor(Math.random() * moodAdjectives[mood].length)];
  const packName = `${moodPrefix} ${baseName}`;

  // Generate pack description
  const descriptions = {
    'hip-hop': 'Hard-hitting drums and smooth melodies for that authentic hip-hop vibe',
    'house': 'Four-on-the-floor rhythms and infectious grooves to move the dancefloor',
    'trap': 'Heavy 808s, crisp hi-hats, and atmospheric elements for modern trap production',
    'ambient': 'Ethereal textures and evolving soundscapes for atmospheric compositions',
    'pop': 'Catchy hooks and polished production elements for radio-ready tracks',
    'techno': 'Driving rhythms and hypnotic sequences for the underground scene',
  };

  // Generate content based on skill level
  const contentCounts = {
    'beginner': { loops: 8, oneShots: 12, midi: 4 },
    'intermediate': { loops: 12, oneShots: 18, midi: 6 },
    'pro': { loops: 16, oneShots: 24, midi: 8 },
  };

  const counts = contentCounts[skillLevel];

  // Generate loops
  const loopTypes = {
    'hip-hop': ['Boom Bap Loop', 'Trap Loop', 'Lo-Fi Loop', 'Jazz Loop', 'Soul Loop'],
    'house': ['Deep House Loop', 'Tech House Loop', 'Funky Loop', 'Acid Loop', 'Progressive Loop'],
    'trap': ['808 Loop', 'Melody Loop', 'Arpeggiated Loop', 'Vocal Chop Loop', 'Ambient Loop'],
    'ambient': ['Pad Loop', 'Texture Loop', 'Drone Loop', 'Evolving Loop', 'Atmospheric Loop'],
    'pop': ['Verse Loop', 'Chorus Loop', 'Bridge Loop', 'Intro Loop', 'Outro Loop'],
    'techno': ['Kick Loop', 'Percussion Loop', 'Synth Loop', 'Acid Loop', 'Industrial Loop'],
  };

  const loops = [];
  for (let i = 0; i < counts.loops; i++) {
    const type = loopTypes[genre][i % loopTypes[genre].length];
    const bpm = getBpmForGenre(genre);
    loops.push(`${type} ${bpm}bpm_${String(i + 1).padStart(2, '0')}.wav`);
  }

  // Generate one-shots
  const oneShotTypes = {
    'hip-hop': ['Kick', 'Snare', '808', 'Hi-Hat', 'Open Hat', 'Crash', 'Vocal Chop'],
    'house': ['Kick', 'Clap', 'Hi-Hat', 'Perc', 'Vocal', 'FX', 'Stab'],
    'trap': ['808', 'Kick', 'Snare', 'Hi-Hat', 'Vocal Tag', 'Riser', 'Impact'],
    'ambient': ['Pad', 'Texture', 'Bell', 'Drone', 'Vocal', 'Nature', 'Reverse'],
    'pop': ['Kick', 'Snare', 'Clap', 'Vocal', 'Guitar', 'Synth', 'Perc'],
    'techno': ['Kick', 'Perc', 'Synth', 'Acid', 'Vocal', 'FX', 'Noise'],
  };

  const oneShots = [];
  for (let i = 0; i < counts.oneShots; i++) {
    const type = oneShotTypes[genre][i % oneShotTypes[genre].length];
    const num = Math.floor(i / oneShotTypes[genre].length) + 1;
    oneShots.push(`${type}_${String(num).padStart(2, '0')}.wav`);
  }

  // Generate MIDI files
  const midiTypes = {
    'hip-hop': ['Melody', 'Chord', 'Bass', 'Arp'],
    'house': ['Chord', 'Bass', 'Lead', 'Arp'],
    'trap': ['Melody', 'Chord', 'Bass', 'Arp'],
    'ambient': ['Pad', 'Texture', 'Melody', 'Evolving'],
    'pop': ['Chord', 'Melody', 'Bass', 'Lead'],
    'techno': ['Bass', 'Lead', 'Arp', 'Sequence'],
  };

  const midi = [];
  for (let i = 0; i < counts.midi; i++) {
    const type = midiTypes[genre][i % midiTypes[genre].length];
    midi.push(`${type}_${String(i + 1).padStart(2, '0')}.mid`);
  }

  const pack = {
    name: packName,
    description: descriptions[genre],
    genre,
    mood,
    skillLevel,
    daw: daw || 'any',
    loops,
    oneShots,
    midi,
    totalFiles: loops.length + oneShots.length + midi.length,
    createdAt: new Date().toISOString(),
  };

  // Add audio samples to the pack
  pack.audioSamples = generateAudioSamples(pack);

  return pack;
};

const getBpmForGenre = (genre) => {
  const bpmRanges = {
    'hip-hop': [85, 95],
    'house': [120, 130],
    'trap': [140, 150],
    'ambient': [60, 80],
    'pop': [100, 120],
    'techno': [125, 135],
  };

  const [min, max] = bpmRanges[genre];
  return Math.floor(Math.random() * (max - min + 1)) + min;
};