import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestProvider } from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';
import Header from './components/Header';
import PackGenerator from './components/PackGenerator';
import GeneratedPack from './components/GeneratedPack';
import SavedPacks from './components/SavedPacks';
import AudioDB from './components/AudioDB';
import FeedbackButton from './components/FeedbackButton';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './common/SafeIcon';
import questConfig from './config/questConfig';
import './App.css';

const { FiDatabase } = FiIcons;

function App() {
  const [currentView, setCurrentView] = useState('generator');
  const [generatedPack, setGeneratedPack] = useState(null);
  const [savedPacks, setSavedPacks] = useState([]);
  const [showAudioDB, setShowAudioDB] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Load saved packs from local storage on initial load
  useEffect(() => {
    const savedPacksData = localStorage.getItem('ninja-saved-packs');
    if (savedPacksData) {
      try {
        setSavedPacks(JSON.parse(savedPacksData));
      } catch (e) {
        console.error('Error loading saved packs:', e);
      }
    }
  }, []);

  // Save packs to local storage when they change
  useEffect(() => {
    if (savedPacks.length > 0) {
      localStorage.setItem('ninja-saved-packs', JSON.stringify(savedPacks));
    }
  }, [savedPacks]);

  const handlePackGenerated = (pack) => {
    setGeneratedPack(pack);
    setCurrentView('result');
  };

  const handleSavePack = (pack) => {
    const packWithId = {
      ...pack,
      id: Date.now(),
      savedAt: new Date().toISOString()
    };
    setSavedPacks(prev => [packWithId, ...prev]);
  };

  const handleDeletePack = (packId) => {
    setSavedPacks(prev => prev.filter(pack => pack.id !== packId));
    const updatedPacks = savedPacks.filter(pack => pack.id !== packId);
    localStorage.setItem('ninja-saved-packs', JSON.stringify(updatedPacks));
  };

  const handleConnectSupabase = () => {
    setShowAudioDB(true);
  };

  return (
    <QuestProvider
      apiKey={questConfig.APIKEY}
      entityId={questConfig.ENTITYID}
      apiType="PRODUCTION"
    >
      <div className="min-h-screen bg-gradient-to-br from-ninja-darker via-ninja-dark to-ninja-zen">
        <Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          savedPacksCount={savedPacks.length}
        />
        
        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {currentView === 'generator' && (
              <motion.div
                key="generator"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PackGenerator onPackGenerated={handlePackGenerated} />
              </motion.div>
            )}
            {currentView === 'result' && generatedPack && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GeneratedPack
                  pack={generatedPack}
                  onSave={handleSavePack}
                  onBackToGenerator={() => setCurrentView('generator')}
                />
              </motion.div>
            )}
            {currentView === 'saved' && (
              <motion.div
                key="saved"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SavedPacks
                  packs={savedPacks}
                  onDeletePack={handleDeletePack}
                  onBackToGenerator={() => setCurrentView('generator')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Floating Supabase Connect Button */}
        <motion.button
          onClick={handleConnectSupabase}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-ninja-accent to-ninja-gold p-3 rounded-full shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Connect Audio Library"
        >
          <SafeIcon icon={FiDatabase} className="text-white text-xl" />
        </motion.button>

        {/* Feedback Button */}
        <FeedbackButton />

        {/* Audio Library Manager Modal */}
        <AnimatePresence>
          {showAudioDB && <AudioDB onClose={() => setShowAudioDB(false)} />}
        </AnimatePresence>
      </div>
    </QuestProvider>
  );
}

export default App;