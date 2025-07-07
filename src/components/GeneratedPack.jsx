import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { playAudio, stopAllAudio, downloadPack, initAudio } from '../utils/audioManager';

const { FiDownload, FiSave, FiArrowLeft, FiPlay, FiMusic, FiDisc, FiTarget, FiCheck, FiX, FiPause } = FiIcons;

const GeneratedPack = ({ pack, onSave, onBackToGenerator }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [playingItem, setPlayingItem] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Initialize audio on first render
  useEffect(() => {
    initAudio();
    
    // Cleanup audio on component unmount
    return () => {
      stopAllAudio();
    };
  }, []);

  const handleSave = () => {
    onSave(pack);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadPack(pack);
      // Show success message
      setTimeout(() => setIsDownloading(false), 1000);
    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
    }
  };

  const handlePlayAudio = async (item, category) => {
    // If clicking the same item that's already playing, stop it
    if (playingItem && playingItem.name === item && playingItem.category === category) {
      stopAllAudio();
      setPlayingItem(null);
      return;
    }

    // Get the appropriate sample from pack audio samples
    const sample = pack.audioSamples[category].find(s => s.name === item);
    if (!sample) {
      console.error('Sample not found:', item, category);
      return;
    }

    // Play the audio
    const controller = await playAudio(sample);
    if (controller && controller.id) {
      setPlayingItem({ name: item, category, id: controller.id });
    } else {
      setPlayingItem(null);
    }
  };

  const isPlaying = (item, category) => {
    return playingItem && playingItem.name === item && playingItem.category === category;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.button
          onClick={() => {
            stopAllAudio();
            onBackToGenerator();
          }}
          className="inline-flex items-center space-x-2 text-ninja-gold hover:text-ninja-accent transition-colors"
          whileHover={{ x: -5 }}
        >
          <SafeIcon icon={FiArrowLeft} />
          <span>Back to Generator</span>
        </motion.button>
        
        <h2 className="text-4xl font-ninja font-bold bg-gradient-to-r from-ninja-accent to-ninja-gold bg-clip-text text-transparent">
          {pack.name}
        </h2>
        <p className="text-lg text-gray-300 font-zen max-w-2xl mx-auto">
          {pack.description}
        </p>
      </motion.div>

      {/* Pack Info */}
      <motion.div
        className="bg-ninja-zen/30 rounded-xl p-6 border border-ninja-zen/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <h4 className="font-ninja font-semibold text-ninja-gold mb-1">Genre</h4>
            <p className="text-white capitalize">{pack.genre}</p>
          </div>
          <div>
            <h4 className="font-ninja font-semibold text-ninja-gold mb-1">Mood</h4>
            <p className="text-white capitalize">{pack.mood}</p>
          </div>
          <div>
            <h4 className="font-ninja font-semibold text-ninja-gold mb-1">Skill Level</h4>
            <p className="text-white capitalize">{pack.skillLevel}</p>
          </div>
          <div>
            <h4 className="font-ninja font-semibold text-ninja-gold mb-1">Total Files</h4>
            <p className="text-white">{pack.totalFiles}</p>
          </div>
        </div>
      </motion.div>

      {/* Pack Contents */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Loops */}
        <div className="bg-ninja-zen/20 rounded-xl p-6 border border-ninja-zen/30">
          <div className="flex items-center space-x-3 mb-4">
            <SafeIcon icon={FiMusic} className="text-2xl text-ninja-accent" />
            <h3 className="text-xl font-ninja font-semibold text-white">Loops</h3>
          </div>
          <div className="space-y-2">
            {pack.loops.map((loop, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-3 bg-ninja-dark/50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <span className="text-sm font-zen text-gray-300">{loop}</span>
                <button
                  onClick={() => handlePlayAudio(loop, 'loops')}
                  className={`${
                    isPlaying(loop, 'loops')
                      ? 'text-ninja-accent'
                      : 'text-ninja-gold hover:text-ninja-accent'
                  } transition-colors`}
                >
                  <SafeIcon
                    icon={isPlaying(loop, 'loops') ? FiPause : FiPlay}
                    className="text-sm"
                  />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* One-shots */}
        <div className="bg-ninja-zen/20 rounded-xl p-6 border border-ninja-zen/30">
          <div className="flex items-center space-x-3 mb-4">
            <SafeIcon icon={FiTarget} className="text-2xl text-ninja-gold" />
            <h3 className="text-xl font-ninja font-semibold text-white">One-shots</h3>
          </div>
          <div className="space-y-2">
            {pack.oneShots.map((shot, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-3 bg-ninja-dark/50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <span className="text-sm font-zen text-gray-300">{shot}</span>
                <button
                  onClick={() => handlePlayAudio(shot, 'oneShots')}
                  className={`${
                    isPlaying(shot, 'oneShots')
                      ? 'text-ninja-accent'
                      : 'text-ninja-gold hover:text-ninja-accent'
                  } transition-colors`}
                >
                  <SafeIcon
                    icon={isPlaying(shot, 'oneShots') ? FiPause : FiPlay}
                    className="text-sm"
                  />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* MIDI */}
        <div className="bg-ninja-zen/20 rounded-xl p-6 border border-ninja-zen/30">
          <div className="flex items-center space-x-3 mb-4">
            <SafeIcon icon={FiDisc} className="text-2xl text-ninja-focus" />
            <h3 className="text-xl font-ninja font-semibold text-white">MIDI</h3>
          </div>
          <div className="space-y-2">
            {pack.midi.map((midi, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-3 bg-ninja-dark/50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <span className="text-sm font-zen text-gray-300">{midi}</span>
                <button
                  onClick={() => handlePlayAudio(midi, 'midi')}
                  className={`${
                    isPlaying(midi, 'midi')
                      ? 'text-ninja-accent'
                      : 'text-ninja-gold hover:text-ninja-accent'
                  } transition-colors`}
                >
                  <SafeIcon
                    icon={isPlaying(midi, 'midi') ? FiPause : FiPlay}
                    className="text-sm"
                  />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <motion.button
          onClick={handleDownload}
          disabled={isDownloading}
          className="px-8 py-4 bg-gradient-to-r from-ninja-accent to-ninja-gold text-white font-ninja font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center space-x-3">
            {isDownloading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <SafeIcon icon={FiDownload} className="text-xl" />
                <span>Download Pack</span>
              </>
            )}
          </div>
        </motion.button>

        <motion.button
          onClick={handleSave}
          className={`px-8 py-4 border-2 font-ninja font-bold rounded-xl transition-all duration-300 ${
            isSaved
              ? 'border-green-500 bg-green-500/20 text-green-400'
              : 'border-ninja-zen hover:border-ninja-accent text-ninja-zen hover:text-ninja-accent'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center space-x-3">
            <SafeIcon icon={isSaved ? FiCheck : FiSave} className="text-xl" />
            <span>{isSaved ? 'Saved!' : 'Save to Library'}</span>
          </div>
        </motion.button>
      </motion.div>

      {/* Demo Notice */}
      <motion.div
        className="bg-ninja-zen/20 rounded-lg p-4 border border-ninja-zen/30 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p className="text-sm text-gray-400 font-zen">
          🎵 <strong>Demo Mode:</strong> Audio samples are synthetically generated for demonstration. 
          In the full version, you'll get high-quality WAV/AIFF files, MIDI sequences, and project files.
        </p>
      </motion.div>
    </div>
  );
};

export default GeneratedPack;