
import type { Device, EnergyData, SecurityEvent } from './types';

export const mockDevices: Device[] = [
  { id: 'living-room-light', name: 'Living Room Light', room: 'Living Room', type: 'light', status: 'off', value: 80 },
  { id: 'kitchen-light', name: 'Kitchen Light', room: 'Kitchen', type: 'light', status: 'on', value: 100 },
  { id: 'main-thermostat', name: 'Main Thermostat', room: 'Living Room', type: 'thermostat', status: 'on', value: 21 },
  { id: 'bedroom-plug', name: 'Bedroom Lamp', room: 'Bedroom', type: 'smart_plug', status: 'off' },
  { id: 'front-door-camera', name: 'Front Door Cam', room: 'Entrance', type: 'camera', status: 'online' },
  { id: 'backyard-camera', name: 'Backyard Cam', room: 'Exterior', type: 'camera', status: 'offline' },
  { id: 'office-desk-light', name: 'Office Desk Light', room: 'Office', type: 'light', status: 'on', value: 60 },
  { id: 'master-bedroom-thermostat', name: 'Master Bedroom Thermostat', room: 'Bedroom', type: 'thermostat', status: 'on', value: 22 },
];

export const mockEnergyData: EnergyData[] = [
  { date: '2023-10-01', consumption: 15.2 },
  { date: '2023-10-02', consumption: 16.1 },
  { date: '2023-10-03', consumption: 14.8 },
  { date: '2023-10-04', consumption: 17.5 },
  { date: '2023-10-05', consumption: 18.0 },
  { date: '2023-10-06', consumption: 16.5 },
  { date: '2023-10-07', consumption: 19.3 },
  { date: '2023-10-08', consumption: 18.5 },
  { date: '2023-10-09', consumption: 17.2 },
  { date: '2023-10-10', consumption: 16.8 },
  { date: '2023-10-11', consumption: 20.1 },
  { date: '2023-10-12', consumption: 19.5 },
  { date: '2023-10-13', consumption: 21.0 },
  { date: '2023-10-14', consumption: 20.2 },
];

export const mockSecurityEvents: SecurityEvent[] = [
  { id: 'evt1', type: 'motion_detected', location: 'Living Room', timestamp: '2023-10-14T22:30:00Z' },
  { id: 'evt2', type: 'system_armed', location: 'System', timestamp: '2023-10-14T22:00:00Z' },
  { id: 'evt3', type: 'door_opened', location: 'Front Door', timestamp: '2023-10-14T18:15:00Z' },
  { id: 'evt4', type: 'system_disarmed', location: 'System', timestamp: '2023-10-14T18:14:00Z' },
  { id: 'evt5', type: 'motion_detected', location: 'Backyard', timestamp: '2023-10-14T03:45:00Z' },
];
