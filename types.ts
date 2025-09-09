export type Page = 'dashboard' | 'devices' | 'energy' | 'security' | 'automation' | 'settings';

export interface BaseDevice {
  id: string;
  name: string;
  room: string;
  status: 'on' | 'off' | 'online' | 'offline';
}

export interface LightDevice extends BaseDevice {
  type: 'light';
  value: number; // Brightness percentage
}

export interface ThermostatDevice extends BaseDevice {
  type: 'thermostat';
  value: number; // Temperature in Celsius
}

export interface SmartPlugDevice extends BaseDevice {
  type: 'smart_plug';
}

export interface SecurityCameraDevice extends BaseDevice {
    type: 'camera';
    status: 'online' | 'offline';
}

export type Device = LightDevice | ThermostatDevice | SmartPlugDevice | SecurityCameraDevice;

export interface EnergyData {
  date: string;
  consumption: number; // in kWh
}

export interface SecurityEvent {
  id: string;
  type: 'motion_detected' | 'door_opened' | 'system_armed' | 'system_disarmed';
  location: string;
  timestamp: string;
}

export interface AutomationRule {
    id: string;
    naturalLanguage: string;
    trigger: {
        type: string;
        value: string;
        condition?: string;
    };
    action: {
        deviceId: string;
        command: string;
    };
}

export interface ChatMessage {
    id:string;
    sender: 'user' | 'ai';
    text: string;
    isLoading?: boolean;
}