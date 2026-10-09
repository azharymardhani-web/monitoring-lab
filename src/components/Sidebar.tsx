import React from 'react';
import { 
  LayoutDashboard, 
  Grid2X2, 
  Activity, 
  Monitor, 
  Wrench, 
  CalendarCheck, 
  Bell, 
  FileText, 
  Users, 
  Settings as SettingsIcon,
  Server,
  ShieldCheck
} from 'lucide-react';
import { SystemUser } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: SystemUser;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, currentUser }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Peta Posisi PC', icon: Grid2X2 },
    { id: 'monitoring', label: 'Monitoring PC', icon: Activity },
    { id: 'inventory', label: 'Inventaris Perangkat', icon: Monitor },
    { id: 'tickets', label: 'Laporan Kerusakan', icon: Wrench, badge: 'Tiket' },
    { id: 'maintenance', label: 'Pemeliharaan', icon: CalendarCheck },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'reports', label: 'Laporan & Ekspor', icon: FileText },
    { id: 'users', label: 'Pengguna & Akses', icon: Users, restricted: 'Super Admin' },
    { id: 'settings', label: 'Pengaturan Sistem', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/50">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
          <Server className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-white text-sm tracking-wide">LAB PC MONITOR</h1>
          <p className="text-xs text-blue-400 font-medium">MTs Negeri 14 Jakarta</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
          Menu Utama
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isRestricted = item.restricted && currentUser.role !== item.restricted && currentUser.role !== 'Super Admin';

          if (isRestricted) return null;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  isActive ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Role Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 font-bold text-xs border border-slate-700">
            {currentUser.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
            <div className="flex items-center space-x-1 text-[11px] text-blue-400">
              <ShieldCheck className="w-3 h-3" />
              <span className="truncate">{currentUser.role}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
