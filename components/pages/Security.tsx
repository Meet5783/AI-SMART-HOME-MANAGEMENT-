import React from 'react';
import type { SecurityEvent } from '../../types';
import { LockClosedIcon, BellIcon, CameraIcon, RefreshIcon } from '../icons';

interface SecurityProps {
  securityEvents: SecurityEvent[];
  isArmed: boolean;
  onArmToggle: (isArmed: boolean) => void;
  onClearEvents: () => void;
  requireBiometricAuth: (action: () => void) => void;
}

const EventIcon: React.FC<{type: SecurityEvent['type']}> = ({type}) => {
    switch (type) {
        case 'motion_detected': return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
        case 'door_opened': return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v3m-6 2h12a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z" /></svg>;
        case 'system_armed': return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
        case 'system_disarmed': return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
        default: return null;
    }
}

export const Security: React.FC<SecurityProps> = ({ securityEvents, isArmed, onArmToggle, onClearEvents, requireBiometricAuth }) => {
  const handleActionClick = (action: string) => {
    alert(`${action} activated! (This is a demo feature)`);
  };

  const handleArmToggle = () => {
    if (isArmed) {
        // Disarming is a sensitive action
        requireBiometricAuth(() => onArmToggle(false));
    } else {
        // Arming is less sensitive
        onArmToggle(true);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Security System</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-xl font-semibold mb-4 text-white">System Status</h2>
                <p className={`text-5xl font-bold mb-6 ${isArmed ? 'text-red-500' : 'text-green-500'}`}>{isArmed ? 'ARMED' : 'DISARMED'}</p>
                <button 
                    onClick={handleArmToggle}
                    className={`w-full py-3 text-lg font-bold rounded-lg transition-all duration-200 ${isArmed ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
                >
                    {isArmed ? 'Disarm System' : 'Arm System'}
                </button>
            </div>
             <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-white">Quick Actions</h2>
                <div className="space-y-3">
                    <button onClick={() => handleActionClick('Lock All Doors')} className="w-full flex items-center justify-center gap-3 bg-gray-700 hover:bg-brand-blue text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200">
                        <LockClosedIcon className="w-6 h-6" />
                        <span>Lock All Doors</span>
                    </button>
                    <button onClick={() => handleActionClick('View All Cameras')} className="w-full flex items-center justify-center gap-3 bg-gray-700 hover:bg-brand-blue text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200">
                        <CameraIcon className="w-6 h-6" />
                        <span>View All Cameras</span>
                    </button>
                    <button onClick={() => handleActionClick('Panic Alarm')} className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200">
                        <BellIcon className="w-6 h-6" />
                        <span>Panic Alarm</span>
                    </button>
                </div>
            </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
             <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-white">Camera Feeds</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Online Camera */}
                    <div className="bg-gray-900 aspect-video rounded-md flex flex-col justify-between p-2 relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <p className="text-gray-300 font-semibold">Front Door Cam</p>
                            <span className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                LIVE
                            </span>
                        </div>
                        <div className="flex items-center justify-center flex-grow">
                             <CameraIcon className="w-16 h-16 text-gray-600" />
                        </div>
                    </div>
                    {/* Offline Camera */}
                    <div className="bg-gray-900 aspect-video rounded-md flex flex-col items-center justify-center relative border-2 border-dashed border-gray-700">
                        <p className="text-gray-400 font-semibold mb-2">Backyard Cam</p>
                        <p className="text-sm text-red-500 font-bold mb-4">OFFLINE</p>
                        <button onClick={() => handleActionClick('Retry Connection for Backyard Cam')} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                            <RefreshIcon className="w-4 h-4" />
                            <span>Retry Connection</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Recent Events</h2>
                    <button onClick={onClearEvents} className="text-sm text-gray-400 hover:text-white hover:underline transition-colors">
                        Clear Log
                    </button>
                </div>
                <ul className="space-y-3 max-h-80 overflow-y-auto">
                    {securityEvents.length > 0 ? securityEvents.map(event => (
                        <li key={event.id} className="flex items-center p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                            <div className="mr-4 flex-shrink-0"><EventIcon type={event.type} /></div>
                            <div className="flex-grow">
                                <p className="font-semibold text-white capitalize">{event.type.replace(/_/g, ' ')}</p>
                                <p className="text-sm text-gray-400">{event.location}</p>
                            </div>
                            <p className="text-sm text-gray-400">{new Date(event.timestamp).toLocaleTimeString()}</p>
                        </li>
                    )) : (
                        <p className="text-center text-gray-500 py-4">No security events to display.</p>
                    )}
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};