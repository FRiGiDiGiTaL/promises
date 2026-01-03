import React from 'react';
import { X, Shield, Lock, Trash2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearData: () => void;
  promiseCount: number;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  onClearData,
  promiseCount 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-sm sm:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-neutral-800">
          <h2 className="text-lg font-semibold">About & Settings</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
            aria-label="Close settings"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto max-h-[80vh]">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-1">About</h3>
            <p className="text-base leading-relaxed text-gray-700 dark:text-neutral-300">
              <span className="font-semibold">Forgotten Promises</span> is a private, offline-first personal record of commitments. All data stays on your device—no cloud, no tracking, no sharing.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">Privacy</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-neutral-400">
              <li className="flex items-start space-x-2">
                <Lock className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                <span>All data is stored locally in your browser</span>
              </li>
              <li className="flex items-start space-x-2">
                <Lock className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                <span>No data is sent to any server</span>
              </li>
              <li className="flex items-start space-x-2">
                <Lock className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                <span>No accounts, logins, or analytics</span>
              </li>
              <li className="flex items-start space-x-2">
                <Lock className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                <span>You control all your data entirely</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-1">Your Data</h3>
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-2xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-neutral-400">Total Promises</span>
                <span className="text-2xl font-bold">{promiseCount}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-neutral-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-500 px-1">Danger Zone</h3>
            <button
              onClick={onClearData}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors font-medium"
              aria-label="Clear all data"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Data</span>
            </button>
            <p className="text-xs text-gray-500 dark:text-neutral-500">
              This will permanently delete all {promiseCount} promise{promiseCount !== 1 ? 's' : ''} and cannot be undone.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-neutral-800">
            <p className="text-xs text-gray-400 dark:text-neutral-600 text-center">
              Version 1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;