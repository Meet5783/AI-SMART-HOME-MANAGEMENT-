import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/pages/Dashboard';
import { Devices } from './components/pages/Devices';
import { Energy } from './components/pages/Energy';
import { Security } from './components/pages/Security';
import { Automation } from './components/pages/Automation';
import { Settings } from './components/pages/Settings';
import { NexaAiChatbot } from './components/AiChatbot';
import { BiometricAuthModal } from './components/BiometricAuthModal';
import type { Page, Device, EnergyData, SecurityEvent, AutomationRule } from './types';
import { mockDevices, mockEnergyData, mockSecurityEvents } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(mockSecurityEvents);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [isArmed, setIsArmed] = useState(false);
  
  // Biometric Auth State
  const [isBiometricAuthEnabled, setIsBiometricAuthEnabled] = useState(false);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [onBiometricSuccess, setOnBiometricSuccess] = useState<(() => void) | null>(null);

  const toggleDevice = (id: string) => {
    setDevices(prevDevices =>
      prevDevices.map(device => {
        if (device.id === id && (device.type === 'light' || device.type === 'smart_plug')) {
          const newStatus = device.status === 'on' ? 'off' : 'on';
          return { ...device, status: newStatus };
        }
        return device;
      })
    );
  };
  
  const setDeviceValue = (id: string, value: number) => {
    setDevices(prevDevices =>
      prevDevices.map(device => {
        if (device.id === id && (device.type === 'thermostat' || device.type === 'light')) {
            if ('value' in device) {
                 return { ...device, value };
            }
        }
        return device;
      })
    );
  };

  const requireBiometricAuth = (action: () => void) => {
    if (isBiometricAuthEnabled) {
      setOnBiometricSuccess(() => action);
      setIsBiometricModalOpen(true);
    } else {
      action();
    }
  };

  const energyData: EnergyData[] = useMemo(() => mockEnergyData, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard devices={devices} energyData={energyData} securityEvents={securityEvents} isArmed={isArmed} onToggleDevice={toggleDevice} onSetDeviceValue={setDeviceValue}/>;
      case 'devices':
        return <Devices devices={devices} onToggleDevice={toggleDevice} onSetDeviceValue={setDeviceValue} />;
      case 'energy':
        return <Energy energyData={energyData} requireBiometricAuth={requireBiometricAuth} />;
      case 'security':
        return <Security securityEvents={securityEvents} isArmed={isArmed} onArmToggle={setIsArmed} onClearEvents={() => setSecurityEvents([])} requireBiometricAuth={requireBiometricAuth} />;
      case 'automation':
        return <Automation automationRules={automationRules} setAutomationRules={setAutomationRules} />;
      case 'settings':
        return <Settings isBiometricAuthEnabled={isBiometricAuthEnabled} onToggleBiometricAuth={setIsBiometricAuthEnabled} />;
      default:
        return <Dashboard devices={devices} energyData={energyData} securityEvents={securityEvents} isArmed={isArmed} onToggleDevice={toggleDevice} onSetDeviceValue={setDeviceValue}/>;
    }
  };

  const handleBiometricSuccess = () => {
    if (onBiometricSuccess) {
      onBiometricSuccess();
    }
    setIsBiometricModalOpen(false);
    setOnBiometricSuccess(null);
  };

  return (
    <div className="flex h-screen bg-transparent text-gray-200 font-sans">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        {renderPage()}
      </main>
      <NexaAiChatbot devices={devices} />
      <BiometricAuthModal 
        isOpen={isBiometricModalOpen}
        onClose={() => setIsBiometricModalOpen(false)}
        onSuccess={handleBiometricSuccess}
      />
    </div>
  );
};

export default App;