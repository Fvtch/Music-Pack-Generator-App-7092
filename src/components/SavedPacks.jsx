import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { playAudio, stopAllAudio, downloadPack, initAudio } from '../utils/audioManager';

const { FiDownload, FiTrash2, FiArrowLeft, FiMusic, FiCalendar, FiPlay, FiX, FiPause } = FiIcons;

const SavedPacks = ({ packs, onDeletePack, onBackToGenerator }) => {
  const [playingItem, setPlayingItem] = useState(null);
  const [downloadingPack, setDownloadingPack] = useState(null);

  // Initialize audio on first interaction
  React.useEffect(() => {
    initAudio();
    
    return () => {
      stopAllAudio();
    };
  }, []);

  const handlePlayAudio = async (pack, sampleName, category) => {
    // If clicking the same item that's already playing, stop it
    if (
      playingItem &&
      playingItem.packId === pack.id &&
      playingItem.name === sampleName &&
      playingItem.category === category
    ) {
      stopAllAudio();
      setPlayingItem(null);
      return;
    }

    // Get the appropriate sample from pack audio samples
    const sample = pack.audioSamples[category].find(s => s.name === sampleName);
    if (!sample) {
      console.error('Sample not found:', sampleName, category);
      return;
    }

    // Play the audio
    const controller = await playAudio(sample);
    if (controller && controller.id) {
      setPlayingItem({
        packId: pack.id,
        name: sampleName,
        category,
        id: controller.id
      });
    } else {
      setPlayingItem(null);
    }
  };

  const isPlaying = (packId, sampleName, category) => {
    return (
      playingItem &&
      playingItem.packId === packId &&
      playingItem.name === sampleName &&
      playingItem.category === category
    );
  };

  const handleDownload = async (pack) => {
    setDownloadingPack(pack.id);
    try {
      await downloadPack(pack);
      setTimeout(() => setDownloadingPack(null), 1000);
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadingPack(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Preview a sample from the pack (first loop, oneshot, or midi)
  const previewPack = (pack) => {
    // If already playing from this pack, stop it
    if (playingItem && playingItem.packId === pack.id) {
      stopAllAudio();
      setPlayingItem(null);
      return;
    }
    
    let sampleToPlay;
    let category;

    if (pack.audioSamples?.loops?.length > 0) {
      sampleToPlay = pack.loops[0];
      category = 'loops';
    } else if (pack.audioSamples?.oneShots?.length > 0) {
      sampleToPlay = pack.oneShots[0];
      category = 'oneShots';
    } else if (pack.audioSamples?.midi?.length > 0) {
      sampleToPlay = pack.midi[0];
      category = 'midi';
    }

    if (sampleToPlay) {
      handlePlayAudio(pack, sampleToPlay, category);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
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
          Your Saved Packs
        </h2>
        <p className="text-lg text-gray-300 font-zen">
          {packs.length > 0
            ? `${packs.length} pack${packs.length !== 1 ? 's' : ''} in your sonic arsenal`
            : 'No packs saved yet'}
        </p>
      </motion.div>

      {/* Packs Grid */}
      {packs.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {packs.map((pack, index) => (
            <motion.div
              key={pack.id}
              className="bg-ninja-zen/20 rounded-xl p-6 border border-ninja-zen/30 hover:border-ninja-accent/50 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="space-y-4">
                {/* Pack Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => previewPack(pack)}
                      className="w-8 h-8 rounded-full bg-ninja-accent/20 flex items-center justify-center hover:bg-ninja-accent/40 transition-colors"
                    >
                      <SafeIcon
                        icon={playingItem && playingItem.packId === pack.id ? FiPause : FiPlay}
                        className="text-ninja-accent"
                      />
                    </button>
                    <div>
                      <h3 className="text-lg font-ninja font-semibold text-white">{pack.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <SafeIcon icon={FiCalendar} className="text-xs" />
                        <span>{formatDate(pack.savedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeletePack(pack.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="text-lg" />
                  </button>
                </div>

                {/* Pack Description */}
                <p className="text-sm text-gray-300 font-zen">{pack.description}</p>

                {/* Pack Details */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-ninja-dark/50 rounded-lg p-3">
                    <h4 className="text-xs font-ninja font-semibold text-ninja-gold mb-1">Genre</h4>
                    <p className="text-sm text-white capitalize">{pack.genre}</p>
                  </div>
                  <div className="bg-ninja-dark/50 rounded-lg p-3">
                    <h4 className="text-xs font-ninja font-semibold text-ninja-gold mb-1">Mood</h4>
                    <p className="text-sm text-white capitalize">{pack.mood}</p>
                  </div>
                </div>

                {/* Sample Preview */}
                <div className="bg-ninja-dark/30 rounded-lg p-3">
                  <h4 className="text-xs font-ninja font-semibold text-ninja-gold mb-2">Preview Samples</h4>
                  <div className="flex flex-wrap gap-2">
                    {pack.loops.slice(0, 3).map((sample, idx) => (
                      <button
                        key={`loop-${idx}`}
                        onClick={() => handlePlayAudio(pack, sample, 'loops')}
                        className={`px-2 py-1 text-xs rounded ${
                          isPlaying(pack.id, sample, 'loops')
                            ? 'bg-ninja-accent text-white'
                            : 'bg-ninja-dark/50 text-gray-300 hover:bg-ninja-dark'
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          <SafeIcon
                            icon={isPlaying(pack.id, sample, 'loops') ? FiPause : FiPlay}
                            className="text-xs"
                          />
                          <span>Loop {idx + 1}</span>
                        </div>
                      </button>
                    ))}
                    {pack.oneShots.slice(0, 2).map((sample, idx) => (
                      <button
                        key={`oneshot-${idx}`}
                        onClick={() => handlePlayAudio(pack, sample, 'oneShots')}
                        className={`px-2 py-1 text-xs rounded ${
                          isPlaying(pack.id, sample, 'oneShots')
                            ? 'bg-ninja-accent text-white'
                            : 'bg-ninja-dark/50 text-gray-300 hover:bg-ninja-dark'
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          <SafeIcon
                            icon={isPlaying(pack.id, sample, 'oneShots') ? FiPause : FiPlay}
                            className="text-xs"
                          />
                          <span>Shot {idx + 1}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pack Stats */}
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{pack.loops.length} Loops</span>
                  <span>{pack.oneShots.length} One-shots</span>
                  <span>{pack.midi.length} MIDI</span>
                </div>

                {/* Download Button */}
                <motion.button
                  onClick={() => handleDownload(pack)}
                  disabled={downloadingPack === pack.id}
                  className="w-full px-4 py-3 bg-gradient-to-r from-ninja-accent to-ninja-gold text-white font-ninja font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {downloadingPack === pack.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <SafeIcon icon={FiDownload} className="text-lg" />
                        <span>Download</span>
                      </>
                    )}
                  </div>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <SafeIcon icon={FiMusic} className="text-6xl text-ninja-zen/50 mx-auto mb-4" />
          <h3 className="text-xl font-ninja font-semibold text-gray-400 mb-2">No packs saved yet</h3>
          <p className="text-gray-500 font-zen mb-6">Generate your first pack to start building your collection</p>
          <motion.button
            onClick={onBackToGenerator}
            className="px-6 py-3 bg-gradient-to-r from-ninja-accent to-ninja-gold text-white font-ninja font-bold rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Your First Pack
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default SavedPacks;