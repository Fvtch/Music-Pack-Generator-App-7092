import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMusic, FiFolder, FiSettings, FiZap } = FiIcons;

const Header = ({ currentView, setCurrentView, savedPacksCount }) => {
  const navItems = [
    { id: 'generator', label: 'Generator', icon: FiZap },
    { id: 'saved', label: 'Saved Packs', icon: FiFolder, count: savedPacksCount },
  ];

  return (
    <header className="border-b border-ninja-zen/30 bg-ninja-darker/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-ninja-accent to-ninja-gold rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiMusic} className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-ninja font-bold bg-gradient-to-r from-ninja-accent to-ninja-gold bg-clip-text text-transparent">
                Music Production Ninja
              </h1>
              <p className="text-sm text-gray-400 font-zen">Sonic Dojo • Sample Pack Generator</p>
            </div>
          </motion.div>

          <nav className="flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`px-4 py-2 rounded-lg font-zen font-medium transition-all duration-200 relative ${
                  currentView === item.id
                    ? 'bg-ninja-accent text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-ninja-zen/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={item.icon} className="text-lg" />
                  <span>{item.label}</span>
                  {item.count > 0 && (
                    <span className="bg-ninja-gold text-ninja-dark text-xs px-2 py-1 rounded-full font-bold">
                      {item.count}
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;