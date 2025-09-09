import React from 'react';
import type { Page } from '../types';
import { DashboardIcon, DeviceIcon, EnergyIcon, SecurityIcon, AutomationIcon, SettingsIcon } from './icons';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavItem: React.FC<{
  page: Page;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  Icon: React.ElementType;
  label: string;
}> = ({ page, currentPage, setCurrentPage, Icon, label }) => {
  const isActive = currentPage === page;
  return (
    <li
      onClick={() => setCurrentPage(page)}
      className={`flex items-center p-3 my-2 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive ? 'bg-brand-blue text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      <Icon className="w-6 h-6 mr-3" />
      <span className="font-medium">{label}</span>
    </li>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <aside className="w-64 bg-gray-800 p-4 flex flex-col h-full shadow-2xl">
      <div className="flex items-center mb-8">
        <div className="p-2 bg-brand-blue rounded-lg mr-3">
          <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white">NexusHome AI</h1>
      </div>
      <nav>
        <ul>
          <NavItem page="dashboard" currentPage={currentPage} setCurrentPage={setCurrentPage} Icon={DashboardIcon} label="Dashboard" />
          <NavItem page="devices" currentPage={currentPage} setCurrentPage={setCurrentPage} Icon={DeviceIcon} label="Devices" />
          <NavItem page="energy" currentPage={currentPage} setCurrentPage={setCurrentPage} Icon={EnergyIcon} label="Energy" />
          <NavItem page="security" currentPage={currentPage} setCurrentPage={setCurrentPage} Icon={SecurityIcon} label="Security" />
          <NavItem page="automation" currentPage={currentPage} setCurrentPage={setCurrentPage} Icon={AutomationIcon} label="Automation" />
          <NavItem page="settings" currentPage={currentPage} setCurrentPage={setCurrentPage} Icon={SettingsIcon} label="Settings" />
        </ul>
      </nav>
      <div className="mt-auto p-4 bg-gray-700 rounded-lg text-center">
        <p className="text-sm text-gray-400">Welcome back!</p>
        <p className="text-white font-semibold">John Doe</p>
      </div>
    </aside>
  );
};