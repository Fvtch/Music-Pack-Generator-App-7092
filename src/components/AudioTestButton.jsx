import React from 'react';
import { motion } from 'framer-motion';
import audioPlayer from '../utils/audioPlayer';

const AudioTestButton = () => {
  const testAudio = async () => {
    console.log('🔧 Testing audio with real MP3 file...');
    
    // Initialize the audio player
    audioPlayer.init();
    
    // Try to play an actual audio file
    try {
      // Try to play a real sample from the project
      const controller = await audioPlayer.playSound('/audio/demo-samples/hip-hop/loops/boom-bap-90.mp3');
      
      if (controller) {
        console.log('✅ Audio test successful!');
        
        // Stop the sound after 2 seconds
        setTimeout(() => {
          controller.stop();
        }, 2000);
      } else {
        console.log('❌ Audio test failed - no controller returned');
      }
    } catch (error) {
      console.error('❌ Audio test error:', error);
    }
  };

  return (
    <motion.button
      onClick={testAudio}
      className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg z-50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      🔊 Test Audio
    </motion.button>
  );
};

export default AudioTestButton;