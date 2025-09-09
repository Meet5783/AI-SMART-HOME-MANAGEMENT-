
import React from 'react';
import type { Device } from '../types';
import { LightBulbIcon, ThermostatIcon, SmartPlugIcon, CameraIcon } from './icons';

interface DeviceCardProps {
  device: Device;
  onToggle: (id: string) => void;
  onSetValue: (id: string, value: number) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onToggle, onSetValue }) => {
    const isOn = device.status === 'on' || device.status === 'online';
    const value = 'value' in device ? device.value : 0;

    const colorClass = isOn ? (device.type === 'light' && value > 0 ? 'text-yellow-400' : 'text-brand-blue') : 'text-gray-500';

    const iconMap = {
        light: <LightBulbIcon className={`w-10 h-10 ${colorClass}`} />,
        thermostat: <ThermostatIcon className={`w-10 h-10 ${colorClass}`} />,
        smart_plug: <SmartPlugIcon className={`w-10 h-10 ${colorClass}`} />,
        camera: <CameraIcon className={`w-10 h-10 ${colorClass}`} />,
    };

    const handleToggle = () => {
        if (device.type === 'light' || device.type === 'smart_plug') {
            onToggle(device.id);
        }
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSetValue(device.id, parseInt(e.target.value, 10));
    };

    const renderControls = () => {
        switch (device.type) {
            case 'light':
            case 'smart_plug':
                return (
                    <div className="flex flex-col items-center justify-center w-full space-y-3 mt-4">
                        <span className={`text-lg font-medium ${isOn ? 'text-white' : 'text-gray-400'}`}>
                           {device.status.toUpperCase()}
                        </span>
                        <label htmlFor={`toggle-${device.id}`} className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input type="checkbox" id={`toggle-${device.id}`} className="sr-only" checked={isOn} onChange={handleToggle} />
                                <div className={`block w-16 h-9 rounded-full transition-colors ${isOn ? 'bg-brand-blue' : 'bg-gray-600'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-7 h-7 rounded-full transition-transform ${isOn ? 'transform translate-x-7' : ''}`}></div>
                            </div>
                        </label>
                        {device.type === 'light' && 'value' in device && isOn && (
                            <div className="mt-4 w-full">
                                <label className="text-xs text-gray-400 text-center block mb-1">Brightness</label>
                                <input type="range" min="0" max="100" value={device.value} onChange={handleSliderChange} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-brand-blue" />
                            </div>
                        )}
                    </div>
                );
            case 'thermostat':
                return (
                    <div className="text-center w-full mt-4">
                        <p className="text-5xl font-bold text-white my-2">{device.value}°C</p>
                        <input type="range" min="15" max="30" value={device.value} onChange={handleSliderChange} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-brand-blue mt-2" />
                    </div>
                );
            case 'camera':
                return (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <span className={`w-3 h-3 rounded-full ${isOn ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                        <p className={`text-lg font-medium ${isOn ? 'text-green-500' : 'text-red-500'}`}>{device.status.toUpperCase()}</p>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className={`p-4 rounded-lg shadow-md transition-all duration-300 flex flex-col min-h-[200px] ${isOn ? 'bg-gray-700' : 'bg-gray-800'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-white text-lg">{device.name}</p>
                    <p className="text-sm text-gray-400">{device.room}</p>
                </div>
                {iconMap[device.type]}
            </div>
            <div className="flex-grow flex items-center">
              {renderControls()}
            </div>
        </div>
    );
};