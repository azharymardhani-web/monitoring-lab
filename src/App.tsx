import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { NotificationDrawer } from './components/NotificationDrawer';
import { DeviceDetailModal } from './components/DeviceDetailModal';
import { LoginModal } from './components/LoginModal';
import { LoginPage } from './components/LoginPage';

import { Dashboard } from './pages/Dashboard';
import { DeviceMap } from './pages/DeviceMap';
import { Monitoring } from './pages/Monitoring';
import { Inventory } from './pages/Inventory';
import { Tickets } from './pages/Tickets';
import { Maintenance } from './pages/Maintenance';
import { Notifications } from './pages/Notifications';
import { Reports } from './pages/Reports';
import { Users } from './pages/Users';
import { Settings } from './pages/Settings';

import { StorageService } from './services/storage';
import { Device, DeviceMetric, FaultTicket, MaintenanceRecord, SystemNotification, SystemUser, SystemSettings } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentUser, setCurrentUser] = useState<SystemUser>(StorageService.getCurrentUser());
  const [users, setUsers] = useState<SystemUser[]>(StorageService.getUsers());
  const [devices, setDevices] = useState<Device[]>(StorageService.getDevices());
  const [metrics, setMetrics] = useState<Record<string, DeviceMetric>>(StorageService.getMetrics());
  const [tickets, setTickets] = useState<FaultTicket[]>(StorageService.getTickets());
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>(StorageService.getMaintenance());
  const [notifications, setNotifications] = useState<SystemNotification[]>(StorageService.getNotifications());
  const [settings, setSettings] = useState<SystemSettings>(StorageService.getSettings());

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Live telemetry simulator
  useEffect(() => {
    const interval = setInterval(() => {
      const currentMetrics = StorageService.getMetrics();
      const now = new Date().toISOString();
      const updatedMetrics = { ...currentMetrics };

      devices.forEach(d => {
        if (d.connectionStatus === 'online') {
          const prev = updatedMetrics[d.id] || {
            deviceId: d.id,
            timestamp: now,
            cpuUsage: 25,
            memoryUsage: 45,
            diskUsage: 30,
            diskFreeGB: 180,
            agentVersion: 'v2.4.1',
            lastHeartbeat: now,
          };
          updatedMetrics[d.id] = {
            ...prev,
            timestamp: now,
            cpuUsage: Math.min(98, Math.max(10, prev.cpuUsage + (Math.floor(Math.random() * 11) - 5))),
            memoryUsage: Math.min(95, Math.max(20, prev.memoryUsage + (Math.floor(Math.random() * 7) - 3))),
            lastHeartbeat: now,
          };
        }
      });

      StorageService.saveMetrics(updatedMetrics);
      setMetrics(updatedMetrics);
    }, 10000);

    return () => clearInterval(interval);
  }, [devices]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSwitchUser = (user: SystemUser) => {
    setCurrentUser(user);
    StorageService.saveCurrentUser(user);
  };

  const handleResetData = () => {
    StorageService.resetAllData();
  };

  // Device handlers
  const handleAddDevice = (device: Device) => {
    const updated = [device, ...devices];
    setDevices(updated);
    StorageService.saveDevices(updated);
  };

  const handleUpdateDevice = (device: Device) => {
    const updated = devices.map(d => d.id === device.id ? device : d);
    setDevices(updated);
    StorageService.saveDevices(updated);
    if (selectedDevice?.id === device.id) {
      setSelectedDevice(device);
    }
  };

  const handleDeleteDevice = (id: string) => {
    const updated = devices.filter(d => d.id !== id);
    setDevices(updated);
    StorageService.saveDevices(updated);
  };

  // Ticket handlers
  const handleAddTicket = (ticket: FaultTicket) => {
    const updated = [ticket, ...tickets];
    setTickets(updated);
    StorageService.saveTickets(updated);
  };

  const handleUpdateTicket = (ticket: FaultTicket) => {
    const updated = tickets.map(t => t.id === ticket.id ? ticket : t);
    setTickets(updated);
    StorageService.saveTickets(updated);
  };

  // Maintenance handlers
  const handleAddMaintenance = (record: MaintenanceRecord) => {
    const updated = [record, ...maintenance];
    setMaintenance(updated);
    StorageService.saveMaintenance(updated);
  };

  const handleUpdateMaintenance = (record: MaintenanceRecord) => {
    const updated = maintenance.map(m => m.id === record.id ? record : m);
    setMaintenance(updated);
    StorageService.saveMaintenance(updated);
  };

  // Notification handlers
  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  const handleToggleRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: !n.read } : n);
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  // User handlers
  const handleAddUser = (user: SystemUser) => {
    const updated = [...users, user];
    setUsers(updated);
    StorageService.saveUsers(updated);
  };

  const handleUpdateUser = (user: SystemUser) => {
    const updated = users.map(u => u.id === user.id ? user : u);
    setUsers(updated);
    StorageService.saveUsers(updated);
    if (currentUser.id === user.id) {
      setCurrentUser(user);
      StorageService.saveCurrentUser(user);
    }
  };

  const handleDeleteUser = (id: string) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    StorageService.saveUsers(updated);
  };

  // Settings handler
  const handleSaveSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  if (!isLoggedIn) {
    return (
      <LoginPage
        users={users}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          StorageService.saveCurrentUser(user);
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden select-none">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          currentUser={currentUser}
          users={users}
          onSwitchUser={handleSwitchUser}
          unreadCount={unreadCount}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          onResetData={handleResetData}
          onOpenLogin={() => setIsLoginOpen(true)}
          onLogout={() => setIsLoggedIn(false)}
        />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <Dashboard
              devices={devices}
              metrics={metrics}
              tickets={tickets}
              notifications={notifications}
              onNavigate={setActiveTab}
              onSelectDevice={setSelectedDevice}
            />
          )}

          {activeTab === 'map' && (
            <DeviceMap
              devices={devices}
              metrics={metrics}
              onSelectDevice={setSelectedDevice}
            />
          )}

          {activeTab === 'monitoring' && (
            <Monitoring
              devices={devices}
              metrics={metrics}
              onSelectDevice={setSelectedDevice}
              onRefreshMetrics={() => {}}
            />
          )}

          {activeTab === 'inventory' && (
            <Inventory
              devices={devices}
              onAddDevice={handleAddDevice}
              onUpdateDevice={handleUpdateDevice}
              onDeleteDevice={handleDeleteDevice}
              onSelectDevice={setSelectedDevice}
            />
          )}

          {activeTab === 'tickets' && (
            <Tickets
              tickets={tickets}
              devices={devices}
              onAddTicket={handleAddTicket}
              onUpdateTicket={handleUpdateTicket}
            />
          )}

          {activeTab === 'maintenance' && (
            <Maintenance
              maintenance={maintenance}
              onAddMaintenance={handleAddMaintenance}
              onUpdateMaintenance={handleUpdateMaintenance}
            />
          )}

          {activeTab === 'notifications' && (
            <Notifications
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllRead}
              onToggleRead={handleToggleRead}
            />
          )}

          {activeTab === 'reports' && (
            <Reports
              devices={devices}
              tickets={tickets}
              maintenance={maintenance}
            />
          )}

          {activeTab === 'users' && (
            <Users
              users={users}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'settings' && (
            <Settings
              settings={settings}
              onSaveSettings={handleSaveSettings}
              currentUser={currentUser}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllRead}
        onToggleRead={handleToggleRead}
      />

      {/* Device Detail Modal */}
      {selectedDevice && (
        <DeviceDetailModal
          device={selectedDevice}
          metric={metrics[selectedDevice.id]}
          tickets={tickets}
          maintenance={maintenance}
          onClose={() => setSelectedDevice(null)}
          onUpdateDevice={handleUpdateDevice}
        />
      )}

      {/* Login / Password Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        users={users}
        currentUser={currentUser}
        onLogin={(user) => {
          setCurrentUser(user);
          StorageService.saveCurrentUser(user);
        }}
      />
    </div>
  );
}
