
import React from 'react';
import { Shield, Clock, Heart, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-black flex flex-col items-center justify-between p-8 text-center">
      <div className="flex-1 flex flex-col items-center justify-center space-y-12 max-w-sm">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Forgotten Promises</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            A quiet space to remember what was promised, and bring clarity to your relationships.
          </p>
        </div>

        <div className="space-y-8 text-left w-full">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Privacy First</h3>
              <p className="text-sm text-gray-500">All data stays on this device. No cloud, no tracking, no sharing.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-xl">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Gentle Reminders</h3>
              <p className="text-sm text-gray-500">Record commitments and get reminded when it's time to check in.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-xl">
              <Heart className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h3 className="font-semibold">Emotional Clarity</h3>
              <p className="text-sm text-gray-500">Track outcomes without judgment. For your personal peace of mind.</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="w-full max-w-xs py-4 bg-black dark:bg-white dark:text-black text-white rounded-2xl font-semibold flex items-center justify-center space-x-2 active:scale-95 transition-transform"
      >
        <span>Get Started</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Onboarding;
