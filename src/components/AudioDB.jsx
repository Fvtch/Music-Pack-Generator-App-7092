import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUpload, FiDatabase, FiFolder, FiMusic, FiTarget, FiDisc, FiCheck, FiX } = FiIcons;

const AudioDB = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const tabs = [
    { id: 'upload', label: 'Upload Samples', icon: FiUpload },
    { id: 'manage', label: 'Manage Library', icon: FiDatabase },
  ];

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    setIsUploading(true);
    setUploadStatus('Preparing files...');
    setUploadProgress(0);

    const uploadedList = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const extension = file.name.split('.').pop();
        const isAudio = ['wav', 'mp3', 'aiff', 'ogg', 'flac'].includes(extension.toLowerCase());
        const isMidi = ['mid', 'midi'].includes(extension.toLowerCase());

        if (!isAudio && !isMidi) continue;

        // Determine category based on file name and type
        let category = 'oneshots';
        if (file.name.toLowerCase().includes('loop')) {
          category = 'loops';
        } else if (isMidi) {
          category = 'midi';
        }

        // Simulate upload process
        uploadedList.push({
          name: file.name,
          path: `demo_${Date.now()}_${file.name}`,
          category,
          size: file.size,
          type: file.type,
        });

        // Update progress
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
        setUploadStatus(`Processing file ${i + 1} of ${files.length}...`);

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setUploadedFiles(prev => [...prev, ...uploadedList]);
      setUploadStatus('Upload complete!');

      // Reset after 3 seconds
      setTimeout(() => {
        setUploadProgress(0);
        setUploadStatus('');
        setIsUploading(false);
      }, 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Error processing files');
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-ninja-darker w-full max-w-4xl rounded-2xl border border-ninja-zen/50 shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        {/* Header */}
        <div className="border-b border-ninja-zen/30 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-ninja font-bold text-white flex items-center">
              <SafeIcon icon={FiMusic} className="text-ninja-accent mr-3" />
              <span>Sample Library Manager</span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <SafeIcon icon={FiX} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-ninja-zen/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-zen transition-colors ${
                activeTab === tab.id
                  ? 'text-ninja-accent border-b-2 border-ninja-accent'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <SafeIcon icon={tab.icon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-300 mb-4">
                  Upload your audio samples to use in your generated packs
                </p>
                <motion.label
                  className="block w-full p-8 border-2 border-dashed border-ninja-zen/50 rounded-xl cursor-pointer hover:border-ninja-accent/50 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="text-center">
                    <SafeIcon icon={FiUpload} className="text-4xl text-ninja-gold mx-auto mb-4" />
                    <p className="text-lg font-ninja font-medium text-white mb-2">
                      Drag & drop files or click to browse
                    </p>
                    <p className="text-sm text-gray-400">
                      Supported formats: WAV, MP3, AIFF, MIDI
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".wav,.mp3,.aiff,.mid,.midi,.flac,.ogg"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </div>
                </motion.label>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="mt-6 space-y-3">
                    <p className="text-sm text-gray-300">{uploadStatus}</p>
                    <div className="w-full bg-ninja-zen/30 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-ninja-accent to-ninja-gold h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Uploads */}
              {uploadedFiles.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-ninja font-semibold text-white mb-4">Recent Uploads</h3>
                  <div className="bg-ninja-zen/10 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-ninja-dark/50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <SafeIcon
                              icon={
                                file.category === 'loops'
                                  ? FiMusic
                                  : file.category === 'oneshots'
                                  ? FiTarget
                                  : FiDisc
                              }
                              className="text-ninja-gold"
                            />
                            <div>
                              <p className="text-sm text-white">{file.name}</p>
                              <p className="text-xs text-gray-400 capitalize">{file.category}</p>
                            </div>
                          </div>
                          <SafeIcon icon={FiCheck} className="text-green-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'manage' && (
            <div>
              <div className="text-center py-8">
                <SafeIcon icon={FiFolder} className="text-4xl text-ninja-zen/50 mx-auto mb-4" />
                <h3 className="text-xl font-ninja font-semibold text-gray-400 mb-2">
                  Sample Library Management
                </h3>
                <p className="text-gray-500 font-zen">
                  This feature is available in the full version
                </p>
                <p className="text-gray-400 mt-4">
                  Demo mode: Using built-in sample library
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-ninja-zen/30 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-ninja-zen/30 text-white font-ninja rounded-lg hover:bg-ninja-zen/50 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AudioDB;