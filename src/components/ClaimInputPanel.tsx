import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Globe, Send, AlertCircle } from 'lucide-react';

interface ClaimInputPanelProps {
  onSubmit: (claim: string, urls: string[]) => void;
  disabled: boolean;
}

export default function ClaimInputPanel({ onSubmit, disabled }: ClaimInputPanelProps) {
  const [claim, setClaim] = useState('');
  const [urls, setUrls] = useState<string[]>(['']);
  const [error, setError] = useState('');

  const addUrl = () => {
    if (urls.length < 3) {
      setUrls([...urls, '']);
    }
  };

  const removeUrl = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    if (newUrls.length === 0) setUrls(['']);
    else setUrls(newUrls);
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!claim.trim()) {
      setError('Please enter a claim to verify.');
      return;
    }

    const validUrls = urls.filter(u => u.trim() !== '');
    if (validUrls.length === 0) {
      setError('Please provide at least one evidence URL.');
      return;
    }

    // Validate URL formats roughly
    const invalidFormat = validUrls.find(u => !u.startsWith('http://') && !u.startsWith('https://'));
    if (invalidFormat) {
      setError('URLs must start with http:// or https://');
      return;
    }

    onSubmit(claim.trim(), validUrls);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl dark:shadow-2xl dark:shadow-blue-900/10"
    >
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
        <Globe className="w-5 h-5 mr-3 text-indigo-500 dark:text-blue-400" />
        Submit Claim for Verification
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            The Claim
          </label>
          <textarea
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            disabled={disabled}
            placeholder="e.g., SpaceX caught the Super Heavy booster on flight 5."
            className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50 min-h-[100px] resize-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Evidence URLs (Max 3)
            </label>
            <button
              type="button"
              onClick={addUrl}
              disabled={disabled || urls.length >= 3}
              className="text-xs font-medium text-indigo-600 dark:text-blue-400 flex items-center hover:text-indigo-700 dark:hover:text-blue-300 disabled:opacity-50 transition-colors"
            >
              <Plus className="w-3 h-3 mr-1" /> Add URL
            </button>
          </div>
          <div className="space-y-3">
            <AnimatePresence>
              {urls.map((url, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateUrl(index, e.target.value)}
                    disabled={disabled}
                    placeholder="https://..."
                    className="flex-1 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 outline-none transition-all disabled:opacity-50 text-sm"
                  />
                  {urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUrl(index)}
                      disabled={disabled}
                      className="p-3 text-gray-400 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-50 transition-colors bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-900/50"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={disabled}
          className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Submit to WebSeal</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </motion.div>
  );
}
