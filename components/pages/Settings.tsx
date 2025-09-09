import React from 'react';

interface SettingsProps {
  isBiometricAuthEnabled: boolean;
  onToggleBiometricAuth: (enabled: boolean) => void;
}

export const Settings: React.FC<SettingsProps> = ({ isBiometricAuthEnabled, onToggleBiometricAuth }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Settings</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">Security</h2>
        
        <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
          <div>
            <h3 className="font-semibold text-white">Biometric Authentication</h3>
            <p className="text-sm text-gray-400">Require Face ID or Touch ID for sensitive actions like disarming the system.</p>
          </div>
          <label htmlFor="biometric-toggle" className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                id="biometric-toggle" 
                className="sr-only" 
                checked={isBiometricAuthEnabled} 
                onChange={(e) => onToggleBiometricAuth(e.target.checked)} 
              />
              <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
              <div className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition-transform ${isBiometricAuthEnabled ? 'transform translate-x-6 bg-brand-blue' : 'bg-gray-400'}`}></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};