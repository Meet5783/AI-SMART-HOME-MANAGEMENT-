import React from 'react';
import { FingerprintIcon } from './icons';

interface BiometricAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BiometricAuthModal: React.FC<BiometricAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl p-8 m-4 max-w-sm w-full text-center border border-gray-700 transform transition-all duration-300 scale-95 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-6">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-700 border-2 border-brand-blue">
                <FingerprintIcon className="w-12 h-12 text-brand-blue" />
            </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
        <p className="text-gray-400 mb-8">
          Please confirm your identity to proceed with this action.
        </p>

        <div className="space-y-4">
            <button
                onClick={onSuccess}
                className="w-full bg-brand-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-blue-light transition-colors duration-200"
            >
                Authenticate
            </button>
            <button
                onClick={onClose}
                className="w-full bg-gray-700 text-gray-300 font-bold py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
                Cancel
            </button>
        </div>
      </div>
      <style>{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};