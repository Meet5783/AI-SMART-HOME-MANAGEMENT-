
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Device, EnergyData, SecurityEvent } from '../../types';
import { DeviceCard } from '../DeviceCard';

interface DashboardProps {
  devices: Device[];
  energyData: EnergyData[];
  securityEvents: SecurityEvent[];
  isArmed: boolean;
  onToggleDevice: (id: string) => void;
  onSetDeviceValue: (id: string, value: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ devices, energyData, securityEvents, isArmed, onToggleDevice, onSetDeviceValue }) => {
    const favoriteDevices = devices.slice(0, 4);
    const onlineDevices = devices.filter(d => d.status !== 'offline').length;
    const latestSecurityEvent = securityEvents[0];
    const totalEnergyToday = energyData.length > 0 ? energyData[energyData.length - 1].consumption : 0;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                    <h3 className="text-gray-400 font-semibold">Online Devices</h3>
                    <p className="text-4xl font-bold text-white">{onlineDevices}</p>
                </div>
                <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                    <h3 className="text-gray-400 font-semibold">Security Status</h3>
                    <p className={`text-4xl font-bold ${isArmed ? 'text-red-500' : 'text-green-500'}`}>{isArmed ? 'Armed' : 'Disarmed'}</p>
                </div>
                <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                    <h3 className="text-gray-400 font-semibold">Energy Today</h3>
                    <p className="text-4xl font-bold text-white">{totalEnergyToday} <span className="text-lg">kWh</span></p>
                </div>
                <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                    <h3 className="text-gray-400 font-semibold">Last Event</h3>
                    <p className="text-lg font-bold text-white capitalize">{latestSecurityEvent.type.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-400">{latestSecurityEvent.location}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-800 p-5 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-white">Favorites</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {favoriteDevices.map(device => (
                            <DeviceCard key={device.id} device={device} onToggle={onToggleDevice} onSetValue={onSetDeviceValue} />
                        ))}
                    </div>
                </div>

                <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-white">Energy Consumption (Last 7 Days)</h2>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <AreaChart data={energyData.slice(-7)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" tick={{ fill: '#a0a0a0' }} stroke="#3c3c3c" tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}/>
                                <YAxis tick={{ fill: '#a0a0a0' }} stroke="#3c3c3c" />
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #3c3c3c' }} />
                                <Area type="monotone" dataKey="consumption" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUv)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
