import { Device, DeviceMetric, FaultTicket, MaintenanceRecord, SystemNotification, SystemUser, SystemSettings } from '../types';
import { generateSeedDevices, initialTickets, initialMaintenance, initialNotifications, initialUsers, initialSettings } from '../data/seedData';

const STORAGE_KEYS = {
  DEVICES: 'lab_pc_devices_v1',
  METRICS: 'lab_pc_metrics_v1',
  TICKETS: 'lab_pc_tickets_v1',
  MAINTENANCE: 'lab_pc_maintenance_v1',
  NOTIFICATIONS: 'lab_pc_notifications_v1',
  USERS: 'lab_pc_users_v1',
  SETTINGS: 'lab_pc_settings_v1',
  CURRENT_USER: 'lab_pc_current_user_v1',
};

export const StorageService = {
  getDevices(): Device[] {
    const data = localStorage.getItem(STORAGE_KEYS.DEVICES);
    if (!data) {
      const seed = generateSeedDevices();
      localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(seed));
      return seed;
    }
    try {
      return JSON.parse(data);
    } catch {
      return generateSeedDevices();
    }
  },

  saveDevices(devices: Device[]) {
    localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(devices));
  },

  getMetrics(): Record<string, DeviceMetric> {
    const data = localStorage.getItem(STORAGE_KEYS.METRICS);
    if (!data) {
      // Generate initial metrics for online devices
      const devices = this.getDevices();
      const metrics: Record<string, DeviceMetric> = {};
      const now = new Date().toISOString();
      devices.forEach(d => {
        if (d.connectionStatus === 'online') {
          metrics[d.id] = {
            deviceId: d.id,
            timestamp: now,
            cpuUsage: Math.floor(Math.random() * 40) + 15,
            memoryUsage: Math.floor(Math.random() * 50) + 30,
            diskUsage: Math.floor(Math.random() * 30) + 25,
            diskFreeGB: 180,
            temperature: Math.floor(Math.random() * 15) + 40,
            uptimeSeconds: Math.floor(Math.random() * 86400) + 3600,
            agentVersion: 'v2.4.1',
            lastHeartbeat: now,
          };
        }
      });
      localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics));
      return metrics;
    }
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  },

  saveMetrics(metrics: Record<string, DeviceMetric>) {
    localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics));
  },

  getTickets(): FaultTicket[] {
    const data = localStorage.getItem(STORAGE_KEYS.TICKETS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(initialTickets));
      return initialTickets;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialTickets;
    }
  },

  saveTickets(tickets: FaultTicket[]) {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  },

  getMaintenance(): MaintenanceRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.MAINTENANCE);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(initialMaintenance));
      return initialMaintenance;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialMaintenance;
    }
  },

  saveMaintenance(records: MaintenanceRecord[]) {
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(records));
  },

  getNotifications(): SystemNotification[] {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
      return initialNotifications;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialNotifications;
    }
  },

  saveNotifications(notifs: SystemNotification[]) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  getUsers(): SystemUser[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
      return initialUsers;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialUsers;
    }
  },

  saveUsers(users: SystemUser[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUser(): SystemUser {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!data) {
      const defaultUser = initialUsers[3]; // Super Admin
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
      return defaultUser;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialUsers[3];
    }
  },

  saveCurrentUser(user: SystemUser) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  getSettings(): SystemSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSettings));
      return initialSettings;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialSettings;
    }
  },

  saveSettings(settings: SystemSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  resetAllData() {
    localStorage.clear();
    window.location.reload();
  }
};
