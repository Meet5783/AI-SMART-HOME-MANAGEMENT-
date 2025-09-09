
import React, { useMemo } from 'react';
import type { Device } from '../../types';
import { DeviceCard } from '../DeviceCard';

interface DevicesProps {
  devices: Device[];
  onToggleDevice: (id: string) => void;
  onSetDeviceValue: (id: string, value: number) => void;
}

export const Devices: React.FC<DevicesProps> = ({ devices, onToggleDevice, onSetDeviceValue }) => {
  const devicesByRoom = useMemo(() => {
    return devices.reduce<Record<string, Device[]>>((acc, device) => {
      (acc[device.room] = acc[device.room] || []).push(device);
      return acc;
    }, {});
  }, [devices]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">All Devices</h1>
      {Object.entries(devicesByRoom).map(([room, roomDevices]) => (
        <div key={room}>
          <h2 className="text-2xl font-semibold text-brand-blue mb-4 pb-2 border-b-2 border-gray-700">{room}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {roomDevices.map(device => (
              <DeviceCard 
                key={device.id} 
                device={device} 
                onToggle={onToggleDevice} 
                onSetValue={onSetDeviceValue}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
