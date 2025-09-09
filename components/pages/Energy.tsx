import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { EnergyData } from '../../types';

interface EnergyProps {
  energyData: EnergyData[];
  requireBiometricAuth: (action: () => void) => void;
}

export const Energy: React.FC<EnergyProps> = ({ energyData, requireBiometricAuth }) => {
  const totalConsumption = energyData.reduce((sum, item) => sum + item.consumption, 0);
  const avgConsumption = totalConsumption / energyData.length;
  const estimatedCost = totalConsumption * 0.15; // Assuming $0.15 per kWh

  const handleViewReport = () => {
    alert("Accessing detailed energy report... (This is a demo feature)");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Energy Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-5 rounded-lg shadow-lg text-center">
            <h3 className="text-gray-400 font-semibold">Total Consumption</h3>
            <p className="text-4xl font-bold text-white">{totalConsumption.toFixed(1)} <span className="text-lg">kWh</span></p>
        </div>
        <div className="bg-gray-800 p-5 rounded-lg shadow-lg text-center">
            <h3 className="text-gray-400 font-semibold">Average Daily</h3>
            <p className="text-4xl font-bold text-white">{avgConsumption.toFixed(1)} <span className="text-lg">kWh</span></p>
        </div>
        <div className="bg-gray-800 p-5 rounded-lg shadow-lg text-center">
            <h3 className="text-gray-400 font-semibold">Estimated Cost</h3>
            <p className="text-4xl font-bold text-white">${estimatedCost.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Daily Consumption (kWh)</h2>
          <button 
            onClick={() => requireBiometricAuth(handleViewReport)}
            className="bg-brand-blue hover:bg-brand-blue-light text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            View Detailed Report
          </button>
        </div>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <BarChart data={energyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d"/>
              <XAxis dataKey="date" tick={{ fill: '#a0a0a0' }} stroke="#3c3c3c" tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { day: 'numeric' })}/>
              <YAxis tick={{ fill: '#a0a0a0' }} stroke="#3c3c3c"/>
              <Tooltip cursor={{fill: 'rgba(59, 130, 246, 0.1)'}} contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #3c3c3c' }} />
              <Legend wrapperStyle={{ color: '#e0e0e0' }}/>
              <Bar dataKey="consumption" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};