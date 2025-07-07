import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { generatePack } from '../utils/packGenerator';

const { FiPlay, FiZap, FiTarget, FiTrendingUp, FiSettings } = FiIcons;

const PackGenerator = ({ onPackGenerated }) => {
  const [selections, setSelections] = useState({
    genre: '',
    mood: '',
    skillLevel: '',
    daw: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const genres = [
    { id: 'hip-hop', name: 'Hip-Hop', color: 'from-red-500 to-orange-500', description: 'Beats that hit hard' },
    { id: 'house', name: 'House', color: 'from-blue-500 to-purple-500', description: 'Four-on-the-floor energy' },
    { id: 'trap', name: 'Trap', color: 'from-purple-500 to-pink-500', description: 'Heavy 808s and hi-hats' },
    { id: 'ambient', name: 'Ambient', color: 'from-teal-500 to-cyan-500', description: 'Atmospheric textures' },
    { id: 'pop', name: 'Pop', color: 'from-pink-500 to-red-500', description: 'Radio-ready hooks' },
    { id: 'techno', name: 'Techno', color: 'from-gray-500 to-blue-500', description: 'Driving rhythms' },
  ];

  const moods = [
    { id: 'dark', name: 'Dark', emoji: '🌑', description: 'Mysterious and brooding' },
    { id: 'uplifting', name: 'Uplifting', emoji: '☀️', description: 'Bright and energetic' },
    { id: 'chill', name: 'Chill', emoji: '🌊', description: 'Relaxed and smooth' },
    { id: 'aggressive', name: 'Aggressive', emoji: '⚡', description: 'Intense and powerful' },
    { id: 'cinematic', name: 'Cinematic', emoji: '🎬', description: 'Epic and dramatic' },
    { id: 'zen', name: 'Zen', emoji: '🧘', description: 'Peaceful and meditative' },
  ];

  const skillLevels = [
    { id: 'beginner', name: 'Beginner', description: 'Simple, ready-to-use elements', icon: FiPlay },
    { id: 'intermediate', name: 'Intermediate', description: 'More complex arrangements', icon: FiTarget },
    { id: 'pro', name: 'Pro', description: 'Advanced stems and layers', icon: FiTrendingUp },
  ];

  const daws = [
    { id: 'ableton', name: 'Ableton Live' },
    { id: 'logic', name: 'Logic Pro' },
    { id: 'fl-studio', name: 'FL Studio' },
    { id: 'cubase', name: 'Cubase' },
    { id: 'pro-tools', name: 'Pro Tools' },
    { id: 'reason', name: 'Reason' },
    { id: 'any', name: 'Any DAW' },
  ];

  const handleSelection = (category, value) => {
    setSelections(prev => ({ ...prev, [category]: value }));
  };

  const handleGenerate = async () => {
    if (!selections.genre || !selections.mood || !selections.skillLevel) {
      return;
    }

    setIsGenerating(true);
    
    // Simulate generation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const pack = generatePack(selections);
    onPackGenerated(pack);
    setIsGenerating(false);
  };

  const isComplete = selections.genre && selections.mood && selections.skillLevel;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-5xl font-ninja font-bold bg-gradient-to-r from-ninja-accent via-ninja-gold to-ninja-accent bg-clip-text text-transparent">
          Craft Your Perfect Pack
        </h2>
        <p className="text-xl text-gray-300 font-zen max-w-2xl mx-auto">
          Enter the sonic dojo and forge a sample pack that matches your creative vision
        </p>
      </motion.div>

      {/* Genre Selection */}
      <motion.section 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h3 className="text-2xl font-ninja font-semibold text-ninja-gold">Choose Your Genre</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {genres.map((genre) => (
            <motion.button
              key={genre.id}
              onClick={() => handleSelection('genre', genre.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                selections.genre === genre.id
                  ? 'border-ninja-accent bg-ninja-accent/20 shadow-lg'
                  : 'border-ninja-zen/50 hover:border-ninja-zen bg-ninja-zen/20'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-full h-20 rounded-lg bg-gradient-to-r ${genre.color} mb-4 opacity-80`} />
              <h4 className="text-lg font-ninja font-semibold text-white mb-2">{genre.name}</h4>
              <p className="text-sm text-gray-400">{genre.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Mood Selection */}
      <motion.section 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3 className="text-2xl font-ninja font-semibold text-ninja-gold">Set the Mood</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {moods.map((mood) => (
            <motion.button
              key={mood.id}
              onClick={() => handleSelection('mood', mood.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                selections.mood === mood.id
                  ? 'border-ninja-accent bg-ninja-accent/20 shadow-lg'
                  : 'border-ninja-zen/50 hover:border-ninja-zen bg-ninja-zen/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-3xl mb-2">{mood.emoji}</div>
              <h4 className="font-ninja font-medium text-white mb-1">{mood.name}</h4>
              <p className="text-xs text-gray-400">{mood.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Skill Level Selection */}
      <motion.section 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h3 className="text-2xl font-ninja font-semibold text-ninja-gold">Your Skill Level</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skillLevels.map((level) => (
            <motion.button
              key={level.id}
              onClick={() => handleSelection('skillLevel', level.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                selections.skillLevel === level.id
                  ? 'border-ninja-accent bg-ninja-accent/20 shadow-lg'
                  : 'border-ninja-zen/50 hover:border-ninja-zen bg-ninja-zen/20'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SafeIcon icon={level.icon} className="text-3xl text-ninja-gold mb-4 mx-auto" />
              <h4 className="text-lg font-ninja font-semibold text-white mb-2">{level.name}</h4>
              <p className="text-sm text-gray-400">{level.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* DAW Selection (Optional) */}
      <motion.section 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-2xl font-ninja font-semibold text-ninja-gold">
          DAW Preference <span className="text-sm text-gray-400 font-zen">(Optional)</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {daws.map((daw) => (
            <motion.button
              key={daw.id}
              onClick={() => handleSelection('daw', daw.id)}
              className={`p-3 rounded-lg border transition-all duration-300 text-sm ${
                selections.daw === daw.id
                  ? 'border-ninja-accent bg-ninja-accent/20 text-white'
                  : 'border-ninja-zen/50 hover:border-ninja-zen bg-ninja-zen/20 text-gray-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {daw.name}
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Generate Button */}
      <motion.div 
        className="text-center pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <motion.button
          onClick={handleGenerate}
          disabled={!isComplete || isGenerating}
          className={`px-12 py-4 rounded-xl font-ninja font-bold text-lg transition-all duration-300 ${
            isComplete && !isGenerating
              ? 'bg-gradient-to-r from-ninja-accent to-ninja-gold text-white shadow-lg hover:shadow-xl'
              : 'bg-ninja-zen/50 text-gray-500 cursor-not-allowed'
          }`}
          whileHover={isComplete && !isGenerating ? { scale: 1.05 } : {}}
          whileTap={isComplete && !isGenerating ? { scale: 0.95 } : {}}
        >
          <div className="flex items-center space-x-3">
            {isGenerating ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Forging Your Pack...</span>
              </>
            ) : (
              <>
                <SafeIcon icon={FiZap} className="text-xl" />
                <span>Generate Pack</span>
              </>
            )}
          </div>
        </motion.button>
        
        {!isComplete && (
          <p className="text-sm text-gray-500 mt-3 font-zen">
            Complete your selections to generate your pack
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default PackGenerator;